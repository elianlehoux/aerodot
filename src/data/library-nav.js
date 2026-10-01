import { chapters } from './library-course.js';

export const libraryGroups = [
  { id: 'vuelo-y-aeronave', title: 'Vuelo y aeronave', chapterIds: [1, 2, 3, 5, 13] },
  { id: 'entorno-de-vuelo', title: 'El entorno de vuelo', chapterIds: [6, 7] },
  { id: 'operacion-y-navegacion', title: 'Operación y navegación', chapterIds: [4, 8, 9, 12] },
  { id: 'decision-y-persona', title: 'Decisión y factores humanos', chapterIds: [10, 11] },
];

const chapterById = Object.fromEntries(chapters.map((chapter) => [chapter.id, chapter]));

const requireChapter = (id, groupId) => {
  const chapter = chapterById[id];
  if (!chapter) throw new Error(`Missing chapter ${id} in library group ${groupId}`);
  return chapter;
};

export function getLibraryNav() {
  return libraryGroups.map((group) => ({
    id: group.id,
    title: group.title,
    chapters: group.chapterIds.map((id) => {
      const chapter = requireChapter(id, group.id);
      return { id: chapter.id, slug: chapter.slug, title: chapter.title };
    }),
  }));
}

/**
 * Orden canónico de lectura de la biblioteca.
 *
 * Es la única secuencia que deben seguir el índice de /temas, el sidebar y la paginación
 * anterior/siguiente de /estudiar/[slug]. Antes esas tres superficies usaban dos órdenes
 * distintos —el de los grupos y el numérico de `chapter.id`— así que "SIGUIENTE" desde un
 * capítulo no llevaba al tema que el índice mostraba a continuación.
 */
export function getLibraryOrder() {
  return libraryGroups.flatMap((group) => group.chapterIds.map((id) => requireChapter(id, group.id)));
}
