/** Arranque de la Bitácora: abre el guardado, sigue el # de la dirección y dibuja la pestaña. */
import { openStore } from './store.js';
import { h, toast } from './ui.js';
import { renderSummary } from './screens/summary.js';
import { renderFlights } from './screens/flights.js';
import { renderAircraft } from './screens/aircraft.js';
import { renderDocuments } from './screens/documents.js';
import { renderPlans } from './screens/plans.js';
import { renderNotam } from './screens/notam.js';
import { renderTools } from './screens/tools.js';
import { renderCv } from './screens/cv.js';

export const TABS = [
  { id: 'resumen', label: 'Resumen', render: renderSummary },
  { id: 'vuelos', label: 'Vuelos', render: renderFlights },
  { id: 'aeronaves', label: 'Aeronaves', render: renderAircraft },
  { id: 'documentos', label: 'Documentos', render: renderDocuments },
  { id: 'plan', label: 'Plan de vuelo', render: renderPlans },
  { id: 'notam', label: 'NOTAM', render: renderNotam },
  { id: 'calculos', label: 'Cálculos', render: renderTools },
  { id: 'cv', label: 'CV', render: renderCv },
];

/** Solo nombres de evento y números: nunca datos de vuelos, documentos ni personas. */
export function track(event, props) {
  try { window.posthog?.capture(event, props); } catch { /* La analítica no frena la app. */ }
}

const parseHash = () => {
  const [tab, ...rest] = location.hash.replace(/^#/, '').split('/');
  return { tab: TABS.some((item) => item.id === tab) ? tab : 'resumen', param: rest.length ? decodeURIComponent(rest.join('/')) : '' };
};

async function start() {
  const app = document.getElementById('bitacora');
  const tabs = app.querySelector('[data-tabs]');
  const root = app.querySelector('[data-root]');
  let store;
  try {
    store = await openStore();
  } catch {
    root.replaceChildren(h('p', { class: 'bt-empty', text: 'Este navegador no deja guardar datos en el dispositivo, y la Bitácora los necesita. Probá fuera del modo privado.' }));
    return;
  }
  // Que el navegador no borre los datos por falta de espacio. Se pide una sola vez.
  if (navigator.storage?.persist && !(await store.getMeta('persistAsked'))) {
    store.setMeta('persistAsked', true);
    navigator.storage.persist().catch(() => {});
  }

  tabs.replaceChildren(...TABS.map((tab) => h('a', { href: `#${tab.id}`, 'data-tab': tab.id, text: tab.label })));

  let cleanup = null;
  let shown = '';
  const go = (tab, param) => { location.hash = param ? `${tab}/${encodeURIComponent(param)}` : tab; };
  const ctx = { store, go, track, refresh: () => show(true) };

  async function show(force = false) {
    const { tab, param } = parseHash();
    const key = `${tab}/${param}`;
    if (key === shown && !force) return;
    shown = key;
    for (const link of tabs.querySelectorAll('a')) {
      if (link.dataset.tab === tab) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
    // Solo la barra se corre de costado para mostrar la pestaña actual; la página no se mueve.
    const currentTab = tabs.querySelector('[aria-current]');
    if (currentTab && tabs.scrollWidth > tabs.clientWidth) tabs.scrollLeft = currentTab.offsetLeft - 8;
    cleanup?.();
    cleanup = null;
    const view = h('div', { class: 'bt-view' });
    root.replaceChildren(view);
    try {
      cleanup = (await TABS.find((item) => item.id === tab).render(view, ctx, param)) ?? null;
    } catch (error) {
      console.error(error);
      toast('Algo falló al abrir la pestaña.');
    }
  }

  window.addEventListener('hashchange', () => show());
  show();
}

start();
