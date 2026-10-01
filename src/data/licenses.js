/** @typedef {{ slug: string, code: string, title: string, available: boolean, practiceOnly: boolean, sourcePageUrl: string, sourcePdfUrl?: string, sourceLabel: string, sourceNote: string, testSize: number, regulatoryReferenceUrl?: string, regulatoryReferenceTitle?: string }} License */

/**
 * Catálogo de exámenes. Esta es la ÚNICA fuente de `testSize`, `practiceOnly` y de las URLs de
 * referencia: los JSON de `src/data/exam-banks/` arrastran copias de esos mismos campos, pero
 * no los lee nadie en runtime. Si divergen, el que manda es este archivo.
 */
const examIndex = 'https://www.argentina.gob.ar/anac/personal-aeronautico/examenes';

/** @type {License[]} */
export const licenses = [
  {
    slug: 'ppa', code: 'PPA', title: 'Piloto Privado de Avión', available: true, practiceOnly: false,
    sourcePageUrl: 'https://www.argentina.gob.ar/anac/personal-aeronautico/examenes/ppa-piloto-privado-de-avion',
    sourcePdfUrl: 'https://www.argentina.gob.ar/sites/default/files/2021/05/preguntas-todos-los-capitulos-ppa.pdf',
    sourceLabel: 'Banco público de preguntas PPA · ANAC',
    sourceNote: 'Se conserva la selección de preguntas de ANAC. Algunas claves siguen en revisión; la normativa y los materiales publicados pueden cambiar.',
    testSize: 100,
  },
  {
    slug: 'pca-hvi', code: 'PCA', title: 'Piloto Comercial con habilitación de vuelo por instrumentos', available: true, practiceOnly: false,
    sourcePageUrl: 'https://www.argentina.gob.ar/anac/personal-aeronautico/examenes/piloto-comercial-con-habilitacion-de-vuelo-por-instrumentos',
    sourcePdfUrl: 'https://www.argentina.gob.ar/sites/default/files/2021/05/pc-hvi.pdf',
    sourceLabel: 'Preguntas y respuestas públicas PCA con HVI · ANAC',
    sourceNote: 'Las preguntas y la opción marcada salen del cuestionario público de ANAC (Resolución 306/2014). ANAC avisa que el banco puede modificarse. El simulacro toma 100 preguntas, como TCEXAM, y el 75% es la referencia publicada de aprobación.',
    testSize: 100,
  },
  {
    slug: 'tla', code: 'TLA', title: 'Piloto de Transporte de Línea Aérea', available: true, practiceOnly: false,
    sourcePageUrl: 'https://www.argentina.gob.ar/anac/personal-aeronautico/examenes/piloto-comercial-de-primera-clase',
    sourcePdfUrl: 'https://www.argentina.gob.ar/sites/default/files/2021/05/primera-clase.pdf',
    sourceLabel: 'Cuestionario público TLA · ANAC',
    sourceNote: 'La Resolución ANAC 957/2025 indica que la nueva edición de la RAAC Parte 61 eliminó la licencia de piloto comercial de primera clase. Las preguntas son las del cuestionario que ANAC sigue publicando con ese título, con la opción marcada en el PDF.',
    testSize: 100,
  },
  {
    slug: 'iva', code: 'IVA', title: 'Instructor de Vuelo de Avión', available: true, practiceOnly: false,
    sourcePageUrl: 'https://www.argentina.gob.ar/examenes/instructor-de-vuelo-avion',
    sourcePdfUrl: 'https://www.argentina.gob.ar/sites/default/files/2021/05/instructor-de-vuelo-2015.pdf',
    sourceLabel: 'Cuestionario público IVA · ANAC',
    sourceNote: 'Las preguntas y la opción marcada salen del cuestionario público de febrero de 2015. ANAC avisa que el banco puede modificarse. El simulacro toma 100 preguntas y el 75% es la referencia publicada de aprobación.',
    testSize: 100,
  },
  {
    slug: 'riva', code: 'RIVA', title: 'Rehabilitación de Instructor de Vuelo de Avión', available: true, practiceOnly: false,
    sourcePageUrl: 'https://www.argentina.gob.ar/examenes/rehabilitacion-instructor-de-vuelo-avion',
    sourcePdfUrl: 'https://www.argentina.gob.ar/sites/default/files/2021/05/rehabilitacion-iva.pdf',
    sourceLabel: 'Cuestionario público RIVA · ANAC',
    sourceNote: 'Las preguntas y la opción marcada salen del cuestionario público. En el índice de ANAC, la rehabilitación de instructor se evalúa con 50 preguntas y 75% de aprobación. Confirmá el trámite vigente en la Parte 61.',
    testSize: 50,
  },
  {
    slug: 'ppl', code: 'PPL', title: 'Piloto de Planeador', available: true, practiceOnly: false,
    sourcePageUrl: 'https://www.argentina.gob.ar/examenes/piloto-de-planeador',
    sourcePdfUrl: 'https://www.argentina.gob.ar/sites/default/files/2021/05/modulo-ppl-julio-2014.pdf',
    sourceLabel: 'Cuestionario público de planeador · ANAC · Resolución 306/2014',
    sourceNote: 'Las preguntas y la opción marcada salen del cuestionario público del segundo semestre de 2014. ANAC avisa que el banco puede modificarse.',
    testSize: 100,
  },
  {
    slug: 'ivh', code: 'IVH', title: 'Instructor de Vuelo de Helicóptero', available: true, practiceOnly: false,
    sourcePageUrl: 'https://www.argentina.gob.ar/anac/examenes/instructor-de-vuelo-helicoptero',
    sourcePdfUrl: 'https://www.argentina.gob.ar/sites/default/files/2021/05/instructor-de-vuelo-helicoptero.pdf',
    sourceLabel: 'Cuestionario público IVH · ANAC · Resolución 306/2014',
    sourceNote: 'Las preguntas salen del cuestionario público. En ese PDF solo algunas traen la opción marcada; las demás se pueden leer y no suman puntaje.',
    testSize: 100,
  },
  {
    slug: 'dda', code: 'DDA', title: 'Despachante de Aeronave', available: true, practiceOnly: false,
    sourcePageUrl: 'https://www.argentina.gob.ar/anac/examenes/despachante-de-aeronave',
    sourcePdfUrl: 'https://www.argentina.gob.ar/sites/default/files/2021/05/despachante-aeronave.pdf',
    sourceLabel: 'Cuestionario público DDA · ANAC',
    sourceNote: 'Las preguntas y la opción marcada salen del cuestionario público de julio de 2014. Contrastalo con la RAAC Parte 65 y con las normas operativas del puesto.',
    regulatoryReferenceUrl: 'https://www.argentina.gob.ar/anac/resoluciones-disposiciones-y-otras-normas-aeronauticas/raac',
    regulatoryReferenceTitle: 'RAAC Parte 65 y normas operativas aplicables',
    testSize: 100,
  },
  {
    slug: 'ivp', code: 'IVP', title: 'Instructor de Vuelo de Planeador', available: true, practiceOnly: false,
    sourcePageUrl: 'https://www.argentina.gob.ar/anac/examenes/instructor-de-vuelo-planeador',
    sourcePdfUrl: 'https://www.argentina.gob.ar/sites/default/files/2021/05/instructor-de-vuelo-planeador.pdf',
    sourceLabel: 'Cuestionario público IVP · ANAC · Resolución 306/2014',
    sourceNote: 'Las preguntas y la opción marcada salen del cuestionario público de la Resolución 306/2014. ANAC avisa que el banco puede modificarse.',
    testSize: 100,
  },
  {
    slug: 'etvi', code: 'ETVI', title: 'Instructor por Instrumentos en Adiestrador Terrestre', available: true, practiceOnly: false,
    sourcePageUrl: 'https://www.argentina.gob.ar/anac/examenes/instructor-de-vuelo-por-instrumentos-en-adiestrador-terrestre-etvi',
    sourcePdfUrl: 'https://www.argentina.gob.ar/sites/default/files/2021/05/etvi-20140916.pdf',
    sourceLabel: 'Cuestionario público ETVI · ANAC · Resolución 306/2014',
    sourceNote: 'Las preguntas y la opción marcada salen del cuestionario público de 2014. Es un certificado de competencia, no una licencia de piloto. Confirmá el programa vigente del adiestrador.',
    testSize: 100,
  },
  {
    slug: 'cta', code: 'CTA', title: 'Controlador de Tránsito Aéreo', available: true, practiceOnly: true,
    sourcePageUrl: 'https://www.argentina.gob.ar/examenes/controlador-de-transito-aereo',
    sourcePdfUrl: 'https://www.argentina.gob.ar/sites/default/files/2025/01/anac-licencia_cta_por_primera_vez_2025.pdf',
    sourceLabel: 'Cuestionario CTA · ANAC · primera vez, 2025',
    sourceNote: 'ANAC publica el cuestionario 2025 como un PDF escaneado, sin texto seleccionable. Esta práctica sigue siendo un repaso corto y original. El archivo oficial está enlazado para contrastar.',
    regulatoryReferenceUrl: 'https://www.argentina.gob.ar/anac/resoluciones-disposiciones-y-otras-normas-aeronauticas/raac',
    regulatoryReferenceTitle: 'RAAC Parte 65, Parte 211 y publicaciones ATS vigentes',
    testSize: 10,
  },
  {
    slug: 'aeroaplicador', code: 'AERO', title: 'Piloto Aeroaplicador de Avión', available: true, practiceOnly: false,
    sourcePageUrl: 'https://www.argentina.gob.ar/examenes/piloto-aeroaplicador-de-avion',
    sourcePdfUrl: 'https://www.argentina.gob.ar/sites/default/files/2021/05/modulo-tcexam-aeroaplicador-de-avion-2015-1.pdf',
    sourceLabel: 'Cuestionario público de aeroaplicador · ANAC · Resolución 306/2014',
    sourceNote: 'Las preguntas y la opción marcada salen del cuestionario público de 2015. ANAC avisa que el banco puede modificarse.',
    testSize: 100,
  },
  {
    slug: 'incendios', code: 'INC', title: 'Piloto de combate de incendios forestales', available: true, practiceOnly: false,
    sourcePageUrl: 'https://www.argentina.gob.ar/anac/examenes/piloto-combate-de-incendios-forestales',
    sourcePdfUrl: 'https://www.argentina.gob.ar/sites/default/files/2021/05/piloto-combate-de-incendios-forestales.pdf',
    sourceLabel: 'Cuestionario público de combate de incendios · ANAC',
    sourceNote: 'Las preguntas y la opción marcada salen del cuestionario público. ANAC avisa que el banco puede modificarse. No reemplaza el programa ni los procedimientos de la operación.',
    testSize: 100,
  },
  {
    slug: 'alumno-paracaidista', code: 'PAR', title: 'Alumno paracaidista', available: true, practiceOnly: false,
    sourcePageUrl: 'https://www.argentina.gob.ar/anac/examenes/alumno-paracaidista',
    sourcePdfUrl: 'https://www.argentina.gob.ar/sites/default/files/2021/05/alumno_paracaidista.pdf',
    sourceLabel: 'Cuestionario público de alumno paracaidista · ANAC',
    sourceNote: 'Las preguntas y la opción marcada salen del cuestionario público de la Resolución 306/2014. No certifican una progresión de salto.',
    testSize: 100,
  },
  {
    slug: 'vant', code: 'VANT', title: 'Piloto a distancia VANT/SVANT', available: false, practiceOnly: true,
    sourcePageUrl: 'https://www.argentina.gob.ar/examenes/vant-svant',
    sourceLabel: 'ANAC · certificado de competencia de piloto a distancia',
    sourceNote: 'El índice oficial de exámenes incluye VANT/SVANT. Aerodot todavía no publica un banco propio: el marco vigente está en las Partes 100, 101 y 102 y en la Parte 61.',
    testSize: 10,
  },
];

export const examGroups = [
  {
    id: 'pilotos',
    title: 'Pilotos',
    note: 'Licencias de piloto y habilitaciones de vuelo.',
    slugs: ['ppa', 'pca-hvi', 'tla', 'ppl', 'aeroaplicador', 'incendios', 'vant'],
  },
  {
    id: 'instructores',
    title: 'Instructores',
    note: 'Instrucción y rehabilitación.',
    slugs: ['iva', 'riva', 'ivh', 'ivp', 'etvi'],
  },
  {
    id: 'funciones',
    title: 'Otras funciones',
    note: 'Despacho, tránsito aéreo y paracaidismo.',
    slugs: ['dda', 'cta', 'alumno-paracaidista'],
  },
];

export const officialExamIndex = examIndex;

export function getLicense(slug) {
  return licenses.find((license) => license.slug === slug) ?? null;
}
