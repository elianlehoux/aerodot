import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMessage } from '../src/scripts/emergency.js';
import {
  emergencyExample,
  emergencyIntentions,
  emergencyLevels,
  emergencyNatures,
  emergencyOrder,
  emergencyPositions,
  emergencyExtra,
  squawkCodes,
} from '../src/data/english-emergency.js';
import { hasUnmatchedMarker } from '../src/scripts/mixed.js';

const DEM = 'Lima Victor Delta Echo Mike';

const base = {
  level: 'mayday',
  station: 'Laguna Tower',
  callsign: 'LV-DEM',
  nature: 'engine-failure',
  intention: 'forced-landing',
  position: emergencyPositions[0].id,
  extra: '',
};

test('buildMessage arma las piezas en el orden de emergencyOrder', () => {
  const full = buildMessage({ ...base, extra: emergencyExtra.en });
  assert.deepEqual(full.parts.map((part) => part.id), emergencyOrder.map((piece) => piece.id));
  assert.equal(full.text, full.parts.map((part) => part.text).join(', ') + '.');
});

test('el orden oficial es señal, estación, distintivo, naturaleza, intención y posición; lo demás se suele agregar', () => {
  assert.deepEqual(emergencyOrder.map((piece) => piece.id), ['signal', 'station', 'callsign', 'nature', 'intention', 'position', 'extra']);
  for (const piece of emergencyOrder) {
    for (const field of ['id', 'es', 'en', 'hint']) assert.ok(piece[field]?.trim(), `${piece.id}: falta ${field}`);
    assert.equal(typeof piece.official, 'boolean', `${piece.id}: official debe ser true o false`);
  }
  assert.deepEqual(emergencyOrder.filter((piece) => !piece.official).map((piece) => piece.id), ['extra']);
});

test('buildMessage repite la señal tres veces', () => {
  const mayday = buildMessage(base);
  assert.equal(mayday.text.match(/mayday/gi).length, 3);
  assert.match(mayday.text, /^MAYDAY, MAYDAY, MAYDAY, /);
  const pan = buildMessage({ ...base, level: 'panpan', nature: 'rough-engine', intention: 'return' });
  assert.equal(pan.say.match(/pan[- ]pan/gi).length, 3);
  assert.match(pan.text, /^PAN PAN, PAN PAN, PAN PAN, /);
});

test('buildMessage pone la estación y después el distintivo LV-DEM, en su lugar', () => {
  const message = buildMessage(base);
  const callsign = message.parts.find((part) => part.id === 'callsign');
  assert.equal(callsign.text, 'LV-DEM');
  assert.equal(message.parts.findIndex((part) => part.id === 'station') + 1, message.parts.findIndex((part) => part.id === 'callsign'));
  assert.ok(message.say.includes(DEM));
  assert.ok(!message.say.includes('LV-DEM'));
});

test('buildMessage omite las piezas vacías', () => {
  const message = buildMessage(base);
  assert.equal(message.parts.some((part) => part.id === 'extra'), false);
  assert.doesNotMatch(message.text, /, ,|,\./);
  const blankStation = buildMessage({ ...base, station: '  ' });
  assert.equal(blankStation.parts.some((part) => part.id === 'station'), false);
});

test('buildMessage nunca devuelve cifras en say', () => {
  for (const level of emergencyLevels) {
    for (const nature of emergencyNatures.filter((entry) => entry.levels.includes(level.id))) {
      for (const intention of emergencyIntentions.filter((entry) => entry.levels.includes(level.id))) {
        for (const position of emergencyPositions) {
          for (const extra of ['', emergencyExtra.en]) {
            const message = buildMessage({ ...base, level: level.id, nature: nature.id, intention: intention.id, position: position.id, extra });
            assert.doesNotMatch(message.say, /[0-9]/, message.say);
            assert.doesNotMatch(message.text, /[0-9]/, message.text);
          }
        }
      }
    }
  }
});

test('buildMessage lanza un error claro si falta el nivel o la naturaleza, o si no corresponden', () => {
  assert.throws(() => buildMessage({ ...base, level: '' }), /nivel/);
  assert.throws(() => buildMessage({ ...base, level: 'socorro' }), /nivel/);
  assert.throws(() => buildMessage({ ...base, nature: undefined }), /naturaleza/);
  assert.throws(() => buildMessage({ ...base, nature: 'xyz' }), /naturaleza/);
  assert.throws(() => buildMessage({ ...base, level: 'panpan', nature: 'fire' }), /no corresponde/);
  assert.throws(() => buildMessage({ ...base, level: 'panpan', nature: 'rough-engine', intention: 'forced-landing' }), /no corresponde/);
  assert.throws(() => buildMessage({ ...base, level: 'panpan', nature: 'fuel', intention: 'return' }), /no corresponde/);
  assert.throws(() => buildMessage({ ...base, level: 'panpan', nature: 'engine-failure', intention: 'return' }), /no corresponde/);
});

test('el motor irregular vale con las dos señales; combustible, fuego y aterrizaje forzoso solo con MAYDAY', () => {
  assert.doesNotThrow(() => buildMessage({ ...base, level: 'panpan', nature: 'rough-engine', intention: 'return' }));
  assert.doesNotThrow(() => buildMessage({ ...base, level: 'mayday', nature: 'rough-engine' }));
  for (const id of ['fuel', 'fire', 'engine-failure']) {
    assert.deepEqual(emergencyNatures.find((nature) => nature.id === id).levels, ['mayday'], id);
  }
  assert.deepEqual(emergencyIntentions.find((intention) => intention.id === 'forced-landing').levels, ['mayday']);
  assert.ok(emergencyNatures.find((nature) => nature.id === 'rough-engine').note?.trim(), 'el motor irregular explica cuándo es cada uno');
});

test('buildMessage lanza un error claro si la intención o la posición no existen', () => {
  assert.throws(() => buildMessage({ ...base, intention: 'xyz' }), /intención/);
  assert.throws(() => buildMessage({ ...base, position: 'xyz' }), /posición/);
});

test('los dos niveles, las opciones del armador y los códigos tienen todos sus campos', () => {
  assert.deepEqual(emergencyLevels.map((level) => level.id), ['mayday', 'panpan']);
  for (const level of emergencyLevels) {
    for (const field of ['id', 'en', 'es', 'say', 'body', 'when', 'example', 'exampleSay']) assert.ok(level[field]?.trim(), `${level.id}: falta ${field}`);
  }
  for (const level of emergencyLevels) {
    assert.ok(emergencyNatures.some((nature) => nature.levels.includes(level.id)), `${level.id} sin naturalezas`);
  }
  for (const option of [...emergencyNatures, ...emergencyIntentions, ...emergencyPositions]) {
    for (const field of ['id', 'en', 'es']) assert.ok(option[field]?.trim(), `${option.id}: falta ${field}`);
  }
  assert.deepEqual(squawkCodes.map((code) => code.code), ['7700', '7600', '7500']);
  for (const code of squawkCodes) {
    for (const field of ['code', 'en', 'es', 'say', 'body']) assert.ok(code[field]?.trim(), `${code.code}: falta ${field}`);
  }
  const ids = [...emergencyNatures, ...emergencyIntentions, ...emergencyPositions].map((option) => option.id);
  assert.equal(new Set(ids).size, ids.length, 'ids repetidos');
});

test('emergencias: las cifras de say van en palabras y los códigos se dicen cifra por cifra', () => {
  const says = [
    ...emergencyLevels.flatMap((level) => [level.say, level.exampleSay]),
    ...emergencyOrder.map((piece) => piece.say),
    ...squawkCodes.map((code) => code.say),
    emergencyExample.say,
  ];
  for (const say of says) {
    assert.ok(typeof say === 'string' && say.trim(), 'say vacío');
    assert.doesNotMatch(say, /[0-9]/, `say con cifras: ${say}`);
  }
  const words = { 7: 'seven', 6: 'six', 5: 'five', 0: 'zero' };
  for (const code of squawkCodes) {
    assert.match(code.say, new RegExp([...code.code].map((digit) => words[digit]).join(' ')), code.say);
  }
});

test('emergencias: el ejemplo de la cinta es el mensaje del armador y cada pieza tiene su trozo', () => {
  assert.equal(emergencyOrder.find((piece) => piece.id === 'signal').say, 'Mayday, mayday, mayday.', 'la voz lee la señal en minúsculas');
  for (const piece of emergencyOrder) {
    const part = emergencyExample.parts.find((entry) => entry.id === piece.id);
    assert.ok(part, `${piece.id}: falta en el ejemplo`);
    assert.equal(piece.example, part.text);
  }
});

test('emergencias: los asteriscos del inglés en los textos en español van de a pares', () => {
  const texts = [
    ...emergencyLevels.flatMap((level) => [level.body, level.when]),
    ...emergencyOrder.map((piece) => piece.hint),
    ...emergencyNatures.map((nature) => nature.note).filter(Boolean),
    ...squawkCodes.map((code) => code.body),
  ];
  for (const text of texts) assert.equal(hasUnmatchedMarker(text), false, text);
});
