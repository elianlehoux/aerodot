/**
 * Plan de vuelo OACI (formato del Doc 4444, casillas 7 a 19): revisar los campos y armar el mensaje FPL.
 * Puro, sin DOM. Los códigos se guardan en mayúsculas y sin espacios de más.
 */

export const emptyPlan = () => ({
  id: undefined,
  name: '',
  acid: '', rules: 'V', flightType: 'G',
  count: '', acType: '', wake: 'L', equipment: 'S', surveillance: 'C',
  adep: '', eobt: '',
  speed: '', level: 'VFR', route: 'DCT',
  ades: '', eet: '', altn1: '', altn2: '',
  other: '',
  endurance: '', persons: '', radioU: false, radioV: true, radioE: true,
  survival: false, survP: false, survD: false, survM: false, survJ: false,
  jackets: false, jackL: false, jackF: false, jackU: false, jackV: false,
  dinghies: false, dinghyCount: '', dinghyCapacity: '', dinghyCover: false, dinghyColour: '',
  colour: '', remarks: '', pic: '',
});

const up = (value) => String(value ?? '').toUpperCase().trim().replace(/\s+/g, ' ');

/** Limpia los códigos: mayúsculas y sin guiones en la identificación (LV-ABC pasa a LVABC). */
export function cleanPlan(plan) {
  const clean = { ...emptyPlan(), ...plan };
  for (const key of ['acid', 'rules', 'flightType', 'acType', 'wake', 'equipment', 'surveillance', 'adep', 'eobt', 'speed', 'level', 'route', 'ades', 'eet', 'altn1', 'altn2', 'other', 'endurance', 'persons', 'dinghyColour', 'colour', 'remarks', 'pic']) {
    clean[key] = up(clean[key]);
  }
  clean.acid = clean.acid.replace(/[-\s]/g, '');
  clean.count = String(clean.count ?? '').trim();
  return clean;
}

const hhmm = /^([01]\d|2[0-3])[0-5]\d$/;
const duration = /^\d{2}[0-5]\d$/;
const aerodrome = /^[A-Z]{4}$/;

/** Lo que falta o está mal. Cada aviso dice la casilla y qué hay que poner. */
export function validatePlan(input) {
  const plan = cleanPlan(input);
  const issues = [];
  const need = (ok, item, text) => { if (!ok) issues.push({ item, text }); };
  need(/^[A-Z0-9]{2,7}$/.test(plan.acid), 7, 'Identificación de la aeronave: la matrícula sin guion (LVABC), hasta 7 caracteres.');
  need(['I', 'V', 'Y', 'Z'].includes(plan.rules), 8, 'Reglas de vuelo: I, V, Y o Z.');
  need(['S', 'N', 'G', 'M', 'X'].includes(plan.flightType), 8, 'Tipo de vuelo: S, N, G, M o X.');
  need(plan.count === '' || /^([2-9]|[1-9]\d)$/.test(plan.count), 9, 'Número de aeronaves: solo si son dos o más.');
  need(/^[A-Z][A-Z0-9]{1,3}$/.test(plan.acType), 9, 'Tipo de aeronave: el designador OACI (C152, PA28, B738) o ZZZZ.');
  need(['L', 'M', 'H', 'J'].includes(plan.wake), 9, 'Estela turbulenta: L, M, H o J.');
  need(/^(N|[A-Z0-9]+)$/.test(plan.equipment), 10, 'Equipo: N si no lleva, o las letras del equipo (S, G, O, D…).');
  need(/^(N|[A-Z0-9]+)$/.test(plan.surveillance), 10, 'Vigilancia: N o el código del transpondedor (C, S…).');
  need(aerodrome.test(plan.adep), 13, 'Aeródromo de salida: el indicador OACI de cuatro letras o ZZZZ.');
  need(hhmm.test(plan.eobt), 13, 'Hora prevista fuera de calzos: HHMM en UTC.');
  need(/^(N\d{4}|K\d{4}|M\d{3})$/.test(plan.speed), 15, 'Velocidad de crucero: N y cuatro cifras en nudos (N0100), K en km/h o M en Mach.');
  need(/^(F\d{3}|S\d{4}|A\d{3}|M\d{4}|VFR)$/.test(plan.level), 15, 'Nivel: F085, A045, S1130, M0840 o VFR.');
  need(plan.route.length > 0, 15, 'Ruta: puntos y aerovías, o DCT si es directo.');
  need(aerodrome.test(plan.ades), 16, 'Aeródromo de destino: el indicador OACI de cuatro letras o ZZZZ.');
  need(duration.test(plan.eet), 16, 'Duración total prevista: HHMM.');
  need(!plan.altn1 || aerodrome.test(plan.altn1), 16, 'Primer alternativa: cuatro letras.');
  need(!plan.altn2 || aerodrome.test(plan.altn2), 16, 'Segunda alternativa: cuatro letras.');
  need(duration.test(plan.endurance), 19, 'Autonomía: HHMM.');
  need(/^(\d{1,3}|TBN)$/.test(plan.persons), 19, 'Personas a bordo: un número o TBN.');
  need(plan.pic.length > 0, 19, 'Piloto al mando: nombre y apellido.');
  if (plan.acType === 'ZZZZ') need(/\bTYP\//.test(plan.other), 18, 'Con tipo ZZZZ hay que poner TYP/ en la casilla 18.');
  if (plan.adep === 'ZZZZ') need(/\bDEP\//.test(plan.other), 18, 'Con salida ZZZZ hay que poner DEP/ en la casilla 18.');
  if (plan.ades === 'ZZZZ') need(/\bDEST\//.test(plan.other), 18, 'Con destino ZZZZ hay que poner DEST/ en la casilla 18.');
  if (plan.rules !== 'V') need(plan.level !== 'VFR', 15, 'Un vuelo IFR o mixto necesita un nivel, no VFR.');
  return issues;
}

/** Las listas de equipo de supervivencia de la casilla 19, en el orden del formulario. */
export function supplementary(input) {
  const plan = cleanPlan(input);
  const parts = [`E/${plan.endurance}`, `P/${plan.persons}`];
  const radios = [['U', plan.radioU], ['V', plan.radioV], ['E', plan.radioE]].filter(([, on]) => on).map(([code]) => code).join('');
  if (radios) parts.push(`R/${radios}`);
  if (plan.survival) parts.push(`S/${[['P', plan.survP], ['D', plan.survD], ['M', plan.survM], ['J', plan.survJ]].filter(([, on]) => on).map(([code]) => code).join('')}`);
  if (plan.jackets) parts.push(`J/${[['L', plan.jackL], ['F', plan.jackF], ['U', plan.jackU], ['V', plan.jackV]].filter(([, on]) => on).map(([code]) => code).join('')}`);
  if (plan.dinghies) parts.push(`D/${[plan.dinghyCount, plan.dinghyCapacity, plan.dinghyCover ? 'C' : '', plan.dinghyColour].filter(Boolean).join(' ')}`);
  if (plan.colour) parts.push(`A/${plan.colour}`);
  if (plan.remarks) parts.push(`N/${plan.remarks}`);
  parts.push(`C/${plan.pic}`);
  return parts.join(' ');
}

/** El mensaje FPL, casillas 7 a 18. La 19 queda en la oficina ARO y se muestra aparte. */
export function fplMessage(input) {
  const plan = cleanPlan(input);
  const alternates = [plan.altn1, plan.altn2].filter(Boolean).join(' ');
  return [
    `(FPL-${plan.acid}-${plan.rules}${plan.flightType}`,
    `-${plan.count}${plan.acType}/${plan.wake}-${plan.equipment}/${plan.surveillance}`,
    `-${plan.adep}${plan.eobt}`,
    `-${plan.speed}${plan.level} ${plan.route}`,
    `-${plan.ades}${plan.eet}${alternates ? ` ${alternates}` : ''}`,
    `-${plan.other || '0'})`,
  ].join('\n');
}

/** Datos del plan que salen de una aeronave guardada. */
export function planFromAircraft(plane) {
  return {
    acid: String(plane.reg ?? '').replace(/-/g, '').toUpperCase(),
    acType: String(plane.type ?? '').toUpperCase(),
    wake: plane.wake || 'L',
    equipment: plane.equipment || 'S',
    surveillance: plane.surveillance || 'C',
    colour: plane.colour || '',
  };
}
