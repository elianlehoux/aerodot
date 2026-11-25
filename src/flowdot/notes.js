/**
 * Marcas de ayuda de un flujo (Anotar): flechas sueltas y etiquetas de zona. No son pasos:
 * no se repasan ni se numeran. Las ediciones devuelven un flujo nuevo, como en `flow.js`.
 * Posiciones en fracciones de la foto; las búsquedas reciben px de pantalla y la vista.
 */
import { bentSegment, segmentAt, segmentMiddle, toScreen } from './geometry.js';

export const MAX_NOTES = 50;
export const MAX_NOTE_TEXT = 40;
const TIP_RADIUS = 20;
const LINE_RADIUS = 16;

const unit = (n) => Math.min(1, Math.max(0, n));
const clampBend = (n) => Math.min(1, Math.max(-1, n));

/** Solo los campos de su tipo, recortados. */
function clean(note) {
  if (note.type === 'label') {
    return { id: note.id, type: 'label', x: unit(note.x), y: unit(note.y), text: String(note.text ?? '').slice(0, MAX_NOTE_TEXT) };
  }
  const out = { id: note.id, type: 'arrow', x1: unit(note.x1), y1: unit(note.y1), x2: unit(note.x2), y2: unit(note.y2) };
  if (typeof note.bend === 'number') out.bend = clampBend(note.bend);
  return out;
}

const withNotes = (flow, notes, now) => ({ ...flow, notes, updatedAt: now });
const same = (a, b) => Object.keys({ ...a, ...b }).every((key) => a[key] === b[key]);

export function addNote(flow, note, { now }) {
  const notes = flow.notes ?? [];
  if (notes.length >= MAX_NOTES) return flow;
  return withNotes(flow, [...notes, clean(note)], now);
}

/** Cambia campos de una marca. `bend: null` vuelve la flecha a recta. Sin cambios devuelve el mismo flujo. */
export function updateNote(flow, id, changes, { now }) {
  const notes = flow.notes ?? [];
  const index = notes.findIndex((note) => note.id === id);
  if (index < 0) return flow;
  const merged = { ...notes[index], ...changes };
  if (changes.bend === null) delete merged.bend;
  const next = clean(merged);
  if (same(next, notes[index])) return flow;
  return withNotes(flow, notes.map((note, i) => (i === index ? next : note)), now);
}

export function removeNote(flow, id, { now }) {
  const notes = flow.notes ?? [];
  if (!notes.some((note) => note.id === id)) return flow;
  return withNotes(flow, notes.filter((note) => note.id !== id), now);
}

/** La flecha como tramo cúbico en px de la imagen: recta sin `bend`, arqueada con él. */
export const arrowSegment = (note, width, height) =>
  bentSegment({ px: note.x1 * width, py: note.y1 * height }, { px: note.x2 * width, py: note.y2 * height }, note.bend ?? 0);

/** Punta y ángulo (grados) al final del tramo, para dibujar la cabeza. */
export function arrowTip([p1, , c2, p2]) {
  let dx = p2.px - c2.px;
  let dy = p2.py - c2.py;
  if (Math.hypot(dx, dy) < 1e-6) { dx = p2.px - p1.px; dy = p2.py - p1.py; }
  return { px: p2.px, py: p2.py, angle: (Math.atan2(dy, dx) * 180) / Math.PI };
}

/** Caja de una etiqueta en px de pantalla, centrada en su punto. El ancho es aproximado al texto. */
function labelBox(note, view) {
  const { px, py } = toScreen(note.x, note.y, view);
  const width = note.text.length * 7.4 + 18;
  return { left: px - width / 2, right: px + width / 2, top: py - 14, bottom: py + 14 };
}

/** Índice de la marca bajo el punto (la de más arriba si se pisan), o -1. */
export function noteAt(notes, px, py, view) {
  for (let i = notes.length - 1; i >= 0; i -= 1) {
    const note = notes[i];
    if (note.type === 'label') {
      const box = labelBox(note, view);
      if (px >= box.left && px <= box.right && py >= box.top && py <= box.bottom) return i;
    } else {
      const segment = arrowSegment(note, view.width, view.height);
      const x = (px - view.tx) / view.scale;
      const y = (py - view.ty) / view.scale;
      if (segmentAt([segment], x, y, LINE_RADIUS / view.scale) === 0) return i;
    }
  }
  return -1;
}

/** Qué parte de una flecha está bajo el punto: 'start', 'end', 'mid' (solo con `mid`) o null. */
export function arrowPartAt(note, px, py, view, { mid = false } = {}) {
  if (note.type !== 'arrow') return null;
  const near = (x, y) => Math.hypot(x - px, y - py) <= TIP_RADIUS;
  const end = toScreen(note.x2, note.y2, view);
  if (near(end.px, end.py)) return 'end';
  const start = toScreen(note.x1, note.y1, view);
  if (near(start.px, start.py)) return 'start';
  if (mid) {
    const middle = segmentMiddle(arrowSegment(note, view.width, view.height));
    if (near(middle.px * view.scale + view.tx, middle.py * view.scale + view.ty)) return 'mid';
  }
  return null;
}

/** Punto (en fracciones) junto al que va la tarjeta de la marca. */
export function noteAnchor(note) {
  return note.type === 'label' ? { x: note.x, y: note.y } : { x: (note.x1 + note.x2) / 2, y: (note.y1 + note.y2) / 2 };
}
