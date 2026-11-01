import test from 'node:test';
import assert from 'node:assert/strict';
import { enrouteGroups } from '../src/data/english-enroute.js';
import { blindMessages, checkWords, controlChecks, relayCall } from '../src/data/english-radiofail.js';
import { eventKinds, eventLabels, eventVerbs, newsVideos, summaryPieces, tenseRules } from '../src/data/english-retell.js';
import { pictureSteps, pictureWords, positionWords, practicePhotos, exampleVideos } from '../src/data/english-picture.js';
import { existsSync } from 'node:fs';
import { audiences } from '../src/data/english-audiences.js';
import { audiencesSet, enrouteSet, pictureSet, radioFailSet, retellSet } from '../src/data/english-sets.js';
import { validateSet } from '../src/scripts/exercises/validate.js';
import { hasUnmatchedMarker } from '../src/scripts/mixed.js';

const DEM = 'Lima Victor Delta Echo Mike';
const sets = { enrouteSet, radioFailSet, retellSet, pictureSet, audiencesSet };
const noDigits = (text, where) => assert.doesNotMatch(text, /[0-9]/, `cifras en ${where}: ${text}`);

test('los sets nuevos son válidos y tienen diez preguntas', () => {
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

test('falla de comunicaciones: el control te prueba con IDENT o con un viraje, y contestás sin hablar', () => {
  assert.deepEqual(controlChecks.map((check) => check.id), ['ident', 'turn']);
  for (const check of controlChecks) {
    const [ask, answer, seen] = check.call;
    assert.match(ask.text, /^LV-DEM, reply not received\. If you read, /, `${check.id}: la pregunta sigue el formato de la OACI`);
    assert.equal(answer.kind, 'action', `${check.id}: la respuesta es una acción`);
    assert.equal(answer.say, undefined, `${check.id}: una acción no se lee en voz alta`);
    assert.match(seen.text, / observed[,.]/, `${check.id}: el control confirma con observed`);
    assert.match(seen.text, /I will continue to pass instructions\.$/);
  }
  assert.match(controlChecks[0].call[0].text, /squawk ident/);
  assert.ok(checkWords.every((word) => word.en && word.es));
});

test('falla de comunicaciones: el relevo pasa el mensaje con el nombre de la dependencia y se colaciona', () => {
  const spoken = (text) => text.replaceAll('LV-DEM', DEM).replaceAll('LV-KTR', 'Lima Victor Kilo Tango Romeo');
  for (const entry of [...relayCall, ...controlChecks.flatMap((check) => check.call)]) {
    if (entry.kind === 'action') continue;
    assert.equal(entry.say, spoken(entry.text), `say distinto del texto: ${entry.text}`);
    noDigits(entry.say, entry.text);
    if (entry.key) assert.ok(entry.text.includes(entry.key), `la frase clave no está en el texto: ${entry.text}`);
    assert.equal(hasUnmatchedMarker(entry.note ?? ''), false, `nota con asterisco sin pareja: ${entry.text}`);
  }
  assert.doesNotMatch(relayCall[0].text, /all stations/i, 'all stations no pide respuesta');
  const relayed = relayCall.find((entry) => entry.who === 'other' && /Laguna Tower (clears|advises)/.test(entry.text));
  assert.ok(relayed, 'el otro avión pasa el mensaje con el nombre de la dependencia');
  const readback = relayCall.at(-1);
  assert.equal(readback.kind, 'readback');
  assert.match(readback.text, /, LV-DEM\.$/);
  assert.ok(relayed.text.includes('QNH one zero one three') && readback.text.includes('QNH one zero one three'), 'la colación repite el QNH');
});

test('resumir: siete piezas en orden y cada noticia las recorre todas', () => {
  const ids = summaryPieces.map((piece) => piece.id);
  assert.deepEqual(ids, ['label', 'who', 'when', 'problem', 'decision', 'result', 'info']);
  assert.deepEqual(eventKinds.map((kind) => kind.id), ['accident', 'serious-incident', 'incident']);
  assert.deepEqual(tenseRules.map((rule) => rule.id), ['past-simple', 'past-continuous', 'passive']);
  for (const entry of [...summaryPieces, ...eventKinds, ...eventLabels, ...eventVerbs, ...tenseRules]) {
    assert.ok(entry.say?.trim(), `${entry.id}: falta el audio`);
  }
  for (const text of [...eventKinds.map((kind) => kind.body), ...tenseRules.map((rule) => rule.rule)]) {
    assert.equal(hasUnmatchedMarker(text), false, text);
  }
  assert.ok(newsVideos.length >= 5);
  assert.equal(new Set(newsVideos.map((video) => video.id)).size, newsVideos.length, 'videos repetidos');
  for (const video of newsVideos) {
    assert.match(video.id, /^[\w-]{11}$/);
    assert.deepEqual(video.summary.map((line) => line.piece), ids, `${video.id}: el resumen no sigue el orden`);
    assert.ok(video.source?.trim() && video.outlet && video.year, `${video.id}: falta la fuente`);
  }
});

test('resumir: el ejercicio de ordenar sigue el orden del resumen', () => {
  const order = retellSet.items.find((item) => item.type === 'order');
  assert.match(order.answer[0], /^This was an/);
  assert.match(order.answer.at(-1), /landed safely/);
});

test('describir: cuatro pasos, fotos con crédito y archivo, y una descripción por paso', () => {
  const steps = pictureSteps.map((step) => step.id);
  assert.deepEqual(steps, ['general', 'layout', 'action', 'guess']);
  assert.ok(positionWords.length >= 8);
  for (const group of pictureWords) assert.ok(group.words.length >= 4, group.id);
  assert.ok(practicePhotos.length >= 5);
  for (const photo of practicePhotos) {
    assert.ok(existsSync(new URL(`../public${photo.file}`, import.meta.url)), `${photo.id}: falta el archivo`);
    assert.deepEqual(photo.model.map((line) => line.step), steps, `${photo.id}: la descripción no sigue los pasos`);
    assert.ok(photo.alt && photo.width && photo.height && photo.words.length, `${photo.id}: falta algo`);
    assert.ok(photo.credit.author && photo.credit.license && photo.credit.url.startsWith('https://commons.wikimedia.org/'), `${photo.id}: crédito`);
  }
  for (const video of exampleVideos) assert.match(video.id, /^[\w-]{11}$/);
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
