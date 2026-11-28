/** Aeronaves: la flota que volás, con los datos que piden el libro y el plan de vuelo. */
import { CATEGORIES, ENGINES, categoryLabel, formatDuration, normalizeFlight, normalizeReg, totals } from '../logbook.js';
import { btn, plural, confirm, dialog, empty, field, h, input, readForm, select, toast } from '../ui.js';

const PROPULSION = ['Pistón', 'Turbohélice', 'Turbofán o reactor', 'Turboeje', 'Eléctrico', 'Sin motor'];
const WAKE = [['L', 'L, liviana (hasta 7000 kg)'], ['M', 'M, media'], ['H', 'H, pesada'], ['J', 'J, súper']];

async function editAircraft(ctx, plane = {}) {
  const form = h('form', { class: 'bt-form', novalidate: true },
    field('Matrícula', input('reg', plane.reg, { placeholder: 'LV-ABC', required: true, autocapitalize: 'characters' })),
    field('Designador OACI', input('type', plane.type, { placeholder: 'C152', maxlength: 4, autocapitalize: 'characters' }), { hint: 'El del Doc 8643: C152, PA28, B738.' }),
    field('Marca y modelo', input('model', plane.model, { placeholder: 'Cessna 152' })),
    field('Categoría', select('category', CATEGORIES, plane.category || 'Avión')),
    field('Motores', select('engine', ENGINES, plane.engine || 'mono')),
    field('Propulsión', select('propulsion', PROPULSION, plane.propulsion || 'Pistón')),
    field('Estela turbulenta', select('wake', WAKE, plane.wake || 'L')),
    field('Equipo (casilla 10a)', input('equipment', plane.equipment ?? 'S', { placeholder: 'S', autocapitalize: 'characters' }), { hint: 'S es VHF, VOR e ILS. Sumá G si tiene GPS aprobado.' }),
    field('Vigilancia (casilla 10b)', input('surveillance', plane.surveillance ?? 'C', { placeholder: 'C', autocapitalize: 'characters' }), { hint: 'C es transpondedor modo C; S, modo S.' }),
    field('Colores y marcas', input('colour', plane.colour, { placeholder: 'Blanco con franjas rojas' })),
    field('Notas', h('textarea', { class: 'bt-input', name: 'notes', rows: 2, text: plane.notes ?? '' }), { wide: true }),
    h('p', { class: 'bt-form-error', role: 'alert', hidden: true }));
  const valid = () => {
    const ok = Boolean(form.elements.reg.value.trim());
    const error = form.querySelector('.bt-form-error');
    error.textContent = ok ? '' : 'Falta la matrícula.';
    error.hidden = ok;
    return ok;
  };
  const actions = [
    plane.id ? { value: 'delete', label: 'Borrar', kind: 'danger' } : null,
    { value: 'save', label: 'Guardar', kind: 'primary', validate: valid },
  ].filter(Boolean);
  const choice = await dialog({ title: plane.id ? plane.reg : 'Nueva aeronave', body: form, actions, wide: true });
  if (choice === 'delete') {
    if (await confirm('Borrar la aeronave', 'Los vuelos hechos en ella no se borran.')) await ctx.store.remove('aircraft', plane.id);
    return;
  }
  if (choice !== 'save') return;
  const data = readForm(form);
  data.reg = normalizeReg(data.reg);
  for (const key of ['type', 'equipment', 'surveillance']) data[key] = data[key].toUpperCase().trim();
  await ctx.store.put('aircraft', { ...plane, ...data });
  toast('Aeronave guardada.');
}

export async function renderAircraft(view, ctx) {
  const { store } = ctx;
  const [aircraft, raw] = await Promise.all([store.all('aircraft'), store.all('flights')]);
  const flights = raw.map(normalizeFlight);
  const byReg = new Map(totals(flights, aircraft).byReg.map((row) => [row.key, row]));
  const known = new Set(aircraft.map((plane) => plane.reg));
  // Matrículas que aparecen en el libro y no están cargadas, con el tipo que más se usó con ellas.
  const missing = [...new Set(flights.filter((flight) => !flight.sim && flight.reg && !known.has(flight.reg)).map((flight) => flight.reg))];
  const after = () => ctx.refresh();

  const addMissing = async () => {
    await store.putMany('aircraft', missing.map((reg) => ({
      reg, type: flights.find((flight) => flight.reg === reg && flight.type)?.type ?? '', category: 'Avión', engine: 'mono', propulsion: 'Pistón', wake: 'L', equipment: 'S', surveillance: 'C',
    })));
    toast(`${missing.length === 1 ? 'Aeronave agregada' : `${missing.length} aeronaves agregadas`}. Revisá su categoría.`);
    after();
  };

  view.append(
    h('div', { class: 'bt-toolbar' },
      btn('Agregar aeronave', async () => { await editAircraft(ctx); after(); }, 'primary'),
      missing.length ? btn(missing.length === 1 ? `Agregar ${missing[0]}, que está en el libro` : `Agregar las ${missing.length} del libro que faltan`, addMissing) : null),
    aircraft.length
      ? h('div', { class: 'bt-cards' }, [...aircraft].sort((a, b) => a.reg.localeCompare(b.reg)).map((plane) => {
        const row = byReg.get(plane.reg);
        return h('button', { type: 'button', class: 'bt-card bt-item', onclick: async () => { await editAircraft(ctx, plane); after(); } },
          h('strong', { class: 'bt-item-title', text: plane.reg }),
          h('span', { text: [plane.type, plane.model].filter(Boolean).join(' · ') || 'Sin tipo' }),
          h('span', { class: 'bt-note', text: `${categoryLabel(plane)} · ${plane.propulsion ?? ''} · Estela ${plane.wake ?? 'L'} · ${plane.equipment || 'S'}/${plane.surveillance || 'C'}` }),
          h('span', { class: 'bt-item-foot', text: row ? `${formatDuration(row.total)} h en ${plural(row.flights, 'vuelo')}` : 'Sin vuelos todavía' }));
      }))
      : empty('Cargá las aeronaves que volás. El libro las usa para separar las horas por categoría y el plan de vuelo para completar el tipo y el equipo.'),
    missing.length ? h('p', { class: 'bt-note', text: `En el libro aparecen sin cargar: ${missing.join(', ')}.` }) : null);
}
