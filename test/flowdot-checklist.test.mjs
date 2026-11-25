import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_CHECKLIST, addChecklist, addPending, editChecklistItem, parseChecklist, placePending, removeChecklistItem, removePending,
} from '../src/flowdot/checklist.js';

const one = (line) => parseChecklist(line)[0];

test('parseChecklist separa nombre y acción con puntos, tabulación, guion, … y espacios', () => {
  assert.deepEqual(one('PARKING BRAKE ........ SET'), { label: 'PARKING BRAKE', action: 'SET' });
  assert.deepEqual(one('1. Flaps\t5'), { label: 'Flaps', action: '5' });
  assert.deepEqual(one('• Beacon - ON'), { label: 'Beacon', action: 'ON' });
  assert.deepEqual(one('☐ Fuel pumps … ON'), { label: 'Fuel pumps', action: 'ON' });
  assert.deepEqual(one('APU   START'), { label: 'APU', action: 'START' });
  assert.deepEqual(one('2) Transponder – TA/RA'), { label: 'Transponder', action: 'TA/RA' });
  assert.deepEqual(one('[ ] Probe heat — ON'), { label: 'Probe heat', action: 'ON' });
});

test('parseChecklist ignora títulos y vacíos; sin separador todo es nombre', () => {
  assert.deepEqual(parseChecklist('BEFORE START:\n\n  \nSeatbelts\nWindows ..... CLOSED'), [
    { label: 'Seatbelts', action: '' },
    { label: 'Windows', action: 'CLOSED' },
  ]);
});

test('parseChecklist entiende espacios no separables y recorta a 120', () => {
  assert.deepEqual(one('A   B'), { label: 'A', action: 'B' });
  assert.deepEqual(one('Mezcla rica'), { label: 'Mezcla rica', action: '' });
  assert.equal(one('x'.repeat(200)).label.length, 120);
  assert.deepEqual(parseChecklist(''), []);
});

let n = 0;
const newId = () => `id${(n += 1)}`;
const base = { id: 'f', name: 'F', steps: [{ id: 's0', x: 0.5, y: 0.5, label: 'Antes' }], updatedAt: 0 };
const items = [{ label: 'Parking brake', action: 'SET' }, { label: 'Beacon', action: 'ON' }, { label: 'Seatbelts', action: '' }];

test('addPending suma pendientes con ids nuevos sin tocar los pasos', () => {
  const next = addPending(base, items, { newId, now: 3 });
  assert.equal(next.steps, base.steps);
  assert.equal(next.pending.length, 3);
  assert.deepEqual(next.pending[2], { id: next.pending[2].id, label: 'Seatbelts' });
  assert.equal(next.pending[0].action, 'SET');
  assert.equal(next.updatedAt, 3);
  assert.equal(base.pending, undefined);
});

test('addPending no pasa de 200 entre pasos y pendientes', () => {
  const full = { ...base, steps: Array.from({ length: 199 }, (_, i) => ({ id: `s${i}`, x: 0, y: 0, label: '' })) };
  assert.equal(addPending(full, items, { newId, now: 1 }).pending.length, 1);
});

test('placePending pasa el primero a los pasos y al final saca la clave', () => {
  let flow = addPending(base, items, { newId, now: 1 });
  const first = flow.pending[0];
  flow = placePending(flow, 1.2, 0.25, { now: 2 });
  assert.deepEqual(flow.steps.at(-1), { id: first.id, x: 1, y: 0.25, label: 'Parking brake', action: 'SET' });
  assert.equal(flow.pending.length, 2);
  flow = placePending(placePending(flow, 0.1, 0.1, { now: 3 }), 0.2, 0.2, { now: 4 });
  assert.equal('pending' in flow, false);
  assert.equal(flow.steps.at(-1).label, 'Seatbelts');
  assert.equal('action' in flow.steps.at(-1), false);
  assert.equal(placePending(flow, 0.3, 0.3, { now: 5 }), flow);
});

test('removePending saca uno', () => {
  const flow = addPending(base, items, { newId, now: 1 });
  const next = removePending(flow, flow.pending[1].id, { now: 2 });
  assert.deepEqual(next.pending.map((item) => item.label), ['Parking brake', 'Seatbelts']);
  assert.equal(removePending(flow, 'nope', { now: 2 }), flow);
});

test('checklist: agregar hasta 60, editar y borrar', () => {
  const many = Array.from({ length: 70 }, (_, i) => ({ label: `Item ${i}`, action: 'OK' }));
  const full = addChecklist(base, many, { newId, now: 1 });
  assert.equal(full.checklist.length, MAX_CHECKLIST);
  const flow = addChecklist(base, items.slice(0, 1), { newId, now: 1 });
  const [item] = flow.checklist;
  assert.deepEqual(item, { id: item.id, challenge: 'Parking brake', response: 'SET' });
  const edited = editChecklistItem(flow, item.id, { challenge: 'Parking brake', response: 'SET, presión OK' }, { now: 2 });
  assert.equal(edited.checklist[0].response, 'SET, presión OK');
  assert.equal(edited.updatedAt, 2);
  assert.equal('checklist' in removeChecklistItem(flow, item.id, { now: 3 }), false);
  assert.equal(flow.checklist[0], item);
});
