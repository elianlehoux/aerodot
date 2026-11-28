/** Documentos con vencimiento: licencias, certificado médico, habilitaciones, pasaporte. Puro. */

export const DOC_CATEGORIES = [
  'Licencia',
  'Certificado médico (CMA)',
  'Habilitación de clase o tipo',
  'Habilitación de vuelo por instrumentos',
  'Habilitación de instructor',
  'Competencia lingüística (inglés)',
  'Verificación de competencia',
  'Curso periódico o readaptación',
  'Credencial aeroportuaria',
  'Pasaporte',
  'Visa',
  'Seguro',
  'Otro',
];

export const DEFAULT_WARN_DAYS = 60;

const day = (iso) => Date.parse(`${iso}T00:00:00Z`) / 86400000;

/**
 * Estado de un documento a una fecha: 'sin-vencimiento', 'vigente', 'por-vencer' o 'vencido',
 * con los días que faltan (negativos si ya venció).
 */
export function docStatus(doc, today = new Date().toISOString().slice(0, 10)) {
  if (!doc.expires || !/^\d{4}-\d{2}-\d{2}$/.test(doc.expires)) return { state: 'sin-vencimiento', days: null };
  const days = Math.round(day(doc.expires) - day(today));
  const warn = Number.isFinite(Number(doc.warnDays)) && doc.warnDays !== '' ? Number(doc.warnDays) : DEFAULT_WARN_DAYS;
  if (days < 0) return { state: 'vencido', days };
  if (days <= warn) return { state: 'por-vencer', days };
  return { state: 'vigente', days };
}

export function statusText({ state, days }) {
  if (state === 'sin-vencimiento') return 'Sin vencimiento';
  if (state === 'vencido') return days === -1 ? 'Venció ayer' : `Venció hace ${-days} días`;
  if (days === 0) return 'Vence hoy';
  if (days === 1) return 'Vence mañana';
  return `Vence en ${days} días`;
}

/** Los que necesitan atención, primero los vencidos y después los más próximos. */
export function alerts(docs, today) {
  return docs
    .map((doc) => ({ doc, status: docStatus(doc, today) }))
    .filter(({ status }) => status.state === 'vencido' || status.state === 'por-vencer')
    .sort((a, b) => a.status.days - b.status.days);
}
