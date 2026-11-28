/**
 * Cálculos de cabina. Fórmulas de regla de mano, las mismas que se enseñan en el curso:
 * sirven para planificar, no reemplazan el manual del avión ni la información oficial.
 */

const rad = (deg) => (deg * Math.PI) / 180;
const norm360 = (deg) => ((deg % 360) + 360) % 360;

/** Componentes del viento sobre una pista o un rumbo. Positivo: de frente / desde la derecha. */
export function windComponents(runwayHeading, windFrom, windSpeed) {
  const angle = rad(windFrom - runwayHeading);
  const head = windSpeed * Math.cos(angle);
  const cross = windSpeed * Math.sin(angle);
  return { head, cross, angle: norm360(windFrom - runwayHeading) };
}

/** Triángulo de viento: corrección de deriva, rumbo y velocidad respecto del suelo. */
export function windTriangle(course, tas, windFrom, windSpeed) {
  if (!(tas > 0)) return null;
  const angle = rad(windFrom - course);
  const ratio = (windSpeed / tas) * Math.sin(angle);
  if (Math.abs(ratio) > 1) return null;
  const wca = (Math.asin(ratio) * 180) / Math.PI;
  const gs = tas * Math.cos(rad(wca)) - windSpeed * Math.cos(angle);
  return { wca, heading: norm360(course + wca), gs };
}

/** Combustible necesario: rodaje + vuelo + reserva, con el consumo por hora. */
export function fuelPlan({ perHour, flightMinutes, reserveMinutes = 45, taxi = 0, onBoard }) {
  const flight = (perHour * flightMinutes) / 60;
  const reserve = (perHour * reserveMinutes) / 60;
  const needed = flight + reserve + taxi;
  const result = { flight, reserve, taxi, needed };
  if (onBoard > 0 && perHour > 0) {
    result.enduranceMinutes = ((onBoard - taxi) / perHour) * 60;
    result.margin = onBoard - needed;
  }
  return result;
}

/**
 * Altitud presión y de densidad en pies. Cada hPa son unos 30 ft (27 ft cerca del nivel del mar, 30 es la
 * cuenta de cabina), la ISA baja 2 °C cada 1000 ft y cada grado sobre la ISA suma unos 120 ft.
 */
export function densityAltitude({ elevationFt, qnh, oat }) {
  const pressureAlt = elevationFt + (1013.25 - qnh) * 30;
  const isa = 15 - (2 * pressureAlt) / 1000;
  return { pressureAlt, isa, density: pressureAlt + 120 * (oat - isa) };
}

/** Base de nubes cúmulos: unos 400 ft por cada grado entre temperatura y punto de rocío. */
export const cloudBase = (temp, dew) => Math.max(0, (temp - dew) * 400);

/** Distancia de planeo en millas náuticas con la relación de planeo (por ejemplo 9 a 1), sin viento. */
export const glideDistanceNm = (heightFt, ratio) => (heightFt * ratio) / 6076.12;

/** Unidades: cada grupo tiene su unidad base y el factor de cada una. La temperatura va aparte. */
export const UNITS = {
  Velocidad: { kt: 1, 'km/h': 1 / 1.852, mph: 1 / 1.150779, 'm/s': 1 / 0.514444 },
  Distancia: { NM: 1, km: 1 / 1.852, SM: 1 / 1.150779 },
  Altura: { ft: 1, m: 1 / 0.3048 },
  Volumen: { L: 1, 'gal US': 3.785411784, 'gal imp': 4.54609 },
  Peso: { kg: 1, lb: 0.45359237 },
  Presión: { hPa: 1, inHg: 33.8638866667, mmHg: 1.33322368 },
  Temperatura: { '°C': 'c', '°F': 'f', K: 'k' },
};

export function convert(group, value, from, to) {
  if (group === 'Temperatura') {
    const c = from === '°C' ? value : from === '°F' ? ((value - 32) * 5) / 9 : value - 273.15;
    return to === '°C' ? c : to === '°F' ? (c * 9) / 5 + 32 : c + 273.15;
  }
  const units = UNITS[group];
  return (value * units[from]) / units[to];
}

/** Peso del combustible: avgas pesa unos 0,72 kg por litro y el Jet A-1 unos 0,80. */
export const FUEL_DENSITY = { 'Avgas 100LL': 0.72, 'Jet A-1': 0.8 };
