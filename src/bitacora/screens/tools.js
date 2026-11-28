/** Cálculos de cabina: cada tarjeta se recalcula mientras escribís. */
import { FUEL_DENSITY, UNITS, cloudBase, convert, densityAltitude, fuelPlan, glideDistanceNm, windComponents, windTriangle } from '../calc.js';
import { field, h, input, select } from '../ui.js';

const num = (value) => {
  const n = Number(String(value).replace(',', '.'));
  return Number.isFinite(n) ? n : NaN;
};
const fmt = (n, digits = 0) => (Number.isFinite(n) ? n.toLocaleString('es-AR', { maximumFractionDigits: digits, minimumFractionDigits: digits }) : '?');
const hm = (minutes) => (Number.isFinite(minutes) && minutes >= 0 ? `${Math.floor(minutes / 60)}:${String(Math.round(minutes % 60)).padStart(2, '0')}` : '?');

/** Una tarjeta con campos y un resultado que se recalcula. `fields`: [name, label, value, attrs]. */
function tool(title, fields, compute, note) {
  const out = h('div', { class: 'bt-result', 'aria-live': 'polite' });
  const form = h('form', { class: 'bt-form', onsubmit: (event) => event.preventDefault() },
    fields.map(([name, label, value, attrs = {}]) => (attrs.options
      ? field(label, select(name, attrs.options, value))
      : field(label, input(name, value, { inputmode: 'decimal', ...attrs })))));
  const run = () => {
    const values = Object.fromEntries([...form.elements].filter((el) => el.name).map((el) => [el.name, el.tagName === 'SELECT' ? el.value : num(el.value)]));
    out.replaceChildren(...compute(values));
  };
  form.addEventListener('input', run);
  run();
  return h('section', { class: 'bt-card bt-tool' }, h('h2', { text: title }), form, out, note ? h('p', { class: 'bt-note', text: note }) : null);
}

const line = (label, value) => h('p', {}, h('span', { text: `${label} ` }), h('strong', { text: value }));

export function renderTools(view) {
  view.append(h('div', { class: 'bt-tools' },
    tool('Viento en la pista', [['rwy', 'Rumbo de la pista', 110], ['dir', 'Viento desde', 140], ['spd', 'Intensidad (kt)', 20]], ({ rwy, dir, spd }) => {
      const w = windComponents(rwy, dir, spd);
      if (!Number.isFinite(w.head)) return [line('Completá los datos', '')];
      return [
        line(w.head >= 0 ? 'De frente' : 'De cola', `${fmt(Math.abs(w.head))} kt`),
        line(`Cruzado ${w.cross >= 0 ? 'desde la derecha' : 'desde la izquierda'}`, `${fmt(Math.abs(w.cross))} kt`),
      ];
    }, 'Pista 11 es rumbo 110. Usá el viento en grados magnéticos, como lo da la torre o el ATIS.'),

    tool('Triángulo de viento', [['course', 'Rumbo deseado', 90], ['tas', 'Velocidad verdadera (kt)', 100], ['dir', 'Viento desde', 360], ['spd', 'Intensidad (kt)', 20]], ({ course, tas, dir, spd }) => {
      const r = windTriangle(course, tas, dir, spd);
      if (!r) return [line('El viento es mayor que la velocidad', '')];
      return [line('Corrección', `${fmt(r.wca, 0)}°`), line('Rumbo a volar', `${fmt(Math.round(r.heading) || 360)}°`), line('Velocidad respecto del suelo', `${fmt(r.gs)} kt`)];
    }),

    tool('Combustible', [['perHour', 'Consumo por hora', 24], ['minutes', 'Tiempo de vuelo (min)', 90], ['reserve', 'Reserva (min)', 45], ['taxi', 'Rodaje y prueba', 2], ['onBoard', 'A bordo', 90], ['fuel', 'Combustible', 'Avgas 100LL', { options: Object.keys(FUEL_DENSITY) }]], ({ perHour, minutes, reserve, taxi, onBoard, fuel }) => {
      const r = fuelPlan({ perHour, flightMinutes: minutes, reserveMinutes: reserve, taxi: taxi || 0, onBoard });
      const lines = [line('Necesario', `${fmt(r.needed, 1)} (vuelo ${fmt(r.flight, 1)} + reserva ${fmt(r.reserve, 1)} + rodaje ${fmt(r.taxi, 1)})`)];
      if (r.enduranceMinutes !== undefined) {
        lines.push(line('Autonomía', `${hm(r.enduranceMinutes)} h`));
        lines.push(line(r.margin >= 0 ? 'Sobra' : 'Falta', fmt(Math.abs(r.margin), 1)));
        lines.push(line('Peso a bordo si son litros', `${fmt(onBoard * FUEL_DENSITY[fuel])} kg`));
      }
      return lines;
    }, 'En las mismas unidades que el consumo (litros o galones). La reserva mínima la fija la RAAC 91 según el tipo de vuelo: revisala.'),

    tool('Altitud de densidad', [['elev', 'Elevación (ft)', 20], ['qnh', 'QNH (hPa)', 1013], ['oat', 'Temperatura (°C)', 30]], ({ elev, qnh, oat }) => {
      const r = densityAltitude({ elevationFt: elev, qnh, oat });
      return [line('Altitud presión', `${fmt(r.pressureAlt)} ft`), line('Temperatura ISA', `${fmt(r.isa, 1)} °C`), line('Altitud de densidad', `${fmt(r.density)} ft`)];
    }, 'Regla de cabina: 30 ft por hPa y 120 ft por grado sobre la ISA.'),

    tool('Base de nubes', [['t', 'Temperatura (°C)', 25], ['td', 'Punto de rocío (°C)', 15], ['elev', 'Elevación (ft)', 0]], ({ t, td, elev }) => {
      const agl = cloudBase(t, td);
      return [line('Sobre el terreno', `${fmt(agl)} ft`), line('Sobre el nivel del mar', `${fmt(agl + (elev || 0))} ft`)];
    }, 'Unos 400 ft por grado de diferencia. Sirve para cúmulos de convección, no para nubes frontales.'),

    tool('Distancia de planeo', [['height', 'Altura sobre el terreno (ft)', 3000], ['ratio', 'Relación de planeo (a 1)', 9]], ({ height, ratio }) => {
      const nm = glideDistanceNm(height, ratio);
      return [line('Sin viento', `${fmt(nm, 1)} NM (${fmt(nm * 1.852, 1)} km)`)];
    }, 'Con viento de frente la distancia baja y con viento de cola sube. La relación sale del manual del avión.'),

    converter()));
}

function converter() {
  const groups = Object.keys(UNITS);
  const group = select('group', groups, 'Velocidad');
  const value = input('value', 100, { inputmode: 'decimal', 'aria-label': 'Valor' });
  const from = h('select', { class: 'bt-input', 'aria-label': 'De' });
  const out = h('div', { class: 'bt-result', 'aria-live': 'polite' });
  const fill = () => {
    from.replaceChildren(...Object.keys(UNITS[group.value]).map((unit) => h('option', { value: unit, text: unit })));
    run();
  };
  const run = () => {
    const v = num(value.value);
    out.replaceChildren(...Object.keys(UNITS[group.value]).filter((unit) => unit !== from.value).map((unit) => line(unit, fmt(convert(group.value, v, from.value, unit), 2))));
  };
  group.addEventListener('change', fill);
  value.addEventListener('input', run);
  from.addEventListener('change', run);
  fill();
  return h('section', { class: 'bt-card bt-tool' }, h('h2', { text: 'Unidades' }),
    h('div', { class: 'bt-form' }, field('Magnitud', group), field('Valor', value), field('En', from)), out);
}
