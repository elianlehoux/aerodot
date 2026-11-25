/**
 * Guardado de Flowdot en IndexedDB. Base `flowdot`, versión 1:
 * cabins (id), flows (id, índice cabinId) y meta (key) para marcas como lastBackupAt.
 * Borrar un flujo (o su cabina) borra también su avance de práctica.
 */
import { progressKey } from './progress.js';

const done = (request) => new Promise((resolve, reject) => {
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

const finished = (tx) => new Promise((resolve, reject) => {
  tx.oncomplete = () => resolve();
  tx.onerror = () => reject(tx.error);
  tx.onabort = () => reject(tx.error ?? new Error('La operación se canceló.'));
});

export async function openStore() {
  const request = indexedDB.open('flowdot', 1);
  request.onupgradeneeded = () => {
    const db = request.result;
    db.createObjectStore('cabins', { keyPath: 'id' });
    db.createObjectStore('flows', { keyPath: 'id' }).createIndex('cabinId', 'cabinId');
    db.createObjectStore('meta', { keyPath: 'key' });
  };
  const db = await done(request);

  const read = (name, fn) => done(fn(db.transaction(name).objectStore(name)));
  const write = async (names, fn) => {
    const tx = db.transaction(names, 'readwrite');
    fn(tx);
    await finished(tx);
  };

  return {
    listCabins: async () => (await read('cabins', (s) => s.getAll())).sort((a, b) => a.createdAt - b.createdAt),
    getCabin: (id) => read('cabins', (s) => s.get(id)),
    putCabin: (cabin) => write(['cabins'], (tx) => tx.objectStore('cabins').put(cabin)),
    deleteCabin: (id) => write(['cabins', 'flows', 'meta'], (tx) => {
      tx.objectStore('cabins').delete(id);
      const flows = tx.objectStore('flows');
      const meta = tx.objectStore('meta');
      flows.index('cabinId').getAllKeys(id).onsuccess = (event) => event.target.result.forEach((key) => {
        flows.delete(key);
        meta.delete(progressKey(key));
      });
    }),
    listFlows: async (cabinId) => (await read('flows', (s) => s.index('cabinId').getAll(cabinId))).sort((a, b) => a.createdAt - b.createdAt),
    listAllFlows: () => read('flows', (s) => s.getAll()),
    getFlow: (id) => read('flows', (s) => s.get(id)),
    putFlow: (flow) => write(['flows'], (tx) => tx.objectStore('flows').put(flow)),
    deleteFlow: (id) => write(['flows', 'meta'], (tx) => {
      tx.objectStore('flows').delete(id);
      tx.objectStore('meta').delete(progressKey(id));
    }),
    /** Aplica las operaciones de planImport en una sola transacción: todo o nada. */
    apply: (ops) => write(['cabins', 'flows'], (tx) => {
      for (const op of ops) {
        if (op.type === 'putCabin') tx.objectStore('cabins').put(op.cabin);
        if (op.type === 'putFlow') tx.objectStore('flows').put(op.flow);
      }
    }),
    getMeta: async (key) => (await read('meta', (s) => s.get(key)))?.value,
    setMeta: (key, value) => write(['meta'], (tx) => tx.objectStore('meta').put({ key, value })),
  };
}

/** Pide al navegador que no borre los datos por falta de espacio. Una sola vez. */
export async function requestPersist(store) {
  if (!navigator.storage?.persist || (await store.getMeta('persistAsked'))) return false;
  await store.setMeta('persistAsked', true);
  return navigator.storage.persist();
}
