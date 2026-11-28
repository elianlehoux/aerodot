/**
 * Libro de vuelo: tiempos, revisión de vuelos y totales. Todo puro, sin DOM ni guardado.
 * Los tiempos se guardan en minutos enteros. Se muestran como H:MM o en décimas de hora.
 */

export const ROLES = [
  { id: 'pic', label: 'Piloto al mando' },
  { id: 'solo', label: 'Solo (alumno)' },
  { id: 'dual', label: 'Doble comando (alumno)' },
  { id: 'sic', label: 'Copiloto' },
  { id: 'instructor', label: 'Instructor' },
];

export const roleLabel = (id) => ROLES.find((role) => role.id === id)?.label ?? 'Sin función';

/** "1:30", "1.5", "1,5", "90m" o "90" (minutos si no hay separador y pasa de 24) a minutos. */
export function parseDuration(text) {
  if (text === null || text === undefined) return 0;
  if (typeof text === 'number') return Number.isFinite(text) && text > 0 ? Math.round(text) : 0;
  const value = String(text).trim().toLowerCase();
  if (!value) return 0;
  let match = value.match(/^(\d{1,3}):([0-5]\d)$/);
  if (match) return Number(match[1]) * 60 + Number(match[2]);
  match = value.match(/^(\d+)\s*m(in)?$/);
  if (match) return Number(match[1]);
  match = value.match(/^(\d+)(?:[.,](\d+))?\s*h?$/);
  if (match) {
    if (!match[2] && Number(match[1]) > 24 && !value.endsWith('h')) return Number(match[1]);
    return Math.round(Number(`${match[1]}.${match[2] ?? 0}`) * 60);
  }
  return NaN;
}

export function formatDuration(minutes) {
  const total = Math.max(0, Math.round(minutes || 0));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

/** En décimas de hora, redondeando cada 6 minutos (15 minutos se redondean a 0,3 h). */
export const formatDecimal = (minutes) => (Math.round((minutes || 0) / 6) / 10).toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const clock = (text) => {
  const match = String(text ?? '').trim().match(/^([01]?\d|2[0-3]):?([0-5]\d)$/);
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
};

/** Minutos entre la salida y la llegada. Si la llegada es menor, el vuelo cruzó la medianoche. */
export function blockMinutes(dep, arr) {
  const a = clock(dep);
  const b = clock(arr);
  if (a === null || b === null) return null;
  return b >= a ? b - a : b + 1440 - a;
}

export const normalizeReg = (reg) => String(reg ?? '').toUpperCase().replace(/\s+/g, '').replace(/^LV(?=[A-Z]{3}$)/, 'LV-');

/** Deja un vuelo con todos sus campos y tipos, sin importar de dónde vino. */
export function normalizeFlight(input) {
  const int = (value) => {
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  };
  const dur = (value) => {
    const n = parseDuration(value);
    return Number.isFinite(n) ? n : 0;
  };
  const flight = {
    id: input.id,
    date: String(input.date ?? '').slice(0, 10),
    reg: normalizeReg(input.reg),
    type: String(input.type ?? '').trim().toUpperCase(),
    from: String(input.from ?? '').trim().toUpperCase(),
    to: String(input.to ?? '').trim().toUpperCase(),
    dep: String(input.dep ?? '').trim(),
    arr: String(input.arr ?? '').trim(),
    total: dur(input.total),
    role: ROLES.some((role) => role.id === input.role) ? input.role : 'pic',
    night: dur(input.night),
    ifr: dur(input.ifr),
    hood: dur(input.hood),
    sim: Boolean(input.sim) && input.sim !== 'false' && input.sim !== '0' && input.sim !== 'no',
    landingsDay: int(input.landingsDay),
    landingsNight: int(input.landingsNight),
    remarks: String(input.remarks ?? '').trim(),
  };
  if (!flight.total) {
    const block = blockMinutes(flight.dep, flight.arr);
    if (block) flight.total = block;
  }
  return flight;
}

const interval = (flight) => {
  const start = clock(flight.dep);
  const length = blockMinutes(flight.dep, flight.arr);
  if (start === null || length === null || !/^\d{4}-\d{2}-\d{2}$/.test(flight.date)) return null;
  const day = Date.parse(`${flight.date}T00:00:00Z`) / 60000;
  return [day + start, day + start + length];
};

/**
 * Revisa todos los vuelos juntos. Devuelve un Map id → lista de avisos { kind, text }.
 * kind: 'solapado', 'duplicado', 'aeronave', 'dato'.
 */
export function reviewFlights(flights, aircraft = [], today = new Date().toISOString().slice(0, 10)) {
  const issues = new Map();
  const add = (id, kind, text) => {
    if (!issues.has(id)) issues.set(id, []);
    issues.get(id).push({ kind, text });
  };
  const known = new Set(aircraft.map((item) => normalizeReg(item.reg)));

  for (const flight of flights) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(flight.date)) add(flight.id, 'dato', 'Falta la fecha o no es válida.');
    else if (flight.date > today) add(flight.id, 'dato', 'La fecha es posterior a hoy.');
    if (!flight.total) add(flight.id, 'dato', 'Falta el tiempo total.');
    if (flight.night > flight.total) add(flight.id, 'dato', 'El tiempo nocturno supera al total.');
    if (flight.ifr + flight.hood > flight.total) add(flight.id, 'dato', 'El tiempo por instrumentos supera al total.');
    const block = blockMinutes(flight.dep, flight.arr);
    if (block !== null && flight.total && Math.abs(block - flight.total) > 6) {
      add(flight.id, 'dato', `Salida y llegada dan ${formatDuration(block)}, pero el total es ${formatDuration(flight.total)}.`);
    }
    if (!flight.sim && !flight.landingsDay && !flight.landingsNight && flight.total) add(flight.id, 'dato', 'No tiene aterrizajes cargados.');
    if (flight.landingsNight && !flight.night) add(flight.id, 'dato', 'Tiene aterrizajes nocturnos sin tiempo nocturno.');
    if (!flight.sim && flight.reg && !known.has(flight.reg)) add(flight.id, 'aeronave', `${flight.reg} no está en tus aeronaves.`);
    if (!flight.sim && !flight.reg) add(flight.id, 'dato', 'Falta la matrícula.');
  }

  const byDate = new Map();
  for (const flight of flights) {
    if (!byDate.has(flight.date)) byDate.set(flight.date, []);
    byDate.get(flight.date).push(flight);
  }
  const seen = new Set();
  for (const flight of flights) {
    // Los vuelos que cruzan la medianoche pueden pisar al día siguiente.
    const next = new Date(Date.parse(`${flight.date}T00:00:00Z`) + 86400000).toISOString().slice(0, 10);
    const candidates = [...(byDate.get(flight.date) ?? []), ...(byDate.get(next) ?? [])];
    for (const other of candidates) {
      if (other.id === flight.id) continue;
      const pair = [flight.id, other.id].sort().join('|');
      if (seen.has(pair)) continue;
      seen.add(pair);
      const same = other.date === flight.date && other.reg === flight.reg && other.from === flight.from && other.to === flight.to
        && other.total === flight.total && other.dep === flight.dep;
      if (same) {
        add(flight.id, 'duplicado', 'Hay otro vuelo igual el mismo día.');
        add(other.id, 'duplicado', 'Hay otro vuelo igual el mismo día.');
        continue;
      }
      const a = interval(flight);
      const b = interval(other);
      if (a && b && a[0] < b[1] && b[0] < a[1]) {
        add(flight.id, 'solapado', `Se superpone con el vuelo ${other.from || '?'} → ${other.to || '?'} de ${other.dep}.`);
        add(other.id, 'solapado', `Se superpone con el vuelo ${flight.from || '?'} → ${flight.to || '?'} de ${flight.dep}.`);
      }
    }
  }
  return issues;
}

const emptyTotals = () => ({ flights: 0, total: 0, pic: 0, solo: 0, dual: 0, sic: 0, instructor: 0, night: 0, ifr: 0, hood: 0, sim: 0, landingsDay: 0, landingsNight: 0, xc: 0 });

function addTo(sum, flight) {
  sum.flights += 1;
  if (flight.sim) {
    sum.sim += flight.total;
    sum.hood += flight.hood;
    return sum;
  }
  sum.total += flight.total;
  sum[flight.role] += flight.total;
  sum.night += flight.night;
  sum.ifr += flight.ifr;
  sum.hood += flight.hood;
  sum.landingsDay += flight.landingsDay;
  sum.landingsNight += flight.landingsNight;
  if (flight.from && flight.to && flight.from !== flight.to) sum.xc += flight.total;
  return sum;
}

/**
 * Totales generales y agrupados. El simulador se suma aparte: no cuenta como tiempo de vuelo.
 * La categoría sale de la aeronave guardada con esa matrícula.
 */
export function totals(flights, aircraft = []) {
  const byReg = new Map(aircraft.map((item) => [normalizeReg(item.reg), item]));
  const all = emptyTotals();
  const groups = { type: new Map(), reg: new Map(), category: new Map(), route: new Map(), month: new Map() };
  const bump = (map, key, flight) => {
    if (!map.has(key)) map.set(key, emptyTotals());
    addTo(map.get(key), flight);
  };
  for (const flight of flights) {
    addTo(all, flight);
    if (flight.sim) continue;
    const plane = byReg.get(flight.reg);
    bump(groups.type, flight.type || plane?.type || 'Sin tipo', flight);
    bump(groups.reg, flight.reg || 'Sin matrícula', flight);
    bump(groups.category, plane ? categoryLabel(plane) : 'Sin aeronave cargada', flight);
    if (flight.from || flight.to) bump(groups.route, `${flight.from || '?'} → ${flight.to || '?'}`, flight);
    if (flight.date) bump(groups.month, flight.date.slice(0, 7), flight);
  }
  const sorted = (map) => [...map.entries()].map(([key, sum]) => ({ key, ...sum })).sort((a, b) => b.total - a.total || a.key.localeCompare(b.key));
  return {
    all,
    byType: sorted(groups.type),
    byReg: sorted(groups.reg),
    byCategory: sorted(groups.category),
    byRoute: sorted(groups.route),
    byMonth: [...groups.month.entries()].map(([key, sum]) => ({ key, ...sum })).sort((a, b) => a.key.localeCompare(b.key)),
  };
}

export const CATEGORIES = ['Avión', 'Helicóptero', 'Planeador', 'Ultraliviano', 'Globo', 'Simulador'];
export const ENGINES = [
  { id: 'mono', label: 'Monomotor' },
  { id: 'multi', label: 'Multimotor' },
  { id: 'none', label: 'Sin motor' },
];

export function categoryLabel(plane) {
  const engine = ENGINES.find((item) => item.id === plane.engine);
  return engine && plane.engine !== 'none' && plane.category === 'Avión' ? `Avión ${engine.label.toLowerCase()}` : plane.category || 'Sin categoría';
}

/**
 * Experiencia reciente de los últimos 90 días: aterrizajes de día y de noche.
 * La norma pide 3 en 90 días para llevar pasajeros (y 3 nocturnos para hacerlo de noche).
 */
export function recency(flights, today = new Date().toISOString().slice(0, 10)) {
  const from = new Date(Date.parse(`${today}T00:00:00Z`) - 90 * 86400000).toISOString().slice(0, 10);
  const recent = flights.filter((flight) => !flight.sim && flight.date > from && flight.date <= today);
  return {
    from,
    minutes: recent.reduce((sum, flight) => sum + flight.total, 0),
    landings: recent.reduce((sum, flight) => sum + flight.landingsDay + flight.landingsNight, 0),
    landingsNight: recent.reduce((sum, flight) => sum + flight.landingsNight, 0),
  };
}

/** Los vuelos del más nuevo al más viejo; a igual fecha, por hora de salida. */
export const sortFlights = (flights) => [...flights].sort((a, b) => b.date.localeCompare(a.date) || (b.dep || '').localeCompare(a.dep || '') || (b.createdAt ?? 0) - (a.createdAt ?? 0));

/** Las columnas de tiempo del libro en papel, en el orden en que se suman al pie de cada hoja. */
export const BOOK_COLUMNS = ['total', 'pic', 'dual', 'sic', 'instructor', 'night', 'ifr', 'hood', 'landingsDay', 'landingsNight'];

const bookRow = (flight) => {
  const time = flight.sim ? 0 : flight.total;
  return {
    total: time,
    pic: ['pic', 'solo'].includes(flight.role) ? time : 0,
    dual: flight.role === 'dual' ? time : 0,
    sic: flight.role === 'sic' ? time : 0,
    instructor: flight.role === 'instructor' ? time : 0,
    night: flight.sim ? 0 : flight.night,
    ifr: flight.sim ? 0 : flight.ifr,
    hood: flight.hood,
    landingsDay: flight.sim ? 0 : flight.landingsDay,
    landingsNight: flight.sim ? 0 : flight.landingsNight,
  };
};

const sum = (rows) => Object.fromEntries(BOOK_COLUMNS.map((key) => [key, rows.reduce((acc, row) => acc + row[key], 0)]));

/**
 * El libro en hojas, del vuelo más viejo al más nuevo. Cada hoja trae sus vuelos, lo que suma ella,
 * lo que venía de las anteriores y el acumulado, como el pie del libro en papel.
 * El simulador aparece en la hoja pero solo suma en instrumentos simulados.
 */
export function paginateBook(flights, perPage = 22) {
  const ordered = [...flights].sort((a, b) => a.date.localeCompare(b.date) || (a.dep || '').localeCompare(b.dep || '') || (a.createdAt ?? 0) - (b.createdAt ?? 0));
  const pages = [];
  let carried = sum([]);
  for (let i = 0; i < ordered.length; i += perPage) {
    const rows = ordered.slice(i, i + perPage);
    const page = sum(rows.map(bookRow));
    const total = Object.fromEntries(BOOK_COLUMNS.map((key) => [key, carried[key] + page[key]]));
    pages.push({ number: pages.length + 1, rows, page, previous: carried, total });
    carried = total;
  }
  return pages;
}
