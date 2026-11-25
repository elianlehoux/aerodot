import test from 'node:test';
import assert from 'node:assert/strict';
import { printColumns, stepLine, noteShapes } from '../src/flowdot/export.js';

test('printColumns: la lista impresa se reparte pareja', () => {
  assert.deepEqual(printColumns(0), { cols: 0, rows: 0 });
  assert.deepEqual(printColumns(4), { cols: 1, rows: 4 });
  assert.deepEqual(printColumns(7), { cols: 2, rows: 4 });
  assert.deepEqual(printColumns(12), { cols: 2, rows: 6 });
  assert.deepEqual(printColumns(20), { cols: 3, rows: 7 });
});

test('stepLine: nombre o "Paso N", acción y crítico para la lista impresa', () => {
  assert.deepEqual(stepLine({ label: 'Flaps', action: '1+F', critical: true }, 3), { name: 'Flaps', action: '1+F', critical: true });
  assert.deepEqual(stepLine({ label: '' }, 0), { name: 'Paso 1', action: '', critical: false });
});

test('noteShapes: etiqueta en px y flecha con su tramo y su cabeza', () => {
  const shapes = noteShapes([
    { id: 'a', type: 'arrow', x1: 0.1, y1: 0.5, x2: 0.5, y2: 0.5 },
    { id: 'l', type: 'label', x: 0.5, y: 0.25, text: 'Pedestal' },
  ], 1000, 400, 14);
  assert.deepEqual(shapes[1], { type: 'label', x: 500, y: 100, text: 'Pedestal' });
  assert.equal(shapes[0].type, 'arrow');
  assert.match(shapes[0].d, /^M100 200 C.* M.*L500 200L/);
  assert.deepEqual(noteShapes(undefined, 1000, 400, 14), []);
});
