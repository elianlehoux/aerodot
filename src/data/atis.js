/**
 * ATIS de práctica: se arman con una semilla, así el navegador los inventa al vuelo y el
 * script de audios (scripts/build-atis-audio.mjs) genera siempre los mismos grabados.
 * Los aeródromos y los datos son inventados: no son partes reales.
 */

const NAMES = ['Laguna', 'Sierra Verde', 'Costa Azul', 'Río Seco', 'Valle Alto', 'Pampa Norte', 'Monte Claro', 'Puerto Sur'];
const PHONETIC = ['Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliett', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu'];
const RUNWAYS = ['13', '31', '09', '27', '18', '36', '05', '23', '02', '20'];
const DIGITS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const CLOUD = { FEW: 'few', SCT: 'scattered', BKN: 'broken', OVC: 'overcast' };
const REMARKS = [
  { en: 'Caution, birds in the vicinity of the aerodrome.', es: 'Precaución: aves cerca del aeródromo' },
  { en: 'Taxiway Charlie closed.', es: 'Calle de rodaje C cerrada' },
  { en: 'Expect runway change after one six zero zero.', es: 'Se espera cambio de pista después de las 1600' },
  { en: 'Grass cutting in progress near taxiway Alfa.', es: 'Corte de pasto cerca de la calle A' },
];
const WEATHER = [
  { en: 'light rain', es: 'RA leve', vis: [5, 8] },
  { en: 'rain', es: 'RA', vis: [3, 6] },
  { en: 'mist', es: 'BR', vis: [2, 5] },
  { en: 'haze', es: 'HZ', vis: [5, 7] },
  { en: 'fog', es: 'FG', vis: [1, 2] },
  { en: 'thunderstorm', es: 'TS', vis: [3, 6] },
];

/** Generador pseudoaleatorio con semilla (mulberry32). */
export const seeded = (seed) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const pick = (rand, list) => list[Math.floor(rand() * list.length)];
const between = (rand, min, max) => min + Math.floor(rand() * (max - min + 1));
const chance = (rand, odds) => rand() < odds;

const digits = (value, length = 0) => [...String(value).padStart(length, '0')].map((digit) => DIGITS[Number(digit)]).join(' ');

/** 1500 → "one thousand five hundred", 800 → "eight hundred". */
const heightWords = (feet) => {
  const thousands = Math.floor(feet / 1000);
  const hundreds = Math.round((feet % 1000) / 100);
  const parts = [];
  if (thousands) parts.push(`${DIGITS[thousands]} thousand`);
  if (hundreds) parts.push(`${DIGITS[hundreds]} hundred`);
  return parts.join(' ');
};

const windFor = (rand, runway) => {
  if (chance(rand, 0.1)) return { calm: true };
  const heading = Number(runway.slice(0, 2)) * 10;
  const dir = (((heading + between(rand, -4, 4) * 10) % 360) + 360) % 360 || 360;
  const spd = between(rand, 4, 22);
  const gust = chance(rand, 0.3) ? spd + between(rand, 7, 12) : 0;
  return { dir, spd, gust };
};

const cloudLayers = (rand) => {
  const count = pick(rand, [1, 1, 2, 2, 3]);
  const types = ['FEW', 'SCT', 'BKN', 'OVC'];
  let floor = pick(rand, [800, 1000, 1500, 2000, 2500, 3000]);
  const layers = [];
  let typeIndex = between(rand, 0, 2);
  for (let index = 0; index < count; index += 1) {
    layers.push({ type: types[Math.min(typeIndex, 3)], feet: floor });
    floor += pick(rand, [1000, 1500, 2000]);
    typeIndex += between(rand, 0, 1);
  }
  return layers;
};

/** Arma un ATIS con los datos en orden de lectura. */
export const makeAtis = (rand = Math.random) => {
  const runway = pick(rand, RUNWAYS);
  const letter = between(rand, 0, 25);
  const atis = {
    name: pick(rand, NAMES),
    letter,
    time: `${String(between(rand, 6, 21)).padStart(2, '0')}${pick(rand, ['00', '15', '30', '45', '20', '50'])}`,
    runway,
    wind: windFor(rand, runway),
    qnh: between(rand, 998, 1030),
  };
  if (chance(rand, 0.15)) {
    atis.cavok = true;
    atis.temp = between(rand, 12, 32);
  } else {
    const weather = chance(rand, 0.4) ? pick(rand, WEATHER) : null;
    atis.weather = weather ? { en: weather.en, es: weather.es } : null;
    atis.vis = weather ? { km: between(rand, weather.vis[0], weather.vis[1]) } : { km: pick(rand, [10, 10, 10, 8, 7, 6]) };
    atis.clouds = chance(rand, 0.2) ? [] : cloudLayers(rand);
    atis.temp = between(rand, 4, 30);
  }
  atis.dew = Math.max(0, atis.temp - between(rand, 1, 9));
  atis.remark = chance(rand, 0.3) ? pick(rand, REMARKS) : null;
  return atis;
};

const windText = (wind) => {
  if (wind.calm) return 'Wind calm.';
  const base = `Wind ${digits(wind.dir, 3)} degrees, ${digits(wind.spd)} knots`;
  return wind.gust ? `${base}, gusting ${digits(wind.gust)} knots.` : `${base}.`;
};

const windKey = (wind) => {
  if (wind.calm) return 'Calma (CALM)';
  return `${String(wind.dir).padStart(3, '0')}/${wind.spd}${wind.gust ? `G${wind.gust}` : ''} kt`;
};

const cloudText = (layers) => {
  if (!layers.length) return 'Sky clear.';
  return `${layers.map((layer, index) => `${index === 0 ? 'Clouds, ' : ''}${CLOUD[layer.type]} at ${heightWords(layer.feet)} feet`).join(', ')}.`;
};

/**
 * Las líneas que se leen, en orden. Cada una dice qué dato lleva (`label`, `value`) para armar
 * la respuesta; las que no llevan dato (`label` vacío) son solo texto.
 */
export const atisLines = (atis) => {
  const lines = [
    { id: 'letter', text: `${atis.name} information ${PHONETIC[atis.letter]}.`, label: 'Letra', value: `${PHONETIC[atis.letter]} (${String.fromCharCode(65 + atis.letter)})` },
    { id: 'time', text: `Time ${digits(atis.time)}.`, label: 'Hora (UTC)', value: atis.time },
    { id: 'runway', text: `Runway ${digits(atis.runway)} in use.`, label: 'Pista en uso', value: atis.runway },
    { id: 'wind', text: windText(atis.wind), label: 'Viento', value: windKey(atis.wind) },
  ];
  if (atis.cavok) {
    lines.push({ id: 'cavok', text: 'CAVOK.', label: 'Visibilidad, tiempo y nubes', value: 'CAVOK (10 km o más, sin tiempo, sin nubes bajo 5000 ft)' });
  } else {
    const km = atis.vis.km;
    lines.push({ id: 'vis', text: `Visibility ${digits(km)} ${km === 1 ? 'kilometer' : 'kilometers'}.`, label: 'Visibilidad', value: `${km} km` });
    if (atis.weather) lines.push({ id: 'weather', text: `Weather ${atis.weather.en}.`, label: 'Tiempo presente', value: atis.weather.es });
    lines.push({
      id: 'sky',
      text: cloudText(atis.clouds),
      label: 'Nubes',
      value: atis.clouds.length ? atis.clouds.map((layer) => `${layer.type} ${layer.feet}`).join(' · ') : 'Cielo despejado (SKC)',
    });
  }
  lines.push(
    { id: 'temp', text: `Temperature ${digits(atis.temp, 2)}.`, label: 'Temperatura', value: `${atis.temp} °C` },
    { id: 'dew', text: `Dew point ${digits(atis.dew, 2)}.`, label: 'Punto de rocío', value: `${atis.dew} °C` },
    { id: 'qnh', text: `QNH ${digits(atis.qnh)}.`, label: 'QNH', value: `${atis.qnh} hPa` },
  );
  if (atis.remark) lines.push({ id: 'remark', text: atis.remark.en, label: 'Observaciones', value: atis.remark.es });
  lines.push({ id: 'advise', text: `Advise on initial contact you have information ${PHONETIC[atis.letter]}.`, label: '', value: '' });
  return lines;
};

/** Los datos que hay que anotar, sin las líneas que solo acompañan. */
export const atisKey = (atis) => atisLines(atis).filter((line) => line.label);

/** Cuántos datos tiene para anotar. */
export const atisFieldCount = (atis) => atisKey(atis).length;
