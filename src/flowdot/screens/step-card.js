/**
 * Tarjeta de un paso en Editar: nombre, acción y crítico, junto al paso en la foto.
 * En pantallas angostas el CSS la vuelve una hoja abajo del escenario.
 */
import { h } from '../ui.js';
import { MAX_LABEL } from '../flow.js';
import { MAX_NOTE_TEXT } from '../notes.js';

const GAP = 18;
const MARGIN = 12;
const clamp = (n, min, max) => Math.max(min, Math.min(n, max));

/**
 * Dónde va la tarjeta, en px del escenario: del lado del paso con más lugar,
 * centrada en alto con el paso y sin salir del escenario. `anchor.rx` es el medio ancho
 * de lo que se edita (una flecha), para no taparlo.
 */
export function placeCard(anchor, card, stage) {
  const rx = anchor.rx ?? 0;
  const side = stage.width - anchor.x >= anchor.x ? 'right' : 'left';
  const left = side === 'right' ? anchor.x + rx + GAP : anchor.x - rx - GAP - card.width;
  return {
    side,
    left: clamp(left, MARGIN, stage.width - MARGIN - card.width),
    top: clamp(anchor.y - card.height / 2, MARGIN, stage.height - MARGIN - card.height),
  };
}

/**
 * `onChange(changes, { live })`: `live` mientras se escribe (solo guardar), sin `live` al terminar (entra al historial).
 */
export function createStepCard({ onChange, onDelete, onClose, onPrev, onNext }) {
  const num = h('span', { class: 'fd-step-num' });
  const prev = h('button', { type: 'button', class: 'fd-card-nav', 'aria-label': 'Paso anterior', onclick: onPrev }, '‹');
  const next = h('button', { type: 'button', class: 'fd-card-nav', 'aria-label': 'Paso siguiente', onclick: onNext }, '›');
  const name = h('input', { class: 'fd-card-name fd-card-field', type: 'text', maxlength: MAX_LABEL, placeholder: 'Nombre del control', 'aria-label': 'Nombre del paso' });
  const action = h('input', { class: 'fd-card-input fd-card-field', type: 'text', maxlength: MAX_LABEL, placeholder: 'Por ejemplo ON, SET, 1+F', 'aria-label': 'Acción' });
  const critical = h('input', { type: 'checkbox', class: 'fd-switch fd-switch-warn' });
  const el = h('div', { class: 'fd-card ph-no-capture', role: 'group', 'aria-label': 'Paso', hidden: true },
    h('div', { class: 'fd-card-head' }, num, name, h('div', { class: 'fd-card-navs' }, prev, next)),
    h('label', { class: 'fd-card-row' }, h('span', { class: 'fd-card-label', text: 'Acción' }), action),
    h('label', { class: 'fd-card-toggle' }, h('span', {}, h('span', { class: 'fd-warn', 'aria-hidden': 'true', text: '!' }), ' Paso crítico'), critical),
    h('div', { class: 'fd-card-foot' },
      h('button', { type: 'button', class: 'fd-link is-danger', onclick: onDelete }, 'Borrar'),
      h('button', { type: 'button', class: 'fd-btn is-primary', onclick: onClose }, 'Listo')));

  name.addEventListener('input', () => onChange({ label: name.value }, { live: true }));
  name.addEventListener('change', () => onChange({ label: name.value }, {}));
  action.addEventListener('input', () => onChange({ action: action.value }, { live: true }));
  action.addEventListener('change', () => onChange({ action: action.value }, {}));
  critical.addEventListener('change', () => onChange({ critical: critical.checked }, {}));
  name.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); action.focus(); action.select(); } });
  action.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); action.blur(); onClose(); } });
  el.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    document.activeElement?.blur?.();
    onClose();
  });

  return {
    el,
    show(step, index, total) {
      num.textContent = String(index + 1);
      el.setAttribute('aria-label', `Paso ${index + 1}`);
      name.placeholder = `Paso ${index + 1}`;
      if (document.activeElement !== name) name.value = step.label;
      if (document.activeElement !== action) action.value = step.action ?? '';
      critical.checked = step.critical === true;
      el.classList.toggle('is-critical', step.critical === true);
      prev.disabled = index === 0;
      next.disabled = index >= total - 1;
      el.hidden = false;
    },
    hide() { el.hidden = true; },
    isOpen: () => !el.hidden,
    focusName() { name.focus({ preventScroll: true }); name.select(); },
    contains: (node) => el.contains(node),
  };
}

/**
 * Tarjeta chica de una marca (Anotar): el texto si es una etiqueta, cómo se mueve, Borrar y Listo.
 * `onText(text, { live })` como `onChange` de la tarjeta del paso.
 */
export function createNoteCard({ onText, onDelete, onClose }) {
  const title = h('strong', { class: 'fd-card-title' });
  const text = h('input', { class: 'fd-card-input fd-card-field', type: 'text', maxlength: MAX_NOTE_TEXT, placeholder: 'Overhead, Pedestal', 'aria-label': 'Texto de la etiqueta' });
  const textRow = h('label', { class: 'fd-card-row' }, h('span', { class: 'fd-card-label', text: 'Texto' }), text);
  const hint = h('p', { class: 'fd-card-hint' });
  const el = h('div', { class: 'fd-card fd-card-note ph-no-capture', role: 'group', 'aria-label': 'Marca', hidden: true },
    title, textRow, hint,
    h('div', { class: 'fd-card-foot' },
      h('button', { type: 'button', class: 'fd-link is-danger', onclick: onDelete }, 'Borrar'),
      h('button', { type: 'button', class: 'fd-btn is-primary', onclick: onClose }, 'Listo')));

  text.addEventListener('input', () => onText(text.value, { live: true }));
  text.addEventListener('change', () => onText(text.value, {}));
  text.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); text.blur(); onClose(); } });
  el.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    document.activeElement?.blur?.();
    onClose();
  });

  return {
    el,
    show(note) {
      const label = note.type === 'label';
      title.textContent = label ? 'Etiqueta de zona' : 'Flecha';
      textRow.hidden = !label;
      if (label && document.activeElement !== text) text.value = note.text;
      hint.textContent = label ? 'Arrastrala para moverla.' : 'Arrastrá las puntas para moverla y el puntito del medio para arquearla.';
      el.hidden = false;
    },
    hide() { el.hidden = true; },
  };
}
