/**
 * Listas pegadas como texto. Una lista se puede volver pasos sin ubicar (`flow.pending`),
 * que después se ubican de a uno tocando la foto, o la checklist de verificación del flujo
 * (`flow.checklist`), que se repasa en el Simulador. Las ediciones devuelven un flujo nuevo.
 */
import { MAX_LABEL, MAX_STEPS } from './flow.js';

export const MAX_CHECKLIST = 60;

const BULLET = /^(?:\d{1,3}[.)]\s+|[-•·*▪◦□☐■]\s+|\[ ?\]\s*)/;
// El primero que aparezca: tabulación, puntos o "…", guion con espacios, o 3 o más espacios.
const SEPARATOR = /\t+|\s*(?:\.{2,}|…+)\s*|\s+[-–—]\s+|\s{3,}/;

/** Cada renglón con texto es un ítem: `{ label, action }`. Los que terminan en ":" son títulos y se saltean. */
export function parseChecklist(text) {
  const items = [];
  for (const raw of String(text ?? '').split(/\r?\n/)) {
    const line = raw.replace(/ /g, ' ').trim();
    if (!line || line.endsWith(':')) continue;
    const body = line.replace(BULLET, '');
    const match = SEPARATOR.exec(body);
    let label = match ? body.slice(0, match.index).trim() : body;
    let action = match ? body.slice(match.index + match[0].length).trim() : '';
    if (!label) { label = action; action = ''; }
    if (!label) continue;
    items.push({ label: label.slice(0, MAX_LABEL), action: action.slice(0, MAX_LABEL) });
  }
  return items;
}

const edited = (flow, key, list, now) => {
  const next = { ...flow, updatedAt: now };
  if (list.length) next[key] = list; else delete next[key];
  return next;
};

/** Suma ítems al final de los pendientes, mientras pasos y pendientes no pasen de 200. */
export function addPending(flow, items, { newId, now }) {
  const pending = flow.pending ?? [];
  const room = Math.max(0, MAX_STEPS - flow.steps.length - pending.length);
  const added = items.slice(0, room).map(({ label, action }) => (action ? { id: newId(), label, action } : { id: newId(), label }));
  if (!added.length) return flow;
  return edited(flow, 'pending', [...pending, ...added], now);
}

/** El primer pendiente pasa a ser el último paso, en (x, y). */
export function placePending(flow, x, y, { now }) {
  const [first, ...rest] = flow.pending ?? [];
  if (!first || flow.steps.length >= MAX_STEPS) return flow;
  const clamp = (n) => Math.min(1, Math.max(0, n));
  const step = { id: first.id, x: clamp(x), y: clamp(y), label: first.label };
  if (first.action) step.action = first.action;
  return edited({ ...flow, steps: [...flow.steps, step] }, 'pending', rest, now);
}

export function removePending(flow, id, { now }) {
  const pending = flow.pending ?? [];
  if (!pending.some((item) => item.id === id)) return flow;
  return edited(flow, 'pending', pending.filter((item) => item.id !== id), now);
}

/** Suma ítems a la checklist de verificación (pregunta y respuesta), hasta 60. */
export function addChecklist(flow, items, { newId, now }) {
  const checklist = flow.checklist ?? [];
  const added = items.slice(0, Math.max(0, MAX_CHECKLIST - checklist.length))
    .map(({ label, action }) => ({ id: newId(), challenge: label, response: action }));
  if (!added.length) return flow;
  return edited(flow, 'checklist', [...checklist, ...added], now);
}

export function editChecklistItem(flow, id, { challenge, response }, { now }) {
  const checklist = flow.checklist ?? [];
  const index = checklist.findIndex((item) => item.id === id);
  if (index < 0) return flow;
  const next = { id, challenge: challenge.slice(0, MAX_LABEL), response: response.slice(0, MAX_LABEL) };
  if (next.challenge === checklist[index].challenge && next.response === checklist[index].response) return flow;
  return edited(flow, 'checklist', checklist.map((item, i) => (i === index ? next : item)), now);
}

export function removeChecklistItem(flow, id, { now }) {
  const checklist = flow.checklist ?? [];
  if (!checklist.some((item) => item.id === id)) return flow;
  return edited(flow, 'checklist', checklist.filter((item) => item.id !== id), now);
}
