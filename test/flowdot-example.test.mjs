import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { parseFlowdot } from '../src/flowdot/file.js';
import { BUNDLED, bundledList, bundledMissing, bundledToSeed } from '../src/flowdot/bundled.js';

const LOCAL_A320 = new URL('../local/flowdot/prueba-a320.flowdot', import.meta.url);

test('la cabina de ejemplo es un Boeing 737 con dos flujos', async () => {
  const result = parseFlowdot(await readFile(new URL('../public/flowdot/ejemplo-boeing-737.flowdot', import.meta.url), 'utf8'));
  assert.equal(result.ok, true, result.error);
  const [{ cabin, flows }] = result.entries;
  assert.equal(cabin.id, 'ejemplo-boeing-737');
  assert.equal(cabin.name, 'Boeing 737-300 (ejemplo)');
  assert.deepEqual(flows.map((flow) => flow.steps.length), [6, 7]);
  assert.ok(cabin.image.blob.size > 100_000);
});

test('la A320 de prueba no se publica: ni en el sitio ni en el repositorio', async () => {
  assert.deepEqual(bundledList(false).map((item) => item.id), ['ejemplo-boeing-737']);
  assert.deepEqual(BUNDLED.map((item) => item.id), ['ejemplo-boeing-737']);
  assert.equal(existsSync(new URL('../public/flowdot/prueba-a320.flowdot', import.meta.url)), false);
  assert.match(await readFile(new URL('../.gitignore', import.meta.url), 'utf8'), /^local\/$/m);
});

test('en desarrollo se suma la A320 local, que puede faltar', () => {
  const a320 = bundledList(true).find((item) => item.id === 'prueba-a320-completo');
  assert.equal(a320.file, '/local/flowdot/prueba-a320.flowdot');
  assert.equal(a320.optional, true);
});

test('la cabina de prueba A320 local tiene sus dos flujos', { skip: !existsSync(LOCAL_A320) && 'falta local/flowdot/prueba-a320.flowdot' }, async () => {
  const result = parseFlowdot(await readFile(LOCAL_A320, 'utf8'));
  assert.equal(result.ok, true, result.error);
  const [{ cabin, flows }] = result.entries;
  assert.equal(cabin.id, 'prueba-a320-completo');
  assert.deepEqual(flows.map((flow) => flow.steps.length), [10, 15]);
});

test('cada cabina de prueba publicada apunta a un archivo del sitio con esa misma cabina', async () => {
  for (const item of bundledList(false)) {
    const result = parseFlowdot(await readFile(new URL(`../public${item.file}`, import.meta.url), 'utf8'));
    assert.equal(result.ok, true, result.error);
    assert.equal(result.entries[0].cabin.id, item.id);
  }
});

test('las de prueba se cargan una sola vez: si ya se cargaron o ya están, no vuelven solas', () => {
  const dev = bundledList(true);
  assert.deepEqual(bundledToSeed([], new Set(), dev).map((item) => item.id), dev.map((item) => item.id));
  assert.deepEqual(bundledToSeed([], new Set(['ejemplo-boeing-737']), dev).map((item) => item.id), ['prueba-a320-completo']);
  assert.deepEqual(bundledToSeed(dev.map((item) => item.id), new Set(), dev), []);
});

test('una cabina de prueba oculta cuenta como faltante para volver a mostrarla', () => {
  const dev = bundledList(true);
  const cabins = [{ id: 'ejemplo-boeing-737' }, { id: 'prueba-a320-completo', hidden: true }];
  assert.deepEqual(bundledMissing(cabins, dev).map((item) => item.id), ['prueba-a320-completo']);
  assert.deepEqual(bundledMissing([{ id: 'ejemplo-boeing-737' }, { id: 'prueba-a320-completo' }], dev), []);
  assert.deepEqual(bundledMissing([{ id: 'ejemplo-boeing-737', hidden: true }]).map((item) => item.id), ['ejemplo-boeing-737']);
});

test('el panel oculta las cabinas de prueba en vez de borrarlas y deja volver a mostrarlas', async () => {
  const list = await readFile(new URL('../src/flowdot/screens/list.js', import.meta.url), 'utf8');
  assert.match(list, /isBundled\(cabin\.id\)/);
  assert.match(list, /hidden: true/);
  assert.match(list, /io\.showBundled\(/);
  assert.match(list, /io\.seedBundled\(/);
});
