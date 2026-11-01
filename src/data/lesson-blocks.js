/**
 * Formato de los párrafos de una lección. El cuerpo se parte en párrafos con una línea en blanco,
 * y cada párrafo es de un tipo según cómo empieza:
 *
 * - "US: …" es una nota sobre Estados Unidos.
 * - "EQ: fórmula | símbolo: significado | …" es una ecuación con sus términos. "_X" es subíndice.
 * - "TABLA: encabezado | encabezado\nfila | fila" es una tabla: la primera línea es el encabezado,
 *   cada línea siguiente es una fila y " | " separa las celdas.
 * - Una lista: una línea opcional que termina en «:» y después ítems "- …" (sin orden) o
 *   "1. …" (con orden), uno por línea.
 * - Cualquier otro párrafo es texto.
 */
const BULLET = /^- (.+)$/;
const NUMBERED = /^\d+\. (.+)$/;

export function parseParagraph(paragraph) {
  if (paragraph.startsWith('US: ')) return { kind: 'us', text: paragraph.slice(4) };
  if (paragraph.startsWith('EQ: ')) {
    const [formula, ...terms] = paragraph.slice(4).split(' | ');
    return { kind: 'eq', formula, terms: terms.map((term) => { const i = term.indexOf(': '); return [term.slice(0, i), term.slice(i + 2)]; }) };
  }
  if (paragraph.startsWith('TABLA: ')) {
    const [head, ...rows] = paragraph.slice(7).split('\n').map((line) => line.split(' | '));
    rows.forEach((row) => { if (row.length !== head.length) throw new Error(`Fila de tabla con ${row.length} celdas en vez de ${head.length}: ${row.join(' | ')}`); });
    return { kind: 'table', head, rows };
  }
  const lines = paragraph.split('\n');
  if (lines.length > 1) {
    const lead = BULLET.test(lines[0]) || NUMBERED.test(lines[0]) ? null : lines[0];
    const items = lead === null ? lines : lines.slice(1);
    const ordered = NUMBERED.test(items[0]);
    const pattern = ordered ? NUMBERED : BULLET;
    if ((lead === null || lead.endsWith(':')) && items.length > 0 && items.every((line) => pattern.test(line))) {
      return { kind: 'list', lead, ordered, items: items.map((line) => line.match(pattern)[1]) };
    }
  }
  return { kind: 'text', text: paragraph };
}

export const lessonDiagrams = (lesson) => (Array.isArray(lesson[3]) ? lesson[3] : lesson[3] ? [lesson[3]] : []);
