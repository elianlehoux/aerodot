import { gradeChoice, gradeGap, gradeOrder, gradeTf, normalize, shuffle, summarize } from './grade.js';
import { validateSet } from './validate.js';
import { markEnglishReady } from '../english.js';

const el = (tag, props = {}, ...children) => {
  const node = document.createElement(tag);
  for (const [name, value] of Object.entries(props)) {
    if (value === undefined || value === false) continue;
    if (name === 'class') node.className = value;
    else if (name === 'text') node.textContent = value;
    else node.setAttribute(name, value === true ? '' : value);
  }
  children.flat().forEach((child) => child != null && node.append(child));
  return node;
};

/* Cada builder recibe (item, change, submit) y devuelve { node, value(), lock() }. value() es undefined hasta que haya respuesta. */

const buildChoice = (item, change) => {
  let picked = -1;
  const buttons = item.options.map((label) => el('button', { class: 'ex-option', type: 'button', 'aria-pressed': 'false', lang: 'en', text: label }));
  buttons.forEach((button, index) => button.addEventListener('click', () => {
    picked = index;
    buttons.forEach((other, i) => other.setAttribute('aria-pressed', String(i === index)));
    change();
  }));
  return {
    node: el('div', { class: 'ex-options', role: 'group', 'aria-label': 'Opciones' }, buttons),
    value: () => (picked >= 0 ? picked : undefined),
    lock: () => buttons.forEach((button) => { button.disabled = true; }),
  };
};

const buildTf = (item, change) => {
  let picked;
  const labels = [[true, 'Verdadero'], [false, 'Falso']];
  const buttons = labels.map(([, text]) => el('button', { class: 'ex-option', type: 'button', 'aria-pressed': 'false', text }));
  buttons.forEach((button, index) => button.addEventListener('click', () => {
    picked = labels[index][0];
    buttons.forEach((other, i) => other.setAttribute('aria-pressed', String(i === index)));
    change();
  }));
  return {
    node: el('div', { class: 'ex-options ex-options-row', role: 'group', 'aria-label': 'Verdadero o falso' }, buttons),
    value: () => picked,
    lock: () => buttons.forEach((button) => { button.disabled = true; }),
  };
};

const buildGap = (item, change, submit) => {
  const [before, after] = item.sentence.split('___');
  const input = el('input', { class: 'ex-input', type: 'text', autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off', enterkeyhint: 'done', spellcheck: 'false', 'aria-label': 'Palabra que falta', lang: 'en' });
  input.addEventListener('input', change);
  input.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    submit();
  });
  return {
    node: el('p', { class: 'ex-sentence', lang: 'en' }, before, input, after),
    value: () => (input.value.trim() ? input.value : undefined),
    lock: () => { input.disabled = true; },
  };
};

/* Las fichas se identifican por posición, no por texto: una frase puede repetir la misma palabra. */
const buildOrder = (item, change) => {
  const bank = [];
  const built = [];
  const bankRow = el('div', { class: 'ex-bank', role: 'group', 'aria-label': 'Fichas' });
  const builtRow = el('div', { class: 'ex-built', role: 'group', 'aria-live': 'polite', 'aria-label': 'Tu frase' });
  let locked = false;
  const move = (from, to, index, fromRow, toRow) => {
    if (locked) return;
    to.push(...from.splice(index, 1));
    paint();
    /* El repintado reemplaza los botones: el foco queda cerca de donde estaba para no perderlo con teclado. */
    const near = fromRow.children[Math.min(index, from.length - 1)];
    (near ?? toRow.lastElementChild)?.focus();
    change();
  };
  const paint = () => {
    bankRow.replaceChildren(...bank.map((token, i) => {
      const chip = el('button', { class: 'ex-chip', type: 'button', lang: 'en', text: token });
      chip.addEventListener('click', () => move(bank, built, i, bankRow, builtRow));
      return chip;
    }));
    builtRow.replaceChildren(...built.map((token, i) => {
      const chip = el('button', { class: 'ex-chip is-built', type: 'button', lang: 'en', text: token });
      chip.addEventListener('click', () => move(built, bank, i, builtRow, bankRow));
      return chip;
    }));
  };
  /* Si la mezcla sale ya resuelta, se vuelve a mezclar (con tope, por si todas las fichas son iguales). */
  const text = (tokens) => tokens.map(normalize).join(' ');
  const solved = text(item.answer);
  let mixed = shuffle(item.tokens);
  for (let tries = 0; item.tokens.length > 1 && text(mixed) === solved && tries < 10; tries += 1) mixed = shuffle(item.tokens);
  bank.push(...mixed);
  paint();
  return {
    node: el('div', { class: 'ex-order' }, builtRow, bankRow),
    value: () => (bank.length === 0 ? [...built] : undefined),
    lock: () => {
      locked = true;
      [...bankRow.children, ...builtRow.children].forEach((chip) => { chip.disabled = true; });
    },
  };
};

const BUILDERS = { mcq: buildChoice, tf: buildTf, gap: buildGap, order: buildOrder };
const GRADERS = { mcq: gradeChoice, tf: gradeTf, gap: gradeGap, order: gradeOrder };

const runSet = (root, set) => {
  const stage = root.querySelector('[data-exercise-stage]');
  if (!stage) return;
  let items = [];
  let results = [];
  let index = 0;

  /* moveFocus solo cuando responde a un clic: al cargar la página no hay que robar el foco ni mover el scroll. */
  const start = (moveFocus = false) => {
    items = shuffle(set.items);
    results = [];
    index = 0;
    show(moveFocus);
  };

  const dots = () => el('div', { class: 'ex-dots', 'aria-hidden': 'true' },
    items.map((_, i) => el('span', { class: i < results.length ? (results[i] ? 'is-ok' : 'is-bad') : i === index ? 'is-now' : '' })));

  const show = (moveFocus = false) => {
    if (index >= items.length) { finish(); return; }
    const item = items[index];
    const progress = dots();
    const prompt = el('p', { class: 'ex-prompt', tabindex: '-1', text: item.prompt });
    const feedback = el('p', { class: 'ex-feedback', 'aria-live': 'polite' });
    const check = el('button', { class: 'button-primary', type: 'button', disabled: true, text: 'Corregir' });
    const next = el('button', { class: 'button-primary', type: 'button', hidden: true, text: index === items.length - 1 ? 'Ver resultado' : 'Siguiente' });
    const submit = () => { if (!check.disabled && !check.hidden) check.click(); };
    const built = BUILDERS[item.type](item, () => { check.disabled = built.value() === undefined; }, submit);
    const say = item.say ? el('button', { class: 'button-quiet ex-say', type: 'button', 'data-say': item.say, text: 'Escuchar' }) : null;

    check.addEventListener('click', () => {
      const given = built.value();
      if (given === undefined || check.hidden) return;
      const verdict = GRADERS[item.type](item, given);
      results.push(verdict.correct);
      progress.replaceWith(dots());
      built.lock();
      check.hidden = true;
      next.hidden = false;
      feedback.className = `ex-feedback ${verdict.correct ? 'is-ok' : 'is-bad'}`;
      const lead = verdict.correct ? 'Bien.' : 'Se dice:';
      const expectedLang = item.type === 'tf' ? undefined : 'en';
      feedback.replaceChildren(lead, ' ', el('b', { lang: expectedLang, text: verdict.expected }), item.explain ? ` ${item.explain}` : '');
      next.focus();
    });
    next.addEventListener('click', () => { index += 1; show(true); });

    const position = el('p', { class: 'visually-hidden', text: `Pregunta ${index + 1} de ${items.length}` });
    stage.replaceChildren(el('div', { class: 'ex-card' }, position, progress, say, prompt, built.node, feedback, el('div', { class: 'ex-actions' }, check, next)));
    if (moveFocus) prompt.focus();
  };

  const finish = () => {
    const { correct, total, passed } = summarize(results, set.passMark);
    const score = el('p', { class: 'quiz-score', tabindex: '-1', text: `${correct} de ${total}` });
    const again = el('button', { class: 'button-primary', type: 'button', text: 'Otra vez' });
    again.addEventListener('click', () => start(true));
    stage.replaceChildren(el('div', { class: 'ex-card ex-done' },
      el('p', { class: 'card-kicker', text: 'Al primer intento' }),
      score,
      el('p', { class: 'quiz-verdict', text: passed ? 'Lo tenés.' : 'Casi. Repasá las frases y probá de nuevo.' }),
      el('div', { class: 'ex-actions' }, again)));
    score.focus();
    if (passed) {
      try { markEnglishReady(set.slug); } catch { /* sin avance guardado */ }
    }
  };

  start();
};

export const mountExerciseSets = () => {
  document.querySelectorAll('[data-exercise-set]').forEach((root) => {
    if (root.dataset.exMounted) return;
    root.dataset.exMounted = '1';
    let set;
    try {
      set = JSON.parse(root.querySelector('[data-exercise-json]')?.textContent ?? '');
    } catch (error) {
      console.error('Set de ejercicios ilegible:', error);
      root.hidden = true;
      return;
    }
    const errors = validateSet(set);
    if (errors.length) {
      console.error('Set de ejercicios inválido:', errors);
      root.hidden = true;
      return;
    }
    runSet(root, set);
  });
};
