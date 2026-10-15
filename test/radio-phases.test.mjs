import test from 'node:test';
import assert from 'node:assert/strict';
import { radioPhases } from '../src/data/english-phases.js';
import { radioPhasesSet } from '../src/data/english-sets.js';
import { normalize } from '../src/scripts/exercises/grade.js';
import { hasUnmatchedMarker } from '../src/scripts/mixed.js';

const DEM = 'Lima Victor Delta Echo Mike';
const PHASE_IDS = ['puesta-en-marcha', 'rodaje', 'punto-de-espera', 'despegue', 'ascenso', 'circuito', 'aterrizaje', 'estacionamiento'];
const lines = radioPhases.flatMap((phase) => phase.lines.map((line) => ({ ...line, phase: phase.id })));
const phrases = radioPhases.flatMap((phase) => phase.phrases);

test('radio por fase: las ocho fases existen, en orden y con ids únicos', () => {
  assert.deepEqual(radioPhases.map((phase) => phase.id), PHASE_IDS);
  for (const phase of radioPhases) {
    for (const field of ['id', 'es', 'en', 'summary', 'listen']) assert.ok(phase[field]?.trim(), `${phase.id}: falta ${field}`);
  }
});

test('radio por fase: cada fase tiene de 4 a 6 líneas y de 3 a 4 frases', () => {
  for (const phase of radioPhases) {
    assert.ok(phase.lines.length >= 4 && phase.lines.length <= 6, `${phase.id}: ${phase.lines.length} líneas`);
    assert.ok(phase.phrases.length >= 3 && phase.phrases.length <= 4, `${phase.id}: ${phase.phrases.length} frases`);
    for (const phrase of phase.phrases) {
      for (const field of ['id', 'en', 'es', 'say', 'use', 'body']) assert.ok(phrase[field]?.trim(), `${phase.id}/${phrase.id}: falta ${field}`);
    }
  }
  const ids = phrases.map((phrase) => phrase.id);
  assert.equal(new Set(ids).size, ids.length, 'ids de frases repetidos');
});

test('radio por fase: el hablante alterna salvo que una nota lo justifique', () => {
  for (const phase of radioPhases) {
    phase.lines.forEach((line, index) => {
      assert.ok(['pilot', 'tower'].includes(line.who), `${phase.id}[${index}]: who inválido`);
      if (index > 0 && phase.lines[index - 1].who === line.who) {
        assert.ok(line.note?.trim(), `${phase.id}[${index}]: dos turnos seguidos de ${line.who} sin nota`);
      }
    });
  }
});

test('radio por fase: ningún say tiene cifras y la voz lee lo mismo que se ve', () => {
  const says = [
    ...lines.map((line) => line.say),
    ...phrases.map((phrase) => phrase.say),
    ...radioPhasesSet.items.map((item) => item.say).filter((say) => say !== undefined),
  ];
  for (const say of says) {
    assert.ok(typeof say === 'string' && say.trim(), 'say vacío');
    assert.doesNotMatch(say, /[0-9]/, `say con cifras: ${say}`);
  }
  for (const line of lines) assert.equal(line.say, line.text.replaceAll('LV-DEM', DEM), `${line.phase}: say distinto del texto`);
  for (const phrase of phrases) assert.equal(phrase.say, phrase.use.replaceAll('LV-DEM', DEM), `${phrase.id}: say distinto del ejemplo`);
});

test('radio por fase: el distintivo va donde dice la convención (CAP 413 2.49)', () => {
  for (const line of lines) {
    const where = `${line.phase}: “${line.text}”`;
    if (line.who === 'tower') {
      assert.match(line.text, /^(LV-DEM|Laguna (Tower|Ground)),/, `la torre empieza con el distintivo o la dependencia: ${where}`);
      continue;
    }
    assert.ok(['call', 'readback'].includes(line.kind), `el piloto declara kind call o readback: ${where}`);
    if (line.kind === 'readback') {
      assert.match(line.text, /, LV-DEM\.$/, `una colación o acuse termina con el distintivo: ${where}`);
      assert.doesNotMatch(line.text, /^LV-DEM/, `una colación no empieza con el distintivo: ${where}`);
    } else {
      assert.match(line.text, /^(LV-DEM|Laguna (Tower|Ground), LV-DEM),/, `una llamada nueva empieza con el distintivo: ${where}`);
    }
  }
});

test('radio por fase: la frase clave resaltada está en la línea y cada fase tiene al menos una', () => {
  for (const phase of radioPhases) {
    assert.ok(phase.lines.some((line) => line.key), `${phase.id}: sin frase clave`);
    for (const line of phase.lines) {
      if (line.key) assert.ok(line.text.includes(line.key), `${phase.id}: la clave “${line.key}” no está en “${line.text}”`);
    }
  }
});

test('radio por fase: los asteriscos del inglés van de a pares', () => {
  const texts = [
    ...radioPhases.flatMap((phase) => [phase.summary, phase.listen]),
    ...lines.map((line) => line.note).filter(Boolean),
    ...phrases.map((phrase) => phrase.body),
  ];
  for (const text of texts) assert.equal(hasUnmatchedMarker(text), false, text);
});

/* ---- La práctica ---- */

const phaseOf = (id) => radioPhases.find((phase) => phase.id === id);

test('radio por fase: el set tiene 12 ítems, los tipos que pide el módulo y cada ítem declara su fase', () => {
  assert.equal(radioPhasesSet.id, 'radio-say');
  assert.equal(radioPhasesSet.slug, 'radio-fases');
  assert.equal(radioPhasesSet.passMark, undefined, 'passMark por defecto');
  assert.equal(radioPhasesSet.items.length, 12);
  for (const item of radioPhasesSet.items) assert.ok(PHASE_IDS.includes(item.phase), `${item.id}: fase inexistente (${item.phase})`);
  const count = (type) => radioPhasesSet.items.filter((item) => item.type === type).length;
  assert.ok(count('order') >= 2 && count('gap') >= 1 && count('tf') >= 1 && count('mcq') >= 4);
});

test('radio por fase: los order son mensajes del piloto que están en el diálogo de su fase', () => {
  const orders = radioPhasesSet.items.filter((item) => item.type === 'order');
  assert.ok(orders.length >= 2);
  for (const item of orders) {
    const said = phaseOf(item.phase).lines.filter((line) => line.who === 'pilot').map((line) => normalize(line.text));
    assert.ok(said.includes(normalize(item.answer.join(' '))), `${item.id}: la respuesta no es una línea del piloto en ${item.phase}`);
  }
});

test('radio por fase: elegí la frase en tres fases distintas, con la clave tomada del diálogo', () => {
  const picks = radioPhasesSet.items.filter((item) => item.pick === true);
  assert.equal(new Set(picks.map((item) => item.phase)).size >= 3, true, 'hacen falta tres fases distintas');
  for (const item of picks) {
    assert.equal(item.type, 'mcq', `${item.id}: pick es mcq`);
    const said = phaseOf(item.phase).lines.map((line) => normalize(line.text)).join(' | ');
    assert.ok(said.includes(normalize(item.options[item.answer])), `${item.id}: la clave no está en el diálogo de ${item.phase}`);
    assert.ok(item.explain?.trim(), `${item.id}: falta el porqué`);
  }
});

test('radio por fase: la pregunta de en qué fase se dice algo apunta a su fase', () => {
  const asks = radioPhasesSet.items.filter((item) => item.ask === 'phase');
  assert.ok(asks.length >= 1, 'falta el ítem de en qué fase');
  for (const item of asks) {
    assert.equal(item.type, 'mcq');
    assert.equal(item.options[item.answer], phaseOf(item.phase).en, `${item.id}: la clave no es la fase declarada`);
    for (const option of item.options) assert.ok(radioPhases.some((phase) => phase.en === option), `${item.id}: “${option}” no es una fase`);
  }
});
