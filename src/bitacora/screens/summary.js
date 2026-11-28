/** Resumen: totales, experiencia reciente, vencimientos, avisos del libro y copia de seguridad. */
import { formatDecimal, formatDuration, normalizeFlight, recency, reviewFlights, sortFlights, splitAccepted, totals } from '../logbook.js';
import { alerts, statusText } from '../documents.js';
import { exportBackup, readBackup } from '../store.js';
import { btn, plural, chip, dialog, download, field, formatDate, h, input, pickFiles, readForm, select, toast, todayIso } from '../ui.js';

/** Tus datos: el nombre y la licencia que usan el plan de vuelo, el libro impreso y el CV. */
const profileFields = (profile) => [
  field('Nombre y apellido', input('name', profile.name, { autocomplete: 'name' })),
  field('Licencia y número', input('license', profile.license, { placeholder: 'PPA 12345' }), { hint: 'Opcional. Sale en el libro impreso.' }),
  field('Horas en el libro', select('hours', [['hhmm', '1:30, horas y minutos'], ['decimal', '1,5, en décimas']], profile.hours || 'hhmm'), { hint: 'Cómo se muestran en la lista y en el libro impreso.' }),
];

const readProfile = (form, profile) => {
  const data = readForm(form);
  return { ...profile, name: data.name.trim(), license: data.license.trim(), hours: data.hours };
};

async function editProfile(ctx, profile) {
  const form = h('form', { class: 'bt-form', novalidate: true }, profileFields(profile));
  const choice = await dialog({ title: 'Tus datos', body: form, actions: [{ value: 'cancel', label: 'Cancelar' }, { value: 'ok', label: 'Guardar', kind: 'primary' }] });
  if (choice !== 'ok') return;
  await ctx.store.setMeta('profile', readProfile(form, profile));
  toast('Datos guardados.');
  ctx.refresh();
}

const stat = (label, minutes, extra) => h('div', { class: 'bt-stat' },
  h('span', { class: 'bt-stat-label', text: label }),
  h('strong', { text: formatDuration(minutes) }),
  h('small', { text: extra ?? `${formatDecimal(minutes)} h` }));

export function groupTable(title, rows, { limit = 8 } = {}) {
  if (!rows.length) return null;
  return h('section', { class: 'bt-card' },
    h('h2', { text: title }),
    h('table', { class: 'bt-table is-compact' },
      h('thead', {}, h('tr', {}, h('th', { text: '' }), h('th', { class: 'is-num', text: 'Vuelos' }), h('th', { class: 'is-num', text: 'Horas' }))),
      h('tbody', {}, rows.slice(0, limit).map((row) => h('tr', {},
        h('td', { text: row.key }), h('td', { class: 'is-num', text: row.flights }), h('td', { class: 'is-num', text: formatDuration(row.total) }))))),
    rows.length > limit ? h('p', { class: 'bt-note', text: `Y ${rows.length - limit} más.` }) : null);
}

/** Barras de horas por mes, los últimos 12 meses (con los meses sin vuelos en cero). */
function monthChart(byMonth, today) {
  const months = [];
  const [year, month] = today.split('-').map(Number);
  for (let i = 11; i >= 0; i -= 1) {
    const date = new Date(Date.UTC(year, month - 1 - i, 1));
    months.push(date.toISOString().slice(0, 7));
  }
  const values = months.map((key) => byMonth.find((row) => row.key === key)?.total ?? 0);
  const max = Math.max(...values, 60);
  const names = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return h('section', { class: 'bt-card' },
    h('h2', { text: 'Horas por mes' }),
    h('div', { class: 'bt-bars', role: 'img', 'aria-label': `Horas de vuelo de los últimos 12 meses: ${months.map((key, i) => `${names[Number(key.slice(5)) - 1]} ${formatDuration(values[i])}`).join(', ')}` },
      months.map((key, i) => h('div', { class: 'bt-bar' },
        h('span', { class: 'bt-bar-value', text: values[i] ? formatDecimal(values[i]) : '' }),
        h('span', { class: 'bt-bar-fill', style: `height:${Math.round((values[i] / max) * 100)}%` }),
        h('span', { class: 'bt-bar-label', text: names[Number(key.slice(5)) - 1] })))));
}

export async function renderSummary(view, ctx) {
  const { store, go } = ctx;
  const [rawFlights, aircraft, docs] = await Promise.all([store.all('flights'), store.all('aircraft'), store.all('documents')]);
  const flights = rawFlights.map((flight) => ({ ...normalizeFlight(flight), createdAt: flight.createdAt, accepted: flight.accepted }));
  const today = todayIso();
  const t = totals(flights, aircraft);
  const recent = recency(flights, today);
  const { open: issues } = splitAccepted(reviewFlights(flights, aircraft, today), flights);
  const docAlerts = alerts(docs, today);
  const lastBackup = await store.getMeta('lastBackupAt');

  const backup = async () => {
    download(await exportBackup(store), `bitacora-${today}.json`);
    await store.setMeta('lastBackupAt', Date.now());
    ctx.track('bitacora_backup');
    ctx.refresh();
  };
  const restore = async () => {
    const [file] = await pickFiles('.json,application/json');
    if (!file) return;
    try {
      const { counts, restore: apply } = await readBackup(store, file);
      const choice = await dialog({
        title: 'Restaurar la copia',
        body: h('p', { text: `Trae ${plural(counts.flights, 'vuelo')}, ${plural(counts.aircraft, 'aeronave')}, ${plural(counts.documents, 'documento')}, ${plural(counts.plans, 'plan', 'planes')} y ${plural(counts.cvs, 'CV', 'CV')}. Lo que tenga el mismo identificador se reemplaza; lo demás se suma.` }),
        actions: [{ value: 'cancel', label: 'Cancelar' }, { value: 'ok', label: 'Restaurar', kind: 'primary' }],
      });
      if (choice !== 'ok') return;
      await apply();
      toast('Copia restaurada.');
      ctx.refresh();
    } catch (error) {
      toast(error.message);
    }
  };

  const profile = (await store.getMeta('profile')) ?? {};

  if (!flights.length && !docs.length && !aircraft.length) {
    // El nombre se guarda mientras se escribe: así ya aparece en el plan de vuelo y el CV.
    const welcomeForm = h('form', { class: 'bt-form bt-welcome-form', novalidate: true, onsubmit: (event) => event.preventDefault() }, profileFields(profile));
    welcomeForm.addEventListener('change', () => store.setMeta('profile', readProfile(welcomeForm, profile)));
    view.append(
      h('section', { class: 'bt-card bt-welcome' },
        h('h2', { text: 'Tu libro de vuelo, en este dispositivo' }),
        h('p', { text: 'Cargá tus vuelos a mano o traelos de una planilla. La Bitácora suma las horas, revisa que no haya vuelos superpuestos ni repetidos y te avisa cuando se acerca el vencimiento de la licencia o del CMA.' }),
        h('p', { class: 'bt-note', text: 'No hay cuenta ni servidor: los datos no salen de este navegador. Hacé una copia de seguridad cada tanto.' }),
        welcomeForm,
        h('div', { class: 'bt-actions' },
          btn('Cargar el primer vuelo', () => go('vuelos', 'nuevo'), 'primary'),
          btn('Importar una planilla', () => go('vuelos', 'importar')),
          btn('Restaurar una copia', restore))));
    return;
  }

  const flagged = issues.size;
  const real = flights.filter((flight) => !flight.sim);
  const aerodromes = new Set(real.flatMap((flight) => [flight.from, flight.to]).filter((code) => /^[A-Z]{4}$/.test(code)));
  const favourite = t.byReg[0];
  const lastFlights = sortFlights(real).slice(0, 4);
  const time = (minutes) => (profile.hours === 'decimal' ? formatDecimal(minutes) : formatDuration(minutes));
  view.append(
    h('div', { class: 'bt-toolbar' },
      btn('Cargar un vuelo', () => go('vuelos', 'nuevo'), 'primary'),
      btn('Nuevo plan de vuelo', () => go('plan', 'nuevo')),
      btn('Consultar NOTAM', () => go('notam'))),
    h('section', { class: 'bt-stats' },
      stat('Total de vuelo', t.all.total, `${formatDecimal(t.all.total)} h · ${plural(t.all.flights - flights.filter((f) => f.sim).length, 'vuelo')}`),
      // Las funciones que nunca volaste no ocupan lugar.
      [
        ['Al mando', t.all.pic + t.all.solo],
        ['Doble comando', t.all.dual],
        ['Instructor', t.all.instructor],
        ['Copiloto', t.all.sic],
        ['Nocturno', t.all.night],
        ['Instrumentos', t.all.ifr + t.all.hood, `${formatDuration(t.all.ifr)} reales · ${formatDuration(t.all.hood)} simulados`],
        ['Travesía', t.all.xc],
        ['Simulador', t.all.sim],
      ].filter(([, minutes]) => minutes > 0).map(([label, minutes, extra]) => stat(label, minutes, extra)),
      h('div', { class: 'bt-stat' }, h('span', { class: 'bt-stat-label', text: 'Aterrizajes' }), h('strong', { text: t.all.landingsDay + t.all.landingsNight }), h('small', { text: `${t.all.landingsNight} de noche` }))),

    h('div', { class: 'bt-grid' },
      h('section', { class: 'bt-card' },
        h('h2', { text: 'Últimos 90 días' }),
        h('p', { class: 'bt-big', text: `${formatDuration(recent.minutes)} h · ${plural(recent.landings, 'aterrizaje')}` }),
        h('p', { class: 'bt-note', text: `${recent.landingsNight} de noche. Para llevar pasajeros la RAAC 61 pide experiencia reciente en aterrizajes; revisá el requisito vigente para tu licencia.` })),
      h('section', { class: 'bt-card' },
        h('h2', { text: 'Vencimientos' }),
        docAlerts.length
          ? h('ul', { class: 'bt-list' }, docAlerts.map(({ doc, status }) => h('li', {},
            h('a', { href: '#documentos', text: doc.name || doc.category }),
            chip(statusText(status), status.state === 'vencido' ? 'bad' : 'warn'))))
          : h('p', { class: 'bt-note', text: docs.length ? 'Nada vence pronto.' : 'Todavía no cargaste documentos.' }),
        h('a', { class: 'bt-link', href: '#documentos', text: docs.length ? 'Ver documentos' : 'Cargar la licencia y el CMA' })),
      h('section', { class: 'bt-card' },
        h('h2', { text: 'Revisión del libro' }),
        flagged
          ? h('p', { class: 'bt-big', text: `${flagged} ${flagged === 1 ? 'vuelo para revisar' : 'vuelos para revisar'}` })
          : h('p', { class: 'bt-big', text: 'Sin avisos' }),
        h('p', { class: 'bt-note', text: 'Se revisan superposiciones de horario, vuelos repetidos, matrículas que no están en tus aeronaves y tiempos que no cierran.' }),
        flagged ? h('a', { class: 'bt-link', href: '#vuelos/avisos', text: 'Ver los vuelos con avisos' }) : null)),

    h('div', { class: 'bt-grid' },
      h('section', { class: 'bt-card' },
        h('h2', { text: 'Últimos vuelos' }),
        lastFlights.length
          ? h('ul', { class: 'bt-list' }, lastFlights.map((flight) => h('li', {},
            h('span', { text: `${formatDate(flight.date)} · ${flight.from || '?'} → ${flight.to || '?'} · ${flight.reg}` }),
            h('span', { class: 'bt-num', text: time(flight.total) }))))
          : h('p', { class: 'bt-note', text: 'Solo hay vuelos de simulador.' }),
        h('a', { class: 'bt-link', href: '#vuelos', text: 'Ver el libro' })),
      h('section', { class: 'bt-card' },
        h('h2', { text: 'Dónde volaste' }),
        h('p', { class: 'bt-big', text: plural(aerodromes.size, 'aeródromo') }),
        h('p', { class: 'bt-note', text: favourite ? `La matrícula que más volaste es ${favourite.key}: ${time(favourite.total)} h en ${plural(favourite.flights, 'vuelo')}.` : 'Todavía no hay vuelos con matrícula.' }),
        aerodromes.size ? h('p', { class: 'bt-note bt-codes', text: [...aerodromes].sort().join(' ') }) : null)),

    monthChart(t.byMonth, today),
    h('div', { class: 'bt-grid' },
      groupTable('Por categoría', t.byCategory),
      groupTable('Por tipo', t.byType),
      groupTable('Por matrícula', t.byReg),
      groupTable('Rutas más voladas', t.byRoute)),

    h('div', { class: 'bt-grid' },
    h('section', { class: 'bt-card' },
      h('h2', { text: 'Tus datos' }),
      h('p', { class: 'bt-big', text: profile.name || 'Sin nombre' }),
      h('p', { class: 'bt-note', text: profile.license || 'Sin licencia cargada. El nombre y la licencia salen en el plan de vuelo, el libro impreso y el CV.' }),
      h('div', { class: 'bt-actions' }, btn('Editar', () => editProfile(ctx, profile)))),
    h('section', { class: 'bt-card' },
      h('h2', { text: 'Copia de seguridad' }),
      h('p', { class: 'bt-note', text: lastBackup ? `La última fue el ${new Date(lastBackup).toLocaleDateString('es-AR')}. Guardala fuera del teléfono (en tu correo o en la nube).` : 'Todavía no hiciste ninguna. Si se borran los datos del navegador, sin copia se pierden.' }),
      h('div', { class: 'bt-actions' }, btn('Descargar copia', backup, 'primary'), btn('Restaurar una copia', restore)))),
  );
}
