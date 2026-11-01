/**
 * Mayday y Pan Pan: cuándo es socorro y cuándo urgencia, el mensaje en el orden de la norma
 * y los códigos del transpondedor.
 *
 * Fuentes (los textos en español son propios):
 * - Definiciones de socorro y urgencia, la señal "preferiblemente" tres veces y el orden de los
 *   elementos del mensaje: SERA.14095 (Reglamento (UE) 923/2012), que toma la norma de la OACI
 *   (Anexo 10, Vol. II, 5.3). Lo mismo en el manual de radio británico (CAP 413, 8.2, 8.3 y 8.13).
 * - PAN PAN MEDICAL anuncia un transporte sanitario protegido: SERA.14095 (c)(4) y CAP 413, 8.14.
 * - MAYDAY FUEL y MINIMUM FUEL: CAP 413, 8.29 a 8.32.
 * - Códigos 7700, 7600 y 7500: SERA.13005 (a); en EE. UU., el AIM de la FAA, 6-2 y 6-3.
 * - Lo que se suele agregar al final (personas a bordo, autonomía): CAP 413, 8.13 (9), y AIM 6-3-2.
 *
 * En body, when, hint y note, el inglés va entre asteriscos: la página les pone lang="en".
 * Laguna, Santa Brisa, LV-DEM y todas las cifras (distancias, altitudes, rumbos) son de práctica.
 * Las cifras de say van en palabras; se escribe three, four, five y nine (ver english.js).
 */

const DEM = 'Lima Victor Delta Echo Mike';

/** Lo que lee la voz: el mismo texto, con la matrícula deletreada. */
export const spoken = (text) => text.replaceAll('LV-DEM', DEM);

/** Socorro y urgencia. signal es lo que abre el mensaje; say, cómo lo lee la voz. */
export const emergencyLevels = [
  {
    id: 'mayday',
    en: 'MAYDAY',
    es: 'Socorro',
    signal: 'MAYDAY, MAYDAY, MAYDAY',
    say: 'Mayday, mayday, mayday.',
    body: 'Peligro grave o inminente. Necesitás ayuda ya.',
    when: 'Motor detenido, fuego a bordo, combustible que no alcanza.',
  },
  {
    id: 'panpan',
    en: 'PAN PAN',
    es: 'Urgencia',
    signal: 'PAN PAN, PAN PAN, PAN PAN',
    say: 'Pan pan, pan pan, pan pan.',
    body: 'Algo compromete la seguridad, pero no necesitás ayuda ya.',
    when: 'Motor irregular que te sostiene, pasajero descompuesto pero estable.',
  },
];

/**
 * Los elementos del mensaje, en el orden de SERA.14095 (b)(1).
 * official: true si la norma lo pone en la lista; false si es lo que se suele agregar.
 */
const order = [
  {
    id: 'signal',
    en: 'distress signal',
    es: 'La señal',
    official: true,
    hint: 'Tres veces. Tu mensaje pasa primero.',
  },
  {
    id: 'station',
    en: 'station addressed',
    es: 'A quién llamás',
    official: true,
    hint: 'La dependencia de la frecuencia que tenés puesta. Si no hay tiempo, se saltea.',
  },
  {
    id: 'callsign',
    en: 'aircraft identification',
    es: 'Tu distintivo',
    official: true,
    hint: 'Tu matrícula. Podés sumar el tipo de avión.',
  },
  {
    id: 'nature',
    en: 'nature of the distress condition',
    es: 'Qué pasa',
    official: true,
    hint: 'Corto: *engine failure*, *fire on board*.',
  },
  {
    id: 'intention',
    en: 'intention of the pilot-in-command',
    es: 'Qué vas a hacer',
    official: true,
    hint: 'Con *intend*: aterrizar, aterrizaje forzoso o volver.',
  },
  {
    id: 'position',
    en: 'present position, level and heading',
    es: 'Dónde estás',
    official: true,
    hint: 'Posición, altura y rumbo. Si no sabés, la última posición conocida.',
  },
  {
    id: 'extra',
    en: 'any other useful information',
    es: 'Se suele agregar',
    official: false,
    hint: 'Personas a bordo y autonomía.',
  },
];

/**
 * Qué pasa. levels: con qué señal se puede decir (lo que decide es si necesitás ayuda inmediata,
 * SERA.14095 (a)(1)); note, una aclaración que muestra el armador.
 */
export const emergencyNatures = [
  { id: 'engine-failure', en: 'engine failure', es: 'Motor detenido (monomotor)', levels: ['mayday'] },
  { id: 'fire', en: 'fire on board', es: 'Fuego a bordo', levels: ['mayday'] },
  {
    id: 'fuel',
    en: 'low fuel',
    es: 'Poco combustible',
    levels: ['mayday'],
    note: 'Por combustible se declara *MAYDAY* (o *MAYDAY FUEL*). *Minimum fuel* es solo un aviso, no una emergencia.',
  },
  {
    id: 'medical',
    en: 'passenger taken ill',
    es: 'Pasajero descompuesto',
    levels: ['mayday', 'panpan'],
    note: 'Estable, *PAN PAN*. Si su vida corre peligro, *MAYDAY*.',
  },
  {
    id: 'rough-engine',
    en: 'rough running engine',
    es: 'Motor irregular',
    levels: ['panpan', 'mayday'],
    note: 'Si te sostiene, *PAN PAN*. Si perdés altura y vas a aterrizar donde puedas, *MAYDAY*.',
  },
];

/** Qué vas a hacer. levels: con qué señal tiene sentido (un aterrizaje forzoso es socorro). */
export const emergencyIntentions = [
  { id: 'land-laguna', en: 'intend to land at Laguna', es: 'Aterrizar en Laguna', levels: ['mayday', 'panpan'] },
  { id: 'forced-landing', en: 'intend forced landing', es: 'Aterrizaje forzoso', levels: ['mayday'] },
  { id: 'return', en: 'intend to return to Santa Brisa', es: 'Volver a Santa Brisa', levels: ['mayday', 'panpan'] },
];

/** Dónde estás: tres posiciones de práctica, con altura y rumbo hacia Laguna. */
export const emergencyPositions = [
  { id: 'south', en: 'five miles south of Laguna, two thousand feet, heading three six zero', es: '5 millas al sur, 2000 pies, rumbo 360' },
  { id: 'east', en: 'eight miles east of Laguna, two thousand five hundred feet, heading two seven zero', es: '8 millas al este, 2500 pies, rumbo 270' },
  { id: 'north', en: 'six miles north of Laguna, three thousand feet, heading one eight zero', es: '6 millas al norte, 3000 pies, rumbo 180' },
];

/** Lo que se suele agregar al final. */
/* Solo las personas a bordo: con un aterrizaje forzoso en curso, la autonomía no le sirve a nadie. */
export const emergencyExtra = { en: 'two persons on board', es: 'Personas a bordo' };

/** La estación y el distintivo de práctica. */
export const emergencyStation = 'Laguna Tower';
export const emergencyCallsign = 'LV-DEM';

const byId = (list, id) => list.find((entry) => entry.id === id);

/**
 * Arma las piezas con los ids ya validados, en el orden de la norma. Omite las vacías.
 * buildMessage (scripts/emergency.js) valida antes de llamarla.
 */
export const composeMessage = ({ level, station, callsign, nature, intention, position, extra }) => {
  const texts = {
    signal: byId(emergencyLevels, level).signal,
    station,
    callsign,
    nature: byId(emergencyNatures, nature).en,
    intention: byId(emergencyIntentions, intention)?.en,
    position: byId(emergencyPositions, position)?.en,
    extra,
  };
  const parts = order
    .map((piece) => ({ id: piece.id, text: String(texts[piece.id] ?? '').trim() }))
    .filter((part) => part.text);
  const text = `${parts.map((part) => part.text).join(', ')}.`;
  /* La voz lee la señal en minúsculas, para que no la deletree. */
  const signal = byId(emergencyLevels, level);
  const say = spoken(text.replace(signal.signal, signal.say.slice(0, -1)));
  return { text, say, parts };
};

/** El mensaje de ejemplo de la cinta: socorro con el motor detenido. */
const exampleChoice = {
  level: 'mayday',
  station: emergencyStation,
  callsign: emergencyCallsign,
  nature: 'engine-failure',
  intention: 'forced-landing',
  position: 'south',
  extra: emergencyExtra.en,
};
export const emergencyExample = composeMessage(exampleChoice);

/** Los elementos con el trozo del ejemplo y su audio. */
export const emergencyOrder = order.map((piece) => {
  const text = emergencyExample.parts.find((part) => part.id === piece.id).text;
  /* La señal se lee en minúsculas, como en el armador, para que la voz no la deletree. */
  const say = piece.id === 'signal' ? emergencyLevels[0].say : spoken(text);
  return { ...piece, example: text, say };
});

/** Un ejemplo completo por nivel, para las tarjetas comparadas. */
const levelExamples = {
  mayday: emergencyExample,
  panpan: composeMessage({ ...exampleChoice, level: 'panpan', nature: 'rough-engine', intention: 'return', position: 'east', extra: '' }),
};
for (const level of emergencyLevels) {
  level.example = levelExamples[level.id].text;
  level.exampleSay = levelExamples[level.id].say;
}

/** Los códigos del transpondedor para situaciones especiales (SERA.13005). say: cifra por cifra. */
export const squawkCodes = [
  {
    code: '7700',
    en: 'Emergency',
    es: 'Emergencia',
    say: 'seven seven zero zero',
  },
  {
    code: '7600',
    en: 'Radio failure',
    es: 'Falla de radio',
    say: 'seven six zero zero',
  },
  {
    code: '7500',
    en: 'Unlawful interference',
    es: 'Interferencia ilícita',
    say: 'seven five zero zero',
  },
];
