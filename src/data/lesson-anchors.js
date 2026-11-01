/**
 * Anclas de las lecciones de la biblioteca.
 *
 * Cada lección se enlaza por un slug de su título, no por su posición: así reordenar o fusionar
 * lecciones no rompe los enlaces. Los enlaces viejos (#leccion-N) siguen andando con
 * `legacyAnchors`, que el capítulo declara cuando cambió su orden.
 */
export const slugify = (text) => text
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

/** Slugs únicos para las lecciones de un capítulo, en orden. Un repetido lleva -2, -3… */
export function lessonSlugs(lessons) {
  const seen = new Map();
  return lessons.map(([title]) => {
    const base = slugify(title) || 'leccion';
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  });
}

/**
 * Anclas viejas de un capítulo: { 'leccion-N': slug }. Si el capítulo no declara un mapa, el orden
 * no cambió y leccion-N apunta a la lección N.
 */
export function legacyAnchorMap(chapter) {
  const slugs = lessonSlugs(chapter.lessons);
  const map = chapter.legacyAnchors ?? Object.fromEntries(slugs.map((slug, i) => [`leccion-${i + 1}`, slug]));
  for (const [anchor, slug] of Object.entries(map)) {
    if (!slugs.includes(slug)) throw new Error(`${chapter.slug}: el ancla vieja #${anchor} apunta a «${slug}», que no existe`);
  }
  return map;
}
