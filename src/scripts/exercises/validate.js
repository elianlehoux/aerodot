import { hasUnmatchedMarker } from '../mixed.js';

const TYPES = ['mcq', 'tf', 'gap', 'order'];
const isText = (value) => typeof value === 'string' && value.trim() !== '';
const isTexts = (value, min) => Array.isArray(value) && value.length >= min && value.every(isText);
const key = (tokens) => [...tokens].sort().join('\u0000');

const checkItem = (item, where) => {
  const errors = [];
  if (!isText(item.prompt)) errors.push(`${where}: falta prompt.`);
  for (const field of ['prompt', 'explain']) {
    if (isText(item[field]) && hasUnmatchedMarker(item[field])) errors.push(`${where}: ${field} tiene un asterisco sin pareja.`);
  }
  if (item.lead !== undefined && !isText(item.lead)) errors.push(`${where}: lead debe ser un texto no vacío.`);
  if (item.type === 'mcq') {
    if (!isTexts(item.options, 2)) errors.push(`${where}: options necesita al menos 2 textos.`);
    else if (!Number.isInteger(item.answer) || item.answer < 0 || item.answer >= item.options.length) errors.push(`${where}: answer fuera de rango.`);
  } else if (item.type === 'tf') {
    if (typeof item.answer !== 'boolean') errors.push(`${where}: answer debe ser true o false.`);
  } else if (item.type === 'gap') {
    if (!isText(item.sentence) || item.sentence.split('___').length !== 2) errors.push(`${where}: sentence necesita exactamente un ___.`);
    if (!isTexts(item.answers, 1)) errors.push(`${where}: answers necesita al menos 1 texto.`);
  } else if (item.type === 'order') {
    if (!isTexts(item.tokens, 2)) errors.push(`${where}: tokens necesita al menos 2 fichas.`);
    else if (!isTexts(item.answer, 1) || key(item.answer) !== key(item.tokens)) errors.push(`${where}: answer debe usar las mismas fichas que tokens.`);
    if (item.alternatives !== undefined && (!Array.isArray(item.alternatives)
      || !item.alternatives.every((alt) => isTexts(alt, 1) && key(alt) === key(item.tokens)))) {
      errors.push(`${where}: alternatives debe ser una lista de órdenes con las mismas fichas que tokens.`);
    }
  }
  return errors;
};

/** Devuelve la lista de errores del set; vacía si es válido. */
export const validateSet = (set) => {
  if (!set || typeof set !== 'object') return ['El set no es un objeto.'];
  const errors = [];
  const id = isText(set.id) ? set.id : '(sin id)';
  if (!isText(set.id)) errors.push('Falta set.id.');
  if (!isText(set.slug)) errors.push(`${id}: falta slug.`);
  if (!isText(set.title)) errors.push(`${id}: falta title.`);
  if (set.passMark !== undefined && !(typeof set.passMark === 'number' && set.passMark > 0 && set.passMark <= 1)) {
    errors.push(`${id}: passMark debe ser un número entre 0 (exclusivo) y 1.`);
  }
  if (isText(set.lede) && hasUnmatchedMarker(set.lede)) errors.push(`${id}: lede tiene un asterisco sin pareja.`);
  if (set.track !== undefined && typeof set.track !== 'boolean') errors.push(`${id}: track debe ser true o false.`);
  if (!Array.isArray(set.items) || set.items.length === 0) return [...errors, `${id}: items está vacío.`];
  const seen = new Set();
  set.items.forEach((item, index) => {
    const where = `${id}[${index}]`;
    if (!item || typeof item !== 'object') { errors.push(`${where}: no es un objeto.`); return; }
    if (!isText(item.id)) errors.push(`${where}: falta id.`);
    else if (seen.has(item.id)) errors.push(`${where}: id repetido (${item.id}).`);
    else seen.add(item.id);
    if (!TYPES.includes(item.type)) { errors.push(`${where}: tipo inválido (${item.type}).`); return; }
    errors.push(...checkItem(item, where));
  });
  return errors;
};
