import test from 'node:test';
import assert from 'node:assert/strict';
import { addStep, bendStep, createHistory, editStep, moveStep, removeStep, renameStep, reorderStep } from '../src/flowdot/flow.js';

const base = () => ({
  id: 'f1', cabinId: 'c1', name: 'Antes de despegar', createdAt: 1, updatedAt: 1,
  steps: [
    { id: 'a', x: 0.1, y: 0.1, label: 'A' },
    { id: 'b', x: 0.2, y: 0.2, label: 'B' },
    { id: 'c', x: 0.3, y: 0.3, label: 'C' },
  ],
});

test('addStep agrega al final con nombre vacío y actualiza updatedAt', () => {
  const flow = base();
  const next = addStep(flow, 0.5, 0.6, { id: 'd', now: 9 });
  assert.deepEqual(next.steps.at(-1), { id: 'd', x: 0.5, y: 0.6, label: '' });
  assert.equal(next.updatedAt, 9);
  assert.equal(flow.steps.length, 3);
});

test('addStep con 200 pasos devuelve el mismo flujo', () => {
  const flow = { ...base(), steps: Array.from({ length: 200 }, (_, i) => ({ id: `s${i}`, x: 0, y: 0, label: '' })) };
  assert.equal(addStep(flow, 0.5, 0.5, { id: 'x', now: 2 }), flow);
});

test('moveStep recorta la posición a la imagen', () => {
  const next = moveStep(base(), 'b', 1.3, -0.2, { now: 5 });
  assert.deepEqual(next.steps[1], { id: 'b', x: 1, y: 0, label: 'B' });
});

test('renameStep recorta a 120 caracteres', () => {
  const next = renameStep(base(), 'a', 'x'.repeat(130), { now: 5 });
  assert.equal(next.steps[0].label.length, 120);
});

test('reorderStep(0, 2) sobre a,b,c da b,c,a sin tocar el original', () => {
  const flow = base();
  const next = reorderStep(flow, 0, 2, { now: 5 });
  assert.deepEqual(next.steps.map((s) => s.id), ['b', 'c', 'a']);
  assert.deepEqual(flow.steps.map((s) => s.id), ['a', 'b', 'c']);
});

test('removeStep saca el paso', () => {
  assert.deepEqual(removeStep(base(), 'b', { now: 5 }).steps.map((s) => s.id), ['a', 'c']);
});

test('createHistory: deshacer y rehacer', () => {
  const one = base();
  const two = removeStep(one, 'a', { now: 2 });
  const three = removeStep(two, 'b', { now: 3 });
  const history = createHistory(one);
  history.push(two);
  history.push(three);
  assert.equal(history.undo(), two);
  assert.equal(history.redo(), three);
  assert.equal(history.canRedo(), false);
});

test('createHistory: un cambio después de deshacer borra el rehacer', () => {
  const one = base();
  const history = createHistory(one);
  history.push(removeStep(one, 'a', { now: 2 }));
  history.undo();
  history.push(removeStep(one, 'c', { now: 3 }));
  assert.equal(history.canRedo(), false);
  assert.deepEqual(history.current().steps.map((s) => s.id), ['a', 'b']);
});

test('createHistory: con límite 2, tres cambios y dos deshacer dejan sin deshacer', () => {
  const one = base();
  const history = createHistory(one, 2);
  history.push(removeStep(one, 'a', { now: 2 }));
  history.push(removeStep(one, 'b', { now: 3 }));
  history.push(removeStep(one, 'c', { now: 4 }));
  history.undo();
  history.undo();
  assert.equal(history.canUndo(), false);
});

const bent = () => {
  const flow = base();
  flow.steps[1].bend = 0.3;
  flow.steps[2].bend = -0.2;
  return flow;
};

test('bendStep recorta a 1 y con null vuelve a automática', () => {
  const flow = base();
  assert.equal(bendStep(flow, 'b', 2, { now: 5 }).steps[1].bend, 1);
  const auto = bendStep(bent(), 'b', null, { now: 5 });
  assert.equal('bend' in auto.steps[1], false);
  assert.equal(auto.updatedAt, 5);
  assert.equal('bend' in flow.steps[1], false);
});

test('reorderStep saca la curva de las flechas que cambiaron de extremo', () => {
  const flow = bent();
  const next = reorderStep(flow, 0, 2, { now: 5 });
  assert.deepEqual(next.steps.map((s) => s.id), ['b', 'c', 'a']);
  assert.deepEqual(next.steps.map((s) => s.bend), [undefined, -0.2, undefined]);
  assert.equal(flow.steps[1].bend, 0.3);
});

test('removeStep saca la curva de la flecha que ahora llega desde otro paso', () => {
  const next = removeStep(bent(), 'b', { now: 5 });
  assert.deepEqual(next.steps.map((s) => s.bend), [undefined, undefined]);
  const keep = removeStep(bent(), 'c', { now: 5 });
  assert.deepEqual(keep.steps.map((s) => s.bend), [undefined, 0.3]);
});

test('editStep: acción recortada a 120 y crítico que se prende y se apaga', () => {
  const flow = base();
  const next = editStep(flow, 'b', { action: 'x'.repeat(130), critical: true }, { now: 9 });
  assert.equal(next.steps[1].action.length, 120);
  assert.equal(next.steps[1].critical, true);
  assert.equal(next.updatedAt, 9);
  const off = editStep(next, 'b', { critical: false }, { now: 10 });
  assert.equal('critical' in off.steps[1], false);
  assert.equal(next.steps[1].critical, true);
  assert.equal(off.steps[0], flow.steps[0]);
});

test('editStep: sin cambios devuelve el mismo flujo', () => {
  const flow = base();
  assert.equal(editStep(flow, 'b', { label: 'B' }, { now: 9 }), flow);
  assert.equal(editStep(flow, 'b', { critical: false }, { now: 9 }), flow);
  assert.equal(editStep(flow, 'zz', { label: 'Q' }, { now: 9 }), flow);
});
