/**
 * NOTAM de ANAC por aeródromo, con favoritos, orden por importancia y la última consulta guardada
 * para verla sin conexión. Los datos pasan por /api/notam (ver api/notam.js).
 */
import { isActive } from '../notam.js';
import { btn, checkbox, chip, empty, h, select, toast } from '../ui.js';

const OFFICIAL = 'https://ais.anac.gob.ar/notam';
const TONE = { 3: 'bad', 2: 'warn', 1: undefined };
const LABEL = { 3: 'Importante', 2: 'Operativo', 1: 'Informativo' };

async function getJson(url) {
  const response = await fetch(url, { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error('sin datos');
  return response.json();
}

export async function renderNotam(view, ctx) {
  const { store } = ctx;
  let favs = (await store.getMeta('notamFavs')) ?? [];
  let places = (await store.getMeta('notamPlaces')) ?? [];
  let current = (await store.getMeta('notamLast')) ?? favs[0] ?? '';
  let onlyActive = true;

  const picker = h('div', { class: 'bt-field' });
  const favBar = h('div', { class: 'bt-chips' });
  const result = h('div', { class: 'bt-notams', 'aria-live': 'polite' });
  const status = h('p', { class: 'bt-note' });
  const activeToggle = checkbox('active', 'Solo los vigentes ahora', onlyActive);
  activeToggle.querySelector('input').addEventListener('change', (event) => { onlyActive = event.target.checked; load(current, false); });

  const nameOf = (code) => places.find((place) => place.code === code)?.name ?? code;

  const drawPicker = () => {
    const el = select('place', [['', places.length ? 'Elegí un aeródromo…' : 'Cargando la lista…'], ...places.map((place) => [place.code, `${place.name} (${place.code})`])], current);
    el.setAttribute('aria-label', 'Aeródromo');
    el.addEventListener('change', () => load(el.value));
    picker.replaceChildren(el);
  };

  const drawFavs = () => {
    favBar.replaceChildren(...favs.map((code) => h('button', { type: 'button', class: code === current ? 'bt-pill is-on' : 'bt-pill', onclick: () => load(code), text: nameOf(code) })));
  };

  const draw = (data, { stale } = {}) => {
    const notams = (data.notams ?? []).filter((notam) => !onlyActive || isActive(notam)).sort((a, b) => b.severity - a.severity);
    const isFav = favs.includes(current);
    result.replaceChildren(...[
      h('div', { class: 'bt-toolbar' },
        h('h2', { text: nameOf(current) }),
        btn(isFav ? 'Quitar de favoritos' : 'Agregar a favoritos', async () => {
          favs = isFav ? favs.filter((code) => code !== current) : [...favs, current];
          await store.setMeta('notamFavs', favs);
          drawFavs();
          draw(data, { stale });
        })),
      stale ? h('p', { class: 'bt-chip is-warn', text: 'Sin conexión con ANAC: es la última consulta guardada.' }) : null,
      notams.length
        ? h('ol', { class: 'bt-notam-list' }, notams.map((notam) => h('li', { class: `bt-card bt-notam is-${notam.severity}` },
          h('div', { class: 'bt-notam-head' }, h('strong', { text: notam.id }), chip(LABEL[notam.severity], TONE[notam.severity])),
          h('p', { class: 'bt-notam-text', text: notam.text }),
          notam.textEs && notam.textEs !== notam.text ? h('p', { class: 'bt-note', text: notam.textEs }) : null,
          h('p', { class: 'bt-note', text: `Desde ${notam.from.slice(0, 16)} hasta ${notam.to.slice(0, 16)} UTC` }))))
        : empty(onlyActive ? 'No hay NOTAM vigentes ahora para este lugar.' : 'No hay NOTAM para este lugar.'),
    ].filter(Boolean));
    status.textContent = `ANAC actualizó el ${data.updated || '?'} (hora argentina). Consultado ${new Date(data.fetchedAt).toLocaleString('es-AR')}.`;
  };

  async function load(code, fetchNew = true) {
    if (!code) return;
    current = code;
    store.setMeta('notamLast', code);
    drawFavs();
    const cached = await store.getMeta(`notam:${code}`);
    if (!fetchNew && cached) return draw(cached, { stale: cached.stale });
    if (cached) draw(cached, { stale: false });
    else result.replaceChildren(h('p', { class: 'bt-note', text: 'Consultando a ANAC…' }));
    try {
      const data = { ...(await getJson(`/api/notam?lugar=${encodeURIComponent(code)}`)), fetchedAt: Date.now() };
      await store.setMeta(`notam:${code}`, data);
      draw(data);
      ctx.track('bitacora_notam');
    } catch {
      if (cached) draw({ ...cached, stale: true }, { stale: true });
      else result.replaceChildren(empty('No se pudo leer el sitio de ANAC ahora.', h('a', { class: 'bt-link', href: OFFICIAL, target: '_blank', rel: 'noopener', text: 'Abrir la consulta oficial' })));
    }
  }

  view.append(
    h('section', { class: 'bt-card' },
      h('div', { class: 'bt-filters' }, picker, activeToggle),
      favBar,
      h('p', { class: 'bt-note', text: 'Los NOTAM salen de la consulta pública de ANAC (series A y C). Son de referencia: no reemplazan la información previa al vuelo de la oficina ARO-AIS.' })),
    result,
    status,
    h('a', { class: 'bt-link', href: OFFICIAL, target: '_blank', rel: 'noopener', text: 'Consulta oficial de ANAC' }));

  drawPicker();
  drawFavs();
  if (current) load(current);
  try {
    const data = await getJson('/api/notam');
    if (data.places?.length) {
      places = data.places;
      await store.setMeta('notamPlaces', places);
      drawPicker();
      drawFavs();
    }
  } catch {
    if (!places.length) {
      picker.replaceChildren(h('p', { class: 'bt-note', text: 'No se pudo traer la lista de lugares de ANAC.' }));
      toast('ANAC no responde ahora.');
    }
  }
}
