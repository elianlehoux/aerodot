import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_NOTES, addNote, arrowPartAt, arrowSegment, arrowTip, noteAt, removeNote, updateNote } from '../src/flowdot/notes.js';

const base = { id: 'f', name: 'F', steps: [], updatedAt: 0 };
const arrow = { id: 'a', type: 'arrow', x1: 0.1, y1: 0.5, x2: 0.5, y2: 0.5 };
const label = { id: 'l', type: 'label', x: 0.8, y: 0.2, text: 'Overhead' };
// Foto de 1000 × 500 sin zoom ni corrimiento: px de pantalla = px de imagen.
const view = { scale: 1, tx: 0, ty: 0, width: 1000, height: 500 };

test('addNote recorta posiciones y texto, y no pasa de 50', () => {
  const next = addNote(base, { id: 'x', type: 'label', x: 1.4, y: -0.2, text: 'a'.repeat(60) }, { now: 5 });
  assert.deepEqual(next.notes, [{ id: 'x', type: 'label', x: 1, y: 0, text: 'a'.repeat(40) }]);
  assert.equal(next.updatedAt, 5);
  assert.equal(base.notes, undefined);
  const full = { ...base, notes: Array.from({ length: MAX_NOTES }, (_, i) => ({ ...label, id: `n${i}` })) };
  assert.equal(addNote(full, label, { now: 1 }), full);
});

test('addNote de flecha guarda solo sus campos', () => {
  const next = addNote(base, { ...arrow, bend: 3, text: 'no' }, { now: 1 });
  assert.deepEqual(next.notes, [{ ...arrow, bend: 1 }]);
});

test('updateNote cambia y recorta; bend null saca la curva; id desconocido no cambia nada', () => {
  const flow = { ...base, notes: [{ ...arrow, bend: 0.3 }, label] };
  const moved = updateNote(flow, 'a', { x2: 2, bend: null }, { now: 2 });
  assert.deepEqual(moved.notes[0], { ...arrow, x2: 1 });
  assert.equal(moved.notes[1], label);
  assert.equal(updateNote(flow, 'zzz', { x: 0.1 }, { now: 2 }), flow);
  assert.equal(updateNote(flow, 'l', { text: 'Overhead' }, { now: 2 }), flow);
  assert.equal(updateNote(flow, 'l', { text: 'Pedestal' }, { now: 2 }).notes[1].text, 'Pedestal');
});

test('removeNote saca la marca', () => {
  const flow = { ...base, notes: [arrow, label] };
  assert.deepEqual(removeNote(flow, 'a', { now: 3 }).notes, [label]);
  assert.equal(removeNote(flow, 'zzz', { now: 3 }), flow);
});

test('arrowSegment recta sin bend y arqueada con bend', () => {
  const straight = arrowSegment(arrow, 1000, 500);
  assert.deepEqual([straight[0], straight[3]], [{ px: 100, py: 250 }, { px: 500, py: 250 }]);
  assert.equal(straight[1].py, 250);
  const bent = arrowSegment({ ...arrow, bend: 0.25 }, 1000, 500);
  assert.ok(bent[1].py > 250);
});

test('arrowTip apunta en la dirección del final', () => {
  const tip = arrowTip(arrowSegment(arrow, 1000, 500));
  assert.deepEqual([tip.px, tip.py, Math.round(tip.angle)], [500, 250, 0]);
  const back = arrowTip(arrowSegment({ ...arrow, x1: 0.5, x2: 0.1 }, 1000, 500));
  assert.equal(Math.round(Math.abs(back.angle)), 180);
});

test('noteAt encuentra la etiqueta y la flecha, y da -1 lejos', () => {
  const notes = [arrow, label];
  assert.equal(noteAt(notes, 300, 252, view), 0);
  assert.equal(noteAt(notes, 820, 102, view), 1);
  assert.equal(noteAt(notes, 300, 400, view), -1);
  assert.equal(noteAt([], 300, 252, view), -1);
});

test('arrowPartAt da las puntas y el medio solo si se pide', () => {
  assert.equal(arrowPartAt(arrow, 104, 250, view), 'start');
  assert.equal(arrowPartAt(arrow, 497, 252, view), 'end');
  assert.equal(arrowPartAt(arrow, 300, 250, view), null);
  assert.equal(arrowPartAt(arrow, 300, 250, view, { mid: true }), 'mid');
  assert.equal(arrowPartAt(label, 800, 100, view, { mid: true }), null);
});
