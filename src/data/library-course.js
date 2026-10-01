import { chapters as examChapters } from './ppa-course.js';
import { librarySources } from './library-sources.js';
import { handbookLessons } from './handbook-lessons.js';

const additions = {
  aerodinamica: [
    [
      'Las cuatro fuerzas en vuelo',
      'En el modelo básico actúan sustentación, peso, tracción y resistencia. En vuelo recto, nivelado y sin aceleración, la sustentación equilibra aproximadamente el peso y la tracción la resistencia. En un ascenso, descenso, viraje o aceleración, cambian la dirección y el balance de las fuerzas; no se puede asumir que cada par sea igual. El esquema muestra una condición idealizada para ordenar el análisis, no una medición de fuerzas de un avión concreto.',
      'Antes de explicar un cambio de trayectoria, preguntate qué fuerza cambió y en qué dirección actúa.',
      'forces',
    ],
    [
      'Centro de presión y momento aerodinámico',
      'La resultante de las presiones sobre un perfil puede representarse, para ciertos análisis, mediante una fuerza aplicada en el centro de presión. Su ubicación puede desplazarse al cambiar el ángulo de ataque; no es el centro de gravedad ni un punto fijo universal del ala. El diseño también produce momentos aerodinámicos que el conjunto ala, fuselaje y empenaje debe equilibrar. Para estudiar una aeronave concreta, usá los datos de su diseño y manuales aprobados; este modelo sirve para entender por qué la distribución de cargas afecta el equilibrio.',
      'Centro de presión y centro de gravedad describen conceptos distintos: uno pertenece a la resultante aerodinámica y el otro a la distribución de masa.',
    ],
    [
      'Ejes del avión y movimientos',
      'El eje longitudinal va del morro a la cola: el movimiento alrededor de él es el alabeo y se controla principalmente con alerones. El eje lateral va de una punta de ala a la otra: alrededor de él ocurre el cabeceo, controlado principalmente por el elevador o estabilador. El eje vertical atraviesa el avión de arriba abajo: alrededor de él ocurre la guiñada, controlada principalmente por el timón de dirección. Son relaciones principales; los movimientos reales pueden combinarse y los mandos producen efectos acoplados.',
      'Nombrá primero el eje y después el giro: longitudinal–alabeo, lateral–cabeceo, vertical–guiñada.',
      'axes',
    ],
    [
      'Viraje, factor de carga y pérdida acelerada',
      'En un viraje coordinado y nivelado, la sustentación queda inclinada: una parte sostiene el peso y otra produce el cambio de dirección. Para mantener altura debe aumentar la sustentación total. En el modelo ideal, el factor de carga es n = 1/cos(φ), donde φ es la inclinación; a 60° resulta n = 2, equivalente a una carga de 2 g. Como el ala necesita más sustentación, aumenta el ángulo de ataque requerido y también la velocidad de pérdida. Es una relación de referencia para un viraje coordinado, nivelado y sin cambios de configuración; la técnica y los límites se consultan en el manual de vuelo del avión.\n\nLa velocidad de pérdida crece con la raíz cuadrada del factor de carga. En ese caso de 60°, queda multiplicada por √2, cerca de 1,41. Si en configuración limpia y 1 g la pérdida llega a 50 kt, en el viraje nivelado aparece cerca de 70 kt. No es una velocidad para copiar a otro avión: muestra por qué “voy rápido” puede ser falso cuando la carga aumentó.',
      'Más inclinación o una maniobra brusca puede acercar el ala al ángulo crítico aun cuando la velocidad parezca normal.',
      'turn-load',
    ],
      [
        'Configuración, flaps y efecto suelo',
        'Los flaps cambian la geometría del ala para aumentar su capacidad de sustentación a baja velocidad; también suelen aumentar la resistencia. La magnitud del efecto y las velocidades permitidas dependen del diseño. Cerca del suelo, el efecto suelo modifica el flujo inducido y reduce parte de la resistencia inducida: el avión puede quedar flotando y tardar en asentarse si llega con exceso de energía. No se usa este efecto para compensar una aproximación inestable ni para apartarse de las velocidades y técnicas publicadas.',
        'La configuración cambia la relación entre actitud, potencia, velocidad y trayectoria. Anticipá esos cambios con el procedimiento del avión.',
      ],
    [
      'Estabilidad: tendencia, amortiguamiento y control',
      'La estabilidad estática describe la tendencia inicial de la aeronave después de una perturbación; la estabilidad dinámica describe cómo evoluciona esa respuesta con el tiempo. El amortiguamiento reduce las oscilaciones, mientras que la controlabilidad depende de la capacidad de modificar la trayectoria con los mandos. Una aeronave puede responder de forma estable y, aun así, requerir acción del piloto para mantener la condición deseada. La respuesta depende del diseño, el centro de gravedad, la configuración y el régimen de vuelo.',
      'Estabilidad no significa “vuelo automático”: entendé la respuesta del modelo que vas a volar.',
    ],
    [
      'Guiñada adversa y coordinación',
      'Al iniciar un alabeo, la resistencia asociada a la deflexión de los alerones puede hacer que el morro tienda inicialmente hacia el lado opuesto al giro deseado; a esa respuesta se la llama guiñada adversa. La magnitud depende del avión y de la condición de vuelo. El timón de dirección ayuda a coordinar el movimiento; un resbale y un derrape son condiciones distintas de deslizamiento lateral. Aprendé a reconocerlas con los instrumentos y la instrucción del avión, sin reducir la coordinación a una presión fija de pedal.',
      'Separá la guiñada adversa por resistencia de alerones de otras tendencias de guiñada ligadas a hélice y potencia.',
    ],
    [
      'Indicios de pérdida y margen de velocidad',
      'La pérdida se produce al superar el ángulo de ataque crítico, no al alcanzar una velocidad única. Avisadores, buffet, pérdida de eficacia de controles o una respuesta distinta a la esperada pueden aparecer según el diseño, pero no todos los aviones presentan las mismas señales. Peso, factor de carga, configuración y potencia cambian la velocidad a la que puede alcanzarse el ángulo crítico. Los indicios y la recuperación se estudian en el manual del avión y se practican con instructor en condiciones autorizadas.',
      'Una velocidad publicada describe una condición concreta; no garantiza por sí sola un margen ante cualquier maniobra o carga.',
    ],
  ],
  motopropulsor: [
    [
      'Paso fijo, paso variable y velocidad constante',
      'Una hélice de paso fijo mantiene el ángulo geométrico de sus palas; su diseño ofrece un compromiso entre distintas fases de vuelo. Una hélice de paso variable permite cambiar ese ángulo, pero el mando y la automatización dependen del sistema instalado. En una hélice de velocidad constante, un regulador ajusta automáticamente el paso para mantener las revoluciones seleccionadas dentro de sus límites. Por eso, “paso variable” y “velocidad constante” no son sinónimos. Las posiciones de mando, secuencias y límites se aprenden para el modelo concreto.',
      'No deduzcas el tipo de hélice ni su funcionamiento solo por la palanca: confirmalo en el manual de vuelo y en la instrucción recibida.',
    ],
    [
      'Indicios del motor y respuesta segura',
      'Una caída de RPM, presión de combustible anormal, aumento de temperatura, vibración o pérdida de potencia son indicios que deben leerse en conjunto. El mismo síntoma puede tener causas distintas según el motor y su instalación. Confirmá qué instrumentos monitorean ese avión, qué rangos son normales y qué listas corresponden a cada condición. Ante una falla, las acciones concretas —incluidos mezcla, calefacción de carburador, selección de tanques, hélice y corte— son las del POH/AFM o lista aprobada, no una receta genérica.',
      'Aprender el sistema significa conocer sus indicaciones y practicar las listas específicas, no improvisar un diagnóstico en vuelo.',
    ],
    [
      'Sistema eléctrico e indicaciones de falla',
      'Un sistema eléctrico puede incluir batería, alternador o generador, barras, protecciones y cargas, pero la arquitectura varía. La batería aporta energía almacenada; el alternador suele alimentar el sistema y recargarla con el motor en marcha. Una caída de tensión, una luz de carga o una protección disparada debe interpretarse según el panel y la lista del avión. Identificá qué instrumentos y comunicaciones dependen de cada fuente. No restablezcas repetidamente un interruptor automático ni desconectes cargas sin seguir el procedimiento aprobado.',
      'El esquema del capítulo muestra relaciones posibles, no el circuito de una matrícula o modelo.',
      'electrical-system',
    ],
    [
      'Recorrido del combustible y contaminación',
      'El combustible pasa desde uno o más depósitos por un selector y componentes de alimentación y filtrado hasta el sistema de dosificación del motor. Hay instalaciones por gravedad y otras con bombas; la disposición y la selección correcta dependen del avión. Agua, sedimentos o combustible equivocado pueden interrumpir la alimentación o dañar el motor. Conocé capacidad utilizable, indicaciones, drenajes, combustible aprobado y procedimiento para seleccionar depósitos; comprobá cantidad y calidad con la lista de inspección vigente.',
      'No asumas que dos aviones similares usan la misma secuencia, selector o procedimiento de drenaje.',
      'fuel-system',
    ],
    [
      'Detonación, preignición y temperatura',
      'La detonación es una combustión anormal de la mezcla después del encendido normal; la preignición comienza antes de la chispa por una fuente caliente en la cámara. Ambas elevan el esfuerzo térmico y mecánico, aunque sus causas y evolución no son idénticas. Combustible incorrecto, temperatura elevada, mezcla, carga y otros factores pueden influir según el diseño. Reconocé los instrumentos y límites del motor, y ante indicios aplicá únicamente la lista aprobada; una explicación general no define una acción para todos los motores.',
      'Aprendé la diferencia física en tierra y la respuesta publicada para el motor concreto.',
    ],
    [
      'Magnetos y encendido redundante',
      'En muchos motores alternativos de aviación, uno o más magnetos generan la energía de encendido sin depender del alternador de la aeronave. El doble encendido puede aportar redundancia y distribuir la combustión entre bujías; la arquitectura real depende del motor. La comprobación de magnetos observa el funcionamiento del encendido bajo las condiciones indicadas por el fabricante. Una caída, diferencia o indicación fuera de límites se evalúa con los valores y la secuencia del POH/AFM, no con una cifra genérica.',
      'Identificá qué sistema alimenta cada bujía y qué resultado espera el manual de ese motor.',
    ],
    [
      'Turbina: panorama fuera del PPA inicial',
      'Los motores de turbina mantienen una combustión continua y convierten parte de la energía de los gases en trabajo de eje. En un turbohélice, ese trabajo mueve una hélice mediante una transmisión; en un turborreactor el empuje proviene principalmente del chorro, y en un turbofán un ventilador acelera una masa de aire importante alrededor del núcleo. Un turboeje entrega potencia para mover un rotor u otra carga. Son diferencias de arquitectura: no alcanzan para operar estos motores ni describen todos sus diseños. Arranque, límites, indicaciones y respuesta ante fallas requieren el manual y entrenamiento del tipo.',
      'Esto amplía el vocabulario aeronáutico; los procedimientos de turbina quedan fuera del curso PPA de avión liviano.',
    ],
  ],
  instrumentos: [
    [
      'Qué presión alimenta cada instrumento',
      'El velocímetro usa presión de impacto del pitot y presión estática para obtener una indicación relacionada con la presión dinámica. El altímetro y el variómetro usan presión estática: el primero la compara con una referencia barométrica y el segundo responde a su cambio. Una obstrucción no produce siempre el mismo síntoma: depende de si afecta el pitot, el drenaje o la toma estática. La calefacción del pitot, los drenajes y las tomas deben comprobarse según el diseño y la lista de inspección del avión.',
      'El esquema muestra la función general; no representa la instalación ni las válvulas de un modelo particular.',
      'pitot-static',
    ],
    [
      'Lectura cruzada y detección de fallas',
      'Una indicación aislada puede parecer plausible aun cuando su fuente haya fallado. La lectura cruzada compara instrumentos que miden variables relacionadas y busca discrepancias con actitud, potencia, tendencia y referencias exteriores. En paneles analógicos, varios instrumentos pueden compartir vacío o alimentación eléctrica; en equipos digitales, sensores o buses compartidos también pueden afectar más de una indicación. Identificá las fuentes instaladas y los indicadores de falla durante el estudio en tierra, y seguí el procedimiento del manual ante una discrepancia real.',
      'Reconocer qué dato dejó de ser confiable es distinto de adivinar qué componente falló.',
    ],
    [
      'Rumbo, variación y errores de brújula',
      'La brújula magnética ofrece una referencia de rumbo, pero puede tener errores por aceleración, viraje, inclinación y campos magnéticos del avión. La tarjeta de desvíos refleja la corrección propia de la instalación. La variación cambia con la ubicación y la época; se obtiene de la carta vigente. Los errores de aceleración y viraje dependen de la latitud y del rumbo, así que una regla mnemotécnica no reemplaza la práctica con la brújula del avión ni la carta de desviación.',
      'Antes de convertir entre rumbos verdaderos y magnéticos, verificá la variación de la zona y la desviación de esa aeronave.',
    ],
    [
      'IAS, CAS, TAS y velocidad sobre el suelo',
      'IAS es la indicación del anemómetro; CAS corrige errores de posición e instrumento y EAS considera además la compresibilidad cuando corresponde. TAS expresa la velocidad respecto de la masa de aire; GS es la velocidad respecto del terreno y resulta al combinar TAS con el viento. El instrumento pitot-estático no mide directamente GS. Al planificar tiempos y combustible usá la velocidad respecto del suelo estimada y actualizala con el progreso real. Los límites y velocidades operativas se consultan en el manual del avión.',
      'No intercambies una velocidad indicada con la verdadera o la velocidad sobre el suelo.',
    ],
    [
      'Altitud barométrica, nivel de vuelo y transición',
      'El altímetro barométrico convierte presión estática en una indicación referida al ajuste seleccionado. Con QNH se busca indicar aproximadamente altitud sobre el nivel medio del mar; al usar presión estándar, la lectura se expresa como nivel de vuelo conforme a las reglas y procedimientos aplicables. La altitud de presión y la altitud de densidad son magnitudes de cálculo distintas. La altitud o nivel de transición no es un valor para importar de otro país: se consulta en la AIP y la información vigente del área. Ajustes, fraseología y separación vertical se confirman con RAAC y AIP Argentina.',
      'Separá el principio del instrumento de las reglas locales que indican cuándo cambiar el reglaje.',
    ],
    [
      'Marcas de velocidad y límites del instrumento',
      'Algunos anemómetros usan arcos y líneas de color para señalar rangos operativos, de configuración o límites estructurales. En muchos aviones livianos el arco blanco se relaciona con operación de flaps, el verde con un rango normal y el amarillo con precaución; una línea roja puede marcar un límite máximo. El significado exacto, las velocidades asociadas y las condiciones dependen del certificado y manual de esa aeronave. El variómetro también tiene retardo y suaviza cambios de presión: sirve para observar tendencia, no como lectura instantánea de trayectoria.',
      'Leé las marcas del panel junto con el POH/AFM; los colores no habilitan a exceder otras limitaciones.',
    ],
    [
      'Deriva del indicador de dirección',
      'Un indicador direccional giroscópico puede ofrecer una referencia estable a corto plazo, pero su indicación puede derivar por fricción, precesión u otras características del equipo. Por eso se compara periódicamente con una referencia fiable, como la brújula, cuando las condiciones y el procedimiento lo permiten. La forma de alinear, las fuentes de energía y las alertas de falla cambian entre instrumentos convencionales y sistemas integrados. Ante discrepancias, consultá el manual de vuelo y el procedimiento del equipo.',
      'Un indicador que muestra rumbo no necesariamente conserva ese rumbo sin comprobación.',
    ],
  ],
  regulaciones: [
    [
      'Cómo verificar una regla antes de aplicarla',
      'Para una operación en Argentina, la RAAC vigente determina los requisitos regulatorios; la AIP Argentina publica información aeronáutica permanente y sus enmiendas, y los NOTAM comunican información temporal según el sistema AIS. La licencia y sus atribuciones se consultan en la Parte 61; las reglas de vuelo y operación general, en la Parte 91 y sus enmiendas. Una pregunta publicada por ANAC puede servir para estudiar el temario de su edición, pero no demuestra por sí sola que una cifra o procedimiento siga vigente. Revisá fecha, edición, ámbito y aeronave a la que se aplica cada fuente.',
      'Una explicación de la FAA puede aclarar el concepto; las reglas argentinas se confirman en RAAC y publicaciones locales vigentes.',
    ],
    [
      'Planificar el vuelo y presentar un plan',
      'Planificar ruta, combustible, meteorología, aeródromos y alternativas es una tarea de seguridad aunque no corresponda presentar un plan de vuelo formal. La Resolución ANAC 957/2025 modificó la Parte 91 y su cambio a la Sección 91.153 entró en vigencia el 1 de marzo de 2026. La Parte 91 recibió enmiendas posteriores, entre ellas las Resoluciones 117/2026 y 311/2026; esta síntesis educativa no sustituye la lectura del texto consolidado. Pueden existir requisitos o coordinaciones particulares por el tipo de vuelo, espacio aéreo, aeródromo u otras reglas vigentes. Antes de volar, confirmá la RAAC Parte 91, AIP, NOTAM e instrucciones ATS aplicables; no conviertas esta síntesis en una autorización operacional.',
      '“Planificar” y “presentar un plan” son acciones diferentes. Verificá el texto consolidado de la Parte 91 y la información vigente para determinar si tu operación requiere presentación, aviso o coordinación.',
    ],
  ],
  generalidades: [
    [
      'Centro de gravedad: un ejemplo de cálculo',
      'Para cada elemento se multiplica su peso por el brazo medido desde el datum; la suma de momentos dividida por el peso total da la posición del centro de gravedad. Ejemplo aritmético ficticio, no asociado a ningún avión: 400 kg a 0,20 m producen 80 kg·m; 200 kg a 1,20 m producen 240 kg·m. El total es 600 kg y 320 kg·m, por lo que el centro queda a 0,533 m del datum. En una carga real también hay que respetar brazos, unidades, peso vacío, límites y envolvente del avión específico.',
      'El cálculo matemático no confirma que la aeronave esté dentro de límites: compará el resultado con los datos aprobados para esa matrícula y configuración.',
      'weight-balance',
    ],
    [
      'Manual de vuelo, placas y listas',
      'El POH/AFM aprobado reúne limitaciones, velocidades, procedimientos, performance y datos de carga para una aeronave o configuración determinada. Placas, suplementos y listas aplicables pueden agregar condiciones o reemplazar información. Antes del vuelo, identificá la revisión vigente, el modelo y serie a los que corresponde, el equipamiento instalado y cualquier suplemento. Una cifra recordada de otro avión del mismo fabricante no sustituye estos datos. Si falta una referencia necesaria o una limitación no está clara, resolvelo en tierra con el instructor o responsable técnico.',
      'La fuente operacional final es el manual aprobado de la aeronave concreta, junto con sus suplementos vigentes.',
    ],
    [
      'Tren de aterrizaje y frenos',
      'El tren transmite al fuselaje las cargas de rodaje, despegue y aterrizaje; algunos diseños son fijos y otros retráctiles, y la disposición puede ser triciclo o convencional. Los frenos pueden actuar sobre una o más ruedas y su control cambia entre aviones. Durante el prevuelo se verifica el estado visible siguiendo la lista correspondiente; en cabina se identifican mando, indicaciones y limitaciones. La técnica de rodaje, aterrizaje y frenado depende del avión, la superficie y la instrucción recibida.',
      'No extrapoles la técnica de un tren triciclo a uno convencional, ni supongas que todo avión tiene frenos en las mismas ruedas.',
    ],
    [
      'Dispositivos secundarios y geometría del ala',
      'La geometría del ala se describe con términos como envergadura, cuerda, alargamiento, flecha y torsión; sus valores influyen en el comportamiento aerodinámico, pero no permiten deducir por sí solos la performance de una aeronave. Dispositivos como flaps, slats y spoilers pueden modificar sustentación, resistencia o control según su diseño. Algunas aeronaves usan estabilador, canard, cola en V u otras configuraciones; no todos esos elementos están presentes ni tienen el mismo efecto. Identificá componentes reales y consultá el POH/AFM para función y límites.',
      'Usá este repaso para reconocer componentes, no para inferir procedimientos de una aeronave que no conocés.',
    ],
    [
      'Lectura de tablas y envolvente de peso y centrado',
      'Una hoja de carga puede presentar límites y resultados en tablas, gráficos o una envolvente. Primero se identifican unidades, datum, brazos, categorías de peso y configuración a la que corresponde el documento; luego se verifica cada condición requerida con el método indicado por el fabricante. No interpolés, redondees ni combines páginas de revisiones diferentes salvo que la documentación lo permita expresamente. El ejemplo de cálculo de esta biblioteca explica momentos, pero solo los datos aprobados de la aeronave permiten decidir si una carga real es admisible.',
      'Si un punto cae fuera de la envolvente o la revisión del documento no es clara, no des por válida la carga.',
    ],
  ],
  meteorologia: [
    [
      'Tormentas, cizalladura y turbulencia severa',
      'Una tormenta puede reunir corrientes ascendentes y descendentes, granizo, precipitación intensa, turbulencia, actividad eléctrica y cambios bruscos del viento. La cizalladura es un cambio significativo del viento en una distancia corta y puede afectar la trayectoria, en especial cerca del suelo. Radar, satélite y cartas de tiempo significativo ayudan a reconocer evolución y ubicación, pero una imagen transmitida puede tener latencia y no define por sí sola una distancia segura. La estrategia principal es evitar el fenómeno y conservar opciones; las limitaciones y acciones de la aeronave se estudian con el manual y la instrucción recibida.',
      'No atravieses una tormenta para “ver qué pasa”: sus peligros exceden lo que puede inferirse desde una sola pantalla o una observación lejana.',
    ],
    [
      'Leer productos meteorológicos como un conjunto',
      'METAR y SPECI describen observaciones de aeródromo; TAF pronostica condiciones para un aeródromo y período; SIGMET alerta sobre fenómenos significativos en ruta. En Argentina, consultá los productos oficiales del SMN y verificá hora de emisión, período de validez, correcciones, área cubierta y unidades. Una observación puntual no representa toda la ruta, y un TAF no garantiza lo que ocurrirá. Compará varios aeródromos y productos a lo largo del tiempo previsto, junto con terreno, luz diurna, alternativas y capacidad del piloto y del avión.',
      'Primero comprobá vigencia y cobertura; después interpretá el fenómeno y qué decisión permite tomar.',
    ],
  ],
  performance: [
    [
      'Cómo trabajar una tabla de performance',
      'Empezá con la tabla del POH/AFM correspondiente a la fase y configuración. Confirmá peso, presión-altitud, temperatura, viento, pendiente, superficie y técnica que presupone la tabla; respetá sus notas y unidades. Si exige calcular altitud de presión o interpolar, seguí exactamente el método publicado. No extrapoles fuera de los valores cubiertos ni mezcles distancias de despegue, recorrido de pista y distancia sobre obstáculo. Repetí el cálculo para el aterrizaje previsto y evaluá si el margen sigue siendo aceptable ante cambios razonables de viento, temperatura o superficie.',
      'Un número de tabla es un resultado condicionado. Si cambia una condición, vuelve a evaluarse el cálculo y la decisión de operar.',
    ],
    [
      'Peso, centrado y pista forman un solo problema',
      'Más peso suele aumentar las distancias necesarias y reducir la capacidad de ascenso; un centro de gravedad fuera de límites puede comprometer control y estabilidad. Una pista corta, blanda, mojada, contaminada, en pendiente o con obstáculos cambia los márgenes. No combines datos ideales de distintas tablas como si describieran un mismo escenario. Armá una hoja con peso y centrado reales, condiciones del día, pista disponible, obstáculos y alternativa. Si el cálculo depende de una suposición optimista, cambia el plan antes de iniciar la carrera.',
      'La performance publicada no sustituye una inspección de pista, una técnica correcta ni un margen decidido antes del despegue.',
    ],
  ],
  navegacion: [
    [
      'Triángulo de velocidades y actualización en ruta',
      'La velocidad verdadera describe el movimiento de la aeronave respecto de la masa de aire. El viento suma otro vector; el resultado es la velocidad y trayectoria sobre el suelo. Por eso, rumbo y derrota pueden diferir, y el tiempo estimado debe calcularse con velocidad respecto del suelo. En vuelo, compará hora y posición observadas con los puntos previstos, recalculá el próximo tramo y revisá combustible y alternativas. Una diferencia persistente puede indicar viento distinto, error de navegación o progreso no esperado: identificá la causa antes de continuar con el plan original.',
      'La derrota sobre el terreno resulta de combinar el vector de la aeronave en el aire con el vector del viento.',
      'wind-triangle',
    ],
    [
      'GPS y cartografía electrónica',
      'Un receptor GNSS puede aportar posición, trayectoria y estimaciones de tiempo, pero depende de recepción, configuración, base de datos y uso correcto. La pantalla no confirma por sí sola que una ruta, obstáculo, restricción o dato de aeródromo esté vigente. Compará la navegación electrónica con cartas y publicaciones oficiales actuales, mantené conciencia de posición y conocé el procedimiento ante pérdida o discrepancia de señal. La base de datos y el equipo se utilizan conforme a sus aprobaciones, limitaciones y manuales; el uso permitido depende de la operación y la normativa aplicables.',
      'Una pantalla útil no reemplaza la comprobación de vigencia, la lectura de carta ni un plan alternativo.',
    ],
  ],
};

const newChapters = [
  {
    id: 9,
    slug: 'operaciones-aerodromo',
    title: 'Operaciones de aeródromo',
    eyebrow: 'Moverse, comunicarse y convivir en tierra y en circuito',
    minutes: 45,
    intro: 'Interpretá la información del aeródromo, organizá el rodaje y mantené una secuencia clara en el circuito de tránsito.',
    lessons: [
      [
        'Antes de rodar',
        'Antes de mover la aeronave, consultá en la AIP, cartas y NOTAM los datos del aeródromo, calles de rodaje, obras, obstáculos, frecuencias, servicios y restricciones relevantes. La pista en uso puede cambiar: confirmala mediante ATIS si está disponible, ATS o el procedimiento local que corresponda. En cabina, acordá quién opera los controles, revisá la lista previa al rodaje y ubicá la ruta prevista. En tierra, las señales, marcas y luces tienen significados estandarizados, pero su disposición y las reglas locales deben estudiarse para cada aeródromo. Si la instrucción recibida no queda clara, detené la aeronave en un lugar seguro y pedí aclaración.',
        'La presión por liberar una frecuencia o seguir a otra aeronave no justifica rodar con dudas sobre la autorización o la ruta.',
      ],
      [
        'Arranque, comprobaciones y briefing previo al despegue',
        'El arranque inicia una secuencia de comprobaciones que permite confirmar indicaciones y funcionamiento dentro de los límites publicados. La prueba de motor y las verificaciones antes del despegue buscan detectar anomalías, confirmar configuración y preparar una decisión clara ante una interrupción. El orden, los valores, la duración, la ubicación y las acciones cambian con motor, hélice, temperatura y aeronave; seguí la lista aprobada y las instrucciones del instructor. El briefing puede repasar pista, viento, trayectoria, obstáculos, tareas de cada ocupante, condiciones para interrumpir la carrera y opciones iniciales, usando datos del avión y del aeródromo.',
        'Aprendé el propósito de cada ítem junto con la lista del modelo; no reemplaces esa lista por una secuencia memorizada de otro avión.',
      ],
      [
        'Rodaje y prevención de incursiones',
        'Durante el rodaje, mantené velocidad que permita detenerse, controlá la posición en la carta y compará señales, marcas e instrucciones. Evitá cruzar una pista o ingresar a una superficie protegida sin la autorización o condición que exija el servicio aplicable. Antes de entrar o cruzar, la comprobación visual complementa la autorización; no la sustituye. Si se pierde orientación, hay discrepancia entre la autorización y lo que se ve, o aparece un vehículo inesperado, detené la aeronave si es seguro y resolvé la situación antes de continuar.',
        'Una autorización no elimina la obligación de vigilar y confirmar que la acción puede hacerse con seguridad.',
      ],
      [
        'Superficies de mando durante el rodaje',
        'El viento puede hacer que el flujo sobre las alas y la cola genere momentos mientras el avión rueda, en especial con ráfagas o viento cruzado. La posición adecuada de alerones y elevador depende de la dirección del viento, el tipo de avión, el tren y la recomendación del fabricante. No memorices una regla aislada sin relacionarla con qué superficie recibe el viento y qué movimiento podría producir. Consultá el manual del avión y practicá la técnica local con instructor; mantené velocidad de rodaje que permita controlar y detener la aeronave.',
        'Pensá primero cómo actúa el viento sobre cada superficie; aplicá después la técnica publicada para ese avión.',
      ],
      [
        'Después del aterrizaje y salida de pista',
        'Tras el contacto, el piloto mantiene control direccional, reduce velocidad y abandona la pista por una calle adecuada cuando puede hacerlo sin maniobras bruscas. La pista se considera ocupada hasta alcanzar el punto que establezcan las reglas y la geometría del aeródromo; no se detiene en una posición que obstruya el tránsito salvo necesidad o instrucción aplicable. Una vez fuera, se completan las acciones posteriores al aterrizaje según la lista del avión y se confirma la ruta de rodaje antes de moverse. Señales, autorizaciones y puntos de espera se interpretan conforme a la AIP y al servicio local.',
        'La secuencia de salida de pista y los ítems posteriores dependen de la publicación del aeródromo y de la lista aprobada.',
      ],
      [
        'Circuito de tránsito y conciencia de tráfico',
        'El circuito organiza el tránsito alrededor de una pista mediante tramos que permiten integrarse, mantener separación y preparar el aterrizaje. La dirección, altura, puntos de entrada, procedimientos y comunicaciones se verifican en la AIP, publicaciones locales e instrucciones ATS; el esquema siguiente es conceptual y no fija un circuito argentino. Mantené vigilancia fuera y dentro de cabina, comunicá posición de forma breve cuando corresponda y resolvé conflictos sin perder el control de la aeronave. El viento, el tipo de operación y las instrucciones vigentes pueden modificar la secuencia esperada.',
        'Un circuito dibujado ayuda a visualizar la secuencia, pero cada aeródromo tiene sus datos e instrucciones publicados.',
        'traffic-pattern',
      ],
      [
        'Estela turbulenta y separación',
        'Una aeronave que produce sustentación deja vórtices detrás de las puntas de ala. Pueden persistir y desplazarse con el viento, creando un peligro para aeronaves más livianas o que vuelan a menor velocidad. Peso, configuración y velocidad influyen en la intensidad; las fases de despegue y aterrizaje requieren atención especial. Usá la información, separación y procedimientos publicados o indicados por ATS y el instructor. No supongas que el vórtice desapareció porque ya no se ve al avión precedente.',
        'La posición y trayectoria de la aeronave precedente ayudan a anticipar dónde podría quedar su estela.',
      ],
      [
        'Radiotelefonía clara y confirmación',
        'Una comunicación aeronáutica eficaz identifica a quién se llama, quién transmite, dónde está y qué necesita, con fraseología y procedimientos aplicables al servicio y al país. Escuchá antes de transmitir, usá mensajes concisos y confirmá los datos críticos que la normativa o el servicio requieran repetir. No inventes abreviaturas ni adoptes fraseología FAA como si fuera local. En Argentina, consultá la AIP y las normas de telecomunicaciones vigentes; practicá las comunicaciones de aeródromo con instructor y usando las frecuencias publicadas.',
        'Si una instrucción o autorización no se entendió, solicitá repetición o aclaración antes de actuar.',
      ],
    ],
  },
  {
    id: 13,
    slug: 'maniobras-basicas',
    title: 'Maniobras básicas de vuelo',
    eyebrow: 'Actitud, energía y trayectoria',
    minutes: 55,
    intro: 'Relacioná lo que muestra la aeronave con la trayectoria que querés volar. Estos fundamentos acompañan la instrucción práctica; no sustituyen las técnicas, velocidades ni listas del avión concreto.',
    lessons: [
      [
        'Actitud, trayectoria y ángulo de ataque',
        'La actitud describe la orientación de la aeronave respecto del horizonte; la trayectoria describe su movimiento sobre la masa de aire. El ángulo de ataque es el ángulo entre una referencia del perfil alar y el viento relativo. Cambios de actitud, potencia, configuración y velocidad alteran conjuntamente la trayectoria y la energía. El piloto los interpreta con referencias visuales e instrumentos disponibles, sin asumir que una actitud fija produce siempre la misma velocidad o razón de ascenso.',
        'Actitud, trayectoria y ángulo de ataque están relacionados, pero no son intercambiables.',
        'flightpath',
      ],
      [
        'Vuelo recto y nivelado',
        'En vuelo recto y nivelado se busca conservar rumbo, altitud, velocidad y coordinación dentro de tolerancias definidas por el ejercicio. Pequeños cambios de actitud, potencia o compensación afectan más de una variable; el piloto observa la tendencia, realiza correcciones oportunas y vuelve a comprobar el resultado. Turbulencia, peso, configuración y centrado cambian la respuesta. Los valores de referencia y el uso de compensadores se aprenden con el instructor y el manual de vuelo del avión.',
        'Mirá la tendencia antes de corregir y verificá después si la respuesta fue la esperada.',
      ],
      [
        'Ascensos y descensos',
        'Al ascender o descender, la aeronave intercambia energía entre movimiento, altura y potencia. La razón de cambio depende del empuje disponible, resistencia, peso, configuración, velocidad y condiciones atmosféricas. Una variación de potencia puede afectar velocidad y trayectoria; una variación de actitud también modifica fuerzas y carga. Vx, Vy y las velocidades de descenso son referencias específicas de la aeronave y de la condición, no valores para memorizar entre modelos. Las limitaciones, ajustes y perfiles se estudian en el POH/AFM y se practican bajo supervisión.',
        'Para entender una maniobra, seguí qué sucede con energía, velocidad y trayectoria a la vez.',
      ],
      [
        'Virajes coordinados, resbale y derrape',
        'Un viraje cambia la dirección de la trayectoria mediante inclinación; para conservar altura, la sustentación y la carga deben ajustarse. La bola del inclinómetro ayuda a reconocer deslizamiento lateral, pero se interpreta junto con actitud, trayectoria y referencias exteriores. En un resbale, el eje longitudinal no queda alineado con la trayectoria; en un derrape, la coordinación también está alterada pero la relación con el giro es distinta. La técnica de coordinación se entrena con instructor; evitar maniobras bruscas y exceso de carga reduce el riesgo de pérdida acelerada.',
        'La inclinación muestra el alabeo; la bola ayuda a evaluar coordinación, no indica por sí sola el rumbo ni la trayectoria.',
      ],
      [
        'Vuelo lento y margen respecto de la pérdida',
        'En vuelo lento, para sostener el peso el ala opera con mayor coeficiente de sustentación y, según el avión, los mandos pueden sentirse menos eficaces. Potencia, resistencia, configuración y coordinación influyen en el control de velocidad y trayectoria. Una pérdida puede ocurrir a cualquier velocidad si se excede el ángulo de ataque crítico; por eso el ejercicio reconoce indicios y mantiene atención a la coordinación, no busca una cifra universal. Se practica solo en las condiciones, alturas, configuraciones y aeronaves aprobadas por el instructor y el manual.',
        'Las velocidades, señales y acciones de recuperación son específicas del avión y del ejercicio aprobado.',
      ],
      [
        'Despegue y decisión de interrumpir',
        'El despegue combina configuración, aceleración, control direccional y transición a ascenso. Viento, superficie, pendiente, masa, obstáculos y técnica cambian la distancia y el margen. Antes de iniciar, el piloto debe conocer los datos aplicables y acordar con el instructor qué anomalías o condiciones motivarían interrumpir la carrera. Un despegue de campo corto, blando o con viento cruzado exige técnica específica; no existe una secuencia única que sirva para todas las aeronaves. Usá el POH/AFM y datos del aeródromo vigentes.',
        'Las distancias y velocidades no se trasladan de un avión a otro ni se extrapolan fuera de las tablas publicadas.',
      ],
      [
        'Variantes de despegue y sus márgenes',
        'Un despegue normal, de campo corto, de superficie blanda, con obstáculos o con viento cruzado cambia qué riesgos y datos deben considerarse. La técnica puede modificar configuración, aceleración, control direccional o trayectoria, pero sus diferencias dependen del avión, la superficie, el viento y el programa de instrucción. Compará la distancia requerida con la disponible usando las tablas, condiciones y notas aplicables; conocé en tierra los criterios para interrumpir la carrera. No combines pasos de técnicas distintas ni adoptes velocidades de otro modelo.',
        'El nombre de la maniobra no define la secuencia: aprendé objetivo, límites y técnica del POH/AFM y de tu instructor.',
      ],
      [
        'Aproximación, aterrizaje y motor y al aire',
        'El circuito prepara la transición desde vuelo en ruta a una aproximación estabilizada y una toma controlada. En el aterrizaje se administra energía para cruzar la zona de aproximación, reducir el descenso cerca de la superficie y mantener control durante contacto y rodaje. Viento, pista, obstáculos, configuración y tren modifican la técnica. Si la aproximación deja de cumplir los criterios enseñados, un motor y al aire conserva opciones; potencia, configuración, trayectoria y comunicaciones se gestionan según el procedimiento del avión y el aeródromo. Las reglas locales de circuito se verifican en AIP y publicaciones vigentes.',
        'Una aproximación inestable se corrige con la decisión practicada en tierra; no se fuerza una toma por presión o por estar cerca del suelo.',
      ],
      [
        'Referencias visuales en final y aterrizaje',
        'En una aproximación visual se evalúan alineación con la pista, trayectoria, tendencia de descenso, desplazamiento lateral y cambios de perspectiva junto con velocidad, configuración y referencias instrumentales disponibles. Una única referencia visual puede engañar por pendiente, anchura de pista, terreno, iluminación o viento. En la toma se conserva control y se reduce la energía conforme a la técnica del avión; luego se mantiene el eje durante la carrera y se abandona la pista según la situación. Los criterios para continuar, corregir o hacer motor y al aire se acuerdan en tierra y son propios del entrenamiento y aeródromo.',
        'El diagrama es una vista lateral conceptual, sin ángulo, altura ni punto de toma prescriptos.',
        'landing-approach',
      ],
      [
        'Redondeo, contacto y carrera de aterrizaje',
        'El redondeo —también llamado flare— enlaza la senda de descenso con el contacto y la desaceleración sobre la pista. La percepción de altura, velocidad y movimiento cambia con la perspectiva, el viento, la configuración y la geometría del avión; por eso no existe una altura ni una actitud universal para iniciar la maniobra. Llegar con exceso de energía puede prolongar la flotación; una corrección brusca cerca del suelo puede producir una respuesta no deseada. Después del contacto se mantiene el control direccional y se desacelera con las técnicas y límites publicados. Las señales, velocidades, uso de frenos y criterios de toma se aprenden para el modelo y la pista concretos.',
        'Estudiá en tierra qué referencias enseña el instructor y qué dice el POH/AFM para ese avión; no copies una altura o secuencia de otro modelo.',
      ],
    ],
  },
  {
    id: 10,
    slug: 'decision-y-riesgo',
    title: 'Decisión y gestión del riesgo',
    eyebrow: 'Detectar peligros antes de que reduzcan tus opciones',
    minutes: 40,
    intro: 'Convertí la planificación y la información del vuelo en decisiones revisables: salir, esperar, desviarse o cancelar.',
    lessons: [
      [
        'Peligros, riesgos y mitigaciones',
        'Un peligro es una condición que puede contribuir a un daño; el riesgo combina la probabilidad y las consecuencias de ese daño. Una amenaza aislada —por ejemplo, viento cruzado— puede ser manejable, pero varias condiciones simultáneas elevan la carga y reducen el margen: cansancio, pista corta, pronóstico incierto y presión por llegar. Identificá qué puede salir mal, qué tan grave sería, qué barreras existen y qué señal te hará cambiar de plan. Si las mitigaciones no dejan un margen aceptable, la decisión segura puede ser demorar, cambiar destino o cancelar.',
        'Evaluar riesgo no es asignar una puntuación para “aprobar” el vuelo: es decidir si las barreras alcanzan y conservar una salida segura.',
      ],
      [
        'Un ciclo breve para decidir',
        'Como hábito didáctico, observá la situación, interpretá qué significa, elegí una acción y comprobá su efecto. La evaluación se repite cuando cambian el tiempo, el combustible, el estado del piloto, el avión o el entorno. Herramientas como PAVE ayudan a buscar peligros del piloto, aeronave, entorno y presiones externas; no sustituyen el criterio ni son una lista reglamentaria argentina. Anotá de antemano señales que disparan una espera, retorno o desvío: decidir con anticipación reduce la influencia de la sorpresa y de la presión por continuar.',
        'El diagrama es un modelo de estudio. Aplicá los procedimientos del curso y las reglas vigentes.',
        'decision-loop',
      ],
      [
        'Mínimos personales y presión externa',
        'Los mínimos personales expresan límites elegidos antes del vuelo para condiciones como visibilidad, viento, techo, experiencia reciente, fatiga o complejidad de la ruta. Deben ser más conservadores que los límites legales cuando la experiencia o el contexto lo aconsejen; nunca habilitan a operar fuera de la normativa o de las limitaciones del avión. Revisalos en frío, después de una experiencia relevante y antes de un vuelo que los ponga a prueba. La presión de pasajeros, horarios, costos o expectativas es un peligro que conviene reconocer y discutir antes de que empiece la carrera.',
        'Es más fácil sostener un límite decidido en tierra que inventar uno bajo presión en vuelo.',
      ],
      [
        'Escenario: el pronóstico se deteriora',
        'Imaginá una travesía con una ventana de regreso ajustada. El pronóstico de destino empeora, el viento observado difiere del previsto y el piloto ya lleva varias horas de actividad. Antes de salir, definí alternativas y condiciones para esperar o cancelar. En ruta, contrastá observación, pronóstico y progreso; actualizá combustible y hora estimada. Si las condiciones cruzan el límite elegido, ejecutá la alternativa prevista con tiempo suficiente. El ejercicio no tiene un único umbral numérico: la decisión depende del piloto, avión, ruta, fuentes oficiales y reglas aplicables.',
        'Una buena planificación incluye razones concretas para no iniciar o para dejar de continuar el vuelo.',
      ],
    ],
  },
  {
    id: 11,
    slug: 'factores-humanos',
    title: 'Factores humanos',
    eyebrow: 'El piloto también forma parte del sistema',
    minutes: 45,
    intro: 'Reconocé cómo salud, percepción, fatiga y carga de trabajo afectan la atención y el control de la aeronave.',
    lessons: [
      [
        'Aptitud antes del vuelo',
        'Una enfermedad, dolor, falta de sueño, deshidratación, estrés o medicación pueden reducir atención, memoria, coordinación y juicio. La lista IMSAFE —enfermedad, medicación, estrés, alcohol, fatiga y emoción— es una ayuda de autoevaluación, no una autorización médica ni una norma argentina. Considerá también los efectos posteriores a una actividad exigente y la combinación de varios factores. Si tu aptitud es dudosa, no la compenses con más concentración: consultá las reglas médicas aplicables y decidí antes de volar.\n\nCada letra nombra un mecanismo, no un trámite. Una enfermedad puede tapar el oído medio y convertir un descenso en dolor. Una medicación de venta libre sigue teniendo efecto, y la autorización la da el marco médico aeronáutico, no el prospecto. El estrés estrecha la atención. El alcohol puede seguir alterando el sueño y el oído interno aunque hayan pasado las horas mínimas de la norma. La fatiga baja el tiempo de reacción antes de que la persona se sienta incapaz, y la cafeína no la corrige de forma fiable. Una emoción fuerte ocupa la misma memoria de trabajo que la navegación. Si dos letras están en duda el mismo día, el margen ya no es el de un solo factor.',
        'Preguntarte “¿estoy en condiciones de volar hoy?” es parte de la preparación, no una señal de debilidad.',
        'imsafe',
      ],
      [
        'Oxígeno, hipoxia y monóxido de carbono',
        'La hipoxia ocurre cuando los tejidos no reciben oxígeno suficiente; la altitud, el esfuerzo, la enfermedad y otros factores pueden afectar su aparición y percepción. El deterioro del juicio puede impedir que el piloto reconozca el problema. El monóxido de carbono, posible contaminante de los gases de escape, no se detecta por olor y puede causar dolor de cabeza, mareo, somnolencia y confusión. Conocé los límites y procedimientos de la aeronave y los requisitos médicos y operativos vigentes. Ante una sospecha, aplicá la lista aprobada y priorizá aterrizar con seguridad; no dependas de identificar todos los síntomas.\n\nConviene separar cuatro caminos, porque la prevención no es la misma. La hipoxia hipóxica aparece cuando baja la presión parcial de oxígeno en el aire inspirado: es la de la altitud. La hipémica ocurre cuando la sangre transporta menos oxígeno, como con monóxido de carbono o anemia. La de estancamiento aparece si la circulación no alcanza, por una carga G positiva fuerte o un problema circulatorio. La histotóxica ocurre cuando el tejido no puede usar el oxígeno que le llega; el alcohol y algunos tóxicos actúan por ahí.\n\nEl tiempo de conciencia útil es el intervalo en el que todavía se pueden hacer tareas. En material de instrucción de la FAA, a 18 000 ft ronda los 20 a 30 minutos y a 25 000 ft cae a unos pocos minutos. Son órdenes de magnitud para ver la curva, no una autorización ni un límite personal. El juicio se deteriora antes que la capacidad de darse cuenta.',
        'Las reglas de oxígeno y las acciones ante sospecha de contaminación se verifican en la RAAC y el manual del avión vigentes.',
        'hypoxia-types',
      ],
      [
        'Desorientación espacial e ilusiones',
        'El sistema vestibular puede confundir aceleración o un viraje prolongado con cambios de actitud. La oscuridad, un horizonte inclinado, neblina, terreno uniforme o luces pueden dar referencias visuales engañosas. Cuando la percepción corporal y las indicaciones fiables discrepan, intentar “corregir por sensación” puede agravar la situación. La prevención comienza antes del vuelo: reconocer condiciones que eliminan referencias, mantenerse dentro de la habilitación y entrenamiento, y evitar entrar inadvertidamente en condiciones para las que no se está preparado. La recuperación instrumental se practica con instructor en el entorno aprobado.',
        'Una sensación intensa no es necesariamente una referencia fiable de actitud; entrená a reconocer cuándo no lo es.',
      ],
      [
        'Atención, carga de trabajo y conciencia situacional',
        'La carga de trabajo crece cuando coinciden tareas nuevas, comunicaciones, navegación, clima y fallas. Bajo saturación, una persona puede fijarse en un solo indicador, olvidar pasos o dejar de vigilar el entorno. Reducí tareas no esenciales, usá listas y procedimientos, pedí ayuda cuando esté disponible y mantené una secuencia que priorice control, trayectoria y comunicación según el entrenamiento recibido. La conciencia situacional incluye saber dónde está la aeronave, qué sucede alrededor y qué cambio es probable a continuación.',
        'Si sentís que te atrasás respecto del avión, simplificá la tarea y recuperá primero una condición controlable.',
      ],
    ],
  },
  {
    id: 12,
    slug: 'procedimientos-emergencias',
    title: 'Procedimientos y emergencias',
    eyebrow: 'Prepararse, reconocer y responder con método',
    minutes: 50,
    intro: 'Relacioná las maniobras de vuelo con energía, listas, limitaciones y opciones ante una condición anormal.',
    lessons: [
      [
        'Procedimientos normales y uso de listas',
        'Las listas normalizan una secuencia y ayudan a no omitir pasos; no reemplazan el conocimiento del sistema ni la vigilancia. Estudiá qué verificaciones se hacen de memoria por diseño del procedimiento y cuáles se leen, y cómo se coordinan piloto e instructor. La secuencia, terminología y acciones cambian entre aeronaves. Usá la lista aprobada para el modelo y revisión correctos, entendé la razón de cada ítem y no adaptes de memoria una lista de otro avión.',
        'Una lista funciona cuando se usa como parte del flujo de trabajo y se confirma cada acción de manera consciente.',
      ],
      [
        'Energía en despegue, aproximación y aterrizaje',
        'La trayectoria depende de velocidad, potencia, actitud, configuración y altura disponible. En el despegue, las condiciones de pista y el ascenso inicial deben compararse con los datos y procedimientos publicados. En la aproximación, una velocidad o altura excesivas requieren más espacio para disipar energía; configuraciones tardías o cambios bruscos aumentan la carga de trabajo. La aproximación estabilizada define criterios observables para continuar o frustrar según el avión y la instrucción. Las velocidades, puntos de decisión y acciones exactas se aprenden en el POH/AFM y con un instructor habilitado.',
        'No intentes rescatar una aproximación inestable acercándote al suelo: aplicá el criterio de frustrada enseñado para esa aeronave.',
      ],
      [
        'Pérdidas, barrenas y prevención de pérdida de control',
        'Una pérdida resulta de exceder el ángulo de ataque crítico; una barrena añade rotación autorrotativa y requiere condiciones y recuperación específicas. La prevención se basa en reconocer energía y coordinación, mantener márgenes y evitar aplicar controles que agraven la situación. Las maniobras de reconocimiento y recuperación se practican únicamente con instrucción, altura, aeronave y condiciones aprobadas. No existe una secuencia universal que deba ejecutarse en cualquier modelo: la prioridad es la técnica publicada para la aeronave y el curso, y la respuesta ante una emergencia real sigue el manual aprobado.',
        'No practiques pérdidas ni barrenas por cuenta propia. Requieren instructor, avión autorizado y condiciones de entrenamiento definidas.',
      ],
      [
        'Pérdida de potencia y aterrizaje forzoso',
        'Una pérdida de potencia deja de ser un ejercicio cuando ocurre en vuelo. La elección de área depende de altura, terreno, viento, obstáculos, configuración y respuesta de la aeronave. Mantener control y velocidad, seleccionar una zona alcanzable, preparar la cabina y comunicar son objetivos generales de entrenamiento; las acciones, prioridades y listas concretas dependen del POH/AFM y de la instrucción para ese modelo. Practicá escenarios simulados con un instructor, sin cortar potencia ni ejecutar maniobras fuera de un entorno autorizado.',
        'Aprendé en tierra la lista de emergencia de tu avión y practicá con instructor cómo tomar decisiones sin improvisar procedimientos.',
      ],
      [
        'Comunicación y contingencias',
        'Ante una anormalidad, las comunicaciones ayudan a coordinar asistencia, pero no deben distraer del control de la aeronave. El orden y las acciones dependen de la situación, las capacidades del piloto, el equipo disponible y la normativa. Una falla de radio no tiene una solución única para todos los vuelos: el equipo, espacio aéreo, fase, aeródromo y procedimientos publicados determinan qué hacer. Estudiá los procedimientos de falla de comunicaciones aplicables en la RAAC, AIP, manual del equipo y material de instrucción vigente antes de necesitarlos.\n\nUn orden que sirve para entrenar la atención, no una regulación: primero controlar la aeronave, después orientar la trayectoria hacia una opción alcanzable, y recién entonces comunicar. En la instrucción en inglés se resume como aviate, navigate, communicate. Si la radio ocupa las manos y la mirada mientras la velocidad o el rumbo se van, el mensaje llegó tarde. Comunicar sigue siendo parte de la emergencia: posición, intención e identificación ayudan a quien puede asistir. El orden solo evita que la llamada reemplace el control.',
        'No asumas que un procedimiento FAA de pérdida de comunicaciones es el procedimiento argentino.',
        'priority',
      ],
      [
        'Falla de comunicaciones: reconocer el alcance',
        'Ante una discrepancia, distinguí si afecta transmisión, recepción o ambas, y si el problema parece estar en el equipo, la frecuencia, la selección de audio o la alimentación eléctrica, siempre que comprobarlo no quite atención del control del avión. El procedimiento posterior depende de las reglas vigentes, el espacio aéreo, la fase del vuelo, el equipo y la publicación local; no existe una secuencia universal. Estudiá y practicá en tierra qué establece la RAAC y la AIP para tu operación, además de las instrucciones del manual del equipo y de la aeronave.',
        'No apliques automáticamente códigos, luces o procedimientos de pérdida de comunicaciones publicados para Estados Unidos.',
      ],
    ],
  },
];

const sourceIds = {
  aerodinamica: ['phak', 'afh'],
  motopropulsor: ['phak', 'afh'],
  instrumentos: ['phak'],
  regulaciones: ['anacPpa', 'raac', 'raac61', 'raac91', 'raac91Plan', 'raac91Equipment', 'raac91BushStol', 'aip'],
  generalidades: ['phak', 'weightBalance', 'anacPpa'],
  meteorologia: ['phak', 'weather', 'metArgentina', 'raac203'],
  performance: ['phak', 'afh', 'weightBalance'],
  navegacion: ['phak', 'aip'],
  'operaciones-aerodromo': ['phak', 'afh', 'aip', 'raac'],
  'decision-y-riesgo': ['phak', 'risk', 'anacPpa'],
  'factores-humanos': ['phak', 'risk', 'anacPpa'],
  'procedimientos-emergencias': ['afh', 'phak', 'anacPpa', 'raac', 'aip'],
  'maniobras-basicas': ['afh', 'phak', 'anacPpa'],
};

/**
 * Frontera biblioteca <-> banco de exámenes.
 *
 * Los primeros ocho capítulos coinciden 1:1 con el temario del examen PPA: mismo título, mismo
 * orden, y por eso tienen preguntas publicadas para practicar. Los cinco restantes son material
 * propio de la biblioteca y no tienen banco asociado.
 *
 * El vínculo se declara explícitamente en vez de heredarse de la posición en el temario, para que
 * mover o agregar un capítulo no cambie en silencio el destino del botón del pie. El `id` del
 * capítulo de biblioteca ya no es además el número de capítulo de examen.
 */
export const EXAM_LINK = Object.freeze(
  Object.fromEntries(examChapters.map((chapter) => [chapter.slug, chapter.id])),
);
export const EXAM_LINK_LABEL = 'Examen PPA';
export const LIBRARY_ONLY_REASON = 'Tema de biblioteca: todavía no hay banco de examen asociado.';

const withExamLink = (chapter, lessons) => ({
  ...chapter,
  lessons,
  sources: (sourceIds[chapter.slug] ?? ['anacPpa', 'phak']).map((id) => librarySources[id]),
  examChapterId: EXAM_LINK[chapter.slug] ?? null,
});

const expandedExamChapters = examChapters.map((chapter) => withExamLink(
  chapter,
  [...chapter.lessons, ...(additions[chapter.slug] ?? []), ...(handbookLessons[chapter.slug] ?? [])],
));

export const chapters = [...expandedExamChapters, ...newChapters.map((chapter) => withExamLink(
  chapter,
  [...chapter.lessons, ...(handbookLessons[chapter.slug] ?? [])],
))].sort((a, b) => a.id - b.id);
