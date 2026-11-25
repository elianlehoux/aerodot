/**
 * Ediciones de un flujo. Cada una devuelve un flujo nuevo y deja el recibido igual,
 * así el historial guarda cada versión sin copiarla.
 */

export const MAX_STEPS = 200;
export const MAX_LABEL = 120;

const clamp = (n) => Math.min(1, Math.max(0, n));
const withSteps = (flow, steps, now) => ({ ...flow, steps, updatedAt: now });

const withoutBend = ({ bend, ...step }) => step;

/** La curva de una flecha vale para su par de pasos: si un paso llega desde otro, vuelve a automática. */
function keepBends(before, after) {
  const previous = new Map(before.map((step, i) => [step.id, before[i - 1]?.id]));
  return after.map((step, i) => ('bend' in step && previous.get(step.id) !== after[i - 1]?.id ? withoutBend(step) : step));
}

export function addStep(flow, x, y, { id, now }) {
  if (flow.steps.length >= MAX_STEPS) return flow;
  return withSteps(flow, [...flow.steps, { id, x: clamp(x), y: clamp(y), label: '' }], now);
}

export const moveStep = (flow, stepId, x, y, { now }) =>
  withSteps(flow, flow.steps.map((step) => (step.id === stepId ? { ...step, x: clamp(x), y: clamp(y) } : step)), now);

/**
 * Cambia nombre, acción o crítico de un paso. `critical: false` saca la marca.
 * Si nada cambia devuelve el mismo flujo, así el historial no guarda versiones iguales.
 */
export function editStep(flow, stepId, changes, { now }) {
  let changed = false;
  const steps = flow.steps.map((step) => {
    if (step.id !== stepId) return step;
    const next = { ...step };
    if (changes.label !== undefined) next.label = changes.label.slice(0, MAX_LABEL);
    if (changes.action !== undefined) {
      const action = changes.action.slice(0, MAX_LABEL);
      if (action) next.action = action; else delete next.action;
    }
    if (changes.critical === true) next.critical = true;
    if (changes.critical === false) delete next.critical;
    changed = ['label', 'action', 'critical'].some((key) => next[key] !== step[key]);
    return changed ? next : step;
  });
  return changed ? withSteps(flow, steps, now) : flow;
}

export const renameStep = (flow, stepId, label, { now }) =>
  withSteps(flow, flow.steps.map((step) => (step.id === stepId ? { ...step, label: label.slice(0, MAX_LABEL) } : step)), now);

/** Arquea la flecha que llega a `stepId`, de -1 a 1. Con null vuelve a la curva automática. */
export const bendStep = (flow, stepId, bend, { now }) =>
  withSteps(flow, flow.steps.map((step) => {
    if (step.id !== stepId) return step;
    return bend === null ? withoutBend(step) : { ...step, bend: Math.min(1, Math.max(-1, bend)) };
  }), now);

export function reorderStep(flow, fromIndex, toIndex, { now }) {
  const steps = [...flow.steps];
  const [moved] = steps.splice(fromIndex, 1);
  if (!moved) return flow;
  steps.splice(Math.min(Math.max(toIndex, 0), steps.length), 0, moved);
  return withSteps(flow, keepBends(flow.steps, steps), now);
}

export const removeStep = (flow, stepId, { now }) =>
  withSteps(flow, keepBends(flow.steps, flow.steps.filter((step) => step.id !== stepId)), now);

/** Historial de versiones para deshacer y rehacer. Guarda hasta `limit` pasos atrás. */
export function createHistory(initial, limit = 100) {
  let past = [];
  let present = initial;
  let future = [];
  return {
    current: () => present,
    push(next) {
      if (next === present) return;
      past.push(present);
      if (past.length > limit) past = past.slice(past.length - limit);
      present = next;
      future = [];
    },
    undo() {
      if (past.length) {
        future.push(present);
        present = past.pop();
      }
      return present;
    },
    redo() {
      if (future.length) {
        past.push(present);
        present = future.pop();
      }
      return present;
    },
    canUndo: () => past.length > 0,
    canRedo: () => future.length > 0,
  };
}
