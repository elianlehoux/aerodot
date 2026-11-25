/**
 * Dibujo encima de la cabina, en px de la imagen. Los tamaños se dividen por el zoom para que
 * los círculos y números se vean siempre igual en pantalla. Reusa los nodos entre dibujos.
 */
import { routePoints, segmentMiddle, segmentPath, segmentsPath, shownSegments } from './geometry.js';
import { arrowSegment, arrowTip } from './notes.js';

const SVG = 'http://www.w3.org/2000/svg';
export const DOT_RADIUS = 10.5;
const SMALL_RADIUS = 4;

const el = (tag, cls) => {
  const node = document.createElementNS(SVG, tag);
  if (cls) node.setAttribute('class', cls);
  return node;
};
const set = (node, attrs) => { for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v)); };

export function createOverlay(svg) {
  const route = el('path', 'fd-route');
  const fresh = el('path', 'fd-route fd-route-new');
  const hoverBase = el('path', 'fd-hover-base');
  const hoverRun = el('path', 'fd-hover-run');
  const arrows = el('g', 'fd-arrows');
  const handles = el('g', 'fd-handles');
  const hint = el('circle', 'fd-hint');
  const dots = el('g', 'fd-dots-layer');
  const marks = el('g', 'fd-marks');
  // Marcas de ayuda (Anotar): debajo de la ruta, así los pasos siempre quedan encima.
  const notes = el('g', 'fd-notes');
  const noteHandles = el('g', 'fd-note-handles');
  svg.append(notes, hoverBase, route, fresh, hoverRun, arrows, hint, dots, handles, noteHandles, marks);
  fresh.setAttribute('pathLength', '1');
  hoverRun.setAttribute('pathLength', '1');
  const pool = [];
  let lastFresh = '';

  function dot(index) {
    if (!pool[index]) {
      const g = el('g', 'fd-dot');
      g.append(el('circle'), el('text'), el('circle', 'fd-crit'));
      pool[index] = g;
    }
    return pool[index];
  }

  /**
   * options: shown (índices visibles, todos si falta), route (dibuja la ruta entre los visibles),
   * ahead (índice del paso que sigue: da la forma final al último tramo, en Mirar),
   * animateLast (anima el último tramo), selected (id), hint ({ x, y, level, index }),
   * marks ([{ x, y, ok }], o [{ x, y, label }] y [{ x, y, stray: true }] en el Simulador),
   * missed (índices de pasos fallados en un repaso terminado: se dibujan vacíos),
   * small (índices que se dibujan como un puntito sin número, para que los ya hechos no tapen la cabina),
   * slow (el tramo animado se dibuja más despacio, al acertar en Repasar),
   * hover (índice del tramo destacado) y handles (índices de tramos que muestran su puntito en vez de la punta).
   * Marcas: notes (lista), selectedNote (id: va en acento y con sus puntitos) y pendingNote ({ x, y }: inicio de una flecha a medio poner).
   */
  function draw(steps, view, options = {}) {
    const { width, height, scale } = view;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    const r = DOT_RADIUS / scale;
    const shown = options.shown ?? steps.map((_, index) => index);
    const points = routePoints(steps, width, height, shown);

    // La ruta quieta, el tramo nuevo y las puntas salen de los mismos tramos, así la punta no queda fuera de la línea.
    const segments = options.route ? shownSegments(steps, width, height, shown, options.ahead) : [];
    const animate = options.animateLast && segments.length > 0;
    route.setAttribute('d', segmentsPath(animate ? segments.slice(0, -1) : segments));
    route.style.strokeWidth = `${2.5 / scale}`;
    const freshD = animate ? segmentPath(segments.at(-1)) : '';
    // La punta del tramo nuevo aparece cuando la línea llega a la mitad, no antes.
    const restarted = !!freshD && freshD !== lastFresh;
    if (freshD !== lastFresh) {
      fresh.setAttribute('d', freshD);
      fresh.classList.remove('is-drawing');
      fresh.classList.toggle('is-slow', !!options.slow);
      if (freshD) { fresh.getBoundingClientRect(); fresh.classList.add('is-drawing'); }
      lastFresh = freshD;
    }
    fresh.style.strokeWidth = `${2.5 / scale}`;

    const hover = segments[options.hover] ? options.hover : -1;
    const hoverD = hover >= 0 ? segmentPath(segments[hover]) : '';
    hoverBase.setAttribute('d', hoverD);
    hoverRun.setAttribute('d', hoverD);
    hoverBase.style.strokeWidth = `${10 / scale}`;
    hoverRun.style.strokeWidth = `${3 / scale}`;

    const withHandle = new Set((options.handles ?? []).filter((k) => segments[k]));
    handles.replaceChildren(...[...withHandle].map((k) => {
      const { px, py } = segmentMiddle(segments[k]);
      const handle = el('circle', `fd-handle-dot${k === hover ? ' is-hover' : ''}`);
      set(handle, { cx: px, cy: py, r: 7 / scale });
      handle.style.strokeWidth = `${2.5 / scale}`;
      return handle;
    }));

    arrows.replaceChildren(...segments.map((segment, k) => [segment, k]).filter(([, k]) => !withHandle.has(k)).map(([segment, k]) => {
      const { px, py, angle } = segmentMiddle(segment);
      const fresh = restarted && k === segments.length - 1;
      const arrow = el('path', `fd-arrow${fresh ? ' is-fresh' : ''}${fresh && options.slow ? ' is-slow' : ''}`);
      const s = 5 / scale;
      set(arrow, { d: `M${-s} ${-s}L${s} 0L${-s} ${s}`, transform: `translate(${px} ${py}) rotate(${angle})` });
      arrow.style.strokeWidth = `${2 / scale}`;
      return arrow;
    }));

    if (options.hint?.level === 1) {
      set(hint, { cx: options.hint.x * width, cy: options.hint.y * height, r: (options.hint.radius ?? 112) / scale });
      hint.style.display = '';
    } else {
      hint.style.display = 'none';
    }

    const small = new Set(options.small ?? []);
    const nodes = points.map((point, i) => {
      const g = dot(i);
      const [circle, text, crit] = g.childNodes;
      const isSmall = small.has(point.index);
      g.classList.toggle('is-small', isSmall);
      set(circle, { cx: point.px, cy: point.py, r: isSmall ? SMALL_RADIUS / scale : r });
      circle.style.strokeWidth = isSmall ? `${1.5 / scale}` : '';
      // Crítico: punto naranja chico arriba a la derecha del círculo (no en los puntitos).
      const critical = steps[point.index].critical === true && !isSmall;
      crit.style.display = critical ? '' : 'none';
      if (critical) {
        set(crit, { cx: point.px + r * 0.74, cy: point.py - r * 0.74, r: r * 0.4 });
        crit.style.strokeWidth = `${1.5 / scale}`;
      }
      set(text, { x: point.px, y: point.py, 'font-size': 11.5 / scale });
      text.textContent = String(point.index + 1);
      g.dataset.index = String(point.index);
      g.classList.toggle('is-selected', steps[point.index].id === options.selected);
      g.classList.toggle('is-hint', options.hint?.level === 2 && options.hint.index === point.index);
      g.classList.toggle('is-missed', options.missed?.includes(point.index) ?? false);
      g.classList.toggle('is-linked', hover >= 0 && (i === hover || i === hover + 1));
      return g;
    });
    dots.replaceChildren(...nodes);

    drawNotes(options, width, height, scale);

    marks.replaceChildren(...(options.marks ?? []).map((mark) => {
      // Simulador: número neutro en el orden tocado, o punto gris si el toque no cayó en un paso.
      if (mark.label != null || mark.stray) {
        const g = el('g', `fd-mark ${mark.stray ? 'is-stray' : 'is-tap'}${mark.small ? ' is-small' : ''}`);
        g.setAttribute('transform', `translate(${mark.x * width} ${mark.y * height})`);
        const circle = el('circle');
        set(circle, { r: mark.stray ? 6 / scale : mark.small ? SMALL_RADIUS / scale : r });
        circle.style.strokeWidth = `${(mark.small ? 1.5 : 2) / scale}`;
        g.append(circle);
        if (!mark.stray && !mark.small) {
          const text = el('text');
          set(text, { 'font-size': 11.5 / scale });
          text.textContent = mark.label;
          g.append(text);
        }
        return g;
      }
      const g = el('g', `fd-mark ${mark.ok ? 'is-ok' : 'is-miss'}`);
      const s = 9 / scale;
      const path = el('path');
      path.setAttribute('d', mark.ok ? `M${-s} 0L${-s / 3} ${s * 0.7}L${s} ${-s * 0.7}` : `M${-s} ${-s}L${s} ${s}M${s} ${-s}L${-s} ${s}`);
      path.style.strokeWidth = `${3 / scale}`;
      g.setAttribute('transform', `translate(${mark.x * width} ${mark.y * height})`);
      g.append(path);
      return g;
    }));
  }

  function handleDot(px, py, scale) {
    const dot = el('circle', 'fd-handle-dot');
    set(dot, { cx: px, cy: py, r: 7 / scale });
    dot.style.strokeWidth = `${2.5 / scale}`;
    return dot;
  }

  function drawNotes(options, width, height, scale) {
    const list = options.notes ?? [];
    const extra = [];
    notes.replaceChildren(...list.map((note) => {
      const g = el('g', `fd-note${note.id === options.selectedNote ? ' is-selected' : ''}`);
      if (note.type === 'label') {
        const text = el('text', 'fd-note-text');
        set(text, { x: note.x * width, y: note.y * height, 'font-size': 13 / scale });
        text.style.strokeWidth = `${4 / scale}`;
        text.textContent = note.text;
        g.append(text);
        return g;
      }
      const segment = arrowSegment(note, width, height);
      const tip = arrowTip(segment);
      const a = (tip.angle * Math.PI) / 180;
      const s = 7 / scale;
      const at = (dx, dy) => `${tip.px + dx * Math.cos(a) - dy * Math.sin(a)} ${tip.py + dx * Math.sin(a) + dy * Math.cos(a)}`;
      const d = `${segmentPath(segment)} M${at(-s * 1.4, -s)}L${tip.px} ${tip.py}L${at(-s * 1.4, s)}`;
      for (const [cls, w] of [['fd-note-halo', 6], ['fd-note-line', 2.5]]) {
        const path = el('path', cls);
        path.setAttribute('d', d);
        path.style.strokeWidth = `${w / scale}`;
        g.append(path);
      }
      if (note.id === options.selectedNote) {
        const middle = segmentMiddle(segment);
        extra.push(handleDot(segment[0].px, segment[0].py, scale), handleDot(tip.px, tip.py, scale), handleDot(middle.px, middle.py, scale));
      }
      return g;
    }));
    if (options.pendingNote) extra.push(handleDot(options.pendingNote.x * width, options.pendingNote.y * height, scale));
    noteHandles.replaceChildren(...extra);
  }

  return { draw };
}
