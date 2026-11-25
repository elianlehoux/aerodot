/**
 * Avance de práctica por flujo. Se guarda aparte del flujo (meta `progress:<flowId>`)
 * para que exportar o compartir un flujo no lleve las notas de quien lo practicó.
 */
export const LEVELS = ['lista', 'memoria', 'simulador'];
export const LEVEL_LABELS = { lista: 'Con la lista', memoria: 'De memoria', simulador: 'Simulador' };
export const LEVEL_HINTS = { lista: 'Ves qué paso sigue.', memoria: 'Sin la lista, y te pregunta la acción.', simulador: 'Con reloj y nota, como en el examen.' };
export const PASS = 0.9;

/** Clave de meta donde se guarda el avance de un flujo. Se borra junto con el flujo. */
export const progressKey = (flowId) => `progress:${flowId}`;

const STALE = 2 * 24 * 60 * 60 * 1000;

const better = (a, b) => {
  if (!b) return true;
  if (a.ratio !== b.ratio) return a.ratio > b.ratio;
  return a.time != null && b.time != null && a.time < b.time;
};

/** Guarda un resultado: la mejor marca del escalón, la última y cuándo. Devuelve un progreso nuevo. */
export function recordResult(progress, level, result, now) {
  const levels = progress?.levels ?? {};
  const previous = levels[level];
  const best = better(result, previous?.best) ? result : previous.best;
  return { ...progress, levels: { ...levels, [level]: { best, last: result, at: now } }, lastLevel: level };
}

/** El escalón más alto con 90 % o más, o null. */
export function passedLevel(progress) {
  const levels = progress?.levels ?? {};
  return [...LEVELS].reverse().find((level) => (levels[level]?.best?.ratio ?? 0) >= PASS) ?? null;
}

/** Conviene repasar hoy: nunca se practicó, hace 2 días o más, o la última vez salió flojo. */
export function needsReview(progress, now, stepCount) {
  if (!stepCount) return false;
  const entries = Object.values(progress?.levels ?? {});
  if (!entries.length) return true;
  const latest = entries.reduce((a, b) => (b.at > a.at ? b : a));
  return now - latest.at >= STALE || latest.last.ratio < PASS;
}
