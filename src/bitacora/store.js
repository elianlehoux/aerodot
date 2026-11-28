/**
 * Guardado de la Bitácora en IndexedDB, base `bitacora`, versión 1. Todo queda en el dispositivo.
 * Colecciones: flights, aircraft, documents (con el archivo adjunto como Blob), plans, cvs y meta.
 */

export const COLLECTIONS = ['flights', 'aircraft', 'documents', 'plans', 'cvs'];

const done = (request) => new Promise((resolve, reject) => {
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

const finished = (tx) => new Promise((resolve, reject) => {
  tx.oncomplete = () => resolve();
  tx.onerror = () => reject(tx.error);
  tx.onabort = () => reject(tx.error ?? new Error('La operación se canceló.'));
});

export const newId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`);

export async function openStore() {
  const request = indexedDB.open('bitacora', 1);
  request.onupgradeneeded = () => {
    const db = request.result;
    for (const name of COLLECTIONS) db.createObjectStore(name, { keyPath: 'id' });
    db.createObjectStore('meta', { keyPath: 'key' });
  };
  const db = await done(request);
  const write = async (name, fn) => {
    const tx = db.transaction(name, 'readwrite');
    fn(tx.objectStore(name));
    await finished(tx);
  };
  const listeners = new Set();
  const changed = (name) => listeners.forEach((fn) => fn(name));

  return {
    all: (name) => done(db.transaction(name).objectStore(name).getAll()),
    get: (name, id) => done(db.transaction(name).objectStore(name).get(id)),
    put: async (name, item) => {
      const now = Date.now();
      const record = { ...item, id: item.id ?? newId(), createdAt: item.createdAt ?? now, updatedAt: now };
      await write(name, (store) => store.put(record));
      changed(name);
      return record;
    },
    /** Varios de una vez, en una sola transacción: entran todos o ninguno. */
    putMany: async (name, items) => {
      const now = Date.now();
      const records = items.map((item) => ({ ...item, id: item.id ?? newId(), createdAt: item.createdAt ?? now, updatedAt: now }));
      await write(name, (store) => records.forEach((record) => store.put(record)));
      changed(name);
      return records;
    },
    remove: async (name, id) => {
      await write(name, (store) => store.delete(id));
      changed(name);
    },
    getMeta: async (key) => (await done(db.transaction('meta').objectStore('meta').get(key)))?.value,
    setMeta: (key, value) => write('meta', (store) => store.put({ key, value })),
    onChange: (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
  };
}

const toBase64 = async (blob) => {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let text = '';
  for (let i = 0; i < bytes.length; i += 0x8000) text += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(text);
};

const fromBase64 = (data, type) => {
  const text = atob(data);
  const bytes = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i += 1) bytes[i] = text.charCodeAt(i);
  return new Blob([bytes], { type });
};

/** Copia de seguridad: todo en un JSON, con los archivos adjuntos en base64. */
export async function exportBackup(store) {
  const data = { app: 'aerodot-bitacora', version: 1, exportedAt: new Date().toISOString() };
  for (const name of COLLECTIONS) data[name] = await store.all(name);
  data.documents = await Promise.all(data.documents.map(async (doc) => {
    if (!(doc.file instanceof Blob)) return doc;
    return { ...doc, file: { name: doc.fileName, type: doc.file.type, data: await toBase64(doc.file) } };
  }));
  return new Blob([JSON.stringify(data)], { type: 'application/json' });
}

/** Lee una copia. Devuelve cuántos registros trae de cada tipo y una función para guardarla. */
export async function readBackup(store, file) {
  let data;
  try {
    data = JSON.parse(await file.text());
  } catch {
    throw new Error('El archivo no es una copia de la Bitácora.');
  }
  if (data?.app !== 'aerodot-bitacora') throw new Error('El archivo no es una copia de la Bitácora.');
  const counts = Object.fromEntries(COLLECTIONS.map((name) => [name, Array.isArray(data[name]) ? data[name].length : 0]));
  const restore = async () => {
    for (const name of COLLECTIONS) {
      if (!Array.isArray(data[name]) || !data[name].length) continue;
      const items = data[name].map((item) => (name === 'documents' && item.file?.data ? { ...item, file: fromBase64(item.file.data, item.file.type) } : item));
      await store.putMany(name, items.map((item) => ({ ...item, updatedAt: undefined })));
    }
  };
  return { counts, restore };
}
