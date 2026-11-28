/** Vuelos: lista con avisos, alta y edición, importar una planilla, exportar CSV e imprimir el libro. */
import { BOOK_COLUMNS, ROLES, blockMinutes, paginateBook, formatDuration, normalizeFlight, parseDuration, reviewFlights, roleLabel, sortFlights } from '../logbook.js';
import { FIELDS, flightsToCsv, guessMapping, parseCsv, rowsToFlights } from '../csv.js';
import { readXlsx } from '../xlsx.js';
import { btn, plural, checkbox, chip, confirm, dialog, download, empty, field, formatDate, h, input, pickFiles, printSheet, readForm, select, toast, todayIso } from '../ui.js';

const KIND_LABEL = { solapado: 'Superpuesto', duplicado: 'Repetido', aeronave: 'Aeronave sin cargar', dato: 'Revisar' };

function flightForm(flight, aircraft) {
  const regs = h('datalist', { id: 'bt-regs' }, aircraft.map((plane) => h('option', { value: plane.reg, text: plane.type })));
  const durationAttrs = { inputmode: 'decimal', placeholder: '1:30 o 1,5' };
  const form = h('form', { class: 'bt-form', novalidate: true },
    regs,
    field('Fecha', input('date', flight.date || todayIso(), { type: 'date', required: true })),
    field('Matrícula', input('reg', flight.reg, { list: 'bt-regs', placeholder: 'LV-ABC', autocapitalize: 'characters' })),
    field('Tipo', input('type', flight.type, { placeholder: 'C152', autocapitalize: 'characters' })),
    field('Desde', input('from', flight.from, { placeholder: 'SADF', maxlength: 8, autocapitalize: 'characters' })),
    field('Hasta', input('to', flight.to, { placeholder: 'SADP', maxlength: 8, autocapitalize: 'characters' })),
    field('Salida', input('dep', flight.dep, { type: 'time' })),
    field('Llegada', input('arr', flight.arr, { type: 'time' })),
    field('Tiempo total', input('total', flight.total ? formatDuration(flight.total) : '', durationAttrs), { hint: 'Con salida y llegada se calcula solo.' }),
    field('Función', select('role', ROLES, flight.role || 'pic')),
    field('Nocturno', input('night', flight.night ? formatDuration(flight.night) : '', durationAttrs)),
    field('Instrumentos reales', input('ifr', flight.ifr ? formatDuration(flight.ifr) : '', durationAttrs)),
    field('Instrumentos simulados', input('hood', flight.hood ? formatDuration(flight.hood) : '', durationAttrs), { hint: 'Con capota o en simulador.' }),
    field('Aterrizajes de día', input('landingsDay', flight.landingsDay ?? (flight.id ? 0 : 1), { type: 'number', min: 0, inputmode: 'numeric' })),
    field('Aterrizajes de noche', input('landingsNight', flight.landingsNight ?? 0, { type: 'number', min: 0, inputmode: 'numeric' })),
    h('div', { class: 'bt-field is-wide' }, checkbox('sim', 'Fue en simulador (no suma al tiempo de vuelo)', flight.sim)),
    field('Observaciones', h('textarea', { class: 'bt-input', name: 'remarks', rows: 2, text: flight.remarks ?? '' }), { wide: true }),
    h('p', { class: 'bt-form-error', role: 'alert', hidden: true }));

  const els = form.elements;
  const fillTotal = () => {
    const block = blockMinutes(els.dep.value, els.arr.value);
    if (block && !els.total.dataset.touched) els.total.value = formatDuration(block);
  };
  els.dep.addEventListener('change', fillTotal);
  els.arr.addEventListener('change', fillTotal);
  els.total.addEventListener('input', () => { els.total.dataset.touched = els.total.value ? '1' : ''; });
  if (flight.total) els.total.dataset.touched = '1';
  els.reg.addEventListener('change', () => {
    const plane = aircraft.find((item) => item.reg.toUpperCase() === els.reg.value.toUpperCase().trim());
    if (plane && !els.type.value) els.type.value = plane.type ?? '';
  });
  return form;
}

function checkForm(form) {
  const data = readForm(form);
  const error = form.querySelector('.bt-form-error');
  const bad = ['total', 'night', 'ifr', 'hood'].find((name) => data[name] && Number.isNaN(parseDuration(data[name])));
  const message = !data.date ? 'Falta la fecha.' : bad ? 'Hay un tiempo que no se entiende. Usá 1:30 o 1,5.' : '';
  error.textContent = message;
  error.hidden = !message;
  return !message;
}

export async function editFlight(ctx, existing = {}, aircraft = [], notes = []) {
  const form = flightForm(existing, aircraft);
  if (notes.length) form.prepend(h('ul', { class: 'bt-notes is-wide' }, notes.map((note) => h('li', { text: note.text }))));
  const actions = [
    existing.id ? { value: 'delete', label: 'Borrar', kind: 'danger' } : null,
    existing.id ? { value: 'copy', label: 'Duplicar' } : null,
    { value: 'save', label: 'Guardar', kind: 'primary', validate: () => checkForm(form) },
  ].filter(Boolean);
  const choice = await dialog({ title: existing.id ? 'Editar vuelo' : 'Nuevo vuelo', body: form, actions, wide: true, onOpen: () => form.elements.reg.focus() });
  if (choice === 'delete') {
    if (await confirm('Borrar el vuelo', 'El vuelo se borra de este dispositivo. No se puede deshacer.')) {
      await ctx.store.remove('flights', existing.id);
      toast('Vuelo borrado.');
    }
    return;
  }
  if (choice === 'copy') {
    const { id, createdAt, ...rest } = existing;
    return editFlight(ctx, { ...rest, date: todayIso() }, aircraft);
  }
  if (choice !== 'save') return;
  const data = normalizeFlight(readForm(form));
  await ctx.store.put('flights', { ...existing, ...data, id: existing.id });
  ctx.track(existing.id ? 'bitacora_flight_edit' : 'bitacora_flight_add');
  toast('Vuelo guardado.');
}

async function importSheet(ctx, aircraft) {
  const [file] = await pickFiles('.xlsx,.csv,.tsv,.txt,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  if (!file) return;
  if (/\.xls$/i.test(file.name)) return toast('Ese Excel es de un formato viejo (.xls). Guardalo como .xlsx o CSV y probá de nuevo.');
  let rows;
  try {
    rows = /\.xlsx$/i.test(file.name) ? await readXlsx(await file.arrayBuffer()) : parseCsv(await file.text());
  } catch (error) {
    return toast(error.message || 'No se pudo leer la planilla.');
  }
  if (rows.length < 2) return toast('La planilla no tiene filas.');
  const [header, ...body] = rows;
  const mapping = guessMapping(header);
  const preview = h('div', { class: 'bt-import-preview' });
  const selects = FIELDS.map((item) => {
    const el = select(item.id, [['', 'No está'], ...header.map((name, i) => [String(i), name || `Columna ${i + 1}`])], mapping[item.id] ?? '');
    el.addEventListener('change', update);
    return field(item.label, el);
  });
  const current = () => Object.fromEntries(selects.map((wrap) => {
    const el = wrap.querySelector('select');
    return [el.name, el.value === '' ? undefined : Number(el.value)];
  }).filter(([, value]) => value !== undefined));
  function update() {
    const flights = rowsToFlights(body, current());
    const sample = flights.slice(0, 5);
    preview.replaceChildren(
      h('p', { class: 'bt-note', text: `${flights.length === 1 ? '1 vuelo listo' : `${flights.length} vuelos listos`} para importar de ${plural(body.length, 'fila')}. Así se ven los primeros:` }),
      h('div', { class: 'bt-scroll' }, h('table', { class: 'bt-table is-compact' },
        h('thead', {}, h('tr', {}, ['Fecha', 'Matrícula', 'Ruta', 'Total', 'Función', 'Aterrizajes'].map((text) => h('th', { text })))),
        h('tbody', {}, sample.map((flight) => h('tr', {},
          h('td', { text: formatDate(flight.date) || '?' }), h('td', { text: flight.reg }), h('td', { text: flight.from || flight.to ? `${flight.from || '?'} → ${flight.to || '?'}` : '' }),
          h('td', { text: formatDuration(flight.total) }), h('td', { text: roleLabel(flight.role) }), h('td', { text: flight.landingsDay + flight.landingsNight })))))));
  }
  update();
  const body$ = h('div', {},
    h('p', { text: `Encontramos estas columnas en «${file.name}». Revisá que cada dato apunte a la columna correcta.` }),
    h('p', { class: 'bt-note', text: 'Sirve un Excel (.xlsx) o un CSV. Si la planilla tiene varias hojas, se lee la primera. Desde Google Sheets: Archivo, Descargar, Microsoft Excel.' }),
    h('div', { class: 'bt-form' }, selects),
    preview);
  const choice = await dialog({ title: 'Importar vuelos', body: body$, wide: true, actions: [{ value: 'cancel', label: 'Cancelar' }, { value: 'ok', label: 'Importar', kind: 'primary' }] });
  if (choice !== 'ok') return;
  const flights = rowsToFlights(body, current());
  if (!flights.length) return toast('No hay vuelos para importar con esas columnas.');
  await ctx.store.putMany('flights', flights.map(({ id, ...flight }) => flight));
  ctx.track('bitacora_import', { flights: flights.length });
  toast(`${flights.length === 1 ? '1 vuelo importado' : `${flights.length} vuelos importados`}. Revisá los avisos.`);
}

/** El libro para imprimir: columnas como las del libro de vuelo en papel, con totales al pie. */
function printBook(flights, profile) {
  const d = (minutes) => (minutes ? formatDuration(minutes) : '');
  const head = ['Fecha', 'Matrícula', 'Tipo', 'Desde', 'Hasta', 'Sal.', 'Lleg.', 'Total', 'Al mando', 'Doble c.', 'Copiloto', 'Instructor', 'Noche', 'IFR', 'Simul.', 'Ater. D', 'Ater. N', 'Observaciones'];
  // Una fila de pie: etiqueta en las siete primeras columnas, las sumas y nada en observaciones.
  const foot = (label, sums) => h('tr', {}, h('td', { colspan: 7, text: label }),
    BOOK_COLUMNS.map((key) => h('td', { text: key.startsWith('landings') ? String(sums[key] || '') : d(sums[key]) })), h('td', {}));
  const pages = paginateBook(flights);
  const sheet = h('div', { class: 'bt-sheet' }, pages.map((page) => h('section', { class: 'bt-book-page' },
    h('div', { class: 'bt-book-head' },
      h('h1', { text: 'Libro de vuelo' }),
      h('p', { text: [profile?.name, profile?.license, `Hoja ${page.number} de ${pages.length}`].filter(Boolean).join(' · ') })),
    h('table', { class: 'bt-print-table' },
      h('thead', {}, h('tr', {}, head.map((text) => h('th', { text })))),
      h('tbody', {}, page.rows.map((f) => h('tr', {},
        [formatDate(f.date), f.reg || (f.sim ? 'SIM' : ''), f.type, f.from, f.to, f.dep, f.arr, d(f.total),
          ['pic', 'solo'].includes(f.role) ? d(f.total) : '', f.role === 'dual' ? d(f.total) : '', f.role === 'sic' ? d(f.total) : '', f.role === 'instructor' ? d(f.total) : '',
          d(f.night), d(f.ifr), d(f.hood), f.landingsDay || '', f.landingsNight || '', f.sim ? `Simulador. ${f.remarks}`.trim() : f.remarks].map((text) => h('td', { text }))))),
      h('tfoot', {}, foot('Esta hoja', page.page), foot('Hojas anteriores', page.previous), foot('Total acumulado', page.total))),
    h('p', { class: 'bt-book-note', text: `Impreso el ${new Date().toLocaleDateString('es-AR')} desde Aerodot. Registro personal: no reemplaza el registro oficial ante ANAC. El simulador no suma al tiempo de vuelo.` }))));
  printSheet(sheet, { landscape: true });
}

/** El último vuelo abierto, para devolverle el foco cuando la lista se vuelve a dibujar. */
let lastOpened = null;

export async function renderFlights(view, ctx, param) {
  const { store } = ctx;
  const [raw, aircraft] = await Promise.all([store.all('flights'), store.all('aircraft')]);
  const flights = sortFlights(raw.map((flight) => ({ ...flight, ...normalizeFlight(flight) })));
  const issues = reviewFlights(flights, aircraft, todayIso());
  let onlyIssues = param === 'avisos';
  let query = '';

  const after = () => { ctx.go('vuelos'); ctx.refresh(); };
  const add = async () => { await editFlight(ctx, {}, aircraft); after(); };
  const list = h('div', { class: 'bt-flights' });
  const count = h('p', { class: 'bt-note', 'aria-live': 'polite' });

  const draw = () => {
    const q = query.trim().toUpperCase();
    const shown = flights.filter((flight) => (!onlyIssues || issues.has(flight.id))
      && (!q || [flight.reg, flight.type, flight.from, flight.to, flight.remarks.toUpperCase(), formatDate(flight.date)].some((text) => text.includes(q))));
    count.textContent = `${shown.length} de ${plural(flights.length, 'vuelo')}`;
    if (!shown.length) {
      list.replaceChildren(empty(flights.length ? 'No hay vuelos con ese filtro.' : 'Todavía no cargaste vuelos.'));
      return;
    }
    list.replaceChildren(h('div', { class: 'bt-scroll' }, h('table', { class: 'bt-table bt-flight-table' },
      h('thead', {}, h('tr', {}, ['Fecha', 'Aeronave', 'Ruta', 'Total', 'Función', 'Noche', 'Ater.', ''].map((text) => h('th', { text })))),
      h('tbody', {}, shown.slice(0, 500).map((flight) => {
        const notes = issues.get(flight.id) ?? [];
        // La fila entera abre el vuelo con el mouse; con teclado y lector, el botón de la fecha.
        // El botón no tiene acción propia: su clic sube a la fila.
        const route = flight.from || flight.to ? `${flight.from || '?'} a ${flight.to || '?'}` : '';
        return h('tr', { class: notes.length ? 'has-issue' : undefined, 'data-id': flight.id, title: notes.map((note) => note.text).join('\n') || undefined, onclick: async () => { lastOpened = flight.id; await editFlight(ctx, flight, aircraft, notes); after(); } },
          h('td', { 'data-label': 'Fecha' }, h('button', { type: 'button', class: 'bt-row-btn', 'aria-label': `Editar el vuelo del ${formatDate(flight.date) || 'día sin fecha'}${route ? `, ${route}` : ''}${notes.length ? `, ${notes.length} ${notes.length === 1 ? 'aviso' : 'avisos'}` : ''}`, text: formatDate(flight.date) || 'Sin fecha' })),
          h('td', { 'data-label': 'Aeronave', text: flight.sim ? `Simulador ${flight.type}` : `${flight.reg} ${flight.type}`.trim() }),
          h('td', { 'data-label': 'Ruta', text: flight.from || flight.to ? `${flight.from || '?'} → ${flight.to || '?'}` : '' }),
          h('td', { 'data-label': 'Total', class: 'is-num', text: formatDuration(flight.total) }),
          h('td', { 'data-label': 'Función', text: roleLabel(flight.role) }),
          h('td', { 'data-label': 'Noche', class: 'is-num', text: flight.night ? formatDuration(flight.night) : '' }),
          h('td', { 'data-label': 'Ater.', class: 'is-num', text: flight.landingsDay + flight.landingsNight || '' }),
          h('td', { class: 'bt-issues-cell' }, notes.length ? h('div', { class: 'bt-issues' }, [...new Set(notes.map((note) => note.kind))].map((kind) => chip(KIND_LABEL[kind], kind === 'dato' ? 'warn' : 'bad')),
            h('span', { class: 'bt-visually-hidden', text: notes.map((note) => note.text).join(' ') })) : null));
      })))),
    shown.length > 500 ? h('p', { class: 'bt-note', text: 'Se muestran los 500 más nuevos. Usá la búsqueda para encontrar otros.' }) : null);
  };

  const search = input('q', '', { type: 'search', placeholder: 'Buscar matrícula, aeródromo, fecha…', 'aria-label': 'Buscar vuelos', oninput: (event) => { query = event.target.value; draw(); } });
  const filter = checkbox('issues', `Solo con avisos (${issues.size})`, onlyIssues);
  filter.querySelector('input').addEventListener('change', (event) => { onlyIssues = event.target.checked; draw(); });

  view.append(
    h('div', { class: 'bt-toolbar' },
      btn('Agregar vuelo', add, 'primary'),
      btn('Importar planilla', async () => { await importSheet(ctx, aircraft); after(); }),
      btn('Exportar CSV', () => { download(new Blob([flightsToCsv(sortFlights(flights).reverse())], { type: 'text/csv;charset=utf-8' }), `libro-de-vuelo-${todayIso()}.csv`); ctx.track('bitacora_export_csv'); }, 'quiet', { disabled: flights.length ? undefined : true }),
      btn('Imprimir o PDF', async () => { printBook(flights, await store.getMeta('profile')); ctx.track('bitacora_print_book'); }, 'quiet', { disabled: flights.length ? undefined : true })),
    h('div', { class: 'bt-filters' }, search, filter),
    count,
    list);
  draw();
  if (lastOpened) {
    // Si el vuelo se borró, el foco va al botón de agregar.
    const row = list.querySelector(`tr[data-id="${CSS.escape(lastOpened)}"] .bt-row-btn`);
    (row ?? view.querySelector('.bt-toolbar button'))?.focus();
    lastOpened = null;
  }

  if (param === 'nuevo') add();
  if (param === 'importar') { await importSheet(ctx, aircraft); after(); }
}
