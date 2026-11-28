/** Plan de vuelo OACI: formulario por casillas, revisión en vivo, mensaje FPL, hoja impresa y piernera. */
import { cleanPlan, emptyPlan, fplMessage, planFromAircraft, supplementary, validatePlan } from '../fpl.js';
import { btn, checkbox, confirm, empty, field, formatDate, h, input, printSheet, readForm, select, toast } from '../ui.js';

const RULES = [['V', 'V, visual'], ['I', 'I, instrumentos'], ['Y', 'Y, IFR y después VFR'], ['Z', 'Z, VFR y después IFR']];
const TYPES = [['G', 'G, aviación general'], ['S', 'S, transporte regular'], ['N', 'N, transporte no regular'], ['M', 'M, militar'], ['X', 'X, otro']];
const WAKE = [['L', 'L'], ['M', 'M'], ['H', 'H'], ['J', 'J']];
const up = { autocapitalize: 'characters', spellcheck: 'false' };

const box = (number, title, ...children) => h('fieldset', { class: 'bt-box' }, h('legend', {}, h('span', { class: 'bt-box-num', text: number }), title), h('div', { class: 'bt-form' }, children));

function planForm(plan, aircraft) {
  const pick = aircraft.length ? select('_aircraft', [['', 'Completar con una aeronave…'], ...aircraft.map((plane) => [plane.id, `${plane.reg} ${plane.type ?? ''}`])], '') : null;
  const form = h('form', { class: 'bt-plan-form', novalidate: true },
    h('div', { class: 'bt-form' },
      field('Nombre del plan', input('name', plan.name, { placeholder: 'San Fernando a La Plata' })),
      pick ? field('Aeronave', pick) : null),
    box(7, 'Identificación', field('Matrícula sin guion', input('acid', plan.acid, { placeholder: 'LVABC', maxlength: 7, ...up }))),
    box(8, 'Reglas y tipo de vuelo', field('Reglas', select('rules', RULES, plan.rules)), field('Tipo de vuelo', select('flightType', TYPES, plan.flightType))),
    box(9, 'Aeronave',
      field('Cantidad', input('count', plan.count, { inputmode: 'numeric', placeholder: 'Solo si son 2 o más', maxlength: 2 })),
      field('Tipo', input('acType', plan.acType, { placeholder: 'C152', maxlength: 4, ...up })),
      field('Estela', select('wake', WAKE, plan.wake))),
    box(10, 'Equipo', field('Equipo', input('equipment', plan.equipment, { placeholder: 'S', ...up })), field('Vigilancia', input('surveillance', plan.surveillance, { placeholder: 'C', ...up }))),
    box(13, 'Salida', field('Aeródromo', input('adep', plan.adep, { placeholder: 'SADF', maxlength: 4, ...up })), field('Hora (UTC)', input('eobt', plan.eobt, { placeholder: '1300', inputmode: 'numeric', maxlength: 4 }))),
    box(15, 'Ruta',
      field('Velocidad', input('speed', plan.speed, { placeholder: 'N0095', maxlength: 5, ...up })),
      field('Nivel', input('level', plan.level, { placeholder: 'VFR o A045', maxlength: 5, ...up })),
      field('Ruta', h('textarea', { class: 'bt-input', name: 'route', rows: 2, text: plan.route, ...up }), { wide: true })),
    box(16, 'Destino',
      field('Aeródromo', input('ades', plan.ades, { placeholder: 'SADL', maxlength: 4, ...up })),
      field('Duración total', input('eet', plan.eet, { placeholder: '0045', inputmode: 'numeric', maxlength: 4 })),
      field('Alternativa', input('altn1', plan.altn1, { placeholder: 'SAEZ', maxlength: 4, ...up })),
      field('Segunda alternativa', input('altn2', plan.altn2, { maxlength: 4, ...up }))),
    box(18, 'Otros datos', field('Indicadores', h('textarea', { class: 'bt-input', name: 'other', rows: 2, text: plan.other, placeholder: 'DOF/261128 RMK/…', ...up }), { wide: true, hint: 'Vacío se manda como 0.' })),
    box(19, 'Información suplementaria',
      field('Autonomía', input('endurance', plan.endurance, { placeholder: '0400', inputmode: 'numeric', maxlength: 4 })),
      field('Personas a bordo', input('persons', plan.persons, { placeholder: '2', maxlength: 3, ...up })),
      h('div', { class: 'bt-field is-wide' }, h('span', { class: 'bt-label', text: 'Radio de emergencia' }),
        h('div', { class: 'bt-checks' }, checkbox('radioU', 'U, UHF 243', plan.radioU), checkbox('radioV', 'V, VHF 121,5', plan.radioV), checkbox('radioE', 'E, ELT', plan.radioE))),
      h('div', { class: 'bt-field is-wide' }, h('span', { class: 'bt-label', text: 'Equipo de supervivencia' }),
        h('div', { class: 'bt-checks' }, checkbox('survival', 'Lleva', plan.survival), checkbox('survP', 'Polar', plan.survP), checkbox('survD', 'Desierto', plan.survD), checkbox('survM', 'Marítimo', plan.survM), checkbox('survJ', 'Selva', plan.survJ))),
      h('div', { class: 'bt-field is-wide' }, h('span', { class: 'bt-label', text: 'Chalecos' }),
        h('div', { class: 'bt-checks' }, checkbox('jackets', 'Lleva', plan.jackets), checkbox('jackL', 'Con luz', plan.jackL), checkbox('jackF', 'Fluoresceína', plan.jackF), checkbox('jackU', 'Radio UHF', plan.jackU), checkbox('jackV', 'Radio VHF', plan.jackV))),
      h('div', { class: 'bt-field is-wide' }, h('span', { class: 'bt-label', text: 'Botes' }),
        h('div', { class: 'bt-checks' }, checkbox('dinghies', 'Lleva', plan.dinghies), checkbox('dinghyCover', 'Con cubierta', plan.dinghyCover))),
      field('Cantidad de botes', input('dinghyCount', plan.dinghyCount, { inputmode: 'numeric', maxlength: 2 })),
      field('Capacidad total', input('dinghyCapacity', plan.dinghyCapacity, { inputmode: 'numeric', maxlength: 3 })),
      field('Color de los botes', input('dinghyColour', plan.dinghyColour, up)),
      field('Color y marcas de la aeronave', input('colour', plan.colour, up)),
      field('Observaciones', input('remarks', plan.remarks, up)),
      field('Piloto al mando', input('pic', plan.pic, { placeholder: 'Nombre y apellido' }))));
  pick?.addEventListener('change', () => {
    const plane = aircraft.find((item) => item.id === pick.value);
    if (!plane) return;
    for (const [key, value] of Object.entries(planFromAircraft(plane))) if (form.elements[key] && value) form.elements[key].value = value;
    form.dispatchEvent(new Event('input'));
  });
  return form;
}

/** El formulario OACI en una hoja, para llevar a la oficina ARO o guardar como PDF. */
function printPlan(plan) {
  const p = cleanPlan(plan);
  const cell = (label, value, span = 1) => h('div', { class: 'bt-fpl-cell', style: `grid-column:span ${span}` }, h('small', { text: label }), h('strong', { text: value || ' ' }));
  const sheet = h('div', { class: 'bt-sheet bt-fpl-sheet' },
    h('h1', { text: 'Plan de vuelo' }),
    h('p', { text: 'Formato OACI (Doc 4444). Armado en Aerodot; revisalo antes de presentarlo.' }),
    h('div', { class: 'bt-fpl-grid' },
      cell('7 Identificación', p.acid, 2), cell('8 Reglas', p.rules), cell('Tipo de vuelo', p.flightType),
      cell('9 Número', p.count), cell('Tipo de aeronave', p.acType), cell('Estela', p.wake), cell('10 Equipo', `${p.equipment}/${p.surveillance}`),
      cell('13 Aeródromo de salida', p.adep, 2), cell('Hora', p.eobt, 2),
      cell('15 Velocidad', p.speed), cell('Nivel', p.level), cell('Ruta', p.route, 2),
      cell('16 Destino', p.ades), cell('Duración total', p.eet), cell('Alternativa', p.altn1), cell('2.ª alternativa', p.altn2),
      cell('18 Otros datos', p.other || '0', 4),
      cell('19 Autonomía', p.endurance), cell('Personas a bordo', p.persons), cell('Radio de emergencia', [p.radioU && 'U', p.radioV && 'V', p.radioE && 'E'].filter(Boolean).join(' ')), cell('Supervivencia', p.survival ? [p.survP && 'P', p.survD && 'D', p.survM && 'M', p.survJ && 'J'].filter(Boolean).join(' ') : 'No'),
      cell('Chalecos', p.jackets ? [p.jackL && 'L', p.jackF && 'F', p.jackU && 'U', p.jackV && 'V'].filter(Boolean).join(' ') : 'No'), cell('Botes', p.dinghies ? `${p.dinghyCount} · ${p.dinghyCapacity} · ${p.dinghyCover ? 'C' : ''} · ${p.dinghyColour}` : 'No'), cell('Color y marcas', p.colour, 2),
      cell('Observaciones', p.remarks, 2), cell('Piloto al mando', p.pic, 2)),
    h('h2', { text: 'Mensaje FPL' }),
    h('pre', { text: fplMessage(p) }),
    h('p', { text: supplementary(p) }),
    h('div', { class: 'bt-fpl-sign' }, h('span', { text: 'Presentado por' }), h('span', { text: 'Firma' }), h('span', { text: 'Recibido (ARO)' })));
  printSheet(sheet);
}

/** Piernera: media hoja con la ruta, frecuencias, horarios y espacio para el ATIS y la autorización. */
function printKneeboard(plan) {
  const p = cleanPlan(plan);
  const line = (label) => h('div', { class: 'bt-knee-line' }, h('small', { text: label }));
  const sheet = h('div', { class: 'bt-sheet bt-knee' },
    h('h1', { text: `${p.adep || '----'} → ${p.ades || '----'}` }),
    h('p', { text: `${p.acid} · ${p.acType} · ${p.speed} ${p.level} · EET ${p.eet} · Autonomía ${p.endurance}${p.altn1 ? ` · Alternativa ${p.altn1}` : ''}` }),
    h('p', { class: 'bt-knee-route', text: p.route }),
    h('div', { class: 'bt-knee-grid' },
      h('div', { class: 'bt-knee-box' }, h('h2', { text: 'ATIS' }), line('Letra'), line('Viento'), line('Visibilidad y nubes'), line('Temp / rocío'), line('QNH'), line('Pista')),
      h('div', { class: 'bt-knee-box' }, h('h2', { text: 'Autorización' }), line('Límite'), line('Ruta'), line('Altitud'), line('Frecuencia'), line('Transpondedor')),
      h('div', { class: 'bt-knee-box' }, h('h2', { text: 'Frecuencias' }), line('Superficie'), line('Torre'), line('Aproximación'), line('Información'), line('Destino')),
      h('div', { class: 'bt-knee-box' }, h('h2', { text: 'Horarios (UTC)' }), line('Puesta en marcha'), line('Despegue'), line('Puntos de notificación'), line('Aterrizaje'), line('Corte'))),
    h('div', { class: 'bt-knee-box' }, h('h2', { text: 'Notas' }), line(''), line(''), line('')));
  printSheet(sheet);
}

async function editor(view, ctx, id) {
  const { store } = ctx;
  const aircraft = await store.all('aircraft');
  const saved = id === 'nuevo' ? null : await store.get('plans', id);
  if (id !== 'nuevo' && !saved) { ctx.go('plan'); return; }
  const profile = (await store.getMeta('profile')) ?? {};
  let plan = { ...emptyPlan(), pic: profile.name ?? '', ...saved };
  const form = planForm(plan, aircraft);
  const issues = h('ul', { class: 'bt-notes' });
  const message = h('pre', { class: 'bt-message' });
  const suppl = h('p', { class: 'bt-note' });
  const status = h('p', { class: 'bt-big', 'aria-live': 'polite' });
  const copy = btn('Copiar mensaje', async () => {
    try { await navigator.clipboard.writeText(fplMessage(plan)); toast('Mensaje copiado.'); } catch { toast('No se pudo copiar.'); }
  });
  const printBtn = btn('Imprimir o PDF', () => { printPlan(plan); ctx.track('bitacora_print_fpl'); });

  const update = () => {
    const data = readForm(form);
    delete data._aircraft;
    plan = { ...plan, ...data };
    const found = validatePlan(plan);
    status.textContent = found.length ? `Faltan ${found.length} ${found.length === 1 ? 'dato' : 'datos'}` : 'Listo para presentar';
    issues.replaceChildren(...found.map((issue) => h('li', {}, h('span', { class: 'bt-box-num', text: issue.item }), issue.text)));
    issues.hidden = !found.length;
    message.textContent = fplMessage(plan);
    suppl.textContent = `Casilla 19 (queda en la oficina): ${supplementary(plan)}`;
    copy.disabled = found.length > 0;
    printBtn.disabled = found.length > 0;
  };
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  update();

  const save = async () => {
    const record = await store.put('plans', { ...plan, name: plan.name || `${cleanPlan(plan).adep || '?'} a ${cleanPlan(plan).ades || '?'}` });
    plan = record;
    toast('Plan guardado.');
    if (id === 'nuevo') history.replaceState(null, '', `#plan/${encodeURIComponent(record.id)}`);
    id = record.id;
  };

  view.append(
    h('div', { class: 'bt-toolbar' },
      h('a', { class: 'bt-link', href: '#plan', text: 'Todos los planes' }),
      btn('Guardar', save, 'primary'),
      btn('Duplicar', async () => { const { id: _, createdAt, ...rest } = plan; const copyPlan = await store.put('plans', { ...rest, name: `${plan.name || 'Plan'} (copia)` }); ctx.go('plan', copyPlan.id); }, 'quiet', { disabled: saved ? undefined : true }),
      saved ? btn('Borrar', async () => { if (await confirm('Borrar el plan', 'Se borra de este dispositivo.')) { await store.remove('plans', saved.id); ctx.go('plan'); } }, 'danger') : null),
    h('div', { class: 'bt-plan' },
      form,
      h('aside', { class: 'bt-plan-side' },
        h('section', { class: 'bt-card' },
          status,
          issues,
          h('h2', { text: 'Mensaje FPL' }),
          message,
          suppl,
          h('div', { class: 'bt-actions' }, copy, printBtn, btn('Piernera', () => { printKneeboard(plan); ctx.track('bitacora_print_kneeboard'); })),
          h('p', { class: 'bt-note', text: 'La hora va en UTC (en Argentina, la local más 3). Presentalo en la oficina ARO o por los medios que indique la AIP.' })))));
}

export async function renderPlans(view, ctx, param) {
  if (param) return editor(view, ctx, param);
  const plans = (await ctx.store.all('plans')).sort((a, b) => b.updatedAt - a.updatedAt);
  view.append(
    h('div', { class: 'bt-toolbar' }, btn('Nuevo plan', () => ctx.go('plan', 'nuevo'), 'primary')),
    plans.length
      ? h('div', { class: 'bt-cards' }, plans.map((plan) => {
        const p = cleanPlan(plan);
        const ok = !validatePlan(plan).length;
        return h('a', { class: 'bt-card bt-item', href: `#plan/${encodeURIComponent(plan.id)}` },
          h('strong', { class: 'bt-item-title', text: plan.name || `${p.adep} a ${p.ades}` }),
          h('span', { text: `${p.acid || 'Sin matrícula'} · ${p.adep || '----'} → ${p.ades || '----'} · ${p.rules === 'V' ? 'VFR' : 'IFR'}` }),
          h('span', { class: 'bt-item-foot bt-note', text: `${ok ? 'Completo' : 'Incompleto'} · ${formatDate(new Date(plan.updatedAt).toISOString().slice(0, 10))}` }));
      }))
      : empty('Armá el plan de vuelo casilla por casilla. Se revisa mientras escribís, sale el mensaje FPL para copiar y la hoja para imprimir o guardar como PDF. Los planes guardados se reusan.'));
}
