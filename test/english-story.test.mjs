import test from 'node:test';
import assert from 'node:assert/strict';
import { enrouteGroups } from '../src/data/english-enroute.js';
import { blindMessages, failSteps, lightAcks, lightSignals } from '../src/data/english-radiofail.js';
import { incidentKinds, incidentStory, incidentTerms, tenseRules } from '../src/data/english-incident.js';
import { audiences } from '../src/data/english-audiences.js';
import { audiencesSet, enrouteSet, incidentSet, radioFailSet } from '../src/data/english-sets.js';
import { validateSet } from '../src/scripts/exercises/validate.js';
import { hasUnmatchedMarker } from '../src/scripts/mixed.js';

const DEM = 'Lima Victor Delta Echo Mike';
const sets = { enrouteSet, radioFailSet, incidentSet, audiencesSet };
const noDigits = (text, where) => assert.doesNotMatch(text, /[0-9]/, `cifras en ${where}: ${text}`);

test('los cuatro sets nuevos son válidos y tienen diez preguntas', () => {
  for (const [name, set] of Object.entries(sets)) {
    assert.deepEqual(validateSet(set), [], name);
    assert.equal(set.items.length, 10, `${name}: ${set.items.length} preguntas`);
  }
  const ids = Object.values(sets).map((set) => set.id);
  assert.equal(new Set(ids).size, ids.length, 'ids de set repetidos');
});

test('ninguna pregunta nueva escribe cifras en lo que se dice ni deja una opción repetida', () => {
  for (const [name, set] of Object.entries(sets)) {
    for (const item of set.items) {
      if (item.say !== undefined) noDigits(item.say, `${name}/${item.id}`);
      if (item.type === 'mcq') {
        assert.equal(new Set(item.options).size, item.options.length, `${name}/${item.id}: opciones repetidas`);
      }
      for (const text of [item.prompt, item.explain, set.lede].filter(Boolean)) {
        assert.equal(hasUnmatchedMarker(text), false, `${name}/${item.id}: asterisco sin pareja`);
      }
    }
  }
});

test('en ruta: tres grupos, con llamada y frases, y el inglés marcado entre asteriscos', () => {
  assert.deepEqual(enrouteGroups.map((group) => group.id), ['frecuencia', 'posicion', 'ida-al-aire']);
  for (const group of enrouteGroups) {
    assert.ok(group.title && group.lede, `${group.id}: falta título o bajada`);
    assert.ok(group.call.length >= 3, `${group.id}: llamada corta`);
    assert.ok(group.phrases.length >= 2, `${group.id}: pocas frases`);
    assert.equal(hasUnmatchedMarker(group.lede), false, `${group.id}: lede con asterisco sin pareja`);
  }
  const ids = enrouteGroups.flatMap((group) => group.phrases.map((phrase) => phrase.id));
  assert.equal(new Set(ids).size, ids.length, 'ids de frases repetidos');
});

test('en ruta: el distintivo va donde dice la convención y la voz lee lo mismo que se ve', () => {
  const lines = enrouteGroups.flatMap((group) => group.call.map((entry) => ({ ...entry, group: group.id })));
  for (const entry of lines) {
    const where = `${entry.group}: “${entry.text}”`;
    noDigits(entry.say, where);
    assert.equal(entry.say, entry.text.replaceAll('LV-DEM', DEM), `say distinto del texto: ${where}`);
    assert.equal(hasUnmatchedMarker(entry.note ?? ''), false, `nota con asterisco sin pareja: ${where}`);
    if (entry.who === 'tower') {
      assert.match(entry.text, /^LV-DEM,/, `la dependencia empieza con el distintivo: ${where}`);
      assert.ok(entry.unit, `falta la dependencia: ${where}`);
      continue;
    }
    assert.ok(['call', 'readback'].includes(entry.kind), `el piloto declara kind: ${where}`);
    if (entry.kind === 'readback') {
      assert.match(entry.text, /, LV-DEM\.$/, `una repetición termina con el distintivo: ${where}`);
      assert.doesNotMatch(entry.text, /^LV-DEM/, `una repetición no empieza con el distintivo: ${where}`);
    } else {
      assert.match(entry.text, /^(LV-DEM|(?:[A-Z][a-z]+ )+(Tower|Information), LV-DEM),/, `una llamada nueva empieza con el distintivo: ${where}`);
    }
    if (entry.key) assert.ok(entry.text.includes(entry.key), `la frase clave no está en el texto: ${where}`);
  }
  for (const entry of enrouteGroups.flatMap((group) => group.call)) {
    if (entry.key) assert.ok(entry.text.includes(entry.key));
  }
  for (const phrase of enrouteGroups.flatMap((group) => group.phrases)) {
    assert.equal(phrase.say, phrase.use.replaceAll('LV-DEM', DEM), `${phrase.id}: say distinto del ejemplo`);
    noDigits(phrase.say, phrase.id);
  }
});

test('en ruta: la frecuencia se repite y el cambio de frecuencia usa las frases de la OACI', () => {
  const [frequency] = enrouteGroups;
  const text = frequency.call.map((entry) => entry.text).join(' ');
  for (const phrase of ['contact', 'request change to', 'frequency change approved']) assert.ok(text.includes(phrase), phrase);
  const contact = frequency.call.find((entry) => entry.who === 'tower');
  const readback = frequency.call.find((entry) => entry.kind === 'readback');
  assert.ok(readback.text.includes('Costa Information one two six decimal five'));
  assert.ok(contact.text.includes('one two six decimal five'));
  assert.deepEqual(frequency.phrases.map((phrase) => phrase.id), ['contact', 'monitor', 'request-change', 'change-approved']);
});

test('falla de comunicaciones: los cuatro pasos van en orden y el primero es seguir volando', () => {
  assert.deepEqual(failSteps.map((step) => step.id), ['fly', 'code', 'blind', 'land']);
  for (const step of failSteps) assert.ok(step.title && step.body, `${step.id}: falta título o cuerpo`);
  assert.match(failSteps[1].title, /7600/);
  assert.match(failSteps[3].body, /AIP/, 'el último paso manda a la AIP de cada país');
});

test('falla de comunicaciones: a ciegas el mensaje va dos veces y el de receptor avisa la próxima transmisión', () => {
  assert.deepEqual(blindMessages.map((message) => message.id), ['no-contact', 'receiver']);
  const [noContact, receiver] = blindMessages;
  assert.equal(noContact.parts[0].text, 'Transmitting blind.');
  assert.equal(noContact.parts[1].text, noContact.parts[2].text, 'sin contacto el mensaje se repite igual');
  assert.equal(receiver.parts[0].text, 'Transmitting blind due to receiver failure.');
  assert.equal(receiver.parts[1].text, receiver.parts[2].text, 'con el receptor fallado el mensaje se repite completo');
  assert.match(receiver.parts[3].text, /^Next transmission at /);
  for (const message of blindMessages) {
    assert.equal(message.say, message.parts.map((part) => part.text).join(' ').replaceAll('LV-DEM', DEM));
    noDigits(message.say, message.id);
    for (const part of message.parts) assert.ok(part.label && part.text, `${message.id}: parte incompleta`);
  }
});

test('señales luminosas: las cinco de la tabla, cada una con su significado en vuelo y en tierra', () => {
  assert.deepEqual(lightSignals.map((signal) => signal.id), ['green-steady', 'green-flash', 'red-steady', 'red-flash', 'white-flash']);
  for (const signal of lightSignals) {
    assert.ok(['green', 'red', 'white'].includes(signal.color), `${signal.id}: color`);
    assert.equal(typeof signal.flash, 'boolean');
    assert.equal(signal.flash, signal.id.endsWith('-flash'), `${signal.id}: flash no coincide con el nombre`);
    assert.ok(signal.label && signal.air && signal.ground, `${signal.id}: falta algo`);
  }
  assert.match(lightSignals[0].air, /aterrizar/);
  assert.match(lightSignals[0].ground, /despegar/);
  assert.match(lightSignals[2].ground, /Detenete/);
  assert.deepEqual(lightAcks.map((ack) => ack.id), ['air-day', 'air-night', 'ground-day', 'ground-night']);
  assert.match(lightAcks[0].how, /base ni en final/);
});

test('incidentes: tres definiciones, ocho palabras y un relato que usa las tres formas', () => {
  assert.deepEqual(incidentKinds.map((kind) => kind.id), ['accident', 'serious-incident', 'incident']);
  assert.ok(incidentTerms.length >= 8);
  const ids = incidentTerms.map((term) => term.id);
  assert.equal(new Set(ids).size, ids.length, 'ids de palabras repetidos');
  for (const entry of [...incidentKinds, ...incidentTerms]) {
    assert.ok(entry.en && entry.es && entry.body && entry.use, `${entry.id}: falta algo`);
    assert.equal(entry.say, entry.use.replaceAll('LV-DEM', DEM));
    noDigits(entry.say, entry.id);
  }
  const formIds = tenseRules.map((rule) => rule.id);
  assert.deepEqual(formIds, ['past-simple', 'past-continuous', 'passive']);
  assert.equal(incidentStory.length, 6);
  for (const sentence of incidentStory) {
    assert.ok(formIds.includes(sentence.form), `${sentence.id}: forma desconocida`);
    assert.equal(sentence.say, sentence.text.replaceAll('LV-DEM', DEM));
    noDigits(sentence.say, sentence.id);
  }
  for (const form of formIds) assert.ok(incidentStory.some((sentence) => sentence.form === form), `ninguna oración usa ${form}`);
});

test('incidentes: el ejercicio de ordenar cuenta los hechos en el orden del relato', () => {
  const order = incidentSet.items.find((item) => item.type === 'order');
  const story = incidentStory.map((sentence) => sentence.text);
  const positions = order.answer.map((text) => story.indexOf(text));
  assert.ok(positions.every((position) => position >= 0), 'una ficha no es una oración del relato');
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b), 'el orden de la respuesta no sigue el relato');
});

test('tres públicos: la torre, la empresa y los pasajeros, con cuatro consejos y un ejemplo cada uno', () => {
  assert.deepEqual(audiences.map((audience) => audience.id), ['atc', 'ops', 'pax']);
  for (const audience of audiences) {
    assert.equal(audience.rules.length, 4, `${audience.id}: consejos`);
    assert.ok(audience.es && audience.when && audience.label && audience.text, `${audience.id}: falta algo`);
    assert.equal(audience.say, audience.text.replaceAll('LV-DEM', DEM));
    noDigits(audience.say, audience.id);
    for (const rule of audience.rules) assert.equal(hasUnmatchedMarker(rule), false, `${audience.id}: asterisco sin pareja`);
  }
  const [atc, ops, pax] = audiences;
  assert.match(atc.text, /^PAN PAN, PAN PAN, PAN PAN, Laguna Tower, LV-DEM,/, 'la torre recibe la señal tres veces y el distintivo');
  assert.doesNotMatch(ops.text, /PAN PAN|QNH/, 'el informe no lleva señales de radio');
  assert.doesNotMatch(pax.text, /PAN PAN|QNH|LV-DEM|MAYDAY/, 'los pasajeros no escuchan jerga de radio');
});
