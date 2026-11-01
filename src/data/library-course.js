import { chapters as examChapters } from './ppa-course.js';
import { librarySources } from './library-sources.js';
import { maneuverChapters } from './maneuvers.js';

const newChapters = [
  {
    id: 9,
    slug: 'operaciones-aerodromo',
    title: 'Operaciones de aeródromo',
    eyebrow: 'Orientarse en tierra y ordenar el tránsito en el circuito',
    minutes: 45,
    intro: 'Leé la información del aeródromo, entendé cada autorización y seguí el tránsito con una secuencia clara.',
    legacyAnchors: {
      'leccion-1': 'antes-de-rodar',
      'leccion-2': 'arranque-comprobaciones-y-briefing-previo-al-despegue',
      'leccion-3': 'rodaje-y-prevencion-de-incursiones',
      'leccion-4': 'mandos-al-rodar-con-viento',
      'leccion-5': 'que-dice-el-numero-de-pista',
      'leccion-6': 'despues-del-aterrizaje-y-salida-de-pista',
      'leccion-7': 'circuito-de-transito-y-conciencia-de-trafico',
      'leccion-8': 'estela-turbulenta-y-separacion',
      'leccion-9': 'radiotelefonia-clara-y-confirmacion',
      'leccion-10': 'marcas-y-carteles-frenar-antes-de-la-pista',
      'leccion-11': 'luces-senda-y-manga',
    },
    lessons: [
      [
        'Antes de rodar',
        'Antes de rodar, buscá los datos del aeródromo en la AIP (Publicación de Información Aeronáutica) y en las cartas. Los NOTAM son avisos de cambios temporarios. Confirmá pista, calles de rodaje, obras, obstáculos, frecuencias y restricciones.\n\nLa pista en uso puede cambiar. Confirmala por el ATIS (Servicio Automático de Información Terminal), si existe, o con los ATS (servicios de tránsito aéreo), según el procedimiento local. En cabina, ubicá la ruta y acordá quién maneja. Si una instrucción no queda clara, detenete en un lugar seguro y pedí que la repitan.',
        'Primero ubicá la ruta y entendé la instrucción. Después empezá a rodar.',
      ],
      [
        'Arranque, comprobaciones y briefing previo al despegue',
        'El arranque pone el motor en funcionamiento. Las comprobaciones posteriores permiten observar si trabaja dentro de sus límites. La prueba de motor y la revisión previa al despegue también confirman que el avión está preparado.\n\nEl briefing es un repaso hablado del plan: pista, viento, trayectoria, obstáculos, tareas y condiciones para interrumpir. Acordalo antes de entrar en la carrera. Los puntos y valores se estudian con la lista aprobada del avión.',
        'La lista organiza la comprobación. El briefing aclara qué hará cada persona.',
      ],
      [
        'Radiotelefonía clara y confirmación',
        'La radiotelefonía es la comunicación por radio. Un mensaje claro identifica a quién llamás, quién sos, dónde estás y qué necesitás, y usa la fraseología aplicable.\n\nEscuchá antes de transmitir y mantené el mensaje breve. Repetí los datos críticos cuando lo exija el servicio. En Argentina, las frecuencias y procedimientos se consultan en las publicaciones vigentes. Si no entendiste una instrucción o autorización, pedí que la repitan antes de actuar.',
        'Un mensaje corto sirve si identifica quién llama, dónde está y qué necesita.',
      ],
      [
        'Qué dice el número de pista',
        'El número de pista es el rumbo magnético de ese eje, redondeado a la decena más cercana, sin el último cero. La pista 09 apunta cerca de los 090°. La 27, cerca de los 270°.\n\nSi el rumbo magnético es 094°, se redondea a 090° y la pista se llama 09. Si es 086°, también queda 09. Cada cabecera mira al sentido contrario: 09 y 27 son el mismo pavimento, desde puntas opuestas.\n\nEl viento del día no cambia el número. La brújula del avión puede no leerlo exacto, porque tiene su propio desvío. El número describe el eje magnético de la pista.',
        'El número de pista es el rumbo magnético, redondeado a la decena, sin el cero final.',
        'runway-number',
      ],
      [
        'Marcas y carteles: frenar antes de la pista',
        'Las marcas y carteles ayudan a orientarte en el aeródromo. El punto de espera de pista indica dónde detenerte antes de entrar. La RAAC (Regulaciones Argentinas de Aviación Civil) exige detenerte en los puntos de espera de pista y ante las barras de parada iluminadas. Si hay control, avanzá cuando te autorice. Si no lo hay, seguí el procedimiento local y confirmá que la pista y el tramo final estén libres.\n\nUn umbral desplazado marca el comienzo de la zona disponible para aterrizar más adelante. El pavimento anterior puede servir para rodar o despegar si así se publica para esa pista, pero no es zona de toma. Las marcas de superficie cerrada indican que esa superficie no se usa.\n\nUS: En aeropuertos de la FAA, los carteles de prohibición son rojos con letras blancas y el punto de espera se marca en amarillo. LAHSO (Land and Hold Short Operations) autoriza aterrizar y detenerse antes de una pista que cruza. Las distancias en pies también corresponden a ese sistema. En Argentina, confirmá marcas y procedimientos en la AIP del aeródromo.',
        'En el punto de espera, con control esperá autorización. Sin control, seguí el procedimiento local y confirmá que la pista esté libre.',
      ],
      [
        'Rodaje y prevención de incursiones',
        'Rodar es desplazarse por tierra con la aeronave. Una incursión de pista ocurre cuando una aeronave, vehículo o persona ocupa una pista protegida sin corresponder.\n\nSeguí la ruta en la carta y compará lo que ves con señales, marcas e instrucciones. Antes de cruzar o entrar en una pista, la vigilancia visual acompaña la autorización aplicable. Si perdés orientación o algo no coincide, detené el avión si es seguro y aclaralo antes de seguir.',
        'La autorización y la vigilancia se complementan: usá ambas antes de ocupar una pista.',
      ],
      [
        'Mandos al rodar con viento',
        'Al rodar, el viento empuja el ala y la cola. Si viene derecho de adelante, los alerones quedan neutros. Si viene de adelante y de un costado, el mando se gira hacia el viento, para que el alerón de ese lado suba. Si viene de atrás y de un costado, se gira al revés, para que ese alerón baje, y el elevador va abajo.\n\nEn un triciclo, con viento de frente el elevador queda neutro. En un patín de cola, con viento de frente el elevador va arriba, para que el viento no levante la cola. Con viento de cola, en los dos, el elevador va abajo.\n\nEs la figura de instrucción del Airplane Flying Handbook, no el límite de cada modelo. Si el manual de tu avión indica otra posición, seguí esa.',
        'Frente: alerón arriba del lado del viento. Cola: ese alerón abajo y el elevador abajo.',
        'taxi-wind',
      ],
      [
        'Circuito de tránsito y conciencia de tráfico',
        'El circuito de tránsito ordena los tramos alrededor de la pista: salida, viento cruzado, tramo inicial (paralelo a la pista, con viento en cola), básica y final. Te permite preparar el aterrizaje y saber dónde buscar a los demás.\n\nLa norma del circuito tipo está en Regulaciones, «Circuito de tránsito». Si la AIP publica otro circuito, seguí lo publicado. Mirá el tránsito y comunicá tu posición cuando corresponda. El dibujo es conceptual.',
        'El esquema enseña la secuencia. La publicación del aeródromo define el circuito que vas a usar.',
        'traffic-pattern',
      ],
      [
        'Estela turbulenta y separación',
        'La estela turbulenta es el aire giratorio que queda detrás de las alas. Al producir sustentación, el aire fluye alrededor de las puntas y forma vórtices, remolinos que pueden persistir después de que pase el avión.\n\nSuele ser más intensa detrás de un avión pesado, lento y con los flaps retraídos. Su ala necesita producir mucha sustentación y trabaja con más ángulo de ataque. El viento puede desplazar esos remolinos. Usá la separación y los procedimientos aplicables. La estela puede persistir aunque ya no veas al avión precedente.',
        'El avión deja remolinos invisibles. Pensá dónde los llevó su trayectoria y el viento.',
        'wake-vortex',
      ],
      [
        'Luces, senda y manga',
        'Las luces de borde muestran los límites de la pista. Las calles de rodaje usan otras luces para distinguirse. Los colores y su disposición se leen en la publicación del aeródromo.\n\nEl PAPI, indicador de trayectoria de aproximación de precisión, y el VASI, indicador visual de senda, muestran si estás alto o bajo respecto de una senda. En el PAPI habitual de cuatro luces, dos blancas y dos rojas indican que estás en la senda. Con más blanco estás alto y con más rojo, bajo. En el VASI de dos barras, rojo sobre blanco indica la senda.\n\nLa manga se infla con el viento. La boca ancha mira hacia donde viene el viento y la punta angosta, hacia donde va.\n\nUS: La frase «red over white, you’re all right» recuerda el VASI en los manuales FAA. Muchas instalaciones usan 3°, pero no todas. El ángulo y el lado de las luces se consultan en la ficha del aeródromo.',
        'En el PAPI habitual, dos blancas y dos rojas indican que estás en la senda. Más blanco es alto y más rojo, bajo.',
        'papi',
      ],
      [
        'Después del aterrizaje y salida de pista',
        'Después del contacto, mantené el control direccional y reducí la velocidad. Salí por una calle de rodaje cuando puedas hacerlo sin un giro brusco y según las instrucciones aplicables.\n\nUna vez fuera de la pista, ubicá la ruta siguiente antes de moverte y completá la lista posterior al aterrizaje. Las marcas y autorizaciones indican dónde continuar o detenerse. La secuencia exacta se aprende con la publicación del aeródromo y la lista del avión.',
        'Aterrizar termina el vuelo en pista. Todavía falta orientarse y rodar hasta destino.',
      ],
    ],
  },
  {
    id: 10,
    slug: 'decision-y-riesgo',
    title: 'Decisión y gestión del riesgo',
    eyebrow: 'Reconocer peligros y conservar opciones para decidir',
    minutes: 40,
    intro: 'Identificá qué puede salir mal, qué margen tenés y cuándo conviene cambiar el plan.',
    lessons: [
      [
        'Peligros, riesgos y mitigaciones',
        'Un peligro es algo que puede causar daño. El riesgo combina qué tan probable es y qué tan grave sería. Viento cruzado, cansancio o una pista corta son ejemplos de peligros.\n\nUna mitigación es una medida que reduce la probabilidad o las consecuencias. Pensá qué barrera tenés y qué señal mostraría que dejó de alcanzar. Varios peligros juntos pueden achicar el margen aunque cada uno parezca manejable. Si el riesgo sigue alto, demorar, cambiar destino o cancelar son decisiones posibles.',
        'Nombrá el peligro, estimá sus consecuencias y comprobá si tus barreras alcanzan.',
      ],
      [
        'Un ciclo breve para decidir',
        'Decidir puede pensarse como un ciclo: observá qué pasa, interpretá qué significa, elegí una acción y comprobá el resultado. Si cambian el tiempo, combustible o estado del piloto, empezá otra vuelta.\n\nPAVE organiza la revisión del piloto, la aeronave, el entorno y las presiones externas. Es una ayuda para detectar peligros, no una regla argentina. Antes de salir, anotá señales que te harían esperar, volver o desviarte. El diagrama muestra cómo se repite el ciclo.',
        'Decidir no es un paso único: observá, interpretá, actuá y volvé a comprobar.',
        'decision-loop',
      ],
      [
        'Mínimos personales y presión externa',
        'Los mínimos personales son límites que elegís antes de volar para condiciones como visibilidad, viento, fatiga o experiencia reciente. Te ayudan a decidir si el día y el vuelo están dentro de tu capacidad.\n\nElegilos con tiempo y revisalos cuando cambien tu experiencia o situación. Ningún mínimo personal permite exceder una regla ni una limitación del avión. Pasajeros, horarios o costos pueden presionarte para continuar. Reconocé esa presión antes de empezar.',
        'Un límite acordado en tierra es más fácil de sostener cuando aparece presión.',
      ],
      [
        'Escenario: el pronóstico se deteriora',
        'Imaginá que el pronóstico de destino empeora y el viento real difiere del previsto. Además, llevás varias horas de actividad y el regreso tiene horario ajustado.\n\nAntes de salir, elegí alternativas y condiciones para esperar o cancelar. En ruta, compará observación, pronóstico y progreso. Revisá combustible y hora estimada. Si aparece la señal que habías definido, usá la alternativa con tiempo suficiente. No hay un umbral único para todos los vuelos.',
        'Un buen plan dice qué condición te haría dejar de continuar.',
      ],
      [
        'Cinco formas de engañarte',
        'Algunas actitudes empujan a decidir mal: antiautoridad («esa regla no es para mí»), impulsividad («tengo que hacer algo ya»), invulnerabilidad («a mí no me pasa»), «macho» («puedo con esto») y resignación («no hay nada que hacer»).\n\nLa respuesta se prepara en tierra: respetar la regla, frenar, reconocer que puede pasar, no demostrar nada y buscar otra opción. Podés demorar, desviarte, pedir ayuda o cancelar.\n\nUS: La FAA enseña estos cinco nombres como actitudes de riesgo y propone antídotos. No son una lista de infracciones de la RAAC. Sirven para reconocer una forma de pensar.',
        'Reconocé la frase de riesgo y ensayá su antídoto antes de que aparezca en vuelo.',
      ],
      [
        'Probabilidad y gravedad',
        'Para pensar un riesgo, preguntá dos cosas: qué probabilidad tiene y qué tan grave sería. Un hecho frecuente puede tener poco impacto. Uno raro puede tener consecuencias serias.\n\nAntes del vuelo, combiná amenazas posibles, como viento fuerte para tu experiencia, techo bajo o cansancio. Decidí en tierra qué combinaciones te hacen cambiar o cancelar el plan.\n\nUS: La tabla de colores del Risk Management Handbook de la FAA ayuda a ordenar factores. Es una herramienta de ese manual. No cambia los requisitos argentinos ni tus límites personales.',
        'Toda decisión de riesgo junta dos preguntas: ¿qué tan probable y qué tan grave?',
        'risk-matrix',
      ],
      [
        'Amenazas, errores y el estado en que queda el avión',
        'Una amenaza es algo externo que complica el vuelo, por ejemplo un pronóstico que empeora o un pasajero que apura. Un error es una acción u omisión del piloto, como seleccionar mal una frecuencia.\n\nSi el error deja al avión bajo, rápido o fuera de rumbo, aparece un estado no deseado. Cuanto antes reconozcas la amenaza o el error, más opciones tenés para corregir.\n\nUS: El manual de riesgo de la FAA presenta la cadena amenaza, error y estado no deseado con casos de Estados Unidos. El orden ayuda a analizar cualquier vuelo.',
        'Cortá la cadena temprano: reconocé la amenaza antes de que se convierta en un estado no deseado.',
      ],
      [
        'La automatización no elige por vos',
        'El piloto automático sigue las órdenes seleccionadas. No decide si siguen siendo seguras. Un modo es la función activa, como rumbo, navegación, altitud o descenso.\n\nCada vez que cambies un modo, nombralo y comprobá que el avión responda como esperás. Si el equipo no hace lo previsto, recuperá el control con la técnica que corresponda a ese avión. La misma atención vale para la ruta que muestra un GPS.\n\nUS: La FAA destaca las indicaciones de modo en aviones con cabina digital, instrumentos en pantallas, porque muestran qué función está activa. Ese hábito de verificar la automatización sirve en cualquier lugar.',
        'Si no podés decir qué modo está activo, todavía no verificaste qué trayectoria vuela el equipo.',
      ],
    ],
  },
  {
    id: 11,
    slug: 'factores-humanos',
    title: 'Factores humanos',
    eyebrow: 'Cómo el cuerpo y la atención cambian el vuelo',
    minutes: 45,
    intro: 'Aprendé a reconocer cuándo salud, percepción o cansancio pueden reducir tu margen como piloto.',
    legacyAnchors: {
      'leccion-1': 'aptitud-antes-del-vuelo',
      'leccion-2': 'oxigeno-hipoxia-y-monoxido-de-carbono',
      'leccion-3': 'oxigeno-que-pide-la-regla',
      'leccion-4': 'desorientacion-espacial-e-ilusiones',
      'leccion-5': 'atencion-carga-de-trabajo-y-conciencia-situacional',
      'leccion-6': 'respirar-de-mas',
      'leccion-7': 'como-mira-el-ojo',
      'leccion-8': 'alcohol-medicamentos-y-la-noche-anterior',
      'leccion-9': 'fatiga-y-estres',
      'leccion-10': 'volar-de-noche',
    },
    lessons: [
      [
        'Aptitud antes del vuelo',
        'IMSAFE es una ayuda para revisar tu aptitud: Illness (enfermedad), Medication (medicación), Stress (estrés), Alcohol (alcohol), Fatigue (fatiga) y Emotion (emoción). Dolor, falta de sueño o una emoción intensa pueden reducir atención, coordinación y juicio.\n\nLos efectos se pueden sumar. El estrés ocupa atención. La fatiga demora respuestas. Una congestión puede impedir que se iguale la presión en el oído durante un cambio de altura. La lista no es un certificado médico ni reemplaza las reglas. Si dudás de tu aptitud, resolvelo antes de volar.',
        'Revisá cada letra y también cómo se combinan los factores ese día.',
        'imsafe',
      ],
      [
        'Alcohol, medicamentos y la noche anterior',
        'El alcohol, algunos medicamentos y la falta de sueño pueden enlentecer decisiones aunque la persona sienta que está bien. Esa sensación no mide la aptitud para volar.\n\nRevisá en la RAAC vigente los plazos y las restricciones para actuar como tripulante. Consultá a tu médico aeronáutico si un medicamento o una sustancia puede afectar tu aptitud. Si sentís efectos o tenés dudas sobre tu aptitud, no vueles.\n\nUS: Para actuar como tripulante, la FAA pide al menos 8 horas desde la última bebida y un límite de alcohol en sangre de 0,04 %. Son valores estadounidenses, no requisitos de la RAAC argentina.',
        'Sentirse bien no confirma aptitud. Respetá la norma local y no vueles con efectos o dudas.',
      ],
      [
        'Fatiga y estrés',
        'La fatiga reduce atención y memoria de trabajo: podés corregir un error y pasar por alto el siguiente. El café no reemplaza el descanso.\n\nEl estrés también estrecha la atención, y podés quedarte concentrado en un instrumento o una conversación mientras otras tareas siguen. Prepará descanso, tiempo de margen y una condición clara para cancelar.',
        'El descanso y los márgenes se preparan antes de salir. En vuelo ya no podés recuperarlos.',
      ],
      [
        'Oxígeno, hipoxia y monóxido de carbono',
        'La hipoxia ocurre cuando los tejidos reciben poco oxígeno. Puede afectar el juicio antes de que notes que algo anda mal. El monóxido de carbono es un gas de combustión sin olor. Si entra en la cabina, puede causar dolor de cabeza, mareo, somnolencia y confusión. Si sospechás monóxido, seguí la lista aprobada del avión y planificá aterrizar cuanto antes.\n\nHay cuatro mecanismos. La hipoxia hipóxica aparece cuando baja el oxígeno disponible, como en altura. La hipémica ocurre cuando la sangre transporta menos oxígeno, por ejemplo por monóxido de carbono o anemia. La de estancamiento aparece cuando la circulación no lo lleva suficiente, por ejemplo con mucha carga G. La histotóxica ocurre cuando los tejidos no pueden usarlo. Algunas sustancias, como el alcohol, pueden interferir.\n\nEl tiempo de conciencia útil es el período en que todavía podés realizar tareas. Material de instrucción de la Administración Federal de Aviación de Estados Unidos (FAA) ofrece estimaciones aproximadas. A 18 000 ft (pies), estima 20 a 30 minutos. A 25 000 ft, pocos minutos. Son referencias, no un límite seguro.',
        'La hipoxia puede nublar el juicio antes de que el piloto reconozca sus propios síntomas.',
        'hypoxia-types',
      ],
      [
        'Oxígeno que pide la regla',
        'La Sección 91.211 se basa en la presión de la cabina. En un avión sin presurizar, esa presión es la de la altura a la que volás. En atmósfera estándar, 700 hPa equivalen a unos 10.000 ft (pies) y 620 hPa a unos 13.000 ft.\n\nNo se inicia un vuelo que vaya a quedar bajo 700 hPa si no se lleva oxígeno suficiente.\n\nTABLA: Presión de cabina | Quién lleva oxígeno | Cuánto\nEntre 700 y 620 hPa | toda la tripulación y, como mínimo, el 10 % de los pasajeros | el tramo que supere los 30 minutos\nBajo 620 hPa | toda la tripulación y todos los pasajeros | todo ese tramo; la tripulación que lo necesita lo usa de forma continua\n\nEl cuestionario a veces resume solo los 30 minutos entre 10.000 y 13.000 ft.',
        'De 10.000 a 13.000 ft, oxígeno pasado los 30 minutos. Por encima de 13.000, todos y todo el tiempo.',
        'oxygen-rule',
      ],
      [
        'Respirar de más',
        'La hiperventilación es respirar más de lo que el cuerpo necesita, a menudo por estrés, susto o dolor. Al bajar el dióxido de carbono en sangre pueden aparecer hormigueo, mareo y sensación de falta de aire.\n\nSe puede confundir con hipoxia, que es falta de oxígeno. En vuelo, si no distinguís hiperventilación de hipoxia, tratá la situación como posible hipoxia y seguí el procedimiento de oxígeno o descenso indicado para ese avión. Si descartás la falta de oxígeno, bajá el ritmo de la respiración.\n\nUS: Los textos de la FAA enseñan a reconocer la hiperventilación y controlar el ritmo respiratorio. Controlar el ritmo respiratorio no reemplaza el procedimiento de oxígeno o descenso aplicable al avión.',
        'Hiperventilar y tener hipoxia no son lo mismo. En vuelo seguí el procedimiento entrenado.',
      ],
      [
        'Desorientación espacial e ilusiones',
        'El sistema vestibular, ubicado en el oído interno, ayuda a percibir giros y aceleraciones. Puede confundir un viraje prolongado con vuelo recto, o una aceleración con la nariz que sube.\n\nNiebla, oscuridad, luces o un horizonte inclinado también pueden engañar la vista. Si el cuerpo y los instrumentos confiables parecen discrepar, la sensación corporal puede no describir la actitud real. Reconocer esas condiciones y entrenar dentro de la habilitación ayuda a prevenir la desorientación.',
        'Una sensación fuerte no siempre indica la actitud real del avión.',
      ],
      [
        'Atención, carga de trabajo y conciencia situacional',
        'La carga de trabajo es la cantidad de tareas que compiten por tu atención. Aumenta cuando se juntan navegación, comunicaciones, mal tiempo o una falla.\n\nCon demasiadas tareas, podés fijarte en un solo indicador y perder de vista el resto. La conciencia situacional es saber dónde estás, qué ocurre alrededor y qué puede pasar después. Usá listas, ordená prioridades y pedí ayuda si está disponible.',
        'Si te atrasás respecto del avión, simplificá tareas y recuperá una situación controlable.',
      ],
      [
        'Cómo mira el ojo',
        'De día, buscá tránsito recorriendo el cielo por sectores y alternando la mirada afuera con los instrumentos. De noche, la visión central distingue peor las luces débiles. Podés mirarlas un poco de costado, con la visión periférica.\n\nLa adaptación a la oscuridad lleva tiempo y una luz blanca brillante puede reducirla. Sin un punto de enfoque, el ojo también puede enfocar cerca y dejar borroso un objeto lejano.',
        'De día, barré el cielo. De noche, mirá de costado las luces débiles y cuidá la adaptación.',
      ],
      [
        'Volar de noche',
        'De noche hay menos referencias y una luz aislada puede ser un pueblo, un avión o una estrella. El terreno se distingue peor, y la aproximación y la nivelación justo antes del toque requieren referencias visuales claras.\n\nEn Argentina, el vuelo VFR nocturno depende de la instrucción recibida, de las atribuciones de la licencia y de la Parte 61 vigente. Si la licencia tiene una limitación, cumplila.\n\nUS: Para llevar pasajeros de noche, la FAA pide tres despegues y tres aterrizajes completos de noche en los 90 días anteriores, en la misma categoría y clase. También define qué horario cuenta como noche. Son requisitos de Estados Unidos, no de Argentina.',
        'De noche disminuyen las referencias. Verificá que tu licencia y experiencia permitan ese vuelo.',
      ],
    ],
  },
  {
    id: 12,
    slug: 'procedimientos-emergencias',
    title: 'Procedimientos y emergencias',
    eyebrow: 'Entender las listas y conservar opciones ante una falla',
    minutes: 50,
    intro: 'Prepararte antes del vuelo ayuda a reconocer una condición anormal y responder según el avión.',
    legacyAnchors: {
      'leccion-1': 'procedimientos-normales-y-uso-de-listas',
      'leccion-2': 'energia-en-despegue-aproximacion-y-aterrizaje',
      'leccion-3': 'perdidas-barrenas-y-prevencion-de-perdida-de-control',
      'leccion-4': 'perdida-de-potencia-y-aterrizaje-forzoso',
      'leccion-5': 'comunicacion-y-contingencias',
      'leccion-6': 'falla-de-comunicaciones-y-senales-de-la-torre',
      'leccion-7': 'los-codigos-7500-7600-y-7700',
      'leccion-8': 'la-baliza-de-emergencia',
    },
    lessons: [
      [
        'Procedimientos normales y uso de listas',
        'Un procedimiento normal es una secuencia prevista para operar el avión en condiciones habituales. La lista ayuda a recordar sus comprobaciones y reduce omisiones.\n\nCada ítem corresponde a un sistema o condición que conviene verificar. Aprendé qué busca cada punto y usá la lista aprobada para el modelo y la revisión correctos. No copies de memoria la secuencia de otro avión.',
        'La lista sirve cuando entendés qué comprueba cada paso y lo confirmás.',
      ],
      [
        'Energía en despegue, aproximación y aterrizaje',
        'La energía del avión combina velocidad y altura. La cuenta está en Maniobras, «De dónde sale la energía». Potencia, actitud y configuración cambian cómo se administra.\n\nLa velocidad va al cuadrado. Llegar a la pista con un 10 % más de velocidad suma cerca de un 21 % de energía de movimiento, y esa energía hay que disiparla en el suelo con más pista.\n\nEn una aproximación, el exceso de velocidad o altura puede exigir más espacio para estabilizarse. Una aproximación estabilizada cumple criterios observables de velocidad, trayectoria y configuración. Las velocidades y la decisión de motor y al aire se aprenden para el avión y el entrenamiento.',
        'Velocidad y altura son energía. Cerca del suelo queda menos espacio para corregir.',
      ],
      [
        'Pérdidas, barrenas y prevención de pérdida de control',
        'La pérdida ocurre cuando el ala supera el ángulo de ataque crítico y deja de producir sustentación de la forma esperada. Una barrena es una rotación descendente que combina pérdida y giro alrededor de varios ejes.\n\nUna barrena puede desarrollarse cuando un ala entra en pérdida antes que la otra y el avión sigue girando. Reconocer energía y coordinación ayuda a prevenir la pérdida de control. Las maniobras y recuperaciones se practican con instructor y avión autorizados, según el entrenamiento previsto.',
        'La pérdida depende del ángulo de ataque. La barrena agrega una rotación descendente.',
      ],
      [
        'Pérdida de potencia y aterrizaje forzoso',
        'Una pérdida de potencia significa que el motor ya no entrega el empuje esperado. Un aterrizaje forzoso es una toma no planificada fuera de las condiciones normales, por una emergencia.\n\nLa altura, el terreno, el viento y los obstáculos cambian qué zonas pueden alcanzarse. El entrenamiento enseña a conservar control, elegir una opción y preparar la aeronave. Las acciones y listas concretas se estudian para el modelo. Los ejercicios se practican con instructor.',
        'Una falla real exige decisiones con el margen disponible. Aprendé la lista antes de volar.',
      ],
      [
        'Comunicación y contingencias',
        'En una contingencia, la radio permite informar qué ocurre y pedir asistencia. Aviate, navigate, communicate significa «controlá el avión, orientá la trayectoria, comunicá». Es una ayuda para ordenar la atención, no una regla de prioridad para toda situación.\n\nSi la tarea de radio te hace descuidar velocidad, actitud o trayectoria, primero recuperá una condición controlable según tu entrenamiento. Después transmití posición e intención cuando sea posible. Una falla de radio tiene procedimientos propios en la RAAC, la AIP y el manual del equipo. Estudialos antes del vuelo.',
        'La frase ayuda a ordenar la atención. El procedimiento concreto se aprende para la operación local.',
        'priority',
      ],
      [
        'Los códigos 7500, 7600 y 7700',
        'El transpondedor contesta al radar secundario, el que le pregunta al avión y recibe su respuesta, con un código de cuatro cifras. Tres códigos están reservados. Los servicios de tránsito aéreo pueden ver la condición aunque la radio no alcance.\n\nTABLA: Código | Significado\n7700 | emergencia\n7600 | falla de comunicaciones\n7500 | interferencia ilícita, por ejemplo un apoderamiento del avión\n\nEl 7700 y el 7500 están en el procedimiento de uso del transpondedor publicado con el Anexo 17. Si las circunstancias lo piden, en una interferencia se puede usar el 7700 en lugar del 7500.\n\nLa AIP usa el 7600 cuando falla la radio en un vuelo bajo vigilancia, es decir, cuando el control te tiene identificado y te sigue en su pantalla. La altura y la ruta que siguen están en el procedimiento de ese vuelo, no en el código. El 1200 no es un código de emergencia de la Argentina.',
        '7700 es emergencia, 7600 es radio y 7500 es interferencia ilícita.',
      ],
      [
        'Falla de comunicaciones y señales de la torre',
        'Una falla de comunicaciones puede afectar la transmisión, la recepción o ambas. Antes de darla por hecha, revisá lo simple: la frecuencia elegida, el volumen, el auricular, el micrófono y si estás fuera del alcance de la estación.\n\nSi la falla sigue:\n1. Volá el avión: control, altura y rumbo.\n2. Poné 7600 en el transpondedor.\n3. Probá otra frecuencia.\n4. Pedile a otro avión que pase tu mensaje.\n5. Si nadie contesta, transmití a ciegas tu posición y tu intención.\n\nEl transmisor puede andar aunque el receptor no. Las frases en inglés están en Inglés, módulo Falla de radio.\n\nEn un vuelo visual, la regla general de la OACI (Organización de Aviación Civil Internacional) es seguir en VMC (condiciones de vuelo visual), aterrizar en el aeródromo adecuado más cercano y avisar la llegada por el medio más rápido. La AIP puede agregar pasos para cada espacio aéreo. Estudialos en tierra, junto con la altura y la ruta que corresponden a tu vuelo.\n\nCerca del aeródromo, la torre puede guiarte con luces. El gráfico muestra las cinco señales. La misma luz dice una cosa en vuelo y otra en tierra, y una luz fija no significa lo mismo que sus destellos.\n\nAcusás recibo así. En vuelo, de día, balanceá las alas, salvo en los tramos de base y final. En tierra, de día, mové los alerones o el timón de dirección. De noche, en vuelo o en tierra, encendé y apagá dos veces el faro de aterrizaje. Si no tenés, usá las luces de navegación.\n\nUS: En Estados Unidos (14 CFR 91.125) los destellos blancos no tienen significado en vuelo, y se suma una luz roja y verde alternada que pide precaución extrema.',
        'Primero volá el avión y poné 7600. La misma luz de la torre dice una cosa en vuelo y otra en tierra.',
        'light-signals',
      ],
      [
        'La baliza de emergencia',
        'El ELT es el transmisor localizador de emergencia. Si se activa, manda una señal para avisar un accidente y ayudar a encontrar el avión.\n\nLa Sección 91.207 de la Parte 91 lo pide a las aeronaves que operan en el espacio aéreo argentino. Hay excepciones, en los párrafos (b), (g) e (i). El equipo tiene que cumplir el estándar que fija la ANAC. El de 406 MHz se registra, para que la búsqueda tenga un contacto.\n\nNo toda baliza es igual. Hay equipos fijos y otros que se pueden sacar. La activación depende del modelo: algunos se disparan con el impacto y otros también se pueden encender a mano. No alcanza decir que todas son fijas y que solo se activan con el impacto.',
        'El ELT avisa y ayuda a ubicar el avión. La 91.207 lo pide, con excepciones.',
      ],
    ],
  },
];

const sourceIds = {
  aerodinamica: ['phak', 'afh'],
  motopropulsor: ['phak', 'afh'],
  instrumentos: ['phak', 'ifh'],
  regulaciones: ['anacPpa', 'raac', 'raac61', 'raac91', 'raac91Plan', 'raac91Equipment', 'raac91BushStol', 'aip'],
  generalidades: ['phak', 'weightBalance', 'anacPpa'],
  meteorologia: ['phak', 'weather', 'metArgentina', 'raac203'],
  performance: ['phak', 'afh', 'weightBalance'],
  navegacion: ['phak', 'aip', 'horaOficial', 'ifh'],
  'operaciones-aerodromo': ['phak', 'afh', 'aip', 'raac'],
  'decision-y-riesgo': ['phak', 'risk', 'anacPpa'],
  'factores-humanos': ['phak', 'risk', 'anacPpa', 'raac91'],
  'procedimientos-emergencias': ['afh', 'phak', 'anacPpa', 'raac', 'aip', 'elt', 'ssr', 'seraLights'],
};

/**
 * Frontera biblioteca <-> banco de exámenes.
 *
 * Los primeros ocho capítulos coinciden 1:1 con el temario del examen PPA: mismo título, mismo
 * orden, y por eso tienen preguntas publicadas para practicar. Los demás (temas propios y
 * maniobras) son material de la biblioteca y no tienen banco asociado.
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
  chapter.lessons,
));

// Las maniobras traen sus propias fuentes, una lista por página.
const expandedManeuverChapters = maneuverChapters.map(({ sources, ...chapter }) => ({
  ...withExamLink(chapter, chapter.lessons),
  sources: sources.map((id) => librarySources[id]),
}));

export const chapters = [
  ...expandedExamChapters,
  ...newChapters.map((chapter) => withExamLink(chapter, chapter.lessons)),
  ...expandedManeuverChapters,
].sort((a, b) => a.id - b.id);
