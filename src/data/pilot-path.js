export const pathReviewedOn = '30 de septiembre de 2026';

export const pathInstruments = [
  {
    label: 'RAAC Parte 61, Edición VI',
    note: 'El texto base. Resolución ANAC 65/2026, Boletín Oficial del 27 de enero de 2026.',
    href: 'https://www.argentina.gob.ar/normativa/nacional/resolucion-65-2026-422623/texto',
  },
  {
    label: 'Anexo de la Edición VI',
    note: 'El PDF de enero. Leelo junto con la enmienda de mayo.',
    href: 'https://www.argentina.gob.ar/normativa/422623_res65_pdf/archivo',
  },
  {
    label: 'Enmienda, Resolución 292/2026',
    note: '13 de mayo de 2026. Agrega la licencia de aeronave deportiva liviana y cambia párrafos puntuales.',
    href: 'https://www.argentina.gob.ar/normativa/nacional/norma-425728/texto',
  },
  {
    label: 'Anexo de la Resolución 292/2026',
    note: 'Solo reemplaza lo que reimprime. El resto sigue como en enero.',
    href: 'https://www.argentina.gob.ar/normativa/425728_res292_pdf/archivo',
  },
  {
    label: 'Índice de las RAAC',
    note: 'Entrada oficial a las partes y a sus enmiendas.',
    href: 'https://www.argentina.gob.ar/anac/resoluciones-disposiciones-y-otras-normas-aeronauticas/raac',
  },
];

export const pathChanges = [
  {
    title: 'Piloto comercial de primera clase',
    text: 'Esa licencia ya no se otorga. Quien la tenía conservó la médica y las atribuciones hasta el 1 de enero de 2026. Esa fecha pasó. Si al entrar en vigencia la Resolución 65/2026 ya habías rendido esos exámenes de avión, al completar las horas de línea aérea podés usar el certificado del curso teórico de un CIAC para el requisito teórico. Es el artículo 3 de esa resolución.',
    href: 'https://www.argentina.gob.ar/normativa/nacional/norma-417718/texto',
    hrefLabel: 'Resolución 651/2025',
  },
  {
    title: 'VFR controlado y nocturno local',
    text: 'Esas habilitaciones ya no existen. El vuelo VFR de noche queda como experiencia. Si no la tenés, la licencia lleva una limitación. El teórico no se rinde aparte: entra en el de piloto privado.',
    href: 'https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-957-2025-421650/texto',
    hrefLabel: 'Resolución 957/2025',
  },
  {
    title: 'Aeronave deportiva liviana',
    text: 'Desde mayo de 2026 hay una licencia propia. No reemplaza al privado de avión. Parte de esas horas puede contarse después para el privado.',
    href: 'https://www.argentina.gob.ar/normativa/nacional/norma-425728/texto',
    hrefLabel: 'Resolución 292/2026',
  },
  {
    title: 'Plan de vuelo VFR',
    text: 'La Sección 91.153 rige desde el 1 de marzo de 2026. Las condiciones y las excepciones están en el texto consolidado.',
    href: 'https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-957-2025-421650/texto',
    hrefLabel: 'Resolución 957/2025',
  },
];

export const pathRules = [
  {
    title: 'Examen teórico',
    section: '61.085 y 61.095',
    paragraphs: [
      'Para aprobar hacen falta 75% en el examen general y 75% en cada área.',
      'Si no aprobás, podés rendir de nuevo a los 30 días. Antes, solo si alguien habilitado para dar teoría firma que recibiste instrucción complementaria suficiente.',
      'A la tercera desaprobación, volvés a un centro de instrucción y hacés el curso teórico completo.',
      'La prueba de vuelo se rinde dentro de los 12 meses de aprobar el teórico. Si se vence ese plazo, el teórico se rinde entero otra vez.',
      'También hacen falta la instrucción, la experiencia de la parte y una certificación médica vigente para esa licencia.',
    ],
  },
  {
    title: 'Repaso de vuelo',
    section: '61.135',
    paragraphs: [
      'Para ser piloto al mando, en los 24 meses anteriores tiene que haber un repaso con un instructor, en una aeronave para la que estés habilitado. El instructor firma el libro de vuelo.',
      'El mínimo es 1 hora en tierra y 1 hora en vuelo. Se repasan reglas de vuelo y de tránsito, la operación general y las maniobras que el instructor considere necesarias.',
      'También cuenta, en ese mismo plazo, una prueba de pericia aprobada. O haber completado las fases de un programa de instrucción de las Partes 121 o 135.',
      'Si sos instructor de vuelo vigente, el detalle está en 61.135(e).',
      'Quien venía de la regla anterior tiene hasta el 31 de diciembre de 2027 para adecuarse.',
    ],
  },
  {
    title: 'Inglés y certificación médica',
    section: '61.165 y RAAC 67',
    paragraphs: [
      'Hace falta inglés para volar donde la radio no es en español. El mínimo es el nivel 4.',
      'El nivel 4 se revalida cada 3 años. El 5, cada 6. El 6 no se vuelve a evaluar. La ANAC anota el nivel en la licencia.',
      'En el privado, si no acreditás inglés, la licencia lleva una limitación. En el comercial, en línea aérea y en otras licencias, lleva una restricción. La evaluación es la de 61.165 y el Apéndice B.',
      'La médica es una certificación de la RAAC 67, vigente y adecuada a la licencia. La Parte 61 no fija una sola clase para todos.',
    ],
  },
  {
    title: 'Centros de instrucción',
    section: 'Parte 141, Resolución 293/2026',
    paragraphs: [
      'Hay una Parte 141 nueva. Los centros tienen hasta el 31 de diciembre de 2026 para adaptar sus procedimientos y el manual.',
      'Si no lo hacen, no pueden abrir cursos nuevos ni anotar alumnos nuevos.',
      'Un curso que ya empezó puede terminarse con el programa con el que empezó.',
      'La ventana para empezar cursos cortos, de menos de cinco meses, con programas anteriores cerró el 30 de junio de 2026.',
      'Desde el 1 de enero de 2027, todo curso nuevo sigue la Parte 141 nueva.',
    ],
    href: 'https://www.argentina.gob.ar/normativa/nacional/resolucion-293-2026-425729/texto',
    hrefLabel: 'Resolución 293/2026',
  },
];

export const pathSteps = [
  {
    id: 'alumno',
    index: '01',
    kicker: 'Antes de la licencia',
    title: 'Alumno piloto',
    section: '61.405 a 61.430',
    paragraphs: [
      'Para volar solo en avión, helicóptero o aeronave de despegue vertical hay que tener 16 años. En planeador, globo libre y ULM, 15.',
      'También hacen falta primario completo, español, una médica de la RAAC 67 y, si sos menor, autorización de tus padres o tutor.',
      'Antes del solo, un instructor te da la teoría mínima: reglamento del aire, tránsito, la categoría y aerodinámica básica.',
      'El solo pide la autorización de alumno del Apéndice C y el libro de vuelo firmados por el instructor, para esa marca y modelo. En avión vas como único ocupante.',
    ],
    facts: [
      {
        label: 'Qué no podés',
        text: 'Llevar pasajeros, cobrar, volar en promociones, hacer vuelos internacionales, volar con visibilidad menor de 5 km, volar sin ver el suelo, ni pasar una limitación escrita en el libro. Sección 61.415.',
      },
      {
        label: 'Travesía y espacio controlado',
        text: 'Cada uno pide instrucción extra y una firma del instructor para ese vuelo. Secciones 61.425 y 61.430.',
      },
    ],
  },
  {
    id: 'privado',
    index: '02',
    kicker: 'Licencia',
    title: 'Piloto privado de avión',
    section: '61.505, 61.520, 61.530 y 61.535',
    paragraphs: [
      'Edad: 16 años. Primario completo, español y médica de la RAAC 67.',
      'Rendís un teórico ante la ANAC, sobre las materias de 61.510, y una prueba de vuelo con oral.',
      'El curso teórico puede ser en un CIAC o con un instructor autorizado. Si usás inglés en la radio y no lo acreditás, la licencia queda limitada.',
      'La enmienda de mayo actualizó el total de horas y no el desglose. Los mínimos de abajo son los de la edición de enero.',
    ],
    facts: [
      {
        label: 'Total',
        text: '40 horas de instrucción y vuelo solo si el curso es en un CIAC. 35 si completás un curso reconocido entero en un CIAC Tipo III.',
      },
      {
        label: 'Doble mando',
        text: '20 horas.',
      },
      {
        label: 'Solo de día',
        text: '10 horas en la clase que buscás, con 5 de travesía.',
      },
      {
        label: 'Travesía',
        text: 'Al menos 150 millas náuticas (270 km), con dos aterrizajes completos en dos aeródromos distintos.',
      },
      {
        label: 'Simulador',
        text: 'Hasta 5 horas en un dispositivo aprobado por la ANAC.',
      },
      {
        label: 'Noche',
        text: '3 horas, con 10 despegues y 10 aterrizajes. Cada uno incluye un circuito de tránsito.',
      },
      {
        label: 'Otras categorías',
        text: 'Cuentan hasta 10 horas para el total. Si ya tenés la licencia de aeronave deportiva liviana, hasta 25. El CIAC presenta un informe de riesgo que compare esas aeronaves con los aviones convencionales.',
      },
      {
        label: 'Sin fines de lucro',
        text: 'Podés ser piloto al mando o copiloto en vuelos sin fines de lucro, en una aeronave para la que estés habilitado. La Sección 61.530 lista excepciones: un vuelo incidental a un negocio, sin pasajeros ni carga pagos; compartir combustible, aceite, aeródromo y alquiler; algunos vuelos benéficos de la Parte 91; el reembolso en búsqueda y salvamento autorizado; y demostrar un avión si lo comercializás y tenés al menos 200 horas registradas.',
      },
      {
        label: 'Sin la noche',
        text: 'Sin la instrucción VFR nocturna no podés ser piloto al mando de noche, hasta cumplir 61.520 y tener la constancia del instructor en el libro. La licencia dice: “Carece de atribuciones para operaciones VFR nocturnas”. Hasta el 31 de diciembre de 2027, si no querés esas atribuciones, podés cambiar las 3 horas nocturnas por 3 de doble comando. La leyenda queda.',
      },
      {
        label: 'IFR',
        text: 'Ni la instrucción instrumental del privado ni la nocturna habilitan a volar IFR. Para IFR en avión hace falta la habilitación de vuelo por instrumentos o la licencia de transporte de línea aérea.',
      },
      {
        label: 'Si venís de una LSA',
        text: 'Si sacaste el privado en un monomotor terrestre deportivo liviano, un instructor te da instrucción, anotada en el libro, antes de usar esas atribuciones en un monomotor de la categoría avión.',
      },
    ],
  },
  {
    id: 'hvi',
    index: '03',
    kicker: 'Habilitación',
    title: 'Vuelo por instrumentos',
    section: '61.315',
    paragraphs: [
      'Podés pedirla con un piloto privado vigente en esa aeronave. También tenés que cumplir la vista y la audición de la RAAC 67.',
      'El teórico cubre derecho aéreo IFR, aviónica, brújula y giróscopos, planificación y plan de vuelo, amenazas y errores, engelamiento y frentes, navegación según la fase, AIP, NOTAM, cartas y fraseología IFR, incluida la falla de comunicaciones.',
      'Después rendís ese teórico y la prueba de vuelo en la categoría.',
      'Las 10 horas instrumentales del comercial son un requisito de esa licencia. Esta habilitación se tramita por esta sección. En avión, la licencia de línea aérea ya incluye las atribuciones instrumentales.',
    ],
    facts: [
      {
        label: 'Doble mando',
        text: 'Al menos 10 horas en la categoría, con un instructor autorizado por la ANAC, anotadas en el libro.',
      },
      {
        label: 'Qué se practica',
        text: 'El plan IFR, las listas, el rodaje, la transición al despegue, salidas y llegadas, la ruta, la espera, la aproximación hasta los mínimos, la frustrada y el aterrizaje desde una aproximación.',
      },
      {
        label: 'Experiencia',
        text: '50 horas como piloto al mando en travesía, con al menos 10 en la categoría. Y 40 horas por instrumentos: hasta 20 pueden ser en un simulador aprobado, con instructor.',
      },
    ],
  },
  {
    id: 'comercial',
    index: '04',
    kicker: 'Licencia',
    title: 'Piloto comercial de avión',
    section: '61.605, 61.620, 61.630 y 61.635',
    paragraphs: [
      'Edad: 18 años. Secundario completo, español, médica de la RAAC 67, teórico de 61.610 y prueba de vuelo con oral.',
      'El inglés se acredita o la licencia lleva una restricción.',
      'La enmienda de mayo actualizó el total y no el desglose. El detalle de abajo es el de la edición de enero.',
    ],
    facts: [
      {
        label: 'Total',
        text: 'Al menos 200 horas como piloto en avión. 150 si se acumularon en un curso integrado aprobado o reconocido.',
      },
      {
        label: 'Piloto al mando',
        text: '100 horas, o 70 si seguiste un curso de instrucción aprobado o reconocido.',
      },
      {
        label: 'Travesía',
        text: '20 horas como piloto al mando. Una de al menos 540 km (300 millas náuticas), con aterrizajes completos en dos aeródromos distintos.',
      },
      {
        label: 'Instrumentos',
        text: '10 horas. Hasta 5 pueden ser en simulador.',
      },
      {
        label: 'Noche',
        text: 'Para volar de noche: 5 horas nocturnas, con 5 despegues y 5 aterrizajes como piloto al mando.',
      },
      {
        label: 'Otros créditos',
        text: 'Hasta 20 horas de simulador, si la ANAC las acepta. Otras categorías, hasta 25 horas. Helicóptero y planeador tienen su escala en 61.620(a)(2).',
      },
      {
        label: 'Qué podés hacer',
        text: 'Lo del privado, y podés volar con fines de lucro. Piloto al mando en trabajos aéreos y en transporte aéreo comercial, en una aeronave de la categoría certificada para esa operación. También copiloto, cuando la aeronave lo pide. Con la habilitación correspondiente, podés instruir cobrando.',
      },
      {
        label: 'Edad en el transporte',
        text: 'En vuelos internacionales: menos de 60 años, o menos de 65 si hay más de un piloto. En el transporte nacional, desde los 65 se cumplen los exámenes de la RAAC 67.',
      },
    ],
  },
  {
    id: 'tla',
    index: '05',
    kicker: 'Licencia',
    title: 'Transporte de línea aérea, avión',
    section: '61.805, 61.815, 61.820 y 61.830',
    paragraphs: [
      'Edad: 18 años. Secundario, español, médica vigente de la RAAC 67, inglés o una restricción, teórico de 61.810 y prueba de vuelo con oral.',
      'Tenés que tener ya el comercial de la categoría. La instrucción incluye el doble mando del comercial y la habilitación instrumental.',
      'En avión sumás lo del privado, lo del comercial y lo instrumental. Podés ser piloto al mando o copiloto en transporte aéreo comercial, en aeronaves certificadas para más de un piloto. La prueba de vuelo se hace en un multimotor.',
      'Los límites de edad son los mismos que en el comercial. Están en 61.835.',
    ],
    facts: [
      {
        label: 'Total',
        text: 'Al menos 1.500 horas como piloto de avión.',
      },
      {
        label: 'Al mando',
        text: '500 horas como piloto al mando bajo supervisión, o 250 como piloto al mando, o 70 al mando y el resto bajo supervisión.',
      },
      {
        label: 'Travesía',
        text: '200 horas, con al menos 100 como piloto al mando bajo supervisión.',
      },
      {
        label: 'Noche',
        text: '100 horas como piloto al mando o copiloto.',
      },
      {
        label: 'Instrumentos',
        text: '75 horas. Hasta 30 pueden ser en simulador.',
      },
      {
        label: 'Otras categorías',
        text: 'Pueden bajar el total: como máximo 150 horas, o 200 si son dos categorías. El detalle lo fija la ANAC en 61.820(e).',
      },
    ],
  },
  {
    id: 'instructor',
    index: '06',
    kicker: 'Habilitación',
    title: 'Instructor de vuelo',
    section: '61.1105, 61.1125, 61.1130 y 61.1135',
    paragraphs: [
      'Edad: 18 años. Como mínimo, un piloto comercial vigente con la habilitación de la aeronave en la que vas a instruir.',
      'Para avión monomotor o multimotor terrestre, despegue vertical o vuelo por instrumentos, también hace falta la habilitación instrumental, o sus privilegios.',
      'Rendís teórico y prueba de vuelo.',
      'Podés supervisar el solo del alumno, firmar el libro y dar la instrucción de 61.1125. Tu licencia y tus habilitaciones tienen que cubrir lo que enseñás.',
      'En avión o helicóptero, además acreditás 15 horas como piloto al mando en la misma marca y modelo en los últimos 24 meses.',
      'No podés dar más de 8 horas de instrucción de vuelo en 24 horas seguidas.',
      'La instrucción de las Partes 121 y 135 va por otro lado: la ANAC da una autorización y esos instructores se rigen por esas partes.',
    ],
    facts: [
      {
        label: 'Experiencia',
        text: 'Al menos 200 horas como piloto al mando, con 5 horas en la misma categoría y clase en los seis meses anteriores al pedido.',
      },
      {
        label: 'Vigencia',
        text: '24 meses. Se renueva por otros 24 si cumplís uno de los puntos de 61.1135(a).',
      },
      {
        label: 'Para renovar',
        text: '60 horas de instrucción como instructor o examinador durante la vigencia, con al menos 30 en los 12 meses previos al vencimiento. O un curso periódico aprobado por la ANAC en esos 12 meses. O un examen de vuelo de instructor. O haber instruido al menos a cinco aspirantes que rindieron, con 80% de aprobación al primer intento. O haber sido examinador, inspector reconocido o instructor de un operador 121 o 135 en ese período.',
      },
      {
        label: 'Si venció',
        text: 'Se revalida con una prueba de vuelo. Sección 61.1135(b).',
      },
    ],
  },
];

export const pathSideDoors = [
  {
    id: 'lsa',
    kicker: 'Licencia nueva',
    title: 'Aeronave deportiva liviana',
    section: 'Capítulo O, 61.1600 a 61.1635',
    paragraphs: [
      'En corto, es una aeronave de hasta 600 kg en tierra o 650 kg en el agua, que vuela nivelada hasta 223 km/h (120 nudos), entra en pérdida sin flaps hasta 84 km/h (45 nudos), tiene hasta dos asientos y, si está motorizada, un solo motor alternativo. Leé la definición completa de 61.001 antes de dar por hecho que una aeronave entra.',
      'La licencia pide 17 años, español, primario, médica de la RAAC 67, teórico y prueba de vuelo. Si usás inglés en la radio, se evalúa según 61.165. Si no, hay una limitación.',
      'Volás de día y en visual, sin cobrar y sin acrobacia. Cobrar cabe si volás como instructor o examinador.',
    ],
    facts: [
      {
        label: 'Horas',
        text: '30 en total: 15 de doble mando y 6 de vuelo solo en la clase. Al menos 3 de esas 6 son de travesía, con un vuelo de por lo menos 150 km (80 millas náuticas) y un aterrizaje en otro aeródromo.',
      },
      {
        label: 'Hidroavión',
        text: 'Se suman 5 amerizajes y 5 despegues desde el agua.',
      },
      {
        label: 'Aviones certificados',
        text: 'Esas horas pueden contarse enteras.',
      },
      {
        label: 'Instructor',
        text: 'Tiene su propio curso. Para la habilitación, al menos 40 horas como piloto al mando en una de estas aeronaves. Un instructor comercial o superior puede instruir en una LSA si acredita 5 horas como piloto al mando en una LSA.',
      },
    ],
  },
  {
    id: 'rpas',
    kicker: 'Licencia',
    title: 'Piloto a distancia',
    section: 'Capítulo M, 61.1400; instructor en el Capítulo N',
    paragraphs: [
      'Es una de las licencias de 61.020. Podés ejercer mientras la médica esté vigente y la licencia no esté inhabilitada, suspendida o revocada. También rige la Sección 100.31.',
      'Edades, alturas y límites de operación están en el capítulo y en la norma de la aeronave. Esta página no los resume si la sección leída no los fija.',
      'La Resolución 292/2026 cambió el idioma del instructor de RPAS y el reconocimiento de un instructor de otra categoría.',
      'ANAC lista el examen VANT/SVANT y, por ahora, no publica el cuestionario. Por eso acá sigue como próximo.',
    ],
    facts: [
      {
        label: 'Horas',
        text: 'Al menos 16 de vuelo para la Categoría Específica y 40 para la Categoría Certificada. Las registra y certifica un instructor de RPAS. Sección 61.1420.',
      },
    ],
  },
];
