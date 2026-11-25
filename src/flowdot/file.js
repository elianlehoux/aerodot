/**
 * Archivo .flowdot: JSON con una o varias cabinas, sus flujos y la imagen en base64.
 * Se valida todo antes de guardar nada; un error dice qué parte del archivo está mal.
 */
import { MAX_LABEL, MAX_STEPS } from './flow.js';
import { MAX_NOTES, MAX_NOTE_TEXT } from './notes.js';
import { MAX_CHECKLIST } from './checklist.js';

export const FORMAT = 'flowdot';
export const VERSION = 1;
const IMAGE_TYPES = new Set(['image/webp', 'image/jpeg', 'image/png']);

async function blobToBase64(blob) {
  const data = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  for (let i = 0; i < data.length; i += 0x8000) binary += String.fromCharCode(...data.subarray(i, i + 0x8000));
  return btoa(binary);
}

function base64ToBlob(base64, type) {
  const binary = atob(base64);
  const data = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) data[i] = binary.charCodeAt(i);
  return new Blob([data], { type });
}

/** Un paso tal como va al archivo: los campos opcionales solo si tienen valor. */
function stepOut({ id, x, y, label, bend, action, critical }) {
  const out = { id, x, y, label };
  if (typeof bend === 'number') out.bend = bend;
  if (action) out.action = action;
  if (critical === true) out.critical = true;
  return out;
}

/** Un flujo tal como va al archivo: `notes` solo si tiene marcas. */
function flowOut(flow) {
  const out = { id: flow.id, name: flow.name, steps: flow.steps.map(stepOut) };
  if (flow.notes?.length) out.notes = flow.notes.map((note) => ({ ...note }));
  if (flow.pending?.length) out.pending = flow.pending.map(({ id, label, action }) => (action ? { id, label, action } : { id, label }));
  if (flow.checklist?.length) out.checklist = flow.checklist.map(({ id, challenge, response }) => ({ id, challenge, response }));
  return out;
}

export async function exportFlowdot(entries, now) {
  const cabins = [];
  for (const { cabin, flows } of entries) {
    cabins.push({
      id: cabin.id,
      name: cabin.name,
      image: { type: cabin.image.type, width: cabin.image.width, height: cabin.image.height, data: await blobToBase64(cabin.image.blob) },
      flows: flows.map(flowOut),
    });
  }
  return JSON.stringify({ format: FORMAT, version: VERSION, exportedAt: now.toISOString(), cabins });
}

class FileError extends Error {}
const fail = (message) => { throw new FileError(message); };
const isText = (value, max = MAX_LABEL) => typeof value === 'string' && value.length <= max;
const isId = (value) => typeof value === 'string' && value.length > 0 && value.length <= 100;
const inImage = (n) => typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 1;
const isBend = (n) => typeof n === 'number' && Number.isFinite(n) && Math.abs(n) <= 1;

/** Pasos pegados que todavía no tienen lugar en la foto. */
function readPending(raw, flowName, steps) {
  if (!Array.isArray(raw)) fail(`Los pasos sin ubicar del flujo «${flowName}» no son válidos.`);
  if (steps + raw.length > MAX_STEPS) fail(`El flujo «${flowName}» tiene más de ${MAX_STEPS} pasos.`);
  return raw.map((item, index) => {
    const where = `El paso pendiente ${index + 1} del flujo «${flowName}»`;
    if (!item || typeof item !== 'object' || !isId(item.id) || !isText(item.label)) fail(`${where} no es válido.`);
    if (item.action !== undefined && !isText(item.action)) fail(`${where} tiene una acción de más de ${MAX_LABEL} caracteres.`);
    return item.action ? { id: item.id, label: item.label, action: item.action } : { id: item.id, label: item.label };
  });
}

/** Checklist de verificación: pregunta y respuesta por ítem. */
function readChecklist(raw, flowName) {
  if (!Array.isArray(raw)) fail(`La checklist del flujo «${flowName}» no es válida.`);
  if (raw.length > MAX_CHECKLIST) fail(`La checklist del flujo «${flowName}» tiene más de ${MAX_CHECKLIST} ítems.`);
  return raw.map((item, index) => {
    if (!item || typeof item !== 'object' || !isId(item.id) || !isText(item.challenge) || !isText(item.response)) {
      fail(`El ítem ${index + 1} de la checklist del flujo «${flowName}» no es válido.`);
    }
    return { id: item.id, challenge: item.challenge, response: item.response };
  });
}

/** Marcas de ayuda de un flujo (flechas y etiquetas). Opcionales: un archivo sin `notes` no trae ninguna. */
function readNotes(raw, flowName) {
  if (!Array.isArray(raw)) fail(`Las marcas del flujo «${flowName}» no son válidas.`);
  if (raw.length > MAX_NOTES) fail(`El flujo «${flowName}» tiene más de ${MAX_NOTES} marcas.`);
  return raw.map((note, index) => {
    const where = `La marca ${index + 1} del flujo «${flowName}»`;
    if (!note || typeof note !== 'object' || !isId(note.id) || (note.type !== 'arrow' && note.type !== 'label')) fail(`${where} no es válida.`);
    if (note.type === 'label') {
      if (!inImage(note.x) || !inImage(note.y)) fail(`${where} tiene una posición fuera de la imagen.`);
      if (!isText(note.text, MAX_NOTE_TEXT) || !note.text) fail(`${where} tiene un texto vacío o de más de ${MAX_NOTE_TEXT} caracteres.`);
      return { id: note.id, type: 'label', x: note.x, y: note.y, text: note.text };
    }
    if (![note.x1, note.y1, note.x2, note.y2].every(inImage)) fail(`${where} tiene una posición fuera de la imagen.`);
    const out = { id: note.id, type: 'arrow', x1: note.x1, y1: note.y1, x2: note.x2, y2: note.y2 };
    if (note.bend !== undefined) {
      if (!isBend(note.bend)) fail(`${where} tiene una curva no válida.`);
      out.bend = note.bend;
    }
    return out;
  });
}

function readCabin(raw, index, time) {
  if (!raw || typeof raw !== 'object' || !isId(raw.id) || !isText(raw.name)) fail(`La cabina ${index + 1} del archivo no es válida.`);
  const { image } = raw;
  const badImage = `La imagen de la cabina «${raw.name}» falta o no es JPG, PNG ni WebP.`;
  if (!image || !IMAGE_TYPES.has(image.type) || typeof image.data !== 'string' || !image.data
    || !(image.width > 0) || !(image.height > 0)) fail(badImage);
  let blob;
  try { blob = base64ToBlob(image.data, image.type); } catch { fail(badImage); }
  if (!Array.isArray(raw.flows)) fail(`Los flujos de la cabina «${raw.name}» no son válidos.`);
  const flows = raw.flows.map((flow, flowIndex) => {
    if (!flow || typeof flow !== 'object' || !isId(flow.id) || !isText(flow.name) || !Array.isArray(flow.steps)) {
      fail(`El flujo ${flowIndex + 1} de la cabina «${raw.name}» no es válido.`);
    }
    if (flow.steps.length > MAX_STEPS) fail(`El flujo «${flow.name}» tiene más de ${MAX_STEPS} pasos.`);
    const steps = flow.steps.map((step, stepIndex) => {
      const where = `El paso ${stepIndex + 1} del flujo «${flow.name}»`;
      if (!step || typeof step !== 'object' || !isId(step.id)) fail(`${where} no es válido.`);
      if (!inImage(step.x) || !inImage(step.y)) fail(`${where} tiene una posición fuera de la imagen.`);
      if (!isText(step.label)) fail(`${where} tiene un nombre de más de ${MAX_LABEL} caracteres.`);
      const out = { id: step.id, x: step.x, y: step.y, label: step.label };
      if (step.bend !== undefined) {
        if (typeof step.bend !== 'number' || !Number.isFinite(step.bend) || Math.abs(step.bend) > 1) fail(`${where} tiene una curva no válida.`);
        out.bend = step.bend;
      }
      if (step.action !== undefined) {
        if (!isText(step.action)) fail(`${where} tiene una acción de más de ${MAX_LABEL} caracteres.`);
        if (step.action) out.action = step.action;
      }
      if (step.critical !== undefined) {
        if (typeof step.critical !== 'boolean') fail(`${where} tiene una marca de crítico no válida.`);
        if (step.critical) out.critical = true;
      }
      return out;
    });
    const out = { id: flow.id, cabinId: raw.id, name: flow.name, steps, createdAt: time, updatedAt: time };
    if (flow.notes !== undefined) {
      const notes = readNotes(flow.notes, flow.name);
      if (notes.length) out.notes = notes;
    }
    if (flow.pending !== undefined) {
      const pending = readPending(flow.pending, flow.name, steps.length);
      if (pending.length) out.pending = pending;
    }
    if (flow.checklist !== undefined) {
      const checklist = readChecklist(flow.checklist, flow.name);
      if (checklist.length) out.checklist = checklist;
    }
    return out;
  });
  return {
    cabin: { id: raw.id, name: raw.name, image: { blob, type: image.type, width: image.width, height: image.height }, createdAt: time, updatedAt: time },
    flows,
  };
}

export function parseFlowdot(text) {
  try {
    let doc;
    try { doc = JSON.parse(text); } catch { fail('Este archivo no es un archivo de Flowdot.'); }
    if (!doc || doc.format !== FORMAT) fail('Este archivo no es un archivo de Flowdot.');
    if (doc.version !== VERSION) fail('Este archivo es de otra versión de Flowdot y no se puede abrir.');
    if (!Array.isArray(doc.cabins) || doc.cabins.length === 0) fail('El archivo no trae ninguna cabina.');
    const time = Date.parse(doc.exportedAt) || 0;
    return { ok: true, entries: doc.cabins.map((raw, index) => readCabin(raw, index, time)) };
  } catch (error) {
    if (error instanceof FileError) return { ok: false, error: error.message };
    throw error;
  }
}

/**
 * Qué guardar al importar. Nunca borra: una cabina repetida se actualiza, se copia o se saltea
 * según `decide`, y cualquier id que choque con otra cabina o se repita en el archivo se cambia.
 */
export function planImport(entries, existing, decide, newId) {
  const ops = [];
  const usedCabins = new Set();
  const usedFlows = new Set();
  for (const { cabin, flows } of entries) {
    let choice = 'update';
    if (existing.cabinIds.has(cabin.id) && !usedCabins.has(cabin.id)) choice = decide(cabin);
    if (choice === 'skip') continue;
    const copy = choice === 'copy';
    const clash = usedCabins.has(cabin.id);
    const cabinId = copy || clash ? newId() : cabin.id;
    usedCabins.add(cabinId);
    const name = copy ? `${cabin.name} (copia)`.slice(0, MAX_LABEL) : cabin.name;
    ops.push({ type: 'putCabin', cabin: { ...cabin, id: cabinId, name } });
    for (const flow of flows) {
      const owner = existing.flowCabin.get(flow.id);
      const keep = !copy && !clash && !usedFlows.has(flow.id) && (owner === undefined || owner === cabinId);
      const id = keep ? flow.id : newId();
      usedFlows.add(id);
      ops.push({ type: 'putFlow', flow: { ...flow, id, cabinId } });
    }
  }
  return ops;
}

export function fileNameFor(name) {
  const slug = name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `${slug || 'flowdot'}.flowdot`;
}

export const backupFileName = (date) => `flowdot-copia-${date.toISOString().slice(0, 10)}.flowdot`;
