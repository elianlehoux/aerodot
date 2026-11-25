/**
 * Guía de uso: cuatro tarjetas con un dibujo y dos renglones. Se abre sola la primera vez
 * (meta `guideSeen`) y después desde "Cómo se usa".
 */
import { button, h } from '../ui.js';

// Dibujos propios, en los colores de la app (clases en flowdot.css).
const ART = {
  cabina: `
    <rect class="g-card" x="40" y="18" width="240" height="124" rx="14"/>
    <rect class="g-panel" x="56" y="34" width="208" height="64" rx="8"/>
    <circle class="g-gauge" cx="84" cy="66" r="15"/><circle class="g-gauge" cx="124" cy="66" r="15"/>
    <circle class="g-gauge" cx="196" cy="66" r="15"/><circle class="g-gauge" cx="236" cy="66" r="15"/>
    <rect class="g-gauge" x="148" y="48" width="24" height="36" rx="4"/>
    <path class="g-line" d="M84 66l8-7M124 66l-6-9M196 66l9 4M236 66l-3-10"/>
    <rect class="g-panel" x="120" y="108" width="80" height="22" rx="6"/>
    <circle class="g-acc" cx="270" cy="30" r="20"/>
    <path class="g-acc-ink" d="M270 40V21M262 28l8-8 8 8"/>`,
  flujo: `
    <rect class="g-card" x="18" y="22" width="132" height="116" rx="12"/>
    <path class="g-text" d="M32 46h40M32 76h52M32 106h34"/>
    <path class="g-lead" d="M78 46h30M90 76h18M72 106h36"/>
    <path class="g-text" d="M114 46h22M114 76h22M114 106h22"/>
    <path class="g-route" d="M196 116 C214 72 232 60 250 54 S286 76 292 112"/>
    <circle class="g-acc" cx="196" cy="116" r="13"/><text class="g-num" x="196" y="116">1</text>
    <circle class="g-acc" cx="250" cy="54" r="13"/><text class="g-num" x="250" y="54">2</text>
    <circle class="g-ring" cx="292" cy="112" r="19"/>
    <circle class="g-acc" cx="292" cy="112" r="13"/><text class="g-num" x="292" y="112">3</text>
    <path class="g-arrow" d="M156 80h24M172 72l8 8-8 8"/>`,
  escalones: `
    <rect class="g-step" x="20" y="112" width="66" height="30" rx="6"/>
    <rect class="g-step" x="90" y="88" width="66" height="54" rx="6"/>
    <rect class="g-step" x="160" y="64" width="66" height="78" rx="6"/>
    <rect class="g-acc" x="230" y="40" width="70" height="102" rx="6"/>
    <text class="g-label" x="53" y="102">Mirar</text>
    <text class="g-label" x="123" y="78">Con la lista</text>
    <text class="g-label" x="193" y="54">De memoria</text>
    <text class="g-label is-acc" x="265" y="30">Simulador</text>
    <text class="g-big" x="265" y="94">92</text>`,
  avance: `
    <rect class="g-card" x="30" y="22" width="260" height="52" rx="12"/>
    <path class="g-text" d="M48 42h120"/>
    <text class="g-small" x="48" y="62">De memoria ✓</text>
    <rect class="g-pill" x="196" y="36" width="78" height="22" rx="11"/>
    <text class="g-pill-text" x="235" y="47">Repasar hoy</text>
    <rect class="g-card" x="30" y="86" width="260" height="52" rx="12"/>
    <path class="g-text" d="M48 106h96"/>
    <text class="g-small" x="48" y="126">Simulador ✓</text>
    <text class="g-score" x="268" y="112">92</text>`,
};

const CARDS = [
  { art: 'cabina', title: 'Tu cabina', text: 'Subí una foto o un PDF de tu cabina. Si querés probar primero, abrí la cabina de prueba.' },
  { art: 'flujo', title: 'Tu flujo', text: 'Pegá la checklist de tu empresa y tocá dónde va cada ítem. Hacé un flujo por asiento: el del capitán y el del copiloto van aparte.' },
  { art: 'escalones', title: 'Practicá en escalones', text: 'Mirá la ruta, repasá con la lista a la vista, después de memoria y al final como en el simulador: con reloj y nota.' },
  { art: 'avance', title: 'Tu avance', text: 'Cada flujo guarda tu mejor marca por escalón. En tus cabinas ves cuál conviene repasar hoy.' },
];

/** Muestra la guía. Se resuelve al cerrarla (Saltar, Empezar o Esc). */
export function showGuide() {
  return new Promise((resolve) => {
    let at = 0;
    const art = h('div', { class: 'fd-guide-art', 'aria-hidden': 'true' });
    const title = h('h2', { id: 'fd-guide-title' });
    const text = h('p');
    const count = h('p', { class: 'fd-guide-count' });
    const dots = h('div', { class: 'fd-guide-dots', 'aria-hidden': 'true' }, CARDS.map(() => h('span')));
    const skip = button('Saltar', () => dialog.close(), { class: 'fd-btn is-quiet fd-guide-skip' });
    const prev = button('Anterior', () => show(at - 1), { class: 'fd-btn' });
    const next = button('Siguiente', () => (at === CARDS.length - 1 ? dialog.close() : show(at + 1)), { class: 'fd-btn is-primary' });
    const dialog = h('dialog', { class: 'fd-dialog fd-guide ph-no-capture', 'aria-labelledby': 'fd-guide-title' },
      art, h('div', { class: 'fd-guide-body', 'aria-live': 'polite' }, count, title, text), dots,
      h('div', { class: 'fd-dialog-actions' }, skip, prev, next));

    function show(index) {
      at = Math.max(0, Math.min(CARDS.length - 1, index));
      const card = CARDS[at];
      art.innerHTML = `<svg viewBox="0 0 320 160">${ART[card.art]}</svg>`;
      count.textContent = `${at + 1} de ${CARDS.length}`;
      title.textContent = card.title;
      text.textContent = card.text;
      [...dots.children].forEach((dot, i) => dot.classList.toggle('is-on', i === at));
      prev.disabled = at === 0;
      skip.hidden = at === CARDS.length - 1;
      next.textContent = at === CARDS.length - 1 ? 'Empezar' : 'Siguiente';
      if (document.activeElement !== next) next.focus();
    }

    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); show(at + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); show(at - 1); }
    });
    dialog.addEventListener('close', () => { dialog.remove(); resolve(); });
    document.body.append(dialog);
    dialog.showModal();
    show(0);
  });
}

/** La primera vez que se abre Flowdot en este dispositivo, muestra la guía. */
export async function maybeShowGuide(store) {
  const seen = await store.getMeta('guideSeen').catch(() => true);
  if (seen) return;
  await store.setMeta('guideSeen', Date.now()).catch(() => {});
  await showGuide();
}
