/**
 * El armador del mensaje de emergencia (/ingles/emergencias).
 * buildMessage es lógica pura (la usan los tests); mountEmergency conecta la cinta y el armador con la página.
 */
import { composeMessage, emergencyIntentions, emergencyLevels, emergencyNatures } from '../data/english-emergency.js';

/**
 * Arma el mensaje en el orden de la norma. Devuelve { text, say, parts } y no toca el DOM.
 * level y nature son obligatorios, y la naturaleza tiene que corresponder al nivel.
 */
export const buildMessage = ({ level, station = '', callsign = '', nature, intention, position, extra = '' } = {}) => {
  if (!level || !emergencyLevels.some((entry) => entry.id === level)) {
    throw new Error(`Falta el nivel o no existe: "${level ?? ''}". Usá mayday o panpan.`);
  }
  const found = emergencyNatures.find((entry) => entry.id === nature);
  if (!nature || !found) throw new Error(`Falta la naturaleza o no existe: "${nature ?? ''}".`);
  if (!found.levels.includes(level)) throw new Error(`La naturaleza "${nature}" no corresponde al nivel ${level}.`);
  const plan = emergencyIntentions.find((entry) => entry.id === intention);
  if (plan && !plan.levels.includes(level)) throw new Error(`La intención "${intention}" no corresponde al nivel ${level}.`);
  return composeMessage({ level, station, callsign, nature, intention, position, extra });
};

const el = (tag, props = {}, text = '') => {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([name, value]) => node.setAttribute(name, value));
  node.textContent = text;
  return node;
};

/** La cinta: un grupo de radios, una pieza a la vez. Sin JavaScript se ven todas. */
const mountRibbon = (root) => {
  const radios = [...root.querySelectorAll('[data-em-piece-pick]')];
  const panels = [...root.querySelectorAll('[data-em-panel]')];
  const chunks = [...root.querySelectorAll('[data-em-chunk]')];
  const select = (id) => {
    panels.forEach((panel) => { panel.hidden = panel.dataset.emPanel !== id; });
    chunks.forEach((chunk) => chunk.classList.toggle('is-on', chunk.dataset.emChunk === id));
  };
  radios.forEach((radio) => radio.addEventListener('change', () => { if (radio.checked) select(radio.value); }));
  select(radios.find((radio) => radio.checked)?.value ?? 'signal');
};

/** El armador: radios nativos (teclado y toque), el mensaje en una región aria-live y el botón de audio. */
const mountBuilder = (root) => {
  const form = root.querySelector('[data-em-form]');
  const output = root.querySelector('[data-em-output]');
  const play = root.querySelector('[data-em-play]');
  const notes = [...root.querySelectorAll('[data-em-note]')];
  if (!form || !output) return;
  const picked = (name) => form.querySelector(`input[name="${name}"]:checked`)?.value;

  /* Las opciones que no van con el nivel elegido (data-levels) quedan desactivadas. */
  const syncLevels = (name) => {
    const level = picked('em-level');
    const inputs = [...form.querySelectorAll(`input[name="${name}"]`)];
    inputs.forEach((input) => {
      const fits = input.dataset.levels.split(' ').includes(level);
      input.disabled = !fits;
      input.closest('label')?.classList.toggle('is-off', !fits);
    });
    const current = inputs.find((input) => input.checked);
    if (!current || current.disabled) {
      const first = inputs.find((input) => !input.disabled);
      if (first) first.checked = true;
    }
  };

  const render = () => {
    syncLevels('em-nature');
    syncLevels('em-intention');
    const extra = form.querySelector('input[name="em-extra"]')?.checked ? form.dataset.extra : '';
    const message = buildMessage({
      level: picked('em-level'),
      station: form.dataset.station,
      callsign: form.dataset.callsign,
      nature: picked('em-nature'),
      intention: picked('em-intention'),
      position: picked('em-position'),
      extra,
    });
    const line = el('p', { lang: 'en' });
    message.parts.forEach((part, index) => {
      line.append(el('span', { class: 'em-chunk', 'data-em-tone': part.id }, part.text));
      line.append(index < message.parts.length - 1 ? ', ' : '.');
    });
    output.replaceChildren(line);
    if (play) play.dataset.say = message.say;
    /* La aclaración de la naturaleza elegida, si tiene. */
    notes.forEach((entry) => { entry.hidden = entry.dataset.emNote !== picked('em-nature'); });
  };

  form.addEventListener('change', render);
  form.addEventListener('submit', (event) => event.preventDefault());
  render();
};

export const mountEmergency = () => {
  const ribbon = document.querySelector('[data-em-ribbon]');
  if (ribbon) mountRibbon(ribbon);
  const builder = document.querySelector('[data-em-builder]');
  if (builder) mountBuilder(builder);
};
