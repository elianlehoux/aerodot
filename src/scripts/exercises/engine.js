import { feedbackLead, gradeChoice, gradeGap, gradeOrder, gradeTf, normalize, playOrder, shuffle, summarize, tracksProgress } from './grade.js';
import { validateSet } from './validate.js';
import { splitMixed } from '../mixed.js';
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

/* Texto en español con inglés entre asteriscos: los trozos en inglés van en un span con lang="en". */
const inline = (text) => splitMixed(text).map((part) => (part.en ? el('span', { lang: 'en', text: part.text }) : part.text));

/* Cada builder recibe (item, change, submit) y devuelve { node, value(), lock() }. value() es undefined hasta que haya respuesta. */

const optionButton = (label, letter, lang = 'en') => el(
  'button',
  { class: 'ex-option', type: 'button', 'aria-pressed': 'false' },
  el('span', { class: 'ex-letter', 'aria-hidden': 'true', text: letter }),
  el('span', { class: 'ex-option-text', lang, text: label }),
);

const buildChoice = (item, change) => {
  let picked = -1;
  const buttons = item.options.map((label, index) => optionButton(label, String.fromCharCode(97 + index)));
  buttons.forEach((button, index) => button.addEventListener('click', () => {
    picked = index;
    buttons.forEach((other, i) => other.setAttribute('aria-pressed', String(i === index)));
    change();
  }));
  return {
    node: el('div', { class: 'ex-options', role: 'group', 'aria-label': 'Opciones' }, buttons),
    value: () => (picked >= 0 ? picked : undefined),
    lock: () => buttons.forEach((button) => { button.disabled = true; }),
    mark: () => buttons.forEach((button, index) => {
      if (index === item.answer) button.dataset.state = 'ok';
      else if (index === picked) button.dataset.state = 'bad';
    }),
  };
};

const buildTf = (item, change) => {
  let picked;
  const labels = [[true, 'Verdadero'], [false, 'Falso']];
  const buttons = labels.map(([, text], index) => optionButton(text, index === 0 ? 'V' : 'F', 'es'));
  buttons.forEach((button, index) => button.addEventListener('click', () => {
    picked = labels[index][0];
    buttons.forEach((other, i) => other.setAttribute('aria-pressed', String(i === index)));
    change();
  }));
  return {
    node: el('div', { class: 'ex-options', role: 'group', 'aria-label': 'Verdadero o falso' }, buttons),
    value: () => picked,
    lock: () => buttons.forEach((button) => { button.disabled = true; }),
    mark: () => buttons.forEach((button, index) => {
      if (labels[index][0] === item.answer) button.dataset.state = 'ok';
      else if (labels[index][0] === picked) button.dataset.state = 'bad';
    }),
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
    reveal: () => {
      bank.length = 0;
      built.splice(0, built.length, ...item.answer);
      paint();
      [...builtRow.children].forEach((chip) => { chip.disabled = true; });
    },
  };
};

const BUILDERS = { mcq: buildChoice, tf: buildTf, gap: buildGap, order: buildOrder };
const GRADERS = { mcq: gradeChoice, tf: gradeTf, gap: gradeGap, order: gradeOrder };

const emptyOption = () => el('option', { value: '', text: '' });

const choiceSelect = (labels) => {
  const select = el('select', { class: 'ex-select' });
  select.append(emptyOption(), ...labels.map((label, index) => el('option', { value: String(index), text: label })));
  return select;
};

/* Una pregunta de la hoja. value() es undefined hasta que haya respuesta. */
const buildSheetItem = (item) => {
  const feedback = el('p', { class: 'ex-feedback', 'aria-live': 'polite' });
  if (item.type === 'gap' && item.sentence?.includes('___')) {
    const choices = item.choices?.length ? item.choices : item.answers;
    const [before, after] = item.sentence.split('___');
    const useSelect = choices.length > 1;
    const field = useSelect
      ? el('select', { class: 'ex-select', lang: 'en', 'aria-label': 'Palabra que falta' })
      : el('input', { class: 'ex-input ex-blank', type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': 'Palabra que falta', lang: 'en' });
    if (useSelect) field.append(emptyOption(), ...shuffle(choices).map((label) => el('option', { value: label, text: label })));
    const line = el('p', { class: 'ex-line', lang: 'en' }, before, field, after);
    return {
      feedback,
      node: el('div', { class: 'ex-body' }, item.prompt ? el('p', { class: 'ex-prompt' }, inline(item.prompt)) : null, line, feedback),
      value: () => {
        const raw = field.value.trim();
        return raw ? raw : undefined;
      },
      lock: () => { field.disabled = true; },
      mark: (verdict) => { field.dataset.state = verdict.correct ? 'ok' : 'bad'; },
      reveal: () => {
        field.value = item.answers[0];
        field.dataset.state = 'ok';
        /* El hueco tiene un ancho tope: se agranda lo justo para que la palabra entre entera. */
        if (!useSelect) Object.assign(field.style, { width: `${Math.max(8, item.answers[0].length + 5)}ch`, maxWidth: 'none' });
      },
    };
  }
  if (item.type === 'mcq' || item.type === 'tf') {
    const labels = item.type === 'tf' ? ['Verdadero', 'Falso'] : item.options;
    const select = choiceSelect(labels);
    select.lang = item.type === 'tf' ? 'es' : 'en';
    select.setAttribute('aria-label', 'Respuesta');
    return {
      feedback,
      node: el('div', { class: 'ex-body' }, el('p', { class: 'ex-line' }, inline(item.prompt), ' ', select), feedback),
      value: () => {
        if (select.value === '') return undefined;
        return item.type === 'tf' ? select.value === '0' : Number(select.value);
      },
      lock: () => { select.disabled = true; },
      mark: (verdict) => { select.dataset.state = verdict.correct ? 'ok' : 'bad'; },
      reveal: () => {
        select.value = item.type === 'tf' ? (item.answer ? '0' : '1') : String(item.answer);
        select.dataset.state = 'ok';
      },
    };
  }
  const built = buildOrder(item, () => {});
  return {
    feedback,
    node: el('div', { class: 'ex-body' }, el('p', { class: 'ex-prompt' }, inline(item.prompt)), built.node, feedback),
    value: () => built.value(),
    lock: () => built.lock(),
    mark: () => {},
    reveal: () => built.reveal(),
  };
};

const paintFeedback = (item, verdict, feedback) => {
  feedback.className = `ex-feedback ${verdict.correct ? 'is-ok' : 'is-bad'}`;
  const explain = item.explain ? [' ', ...inline(item.explain)] : [];
  if (item.type === 'tf') {
    feedback.replaceChildren(verdict.correct ? 'Bien. ' : '', el('b', { text: item.answer ? 'Es verdadero.' : 'Es falso.' }), ...explain);
    return;
  }
  const phrase = item.type === 'gap' ? item.sentence.replace('___', verdict.expected) : verdict.expected;
  feedback.replaceChildren(feedbackLead(item, verdict.correct), ' ', el('b', { lang: 'en', text: phrase }), ...explain);
};

const runSet = (root, set) => {
  const stage = root.querySelector('[data-exercise-stage]');
  if (!stage) return;

  /* Todas las preguntas en una hoja, como un ejercicio de una sola página. */
  const start = () => {
    const items = playOrder(set);
    const questions = items.map((item) => ({ item, ...buildSheetItem(item) }));
    const list = el('ol', { class: 'ex-list' }, questions.map((question, index) => el(
      'li',
      { class: 'ex-q' },
      el('span', { class: 'ex-num', text: String(index + 1) }),
      question.node,
    )));
    const check = el('button', { class: 'button-primary', type: 'button', text: 'Corregir' });
    const reveal = el('button', { class: 'button-quiet', type: 'button', hidden: true, text: 'Ver respuestas' });
    const again = el('button', { class: 'button-quiet', type: 'button', hidden: true, text: 'Otra vez' });
    let wrong = [];
    const score = el('p', { class: 'ex-score', 'aria-live': 'polite' });
    check.addEventListener('click', () => {
      const results = questions.map((question) => {
        const given = question.value();
        if (given === undefined) {
          question.feedback.className = 'ex-feedback is-bad';
          question.feedback.textContent = 'Falta elegir.';
          question.mark({ correct: false });
          question.lock();
          return false;
        }
        const verdict = GRADERS[question.item.type](question.item, given);
        question.mark(verdict);
        question.lock();
        paintFeedback(question.item, verdict, question.feedback);
        return verdict.correct;
      });
      const { correct, total, passed } = summarize(results, set.passMark);
      score.textContent = `${correct} de ${total}. ${passed ? 'Lo tenés.' : 'Repasá las que quedaron mal y probá de nuevo.'}`;
      wrong = questions.filter((_, index) => !results[index]);
      check.hidden = true;
      reveal.hidden = wrong.length === 0;
      again.hidden = false;
      if (passed && tracksProgress(set)) {
        try { markEnglishReady(set.slug); } catch { /* sin avance guardado */ }
      }
    });
    reveal.addEventListener('click', () => {
      wrong.forEach((question) => question.reveal());
      reveal.hidden = true;
    });
    again.addEventListener('click', () => start());
    stage.replaceChildren(list, el('div', { class: 'ex-actions' }, check, reveal, again), score);
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
    try {
      runSet(root, set);
    } catch (error) {
      console.error('Set de ejercicios con error:', error);
      root.hidden = true;
    }
  });
};
