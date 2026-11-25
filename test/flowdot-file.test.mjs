import test from 'node:test';
import assert from 'node:assert/strict';
import { backupFileName, exportFlowdot, fileNameFor, parseFlowdot, planImport } from '../src/flowdot/file.js';

const bytes = new Uint8Array([82, 73, 70, 70, 1, 2, 3, 250, 0, 9]);
const cabin = (id = 'c1') => ({
  id, name: 'Cessna 152', createdAt: 1, updatedAt: 2,
  image: { blob: new Blob([bytes], { type: 'image/webp' }), type: 'image/webp', width: 2560, height: 1707 },
});
const flow = (id, cabinId = 'c1', steps = [{ id: `${id}-s1`, x: 0.4, y: 0.6, label: 'Mezcla, rica' }]) => ({
  id, cabinId, name: `Flujo ${id}`, steps, createdAt: 1, updatedAt: 2,
});
const raw = async (mutate) => {
  const doc = JSON.parse(await exportFlowdot([{ cabin: cabin(), flows: [flow('f1')] }], new Date('2026-11-16T12:00:00Z')));
  mutate(doc);
  return JSON.stringify(doc);
};
let counter = 0;
const newId = () => `nuevo-${(counter += 1)}`;
const noExisting = { cabinIds: new Set(), flowCabin: new Map() };

test('ida y vuelta: mismos nombres, pasos y bytes de imagen', async () => {
  const text = await exportFlowdot([{ cabin: cabin(), flows: [flow('f1'), flow('f2')] }], new Date('2026-11-16T12:00:00Z'));
  const doc = JSON.parse(text);
  assert.equal(doc.format, 'flowdot');
  assert.equal(doc.version, 1);
  assert.equal(doc.exportedAt, '2026-11-16T12:00:00.000Z');
  const parsed = parseFlowdot(text);
  assert.equal(parsed.ok, true);
  const [entry] = parsed.entries;
  assert.equal(entry.cabin.name, 'Cessna 152');
  assert.deepEqual(entry.flows.map((f) => f.name), ['Flujo f1', 'Flujo f2']);
  assert.deepEqual(entry.flows[0].steps, [{ id: 'f1-s1', x: 0.4, y: 0.6, label: 'Mezcla, rica' }]);
  assert.equal(entry.flows[0].cabinId, 'c1');
  assert.deepEqual(new Uint8Array(await entry.cabin.image.blob.arrayBuffer()), bytes);
  assert.equal(entry.cabin.image.blob.type, 'image/webp');
});

test('ida y vuelta: la curva de cada flecha se conserva y un paso sin curva sigue sin ella', async () => {
  const steps = [{ id: 's1', x: 0.1, y: 0.1, label: 'A' }, { id: 's2', x: 0.5, y: 0.5, label: 'B', bend: -0.25 }];
  const text = await exportFlowdot([{ cabin: cabin(), flows: [flow('f1', 'c1', steps)] }], new Date('2026-11-16T12:00:00Z'));
  const parsed = parseFlowdot(text);
  assert.equal(parsed.ok, true, parsed.error);
  assert.deepEqual(parsed.entries[0].flows[0].steps, steps);
});

test('ida y vuelta: acción y crítico se conservan y un paso sin ellos sigue sin ellos', async () => {
  const steps = [{ id: 's1', x: 0.1, y: 0.1, label: 'Flaps', action: '1+F', critical: true }, { id: 's2', x: 0.5, y: 0.5, label: 'Luces' }];
  const text = await exportFlowdot([{ cabin: cabin(), flows: [flow('f1', 'c1', steps)] }], new Date('2026-11-16T12:00:00Z'));
  const parsed = parseFlowdot(text);
  assert.equal(parsed.ok, true, parsed.error);
  assert.deepEqual(parsed.entries[0].flows[0].steps, steps);
});

const notes = [
  { id: 'n1', type: 'arrow', x1: 0.1, y1: 0.2, x2: 0.4, y2: 0.3, bend: 0.2 },
  { id: 'n2', type: 'label', x: 0.5, y: 0.1, text: 'Overhead' },
];

test('ida y vuelta: las marcas se conservan y un flujo sin marcas no escribe notes', async () => {
  const text = await exportFlowdot([{ cabin: cabin(), flows: [{ ...flow('f1'), notes }, flow('f2')] }], new Date('2026-11-16T12:00:00Z'));
  const doc = JSON.parse(text);
  assert.equal('notes' in doc.cabins[0].flows[1], false);
  const parsed = parseFlowdot(text);
  assert.equal(parsed.ok, true, parsed.error);
  assert.deepEqual(parsed.entries[0].flows[0].notes, notes);
  assert.equal('notes' in parsed.entries[0].flows[1], false);
});

test('ida y vuelta: pendientes y checklist se conservan; un flujo sin ellos no los escribe', async () => {
  const pending = [{ id: 'p1', label: 'Beacon', action: 'ON' }, { id: 'p2', label: 'Seatbelts' }];
  const checklist = [{ id: 'k1', challenge: 'Parking brake', response: 'SET' }];
  const text = await exportFlowdot([{ cabin: cabin(), flows: [{ ...flow('f1'), pending, checklist }, flow('f2')] }], new Date('2026-11-16T12:00:00Z'));
  const doc = JSON.parse(text);
  assert.equal('pending' in doc.cabins[0].flows[1], false);
  assert.equal('checklist' in doc.cabins[0].flows[1], false);
  const parsed = parseFlowdot(text);
  assert.equal(parsed.ok, true, parsed.error);
  assert.deepEqual(parsed.entries[0].flows[0].pending, pending);
  assert.deepEqual(parsed.entries[0].flows[0].checklist, checklist);
  assert.equal('pending' in parsed.entries[0].flows[1], false);
});

const withLists = (mutate) => raw((d) => {
  d.cabins[0].flows[0].pending = [{ id: 'p1', label: 'Beacon', action: 'ON' }];
  d.cabins[0].flows[0].checklist = [{ id: 'k1', challenge: 'Parking brake', response: 'SET' }];
  mutate(d.cabins[0].flows[0]);
});

const withNotes = (mutate) => raw((d) => { d.cabins[0].flows[0].notes = structuredClone(notes); mutate(d.cabins[0].flows[0].notes, d); });

const rejects = [
  ['pendiente sin id', () => withLists((f) => { delete f.pending[0].id; }), /pendiente 1 del flujo «Flujo f1»/],
  ['respuesta de checklist de 121', () => withLists((f) => { f.checklist[0].response = 'x'.repeat(121); }), /ítem 1 de la checklist del flujo «Flujo f1»/],
  ['61 ítems de checklist', () => withLists((f) => { f.checklist = Array.from({ length: 61 }, (_, i) => ({ id: `k${i}`, challenge: 'A', response: 'B' })); }), /«Flujo f1».*60 ítems/],
  ['más de 200 entre pasos y pendientes', () => withLists((f) => { f.pending = Array.from({ length: 200 }, (_, i) => ({ id: `p${i}`, label: 'A' })); }), /«Flujo f1».*200 pasos/],
  ['notes que no es lista', () => withNotes((_, d) => { d.cabins[0].flows[0].notes = 'x'; }), /marcas del flujo «Flujo f1»/],
  ['51 marcas', () => withNotes((_, d) => { d.cabins[0].flows[0].notes = Array.from({ length: 51 }, (_, i) => ({ ...notes[1], id: `n${i}` })); }), /«Flujo f1».*50 marcas/],
  ['marca de tipo desconocido', () => withNotes((n) => { n[0].type = 'circle'; }), /marca 1 del flujo «Flujo f1»/],
  ['flecha fuera de la imagen', () => withNotes((n) => { n[0].x2 = 1.5; }), /marca 1 del flujo «Flujo f1».*posición/],
  ['curva de marca fuera de rango', () => withNotes((n) => { n[0].bend = 2; }), /marca 1 del flujo «Flujo f1».*curva/],
  ['etiqueta vacía', () => withNotes((n) => { n[1].text = ''; }), /marca 2 del flujo «Flujo f1».*texto/],
  ['etiqueta de 41 caracteres', () => withNotes((n) => { n[1].text = 'x'.repeat(41); }), /marca 2 del flujo «Flujo f1».*texto/],
  ['JSON roto', async () => '{no', /no es un archivo de Flowdot/],
  ['otro formato', () => raw((d) => { d.format = 'otra'; }), /no es un archivo de Flowdot/],
  ['versión 2', () => raw((d) => { d.version = 2; }), /versión/],
  ['x fuera de la imagen', () => raw((d) => { d.cabins[0].flows[0].steps[0].x = 1.2; }), /paso 1 del flujo «Flujo f1».*posición/],
  ['nombre de 121 caracteres', () => raw((d) => { d.cabins[0].flows[0].steps[0].label = 'x'.repeat(121); }), /paso 1 del flujo «Flujo f1».*nombre/],
  ['curva fuera de rango', () => raw((d) => { d.cabins[0].flows[0].steps[0].bend = 1.5; }), /paso 1 del flujo «Flujo f1».*curva/],
  ['curva que no es número', () => raw((d) => { d.cabins[0].flows[0].steps[0].bend = 'x'; }), /paso 1 del flujo «Flujo f1».*curva/],
  ['acción de 121 caracteres', () => raw((d) => { d.cabins[0].flows[0].steps[0].action = 'x'.repeat(121); }), /paso 1 del flujo «Flujo f1».*acción/],
  ['crítico que no es sí o no', () => raw((d) => { d.cabins[0].flows[0].steps[0].critical = 'si'; }), /paso 1 del flujo «Flujo f1».*crítico/],
  ['201 pasos', () => raw((d) => { d.cabins[0].flows[0].steps = Array.from({ length: 201 }, (_, i) => ({ id: `s${i}`, x: 0, y: 0, label: '' })); }), /«Flujo f1».*200 pasos/],
  ['imagen sin datos', () => raw((d) => { delete d.cabins[0].image.data; }), /imagen de la cabina «Cessna 152»/],
  ['tipo de imagen raro', () => raw((d) => { d.cabins[0].image.type = 'image/gif'; }), /imagen de la cabina «Cessna 152»/],
];
for (const [name, make, message] of rejects) {
  test(`parseFlowdot rechaza: ${name}`, async () => {
    const result = parseFlowdot(await make());
    assert.equal(result.ok, false);
    assert.match(result.error, message);
  });
}

test('planImport sin conflicto: entra con sus ids y no pregunta', () => {
  const ops = planImport([{ cabin: cabin(), flows: [flow('f1')] }], noExisting, () => assert.fail('no debe preguntar'), newId);
  assert.deepEqual(ops.map((o) => [o.type, o.cabin?.id ?? o.flow.id]), [['putCabin', 'c1'], ['putFlow', 'f1']]);
});

test('planImport actualizar: pone cabina y flujos, nunca borra', () => {
  const existing = { cabinIds: new Set(['c1']), flowCabin: new Map([['f1', 'c1'], ['viejo', 'c1']]) };
  const ops = planImport([{ cabin: cabin(), flows: [flow('f1'), flow('f2')] }], existing, () => 'update', newId);
  assert.deepEqual(ops.map((o) => o.type), ['putCabin', 'putFlow', 'putFlow']);
  assert.deepEqual(ops.slice(1).map((o) => o.flow.id), ['f1', 'f2']);
  assert.ok(ops.every((o) => o.type.startsWith('put')));
});

test('planImport copia: ids nuevos, flujos apuntan a la cabina nueva y nombre con (copia)', () => {
  const existing = { cabinIds: new Set(['c1']), flowCabin: new Map([['f1', 'c1']]) };
  const ops = planImport([{ cabin: cabin(), flows: [flow('f1')] }], existing, () => 'copy', newId);
  const [put, putFlow] = ops;
  assert.notEqual(put.cabin.id, 'c1');
  assert.equal(put.cabin.name, 'Cessna 152 (copia)');
  assert.notEqual(putFlow.flow.id, 'f1');
  assert.equal(putFlow.flow.cabinId, put.cabin.id);
});

test('planImport saltear: ninguna operación', () => {
  const existing = { cabinIds: new Set(['c1']), flowCabin: new Map() };
  assert.deepEqual(planImport([{ cabin: cabin(), flows: [flow('f1')] }], existing, () => 'skip', newId), []);
});

test('planImport: flujo con id de otra cabina y ids repetidos en el archivo reciben ids nuevos', () => {
  const existing = { cabinIds: new Set(), flowCabin: new Map([['f1', 'otra']]) };
  const ops = planImport([{ cabin: cabin(), flows: [flow('f1'), flow('f2'), flow('f2')] }], existing, () => 'update', newId);
  const ids = ops.filter((o) => o.type === 'putFlow').map((o) => o.flow.id);
  assert.notEqual(ids[0], 'f1');
  assert.equal(ids[1], 'f2');
  assert.notEqual(ids[2], 'f2');
  assert.equal(new Set(ids).size, 3);
});

test('planImport: dos cabinas con el mismo id en el archivo no se pisan', () => {
  const ops = planImport([{ cabin: cabin(), flows: [] }, { cabin: cabin(), flows: [] }], noExisting, () => 'update', newId);
  const ids = ops.map((o) => o.cabin.id);
  assert.equal(new Set(ids).size, 2);
});

test('nombres de archivo', () => {
  assert.equal(fileNameFor('Cessna 152 LV-ABC'), 'cessna-152-lv-abc.flowdot');
  assert.equal(fileNameFor('Ñandú / Piper'), 'nandu-piper.flowdot');
  assert.equal(fileNameFor('  '), 'flowdot.flowdot');
  assert.equal(backupFileName(new Date('2026-11-16T12:00:00Z')), 'flowdot-copia-2026-11-16.flowdot');
});
