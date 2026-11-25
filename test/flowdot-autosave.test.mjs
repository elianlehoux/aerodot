import test from 'node:test';
import assert from 'node:assert/strict';
import { createAutosave } from '../src/flowdot/autosave.js';

const settle = () => new Promise((resolve) => setImmediate(resolve));

test('tres cambios en 300 ms producen un solo guardado con el último, 400 ms después', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const saved = [];
  const autosave = createAutosave(async (value) => { saved.push(value); }, 400, () => {});
  autosave.schedule(1);
  t.mock.timers.tick(150);
  autosave.schedule(2);
  t.mock.timers.tick(150);
  autosave.schedule(3);
  t.mock.timers.tick(399);
  assert.deepEqual(saved, []);
  t.mock.timers.tick(1);
  assert.deepEqual(saved, [3]);
});

test('flush guarda enseguida lo pendiente y nada después', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const saved = [];
  const autosave = createAutosave(async (value) => { saved.push(value); }, 400, () => {});
  autosave.schedule('a');
  await autosave.flush();
  assert.deepEqual(saved, ['a']);
  t.mock.timers.tick(1000);
  assert.deepEqual(saved, ['a']);
  await autosave.flush();
  assert.deepEqual(saved, ['a']);
});

test('si guardar falla se avisa y el siguiente cambio vuelve a intentar', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const errors = [];
  let fails = true;
  const saved = [];
  const autosave = createAutosave(async (value) => {
    if (fails) throw new Error('cuota');
    saved.push(value);
  }, 400, (error) => errors.push(error.message));
  autosave.schedule(1);
  t.mock.timers.tick(400);
  await settle();
  assert.deepEqual(errors, ['cuota']);
  fails = false;
  autosave.schedule(2);
  t.mock.timers.tick(400);
  await settle();
  assert.deepEqual(saved, [2]);
});
