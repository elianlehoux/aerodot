/** Arranque de Flowdot: abre el guardado, sigue el # de la dirección y monta la pantalla. */
import { openStore } from './store.js';
import { formatRoute, parseRoute } from './route.js';
import { mountList } from './screens/list.js';
import { mountEditor } from './screens/editor.js';
import { createIo } from './export.js';
import { toast } from './ui.js';

/** Solo nombres de evento y números: nunca nombres de pasos, flujos ni cabinas. */
export function track(event, props) {
  try { window.posthog?.capture(event, props); } catch { /* La analítica no frena la app. */ }
}

async function start() {
  const app = document.getElementById('flowdot');
  const root = app.querySelector('[data-root]');
  const actions = app.querySelector('[data-bar-actions]');
  let store;
  try {
    store = await openStore();
  } catch {
    root.textContent = 'Este navegador no deja guardar datos en el dispositivo, y Flowdot los necesita. Probá fuera del modo privado.';
    return;
  }

  // La pantalla montada: `key` identifica el flujo, así cambiar de modo no vuelve a cargar la cabina.
  let current = { key: null, api: { unmount() {} } };
  const setActions = (nodes) => actions.replaceChildren(...nodes);
  const go = (route) => { location.hash = formatRoute(route); };
  const io = createIo({ store, track });
  const ctx = { store, go, io, track, setActions, remount: () => { current.key = null; show(); } };

  async function show() {
    const route = parseRoute(location.hash);
    const key = route.screen === 'flow' ? `${route.cabinId}/${route.flowId}` : 'list';
    if (key === current.key && current.api.setMode) {
      current.api.setMode(route.mode);
      return;
    }
    await current.api.unmount();
    setActions([]);
    app.dataset.screen = route.screen;
    if (route.screen === 'flow') {
      current = { key, api: await mountEditor(root, ctx, route) };
    } else {
      current = { key, api: { unmount: mountList(root, ctx) } };
    }
  }

  window.addEventListener('hashchange', show);
  // Soltar archivos .flowdot en cualquier parte de la página los importa.
  app.addEventListener('dragover', (event) => { if (event.dataTransfer?.types.includes('Files')) event.preventDefault(); });
  app.addEventListener('drop', (event) => {
    const files = [...(event.dataTransfer?.files ?? [])].filter((file) => file.name.endsWith('.flowdot'));
    if (!files.length) return;
    event.preventDefault();
    io.importFiles(files).then(() => { if (parseRoute(location.hash).screen === 'list') show(); });
  });
  show().catch(() => toast('Algo falló al abrir la pantalla.'));
}

start();
