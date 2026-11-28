import test from 'node:test';
import assert from 'node:assert/strict';
import { COLLECTIONS, exportBackup, readBackup } from '../src/bitacora/store.js';

/** Un guardado en memoria con la misma forma que el de IndexedDB, para probar la copia sin navegador. */
function memoryStore(seed = {}) {
  const data = Object.fromEntries(COLLECTIONS.map((name) => [name, new Map((seed[name] ?? []).map((item) => [item.id, item]))]));
  return {
    all: async (name) => [...data[name].values()],
    putMany: async (name, items) => items.forEach((item) => data[name].set(item.id, item)),
    data,
  };
}

const asFile = (blob) => ({ text: () => blob.text() });

test('la copia lleva todo y los adjuntos vuelven byte por byte', async () => {
  const bytes = new Uint8Array(70000).map((_, i) => (i * 31) % 256);
  const source = memoryStore({
    flights: [{ id: 'f1', date: '2026-11-01', total: 60 }],
    aircraft: [{ id: 'a1', reg: 'LV-ABC' }],
    documents: [{ id: 'd1', name: 'CMA', fileName: 'cma.pdf', file: new Blob([bytes], { type: 'application/pdf' }) }],
    plans: [{ id: 'p1', acid: 'LVABC' }],
    cvs: [{ id: 'c1', name: 'Juana' }],
  });
  const backup = await exportBackup(source);
  const json = JSON.parse(await backup.text());
  assert.equal(json.app, 'aerodot-bitacora');
  assert.equal(json.documents[0].file.type, 'application/pdf');

  const target = memoryStore();
  const { counts, restore } = await readBackup(target, asFile(backup));
  assert.deepEqual(counts, { flights: 1, aircraft: 1, documents: 1, plans: 1, cvs: 1 });
  await restore();
  const doc = target.data.documents.get('d1');
  assert.ok(doc.file instanceof Blob);
  assert.equal(doc.file.type, 'application/pdf');
  assert.deepEqual(new Uint8Array(await doc.file.arrayBuffer()), bytes);
  assert.equal(target.data.flights.get('f1').total, 60);
});

test('restaurar suma lo nuevo y reemplaza lo que tiene el mismo id', async () => {
  const backup = await exportBackup(memoryStore({ flights: [{ id: 'f1', total: 90 }] }));
  const target = memoryStore({ flights: [{ id: 'f1', total: 60 }, { id: 'f2', total: 30 }] });
  await (await readBackup(target, asFile(backup))).restore();
  assert.equal(target.data.flights.get('f1').total, 90);
  assert.equal(target.data.flights.get('f2').total, 30);
});

test('un archivo que no es una copia se rechaza con un mensaje claro', async () => {
  const target = memoryStore();
  await assert.rejects(readBackup(target, asFile(new Blob(['no es json']))), /no es una copia/);
  await assert.rejects(readBackup(target, asFile(new Blob(['{"app":"otra"}']))), /no es una copia/);
});
