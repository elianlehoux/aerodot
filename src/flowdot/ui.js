/** Piezas chicas de interfaz para Flowdot: crear elementos, diálogos y avisos. */

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null || value === false) continue;
    if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), value);
    else if (key === 'class') el.className = value;
    else if (key === 'text') el.textContent = value;
    else el.setAttribute(key, value === true ? '' : value);
  }
  el.append(...children.flat(Infinity).filter((child) => child !== null && child !== undefined && child !== false));
  return el;
}

export const button = (label, onClick, attrs = {}) => h('button', { type: 'button', class: 'fd-btn', onclick: onClick, ...attrs }, label);

/**
 * Diálogo modal con botones. Devuelve la elección (el `value` del botón) o null al cerrar.
 * `extra` es contenido opcional entre el texto y los botones.
 */
export function ask({ title, text, actions, extra }) {
  return new Promise((resolve) => {
    const dialog = h('dialog', { class: 'fd-dialog ph-no-capture' },
      h('h2', { text: title }),
      text ? h('p', { text }) : null,
      extra ?? null,
      h('div', { class: 'fd-dialog-actions' }, actions.map((action) => button(action.label, () => dialog.close(action.value), {
        class: `fd-btn${action.primary ? ' is-primary' : ''}${action.danger ? ' is-danger' : ''}`,
      }))),
    );
    dialog.addEventListener('close', () => {
      dialog.remove();
      resolve(dialog.returnValue && dialog.returnValue !== 'cancel' ? dialog.returnValue : null);
    });
    document.body.append(dialog);
    dialog.showModal();
  });
}

/** Pide un texto. Devuelve el texto o null si se cancela. */
export async function askText({ title, value = '', label, max = 120 }) {
  const input = h('input', { class: 'fd-input', type: 'text', value, maxlength: max, 'aria-label': label });
  const form = h('form', { method: 'dialog' }, input);
  const result = await new Promise((resolve) => {
    const dialog = h('dialog', { class: 'fd-dialog ph-no-capture' }, h('h2', { text: title }), form,
      h('div', { class: 'fd-dialog-actions' },
        button('Cancelar', () => dialog.close('cancel')),
        button('Guardar', () => dialog.close('ok'), { class: 'fd-btn is-primary' })));
    form.addEventListener('submit', (event) => { event.preventDefault(); dialog.close('ok'); });
    dialog.addEventListener('close', () => { dialog.remove(); resolve(dialog.returnValue); });
    document.body.append(dialog);
    dialog.showModal();
    input.select();
  });
  const text = input.value.trim();
  return result === 'ok' && text ? text : null;
}

let toastTimer;
/** Aviso breve abajo de la pantalla, leído por lectores de pantalla. */
export function toast(message) {
  let el = document.querySelector('.fd-toast');
  if (!el) {
    el = h('div', { class: 'fd-toast ph-no-capture', role: 'status', 'aria-live': 'polite' });
    document.body.append(el);
  }
  el.textContent = message;
  el.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-on'), 3200);
}

/** Abre el selector de archivos del sistema. */
export function pickFiles(accept, multiple = false) {
  return new Promise((resolve) => {
    const input = h('input', { type: 'file', accept, multiple });
    input.addEventListener('change', () => resolve([...input.files]));
    input.addEventListener('cancel', () => resolve([]));
    input.click();
  });
}

/**
 * Menú desplegable simple anclado a un botón. Con `text`, el botón muestra ese texto en vez de los tres puntos.
 * `extra` es contenido que va al final del menú (por ejemplo un interruptor).
 */
/**
 * `up` abre el menú hacia arriba (para la barra de abajo). Cada opción puede llevar `hint`, una línea de ayuda;
 * `checked`, para marcar la elegida de un grupo; y `mark` con `markLabel`, una marca al costado (por ejemplo ✓).
 */
export function menu(anchorLabel, items, { text, extra, up = false } = {}) {
  const panel = h('div', { class: 'fd-menu-panel', role: 'menu', hidden: true },
    items.filter(Boolean).map((item) => h('button', {
      type: 'button', role: item.checked == null ? 'menuitem' : 'menuitemradio', 'aria-checked': item.checked == null ? undefined : String(item.checked),
      class: item.danger ? 'is-danger' : undefined,
      onclick: () => { close(); item.action(); },
    }, item.icon ? icon(item.icon) : null, item.hint
      ? h('span', { class: 'fd-menu-item' }, h('span', { text: item.label }), h('small', { text: item.hint }))
      : item.label,
    item.mark ? [h('span', { class: 'fd-menu-mark', 'aria-hidden': 'true', text: item.mark }), h('span', { class: 'fd-visually-hidden', text: item.markLabel })] : null)),
    extra ?? null);
  const trigger = text
    ? h('button', { type: 'button', class: 'fd-btn fd-menu-text', 'aria-haspopup': 'menu', 'aria-expanded': 'false' }, text)
    : h('button', { type: 'button', class: 'fd-icon-btn', 'aria-label': anchorLabel, 'aria-haspopup': 'menu', 'aria-expanded': 'false' },
      h('span', { class: 'fd-dots', 'aria-hidden': 'true' }));
  const wrap = h('div', { class: up ? 'fd-menu is-up' : 'fd-menu' }, trigger, panel);
  const outside = (event) => { if (!wrap.contains(event.target)) close(); };
  function close() {
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('pointerdown', outside);
  }
  trigger.addEventListener('click', () => {
    if (!panel.hidden) return close();
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    document.addEventListener('pointerdown', outside);
  });
  wrap.addEventListener('keydown', (event) => { if (event.key === 'Escape') { close(); trigger.focus(); } });
  return wrap;
}

const ICONS = {
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7c1.7 0 3.2-.5 4.5-1.2"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M12 12v5M9.5 14.5 12 17l2.5-2.5"/>',
  play: '<path d="M8 5v14l11-7z"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="M13.5 6.5l4 4"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
  redo: '<path d="m15 14 5-5-5-5"/><path d="M20 9H9a5 5 0 0 0 0 10h3"/>',
  minus: '<path d="M5 12h14"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  fit: '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>',
  panel: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M15 4v16"/>',
  paste: '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>',
  pen: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  share: '<path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>',
  shuffle: '<path d="M16 4h4v4M20 4l-6.5 6.5M4 20l6-6M16 20h4v-4M20 20 4 4"/>',
  chevronDown: '<path d="M6 9l6 6 6-6"/>',
};

/** Ícono de trazo, del tamaño del texto que lo rodea. */
export function icon(name) {
  const span = document.createElement('span');
  span.className = 'fd-ico';
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML = `<svg viewBox="0 0 24 24">${ICONS[name]}</svg>`;
  return span;
}
