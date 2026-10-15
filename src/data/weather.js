/**
 * El tiempo, en inglés aeronáutico.
 *
 * SAXL (Laguna) es un aeródromo de práctica: no existe y los partes son inventados.
 * El formato es el METAR/TAF de la OACI (Anexo 3): viento en nudos, visibilidad en metros,
 * nubes en cientos de pies, QNH en hectopascales. Las cifras se dicen como en la radio.
 */

/** Pies sobre el terreno → cómo se dicen: 1200 → "one thousand two hundred". */
export const heightSay = (feet) => {
  const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const thousands = Math.floor(feet / 1000);
  const hundreds = Math.round((feet % 1000) / 100);
  const parts = [];
  if (thousands) parts.push(`${words[thousands]} thousand`);
  if (hundreds) parts.push(`${words[hundreds]} hundred`);
  return parts.join(' ') || 'zero';
};

/**
 * Cuatro partes de ejemplo. Cada ficha tiene:
 *  kind: qué grupo es (lo usa el dibujo para resaltar)
 *  code: como se escribe · es: qué quiere decir · say: cómo se dice por radio
 *  parts: el código desarmado, pieza por pieza
 *  layer: en las nubes, la capa que dibuja
 */
export const metars = [
  {
    id: 'bueno',
    label: 'Buen día',
    note: 'Cielo abierto y poco viento.',
    runway: 13,
    scene: { sun: true, clouds: [], vis: 10000, precip: null, fog: 0, temp: 24, dew: 12, qnh: 1016, wind: { dir: 130, spd: 8, gust: 0 } },
    tokens: [
      { kind: 'station', code: 'SAXL', es: 'Aeródromo de práctica: Laguna.', say: 'Laguna', parts: [['SAXL', 'Las cuatro letras OACI del lugar']] },
      { kind: 'time', code: '091500Z', es: 'Observado el día 9, a las 15:00 UTC.', say: 'observed at one five zero zero UTC', parts: [['09', 'Día del mes'], ['1500', 'Hora'], ['Z', 'UTC: la hora de Greenwich ("Zulu")']] },
      { kind: 'wind', code: '13008KT', es: 'Viento desde los 130 grados, 8 nudos.', say: 'wind one three zero degrees eight knots', parts: [['130', 'De dónde viene, en grados'], ['08', 'Intensidad'], ['KT', 'Nudos']] },
      { kind: 'vis', code: 'CAVOK', es: 'Visibilidad de 10 km o más, ninguna nube por debajo de 5000 ft y nada de tiempo significativo.', say: 'cav oh kay', parts: [['CAV', 'Ceiling And Visibility'], ['OK', 'Todo bien: no hay nubes bajas, ni CB, ni fenómenos']] },
      { kind: 'temp', code: '24/12', es: 'Temperatura 24 °C, punto de rocío 12 °C.', say: 'temperature two four, dew point one two', parts: [['24', 'Temperatura del aire'], ['12', 'Punto de rocío']] },
      { kind: 'qnh', code: 'Q1016', es: 'QNH 1016 hectopascales.', say: 'QNH one zero one six', parts: [['Q', 'Presión reducida al nivel del mar, en hPa'], ['1016', 'El valor para poner en el altímetro']] },
    ],
  },
  {
    id: 'lluvia',
    label: 'Lluvia y techo bajo',
    note: 'Ráfagas, poca visibilidad y nubes a 1200 ft.',
    runway: 13,
    scene: { sun: false, clouds: [{ amount: 'BKN', ft: 1200 }, { amount: 'OVC', ft: 3000 }], vis: 4000, precip: 'rain', fog: 0, temp: 14, dew: 12, qnh: 1008, wind: { dir: 150, spd: 14, gust: 24 } },
    tokens: [
      { kind: 'station', code: 'SAXL', es: 'Aeródromo de práctica: Laguna.', say: 'Laguna', parts: [['SAXL', 'Las cuatro letras OACI del lugar']] },
      { kind: 'time', code: '091500Z', es: 'Observado el día 9, a las 15:00 UTC.', say: 'observed at one five zero zero UTC', parts: [['09', 'Día del mes'], ['1500', 'Hora'], ['Z', 'UTC']] },
      { kind: 'wind', code: '15014G24KT', es: 'Viento desde los 150 grados, 14 nudos con ráfagas de 24.', say: 'wind one five zero degrees one four knots gusting two four', parts: [['150', 'De dónde viene, en grados'], ['14', 'Intensidad media'], ['G24', 'Gust: ráfagas de hasta 24'], ['KT', 'Nudos']] },
      { kind: 'vis', code: '4000', es: 'Visibilidad de 4000 metros (4 km).', say: 'visibility four thousand metres', parts: [['4000', 'Metros. 9999 quiere decir 10 km o más']] },
      { kind: 'wx', code: '-RA', es: 'Lluvia leve.', say: 'light rain', parts: [['−', 'Leve'], ['RA', 'Rain: lluvia']] },
      { kind: 'cloud', layer: 0, code: 'BKN012', es: 'Nubes rotas a 1200 ft. Es el techo.', say: 'broken one thousand two hundred feet', parts: [['BKN', 'Broken: de 5 a 7 octas'], ['012', '1200 ft sobre el terreno']] },
      { kind: 'cloud', layer: 1, code: 'OVC030', es: 'Cielo cubierto a 3000 ft.', say: 'overcast three thousand feet', parts: [['OVC', 'Overcast: 8 octas, todo cubierto'], ['030', '3000 ft sobre el terreno']] },
      { kind: 'temp', code: '14/12', es: 'Temperatura 14 °C, punto de rocío 12 °C.', say: 'temperature one four, dew point one two', parts: [['14', 'Temperatura'], ['12', 'Punto de rocío']] },
      { kind: 'qnh', code: 'Q1008', es: 'QNH 1008 hectopascales.', say: 'QNH one zero zero eight', parts: [['Q', 'Presión en hPa'], ['1008', 'Para el altímetro']] },
    ],
  },
  {
    id: 'niebla',
    label: 'Niebla',
    note: 'Sin viento y el cielo no se ve.',
    runway: 13,
    scene: { sun: false, clouds: [], vis: 400, precip: null, fog: 1, vv: 200, temp: 8, dew: 8, qnh: 1021, wind: { dir: 0, spd: 0, gust: 0 } },
    tokens: [
      { kind: 'station', code: 'SAXL', es: 'Aeródromo de práctica: Laguna.', say: 'Laguna', parts: [['SAXL', 'Las cuatro letras OACI del lugar']] },
      { kind: 'time', code: '090600Z', es: 'Observado el día 9, a las 06:00 UTC.', say: 'observed at zero six zero zero UTC', parts: [['09', 'Día del mes'], ['0600', 'Hora'], ['Z', 'UTC']] },
      { kind: 'wind', code: '00000KT', es: 'Viento calmo.', say: 'wind calm', parts: [['00000', 'Sin dirección ni intensidad: calma'], ['KT', 'Nudos']] },
      { kind: 'vis', code: '0400', es: 'Visibilidad de 400 metros.', say: 'visibility four hundred metres', parts: [['0400', 'Metros: se ve hasta 400 m']] },
      { kind: 'wx', code: 'FG', es: 'Niebla: la visibilidad es menor a 1000 m.', say: 'fog', parts: [['FG', 'Fog: niebla']] },
      { kind: 'cloud', layer: 0, code: 'VV002', es: 'Cielo oculto: se ve 200 ft hacia arriba.', say: 'vertical visibility two hundred feet', parts: [['VV', 'Vertical visibility: visibilidad vertical'], ['002', '200 ft hacia arriba']] },
      { kind: 'temp', code: '08/08', es: 'Temperatura y rocío iguales: el aire está saturado.', say: 'temperature zero eight, dew point zero eight', parts: [['08', 'Temperatura'], ['08', 'Punto de rocío: igual, hay niebla']] },
      { kind: 'qnh', code: 'Q1021', es: 'QNH 1021 hectopascales.', say: 'QNH one zero two one', parts: [['Q', 'Presión en hPa'], ['1021', 'Para el altímetro']] },
    ],
  },
  {
    id: 'tormenta',
    label: 'Tormenta',
    note: 'Viento de costado fuerte y un cumulonimbus.',
    runway: 13,
    scene: { sun: false, clouds: [{ amount: 'SCT', ft: 800 }, { amount: 'BKN', ft: 2500, cb: true }], vis: 5000, precip: 'storm', fog: 0, temp: 27, dew: 23, qnh: 1004, wind: { dir: 200, spd: 15, gust: 30 } },
    tokens: [
      { kind: 'station', code: 'SAXL', es: 'Aeródromo de práctica: Laguna.', say: 'Laguna', parts: [['SAXL', 'Las cuatro letras OACI del lugar']] },
      { kind: 'time', code: '091800Z', es: 'Observado el día 9, a las 18:00 UTC.', say: 'observed at one eight zero zero UTC', parts: [['09', 'Día del mes'], ['1800', 'Hora'], ['Z', 'UTC']] },
      { kind: 'wind', code: '20015G30KT', es: 'Viento desde los 200 grados, 15 nudos con ráfagas de 30.', say: 'wind two zero zero degrees one five knots gusting three zero', parts: [['200', 'De dónde viene, en grados'], ['15', 'Intensidad media'], ['G30', 'Ráfagas de hasta 30'], ['KT', 'Nudos']] },
      { kind: 'vis', code: '5000', es: 'Visibilidad de 5000 metros (5 km).', say: 'visibility five thousand metres', parts: [['5000', 'Metros']] },
      { kind: 'wx', code: '+TSRA', es: 'Tormenta con lluvia fuerte.', say: 'heavy thunderstorm with rain', parts: [['+', 'Fuerte'], ['TS', 'Thunderstorm: tormenta eléctrica'], ['RA', 'Rain: lluvia']] },
      { kind: 'cloud', layer: 0, code: 'SCT008', es: 'Nubes dispersas a 800 ft.', say: 'scattered eight hundred feet', parts: [['SCT', 'Scattered: de 3 a 4 octas'], ['008', '800 ft sobre el terreno']] },
      { kind: 'cloud', layer: 1, code: 'BKN025CB', es: 'Nubes rotas a 2500 ft, cumulonimbus.', say: 'broken two thousand five hundred feet cumulonimbus', parts: [['BKN', 'Broken: de 5 a 7 octas'], ['025', '2500 ft sobre el terreno'], ['CB', 'Cumulonimbus: la nube de tormenta']] },
      { kind: 'temp', code: '27/23', es: 'Temperatura 27 °C, punto de rocío 23 °C.', say: 'temperature two seven, dew point two three', parts: [['27', 'Temperatura'], ['23', 'Punto de rocío']] },
      { kind: 'qnh', code: 'Q1004', es: 'QNH 1004 hectopascales.', say: 'QNH one zero zero four', parts: [['Q', 'Presión en hPa'], ['1004', 'Para el altímetro']] },
    ],
  },
];

/** Lo que cada tipo de grupo se llama arriba de la ficha. */
export const kindLabels = {
  station: 'Lugar',
  time: 'Hora',
  wind: 'Viento',
  vis: 'Visibilidad',
  wx: 'Tiempo presente',
  cloud: 'Nubes',
  temp: 'Temperatura y rocío',
  qnh: 'Presión',
};

/** Nubes. Las octas son los octavos de cielo cubiertos. */
export const cloudAmounts = [
  { id: 'FEW', en: 'few', es: 'pocas', oktas: [1, 2], say: 'few', body: 'De 1 a 2 octavos del cielo. Casi despejado.' },
  { id: 'SCT', en: 'scattered', es: 'dispersas', oktas: [3, 4], say: 'scattered', body: 'De 3 a 4 octavos. Hay claros de sobra.' },
  { id: 'BKN', en: 'broken', es: 'rotas', oktas: [5, 7], say: 'broken', body: 'De 5 a 7 octavos. Queda poco cielo abierto. Cuenta como techo.' },
  { id: 'OVC', en: 'overcast', es: 'cubierto', oktas: [8, 8], say: 'overcast', body: 'Los 8 octavos. No se ve el cielo. También cuenta como techo.' },
];

/** El techo (ceiling) es la capa más baja de BKN u OVC. */
export const ceilingNote = 'El techo (ceiling) es la altura de la capa más baja que sea BKN u OVC. FEW y SCT no hacen techo, aunque estén bajas.';

/** Fenómenos: intensidad + descriptor + fenómeno. */
export const wxIntensity = [
  { id: '', label: 'Moderada', en: '', es: '' },
  { id: '-', label: 'Leve (−)', en: 'light', es: 'leve' },
  { id: '+', label: 'Fuerte (+)', en: 'heavy', es: 'fuerte' },
];

export const wxDescriptors = [
  { id: '', label: 'Ninguno', en: '', es: '' },
  { id: 'SH', label: 'SH · chubascos', en: 'showers of', es: 'chubascos de', hint: 'Lluvia que empieza y termina de golpe, de nubes de tormenta.' },
  { id: 'TS', label: 'TS · tormenta', en: 'thunderstorm with', es: 'tormenta con', hint: 'Hay rayos y truenos.' },
  { id: 'FZ', label: 'FZ · congelante', en: 'freezing', es: 'congelante', hint: 'Se congela al tocar algo: hielo en el avión.' },
  { id: 'BC', label: 'BC · bancos', en: 'patches of', es: 'bancos de', hint: 'Cubre parte del aeródromo, no todo.' },
];

export const wxPhenomena = [
  { id: 'RA', en: 'rain', es: 'lluvia', precip: true },
  { id: 'DZ', en: 'drizzle', es: 'llovizna', precip: true },
  { id: 'SN', en: 'snow', es: 'nieve', precip: true },
  { id: 'GR', en: 'hail', es: 'granizo', precip: true },
  { id: 'FG', en: 'fog', es: 'niebla' },
  { id: 'BR', en: 'mist', es: 'neblina' },
  { id: 'HZ', en: 'haze', es: 'bruma seca' },
  { id: 'FU', en: 'smoke', es: 'humo' },
];

/** Qué descriptores se combinan con qué fenómenos. TS vale solo (tormenta sin lluvia). */
export const wxRules = {
  SH: ['RA', 'SN', 'GR'],
  TS: ['', 'RA', 'SN', 'GR'],
  FZ: ['RA', 'DZ', 'FG'],
  BC: ['FG'],
};

/** Los que más vas a ver. */
export const wxCommon = [
  { code: 'RA', en: 'rain', es: 'lluvia' },
  { code: 'DZ', en: 'drizzle', es: 'llovizna' },
  { code: 'SN', en: 'snow', es: 'nieve' },
  { code: 'FG', en: 'fog', es: 'niebla' },
  { code: 'BR', en: 'mist', es: 'neblina' },
  { code: 'HZ', en: 'haze', es: 'bruma seca' },
  { code: 'TS', en: 'thunderstorm', es: 'tormenta' },
  { code: 'SH', en: 'showers', es: 'chubascos' },
  { code: 'GR', en: 'hail', es: 'granizo' },
  { code: 'FU', en: 'smoke', es: 'humo' },
];

/** El pronóstico. Horas desde las 12 UTC del día 9. Dura 24 h. */
export const taf = {
  text: 'TAF SAXL 091100Z 0912/1012 13010KT 9999 SCT030 BECMG 0915/0917 18015G25KT TEMPO 0916/0920 4000 TSRA BKN015CB FM100200 VRB03KT CAVOK PROB30 1004/1007 3000 BR',
  hours: 24,
  startHour: 12,
  groups: [
    {
      id: 'base',
      label: 'Base',
      code: '0912/1012 13010KT 9999 SCT030',
      en: 'valid',
      es: 'Es lo que se espera, salvo que algo lo cambie. Vale desde el día 9 a las 12 hasta el día 10 a las 12.',
      say: 'valid from zero nine one two to one zero one two. Wind one three zero degrees one zero knots, visibility ten kilometres or more, scattered three thousand feet.',
      from: 0,
      to: 14,
      shape: 'solid',
    },
    {
      id: 'becmg',
      label: 'BECMG',
      code: 'BECMG 0915/0917 18015G25KT',
      en: 'becoming',
      es: 'El cambio es gradual y ocurre entre las 15 y las 17. Después queda así, hasta que otro grupo lo cambie.',
      say: 'Becoming between one five and one seven, wind one eight zero degrees one five knots gusting two five.',
      from: 3,
      to: 5,
      shape: 'ramp',
    },
    {
      id: 'tempo',
      label: 'TEMPO',
      code: 'TEMPO 0916/0920 4000 TSRA BKN015CB',
      en: 'temporarily',
      es: 'Entre las 16 y las 20 viene y va. Cada episodio dura menos de una hora y, juntos, menos de la mitad del período.',
      say: 'Temporarily between one six and two zero, visibility four thousand metres, thunderstorm with rain, broken one thousand five hundred feet cumulonimbus.',
      from: 4,
      to: 8,
      shape: 'burst',
    },
    {
      id: 'fm',
      label: 'FM',
      code: 'FM100200 VRB03KT CAVOK',
      en: 'from',
      es: 'Desde las 02:00 del día 10 todo cambia de golpe. Lo de antes ya no vale.',
      say: 'From zero two zero zero, wind variable three knots, CAVOK.',
      from: 14,
      to: 24,
      shape: 'solid',
    },
    {
      id: 'prob',
      label: 'PROB30',
      code: 'PROB30 1004/1007 3000 BR',
      en: 'probability',
      es: 'Entre las 04 y las 07 del día 10 hay un 30 % de probabilidad de neblina con 3000 m. Solo existe PROB30 y PROB40.',
      say: 'Probability three zero percent between zero four and zero seven, visibility three thousand metres, mist.',
      from: 16,
      to: 19,
      shape: 'hatch',
    },
  ],
};

/** Frases de la frecuencia. */
export const weatherRadio = [
  { id: 'request', en: 'request weather', es: 'Pedir el tiempo', say: 'Laguna Tower, request current weather.', body: 'Lo pedís vos. La torre contesta con viento, visibilidad, nubes y QNH.' },
  { id: 'cavok', en: 'CAVOK', es: 'Cielo y visibilidad OK', say: 'cav oh kay', display: 'CAVOK', body: 'Se dice "cav-o-kei". Visibilidad de 10 km o más, ninguna nube por debajo de 5000 ft y nada de tiempo significativo.' },
  { id: 'vis', en: 'visibility reduced', es: 'Visibilidad reducida', say: 'Visibility two thousand metres in fog.', body: 'Después de visibility va el valor en metros, y después la causa.' },
  { id: 'ceiling', en: 'ceiling', es: 'Techo', say: 'Ceiling one thousand two hundred feet.', body: 'La altura de la capa más baja de nubes rotas o cubiertas.' },
  { id: 'windshear', en: 'windshear', es: 'Cizalladura', say: 'Windshear reported on final runway one three.', body: 'Un cambio fuerte y repentino del viento. Se avisa en final o en el despegue.' },
  { id: 'vicinity', en: 'thunderstorm in the vicinity', es: 'Tormenta en las cercanías', say: 'Thunderstorm in the vicinity of the aerodrome.', body: 'En un METAR aparece como VCTS: entre 8 y 16 km del aeródromo.' },
];

/**
 * Pozo de preguntas. Cada ficha: kind (para armar las opciones parecidas), code y es.
 * say es lo que se oye en la pregunta de escuchar.
 */
export const weatherPool = [
  { kind: 'wind', code: '27010KT', es: 'Viento desde los 270°, 10 nudos', say: 'wind two seven zero degrees one zero knots' },
  { kind: 'wind', code: '09015G25KT', es: 'Viento desde los 090°, 15 nudos con ráfagas de 25', say: 'wind zero nine zero degrees one five knots gusting two five' },
  { kind: 'wind', code: '36006KT', es: 'Viento desde los 360° (norte), 6 nudos', say: 'wind three six zero degrees six knots' },
  { kind: 'wind', code: '18020KT', es: 'Viento desde los 180°, 20 nudos', say: 'wind one eight zero degrees two zero knots' },
  { kind: 'wind', code: '00000KT', es: 'Viento calmo', say: 'wind calm' },
  { kind: 'vis', code: '9999', es: 'Visibilidad de 10 km o más', say: 'visibility ten kilometres or more' },
  { kind: 'vis', code: '3000', es: 'Visibilidad de 3000 metros', say: 'visibility three thousand metres' },
  { kind: 'vis', code: '0800', es: 'Visibilidad de 800 metros', say: 'visibility eight hundred metres' },
  { kind: 'vis', code: '6000', es: 'Visibilidad de 6000 metros', say: 'visibility six thousand metres' },
  { kind: 'wx', code: '-RA', es: 'Lluvia leve', say: 'light rain' },
  { kind: 'wx', code: '+SHRA', es: 'Chubascos de lluvia fuertes', say: 'heavy showers of rain' },
  { kind: 'wx', code: 'FG', es: 'Niebla', say: 'fog' },
  { kind: 'wx', code: 'BR', es: 'Neblina', say: 'mist' },
  { kind: 'wx', code: 'TS', es: 'Tormenta', say: 'thunderstorm' },
  { kind: 'wx', code: 'FZRA', es: 'Lluvia congelante', say: 'freezing rain' },
  { kind: 'wx', code: 'HZ', es: 'Bruma seca', say: 'haze' },
  { kind: 'cloud', code: 'FEW040', es: 'Pocas nubes a 4000 ft', say: 'few four thousand feet' },
  { kind: 'cloud', code: 'SCT020', es: 'Nubes dispersas a 2000 ft', say: 'scattered two thousand feet' },
  { kind: 'cloud', code: 'BKN008', es: 'Nubes rotas a 800 ft (techo)', say: 'broken eight hundred feet' },
  { kind: 'cloud', code: 'OVC015', es: 'Cielo cubierto a 1500 ft (techo)', say: 'overcast one thousand five hundred feet' },
  { kind: 'cloud', code: 'BKN030CB', es: 'Nubes rotas a 3000 ft, cumulonimbus', say: 'broken three thousand feet cumulonimbus' },
  { kind: 'temp', code: '18/10', es: 'Temperatura 18 °C, rocío 10 °C', say: 'temperature one eight, dew point one zero' },
  { kind: 'temp', code: '05/04', es: 'Temperatura 5 °C, rocío 4 °C', say: 'temperature zero five, dew point zero four' },
  { kind: 'temp', code: '31/19', es: 'Temperatura 31 °C, rocío 19 °C', say: 'temperature three one, dew point one nine' },
  { kind: 'temp', code: 'M02/M04', es: 'Temperatura −2 °C, rocío −4 °C', say: 'temperature minus zero two, dew point minus zero four' },
  { kind: 'qnh', code: 'Q1013', es: 'QNH 1013 hectopascales', say: 'QNH one zero one three' },
  { kind: 'qnh', code: 'Q0998', es: 'QNH 998 hectopascales', say: 'QNH zero nine nine eight' },
  { kind: 'qnh', code: 'Q1024', es: 'QNH 1024 hectopascales', say: 'QNH one zero two four' },
  { kind: 'qnh', code: 'Q1031', es: 'QNH 1031 hectopascales', say: 'QNH one zero three one' },
];
