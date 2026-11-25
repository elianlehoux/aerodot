/**
 * Zoom y desplazamiento de la cabina. Solo cambia el `transform` del contenido, así el navegador
 * no recalcula el diseño. Un dedo: toque o arrastre (de un punto, si `onDragStart` lo toma, o de la imagen).
 * Dos dedos o Ctrl con la rueda (pellizco del trackpad): zoom. La rueda sola desplaza. Las posiciones que reciben los handlers son px relativos al escenario.
 */
import { classifyGesture } from './geometry.js';

const MAX_ZOOM = 6;
const PAD = 16;

export function createViewport(stage, content, size, handlers) {
  const { onTap = () => {}, onDragStart = () => false, onDragMove = () => {}, onDragEnd = () => {}, onChange = () => {} } = handlers;
  let scale = 1;
  let tx = 0;
  let ty = 0;
  let fitScale = 1;
  let atFit = true;
  // Alto tapado abajo (la hoja del paso en el teléfono): la foto se acomoda en lo que queda visible.
  let inset = 0;
  const pointers = new Map();
  let gesture = null;

  content.style.width = `${size.width}px`;
  content.style.height = `${size.height}px`;
  content.style.transformOrigin = '0 0';

  const view = () => ({ scale, tx, ty, width: size.width, height: size.height });
  const local = (event) => {
    const rect = stage.getBoundingClientRect();
    return { px: event.clientX - rect.left, py: event.clientY - rect.top };
  };

  function clamp() {
    const w = stage.clientWidth;
    const h = stage.clientHeight - inset;
    const cw = size.width * scale;
    const ch = size.height * scale;
    tx = cw + PAD * 2 <= w ? (w - cw) / 2 : Math.min(PAD, Math.max(w - cw - PAD, tx));
    ty = ch + PAD * 2 <= h ? (h - ch) / 2 : Math.min(PAD, Math.max(h - ch - PAD, ty));
  }

  function apply() {
    clamp();
    content.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
    onChange(view());
  }

  function zoomAt(next, px, py) {
    const target = Math.min(fitScale * MAX_ZOOM, Math.max(fitScale, next));
    tx = px - ((px - tx) / scale) * target;
    ty = py - ((py - ty) / scale) * target;
    scale = target;
    atFit = scale === fitScale;
    apply();
  }

  function fit() {
    const { clientWidth: w, clientHeight: h } = stage;
    fitScale = Math.max(0.01, Math.min((w - PAD * 2) / size.width, (h - PAD * 2) / size.height));
    scale = fitScale;
    atFit = true;
    apply();
  }

  function down(event) {
    if (event.button !== undefined && event.button > 0) return;
    // Los controles que flotan sobre la cabina (zoom, barra del modo) no son toques en la foto.
    if (event.target !== stage && !content.contains(event.target)) return;
    try { stage.setPointerCapture(event.pointerId); } catch { /* Puntero sintético o ya liberado. */ }
    pointers.set(event.pointerId, local(event));
    if (pointers.size === 1) {
      const start = local(event);
      gesture = { kind: 'pending', start, last: start, time: performance.now() };
    } else if (pointers.size === 2) {
      if (gesture?.kind === 'point') onDragEnd();
      const [a, b] = [...pointers.values()];
      gesture = { kind: 'pinch', distance: Math.hypot(a.px - b.px, a.py - b.py), scale };
      content.style.willChange = 'transform';
    }
  }

  function move(event) {
    if (!pointers.has(event.pointerId) || !gesture) return;
    const point = local(event);
    pointers.set(event.pointerId, point);
    if (gesture.kind === 'pinch' && pointers.size >= 2) {
      const [a, b] = [...pointers.values()];
      const distance = Math.hypot(a.px - b.px, a.py - b.py);
      zoomAt(gesture.scale * (distance / gesture.distance), (a.px + b.px) / 2, (a.py + b.py) / 2);
      return;
    }
    if (gesture.kind === 'pending') {
      const dx = point.px - gesture.start.px;
      const dy = point.py - gesture.start.py;
      if (classifyGesture(dx, dy, 0) === 'tap') return;
      gesture.kind = onDragStart(gesture.start.px, gesture.start.py) ? 'point' : 'pan';
      if (gesture.kind === 'pan') content.style.willChange = 'transform';
    }
    if (gesture.kind === 'point') onDragMove(point.px, point.py);
    if (gesture.kind === 'pan') {
      tx += point.px - gesture.last.px;
      ty += point.py - gesture.last.py;
      atFit = false;
      apply();
    }
    gesture.last = point;
  }

  function up(event) {
    if (!pointers.has(event.pointerId)) return;
    pointers.delete(event.pointerId);
    if (!gesture) return;
    if (gesture.kind === 'pending' && event.type === 'pointerup') {
      const point = local(event);
      const kind = classifyGesture(point.px - gesture.start.px, point.py - gesture.start.py, performance.now() - gesture.time);
      if (kind === 'tap') onTap(gesture.start.px, gesture.start.py);
    }
    if (gesture.kind === 'point') onDragEnd();
    if (pointers.size === 0) {
      gesture = null;
      content.style.willChange = '';
    } else if (gesture.kind === 'pinch') {
      gesture = { kind: 'done' };
    }
  }

  // La rueda desplaza la foto; el zoom va por los botones o el pellizco. El pellizco del trackpad
  // llega como rueda con Ctrl, así que ese sigue haciendo zoom.
  function wheel(event) {
    event.preventDefault();
    if (event.ctrlKey) {
      const { px, py } = local(event);
      zoomAt(scale * Math.exp(-event.deltaY * 0.01), px, py);
      return;
    }
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stage.clientHeight : 1;
    tx -= event.deltaX * unit;
    ty -= event.deltaY * unit;
    atFit = false;
    apply();
  }

  const resize = new ResizeObserver(() => (atFit ? fit() : apply()));
  stage.addEventListener('pointerdown', down);
  stage.addEventListener('pointermove', move);
  stage.addEventListener('pointerup', up);
  stage.addEventListener('pointercancel', up);
  stage.addEventListener('wheel', wheel, { passive: false });
  resize.observe(stage);
  fit();

  return {
    view,
    fit,
    zoomBy(factor) { zoomAt(scale * factor, stage.clientWidth / 2, stage.clientHeight / 2); },
    /** Corre la foto en px de pantalla (el borde la frena igual que al arrastrar). */
    panBy(dx, dy) { tx += dx; ty += dy; atFit = false; apply(); },
    setInset(next) { if (next === inset) return; inset = next; apply(); },
    destroy() {
      resize.disconnect();
      stage.removeEventListener('pointerdown', down);
      stage.removeEventListener('pointermove', move);
      stage.removeEventListener('pointerup', up);
      stage.removeEventListener('pointercancel', up);
      stage.removeEventListener('wheel', wheel);
    },
  };
}
