/**
 * CV de piloto: datos personales a mano, horas desde el libro y licencias desde Documentos.
 * Se pueden tener varios (por ejemplo uno para aerolínea y otro para instrucción) y se imprimen a PDF.
 */
import { formatDuration, normalizeFlight, totals } from '../logbook.js';
import { docStatus } from '../documents.js';
import { btn, checkbox, confirm, empty, field, formatDate, h, input, printSheet, readForm, toast, todayIso } from '../ui.js';

const HOURS = [
  ['total', 'Total de vuelo'], ['pic', 'Al mando'], ['multi', 'Multimotor'], ['instructor', 'Instructor'],
  ['sic', 'Copiloto'], ['night', 'Nocturno'], ['ifr', 'Instrumentos'], ['xc', 'Travesía'], ['sim', 'Simulador'],
];
/** Lo que va en el CV como licencias y habilitaciones (también los nombres de versiones anteriores). */
const inCv = (category = '') => /^(Licencia|Habilitación|Certificado médico|Competencia lingüística|Inglés)/.test(category);

const area = (name, value, rows, placeholder) => h('textarea', { class: 'bt-input', name, rows, placeholder, text: value ?? '' });

function hoursOf(flights, aircraft) {
  const t = totals(flights, aircraft);
  const multiRegs = new Set(aircraft.filter((plane) => plane.engine === 'multi').map((plane) => plane.reg));
  return {
    values: {
      total: t.all.total, pic: t.all.pic + t.all.solo, instructor: t.all.instructor, sic: t.all.sic, night: t.all.night,
      ifr: t.all.ifr + t.all.hood, xc: t.all.xc, sim: t.all.sim,
      multi: flights.filter((flight) => !flight.sim && multiRegs.has(flight.reg)).reduce((sum, flight) => sum + flight.total, 0),
    },
    byType: t.byType.filter((row) => row.key !== 'Sin tipo'),
  };
}

function cvSheet(cv, hours, licenses) {
  const lines = (text) => String(text ?? '').split('\n').map((item) => item.trim()).filter(Boolean);
  const section = (title, ...content) => h('section', {}, h('h2', { text: title }), ...content);
  const shown = HOURS.filter(([key]) => cv[`h_${key}`] && hours.values[key]);
  return h('div', { class: 'bt-sheet bt-cv' },
    h('h1', { text: cv.name || 'Nombre y apellido' }),
    h('p', { class: 'bt-cv-contact', text: [cv.role, cv.city, cv.email, cv.phone, cv.nationality].filter(Boolean).join(' · ') }),
    cv.summary ? h('p', { text: cv.summary }) : null,
    licenses.length && cv.showLicenses ? section('Licencias y habilitaciones', h('ul', {}, licenses.map((doc) => h('li', { text: [doc.name, doc.number && `N.º ${doc.number}`, doc.expires && `vigente hasta ${formatDate(doc.expires)}`].filter(Boolean).join(' · ') })))) : null,
    shown.length ? section('Experiencia de vuelo', h('table', { class: 'bt-cv-hours' }, h('tbody', {}, shown.map(([key, label]) => h('tr', {}, h('td', { text: label }), h('td', { text: `${formatDuration(hours.values[key])} h` })))))) : null,
    cv.h_types && hours.byType.length ? section('Horas por tipo', h('p', { text: hours.byType.slice(0, 8).map((row) => `${row.key} ${formatDuration(row.total)} h`).join(' · ') })) : null,
    lines(cv.experience).length ? section('Experiencia laboral', h('ul', {}, lines(cv.experience).map((text) => h('li', { text })))) : null,
    lines(cv.education).length ? section('Formación', h('ul', {}, lines(cv.education).map((text) => h('li', { text })))) : null,
    cv.languages ? section('Idiomas', h('p', { text: cv.languages })) : null,
    h('p', { class: 'bt-cv-foot', text: `Horas al ${formatDate(todayIso())}, según el libro de vuelo personal.` }));
}

async function editor(view, ctx, id) {
  const { store } = ctx;
  const [raw, aircraft, docs] = await Promise.all([store.all('flights'), store.all('aircraft'), store.all('documents')]);
  const saved = id === 'nuevo' ? null : await store.get('cvs', id);
  if (id !== 'nuevo' && !saved) { ctx.go('cv'); return; }
  const profile = (await store.getMeta('profile')) ?? {};
  let cv = saved ?? { title: 'Mi CV', name: profile.name ?? '', showLicenses: true, h_total: true, h_pic: true, h_multi: true, h_instructor: true, h_night: true, h_ifr: true, h_types: true };
  const hours = hoursOf(raw.map(normalizeFlight), aircraft);
  const licenses = docs.filter((doc) => inCv(doc.category) && docStatus(doc).state !== 'vencido');
  const preview = h('div', { class: 'bt-cv-preview' });

  const form = h('form', { class: 'bt-form', novalidate: true },
    field('Nombre del CV', input('title', cv.title, { placeholder: 'Para aerolínea' })),
    field('Nombre y apellido', input('name', cv.name)),
    field('Puesto buscado', input('role', cv.role, { placeholder: 'Primer oficial' })),
    field('Ciudad', input('city', cv.city)),
    field('Correo', input('email', cv.email, { type: 'email' })),
    field('Teléfono', input('phone', cv.phone, { type: 'tel' })),
    field('Nacionalidad', input('nationality', cv.nationality)),
    field('Perfil', area('summary', cv.summary, 3, 'Dos o tres líneas sobre vos.'), { wide: true }),
    field('Experiencia laboral', area('experience', cv.experience, 4, 'Una por línea: 2024 a hoy · Instructor de vuelo · Aeroclub…'), { wide: true }),
    field('Formación', area('education', cv.education, 3, 'Una por línea.'), { wide: true }),
    field('Idiomas', input('languages', cv.languages, { placeholder: 'Inglés OACI nivel 4' }), { wide: true }),
    h('div', { class: 'bt-field is-wide' }, h('span', { class: 'bt-label', text: 'Qué horas mostrar (salen del libro)' }),
      h('div', { class: 'bt-checks' }, HOURS.map(([key, label]) => checkbox(`h_${key}`, `${label} (${formatDuration(hours.values[key])})`, cv[`h_${key}`])), checkbox('h_types', 'Horas por tipo', cv.h_types))),
    h('div', { class: 'bt-field is-wide' }, checkbox('showLicenses', `Licencias vigentes de Documentos (${licenses.length})`, cv.showLicenses)));

  const update = () => {
    cv = { ...cv, ...readForm(form) };
    preview.replaceChildren(cvSheet(cv, hours, licenses));
  };
  form.addEventListener('input', update);
  update();

  view.append(
    h('div', { class: 'bt-toolbar' },
      h('a', { class: 'bt-link', href: '#cv', text: 'Todos los CV' }),
      btn('Guardar', async () => {
        const record = await store.put('cvs', cv);
        cv = record;
        if (cv.name && !profile.name) await store.setMeta('profile', { ...profile, name: cv.name });
        toast('CV guardado.');
        if (id === 'nuevo') { history.replaceState(null, '', `#cv/${encodeURIComponent(record.id)}`); id = record.id; }
      }, 'primary'),
      btn('Imprimir o PDF', () => { printSheet(cvSheet(cv, hours, licenses)); ctx.track('bitacora_print_cv'); }),
      saved ? btn('Borrar', async () => { if (await confirm('Borrar el CV', 'Se borra de este dispositivo.')) { await store.remove('cvs', saved.id); ctx.go('cv'); } }, 'danger') : null),
    h('div', { class: 'bt-plan' }, form, h('aside', { class: 'bt-plan-side' }, h('p', { class: 'bt-label', text: 'Vista previa' }), preview)));
}

export async function renderCv(view, ctx, param) {
  if (param) return editor(view, ctx, param);
  const cvs = (await ctx.store.all('cvs')).sort((a, b) => b.updatedAt - a.updatedAt);
  view.append(
    h('div', { class: 'bt-toolbar' }, btn('Nuevo CV', () => ctx.go('cv', 'nuevo'), 'primary')),
    cvs.length
      ? h('div', { class: 'bt-cards' }, cvs.map((cv) => h('a', { class: 'bt-card bt-item', href: `#cv/${encodeURIComponent(cv.id)}` },
        h('strong', { class: 'bt-item-title', text: cv.title || 'CV' }),
        h('span', { text: [cv.name, cv.role].filter(Boolean).join(' · ') }))))
      : empty('Armá tu CV de piloto. Las horas salen del libro y las licencias de Documentos, así siempre están al día. Podés tener uno para cada tipo de puesto.'));
}
