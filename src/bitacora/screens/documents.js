/** Documentos: licencias, CMA, habilitaciones y lo que venza, con aviso y archivo adjunto opcional. */
import { DEFAULT_WARN_DAYS, DOC_CATEGORIES, docStatus, statusText } from '../documents.js';
import { btn, chip, confirm, dialog, empty, field, formatDate, h, input, pickFiles, readForm, select, toast, todayIso } from '../ui.js';

const MAX_FILE = 15 * 1024 * 1024;
const TONE = { vencido: 'bad', 'por-vencer': 'warn', vigente: 'ok' };

async function editDocument(ctx, doc = {}) {
  let file = doc.file ?? null;
  let fileName = doc.fileName ?? '';
  const fileLabel = h('span', { class: 'bt-note' });
  const showFile = () => { fileLabel.textContent = file ? `Adjunto: ${fileName || 'archivo'}` : 'Sin archivo adjunto.'; };
  showFile();
  const attach = btn('Adjuntar foto o PDF', async () => {
    const [picked] = await pickFiles('image/*,application/pdf');
    if (!picked) return;
    if (picked.size > MAX_FILE) return toast('El archivo pasa los 15 MB.');
    file = picked;
    fileName = picked.name;
    showFile();
  });
  const drop = btn('Quitar archivo', () => { file = null; fileName = ''; showFile(); });

  const form = h('form', { class: 'bt-form', novalidate: true },
    field('Tipo', select('category', doc.category && !DOC_CATEGORIES.includes(doc.category) ? [doc.category, ...DOC_CATEGORIES] : DOC_CATEGORIES, doc.category || 'Licencia')),
    field('Nombre', input('name', doc.name, { placeholder: 'Piloto privado de avión' })),
    field('Número', input('number', doc.number, { placeholder: 'Opcional' })),
    field('Emitido', input('issued', doc.issued, { type: 'date' })),
    field('Vence', input('expires', doc.expires, { type: 'date' }), { hint: 'Vacío si no vence.' }),
    field('Avisar con', select('warnDays', [[15, '15 días'], [30, '30 días'], [60, '60 días'], [90, '90 días'], [120, '120 días']], doc.warnDays ?? DEFAULT_WARN_DAYS)),
    field('Notas', h('textarea', { class: 'bt-input', name: 'notes', rows: 2, text: doc.notes ?? '' }), { wide: true }),
    h('div', { class: 'bt-field is-wide' }, h('div', { class: 'bt-actions' }, attach, drop), fileLabel));
  const actions = [
    doc.id ? { value: 'delete', label: 'Borrar', kind: 'danger' } : null,
    { value: 'save', label: 'Guardar', kind: 'primary' },
  ].filter(Boolean);
  const choice = await dialog({ title: doc.id ? doc.name || doc.category : 'Nuevo documento', body: form, actions, wide: true });
  if (choice === 'delete') {
    if (await confirm('Borrar el documento', 'Se borra de este dispositivo junto con el archivo adjunto.')) await ctx.store.remove('documents', doc.id);
    return;
  }
  if (choice !== 'save') return;
  const data = readForm(form);
  data.warnDays = Number(data.warnDays);
  if (!data.name) data.name = data.category;
  await ctx.store.put('documents', { ...doc, ...data, file, fileName });
  toast('Documento guardado.');
}

export async function renderDocuments(view, ctx) {
  const docs = await ctx.store.all('documents');
  const today = todayIso();
  const after = () => ctx.refresh();
  const urls = [];
  const sorted = docs.map((doc) => ({ doc, status: docStatus(doc, today) }))
    .sort((a, b) => (a.status.days ?? Infinity) - (b.status.days ?? Infinity));

  view.append(
    h('div', { class: 'bt-toolbar' }, btn('Agregar documento', async () => { await editDocument(ctx); after(); }, 'primary')),
    sorted.length
      ? h('div', { class: 'bt-cards' }, sorted.map(({ doc, status }) => {
        let open = null;
        if (doc.file instanceof Blob) {
          const url = URL.createObjectURL(doc.file);
          urls.push(url);
          open = h('a', { class: 'bt-link', href: url, target: '_blank', rel: 'noopener', text: 'Ver archivo', onclick: (event) => event.stopPropagation() });
        }
        return h('div', { class: 'bt-card bt-item' },
          h('button', { type: 'button', class: 'bt-item-main', onclick: async () => { await editDocument(ctx, doc); after(); } },
            h('span', { class: 'bt-note', text: doc.category }),
            h('strong', { class: 'bt-item-title', text: doc.name || doc.category }),
            doc.number ? h('span', { text: `N.º ${doc.number}` }) : null,
            h('span', { class: 'bt-item-foot' }, chip(statusText(status), TONE[status.state]), doc.expires ? h('span', { class: 'bt-note', text: ` ${formatDate(doc.expires)}` }) : null)),
          open);
      }))
      : empty('Cargá la licencia, el certificado médico y las habilitaciones con su vencimiento. La Bitácora te avisa en el resumen cuando se acerca la fecha.'),
    h('p', { class: 'bt-note', text: 'Los archivos quedan solo en este dispositivo y entran en la copia de seguridad.' }));
  return () => urls.forEach((url) => URL.revokeObjectURL(url));
}
