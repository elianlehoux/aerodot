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
        'Llegás a un aeródromo que no conocés. Antes de mover el avión tenés que saber qué pista está en uso, por dónde se llega a ella y con quién hablás. Tres fuentes lo responden:\n\nTABLA: Fuente | Qué te da\nAIP (Publicación de Información Aeronáutica) y cartas | el plano del aeródromo: pistas, calles de rodaje, frecuencias y obstáculos\nNOTAM | los cambios temporarios: una calle cerrada, una obra, una ayuda fuera de servicio\nATIS (Servicio Automático de Información Terminal), donde existe | la información del momento: pista en uso, viento y QNH\n\nSi no hay ATIS, la pista en uso te la dan los ATS (servicios de tránsito aéreo) o la sacás de la manga y del tránsito, según el procedimiento del lugar.\n\nCon el plano a la vista, repasá la ruta de rodaje antes de soltar los frenos. Si recibís una instrucción que no entendés, no avances: pedí que la repitan.',
        'Primero ubicá la ruta y entendé la instrucción. Después empezá a rodar.',
      ],
      [
        'Arranque, comprobaciones y briefing previo al despegue',
        'Entre el arranque y el despegue hay tres controles. Cada uno contesta una pregunta distinta:\n\nTABLA: Momento | Qué comprobás\nDespués del arranque | que el motor quedó andando dentro de sus límites: presión de aceite, revoluciones y carga eléctrica\nPrueba de motor, antes de la pista | que entrega potencia y que los dos circuitos de encendido funcionan\nLista antes del despegue | que el avión está configurado: mandos libres, compensador, flaps, combustible e instrumentos\n\nEl briefing es decir en voz alta el plan del despegue antes de entrar a la pista: qué pista y qué viento, hacia dónde salís, qué obstáculos hay y qué hacés si el motor falla. Lo que decidís en tierra no lo tenés que pensar cuando no hay tiempo. Si volás con otra persona, también aclara quién hace qué.\n\nLos ítems y los valores son los de la lista de tu avión.',
        'La lista comprueba el avión. El briefing deja decidido el plan antes de la carrera.',
      ],
      [
        'Radiotelefonía clara y confirmación',
        'Un llamado por radio se arma siempre con las mismas cuatro partes, en este orden:\n\nTABLA: Parte | Ejemplo\nA quién llamás | la torre del aeródromo\nQuién sos | tu matrícula\nDónde estás | en plataforma\nQué querés | rodar para despegar\n\nAntes de hablar, escuchá: si alguien está transmitiendo, lo tapás. Pensá el mensaje antes de apretar el botón y decilo corto.\n\nCuando te dan una autorización o una instrucción, repetí los datos que no admiten error: la pista, el QNH, el nivel, el rumbo y el código de transpondedor. Así quien te la dio comprueba que entendiste lo que dijo.\n\nSi no entendiste, pedí que repitan antes de moverte. Las frecuencias de cada lugar están en la AIP. Las frases en inglés se practican en la sección Inglés.',
        'A quién llamás, quién sos, dónde estás y qué querés. Lo que no entendiste, pedilo de nuevo.',
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
        'Una incursión de pista es que un avión, un vehículo o una persona esté en una pista sin tener que estar ahí. Casi siempre empieza con algo chico: una calle de rodaje confundida, una instrucción entendida a medias o la vista adentro de la cabina en el momento equivocado.\n\nPara evitarla:\n- Rodá con el plano del aeródromo a la vista y seguí la ruta sobre él.\n- Compará lo que ves afuera con el plano: carteles, marcas y números de pista.\n- Si podés, dejá las listas y la radio para cuando el avión está detenido.\n- Antes de entrar a una pista o cruzarla, mirá los dos lados y la final, aunque tengas autorización.\n- Si no sabés dónde estás, frená y decilo por radio.\n\nLa autorización no reemplaza mirar, y mirar no reemplaza la autorización. Hacen falta las dos.',
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
        'La estela turbulenta son los dos remolinos que deja un avión detrás de las puntas de sus alas. Por qué se forman está en Aerodinámica, en la lección de resistencia. Acá importa dónde quedan.\n\nTres datos para ubicarlos:\n- Son más fuertes detrás de un avión pesado, lento y con los flaps retraídos.\n- Empiezan cuando el avión rota en el despegue y terminan cuando toca en el aterrizaje.\n- Bajan despacio por detrás del avión y el viento los corre. Un viento cruzado suave puede dejar uno sobre la pista.\n\nCon eso se arma la defensa. Si despegás detrás de un avión grande, rotá antes del punto donde rotó él y quedate por encima de su trayectoria. Si aterrizás detrás, volá por encima de su senda y tocá más adelante de donde tocó él. Y esperá: el tiempo los disipa.\n\nLa separación que da el control ya contempla la estela. Donde no hay control, la separación la ponés vos.',
        'Los remolinos bajan y el viento los corre. Quedate por encima de la trayectoria del avión de adelante.',
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
        'El vuelo no termina cuando tocás. Después del toque seguís sobre el eje de la pista y frenás hasta velocidad de rodaje.\n\nSalí por una calle de rodaje sin forzar un giro a alta velocidad. Cruzá entera la marca del punto de espera: recién ahí liberaste la pista. Detenete, hacé la lista posterior al aterrizaje y buscá en el plano el camino a la plataforma antes de seguir.\n\nCon control, la torre te dice por dónde salir y con quién seguir. Sin control, avisá que la pista quedó libre según el procedimiento del lugar.',
        'La pista queda libre cuando cruzaste entera la marca del punto de espera.',
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
    legacyAnchors: {
      'leccion-1': 'peligros-riesgos-y-mitigaciones',
      'leccion-2': 'un-ciclo-breve-para-decidir',
      'leccion-3': 'minimos-personales-y-presion-externa',
      'leccion-4': 'escenario-el-pronostico-se-deteriora',
      'leccion-5': 'cinco-formas-de-enganarte',
      'leccion-6': 'peligros-riesgos-y-mitigaciones',
      'leccion-7': 'amenazas-errores-y-el-estado-en-que-queda-el-avion',
      'leccion-8': 'la-automatizacion-no-elige-por-vos',
      'probabilidad-y-gravedad': 'peligros-riesgos-y-mitigaciones',
    },
    lessons: [
      [
        'Peligros, riesgos y mitigaciones',
        'Un viento cruzado de 15 kt (nudos) es un peligro: algo que puede causar daño. El riesgo es otra cosa: cuánto te puede dañar a vos, hoy. Para alguien con mil aterrizajes en ese avión es bajo. Para vos, con veinte horas, puede ser alto.\n\nEl riesgo sale de dos preguntas: qué tan probable es que salga mal y qué tan grave sería. Algo frecuente puede ser leve. Algo raro puede ser gravísimo, como una falla de motor de noche.\n\nUna mitigación es lo que hacés para bajar una de las dos. Elegir una pista más alineada con el viento baja la probabilidad. Llevar más combustible baja la gravedad de una demora. Si después de mitigar el riesgo sigue alto, quedan tres salidas: demorar, cambiar el destino o no salir.\n\nLos peligros se suman. Viento cruzado, cansancio y una pista corta pueden ser manejables de a uno y demasiado los tres juntos.\n\nUS: La tabla de colores viene del Risk Management Handbook de la FAA. Sirve para ordenar ideas. No cambia los requisitos argentinos ni tus límites personales.',
        'Riesgo es probabilidad y gravedad. Si después de mitigar sigue alto, cambiá el plan.',
        'risk-matrix',
      ],
      [
        'Un ciclo breve para decidir',
        'Decidir no es un momento: es una vuelta que se repite. Salís con un pronóstico bueno y a mitad de camino ves una capa de nubes más baja que la prevista.\n1. Observar: la base está más baja que en el pronóstico.\n2. Evaluar: si sigue bajando, no llego con el techo que necesito.\n3. Elegir: sigo veinte minutos más o voy a la alternativa.\n4. Actuar: viro a la alternativa.\n5. Comprobar: ¿mejoró? Si no, otra vuelta.\n\nPara la vuelta de antes de salir sirve PAVE, que reparte los peligros en cuatro grupos:\n\nTABLA: Letra | Qué mirás | Ejemplo\nP, piloto | vos | dormí poco, hace dos meses que no vuelo\nA, aeronave | el avión | combustible, performance, un equipo que no anda\nV, entorno (enVironment) | el tiempo, el terreno y el aeródromo | viento cruzado, pista corta\nE, presiones externas | lo que te empuja a salir igual | pasajeros apurados, un horario\n\nPAVE viene de los manuales de la FAA. Es una ayuda para no olvidarte de un grupo, no una regla argentina.',
        'Decidir no es un paso único: observá, evaluá, elegí, actuá y volvé a comprobar.',
        'decision-loop',
      ],
      [
        'Mínimos personales y presión externa',
        'La norma dice con qué visibilidad se puede volar. No dice con cuánta podés volar vos, hoy, con tu experiencia. Eso lo fijan tus mínimos personales: límites más exigentes que los de la norma, que escribís vos.\n\nUn ejemplo de cómo se ven. No es para copiar:\n\nTABLA: Condición | Límite de la norma o del avión | Mínimo personal de un piloto nuevo\nViento cruzado | el demostrado en el manual | la mitad\nVisibilidad | 5 km en la zona de tránsito | 10 km\nCombustible al llegar | la reserva final | la reserva final más media hora\n\nSe escriben en tierra y con calma, porque en el momento siempre hay una razón para estirarlos: el pasajero que ya llegó, el avión alquilado, el horario. Esa es la presión externa. Un número escrito de antemano te da algo que contestar.\n\nLos mínimos personales solo pueden ser más exigentes. Ninguno te deja pasar una regla ni un límite del avión. A medida que sumás experiencia, los revisás.',
        'Un límite acordado en tierra es más fácil de sostener cuando aparece presión.',
      ],
      [
        'Cinco formas de engañarte',
        'Hay cinco maneras de pensar que llevan a decidir mal. Reconocerlas en tu propia cabeza es la mitad del trabajo. Cada una tiene una respuesta para decirte:\n\nTABLA: Actitud | Lo que pensás | Lo que te contestás\nAntiautoridad | «esa regla no es para mí» | las reglas suelen tener razón\nImpulsividad | «tengo que hacer algo ya» | primero pensá\nInvulnerabilidad | «a mí no me pasa» | me puede pasar\nMacho | «yo puedo con esto» | arriesgar de más es tonto\nResignación | «no hay nada que hacer» | algo puedo hacer\n\nSuelen aparecer cuando ya estás cansado o apurado. Por eso se ensayan en tierra.\n\nUS: La FAA enseña estos cinco nombres como actitudes de riesgo, cada una con su antídoto. No son una lista de infracciones de la RAAC. Sirven para reconocer una forma de pensar.',
        'Reconocé la frase de riesgo y ensayá su antídoto antes de que aparezca en vuelo.',
      ],
      [
        'Amenazas, errores y el estado en que queda el avión',
        'Casi ningún accidente tiene una sola causa. Lo habitual es una cadena de tres eslabones:\n\nTABLA: Eslabón | Qué es | Ejemplo\nAmenaza | algo de afuera que complica el vuelo | te cambian la pista a último momento\nError | algo que hacés mal o dejás de hacer | con el apuro, no repasás la aproximación nueva\nEstado no deseado | el avión queda donde no querías | llegás alto y rápido a la final\n\nLa cadena se corta en cualquier eslabón, y cuanto antes, mejor. Nombrar la amenaza («me cambiaron la pista, me tomo un minuto») evita el error. Reconocer el error evita el estado no deseado. Y del estado no deseado se sale con una maniobra conocida: motor y al aire.\n\nUS: El manual de riesgo de la FAA presenta esta cadena con casos de Estados Unidos. El orden sirve para analizar cualquier vuelo.',
        'Cortá la cadena temprano: reconocé la amenaza antes de que se convierta en un estado no deseado.',
      ],
      [
        'La automatización no elige por vos',
        'El piloto automático sigue las órdenes seleccionadas. No decide si siguen siendo seguras. Un modo es la función activa, como rumbo, navegación, altitud o descenso.\n\nCada vez que cambies un modo, nombralo y comprobá que el avión responda como esperás. Si el equipo no hace lo previsto, recuperá el control con la técnica que corresponda a ese avión. La misma atención vale para la ruta que muestra un GPS.\n\nUS: La FAA destaca las indicaciones de modo en aviones con cabina digital, instrumentos en pantallas, porque muestran qué función está activa. Ese hábito de verificar la automatización sirve en cualquier lugar.',
        'Si no podés decir qué modo está activo, todavía no verificaste qué trayectoria vuela el equipo.',
      ],
      [
        'Escenario: el pronóstico se deteriora',
        'Un caso para juntar todo. Vuelo de 150 NM (millas náuticas) a un aeródromo que no conocés, con un amigo que tiene que estar allá a las seis. El pronóstico de destino da el techo bajando hacia la tarde. Vos dormiste poco.\n\nAntes de salir:\n- PAVE marca tres grupos: piloto cansado, entorno que empeora y presión del horario.\n- Tus mínimos personales dicen con qué techo no seguís.\n- Elegís una alternativa a mitad de camino y le avisás a tu amigo que quizás no llegan.\n\nEn ruta, a la media hora, el viento de frente es más fuerte que el previsto y el techo ya está más bajo:\n1. Observar: vas a llegar veinte minutos tarde y con menos combustible.\n2. Evaluar: el techo en destino va a estar en tu mínimo o por debajo.\n3. Elegir: la alternativa, mientras todavía te sobran combustible y tiempo.\n\nLa decisión difícil se tomó en tierra, cuando definiste el número. En el aire solo la cumplís. No hay un umbral único para todos los vuelos: hay uno para cada piloto, escrito antes.',
        'Un buen plan dice qué condición te haría dejar de continuar.',
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
        'El avión pasa una inspección antes de cada vuelo. Vos también. IMSAFE es la lista para hacerla, una pregunta por letra: Illness (enfermedad), Medication (medicación), Stress (estrés), Alcohol (alcohol), Fatigue (fatiga) y Emotion (emoción).\n\nNo hace falta estar enfermo de verdad para que cuente. Un resfrío que te tapa los oídos alcanza: al cambiar de altura no vas a poder igualar la presión, y duele. Un antialérgico de venta libre puede dar sueño. Una discusión antes de salir ocupa atención que necesitás para volar.\n\nLos efectos se suman. Poco sueño y un día de estrés pesan más juntos que cada uno por separado.\n\nIMSAFE no es un certificado médico ni reemplaza las reglas. Si alguna respuesta te deja dudas, la decisión se toma en tierra.',
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
        'La hipoxia es falta de oxígeno en los tejidos. Lo traicionero es que afecta primero el juicio: podés sentirte bien, hasta eufórico, mientras ya estás decidiendo mal. Otros síntomas son dolor de cabeza, mareo, hormigueo, visión que se angosta y labios o uñas azulados.\n\nHay cuatro tipos, según dónde se corta el camino del oxígeno:\n\nTABLA: Tipo | Qué falla | Ejemplo\nHipóxica | llega poco oxígeno a los pulmones | la altura\nHipémica | la sangre no lo puede transportar | monóxido de carbono, anemia\nDe estancamiento | la sangre no circula bien | mucha carga g\nHistotóxica | las células no lo pueden usar | alcohol, algunas drogas\n\nEl monóxido de carbono merece atención aparte. Es un gas sin olor que sale con los gases de escape, y en muchos aviones livianos la calefacción de cabina toma el calor del escape. Si hay una fisura, el gas entra a la cabina. Da dolor de cabeza, somnolencia y mareo. Si lo sospechás, cerrá la calefacción, abrí la ventilación y aterrizá cuanto antes, con la lista del avión.\n\nEl tiempo de conciencia útil es el rato en que todavía podés hacer tareas. El material de instrucción de la FAA (Administración Federal de Aviación de Estados Unidos) lo estima en 20 a 30 minutos a 18 000 ft (pies) y en pocos minutos a 25 000 ft. Son referencias, no un límite seguro.',
        'La hipoxia puede nublar el juicio antes de que el piloto reconozca sus propios síntomas.',
        'hypoxia-types',
      ],
      [
        'Oxígeno que pide la regla',
        'La Sección 91.211 se basa en la presión de la cabina. En un avión sin presurizar, esa presión es la de la altura a la que volás. En atmósfera estándar, 700 hPa equivalen a unos 10.000 ft (pies) y 620 hPa a unos 13.000 ft.\n\nNo se inicia un vuelo que vaya a quedar bajo 700 hPa si no se lleva oxígeno suficiente.\n\nTABLA: Presión de cabina | Quién lleva oxígeno | Cuánto\nEntre 700 y 620 hPa | toda la tripulación y, como mínimo, el 10 % de los pasajeros | el tramo que supere los 30 minutos\nBajo 620 hPa | toda la tripulación y todos los pasajeros | todo ese tramo. La tripulación que lo necesita lo usa de forma continua\n\nEl cuestionario a veces resume solo los 30 minutos entre 10.000 y 13.000 ft.',
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
        'Con buena visibilidad, los ojos te dicen dónde está el horizonte. Sin él, en una nube o en una noche cerrada, el cuerpo intenta reemplazarlos con el oído interno y con lo que siente en el asiento. Los dos se equivocan.\n\nEl oído interno detecta cambios, no estados. Si entrás muy despacio en un viraje, no lo registra. Si el viraje dura, se acostumbra y deja de avisar.\n\nTABLA: Ilusión | Qué sentís | Qué pasa de verdad\nInclinación falsa | que estás inclinado, justo después de nivelar | venías inclinado sin notarlo, y al nivelar el oído avisa al revés\nEspiral | que volás nivelado | seguís en un viraje que desciende. Si tirás del mando, lo cerrás más\nDe aceleración | que la nariz sube, al acelerar | la nariz no se movió. Si empujás, bajás\nAgujero negro | que estás alto, de noche y sobre terreno sin luces | venís bajo en la aproximación\n\nLa regla es una sola: cuando lo que sentís y lo que marcan los instrumentos no coinciden, valen los instrumentos.\n\nVolar sin referencias visuales pide entrenamiento y habilitación. Si un piloto visual entra en una nube sin querer, la salida habitual es un viraje suave de 180° con el horizonte artificial, para volver por donde vino. Se practica con instructor.',
        'Sin horizonte, el cuerpo engaña. Si no coincide con los instrumentos, valen los instrumentos.',
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
        'Una lista de verificación no te enseña a volar el avión: comprueba que no te olvidaste de nada. Hay dos formas de usarla.\n\nTABLA: Forma | Cómo es | Cuándo se usa\nLeer y hacer | leés un ítem y lo hacés | en tierra y sin apuro: prevuelo, arranque, prueba de motor\nHacer y verificar | hacés los pasos de memoria y después leés la lista para confirmar | en vuelo, cuando no podés sacar la vista de afuera mucho tiempo\n\nEn una emergencia hay pasos que no esperan a que encuentres la página. Se aprenden de memoria y después se confirman con la lista. Cuáles son lo dice el manual de tu avión.\n\nLa lista vale si es la de tu avión, en su modelo y su revisión. Y si entendés qué comprueba cada ítem, notás cuando algo no da lo que debería.',
        'La lista no reemplaza saber. Confirma que no te olvidaste de nada.',
      ],
      [
        'Energía en despegue, aproximación y aterrizaje',
        'El avión tiene dos reservas de energía: la velocidad y la altura. Podés cambiar una por otra, y el motor agrega. La cuenta está en Maniobras, en «Energía: velocidad, altura y potencia».\n\nCerca del suelo las dos reservas son chicas. Por eso el despegue y la aproximación son los momentos con menos margen. Bajo y lento, no tenés con qué corregir. Alto y rápido, sobra energía y hay que gastarla en pista.\n\nLa velocidad pesa más de lo que parece, porque va al cuadrado. Llegar con un 10 % más de velocidad suma cerca de un 21 % de energía de movimiento, y se paga en metros de pista.\n\nPor eso se busca una aproximación estabilizada: velocidad, senda y configuración ya puestas, sin cambios grandes. Si a la altura que definiste con tu instructor no lo está, hacés motor y al aire.',
        'Velocidad y altura son energía. Cerca del suelo queda menos espacio para corregir.',
      ],
      [
        'Pérdidas, barrenas y prevención de pérdida de control',
        'El caso típico de pérdida de control es un viraje lento y cerrado cerca del suelo, como el de básica a final cuando te pasaste del eje de la pista.\n\nLa pérdida es superar el ángulo de ataque crítico: está en Aerodinámica. La barrena necesita dos cosas a la vez, pérdida y guiñada. Si el avión entra en pérdida descoordinado, un ala pierde más que la otra, cae, y el avión baja girando.\n\nTABLA: Rasgo | Pérdida | Barrena\nQué pasa | el ala deja de sostener | un ala pierde más que la otra y el avión baja girando\nQué hace falta | pasar el ángulo crítico | pérdida y guiñada juntas\nCómo se evita | no pasar el ángulo crítico | volar coordinado, con la bola al centro\n\nLa prevención es la misma para las dos: no tirar del mando para salvar un viraje y mantener la bola al centro. Si el viraje a final no sale, motor y al aire.\n\nLa salida de la pérdida está en Maniobras. La de la barrena depende del avión y está en su manual: se aprende con instructor, en un avión aprobado para eso.',
        'La pérdida depende del ángulo de ataque. La barrena necesita, además, guiñada.',
      ],
      [
        'Pérdida de potencia y aterrizaje forzoso',
        'Se para el motor en crucero. El avión no se cae: pasa a planear, y tenés minutos, no segundos. Hay un orden que ayuda:\n1. Volá el avión: poné la velocidad de mejor planeo del manual y compensá.\n2. Elegí un campo que alcances, mejor con el viento de frente, y andá hacia él.\n3. Si queda altura, buscá la causa con la lista: combustible, mezcla, calefacción de carburador, encendido.\n4. Avisá: 7700 en el transpondedor y un llamado de emergencia.\n5. Prepará el aterrizaje con la lista.\n\nEs el orden general que enseña el Airplane Flying Handbook. Los pasos exactos son los de la lista de emergencia de tu avión.\n\nCon poca altura no hay tiempo para todo: los pasos 1 y 2 son los que no se saltean. Si el motor falla justo después de despegar, bajá la nariz y aterrizá adelante, con virajes chicos. Lo desarrolla Maniobras, en la página del despegue.',
        'Sin motor: primero la velocidad de planeo, después el campo y después la lista.',
      ],
      [
        'Comunicación y contingencias',
        'Cuando algo sale mal, la atención no alcanza para todo. Tres palabras la ordenan: aviate, navigate, communicate. Volá el avión, llevalo hacia donde querés ir y recién después hablá.\n\nEl orden tiene una razón. Si dejás de volar para hablar por radio, cambiaste un problema por uno peor. La radio puede esperar unos segundos. La actitud y la velocidad, no.\n\nCon el avión controlado, pedí ayuda sin vueltas. Hay dos niveles:\n\nTABLA: Llamado | Cuándo\nMAYDAY, tres veces | peligro grave e inminente: necesitás ayuda ya\nPAN PAN, tres veces | urgencia: hay un problema, sin peligro inmediato\n\nDespués decí quién sos, qué pasa, qué vas a hacer y dónde estás. Los códigos del transpondedor y la falla de radio están en las dos lecciones que siguen.',
        'Primero volá el avión, después llevalo adonde querés ir y recién entonces hablá.',
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
