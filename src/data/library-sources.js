export const sourcesReviewedOn = '2 de octubre de 2026';

export const librarySources = {
  manualVuelo: {
    title: 'Manual de vuelo · manualvuelo.es · Índice temático',
    url: 'https://www.manualvuelo.es/Indice.html',
    detail: 'Índice externo usado para detectar brechas de cobertura. Los temas se redactan aquí de forma propia; sus procedimientos, ejemplos e ilustraciones no se trasladan como instrucciones operacionales.',
    kind: 'Ampliación temática',
  },
  anacPpa: {
    title: 'ANAC · Material y examen de Piloto Privado de Avión',
    url: 'https://www.argentina.gob.ar/anac/personal-aeronautico/examenes/ppa-piloto-privado-de-avion',
    detail: 'Página oficial con material publicado para el programa PPA. Algunos documentos pueden corresponder a ediciones anteriores; contrastar normativa y temario vigentes.',
    kind: 'Argentina',
  },
  raac: {
    title: 'ANAC · Regulaciones Argentinas de Aviación Civil (RAAC)',
    url: 'https://www.argentina.gob.ar/anac/resoluciones-disposiciones-y-otras-normas-aeronauticas/raac',
    detail: 'Índice oficial de las RAAC y sus enmiendas. Consultar el texto vigente aplicable a cada operación.',
    kind: 'Argentina',
  },
  raac61: {
    title: 'ANAC · RAAC Parte 61, edición vigente y enmiendas',
    url: 'https://docs.anac.gob.ar/index.php/s/PtMG8j8sFeRyren/download/RAAC%20PARTE%2061.pdf',
    detail: 'Edición VI, Resolución 65/2026, Boletín Oficial del 27 de enero de 2026. La enmienda de la Resolución 292/2026, del 13 de mayo de 2026, se lee aparte: un PDF fechado en enero no la trae incorporada.',
    kind: 'Argentina',
  },
  raac91: {
    title: 'ANAC · Parte 91 y enmiendas RAAC',
    url: 'https://www.argentina.gob.ar/anac/resoluciones-disposiciones-y-otras-normas-aeronauticas/raac',
    detail: 'Índice oficial de las partes RAAC y sus enmiendas. Usar el texto consolidado aplicable a la operación y comprobar AIP, NOTAM e instrucciones ATS antes de volar.',
    kind: 'Argentina',
  },
  raac91Plan: {
    title: 'ANAC · Resolución 957/2025 y plan de vuelo VFR',
    url: 'https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-957-2025-421650/texto',
    detail: 'Enmienda a la Parte 91. La Sección 91.153 entró en vigencia el 1 de marzo de 2026; consultar el texto consolidado para las condiciones y excepciones aplicables.',
    kind: 'Argentina',
  },
  raac91Equipment: {
    title: 'ANAC · Resolución 117/2026, enmiendas RAAC',
    url: 'https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-117-2026-423432/texto',
    detail: 'Enmiendas a las Partes 91, 121 y 135, principalmente relacionadas con equipamiento. Consultar la Parte 91 consolidada.',
    kind: 'Argentina',
  },
  raac91BushStol: {
    title: 'ANAC · Resolución 311/2026, operaciones Bush y STOL',
    url: 'https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-311-2026-426039/texto',
    detail: 'Enmienda de la Parte 91, entre otras normas, que incorpora un marco para ciertas operaciones Bush y STOL. Consultar el texto consolidado y su ámbito de aplicación.',
    kind: 'Argentina',
  },
  aip: {
    title: 'AIS/ANAC · AIP Argentina, enmiendas y NOTAM',
    url: 'https://ais.anac.gob.ar/aip',
    detail: 'Publicaciones aeronáuticas oficiales para Argentina. La AIP se organiza en GEN, ENR y AD y se actualiza mediante enmiendas.',
    kind: 'Argentina',
  },
  metArgentina: {
    title: 'SMN · Meteorología aeronáutica',
    url: 'https://ws2.smn.gob.ar/pron%C3%B3stico-de-aer%C3%B3dromo-taf',
    detail: 'Acceso a productos argentinos como METAR/SPECI, TAF, SIGMET y otros avisos; comprobar emisión, vigencia y cobertura.',
    kind: 'Argentina',
  },
  raac203: {
    title: 'ANAC · Resolución 389/2026, Parte 203',
    url: 'https://www.argentina.gob.ar/normativa/nacional/norma-426815/texto',
    detail: 'Aprueba una nueva edición de la Parte 203, vigente desde el 1 de agosto de 2026.',
    kind: 'Argentina',
  },
  phak: {
    title: 'FAA · Pilot’s Handbook of Aeronautical Knowledge (FAA-H-8083-25C)',
    url: 'https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak',
    detail: 'Referencia técnica para principios de vuelo, sistemas, instrumentos, performance, meteorología, navegación y factores aeromédicos. La FAA publica un addendum de octubre de 2025.',
    kind: 'FAA · fundamentos',
  },
  afh: {
    title: 'FAA · Airplane Flying Handbook (FAA-H-8083-3C)',
    url: 'https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/airplane_handbook',
    detail: 'Referencia de maniobras y operación de aviones; incluye gestión de energía, control de la aeronave, despegues, circuitos, aterrizajes y emergencias. Consultar también el addendum de octubre de 2025.',
    kind: 'FAA · fundamentos',
  },
  weather: {
    title: 'FAA · Aviation Weather Handbook (FAA-H-8083-28B)',
    url: 'https://www.faa.gov/regulationspolicies/handbooksmanuals/aviation/faa-h-8083-28b-aviation-weather-handbook',
    detail: 'Manual técnico actualizado en abril de 2026. Sus productos y servicios operacionales describen el sistema estadounidense; aquí se usa como apoyo para la física y la interpretación meteorológica.',
    kind: 'FAA · fundamentos',
  },
  risk: {
    title: 'FAA · Risk Management Handbook (FAA-H-8083-2A)',
    url: 'https://www.faa.gov/regulationspolicies/handbooksmanuals/risk-management-handbook-faa-h-8083-2a',
    detail: 'Herramientas educativas de toma de decisiones, identificación de peligros y mínimos personales. No constituye normativa argentina.',
    kind: 'FAA · fundamentos',
  },
  weightBalance: {
    title: 'FAA · Weight & Balance Handbook (FAA-H-8083-1B)',
    url: 'https://www.faa.gov/sites/faa.gov/files/2023-09/Weight_Balance_Handbook.pdf',
    detail: 'Referencia técnica para masa, brazo, momento, centro de gravedad y envolventes de operación.',
    kind: 'FAA · fundamentos',
  },
};
