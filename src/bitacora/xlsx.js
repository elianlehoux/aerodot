/**
 * Lee la primera hoja de un .xlsx sin librerías: el archivo es un zip con XML adentro.
 * Se descomprime con DecompressionStream (navegador y Node) y el XML se lee con expresiones,
 * así también corre en las pruebas. Devuelve filas de texto, como parseCsv.
 * Las celdas con formato de fecha salen como AAAA-MM-DD y las de hora como H:MM.
 */

const decoder = new TextDecoder();

async function inflate(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** Los archivos del zip: nombre → función que devuelve su texto. */
function readZip(buffer) {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  let end = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i -= 1) {
    if (view.getUint32(i, true) === 0x06054b50) { end = i; break; }
  }
  if (end < 0) throw new Error('El archivo no es un Excel (.xlsx).');
  const count = view.getUint16(end + 10, true);
  let pos = view.getUint32(end + 16, true);
  const files = new Map();
  for (let n = 0; n < count; n += 1) {
    if (view.getUint32(pos, true) !== 0x02014b50) break;
    const method = view.getUint16(pos + 10, true);
    const size = view.getUint32(pos + 20, true);
    const nameLength = view.getUint16(pos + 28, true);
    const extraLength = view.getUint16(pos + 30, true);
    const commentLength = view.getUint16(pos + 32, true);
    const offset = view.getUint32(pos + 42, true);
    const name = decoder.decode(bytes.subarray(pos + 46, pos + 46 + nameLength));
    files.set(name, async () => {
      const start = offset + 30 + view.getUint16(offset + 26, true) + view.getUint16(offset + 28, true);
      const data = bytes.subarray(start, start + size);
      if (method === 0) return decoder.decode(data);
      if (method === 8) return decoder.decode(await inflate(data));
      throw new Error('El Excel usa una compresión que no se puede leer.');
    });
    pos += 46 + nameLength + extraLength + commentLength;
  }
  return files;
}

const unescape = (text) => text
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
  .replace(/&amp;/g, '&');

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

/** Todo el texto de los <t> de un pedazo de XML (una cadena compartida puede venir partida en varios). */
const texts = (xml) => [...xml.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map((match) => unescape(match[1])).join('');

const columnIndex = (ref) => {
  const letters = ref.match(/^[A-Z]+/)[0];
  let index = 0;
  for (const letter of letters) index = index * 26 + letter.charCodeAt(0) - 64;
  return index - 1;
};

/** Formatos de número de Excel que son fecha u hora: los integrados y los propios con d, m, y, h o s. */
const BUILTIN_DATE = new Set([14, 15, 16, 17, 22]);
const BUILTIN_TIME = new Set([18, 19, 20, 21, 45, 46, 47]);

function styleKinds(stylesXml) {
  if (!stylesXml) return [];
  const custom = new Map([...stylesXml.matchAll(/<numFmt\s[^>]*>/g)].map(([tag]) => [Number(attr(tag, 'numFmtId')), unescape(attr(tag, 'formatCode') ?? '')]));
  const xfs = stylesXml.match(/<cellXfs[^>]*>([\s\S]*?)<\/cellXfs>/)?.[1] ?? '';
  return [...xfs.matchAll(/<xf\s[^>]*>/g)].map(([tag]) => {
    const id = Number(attr(tag, 'numFmtId') ?? 0);
    if (BUILTIN_DATE.has(id)) return id === 22 ? 'datetime' : 'date';
    if (BUILTIN_TIME.has(id)) return 'time';
    const code = custom.get(id)?.replace(/"[^"]*"|\[[^\]]*\]|\\./g, (part) => (/^\[h+\]$/i.test(part) ? 'h' : '')).toLowerCase() ?? '';
    if (/[dy]/.test(code)) return /h/.test(code) ? 'datetime' : 'date';
    if (/h|ss/.test(code)) return 'time';
    return null;
  });
}

const serialDate = (value) => new Date(Date.UTC(1899, 11, 30) + Math.floor(value) * 86400000).toISOString().slice(0, 10);
/** Una hora o una duración: Excel las guarda como fracción de día (0,0625 son 1:30; con [h]:mm pueden pasar de 1). */
const serialTime = (value) => {
  const minutes = Math.round(value * 1440);
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
};

/** Las filas de la primera hoja del libro, como texto. */
export async function readXlsx(buffer) {
  const files = readZip(buffer);
  const read = async (name) => (files.has(name) ? files.get(name)() : null);
  const workbook = await read('xl/workbook.xml');
  if (!workbook) throw new Error('El archivo no es un Excel (.xlsx).');
  const firstSheet = workbook.match(/<sheet\s[^>]*>/)?.[0];
  const relId = firstSheet && attr(firstSheet, 'r:id');
  const rels = (await read('xl/_rels/workbook.xml.rels')) ?? '';
  const target = [...rels.matchAll(/<Relationship\s[^>]*>/g)].map(([tag]) => tag).find((tag) => attr(tag, 'Id') === relId);
  let path = target ? attr(target, 'Target') : 'worksheets/sheet1.xml';
  path = path.startsWith('/') ? path.slice(1) : `xl/${path}`;
  const sheet = await read(path);
  if (!sheet) throw new Error('No se encontró la primera hoja del Excel.');

  const shared = [...((await read('xl/sharedStrings.xml')) ?? '').matchAll(/<si>([\s\S]*?)<\/si>/g)].map((match) => texts(match[1]));
  const kinds = styleKinds(await read('xl/styles.xml'));

  const rows = [];
  for (const [, rowXml] of sheet.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
    const row = [];
    for (const match of rowXml.matchAll(/<c(\s[^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const tag = match[1];
      const body = match[2] ?? '';
      const ref = attr(tag, 'r');
      const index = ref ? columnIndex(ref) : row.length;
      const type = attr(tag, 't');
      const raw = body.match(/<v>([\s\S]*?)<\/v>/)?.[1];
      let value = '';
      if (type === 's') value = shared[Number(raw)] ?? '';
      else if (type === 'inlineStr') value = texts(body);
      else if (type === 'b') value = raw === '1' ? 'sí' : '';
      else if (raw !== undefined) {
        const number = Number(raw);
        const kind = kinds[Number(attr(tag, 's') ?? 0)];
        if (type !== 'str' && type !== 'e' && Number.isFinite(number) && kind === 'date') value = serialDate(number);
        else if (Number.isFinite(number) && kind === 'datetime') value = serialDate(number);
        else if (Number.isFinite(number) && kind === 'time') value = serialTime(number);
        else value = unescape(raw);
      }
      while (row.length < index) row.push('');
      row[index] = value;
    }
    rows.push(row);
  }
  const width = Math.max(0, ...rows.map((row) => row.length));
  return rows.map((row) => Array.from({ length: width }, (_, i) => row[i] ?? '')).filter((row) => row.some((cell) => String(cell).trim()));
}
