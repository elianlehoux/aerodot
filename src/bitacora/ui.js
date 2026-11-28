/** Piezas de interfaz de la Bitácora: elementos, formularios, diálogos, avisos, descargas e impresión. */
export { h, pickFiles } from '../flowdot/ui.js';
import { h } from '../flowdot/ui.js';

export const btn = (label, onclick, kind = 'quiet', attrs = {}) => h('button', { type: 'button', class: kind === 'primary' ? 'button-primary bt-btn' : kind === 'danger' ? 'button-quiet bt-btn is-danger' : 'button-quiet bt-btn', onclick, ...attrs }, label);

/** Un campo con su etiqueta. `control` es el input, select o textarea ya armado. */
export const field = (label, control, { hint, wide } = {}) => h('label', { class: wide ? 'bt-field is-wide' : 'bt-field' },
  h('span', { class: 'bt-label', text: label }), control, hint ? h('small', { class: 'bt-hint', text: hint }) : null);

export const input = (name, value = '', attrs = {}) => h('input', { class: 'bt-input', name, value: value ?? '', autocomplete: 'off', ...attrs });

export const select = (name, options, value) => {
  const el = h('select', { class: 'bt-input', name },
    options.map((option) => {
      const [val, label] = Array.isArray(option) ? option : typeof option === 'object' ? [option.id, option.label] : [option, option];
      return h('option', { value: val, selected: String(val) === String(value) ? true : undefined, text: label });
    }));
  return el;
};

export const checkbox = (name, label, checked) => h('label', { class: 'bt-check' },
  h('input', { type: 'checkbox', name, checked: checked ? true : undefined }), h('span', { text: label }));

/** Lee un formulario a un objeto. Las casillas dan true o false. */
export function readForm(form) {
  const data = {};
  for (const el of form.elements) {
    if (!el.name) continue;
    data[el.name] = el.type === 'checkbox' ? el.checked : el.value;
  }
  return data;
}

/**
 * Diálogo modal. `body` es el contenido; `actions` los botones (value, label, kind).
 * Devuelve el value del botón elegido, o null si se cierra.
 */
export function dialog({ title, body, actions = [{ value: 'ok', label: 'Listo', kind: 'primary' }], wide = false, onOpen }) {
  return new Promise((resolve) => {
    const el = h('dialog', { class: wide ? 'bt-dialog is-wide ph-no-capture' : 'bt-dialog ph-no-capture', 'aria-labelledby': 'bt-dialog-title' },
      h('div', { class: 'bt-dialog-head' },
        h('h2', { id: 'bt-dialog-title', text: title }),
        h('button', { type: 'button', class: 'bt-close', 'aria-label': 'Cerrar', onclick: () => el.close('cancel') }, '×')),
      h('div', { class: 'bt-dialog-body' }, body),
      actions.length ? h('div', { class: 'bt-dialog-actions' }, actions.map((action) => btn(action.label, () => {
        if (action.validate && !action.validate()) return;
        el.close(action.value);
      }, action.kind ?? 'quiet'))) : null);
    el.addEventListener('close', () => {
      el.remove();
      resolve(el.returnValue && el.returnValue !== 'cancel' ? el.returnValue : null);
    });
    document.body.append(el);
    el.showModal();
    onOpen?.(el);
  });
}

export const confirm = (title, text, label = 'Borrar') => dialog({
  title,
  body: h('p', { text }),
  actions: [{ value: 'cancel', label: 'Cancelar' }, { value: 'ok', label, kind: 'danger' }],
}).then((value) => value === 'ok');

let toastTimer;
export function toast(message) {
  let el = document.querySelector('.bt-toast');
  if (!el) {
    el = h('div', { class: 'bt-toast', role: 'status', 'aria-live': 'polite' });
    document.body.append(el);
  }
  el.textContent = message;
  el.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-on'), 3200);
}

export function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const link = h('a', { href: url, download: name });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Imprime solo `content` (para guardar como PDF desde el diálogo del sistema).
 * La hoja vive en #bt-print, fuera de la app, y se vacía al terminar.
 */
export function printSheet(content, { landscape = false } = {}) {
  let sheet = document.getElementById('bt-print');
  if (!sheet) {
    sheet = h('div', { id: 'bt-print', class: 'ph-no-capture' });
    document.body.append(sheet);
  }
  sheet.replaceChildren(content);
  document.documentElement.classList.toggle('bt-landscape', landscape);
  document.documentElement.classList.add('bt-printing');
  const clean = () => {
    document.documentElement.classList.remove('bt-printing', 'bt-landscape');
    sheet.replaceChildren();
    window.removeEventListener('afterprint', clean);
  };
  window.addEventListener('afterprint', clean);
  window.print();
}

export const todayIso = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

export const formatDate = (iso) => (/^\d{4}-\d{2}-\d{2}$/.test(iso ?? '') ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : '');

/** Etiqueta chica de estado. `tone`: 'bad', 'warn' u 'ok'. */
export const chip = (text, tone) => h('span', { class: `bt-chip${tone ? ` is-${tone}` : ''}`, text });

export const empty = (text, ...extra) => h('div', { class: 'bt-empty' }, h('p', { text }), ...extra);

/** "1 vuelo", "3 vuelos". `many` por defecto suma una s. */
export const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
