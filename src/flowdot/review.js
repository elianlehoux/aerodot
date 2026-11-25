/**
 * Motor del repaso. Sin DOM: recibe qué paso tocó la persona (el índice que da hitTest)
 * y devuelve un estado nuevo. 'order' pide los pasos en orden; 'where' en orden mezclado.
 */

function shuffle(list, random) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const view = (state) => ({
  ...state,
  total: state.order.length,
  expectedIndex: state.order[state.current] ?? -1,
  done: state.current >= state.order.length,
});

/** Ids de los pasos críticos, en el orden del flujo (para `only`). */
export const criticalStepIds = (steps) => steps.filter((step) => step.critical === true).map((step) => step.id);

export function createReview(steps, { mode = 'order', only, random = Math.random } = {}) {
  const keep = only ? new Set(only) : null;
  let order = steps.map((_, index) => index).filter((index) => !keep || keep.has(steps[index].id));
  if (mode === 'where') order = shuffle(order, random);
  return view({
    ids: steps.map((step) => step.id),
    order,
    current: 0,
    hintLevel: 0,
    errors: order.map(() => 0),
    hints: order.map(() => 0),
  });
}

export function reviewTap(state, hitIndex) {
  if (state.done) return { state, result: 'miss' };
  if (hitIndex !== state.expectedIndex) {
    const errors = [...state.errors];
    errors[state.current] += 1;
    return { state: view({ ...state, errors }), result: 'miss' };
  }
  return { state: view({ ...state, current: state.current + 1, hintLevel: 0 }), result: 'hit' };
}

export function reviewHint(state) {
  if (state.done || state.hintLevel >= 2) return state;
  const hints = [...state.hints];
  if (state.hintLevel === 0) hints[state.current] = 1;
  return view({ ...state, hintLevel: state.hintLevel + 1, hints });
}

export function reviewSummary(state) {
  const asked = state.order.slice(0, state.current);
  const clean = asked.filter((_, pos) => state.errors[pos] === 0 && state.hints[pos] === 0).length;
  const missed = new Set(state.order.filter((_, pos) => state.errors[pos] > 0 || state.hints[pos] > 0));
  return {
    total: state.order.length,
    firstTry: clean,
    errors: state.errors.reduce((sum, n) => sum + n, 0),
    hints: state.hints.reduce((sum, n) => sum + n, 0),
    missedStepIds: state.ids.filter((_, index) => missed.has(index)),
  };
}

/**
 * Opciones para elegir la acción (o la respuesta de la checklist): la correcta y hasta 3 distintas
 * de `values`, mezcladas. Con menos de 2 distintas no hay pregunta y devuelve [].
 */
export function choicesFor(values, correct, random = Math.random) {
  const others = shuffle([...new Set(values.filter((value) => value && value !== correct))], random).slice(0, 3);
  if (!correct || others.length === 0) return [];
  return shuffle([correct, ...others], random);
}

/** Índices de la secuencia creciente más larga (en orden), para saber qué quedó fuera de orden. */
function longestIncreasing(list) {
  const tails = [];
  const tailAt = [];
  const prev = new Array(list.length).fill(-1);
  list.forEach((value, i) => {
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < value) lo = mid + 1; else hi = mid;
    }
    tails[lo] = value;
    tailAt[lo] = i;
    prev[i] = lo > 0 ? tailAt[lo - 1] : -1;
  });
  const keep = new Set();
  for (let i = tailAt[tails.length - 1] ?? -1; i >= 0; i = prev[i]) keep.add(i);
  return keep;
}

/**
 * Corrige una pasada del Simulador. `taps` son los índices de paso tocados en orden, o -1 si el toque
 * no cayó en ningún paso. Un paso tocado dos veces cuenta una sola.
 */
export function gradeRun(total, taps) {
  const order = [...new Set(taps.filter((index) => index >= 0))];
  const keep = longestIncreasing(order);
  const touched = new Set(order);
  return {
    order,
    inOrder: keep.size,
    outOfOrder: order.filter((_, i) => !keep.has(i)),
    skipped: Array.from({ length: total }, (_, i) => i).filter((i) => !touched.has(i)),
    stray: taps.filter((index) => index < 0).length,
    score: total ? Math.round((100 * keep.size) / total) : 0,
  };
}
