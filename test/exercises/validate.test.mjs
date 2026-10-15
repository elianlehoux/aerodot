import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSet } from '../../src/scripts/exercises/validate.js';
import { clearanceSet, hearbackSet, survivalSet, weatherSet } from '../../src/data/english-sets.js';
import { clearanceExamples, clearanceParts, craftExample, hearbackCases, hearbackDrills, readbackItems } from '../../src/data/english-clearance.js';
import { normalize } from '../../src/scripts/exercises/grade.js';
import { survivalCall, survivalGroups } from '../../src/data/english-survival.js';
import { hasUnmatchedMarker } from '../../src/scripts/mixed.js';

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

test('prompt y explain: un asterisco sin pareja es un error', () => {
  const prompt = good(); prompt.items[0].prompt = 'Se dice *say again';
  assert.ok(validateSet(prompt).some((e) => e.includes('asterisco')));
  const explain = good(); explain.items[1].explain = '*Roger* no es *wilco';
  assert.ok(validateSet(explain).some((e) => e.includes('asterisco')));
  const ok = good(); ok.items[1].prompt = '*Roger* no es *wilco*'; ok.items[1].explain = 'Es *wilco*.';
  assert.deepEqual(validateSet(ok), []);
});

test('supervivencia: en la llamada, lo que se lee y lo que dice la voz son la misma frase', () => {
  for (const line of survivalCall) {
    const shown = line.parts.map((part) => part.text).join('').replaceAll('LV-DEM', 'Lima Victor Delta Echo Mike');
    assert.equal(shown, line.say);
  }
});

test('supervivencia: los asteriscos del inglés en los textos en español van de a pares', () => {
  const texts = [
    ...survivalGroups.flatMap((group) => [group.lede, ...[...group.phrases, ...(group.aside ? [group.aside] : [])].map((phrase) => phrase.body)]),
    ...survivalCall.map((line) => line.note),
  ];
  for (const text of texts) assert.equal(hasUnmatchedMarker(text), false, text);
});

/* ---- Autorización y colación ---- */

test('track: si está, debe ser true o false', () => {
  const ok = good(); ok.track = false;
  assert.deepEqual(validateSet(ok), []);
  const bad = good(); bad.track = 'no';
  assert.ok(validateSet(bad).some((e) => e.includes('track')));
});

test('el set de autorización que se publica es válido y tiene los tipos que pide el módulo', () => {
  assert.deepEqual(validateSet(clearanceSet), []);
  assert.equal(clearanceSet.id, 'clearance-say');
  assert.equal(clearanceSet.slug, 'autorizacion');
  assert.equal(clearanceSet.items.length, 10);
  const count = (type) => clearanceSet.items.filter((item) => item.type === type).length;
  assert.ok(count('order') >= 1 && count('gap') >= 1 && count('tf') >= 1);
  const order = clearanceSet.items.find((item) => item.type === 'order');
  assert.ok(order.tokens.length >= 5 && order.tokens.length <= 7, 'la colación para armar tiene de 5 a 7 fichas');
  assert.equal(order.answer.at(-1), 'LV-DEM', 'la colación termina con el distintivo');
  for (const drill of hearbackDrills) {
    const item = clearanceSet.items.find((entry) => entry.id === drill.id);
    assert.ok(item, `falta el ítem del caso ${drill.id}`);
    assert.equal(item.type, 'mcq');
    assert.equal(item.options[item.answer], drill.wrong.label);
  }
  assert.equal(hearbackDrills.length, 3);
});

test('el set de los casos de hearback es válido, no marca el tema y cada mcq apunta al dato mal colacionado', () => {
  assert.deepEqual(validateSet(hearbackSet), []);
  assert.equal(hearbackSet.track, false);
  assert.equal(hearbackCases.length, 3);
  assert.equal(hearbackSet.items.length, hearbackCases.length);
  hearbackCases.forEach((entry, index) => {
    const item = hearbackSet.items[index];
    assert.equal(item.type, 'mcq');
    assert.equal(item.options[item.answer], entry.wrong.label);
  });
});

/** Palabras comparables, sin el distintivo: la torre lo dice primero y el piloto al final. */
const words = (text) => normalize(text).split(' ').filter((word) => word && word !== 'lv-dem');
const indexOf = (list, part) => list.findIndex((_, i) => part.every((word, j) => list[i + j] === word));

test('hearback: la colación difiere de lo que dijo la torre solo en el dato que el caso declara', () => {
  for (const entry of [...hearbackCases, ...hearbackDrills]) {
    assert.match(entry.tower, /^LV-DEM, /, `${entry.id}: la torre empieza por el distintivo`);
    assert.match(entry.pilot, /, LV-DEM\.$/, `${entry.id}: la colación termina con el distintivo`);
    const tower = words(entry.tower);
    const pilot = words(entry.pilot);
    const towerField = words(entry.wrong.tower);
    const pilotField = words(entry.wrong.pilot);
    assert.notDeepEqual(towerField, pilotField, `${entry.id}: el dato mal colacionado tiene que ser distinto`);
    const at = indexOf(tower, towerField);
    assert.ok(at >= 0, `${entry.id}: la torre no dice "${entry.wrong.tower}"`);
    assert.deepEqual(pilot.slice(at, at + pilotField.length), pilotField, `${entry.id}: el piloto no dice "${entry.wrong.pilot}" en el mismo lugar`);
    const restTower = [...tower.slice(0, at), ...tower.slice(at + towerField.length)];
    const restPilot = [...pilot.slice(0, at), ...pilot.slice(at + pilotField.length)];
    assert.deepEqual(restPilot, restTower, `${entry.id}: hay otra diferencia además de ${entry.wrong.label}`);
  }
});

test('autorización: las cifras de say van en palabras', () => {
  const says = [
    craftExample.say, craftExample.readbackSay,
    ...clearanceParts.map((part) => part.say),
    ...clearanceExamples.flatMap((card) => [card.say, card.replySay]),
    ...[...hearbackCases, ...hearbackDrills].flatMap((entry) => [entry.towerSay, entry.pilotSay]),
    ...readbackItems.filter((item) => item.en).map((item) => item.say),
    ...[...clearanceSet.items, ...hearbackSet.items].map((item) => item.say).filter((say) => say !== undefined),
  ];
  for (const say of says) {
    assert.ok(typeof say === 'string' && say.trim(), 'say vacío');
    assert.doesNotMatch(say, /[0-9]/, `say con cifras: ${say}`);
  }
});

test('autorización: CRAFT son cinco piezas y el ejemplo se arma con ellas', () => {
  assert.deepEqual(clearanceParts.map((part) => part.letter), ['C', 'R', 'A', 'F', 'T']);
  for (const part of clearanceParts) {
    for (const field of ['id', 'letter', 'en', 'es', 'piece', 'say', 'body']) assert.ok(part[field]?.trim(), `${part.id}: falta ${field}`);
    const pieces = craftExample.parts.filter((chunk) => chunk.part === part.id);
    assert.equal(pieces.length, 1, `${part.id}: la pieza aparece una vez en el ejemplo`);
    assert.equal(pieces[0].text, part.piece);
  }
  const shown = craftExample.parts.map((chunk) => chunk.text).join('');
  assert.equal(shown, craftExample.text);
  assert.equal(shown.replaceAll('LV-DEM', 'Lima Victor Delta Echo Mike'), craftExample.say);
  assert.match(craftExample.text, /^LV-DEM, /);
  assert.match(craftExample.readback, /, LV-DEM\.$/);
  assert.equal(craftExample.readback.replaceAll('LV-DEM', 'Lima Victor Delta Echo Mike'), craftExample.readbackSay);
});

test('autorización: las tarjetas del circuito, la lista y los asteriscos', () => {
  const ids = clearanceExamples.map((card) => card.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const card of clearanceExamples) {
    for (const field of ['id', 'en', 'es', 'kind', 'tower', 'say', 'reply', 'replySay', 'body']) assert.ok(card[field]?.trim(), `${card.id}: falta ${field}`);
    assert.match(card.tower, /^LV-DEM, /, `${card.id}: la torre empieza por el distintivo`);
    assert.match(card.reply, /, LV-DEM\.$/, `${card.id}: la respuesta termina con el distintivo`);
    assert.equal(card.tower.replaceAll('LV-DEM', 'Lima Victor Delta Echo Mike'), card.say);
    assert.equal(card.reply.replaceAll('LV-DEM', 'Lima Victor Delta Echo Mike'), card.replySay);
  }
  assert.ok(clearanceExamples.some((card) => card.en === 'report downwind' && card.body.includes('inicial')));
  const texts = [
    ...clearanceParts.map((part) => part.body),
    ...clearanceExamples.map((card) => card.body),
    ...readbackItems.map((item) => item.es),
    ...[...hearbackCases, ...hearbackDrills].map((entry) => entry.explain),
  ];
  for (const text of texts) {
    assert.ok(text?.trim(), 'texto vacío');
    assert.equal(hasUnmatchedMarker(text), false, text);
  }
});

test('lead: si está, debe ser un texto no vacío', () => {
  const ok = good(); ok.items[0].lead = 'Era:';
  assert.deepEqual(validateSet(ok), []);
  for (const bad of ['', '  ', 3]) {
    const s = good(); s.items[0].lead = bad;
    assert.ok(validateSet(s).some((e) => e.includes('lead')), `debería rechazar ${JSON.stringify(bad)}`);
  }
});

test('hearback: las preguntas de los casos usan un lead neutro', () => {
  for (const item of [...hearbackSet.items, ...clearanceSet.items.filter((entry) => entry.id.startsWith('hb-'))]) {
    assert.ok(item.lead?.trim(), `${item.id} sin lead`);
  }
});
