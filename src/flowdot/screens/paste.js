/**
 * Diálogo para pegar una lista de texto (de la checklist o del manual de la empresa).
 * Muestra en vivo cómo se entendió cada renglón y devuelve los ítems y su destino.
 */
import { button, h } from '../ui.js';
import { parseChecklist } from '../checklist.js';

const PREVIEW = 8;
const EXAMPLE = 'PARKING BRAKE ........ SET\nBEACON ........ ON\nFLAPS ........ 5';

/** Devuelve `{ target: 'steps' | 'checklist', items }` o null si se cancela. */
export function askPaste() {
  return new Promise((resolve) => {
    const text = h('textarea', { class: 'fd-input fd-paste-text', rows: 10, placeholder: EXAMPLE, 'aria-label': 'Lista para pegar', spellcheck: 'false' });
    const radio = (value, label, hint, checked) => h('label', { class: 'fd-paste-option' },
      h('input', { type: 'radio', name: 'fd-paste-target', value, checked }),
      h('span', {}, h('strong', { text: label }), h('small', { text: hint })));
    const targets = h('fieldset', { class: 'fd-paste-targets' },
      h('legend', { class: 'fd-visually-hidden', text: 'Dónde va la lista' }),
      radio('steps', 'Pasos del flujo', 'Después tocás dónde va cada uno en la cabina.', true),
      radio('checklist', 'Checklist de verificación', 'La que se lee al terminar el flujo. Se repasa en el Simulador.', false));
    const preview = h('ol', { class: 'fd-paste-preview', 'aria-live': 'polite' });
    const add = button('Agregar', () => close('ok'), { class: 'fd-btn is-primary', disabled: true });
    const dialog = h('dialog', { class: 'fd-dialog fd-paste ph-no-capture' },
      h('h2', { text: 'Pegar una lista' }),
      h('p', { text: 'Un ítem por renglón. Si el renglón trae la acción separada por puntos, guion o tabulación, queda aparte.' }),
      text, targets, preview,
      h('div', { class: 'fd-dialog-actions' }, button('Cancelar', () => close('cancel')), add));
    let items = [];
    const render = () => {
      items = parseChecklist(text.value);
      const rows = items.slice(0, PREVIEW).map((item) => h('li', {},
        h('span', { class: 'fd-check-name', text: item.label }),
        item.action ? [h('i', { class: 'fd-check-lead', 'aria-hidden': 'true' }), h('b', { class: 'fd-check-action', text: item.action })] : null));
      if (items.length > PREVIEW) rows.push(h('li', { class: 'fd-paste-more', text: `y ${items.length - PREVIEW} más` }));
      preview.replaceChildren(...rows);
      add.disabled = items.length === 0;
      add.textContent = items.length ? `Agregar ${items.length}` : 'Agregar';
    };
    function close(value) { dialog.close(value); }
    text.addEventListener('input', render);
    dialog.addEventListener('close', () => {
      const target = targets.querySelector('input:checked')?.value ?? 'steps';
      dialog.remove();
      resolve(dialog.returnValue === 'ok' && items.length ? { target, items } : null);
    });
    document.body.append(dialog);
    dialog.showModal();
    text.focus();
  });
}
