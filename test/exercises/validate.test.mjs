import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSet } from '../../src/scripts/exercises/validate.js';
import { survivalSet, weatherSet } from '../../src/data/english-sets.js';
import { survivalCall, survivalGroups } from '../../src/data/english-survival.js';

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

test('passMark: si está, debe ser un número entre 0 (exclusivo) y 1', () => {
  for (const bad of [null, '0.5', 0, 1.5]) {
    const s = good(); s.passMark = bad;
    assert.ok(validateSet(s).some((e) => e.includes('passMark')), `debería rechazar ${JSON.stringify(bad)}`);
  }
  for (const ok of [0.5, 1, undefined]) {
    const s = good(); if (ok !== undefined) s.passMark = ok;
    assert.deepEqual(validateSet(s), []);
  }
});

test('el set publicado de Tiempo es válido', () => {
  assert.deepEqual(validateSet(weatherSet), []);
});

test('el set de supervivencia que se publica es válido', () => {
  assert.deepEqual(validateSet(survivalSet), []);
  assert.equal(survivalSet.id, 'survival-say');
  assert.equal(survivalSet.slug, 'supervivencia');
  assert.deepEqual(survivalSet.items.map((item) => item.id), ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10']);
});

test('supervivencia: las cifras de say van en palabras y cada grupo tiene de 3 a 6 frases con id únicos', () => {
  const phrases = survivalGroups.flatMap((group) => [...group.phrases, ...(group.aside ? [group.aside] : [])]);
  const says = [
    ...phrases.map((phrase) => phrase.say),
    ...survivalCall.map((line) => line.say),
    ...survivalSet.items.map((item) => item.say).filter((say) => say !== undefined),
  ];
  for (const say of says) {
    assert.ok(typeof say === 'string' && say.trim(), 'say vacío');
    assert.doesNotMatch(say, /[0-9]/, `say con cifras: ${say}`);
  }
  for (const group of survivalGroups) {
    assert.ok(group.phrases.length >= 3 && group.phrases.length <= 6, `${group.id}: ${group.phrases.length} frases`);
    for (const phrase of group.phrases) {
      for (const field of ['id', 'en', 'es', 'say', 'body', 'use']) assert.ok(phrase[field]?.trim(), `${group.id}: falta ${field}`);
    }
  }
  const ids = phrases.map((phrase) => phrase.id);
  assert.equal(new Set(ids).size, ids.length, 'ids repetidos');
});
