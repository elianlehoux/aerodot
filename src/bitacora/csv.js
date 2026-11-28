/**
 * CSV de vuelos: leer planillas de otros (Excel, Google Sheets, otras apps) y exportar el libro.
 * Se detecta el separador (coma, punto y coma o tabulación) y qué columna es cada dato.
 */
import { formatDuration, normalizeFlight } from './logbook.js';

/** Separa un CSV en filas y celdas, respetando las comillas. */
export function parseCsv(text) {
  const source = String(text).replace(/^﻿/, '');
  const firstLine = source.split(/\r?\n/, 1)[0] ?? '';
  const count = (char) => firstLine.split(char).length - 1;
  const sep = [';', '\t', ','].sort((a, b) => count(b) - count(a))[0];
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (quoted) {
      if (char === '"' && source[i + 1] === '"') { cell += '"'; i += 1; }
      else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === sep) { row.push(cell); cell = ''; }
    else if (char === '\n' || char === '\r') {
      if (char === '\r' && source[i + 1] === '\n') i += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else cell += char;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((cells) => cells.some((value) => value.trim()));
}

/** Los datos de un vuelo que se pueden traer de una planilla, con nombres de columna comunes. */
export const FIELDS = [
  { id: 'date', label: 'Fecha', names: ['fecha', 'date', 'dia', 'día'] },
  { id: 'reg', label: 'Matrícula', names: ['matricula', 'matrícula', 'registration', 'reg', 'aeronave', 'aircraft id', 'tail'] },
  { id: 'type', label: 'Tipo', names: ['tipo', 'type', 'modelo', 'aircraft type', 'tipo de aeronave', 'marca y modelo'] },
  { id: 'from', label: 'Desde', names: ['desde', 'from', 'origen', 'salida lugar', 'dep', 'departure', 'de'] },
  { id: 'to', label: 'Hasta', names: ['hasta', 'to', 'destino', 'llegada lugar', 'arr', 'arrival', 'a'] },
  { id: 'dep', label: 'Hora de salida', names: ['hora salida', 'hora de salida', 'salida', 'off block', 'out', 'dep time', 'departure time'] },
  { id: 'arr', label: 'Hora de llegada', names: ['hora llegada', 'hora de llegada', 'llegada', 'on block', 'in', 'arr time', 'arrival time'] },
  { id: 'total', label: 'Tiempo total', names: ['total', 'tiempo total', 'total time', 'horas', 'tiempo', 'duracion', 'duración', 'block'] },
  { id: 'role', label: 'Función', names: ['funcion', 'función', 'role', 'rol'] },
  { id: 'pic', label: 'Al mando (tiempo)', names: ['pic', 'piloto al mando', 'al mando', 'p1'] },
  { id: 'dual', label: 'Doble comando (tiempo)', names: ['doble comando', 'dual', 'instruccion recibida', 'instrucción recibida'] },
  { id: 'sic', label: 'Copiloto (tiempo)', names: ['copiloto', 'sic', 'p2'] },
  { id: 'instructor', label: 'Instructor (tiempo)', names: ['instructor', 'instruccion impartida', 'instrucción impartida'] },
  { id: 'night', label: 'Nocturno', names: ['nocturno', 'noche', 'night'] },
  { id: 'ifr', label: 'Instrumentos reales', names: ['ifr', 'imc', 'instrumentos', 'instrumentos reales', 'actual'] },
  { id: 'hood', label: 'Instrumentos simulados', names: ['capota', 'simulado', 'instrumentos simulados', 'hood', 'simulated'] },
  { id: 'sim', label: 'Simulador', names: ['simulador', 'sim', 'ftd', 'fstd'] },
  { id: 'landingsDay', label: 'Aterrizajes de día', names: ['aterrizajes', 'aterrizajes dia', 'aterrizajes día', 'ldg', 'landings', 'ldg day', 'day landings'] },
  { id: 'landingsNight', label: 'Aterrizajes de noche', names: ['aterrizajes noche', 'aterrizajes nocturnos', 'ldg night', 'night landings'] },
  { id: 'remarks', label: 'Observaciones', names: ['observaciones', 'remarks', 'notas', 'comentarios', 'obs'] },
];

const plain = (text) => String(text).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

/** Propone qué columna es cada dato. Devuelve { fieldId: índice de columna }. */
export function guessMapping(header) {
  const mapping = {};
  const used = new Set();
  const cells = header.map(plain);
  for (const field of FIELDS) {
    const names = field.names.map(plain);
    let index = cells.findIndex((cell, i) => !used.has(i) && names.includes(cell));
    if (index < 0) index = cells.findIndex((cell, i) => !used.has(i) && names.some((name) => name.length > 3 && cell.includes(name)));
    if (index >= 0) { mapping[field.id] = index; used.add(index); }
  }
  return mapping;
}

/** "28/11/2026", "28-11-26", "2026-11-28" o un número de serie de Excel a AAAA-MM-DD. */
export function parseDate(text) {
  const value = String(text ?? '').trim();
  let match = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (match) return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
  match = value.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/);
  if (match) {
    const year = match[3].length === 2 ? `20${match[3]}` : match[3];
    return `${year}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
  }
  if (/^\d{5}$/.test(value)) return new Date(Date.UTC(1899, 11, 30) + Number(value) * 86400000).toISOString().slice(0, 10);
  return '';
}

const roleFrom = (text) => {
  const value = plain(text);
  if (/instr/.test(value)) return 'instructor';
  if (/cop|sic|p2/.test(value)) return 'sic';
  if (/doble|dual|alumno/.test(value)) return 'dual';
  if (/solo/.test(value)) return 'solo';
  return 'pic';
};

/** Convierte las filas (sin el encabezado) en vuelos usando el mapeo elegido. */
export function rowsToFlights(rows, mapping) {
  const get = (row, id) => (mapping[id] === undefined || mapping[id] === null || mapping[id] === '' ? '' : row[mapping[id]] ?? '');
  return rows.map((row) => {
    let role = mapping.role !== undefined ? roleFrom(get(row, 'role')) : null;
    if (!role) {
      // Planillas con una columna por función: gana la que tenga tiempo.
      role = ['instructor', 'sic', 'dual', 'pic'].find((id) => mapping[id] !== undefined && String(get(row, id)).trim() && String(get(row, id)).trim() !== '0') ?? 'pic';
    }
    const total = get(row, 'total') || get(row, role);
    return normalizeFlight({
      date: parseDate(get(row, 'date')),
      reg: get(row, 'reg'),
      type: get(row, 'type'),
      from: get(row, 'from'),
      to: get(row, 'to'),
      dep: get(row, 'dep'),
      arr: get(row, 'arr'),
      total,
      role,
      night: get(row, 'night'),
      ifr: get(row, 'ifr'),
      hood: get(row, 'hood'),
      sim: /^(s|si|sí|x|1|true|yes)$/i.test(String(get(row, 'sim')).trim()),
      landingsDay: get(row, 'landingsDay'),
      landingsNight: get(row, 'landingsNight'),
      remarks: get(row, 'remarks'),
    });
  }).filter((flight) => flight.date || flight.total);
}

const cell = (value) => {
  const text = String(value ?? '');
  return /[";\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/** El libro entero en CSV con punto y coma, que Excel en español abre bien. */
export function flightsToCsv(flights) {
  const header = ['Fecha', 'Matrícula', 'Tipo', 'Desde', 'Hasta', 'Hora de salida', 'Hora de llegada', 'Tiempo total', 'Función', 'Nocturno', 'Instrumentos reales', 'Instrumentos simulados', 'Simulador', 'Aterrizajes día', 'Aterrizajes noche', 'Observaciones'];
  const roles = { pic: 'Piloto al mando', solo: 'Solo', dual: 'Doble comando', sic: 'Copiloto', instructor: 'Instructor' };
  const lines = flights.map((flight) => [
    flight.date, flight.reg, flight.type, flight.from, flight.to, flight.dep, flight.arr,
    formatDuration(flight.total), roles[flight.role], formatDuration(flight.night), formatDuration(flight.ifr), formatDuration(flight.hood),
    flight.sim ? 'sí' : '', flight.landingsDay, flight.landingsNight, flight.remarks,
  ].map(cell).join(';'));
  return `﻿${[header.join(';'), ...lines].join('\r\n')}\r\n`;
}
