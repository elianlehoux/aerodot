import { survivalSheets } from '../data/english-survival.js';
import { normalize } from './exercises/grade.js';
import { markEnglishReady } from './english.js';

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

const blankInput = (answer, n) => el('input', {
  class: 'sv-blank',
  type: 'text',
  autocomplete: 'off',
  autocapitalize: 'off',
  spellcheck: 'false',
  'aria-label': `Hueco ${n}`,
  'data-answer': answer,
});

const lineOf = (item, index) => {
  const num = el('span', { class: 'sv-num', text: String(index + 1) });
  if (item.choices) {
    const select = el('select', { class: 'sv-drop', 'aria-label': `Respuesta ${index + 1}` });
    select.append(el('option', { value: '', text: '' }));
    item.choices.forEach((choice) => select.append(el('option', { value: choice, text: choice })));
    select.dataset.answer = item.answer;
    return el('li', { class: 'sv-item' }, num, el('p', { class: 'sv-item-line' }, item.before, select, item.after));
  }
  const input = blankInput(item.answer, index + 1);
  return el('li', { class: 'sv-item' }, num, el('p', { class: 'sv-item-line' }, item.before, input));
};

const renderSelect = (sheet) => {
  const list = el('ol', { class: 'sv-items' });
  sheet.items.forEach((item, index) => list.append(lineOf(item, index)));
  return list;
};

const renderDialogue = (sheet) => {
  const list = el('div', { class: 'sv-dialogue' });
  sheet.lines.forEach((line) => {
    const body = el('p', { class: 'sv-item-line', lang: 'en' });
    line.chunks.forEach((chunk) => {
      if (chunk.text) body.append(chunk.text);
      else body.append(el('span', { class: 'sv-num sv-num-inline', text: String(chunk.n) }), blankInput(chunk.blank, chunk.n));
    });
    list.append(el('p', { class: 'sv-who', text: line.who }), body);
  });
  return list;
};

const gradeField = (field) => {
  const given = normalize(field.value);
  const expected = normalize(field.dataset.answer);
  const correct = given !== '' && given === expected;
  field.dataset.state = correct ? 'ok' : 'bad';
  field.disabled = true;
  return correct;
};

const renderSheet = (sheet) => {
  const box = el('section', { class: 'sv-sheet', 'data-sheet': sheet.id });
  box.append(
    el('h2', { class: 'sv-sheet-title', text: `Ejercicio ${sheet.n}` }),
    el('h3', { class: 'sv-sheet-name', text: sheet.title }),
    el('p', { class: 'sv-instruction', text: sheet.instruction }),
  );
  if (sheet.example) {
    box.append(el('p', { class: 'sv-example-line' }, 'Ejemplo: ', sheet.example.from, ' → ', el('span', { class: 'sv-pill', lang: 'en', text: sheet.example.to })));
  }
  const fieldsRoot = sheet.kind === 'dialogue' ? renderDialogue(sheet) : renderSelect(sheet);
  const score = el('p', { class: 'sv-score', 'aria-live': 'polite' });
  const check = el('button', { class: 'button-primary', type: 'button', text: 'Corregir' });
  const reveal = el('button', { class: 'button-quiet', type: 'button', hidden: true, text: 'Ver respuestas' });
  const again = el('button', { class: 'button-quiet', type: 'button', hidden: true, text: 'Otra vez' });
  check.addEventListener('click', () => {
    const fields = [...fieldsRoot.querySelectorAll('[data-answer]')];
    const correct = fields.filter(gradeField).length;
    const passed = fields.length > 0 && correct / fields.length >= 0.75;
    score.textContent = `${correct} de ${fields.length}. ${passed ? 'Lo tenés.' : 'Revisá los huecos marcados.'}`;
    check.hidden = true;
    reveal.hidden = correct === fields.length;
    again.hidden = false;
    if (passed && sheet.n === survivalSheets.length) {
      try { markEnglishReady('supervivencia'); } catch { /* sin avance guardado */ }
    }
  });
  reveal.addEventListener('click', () => {
    fieldsRoot.querySelectorAll('[data-state="bad"]').forEach((field) => {
      field.value = field.dataset.answer;
      field.dataset.state = 'ok';
      /* El hueco tiene un ancho fijo: se agranda lo justo para que la palabra entre entera. */
      if (field.tagName === 'INPUT') field.style.width = `${Math.max(9, field.dataset.answer.length + 5)}ch`;
    });
    reveal.hidden = true;
  });
  again.addEventListener('click', () => {
    reveal.hidden = true;
    fieldsRoot.querySelectorAll('[data-answer]').forEach((field) => {
      field.disabled = false;
      field.value = '';
      field.style.width = '';
      delete field.dataset.state;
    });
    score.textContent = '';
    check.hidden = false;
    again.hidden = true;
  });
  box.append(fieldsRoot, el('div', { class: 'ex-actions' }, check, reveal, again), score);
  return box;
};

export const mountSurvivalSheet = () => {
  const root = document.querySelector('[data-survival-sheet]');
  if (!root || root.dataset.mounted) return;
  root.dataset.mounted = '1';
  const panels = new Map(survivalSheets.map((sheet) => [sheet.id, renderSheet(sheet)]));
  const stage = el('div', { class: 'sv-stage' });
  panels.forEach((panel) => stage.append(panel));
  root.append(stage);
  const buttons = [...root.querySelectorAll('[data-show-sheet]')];
  const show = (id) => {
    panels.forEach((panel, key) => { panel.hidden = key !== id; });
    buttons.forEach((button) => {
      const on = button.dataset.showSheet === id;
      button.setAttribute('aria-current', on ? 'page' : 'false');
    });
  };
  buttons.forEach((button) => button.addEventListener('click', () => show(button.dataset.showSheet)));
  show(survivalSheets[0].id);
};
