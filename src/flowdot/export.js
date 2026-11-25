/** Lo que sale y entra de Flowdot: compartir y copia (.flowdot), importar, imprimir y PNG. */
import { backupFileName, exportFlowdot, fileNameFor, parseFlowdot, planImport } from './file.js';
import { routePath, routePoints, routeSegments, segmentMiddle, segmentPath } from './geometry.js';
import { arrowSegment, arrowTip } from './notes.js';
import { ask, h, pickFiles, toast } from './ui.js';
import { BUNDLED, bundledToSeed } from './bundled.js';

const SVG = 'http://www.w3.org/2000/svg';

function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const link = h('a', { href: url, download: name });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Menú de compartir del sistema si acepta archivos; si no, descarga. */
export async function shareCabins(entries, fileName) {
  const text = await exportFlowdot(entries, new Date());
  const file = new File([text], fileName, { type: 'application/json' });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: fileName });
      return true;
    } catch (error) {
      if (error?.name === 'AbortError') return false;
    }
  }
  download(file, fileName);
  return true;
}

async function decodes(blob) {
  try {
    (await createImageBitmap(blob)).close();
    return true;
  } catch {
    return false;
  }
}

/** Pregunta qué hacer con una cabina que ya existe. */
async function askConflict(cabin) {
  const all = h('input', { type: 'checkbox' });
  const choice = await ask({
    title: `«${cabin.name}» ya está en este dispositivo`,
    text: 'Actualizar pone los flujos del archivo y deja los que ya tenías. Importar nunca borra un flujo.',
    extra: h('label', { class: 'fd-check' }, all, ' Hacer lo mismo con las demás'),
    actions: [
      { label: 'Saltear', value: 'skip' },
      { label: 'Guardar como copia', value: 'copy' },
      { label: 'Actualizar', value: 'update', primary: true },
    ],
  });
  return { choice: choice ?? 'skip', all: all.checked };
}

export async function importFiles(files, store, askFn = askConflict) {
  const entries = [];
  for (const file of files) {
    const parsed = parseFlowdot(await file.text());
    if (!parsed.ok) return { error: files.length > 1 ? `${file.name}: ${parsed.error}` : parsed.error };
    entries.push(...parsed.entries);
  }
  for (const { cabin } of entries) {
    if (!(await decodes(cabin.image.blob))) return { error: `La imagen de la cabina «${cabin.name}» está dañada.` };
  }
  const cabins = await store.listCabins();
  const flows = await store.listAllFlows();
  const existing = { cabinIds: new Set(cabins.map((c) => c.id)), flowCabin: new Map(flows.map((f) => [f.id, f.cabinId])) };
  const decisions = new Map();
  let forAll = null;
  for (const { cabin } of entries) {
    if (!existing.cabinIds.has(cabin.id)) continue;
    if (forAll) { decisions.set(cabin, forAll); continue; }
    const { choice, all } = await askFn(cabin);
    decisions.set(cabin, choice);
    if (all) forAll = choice;
  }
  const ops = planImport(entries, existing, (cabin) => decisions.get(cabin) ?? 'skip', () => crypto.randomUUID());
  await store.apply(ops);
  return { imported: ops.filter((op) => op.type === 'putCabin').length };
}

/** Dibujo de la ruta en px de la imagen: ruta, círculos y números. */
const markSize = (image) => Math.max(14, Math.round(Math.max(image.width, image.height) / 70));
// Para papel y para compartir: el magenta del tema claro, con borde blanco para leerse sobre cualquier foto.
const PRINT_ACCENT = '#b3196f';
// Naranja oscuro para los pasos críticos: se lee sobre blanco y no se confunde con el magenta.
const PRINT_WARN = '#b45309';
const stepName = (step, index) => step.label || `Paso ${index + 1}`;

/** Lo que muestra la lista impresa de un paso: nombre (o "Paso N"), acción y si es crítico. */
export const stepLine = (step, index) => ({ name: stepName(step, index), action: step.action ?? '', critical: step.critical === true });

/** Flechas en la mitad de cada tramo, como en pantalla. */
function arrowPaths(segments, size) {
  return segments.map((segment) => {
    const { px, py, angle } = segmentMiddle(segment);
    const a = (angle * Math.PI) / 180;
    const at = (dx, dy) => `${px + dx * Math.cos(a) - dy * Math.sin(a)} ${py + dx * Math.sin(a) + dy * Math.cos(a)}`;
    return `M${at(-size, -size)}L${at(size, 0)}L${at(-size, size)}`;
  });
}

/**
 * Marcas de ayuda en px de la imagen: flechas como un trazo con su cabeza y etiquetas como texto.
 * `size` es el radio de los círculos de los pasos, para que todo guarde proporción.
 */
export function noteShapes(notes, width, height, size) {
  return (notes ?? []).map((note) => {
    if (note.type === 'label') return { type: 'label', x: note.x * width, y: note.y * height, text: note.text };
    const segment = arrowSegment(note, width, height);
    const tip = arrowTip(segment);
    const a = (tip.angle * Math.PI) / 180;
    const s = size * 0.85;
    const at = (dx, dy) => `${tip.px + dx * Math.cos(a) - dy * Math.sin(a)} ${tip.py + dx * Math.sin(a) + dy * Math.cos(a)}`;
    return { type: 'arrow', d: `${segmentPath(segment)} M${at(-s * 1.4, -s)}L${tip.px} ${tip.py}L${at(-s * 1.4, s)}` };
  });
}

function routeSvg(image, flow) {
  const r = markSize(image);
  const points = routePoints(flow.steps, image.width, image.height);
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', `0 0 ${image.width} ${image.height}`);
  svg.setAttribute('class', 'fd-print-route');
  for (const shape of noteShapes(flow.notes, image.width, image.height, r)) {
    if (shape.type === 'label') {
      const text = document.createElementNS(SVG, 'text');
      Object.entries({ x: shape.x, y: shape.y, 'font-size': r * 1.2, 'stroke-width': r * 0.4, class: 'fd-print-note-text' }).forEach(([k, v]) => text.setAttribute(k, String(v)));
      text.textContent = shape.text;
      svg.append(text);
      continue;
    }
    for (const [cls, width] of [['fd-print-note-halo', r * 0.55], ['fd-print-note', r * 0.22]]) {
      const path = document.createElementNS(SVG, 'path');
      Object.entries({ d: shape.d, 'stroke-width': width, class: cls }).forEach(([k, v]) => path.setAttribute(k, String(v)));
      svg.append(path);
    }
  }
  const d = [routePath(points, image), ...arrowPaths(routeSegments(points, image), r / 2.6)].join(' ');
  for (const [cls, width] of [['fd-print-halo', r / 2.2], ['', r / 4]]) {
    const path = document.createElementNS(SVG, 'path');
    path.setAttribute('d', d);
    path.setAttribute('stroke-width', String(width));
    if (cls) path.setAttribute('class', cls);
    svg.append(path);
  }
  points.forEach((point, index) => {
    const circle = document.createElementNS(SVG, 'circle');
    Object.entries({ cx: point.px, cy: point.py, r, 'stroke-width': r * 0.18 }).forEach(([k, v]) => circle.setAttribute(k, String(v)));
    const label = document.createElementNS(SVG, 'text');
    Object.entries({ x: point.px, y: point.py, 'font-size': r * 1.15 }).forEach(([k, v]) => label.setAttribute(k, String(v)));
    label.textContent = String(index + 1);
    svg.append(circle, label);
    if (flow.steps[point.index]?.critical) {
      const mark = document.createElementNS(SVG, 'circle');
      Object.entries({ cx: point.px + r * 0.78, cy: point.py - r * 0.78, r: r * 0.42, 'stroke-width': r * 0.12, class: 'fd-print-crit' }).forEach(([k, v]) => mark.setAttribute(k, String(v)));
      svg.append(mark);
    }
  });
  return svg;
}

/**
 * Hoja para imprimir o guardar como PDF. No se borra en `afterprint`: algunos navegadores lo disparan
 * antes de armar la impresión y la hoja saldría vacía. En pantalla está oculta; se borra con el
 * próximo toque o tecla, o al imprimir otra vez.
 */
/** Columnas de la lista impresa: pocas y parejas para que se lea de arriba abajo. */
export function printColumns(count) {
  if (!count) return { cols: 0, rows: 0 };
  const cols = count <= 5 ? 1 : count <= 12 ? 2 : 3;
  return { cols, rows: Math.ceil(count / cols) };
}

let clearPrint = null;
export function printFlow(cabin, flow, { list = true } = {}) {
  clearPrint?.();
  const url = URL.createObjectURL(cabin.image.blob);
  const count = flow.steps.length;
  const { rows } = printColumns(count);
  const date = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  const steps = h('ol', { class: 'fd-print-steps', style: `grid-template-rows:repeat(${rows},auto)` },
    flow.steps.map((step, index) => {
      const line = stepLine(step, index);
      return h('li', { class: line.critical ? 'is-critical' : undefined },
        h('span', { class: 'fd-print-num', text: String(index + 1) }),
        h('span', { class: 'fd-print-text' },
          h('span', { text: line.name }),
          line.action ? [h('i', { class: 'fd-print-lead', 'aria-hidden': 'true' }), h('b', { text: line.action })] : null),
        line.critical ? h('span', { class: 'fd-print-warn', 'aria-label': 'Paso crítico', text: '!' }) : null);
    }));
  const sheet = h('section', { class: 'fd-print ph-no-capture' },
    h('header', {},
      h('p', { class: 'fd-print-kicker', text: 'Flujo de cabina' }),
      h('h1', { text: flow.name }),
      h('p', { class: 'fd-print-meta' }, h('span', { text: cabin.name }), h('span', { text: count === 1 ? '1 paso' : `${count} pasos` }))),
    h('div', { class: 'fd-print-figure' }, h('img', { src: url, alt: '' }), routeSvg(cabin.image, flow)),
    list && count ? h('div', { class: 'fd-print-list' }, steps) : null,
    h('footer', { class: 'fd-print-foot' }, h('span', { text: 'Hecho con Flowdot · Aerodot' }), h('span', { text: date })));
  document.body.append(sheet);
  document.body.classList.add('fd-printing');
  const later = ['pointerdown', 'keydown'];
  const cleanup = () => {
    sheet.remove();
    document.body.classList.remove('fd-printing');
    URL.revokeObjectURL(url);
    later.forEach((type) => window.removeEventListener(type, cleanup, true));
    clearPrint = null;
  };
  clearPrint = cleanup;
  sheet.querySelector('img').decode().catch(() => {}).then(() => {
    window.print();
    later.forEach((type) => window.addEventListener(type, cleanup, true));
  });
}

/** Corta un texto con … para que entre en `max` px. */
function fit(context, text, max) {
  if (context.measureText(text).width <= max) return text;
  let end = text.length;
  while (end > 1 && context.measureText(`${text.slice(0, end)}…`).width > max) end -= 1;
  return `${text.slice(0, end)}…`;
}

/** Parte un texto en renglones de hasta `max` px; el último se corta con … si sobra. */
function wrap(context, text, max, limit = 2) {
  const lines = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && context.measureText(next).width > max) { lines.push(line); line = word; } else line = next;
  }
  if (line) lines.push(line);
  if (lines.length <= limit) return lines;
  return [...lines.slice(0, limit - 1), fit(context, lines.slice(limit - 1).join(' '), max)];
}

/**
 * Imagen con el mismo diseño que la hoja impresa: título, cabina con la ruta, lista en columnas y pie.
 * Se mide en "mm" de una hoja A4 para que las proporciones sean las del PDF; la foto sale al menos a 2400 px.
 */
export async function downloadPng(cabin, flow, { list = true } = {}) {
  const photoWidth = Math.max(2400, cabin.image.width);
  const photoHeight = Math.round(cabin.image.height * (photoWidth / cabin.image.width));
  const mm = photoWidth / 180;
  const width = Math.round(photoWidth + mm * 30);
  const left = mm * 15;
  const steps = flow.steps;
  const count = steps.length;
  const sans = (weight, size) => `${weight} ${Math.round(size)}px "Source Sans 3", sans-serif`;
  const serif = (size) => `600 ${Math.round(size)}px Newsreader, Georgia, serif`;
  await Promise.all([sans(400, 40), sans(700, 40), serif(40)].map((font) => document.fonts?.load(font).catch(() => {})));

  // Medidas de la lista antes de dibujar, para saber el alto total.
  const measure = h('canvas').getContext('2d');
  measure.font = sans(400, mm * 3.7);
  const { cols, rows } = list ? printColumns(count) : { cols: 0, rows: 0 };
  const gap = mm * 9;
  const colWidth = cols ? (photoWidth - gap * (cols - 1)) / cols : 0;
  const textWidth = colWidth - mm * 8.4;
  const lineHeight = mm * 5;
  const lines = steps.map(stepLine);
  measure.font = sans(700, mm * 3.7);
  const actionWidths = lines.map((line) => (line.action ? Math.min(textWidth * 0.45, measure.measureText(line.action).width + mm * 3) : 0));
  measure.font = sans(400, mm * 3.7);
  const items = list ? lines.map((line, index) => wrap(measure, line.name, textWidth - actionWidths[index])) : [];
  const rowHeights = Array.from({ length: rows }, (_, row) => {
    const lines = Math.max(1, ...Array.from({ length: cols }, (_, col) => items[col * rows + row]?.length ?? 0));
    return mm * 4 + Math.max(mm * 5.4, lines * lineHeight);
  });

  const top = mm * 15;
  const photoTop = top + mm * 25;
  const listTop = photoTop + photoHeight + mm * 7;
  const listHeight = rowHeights.reduce((a, b) => a + b, 0);
  const footTop = (rows ? listTop + listHeight : photoTop + photoHeight) + mm * 8;
  const height = Math.round(footTop + mm * 13);
  const canvas = h('canvas', { width, height });
  const context = canvas.getContext('2d');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.textBaseline = 'alphabetic';
  const hairline = (y) => { context.fillStyle = '#e3e5e8'; context.fillRect(left, y, photoWidth, Math.max(1, mm * 0.2)); };

  // Encabezado.
  context.fillStyle = PRINT_ACCENT;
  context.font = sans(700, mm * 2.8);
  if ('letterSpacing' in context) context.letterSpacing = `${Math.round(mm * 0.4)}px`;
  context.fillText('FLUJO DE CABINA', left, top + mm * 2.8);
  if ('letterSpacing' in context) context.letterSpacing = '0px';
  context.fillStyle = '#1b1e22';
  context.font = serif(mm * 8.5);
  context.fillText(fit(context, flow.name, photoWidth), left, top + mm * 12);
  context.fillStyle = '#5b6168';
  context.font = sans(400, mm * 3.7);
  context.fillText(fit(context, `${cabin.name}  ·  ${count === 1 ? '1 paso' : `${count} pasos`}`, photoWidth), left, top + mm * 18);

  // Foto con bordes redondeados y un filo gris.
  const bitmap = await createImageBitmap(cabin.image.blob);
  const radius = mm * 3;
  context.save();
  context.beginPath();
  context.roundRect(left, photoTop, photoWidth, photoHeight, radius);
  context.clip();
  context.imageSmoothingQuality = 'high';
  context.drawImage(bitmap, left, photoTop, photoWidth, photoHeight);
  context.restore();
  bitmap.close();
  context.beginPath();
  context.roundRect(left, photoTop, photoWidth, photoHeight, radius);
  context.lineWidth = Math.max(1, mm * 0.25);
  context.strokeStyle = '#d9dce0';
  context.stroke();

  // Ruta con halo blanco, flechas y círculos numerados.
  const dot = (x, y, r, text, ring) => {
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2);
    context.fillStyle = PRINT_ACCENT;
    context.fill();
    if (ring) { context.lineWidth = r * 0.18; context.strokeStyle = '#ffffff'; context.stroke(); }
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = sans(700, r * 1.15);
    context.fillText(text, x, y + r * 0.05);
    context.textAlign = 'left';
    context.textBaseline = 'alphabetic';
  };
  const r = markSize({ width: photoWidth, height: photoHeight });
  const points = routePoints(steps, photoWidth, photoHeight);
  const bounds = { width: photoWidth, height: photoHeight };
  const route = new Path2D([routePath(points, bounds), ...arrowPaths(routeSegments(points, bounds), r / 2.6)].join(' '));
  context.save();
  context.translate(left, photoTop);
  context.lineCap = 'round';
  context.lineJoin = 'round';
  // Marcas de ayuda, debajo de la ruta: blancas con halo oscuro.
  for (const shape of noteShapes(flow.notes, photoWidth, photoHeight, r)) {
    if (shape.type === 'label') {
      context.font = sans(700, r * 1.2);
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.lineWidth = r * 0.4;
      context.strokeStyle = 'rgba(20,24,28,.8)';
      context.strokeText(shape.text, shape.x, shape.y);
      context.fillStyle = '#ffffff';
      context.fillText(shape.text, shape.x, shape.y);
      context.textAlign = 'left';
      context.textBaseline = 'alphabetic';
      continue;
    }
    const path = new Path2D(shape.d);
    context.strokeStyle = 'rgba(20,24,28,.7)';
    context.lineWidth = r * 0.55;
    context.stroke(path);
    context.strokeStyle = '#ffffff';
    context.lineWidth = r * 0.22;
    context.stroke(path);
  }
  context.strokeStyle = 'rgba(255,255,255,.8)';
  context.lineWidth = r / 2.2;
  context.stroke(route);
  context.strokeStyle = PRINT_ACCENT;
  context.lineWidth = r / 4;
  context.stroke(route);
  points.forEach((point, index) => {
    dot(point.px, point.py, r, String(index + 1), true);
    if (!steps[point.index]?.critical) return;
    context.beginPath();
    context.arc(point.px + r * 0.78, point.py - r * 0.78, r * 0.42, 0, Math.PI * 2);
    context.fillStyle = PRINT_WARN;
    context.fill();
    context.lineWidth = r * 0.12;
    context.strokeStyle = '#ffffff';
    context.stroke();
  });
  context.restore();

  // Lista en columnas parejas, de arriba abajo, con una línea fina entre pasos.
  let y = listTop;
  rowHeights.forEach((rowHeight, row) => {
    for (let col = 0; col < cols; col += 1) {
      const index = col * rows + row;
      if (index >= count) continue;
      const x = left + col * (colWidth + gap);
      context.fillStyle = '#e3e5e8';
      context.fillRect(x, y, colWidth, Math.max(1, mm * 0.2));
      dot(x + mm * 2.7, y + mm * 2 + mm * 2.7, mm * 2.7, String(index + 1), false);
      context.fillStyle = '#1b1e22';
      context.font = sans(400, mm * 3.7);
      items[index].forEach((text, i) => context.fillText(text, x + mm * 8.4, y + mm * 2 + mm * 4 + i * lineHeight));
      const line = lines[index];
      if (line.action) {
        context.font = sans(700, mm * 3.7);
        context.textAlign = 'right';
        context.fillText(fit(context, line.action, actionWidths[index] - mm * 3), x + colWidth, y + mm * 2 + mm * 4);
        context.textAlign = 'left';
        context.font = sans(400, mm * 3.7);
      }
      if (line.critical) {
        context.beginPath();
        context.arc(x + mm * 5.2, y + mm * 2 + mm * 0.6, mm * 1.25, 0, Math.PI * 2);
        context.fillStyle = PRINT_WARN;
        context.fill();
        context.fillStyle = '#ffffff';
        context.font = sans(700, mm * 1.9);
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('!', x + mm * 5.2, y + mm * 2 + mm * 0.7);
        context.textAlign = 'left';
        context.textBaseline = 'alphabetic';
        context.fillStyle = '#1b1e22';
        context.font = sans(400, mm * 3.7);
      }
    }
    y += rowHeight;
  });

  // Pie.
  hairline(footTop);
  context.fillStyle = '#8a9097';
  context.font = sans(400, mm * 3);
  context.fillText('Hecho con Flowdot · Aerodot', left, footTop + mm * 7);
  context.textAlign = 'right';
  context.fillText(new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()), left + photoWidth, footTop + mm * 7);
  context.textAlign = 'left';

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  download(blob, fileNameFor(flow.name).replace(/\.flowdot$/, '.png'));
}

/** Acciones de archivo que usan las pantallas, con sus avisos. */
export function createIo({ store, track }) {
  const entriesFor = async (cabins) => Promise.all(cabins.map(async (cabin) => ({ cabin, flows: await store.listFlows(cabin.id) })));
  const visibleCabins = async () => (await store.listCabins()).filter((cabin) => !cabin.hidden);

  /** Guarda las cabinas de prueba pedidas que no estén en el dispositivo. Nunca pisa una que ya está. */
  async function addBundled(items) {
    for (const item of items) {
      const response = await fetch(item.file);
      // La de desarrollo puede no estar en esta máquina: se saltea sin cortar las demás.
      if (!response.ok && item.optional) continue;
      if (!response.ok) throw new Error(String(response.status));
      const parsed = parseFlowdot(await response.text());
      if (!parsed.ok) throw new Error(parsed.error);
      const cabins = await store.listCabins();
      const flows = await store.listAllFlows();
      const existing = { cabinIds: new Set(cabins.map((c) => c.id)), flowCabin: new Map(flows.map((f) => [f.id, f.cabinId])) };
      await store.apply(planImport(parsed.entries, existing, () => 'skip', () => crypto.randomUUID()));
    }
  }

  async function runImport(files) {
    if (!files.length) return;
    try {
      const result = await importFiles(files, store);
      if (result.error) return toast(result.error);
      track('flowdot_imported', { cabins: result.imported });
      toast(result.imported === 1 ? 'Se importó 1 cabina.' : `Se importaron ${result.imported} cabinas.`);
    } catch {
      toast('No se pudo importar el archivo.');
    }
  }

  return {
    importFiles: runImport,
    /** La primera vez, carga las cabinas de prueba. Sin conexión no pasa nada: se reintenta la próxima. */
    async seedBundled() {
      try {
        const seen = (await store.getMeta('bundledSeen')) ?? [];
        const existingIds = new Set((await store.listCabins()).map((cabin) => cabin.id));
        await addBundled(bundledToSeed(seen, existingIds));
        await store.setMeta('bundledSeen', BUNDLED.map((item) => item.id));
      } catch { /* Sin las de prueba la lista igual funciona. */ }
    },
    /** Vuelve a mostrar las cabinas de prueba: las ocultas reaparecen y las que faltan se cargan. */
    async showBundled(after) {
      try {
        const cabins = await store.listCabins();
        for (const cabin of cabins) {
          if (cabin.hidden) await store.putCabin({ ...cabin, hidden: false });
        }
        await addBundled(BUNDLED.filter((item) => !cabins.some((cabin) => cabin.id === item.id)));
      } catch {
        toast('No se pudieron cargar las cabinas de prueba. Probá con conexión.');
      }
      after?.();
    },
    async importPicked(after) {
      await runImport(await pickFiles('.flowdot,application/json', true));
      after?.();
    },
    async shareCabin(cabin) {
      const entries = await entriesFor([cabin]);
      const all = (await visibleCabins()).length === 1;
      if (await shareCabins(entries, fileNameFor(cabin.name))) {
        if (all) await store.setMeta('lastBackupAt', Date.now());
        track('flowdot_exported', { cabins: 1 });
      }
    },
    async backupAll(after) {
      const cabins = await visibleCabins();
      if (!cabins.length) return;
      if (await shareCabins(await entriesFor(cabins), backupFileName(new Date()))) {
        await store.setMeta('lastBackupAt', Date.now());
        track('flowdot_exported', { cabins: cabins.length });
        after?.();
      }
    },
    /** Copia de un flujo tal como está en pantalla, aunque no se haya podido guardar. */
    async shareFlow(cabin, flow) {
      try {
        if (await shareCabins([{ cabin, flows: [flow] }], fileNameFor(flow.name))) track('flowdot_exported', { cabins: 1 });
      } catch {
        toast('No se pudo armar la copia.');
      }
    },
    printFlow,
    downloadPng: (cabin, flow, options) => downloadPng(cabin, flow, options).catch(() => toast('No se pudo armar la imagen.')),
  };
}
