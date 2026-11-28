import test from 'node:test';
import assert from 'node:assert/strict';
import { blockMinutes, formatDecimal, formatDuration, normalizeFlight, parseDuration, recency, reviewFlights, totals } from '../src/bitacora/logbook.js';
import { flightsToCsv, guessMapping, parseCsv, parseDate, rowsToFlights } from '../src/bitacora/csv.js';
import { alerts, docStatus, statusText } from '../src/bitacora/documents.js';
import { fplMessage, planFromAircraft, supplementary, validatePlan } from '../src/bitacora/fpl.js';
import { cloudBase, convert, densityAltitude, fuelPlan, glideDistanceNm, windComponents, windTriangle } from '../src/bitacora/calc.js';
import { isActive, parseNotamPlaces, parseNotamTable, parseUpdated, severity } from '../src/bitacora/notam.js';

const flight = (fields) => normalizeFlight({ id: fields.id ?? Math.random().toString(36), landingsDay: 1, ...fields });

test('parseDuration entiende H:MM, decimales y minutos', () => {
  assert.equal(parseDuration('1:30'), 90);
  assert.equal(parseDuration('1,5'), 90);
  assert.equal(parseDuration('1.2'), 72);
  assert.equal(parseDuration('45m'), 45);
  assert.equal(parseDuration('90'), 90);
  assert.equal(parseDuration('2'), 120);
  assert.equal(parseDuration(''), 0);
  assert.ok(Number.isNaN(parseDuration('una hora')));
});

test('formatDuration y formatDecimal', () => {
  assert.equal(formatDuration(95), '1:35');
  assert.equal(formatDuration(0), '0:00');
  assert.equal(formatDecimal(15), '0,3');
  assert.equal(formatDecimal(60), '1,0');
});

test('blockMinutes cruza la medianoche', () => {
  assert.equal(blockMinutes('23:30', '00:40'), 70);
  assert.equal(blockMinutes('1200', '1345'), 105);
  assert.equal(blockMinutes('', '10:00'), null);
});

test('normalizeFlight saca el total de la salida y la llegada y arregla la matrícula', () => {
  const f = normalizeFlight({ date: '2026-11-01', reg: 'lvabc', dep: '10:00', arr: '11:20' });
  assert.equal(f.total, 80);
  assert.equal(f.reg, 'LV-ABC');
  assert.equal(f.role, 'pic');
});

test('reviewFlights marca solapados, duplicados, aeronaves sin cargar y datos raros', () => {
  const aircraft = [{ reg: 'LV-ABC' }];
  const a = flight({ id: 'a', date: '2026-11-01', reg: 'LV-ABC', from: 'SADF', to: 'SADP', dep: '10:00', arr: '11:00', total: '1:00' });
  const b = flight({ id: 'b', date: '2026-11-01', reg: 'LV-ABC', from: 'SADP', to: 'SADF', dep: '10:30', arr: '11:30', total: '1:00' });
  const c = flight({ id: 'c', date: '2026-11-02', reg: 'LV-XYZ', from: 'SADF', to: 'SADF', total: '0:50' });
  const d = flight({ id: 'd', date: '2026-11-02', reg: 'LV-XYZ', from: 'SADF', to: 'SADF', total: '0:50' });
  const e = flight({ id: 'e', date: '2026-11-03', reg: 'LV-ABC', total: '1:00', night: '2:00', dep: '10:00', arr: '12:00' });
  const issues = reviewFlights([a, b, c, d, e], aircraft, '2026-11-27');
  assert.ok(issues.get('a').some((issue) => issue.kind === 'solapado'));
  assert.ok(issues.get('b').some((issue) => issue.kind === 'solapado'));
  assert.ok(issues.get('c').some((issue) => issue.kind === 'duplicado'));
  assert.ok(issues.get('c').some((issue) => issue.kind === 'aeronave'));
  const eTexts = issues.get('e').map((issue) => issue.text).join(' ');
  assert.match(eTexts, /nocturno supera/);
  assert.match(eTexts, /Salida y llegada dan 2:00/);
});

test('un vuelo que cruza la medianoche se superpone con uno del día siguiente', () => {
  const a = flight({ id: 'a', date: '2026-11-01', reg: 'LV-ABC', dep: '23:30', arr: '01:00' });
  const b = flight({ id: 'b', date: '2026-11-02', reg: 'LV-ABC', dep: '00:30', arr: '01:30' });
  const issues = reviewFlights([a, b], [{ reg: 'LV-ABC' }], '2026-11-27');
  assert.ok(issues.get('a')?.some((issue) => issue.kind === 'solapado'));
});

test('totals separa el simulador y agrupa por tipo, categoría y ruta', () => {
  const aircraft = [{ reg: 'LV-ABC', type: 'C152', category: 'Avión', engine: 'mono' }];
  const flights = [
    flight({ date: '2026-10-01', reg: 'LV-ABC', type: 'C152', from: 'SADF', to: 'SADP', total: '1:00', role: 'dual', night: '0:30', landingsNight: 1 }),
    flight({ date: '2026-10-05', reg: 'LV-ABC', type: 'C152', from: 'SADF', to: 'SADF', total: '0:30', role: 'pic' }),
    flight({ date: '2026-10-06', type: 'SIM', total: '2:00', sim: true, hood: '2:00' }),
  ];
  const t = totals(flights, aircraft);
  assert.equal(t.all.total, 90);
  assert.equal(t.all.sim, 120);
  assert.equal(t.all.dual, 60);
  assert.equal(t.all.pic, 30);
  assert.equal(t.all.night, 30);
  assert.equal(t.all.xc, 60);
  assert.equal(t.byType[0].key, 'C152');
  assert.equal(t.byCategory[0].key, 'Avión monomotor');
  assert.equal(t.byRoute.length, 2);
  assert.equal(t.byMonth[0].key, '2026-10');
});

test('recency cuenta los últimos 90 días', () => {
  const flights = [
    flight({ date: '2026-11-20', total: '1:00', landingsDay: 2, landingsNight: 1, night: '0:30' }),
    flight({ date: '2026-07-01', total: '1:00', landingsDay: 5 }),
  ];
  const r = recency(flights, '2026-11-27');
  assert.equal(r.landings, 3);
  assert.equal(r.landingsNight, 1);
  assert.equal(r.minutes, 60);
});

test('parseCsv detecta punto y coma, comillas y saltos dentro de una celda', () => {
  const rows = parseCsv('﻿Fecha;Obs\r\n01/11/2026;"dijo ""hola""\nchau"\r\n');
  assert.deepEqual(rows, [['Fecha', 'Obs'], ['01/11/2026', 'dijo "hola"\nchau']]);
  assert.deepEqual(parseCsv('a,b\n1,2'), [['a', 'b'], ['1', '2']]);
});

test('parseDate entiende formatos de planilla', () => {
  assert.equal(parseDate('28/11/2026'), '2026-11-28');
  assert.equal(parseDate('1-2-26'), '2026-02-01');
  assert.equal(parseDate('2026-11-28'), '2026-11-28');
  assert.equal(parseDate('45000'), '2023-03-15');
});

test('una planilla con una columna por función se importa bien', () => {
  const rows = parseCsv('Fecha,Matrícula,Desde,Hasta,Doble comando,PIC,Aterrizajes\n01/11/2026,LV-ABC,SADF,SADP,1.2,,2\n02/11/2026,LV-ABC,SADP,SADF,,0:45,1');
  const mapping = guessMapping(rows[0]);
  assert.equal(mapping.date, 0);
  assert.equal(mapping.reg, 1);
  assert.equal(mapping.dual, 4);
  const flights = rowsToFlights(rows.slice(1), mapping);
  assert.equal(flights[0].role, 'dual');
  assert.equal(flights[0].total, 72);
  assert.equal(flights[1].role, 'pic');
  assert.equal(flights[1].total, 45);
  assert.equal(flights[0].landingsDay, 2);
});

test('el CSV exportado se vuelve a importar igual', () => {
  const original = [flight({ date: '2026-11-01', reg: 'LV-ABC', type: 'C152', from: 'SADF', to: 'SADP', dep: '10:00', arr: '11:00', total: '1:00', role: 'instructor', night: '0:20', landingsDay: 1, landingsNight: 2, remarks: 'Viento; cruzado' })];
  const rows = parseCsv(flightsToCsv(original));
  const back = rowsToFlights(rows.slice(1), guessMapping(rows[0]));
  const { id, ...rest } = original[0];
  const { id: _, ...again } = back[0];
  assert.deepEqual(again, rest);
});

test('docStatus y alerts', () => {
  assert.equal(docStatus({ expires: '2026-11-20' }, '2026-11-27').state, 'vencido');
  assert.equal(docStatus({ expires: '2026-12-20' }, '2026-11-27').state, 'por-vencer');
  assert.equal(docStatus({ expires: '2026-12-20', warnDays: 10 }, '2026-11-27').state, 'vigente');
  assert.equal(docStatus({ expires: '' }).state, 'sin-vencimiento');
  assert.equal(statusText(docStatus({ expires: '2026-11-28' }, '2026-11-27')), 'Vence mañana');
  const list = alerts([{ name: 'a', expires: '2026-12-20' }, { name: 'b', expires: '2026-11-01' }, { name: 'c', expires: '2028-01-01' }], '2026-11-27');
  assert.deepEqual(list.map((item) => item.doc.name), ['b', 'a']);
});

const goodPlan = {
  acid: 'LV-ABC', rules: 'V', flightType: 'G', acType: 'c152', wake: 'L', equipment: 'S', surveillance: 'C',
  adep: 'SADF', eobt: '1300', speed: 'N0095', level: 'VFR', route: 'DCT', ades: 'SADP', eet: '0045', altn1: 'SAEZ',
  other: 'DOF/261128', endurance: '0400', persons: '2', pic: 'Juana Pérez', colour: 'blanco y rojo',
};

test('validatePlan acepta un plan completo y avisa lo que falta', () => {
  assert.deepEqual(validatePlan(goodPlan), []);
  const issues = validatePlan({ ...goodPlan, eobt: '2560', adep: 'SAD', rules: 'I' });
  assert.deepEqual(issues.map((issue) => issue.item).sort(), [13, 13, 15]);
  assert.ok(validatePlan({ ...goodPlan, acType: 'ZZZZ' }).some((issue) => issue.item === 18));
});

test('fplMessage arma el mensaje OACI', () => {
  assert.equal(fplMessage(goodPlan), '(FPL-LVABC-VG\n-C152/L-S/C\n-SADF1300\n-N0095VFR DCT\n-SADP0045 SAEZ\n-DOF/261128)');
  assert.equal(supplementary(goodPlan), 'E/0400 P/2 R/VE A/BLANCO Y ROJO C/JUANA PÉREZ');
  assert.equal(planFromAircraft({ reg: 'LV-ABC', type: 'C152' }).acid, 'LVABC');
});

test('cálculos de cabina', () => {
  const wind = windComponents(110, 140, 20);
  assert.ok(Math.abs(wind.head - 17.32) < 0.01);
  assert.ok(Math.abs(wind.cross - 10) < 0.01);
  const tri = windTriangle(90, 100, 360, 20);
  assert.ok(Math.abs(tri.wca + 11.54) < 0.01);
  assert.ok(Math.abs(tri.gs - 97.98) < 0.01);
  const fuel = fuelPlan({ perHour: 24, flightMinutes: 90, reserveMinutes: 45, taxi: 2, onBoard: 90 });
  assert.equal(fuel.needed, 36 + 18 + 2);
  assert.equal(fuel.enduranceMinutes, 220);
  const da = densityAltitude({ elevationFt: 0, qnh: 1013.25, oat: 30 });
  assert.equal(da.pressureAlt, 0);
  assert.equal(da.density, 1800);
  assert.equal(cloudBase(25, 15), 4000);
  assert.ok(Math.abs(glideDistanceNm(6076.12, 9) - 9) < 1e-9);
  assert.ok(Math.abs(convert('Velocidad', 100, 'kt', 'km/h') - 185.2) < 1e-9);
  assert.ok(Math.abs(convert('Temperatura', 100, '°C', '°F') - 212) < 1e-9);
  assert.ok(Math.abs(convert('Presión', 29.92, 'inHg', 'hPa') - 1013.2) < 0.1);
});

const PIB = `<table id="datatable"><tbody id="pibdata">
                    <tr>
                <td id="place">
                    <p>A4676/2026</p>
                    <p>AEROPARQUE J. NEWBERY</p>
                    <p>(AER)</p>
                </td>
                <td id="info">
                    <p>Desde: 2026-11-05 04:00:00</p>
                    <p>Hasta: 2026-11-28 08:00:00                    </p>
                    <p>RWY 13/31 CLSD WIP MAINT <span id="versionbreak">Versión en Español:</span> RWY 13/31 CLSD OBRAS</p>
                </td>
            </tr>
            </tbody></table>`;

test('parseNotamTable lee la tabla de ANAC', () => {
  const [notam] = parseNotamTable(PIB);
  assert.deepEqual(notam, {
    id: 'A4676/2026', place: 'AEROPARQUE J. NEWBERY', location: 'AER',
    from: '2026-11-05 04:00:00', to: '2026-11-28 08:00:00', text: 'RWY 13/31 CLSD WIP MAINT', textEs: 'RWY 13/31 CLSD OBRAS',
  });
  assert.equal(severity(notam.text), 3);
  assert.equal(severity('NDB LI N 375 KHZ RWY 11 U/S'), 3);
  assert.equal(severity('ACFT STAND 47 CLSD WIP MAINT'), 2);
  assert.equal(severity('AIP SUP PUBLISHED'), 1);
  assert.equal(isActive(notam, Date.parse('2026-11-27T12:00:00Z')), true);
  assert.equal(isActive(notam, Date.parse('2026-11-29T12:00:00Z')), false);
});

test('parseNotamPlaces y parseUpdated leen la página', () => {
  const html = '<h5 id="pibupdate" class="text-center">Última actualización: 27 Nov 2026 21:56</h5><select class="form-control" id="locations" type="text"><option>Seleccione un lugar</option><option value="AER">AEROPARQUE J. NEWBERY</option><option value="MLG">MALARG&Uuml;E</option></select>';
  assert.deepEqual(parseNotamPlaces(html), [{ code: 'AER', name: 'AEROPARQUE J. NEWBERY' }, { code: 'MLG', name: 'MALARGÜE' }]);
  assert.equal(parseUpdated(html), '27 Nov 2026 21:56');
});

test('paginateBook suma cada hoja y arrastra el acumulado', async () => {
  const { paginateBook } = await import('../src/bitacora/logbook.js');
  const flights = Array.from({ length: 5 }, (_, i) => flight({ date: `2026-01-0${5 - i}`, total: '1:00', role: i === 0 ? 'instructor' : 'pic', landingsDay: 1 }));
  flights.push(flight({ date: '2026-01-06', total: '2:00', sim: true, hood: '2:00', landingsDay: 0 }));
  const pages = paginateBook(flights, 2);
  assert.equal(pages.length, 3);
  assert.equal(pages[0].rows[0].date, '2026-01-01');
  assert.equal(pages[0].page.total, 120);
  assert.equal(pages[1].previous.total, 120);
  assert.equal(pages[1].total.total, 240);
  assert.equal(pages[2].page.total, 60);
  assert.equal(pages[2].page.hood, 120);
  assert.equal(pages[2].total.total, 300);
  assert.equal(pages[2].total.instructor, 60);
  assert.equal(pages[2].total.landingsDay, 5);
});

test('un vuelo dado por revisado sale de los avisos hasta que se cambia un dato', async () => {
  const { flightSignature, splitAccepted } = await import('../src/bitacora/logbook.js');
  const base = normalizeFlight({ id: 'a', date: '2026-11-01', reg: 'LV-ZZZ', from: 'SADF', to: 'SADP', total: '1:00', landingsDay: 1 });
  const flight = { ...base, accepted: { note: 'Avión del aeroclub.', signature: flightSignature(base) } };
  const issues = reviewFlights([flight], [], '2026-11-28');
  assert.equal(issues.size, 1);
  let split = splitAccepted(issues, [flight]);
  assert.equal(split.open.size, 0);
  assert.equal(split.accepted.size, 1);
  const edited = { ...flight, total: 75 };
  split = splitAccepted(reviewFlights([edited], [], '2026-11-28'), [edited]);
  assert.equal(split.open.size, 1);
  const noNote = { ...flight, accepted: { note: '', signature: flightSignature(base) } };
  assert.equal(splitAccepted(issues, [noNote]).open.size, 1);
});
