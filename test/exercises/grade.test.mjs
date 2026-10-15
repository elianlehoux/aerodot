import test from 'node:test';
import assert from 'node:assert/strict';
import { feedbackLead, gradeChoice, gradeGap, gradeOrder, gradeTf, normalize, playOrder, shuffle, summarize, tracksProgress } from '../../src/scripts/exercises/grade.js';

test('normalize ignora mayúsculas, espacios, acentos y puntuación', () => {
  assert.equal(normalize('  Broken '), 'broken');
  assert.equal(normalize('Hold   SHORT.'), 'hold short');
  assert.equal(normalize('Ceiling, broken!'), 'ceiling broken');
});

test('normalize quita acentos y unifica apóstrofos tipográficos', () => {
  assert.equal(normalize('\u00c1nimo, \u00d1and\u00fa'), 'animo nandu');
  assert.equal(normalize('Don\u2019t'), normalize("don't"));
  assert.equal(normalize('\u2018twas'), normalize("'twas"));
});

test('gradeGap acepta cualquier respuesta válida', () => {
  const item = { answers: ['one five', 'fifteen'] };
  assert.deepEqual(gradeGap(item, ' One  Five '), { correct: true, expected: 'one five' });
  assert.equal(gradeGap(item, 'Fifteen').correct, true);
  assert.equal(gradeGap(item, 'five').correct, false);
  assert.equal(gradeGap(item, '').correct, false);
});

test('gradeChoice compara por índice y devuelve el texto esperado', () => {
  const item = { options: ['a', 'b', 'c'], answer: 1 };
  assert.deepEqual(gradeChoice(item, 1), { correct: true, expected: 'b' });
  assert.equal(gradeChoice(item, 0).correct, false);
});

test('gradeTf compara booleanos', () => {
  assert.deepEqual(gradeTf({ answer: true }, true), { correct: true, expected: 'Verdadero' });
  assert.deepEqual(gradeTf({ answer: false }, true), { correct: false, expected: 'Falso' });
});

test('gradeOrder compara por texto y admite alternativas y fichas repetidas', () => {
  const item = { answer: ['one', 'one', 'zero'], alternatives: [['one', 'zero', 'one']] };
  assert.equal(gradeOrder(item, ['one', 'one', 'zero']).correct, true);
  assert.equal(gradeOrder(item, ['One', 'zero', 'one']).correct, true);
  assert.equal(gradeOrder(item, ['zero', 'one', 'one']).correct, false);
  assert.equal(gradeOrder(item, ['one', 'one']).correct, false);
  assert.equal(gradeOrder(item, ['one', 'one', 'zero']).expected, 'one one zero');
});

test('summarize usa 0.75 por defecto y no aprueba un set vacío', () => {
  assert.deepEqual(summarize([true, true, true, false]), { correct: 3, total: 4, passed: true });
  assert.deepEqual(summarize([true, false, false, false]), { correct: 1, total: 4, passed: false });
  assert.deepEqual(summarize([]), { correct: 0, total: 0, passed: false });
  assert.equal(summarize([true, false], 0.5).passed, true);
});

test('shuffle devuelve una copia con los mismos elementos y respeta rand', () => {
  const source = [1, 2, 3, 4, 5];
  const out = shuffle(source, () => 0);
  assert.notEqual(out, source);
  assert.deepEqual([...out].sort(), source);
  assert.deepEqual(source, [1, 2, 3, 4, 5]);
});

test('feedbackLead: Bien. si acierta; si no, lead o "Se dice:"', () => {
  assert.equal(feedbackLead({}, true), 'Bien.');
  assert.equal(feedbackLead({ lead: 'Era:' }, true), 'Bien.');
  assert.equal(feedbackLead({}, false), 'Se dice:');
  assert.equal(feedbackLead({ lead: 'Era:' }, false), 'Era:');
});

test('tracksProgress: solo track: false deja de marcar el tema', () => {
  assert.equal(tracksProgress({}), true);
  assert.equal(tracksProgress({ track: true }), true);
  assert.equal(tracksProgress({ track: false }), false);
});

test('playOrder: mezcla salvo con shuffle: false, y nunca cambia el set', () => {
  const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const reverse = () => 0;
  assert.deepEqual(playOrder({ items, shuffle: false }, reverse).map((item) => item.id), ['a', 'b', 'c']);
  assert.deepEqual(playOrder({ items }, reverse).map((item) => item.id), ['b', 'c', 'a']);
  assert.deepEqual(playOrder({ items, shuffle: true }, reverse).map((item) => item.id), ['b', 'c', 'a']);
  const kept = { items, shuffle: false };
  assert.notEqual(playOrder(kept), items, 'devuelve una copia');
  assert.deepEqual(items.map((item) => item.id), ['a', 'b', 'c']);
});
