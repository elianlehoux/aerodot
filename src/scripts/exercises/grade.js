/** Texto comparable: sin mayúsculas, acentos, puntuación ni espacios de más. */
export const normalize = (text) => String(text ?? '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[\u2018\u2019]/g, "'")
  .replace(/[^a-z0-9\s'-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

export const shuffle = (items, rand = Math.random) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

export const gradeChoice = (item, picked) => ({
  correct: picked === item.answer,
  expected: item.options[item.answer],
});

export const gradeTf = (item, picked) => ({
  correct: picked === item.answer,
  expected: item.answer ? 'Verdadero' : 'Falso',
});

export const gradeGap = (item, typed) => {
  const given = normalize(typed);
  return {
    correct: given !== '' && item.answers.some((answer) => normalize(answer) === given),
    expected: item.answers[0],
  };
};

const joined = (tokens) => tokens.map(normalize).join(' ');

export const gradeOrder = (item, built) => {
  const given = joined(built);
  const valid = [item.answer, ...(item.alternatives ?? [])].map(joined);
  return { correct: valid.includes(given), expected: item.answer.join(' ') };
};

export const summarize = (results, passMark = 0.75) => {
  const total = results.length;
  const correct = results.filter(Boolean).length;
  return { correct, total, passed: total > 0 && correct / total >= passMark };
};
