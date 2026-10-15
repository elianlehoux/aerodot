import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSet } from '../../src/scripts/exercises/validate.js';

const good = () => ({
  id: 's1', slug: 'tiempo', title: 'Decilo',
  items: [
    { id: 'a', type: 'mcq', prompt: 'p', options: ['x', 'y'], answer: 1 },
    { id: 'b', type: 'tf', prompt: 'p', answer: false },
    { id: 'c', type: 'gap', prompt: 'p', sentence: 'Cloud ___ at two thousand', answers: ['broken'] },
    { id: 'd', type: 'order', prompt: 'p', tokens: ['in', 'the', 'vicinity'], answer: ['in', 'the', 'vicinity'] },
  ],
});

test('un set correcto no tiene errores', () => {
  assert.deepEqual(validateSet(good()), []);
});

test('detecta set vacío, ids repetidos y tipos inválidos', () => {
  assert.ok(validateSet(null).length > 0);
  assert.ok(validateSet({ ...good(), items: [] }).length > 0);
  const dup = good(); dup.items[1].id = 'a';
  assert.ok(validateSet(dup).some((e) => e.includes('repetido')));
  const bad = good(); bad.items[0].type = 'zzz';
  assert.ok(validateSet(bad).some((e) => e.includes('tipo')));
});

test('mcq: respuesta fuera de rango', () => {
  const s = good(); s.items[0].answer = 5;
  assert.ok(validateSet(s).length > 0);
});

test('gap: exige exactamente un hueco y respuestas', () => {
  const none = good(); none.items[2].sentence = 'sin hueco';
  assert.ok(validateSet(none).length > 0);
  const two = good(); two.items[2].sentence = '___ y ___';
  assert.ok(validateSet(two).length > 0);
  const empty = good(); empty.items[2].answers = [];
  assert.ok(validateSet(empty).length > 0);
});

test('order: la respuesta debe usar las mismas fichas', () => {
  const s = good(); s.items[3].answer = ['in', 'the'];
  assert.ok(validateSet(s).length > 0);
  const t = good(); t.items[3].answer = ['the', 'in', 'vicinity'];
  assert.deepEqual(validateSet(t), []);
});

test('order: alternatives debe ser una lista de órdenes con las mismas fichas', () => {
  const ok = good(); ok.items[3].alternatives = [['the', 'vicinity', 'in']];
  assert.deepEqual(validateSet(ok), []);
  const notArray = good(); notArray.items[3].alternatives = 'x';
  assert.ok(validateSet(notArray).some((e) => e.includes('alternatives')));
  const entry = good(); entry.items[3].alternatives = [null];
  assert.ok(validateSet(entry).some((e) => e.includes('alternatives')));
  const tokens = good(); tokens.items[3].alternatives = [['in', 'the']];
  assert.ok(validateSet(tokens).some((e) => e.includes('alternatives')));
});
