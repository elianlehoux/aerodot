/**
 * El tiempo, en inglés aeronáutico: cómo se dicen las nubes, los fenómenos y el tiempo por radio.
 *
 * Laguna es un aeródromo de práctica: no existe. Los códigos son los de la OACI (Anexo 3):
 * nubes en cientos de pies. Las cifras se dicen como en la radio.
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

/** Nubes. Las octas son los octavos de cielo cubiertos. */
export const cloudAmounts = [
  { id: 'FEW', en: 'few', es: 'pocas', oktas: [1, 2], say: 'few', body: 'De 1 a 2 octavos del cielo. Casi despejado.' },
  { id: 'SCT', en: 'scattered', es: 'dispersas', oktas: [3, 4], say: 'scattered', body: 'De 3 a 4 octavos. Hay claros de sobra.' },
  { id: 'BKN', en: 'broken', es: 'rotas', oktas: [5, 7], say: 'broken', body: 'De 5 a 7 octavos. Queda poco cielo abierto. Cuenta como techo.' },
  { id: 'OVC', en: 'overcast', es: 'cubierto', oktas: [8, 8], say: 'overcast', body: 'Los 8 octavos. No se ve el cielo. También cuenta como techo.' },
];

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

/** Frases de la frecuencia. */
export const weatherRadio = [
  { id: 'request', en: 'request weather', es: 'Pedir el tiempo', say: 'Laguna Tower, request current weather.', body: 'Lo pedís vos. La torre contesta con viento, visibilidad, nubes y QNH.' },
  { id: 'cavok', en: 'CAVOK', es: 'Cielo y visibilidad OK', say: 'cav oh kay', display: 'CAVOK', body: 'Se dice "cav-o-kei". Visibilidad de 10 km o más, ninguna nube por debajo de 5000 ft y nada de tiempo significativo.' },
  { id: 'vis', en: 'visibility reduced', es: 'Visibilidad reducida', say: 'Visibility two thousand metres in fog.', body: 'Después de visibility va el valor en metros, y después la causa.' },
  { id: 'ceiling', en: 'ceiling', es: 'Techo', say: 'Ceiling one thousand two hundred feet.', body: 'La altura de la capa más baja de nubes rotas o cubiertas.' },
  { id: 'windshear', en: 'windshear', es: 'Cizalladura', say: 'Windshear reported on final runway one three.', body: 'Un cambio fuerte y repentino del viento. Se avisa en final o en el despegue.' },
  { id: 'vicinity', en: 'thunderstorm in the vicinity', es: 'Tormenta en las cercanías', say: 'Thunderstorm in the vicinity of the aerodrome.', body: 'En un METAR aparece como VCTS: entre 8 y 16 km del aeródromo.' },
];
