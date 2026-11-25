/** Pantalla de inicio de Flowdot: cabinas con sus flujos, subir una cabina, importar y copia. */
import { requestPersist } from '../store.js';
import { pdfPages, prepareImage } from '../image.js';
import { ask, askText, button, h, icon, menu, pickFiles, toast } from '../ui.js';
import { BUNDLED, bundledMissing, isBundled } from '../bundled.js';
import { LEVELS, LEVEL_LABELS, needsReview, passedLevel, progressKey } from '../progress.js';
import { maybeShowGuide, showGuide } from './guide.js';

const MONTH = 30 * 24 * 60 * 60 * 1000;
export const ACCEPT_CABIN = 'image/jpeg,image/png,image/webp,application/pdf';
export const UNNAMED_CABIN = 'Cabina sin nombre';

export const newFlow = (cabinId, name) => {
  const now = Date.now();
  return { id: crypto.randomUUID(), cabinId, name, steps: [], createdAt: now, updatedAt: now };
};

function choosePdfPage(pages) {
  return new Promise((resolve) => {
    const grid = h('div', { class: 'fd-pages' });
    const dialog = h('dialog', { class: 'fd-dialog' }, h('h2', { text: 'Elegí la página de la cabina' }), grid,
      h('div', { class: 'fd-dialog-actions' }, button('Cancelar', () => dialog.close('cancel'))));
    for (let index = 0; index < pages.count; index += 1) {
      const img = h('img', { alt: `Página ${index + 1}` });
      grid.append(h('button', { type: 'button', class: 'fd-page', onclick: () => dialog.close(String(index)) }, img, h('span', { text: String(index + 1) })));
      pages.thumbnail(index).then((blob) => { img.src = URL.createObjectURL(blob); }).catch(() => {});
    }
    dialog.addEventListener('close', () => {
      grid.querySelectorAll('img').forEach((img) => img.src && URL.revokeObjectURL(img.src));
      dialog.remove();
      resolve(dialog.returnValue === 'cancel' || dialog.returnValue === '' ? null : Number(dialog.returnValue));
    });
    document.body.append(dialog);
    dialog.showModal();
  });
}

/** Pide una foto o un PDF y devuelve la imagen lista para guardar, o null. */
export async function pickCabinImage() {
  const [file] = await pickFiles(ACCEPT_CABIN);
  if (!file) return null;
  try {
    if (file.type === 'application/pdf') {
      toast('Abriendo el PDF…');
      const pages = await pdfPages(file);
      const index = pages.count === 1 ? 0 : await choosePdfPage(pages);
      return index === null ? null : await pages.render(index);
    }
    return await prepareImage(file);
  } catch (error) {
    toast(error.message || 'No se pudo abrir el archivo.');
    return null;
  }
}

export function mountList(root, ctx) {
  const { store, go, io, track, setActions } = ctx;
  let alive = true;
  let photoUrls = [];
  const releasePhotos = () => { photoUrls.forEach((url) => URL.revokeObjectURL(url)); photoUrls = []; };
  const photoUrl = (cabin) => {
    const url = URL.createObjectURL(cabin.image.blob);
    photoUrls.push(url);
    return url;
  };
  const flowHref = (cabin, flow, mode) => `#c/${encodeURIComponent(cabin.id)}/f/${encodeURIComponent(flow.id)}/${mode}`;

  /** Una acción que guarda: si el navegador no deja, avisa en vez de no hacer nada. */
  const safe = (fn) => async (...args) => {
    try {
      await fn(...args);
    } catch {
      toast('No se pudo guardar en este dispositivo.');
    }
  };

  async function createCabin() {
    const image = await pickCabinImage();
    if (!image) return;
    const now = Date.now();
    const cabin = { id: crypto.randomUUID(), name: UNNAMED_CABIN, image, createdAt: now, updatedAt: now };
    const flow = newFlow(cabin.id, 'Flujo 1');
    try {
      await store.putCabin(cabin);
      await store.putFlow(flow);
    } catch {
      toast('No se pudo guardar en este dispositivo.');
      return;
    }
    track('flowdot_cabin_created');
    track('flowdot_flow_created');
    requestPersist(store).catch(() => {});
    go({ screen: 'flow', cabinId: cabin.id, flowId: flow.id, mode: 'editar' });
  }

  const addFlow = safe(async function addFlow(cabin, count) {
    const name = await askText({ title: 'Nombre del flujo', value: `Flujo ${count + 1}`, label: 'Nombre del flujo' });
    if (!name) return;
    const flow = newFlow(cabin.id, name);
    await store.putFlow(flow);
    track('flowdot_flow_created');
    go({ screen: 'flow', cabinId: cabin.id, flowId: flow.id, mode: 'editar' });
  });

  const renameCabin = safe(async function renameCabin(cabin) {
    const name = await askText({ title: 'Nombre de la cabina', value: cabin.name, label: 'Nombre de la cabina' });
    if (!name) return;
    await store.putCabin({ ...cabin, name, updatedAt: Date.now() });
    render();
  });

  const replaceImage = safe(async function replaceImage(cabin) {
    const ok = await ask({
      title: 'Cambiar la foto',
      text: 'Los pasos se conservan. Si la foto nueva tiene otro encuadre, los puntos pueden quedar corridos.',
      actions: [{ label: 'Cancelar', value: 'cancel' }, { label: 'Elegir foto', value: 'ok', primary: true }],
    });
    if (!ok) return;
    const image = await pickCabinImage();
    if (!image) return;
    await store.putCabin({ ...cabin, image, updatedAt: Date.now() });
    render();
  });

  // Las cabinas de prueba no se borran: se ocultan y se pueden volver a mostrar desde el pie.
  const hideCabin = safe(async function hideCabin(cabin) {
    const ok = await ask({
      title: `Ocultar «${cabin.name}»`,
      text: 'Es una cabina de prueba: deja de verse en la lista. Podés volver a mostrarla desde el pie de la página.',
      actions: [{ label: 'Cancelar', value: 'cancel' }, { label: 'Ocultar', value: 'ok', primary: true }],
    });
    if (!ok) return;
    await store.putCabin({ ...cabin, hidden: true, updatedAt: Date.now() });
    render();
  });

  const removeCabin = safe(async function removeCabin(cabin, flows) {
    const count = flows.length;
    const ok = await ask({
      title: `Borrar «${cabin.name}»`,
      text: count === 1 ? 'Se borra la cabina y su flujo. No se puede deshacer.' : `Se borra la cabina y sus ${count} flujos. No se puede deshacer.`,
      actions: [{ label: 'Cancelar', value: 'cancel' }, { label: 'Borrar', value: 'ok', danger: true }],
    });
    if (!ok) return;
    await store.deleteCabin(cabin.id);
    render();
  });

  const seeded = io.seedBundled();

  /** El escalón logrado más alto (o la mejor marca, o "Sin practicar") y si conviene repasar hoy. */
  function progressLine(progress, stepCount) {
    const passed = passedLevel(progress);
    const tried = LEVELS.filter((level) => progress?.levels?.[level]).at(-1);
    const text = passed ? `${LEVEL_LABELS[passed]} ✓`
      : tried ? `${LEVEL_LABELS[tried]}: ${Math.round(progress.levels[tried].best.ratio * 100)} %` : 'Sin practicar';
    return h('span', { class: 'fd-flow-progress' }, h('span', { class: passed ? 'is-passed' : '', text }),
      tried && needsReview(progress, Date.now(), stepCount) ? h('span', { class: 'fd-review-today', text: 'Repasar hoy' }) : null);
  }

  async function render() {
    await seeded;
    const stored = await store.listCabins();
    const cabins = stored.filter((cabin) => !cabin.hidden);
    const missing = bundledMissing(stored);
    const groups = await Promise.all(cabins.map(async (cabin) => ({ cabin, flows: await store.listFlows(cabin.id) })));
    const progress = new Map(await Promise.all(groups.flatMap(({ flows }) => flows.map(async (flow) => (
      [flow.id, await store.getMeta(progressKey(flow.id)).catch(() => undefined)])))));
    if (!alive) return;

    setActions(cabins.length ? [
      button('Importar', () => io.importPicked(render)),
      button('Nueva cabina', createCabin, { class: 'fd-btn is-primary' }),
    ] : []);

    if (!cabins.length) {
      releasePhotos();
      root.replaceChildren(h('section', { class: 'fd-empty' },
        h('h1', { text: 'Tus flujos de cabina, en tu dispositivo.' }),
        h('p', { text: 'Subí la foto de tu cabina, marcá los controles en orden y repasalos de memoria.' }),
        button('Subí la foto de tu cabina', createCabin, { class: 'fd-btn is-primary is-big' }),
        h('button', { type: 'button', class: 'fd-link', onclick: () => io.importPicked(render) }, 'o importá un archivo .flowdot'),
        h('button', { type: 'button', class: 'fd-link', onclick: () => showGuide() }, 'Cómo se usa'),
        h('div', { class: 'fd-example' },
          button(BUNDLED.length === 1 ? 'Probar con la cabina de prueba' : 'Probar con las cabinas de prueba', () => io.showBundled(render), { class: 'fd-btn is-quiet' }),
          h('p', { class: 'fd-credit', text: 'Un Boeing 737-300 con flujos para practicar. Foto: Weatherhistory, dominio público (CC0).' })),
      ));
      return;
    }

    const lastBackup = await store.getMeta('lastBackupAt').catch(() => undefined);
    const hasSteps = groups.some((group) => group.flows.some((flow) => flow.steps.length));
    // Sin copia nunca descargada, el mes se cuenta desde la primera cabina.
    const since = lastBackup ?? Math.min(...cabins.map((cabin) => cabin.createdAt));
    const due = hasSteps && Date.now() - since > MONTH;
    if (!alive) return;

    releasePhotos();
    root.replaceChildren(h('section', { class: 'fd-list' },
      h('h1', { class: 'fd-list-title', text: 'Tus cabinas' }),
      due ? h('p', { class: 'fd-notice' }, 'Hace más de un mes que no descargás una copia. ',
        h('button', { type: 'button', class: 'fd-link', onclick: () => io.backupAll(render) }, 'Descargar copia')) : null,
      h('div', { class: 'fd-cabins' },
      groups.map(({ cabin, flows }) => h('article', { class: 'fd-cabin' },
        h('img', { class: 'fd-cabin-photo', src: photoUrl(cabin), alt: '', loading: 'lazy', decoding: 'async', draggable: 'false' }),
        h('header', { class: 'fd-cabin-head' },
          h('h2', { text: cabin.name }),
          menu(`Opciones de ${cabin.name}`, [
            { label: 'Renombrar', action: () => renameCabin(cabin) },
            { label: 'Cambiar foto', action: () => replaceImage(cabin) },
            { label: 'Compartir', action: () => io.shareCabin(cabin) },
            isBundled(cabin.id)
              ? { label: 'Ocultar', action: () => hideCabin(cabin) }
              : { label: 'Borrar', action: () => removeCabin(cabin, flows), danger: true },
          ])),
        h('ul', { class: 'fd-flows' },
          flows.map((flow) => h('li', { class: 'fd-flow-row' },
            h('a', { class: 'fd-flow', href: flowHref(cabin, flow, 'editar') },
              h('span', { class: 'fd-flow-name', text: flow.name }),
              h('span', { class: 'fd-flow-count', text: flow.steps.length === 1 ? '1 paso' : `${flow.steps.length} pasos` }),
              flow.steps.length ? progressLine(progress.get(flow.id), flow.steps.length) : null),
            flow.steps.length ? h('a', { class: 'fd-flow-review', href: flowHref(cabin, flow, 'repasar'), 'aria-label': `Repasar ${flow.name}`, title: 'Repasar' }, icon('play')) : null)),
          h('li', {}, h('button', { type: 'button', class: 'fd-flow-add', onclick: () => addFlow(cabin, flows.length) }, icon('plus'), 'Nuevo flujo'))),
      )),
      h('button', { type: 'button', class: 'fd-cabin-new', onclick: createCabin }, icon('image'), h('strong', { text: 'Nueva cabina' }), h('span', { text: 'Foto o PDF de tu cabina' }))),
      h('footer', { class: 'fd-list-foot' },
        h('span', { text: 'Todo se guarda en este dispositivo.' }),
        h('button', { type: 'button', class: 'fd-link', onclick: () => showGuide() }, 'Cómo se usa'),
        h('button', { type: 'button', class: 'fd-link', onclick: () => io.backupAll(render) }, 'Descargar copia de todo'),
        missing.length ? h('button', { type: 'button', class: 'fd-link', onclick: () => io.showBundled(render) },
          missing.length === 1 ? 'Mostrar la cabina de prueba' : 'Mostrar las cabinas de prueba') : null),
    ));
  }

  render().catch(() => toast('No se pudieron leer tus cabinas.'));
  maybeShowGuide(store);
  return () => { alive = false; releasePhotos(); };
}
