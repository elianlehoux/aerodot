/**
 * Autorización y colación: qué te autorizan, qué se repite siempre y cómo se encuentra un error.
 *
 * Fuentes (los textos en español son propios):
 * - Qué se colaciona siempre: SERA.8015 (e), Reglamento (UE) 923/2012, que traspone la norma de la OACI.
 * - Contenido de una autorización: SERA.8015 (d); los nombres en inglés, AIM 4-4-3 de la FAA.
 * - Orden del distintivo (la torre lo dice primero; la colación termina con él): CAP 413 de la CAA
 *   británica, 2.49. Que la colación lleve el distintivo: SERA.14055 (c).
 * - Fraseología del circuito: CAP 413, cap. 4, y el Glosario Piloto/Controlador de la FAA.
 * CRAFT es una regla mnemotécnica de uso difundido, no una norma de la OACI.
 *
 * En body, es y explain, el inglés va entre asteriscos: la página les pone lang="en".
 * Santa Brisa, Laguna, LV-DEM y todas las cifras (frecuencias, códigos, QNH, altitudes) son de práctica.
 * Las cifras de say van en palabras; se escribe three, four, five y nine (ver english.js).
 */

const DEM = 'Lima Victor Delta Echo Mike';

/** Lo que lee la voz: el mismo texto, con la matrícula deletreada. */
const spoken = (text) => text.replaceAll('LV-DEM', DEM);

/** Las cinco piezas de CRAFT, en el orden en que suelen llegar. piece es el trozo del ejemplo. */
export const clearanceParts = [
  {
    id: 'c',
    letter: 'C',
    en: 'Clearance limit',
    es: 'Límite de la autorización',
    piece: 'cleared to Santa Brisa',
    say: 'Cleared to Santa Brisa.',
    body: 'Hasta dónde te autorizan: un aeródromo, un punto o una radioayuda. Antes de despegar, casi siempre es tu destino.',
  },
  {
    id: 'r',
    letter: 'R',
    en: 'Route',
    es: 'Ruta',
    piece: 'via route Delta',
    say: 'Via route Delta.',
    body: 'Por dónde vas: una ruta, una salida publicada o la ruta de tu plan de vuelo (*flight planned route*).',
  },
  {
    id: 'a',
    letter: 'A',
    en: 'Altitude',
    es: 'Altitud o nivel',
    piece: 'climb to altitude four thousand feet',
    say: 'Climb to altitude four thousand feet.',
    body: 'A qué altitud o nivel subís. Las instrucciones de nivel están en la lista de lo que se colaciona siempre.',
  },
  {
    id: 'f',
    letter: 'F',
    en: 'Frequency',
    es: 'Frecuencia',
    piece: 'departure frequency one two zero decimal four',
    say: 'Departure frequency one two zero decimal four.',
    body: 'En qué frecuencia vas a hablar después de despegar. Una frecuencia nueva también se colaciona.',
  },
  {
    id: 't',
    letter: 'T',
    en: 'Transponder',
    es: 'Transpondedor',
    piece: 'squawk four five two one',
    say: 'Squawk four five two one.',
    body: 'El código que ponés en el transpondedor: *squawk* y las cuatro cifras. Los códigos SSR se colacionan siempre.',
  },
];

/** Una autorización de ruta IFR de práctica, armada con las cinco piezas, y su colación. */
const craftParts = [
  { text: 'LV-DEM, ' },
  { text: 'cleared to Santa Brisa', part: 'c' },
  { text: ' ' },
  { text: 'via route Delta', part: 'r' },
  { text: ', ' },
  { text: 'climb to altitude four thousand feet', part: 'a' },
  { text: ', ' },
  { text: 'departure frequency one two zero decimal four', part: 'f' },
  { text: ', ' },
  { text: 'squawk four five two one', part: 't' },
  { text: '.' },
];
const craftText = 'LV-DEM, cleared to Santa Brisa via route Delta, climb to altitude four thousand feet, departure frequency one two zero decimal four, squawk four five two one.';
const craftReadback = 'Cleared to Santa Brisa via route Delta, climb to altitude four thousand feet, departure frequency one two zero decimal four, squawk four five two one, LV-DEM.';

export const craftExample = {
  parts: craftParts,
  text: craftText,
  say: spoken(craftText),
  readback: craftReadback,
  readbackSay: spoken(craftReadback),
};

/**
 * Autorizaciones e instrucciones del circuito, para las tarjetas que se dan vuelta.
 * tower: lo que dice la torre (distintivo primero); reply: lo que contestás (distintivo al final).
 */
const circuit = [
  {
    id: 'cleared-to-land',
    en: 'cleared to land',
    es: 'autorizado a aterrizar',
    kind: 'Autorización',
    tower: 'LV-DEM, runway one three, cleared to land.',
    reply: 'Runway one three, cleared to land, LV-DEM.',
    body: 'Te autorizan a aterrizar en esa pista. Se colaciona con el número de pista. Si no la escuchaste, no aterrizás: seguís la aproximación o hacés *go around*.',
  },
  {
    id: 'cleared-for-take-off',
    en: 'cleared for take-off',
    es: 'autorizado a despegar',
    kind: 'Autorización',
    tower: 'LV-DEM, runway one three, cleared for take-off.',
    reply: 'Runway one three, cleared for take-off, LV-DEM.',
    body: 'Te autorizan a despegar. Según el manual de radio británico (CAP 413), la palabra *take-off* se reserva para esta autorización y para cancelarla; en los demás mensajes se dice *departure*.',
  },
  {
    id: 'line-up-and-wait',
    en: 'line up and wait',
    es: 'alineate y esperá',
    kind: 'Instrucción',
    tower: 'LV-DEM, line up and wait runway one three.',
    reply: 'Line up and wait runway one three, LV-DEM.',
    body: 'Entrás a la pista y te alineás, pero no despegás: no es una autorización de despegue. Esperás el *cleared for take-off*. Como te hace entrar a la pista, se colaciona.',
  },
  {
    id: 'hold-short',
    en: 'hold short',
    es: 'detenete antes de',
    kind: 'Instrucción',
    tower: 'LV-DEM, hold short of runway one three.',
    reply: 'Holding short of runway one three, LV-DEM.',
    body: 'Te detenés antes de llegar al lugar que te nombran, casi siempre una pista. Se colaciona; en el manual británico (CAP 413), con *holding short*, porque *roger* o *wilco* no alcanzan.',
  },
  {
    id: 'continue-approach',
    en: 'continue approach',
    es: 'continuá la aproximación',
    kind: 'Instrucción',
    tower: 'LV-DEM, continue approach.',
    reply: 'Continue approach, LV-DEM.',
    body: 'Seguís la aproximación, pero todavía no te autorizaron a aterrizar: por ejemplo, la pista sigue ocupada. Esperás el *cleared to land* o hacés *go around*.',
  },
  {
    id: 'report-downwind',
    en: 'report downwind',
    es: 'avisá en la inicial',
    kind: 'Instrucción',
    tower: 'LV-DEM, report downwind.',
    reply: 'Wilco, LV-DEM.',
    body: 'Te piden que avises cuando llegues a la inicial: el tramo que en inglés se llama *downwind*. Contestás *wilco* y, al llegar, llamás: *LV-DEM, downwind*.',
  },
];

export const clearanceExamples = circuit.map((card) => ({ ...card, say: spoken(card.tower), replySay: spoken(card.reply) }));

/**
 * Qué se colaciona siempre, según SERA.8015 (e) (la lista de la OACI).
 * en: un ejemplo de lo que repetís; el último ítem no lleva ejemplo.
 */
export const readbackItems = [
  { id: 'route', es: 'Las autorizaciones de ruta (*route clearances*).', en: 'Cleared to Santa Brisa via route Delta' },
  { id: 'runway-ops', es: 'Las autorizaciones e instrucciones para entrar, aterrizar, despegar, detenerte antes (*hold short*), cruzar, rodar o retroceder (*backtrack*) en cualquier pista.', en: 'Line up and wait runway one three' },
  { id: 'runway', es: 'La pista en uso.', en: 'Runway one three' },
  { id: 'altimeter', es: 'El ajuste del altímetro.', en: 'QNH one zero one three' },
  { id: 'ssr', es: 'Los códigos SSR del transpondedor.', en: 'Squawk four five two one' },
  { id: 'frequency', es: 'Las frecuencias nuevas que te asignan.', en: 'Laguna Approach one one nine decimal seven' },
  { id: 'level', es: 'Las instrucciones de nivel, rumbo y velocidad.', en: 'Turn left heading two seven zero' },
  { id: 'transition', es: 'El nivel de transición, te lo diga el controlador o esté en el ATIS.' },
].map((item) => (item.en ? { ...item, say: item.en } : item));

/**
 * Casos de hearback: la colación tiene un solo dato mal.
 * wrong declara cuál: label es la opción correcta de la pregunta; tower y pilot, lo que dijo cada uno.
 * El test compara palabra por palabra y exige que esa sea la única diferencia.
 */
const NOTHING = 'Nothing, the readback is correct';

const withVoice = (entry) => ({ ...entry, towerSay: spoken(entry.tower), pilotSay: spoken(entry.pilot) });

/** Los tres casos de la página, con sus burbujas. */
export const hearbackCases = [
  {
    id: 'case-squawk',
    tower: 'LV-DEM, climb to altitude four thousand feet, squawk four five two one.',
    pilot: 'Climb to altitude four thousand feet, squawk four two five one, LV-DEM.',
    wrong: { label: 'Squawk', tower: 'four five two one', pilot: 'four two five one' },
    options: ['Altitude', 'Squawk', 'Callsign', NOTHING],
    explain: 'El código quedó con dos cifras cambiadas: *four two five one* en lugar de *four five two one*. El distintivo al final está bien: así se colaciona.',
  },
  {
    id: 'case-qnh',
    tower: 'LV-DEM, taxi to holding point runway one three, QNH one zero zero three.',
    pilot: 'Taxi to holding point runway one three, QNH one zero one three, LV-DEM.',
    wrong: { label: 'QNH', tower: 'one zero zero three', pilot: 'one zero one three' },
    options: ['Runway', 'QNH', 'Holding point', NOTHING],
    explain: 'La torre dijo *one zero zero three* y se colacionó *one zero one three*: es fácil que la costumbre lleve al valor de la atmósfera estándar.',
  },
  {
    id: 'case-runway',
    tower: 'LV-DEM, runway one three, cleared to land.',
    pilot: 'Runway three one, cleared to land, LV-DEM.',
    wrong: { label: 'Runway', tower: 'one three', pilot: 'three one' },
    options: ['Runway', 'Cleared to land', 'Callsign', NOTHING],
    explain: 'La pista es la *one three* y se colacionó *three one*: la cabecera opuesta. La autorización está bien repetida.',
  },
].map(withVoice);

/** Tres casos más, para la práctica del final. */
export const hearbackDrills = [
  {
    id: 'hb-frequency',
    tower: 'LV-DEM, contact Laguna Approach one one nine decimal seven.',
    pilot: 'Contact Laguna Approach one one nine decimal one, LV-DEM.',
    wrong: { label: 'Frequency', tower: 'one one nine decimal seven', pilot: 'one one nine decimal one' },
    options: ['Frequency', 'Station name', 'Callsign', NOTHING],
    explain: 'La frecuencia termina en *seven*, no en *one*. Con la frecuencia mal, te vas a una dependencia en la que nadie te espera.',
  },
  {
    id: 'hb-turn',
    tower: 'LV-DEM, turn left heading two seven zero.',
    pilot: 'Turn right heading two seven zero, LV-DEM.',
    wrong: { label: 'Turn direction', tower: 'left', pilot: 'right' },
    options: ['Heading', 'Turn direction', 'Callsign', NOTHING],
    explain: 'El rumbo está bien, pero el giro es a la izquierda (*left*), no a la derecha (*right*).',
  },
  {
    id: 'hb-altitude',
    tower: 'LV-DEM, descend to altitude three thousand feet, QNH one zero one five.',
    pilot: 'Descend to altitude two thousand feet, QNH one zero one five, LV-DEM.',
    wrong: { label: 'Altitude', tower: 'three thousand', pilot: 'two thousand' },
    options: ['Altitude', 'QNH', 'Callsign', NOTHING],
    explain: 'La torre dijo *three thousand feet* y se colacionó *two thousand*. El QNH está bien.',
  },
].map(withVoice);
