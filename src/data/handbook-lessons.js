/** Lecciones que acercan la biblioteca a los handbooks de la FAA.
 *  Un párrafo que empieza con "US: " se muestra como variante de Estados Unidos. */
export const handbookLessons = {
  regulaciones: [
    [
      'Las letras del espacio aéreo',
      'El espacio aéreo es un modo de decir, en un volumen del cielo, quién puede darte servicio y qué reglas de comunicación y de meteorología se aplican. La letra o el nombre cambian de país. Lo que no cambia es el hábito: antes de salir, mirá en la carta vigente qué hay sobre tu ruta y qué tenés que hacer para entrar.\n\nEn Argentina esas clases, sus límites y sus horarios están en la AIP y en las cartas actuales. Una edición vieja de un manual, aunque traiga un mapa prolijo, no alcanza para salir.\n\nUS: En el material de la FAA las clases van de la A a la G. En los estados contiguos, la A suele ser el cielo alto, desde 18.000 ft, y solo para vuelo instrumental. La B envuelve los aeropuertos más ocupados y pide autorización. La C y la D rodean torres de control, con requisitos de comunicación. La E es espacio controlado que no entra en las anteriores. La G es espacio no controlado. Es el mapa de ese país. La misma letra, en otra carta, no dibuja el mismo volumen ni pide lo mismo.',
      'La letra se consulta en la carta del lugar. No se traslada de memoria de un país a otro.',
    ],
    [
      'Dos escalas de licencias',
      'Una licencia es un permiso que crece: primero aprendés con un instructor, después rendís, y cada escalón agrega privilegios y también límites. En Argentina ese recorrido está en El camino del piloto y en la Parte 61 vigente. Las horas, las edades y los exámenes se leen ahí, no en un resumen de otro país.\n\nUS: El capítulo 1 del Pilot’s Handbook cuenta otra escalera: estudiante, privado, comercial y transporte de línea aérea, con sus propias edades, horas y exámenes. También describe el programa WINGS, un esquema voluntario de práctica que la FAA usa para mantenerse entrenado. Ninguna de esas cifras reemplaza la Parte 61. Si leés ese capítulo, estás leyendo el sistema de Estados Unidos.',
      'El concepto es el mismo: privilegios que se ganan y límites que se respetan. Los números son los de la norma del país donde volás.',
    ],
  ],
  motopropulsor: [
    [
      'Hielo en el carburador',
      'En un motor con carburador, el aire se apura al pasar por un estrechamiento. Ahí bajan la presión y la temperatura, y la nafta, al evaporarse, enfría todavía más. Con humedad, ese frío puede formar hielo aunque afuera haya varios grados sobre cero. En una hélice de paso fijo el aviso típico es una caída suave de revoluciones, no un golpe seco.\n\nLa respuesta publicada —si el avión tiene calefacción de carburador, cuándo se prueba y cómo se aplica— está en el manual de ese motor y se practica con instructor. Un motor de inyección no sigue esta historia: confirmá qué sistema tiene el avión antes de buscar una perilla que no existe.\n\nUS: Los manuales de la FAA traen una carta de probabilidad según la temperatura exterior y la humedad. Sirve para entender en qué días el riesgo es más alto. No es un interruptor universal ni una temperatura para memorizar y aplicar en cualquier avión.',
      'El hielo de carburador es un enfriamiento dentro del motor. Puede aparecer con el aire exterior todavía sobre 0 °C.',
      'carb-ice',
    ],
  ],
  generalidades: [
    [
      'Si movés una carga, el centro se corre',
      'El centro de gravedad es el punto de equilibrio de todo lo que va a bordo. Si movés peso hacia atrás, ese punto se va hacia atrás. Si lo movés hacia adelante, el punto lo sigue. La cuenta de estudio es directa: la distancia que se corre el centro es el peso que moviste, dividido por el peso total, multiplicado por la distancia que lo moviste.\n\nUn ejemplo inventado, solo para ver el tamaño del efecto. Con 1000 kg a bordo, movés 20 kg un metro hacia atrás. El centro se corre 2 cm hacia atrás. Parece poco, y en un avión chico unos centímetros pueden acercarte al límite. Los brazos y la envolvente reales son los de la hoja de carga de esa matrícula.\n\nEl lastre es peso que se agrega a propósito, en un lugar previsto, para devolver el centro adentro de la envolvente. Tiene que estar sujeto y tiene que entrar en la cuenta. No es una caja suelta “para que pese”.\n\nUS: El handbook de peso y balanceo de la FAA también explica cómo se pesa el avión en balanza para obtener el peso vacío. Eso es trabajo de mantenimiento y queda en los registros. Quien vuela usa ese peso vacío ya asentado y calcula la carga del día.',
      'Mové la carga en la cuenta antes de moverla en el avión. El ejemplo de los 2 cm no es el número de tu aeronave.',
    ],
  ],
  meteorologia: [
    [
      'Si el aire sube solo o vuelve a bajar',
      'Soltá, en la imaginación, un globo de aire. Al subir se expande y se enfría. Si queda más frío que el aire de al lado, pesa más y vuelve a bajar: la atmósfera está estable. Si queda más caliente que el entorno, sigue subiendo: está inestable.\n\nUn día estable suele armar capas, estratos y un vuelo más quieto, aunque también puede traer niebla o techos bajos. Un día inestable arma cúmulos, turbulencia y, si hay humedad de sobra, tormentas. La diferencia la marca cómo baja la temperatura con la altura ese día, no el dibujo de la atmósfera estándar.\n\nUS: El Aviation Weather Handbook separa esta idea en varios capítulos, con nombres de gradiente y de parcela. Los nombres ayudan a leer el libro. El pronóstico del día, en Argentina, sale de los productos del SMN, no de una atmósfera tipo dibujada en el manual.',
      'Estable: el aire desplazado vuelve. Inestable: sigue subiendo. El tipo de nube te da una pista, el pronóstico te dice si conviene salir.',
      'stability',
    ],
    [
      'Niebla y lo que tapa la vista',
      'La niebla es una nube apoyada en el suelo. Aparece cuando el aire se enfría hasta su punto de rocío, o cuando se le agrega humedad. Una noche clara y calma deja escapar el calor del terreno y puede formar niebla de radiación. Si llega aire húmedo sobre una superficie más fría, la niebla viaja con ese aire: es de advección, y no se queda quieta esperando al sol. La lluvia también puede humedecer el aire de abajo y cerrar la visibilidad.\n\nBruma, humo, precipitación y polvo hacen el mismo trabajo práctico: te sacan referencias. El número que importa es el de la observación vigente, y si ese número te deja cumplir las reglas del vuelo que pensabas hacer.\n\nUS: La FAA clasifica además niebla de ladera, de vapor y de hielo. Son mecanismos distintos con nombres de manual. Ponerle el nombre desde la ventana no cambia la decisión: si no ves lo que el vuelo necesita, el vuelo espera.',
      'Niebla es visibilidad en el suelo. El parte dice cuánta hay. El nombre del mecanismo explica por qué se formó, no autoriza a entrar.',
    ],
    [
      'Hielo sobre el avión',
      'Cuando el avión atraviesa gotas líquidas y la temperatura está cerca de la congelación, esas gotas pueden congelarse en el ala, la hélice, las tomas y las antenas. El hielo opaco y rugoso suele ser escarcha de impacto: la gota se congela donde chocó. El hielo claro es más traicionero: la gota escurre antes de congelarse y puede verse poco. Los dos cambian la forma del ala, agregan peso y pueden tapar una toma de aire.\n\nLa mayoría de los aviones de instrucción no están aprobados para volar en engelamiento conocido. La aprobación, si existe, y el equipo para enfrentarlo están en el manual de esa aeronave. La decisión de estudio es simple: si el parte muestra humedad visible y temperatura de congelación en tu nivel, se cambia la ruta, la altura o el día. No se “prueba un poco”.\n\nEl hielo dentro del carburador es otro fenómeno y tiene su propia lección, en el grupo motopropulsor.',
      'El hielo en el ala cambia la forma que la hace volar. Si el avión no está aprobado para eso, el plan es no entrar.',
    ],
    [
      'El tiempo en la montaña',
      'Una sierra obliga al aire a subir. Del lado de donde viene el viento hay nubosidad y ascensos. Del otro lado, el aire baja, se calienta y puede armar ondas, como el agua detrás de una piedra. Debajo de la cresta de esa onda, en la ladera protegida, aparece un rotor: una zona de turbulencia que un avión chico no tiene por qué ir a conocer. El descenso en esa ladera puede ser más fuerte que el ascenso que el avión puede sostener.\n\nLos valles encajonan el viento y lo aceleran. La altura de densidad sube con la elevación del terreno y con el calor, así que la pista que “en el llano alcanzaba” puede quedarse corta. El tiempo cambia de un valle al siguiente.\n\nUS: Los capítulos de montaña de la FAA están escritos con los pasos, las altitudes mínimas y los ejemplos de Estados Unidos. La física de la onda y del rotor es la misma. La ruta, la altura y la salida de escape salen de las cartas argentinas y de quien instruye en esa zona.',
      'Del lado protegido de una sierra puede haber descensos y turbulencia que el avión no puede ganarle. Se planifica el rodeo antes de estar ahí.',
    ],
  ],
  navegacion: [
    [
      'El VOR en una sola imagen',
      'Una estación VOR irradia radiales, como los rayos de una rueda. Cada radial es una línea magnética que sale de la estación: el radial 090 es la línea que se va hacia el este magnético desde la antena. El instrumento no te dice “doblá para acá” por sí solo. Te dice de qué lado estás de la línea que vos seleccionaste, y si te estás alejando o acercando.\n\nPor eso el primer paso es elegir el radial y saber si vas hacia la estación o te vas. Recién después tiene sentido la aguja. Cruzar de un radial a otro, y los tiempos para interceptar, se practican con instructor. Esta lección alcanza para leer la figura sin memorizar una receta.\n\nUS: En el examen de la FAA suelen pedir identificar un radial sobre un dibujo. El principio de la estación es el mismo en cualquier país. Qué VOR hay en tu ruta, su frecuencia y si está en servicio se leen en la AIP y en la carta vigente.',
      'El radial es una línea que sale de la estación. La aguja dice de qué lado de esa línea estás, no qué tenés que hacer sin mirar el rumbo.',
    ],
    [
      'El radiocompás y la estación que señala',
      'El radiocompás, o ADF, apunta hacia una estación de baja frecuencia, el NDB. La aguja muestra dónde está la estación respecto de la nariz del avión. Si la aguja va a la derecha, la estación está a la derecha. Para saber el rumbo hacia ella tenés que sumar esa indicación al rumbo que llevás.\n\nSi solo “perseguís la aguja” con viento, el camino sobre el suelo se curva. Seguir una línea recta hacia la estación pide corregir el viento, no mirar únicamente la punta de la aguja. Muchas de estas estaciones se fueron apagando: que una figura de un libro la dibuje no significa que siga transmitiendo.\n\nUS: Las figuras de ADF siguen apareciendo en el material de la FAA. La aguja se lee igual. Antes de usarla en una ruta argentina, confirmá en la publicación vigente que esa estación existe y está en servicio.',
      'La aguja apunta a la estación. El rumbo del avión más esa punta te dicen desde dónde la estás mirando.',
    ],
    [
      'Cuando el GPS muestra un lugar y no conviene creerle',
      'Un receptor puede dibujar un avión sobre el mapa aun cuando la posición esté degradada. La integridad es el aviso de que el error podría ser demasiado grande para usar esa posición. En muchos equipos aeronáuticos ese control se llama RAIM: si no puede garantizar la precisión, te lo dice. Si no te lo dice, igual comparás la pantalla con el terreno y con la carta.\n\nSi aparece el aviso, o si el mapa no coincide con lo que ves, volvés a navegar por referencias y por la carta. La base de datos del equipo también envejece: un obstáculo nuevo no entra solo porque el símbolo se vea nítido.\n\nUS: RAIM y WAAS son los nombres con los que la FAA describe cómo se vigila o se mejora el GPS en Estados Unidos. Que el equipo tenga esas siglas no dice qué uso aprueba la norma argentina ni el manual de ese receptor. El aviso de integridad, donde aparezca, significa lo mismo: dejá de tratar la pantalla como una posición confirmada.',
      'Una posición en pantalla es usable cuando el equipo no está avisando un problema y coincide con la carta y con el terreno.',
    ],
  ],
  'operaciones-aerodromo': [
    [
      'Marcas y carteles: frenar antes de la pista',
      'Las marcas y los carteles son el mapa que leés a velocidad de rodaje. La marca de punto de espera es la línea donde te detenés antes de una pista. No se cruza hasta tener la autorización que ese aeródromo exige, o hasta que la regla local —en un lugar sin servicio de control— diga que podés seguir después de mirar.\n\nUn umbral desplazado corre el comienzo del aterrizaje más adentro de la pista. El pavimento anterior puede servir para rodar o para despegar, según lo que diga la publicación de esa pista, y no es la zona de toma. Una superficie cerrada se pinta para que no la uses. Si la marca y la autorización no coinciden, te detenés en un lugar seguro y preguntás.\n\nUS: En los aeropuertos de la FAA los carteles que prohíben son rojos con letras blancas, y las marcas de punto de espera son amarillas. También existe LAHSO: una autorización para aterrizar y frenar antes de una pista que cruza. Es un procedimiento de ese sistema. No se improvisa en otro país ni se acepta si no estás habilitado y la pista alcanza. Las distancias que algunos carteles muestran en miles de pies también son de ese estándar. En Argentina, el dibujo de cada aeródromo se confirma en la AIP.',
      'La línea de espera significa “hasta acá, salvo que te hayan autorizado a seguir”. El dibujo exacto es el de la publicación de ese aeródromo.',
    ],
    [
      'Luces, senda y manga',
      'De noche, las luces de borde dibujan la pista. Las de calle de rodaje se distinguen por color para que no confundas una calle con la pista: el código de colores se estudia con la carta y con el instructor, en el aeródromo real.\n\nEl PAPI y el VASI te dicen si vas alto o bajo respecto de una senda visual. En el PAPI de cuatro luces en fila, lo habitual es ver dos blancas y dos rojas cuando estás en la senda. Más blanco significa alto. Más rojo significa bajo. El VASI de dos barras se recuerda con la misma idea: rojo sobre blanco, vas en la senda. El ángulo de esa senda no es el mismo en todas las pistas. Está publicado.\n\nLa manga apunta hacia donde se va el viento. El viento viene desde el lado abierto de la manga. Sirve en el circuito y también cuando no hay otra referencia.\n\nUS: La frase en inglés “red over white, you’re all right” es la muletilla del VASI en los manuales de la FAA. El ángulo de 3° que suelen citar es el de muchas instalaciones, no una ley de todas las pistas. El ángulo y de qué lado están las luces se leen en la ficha del aeródromo.',
      'Dos y dos, en el PAPI habitual, es “en la senda”. Más blanco es alto y más rojo es bajo. El ángulo de esa pista está publicado.',
      'papi',
    ],
  ],
  'maniobras-basicas': [
    [
      'De dónde sale la energía',
      'El avión tiene energía en dos formas que podés ver: la velocidad y la altura. El motor agrega energía. La resistencia la gasta. Si llegás a la pista alto y rápido, te sobra energía y el avión flota. Si llegás bajo y lento, te falta, y el terreno se adelanta.\n\nEn el corto plazo, la actitud apunta la energía que ya tenés y la potencia cambia cuánta tenés. Las dos se mezclan: subir la nariz sin agregar potencia cambia velocidad y trayectoria a la vez. Por eso no alcanza con mover una sola cosa y mirar para otro lado. Mirá qué pasó y corregí lo que todavía sobra o falta.\n\nEsta idea ordena el despegue, el circuito y el aterrizaje. Las velocidades y el punto en el que se decide frustrar siguen siendo los del avión y los de la instrucción.',
      'Alto y rápido es energía de más. Bajo y lento es energía de menos. Las dos se notan antes de llegar al pavimento.',
    ],
    [
      'Maniobras con una referencia en el suelo',
      'Estas figuras se vuelan para ver el viento con los ojos, no para ir a ningún lado. Elegís una línea en el terreno —un camino, un campo rectangular— y hacés que el recorrido sobre el suelo sea prolijo. El viento empuja el avión. Para que la línea salga derecha, la inclinación y el rumbo tienen que cambiar según el tramo.\n\nEn el curso rectangular, el tramo con viento de cola pide más inclinación en el viraje, porque el avión avanza más rápido sobre el suelo. El tramo con viento de frente pide menos. En los ochos sobre un camino, los dos semicírculos deberían verse parejos: más banco del lado en que el viento te apura, menos del lado en que te frena. En el viraje alrededor de un punto, el radio se mantiene y el banco sube y baja con el viento.\n\nLa altura, la zona y los límites del ejercicio los define el instructor. No son maniobras para improvisar bajo, sobre una población o sin haberlas volado acompañado.\n\nUS: El Airplane Flying Handbook dibuja estas tres figuras con un viento marcado. El dibujo enseña la corrección. No trae una inclinación ni una altura para copiar a otro avión o a otro país.',
      'El viento cambia el banco que necesitás para que la figura, vista desde el suelo, salga pareja.',
      'ground-reference',
    ],
    [
      'Aterrizar con viento, en pista corta o en pista blanda',
      'El aterrizaje normal busca un punto de toma y una desaceleración tranquila. Cuando cambia la pista, cambia el objetivo, no solo “se hace más despacio”.\n\nCon viento cruzado el avión quiere alinear la nariz con el viento. Durante la toma, el eje del avión tiene que quedar alineado con el eje de la pista. La técnica —ala baja hacia el viento, nariz cruzada, o una combinación— es la que te enseñaron en ese modelo. No hay una presión de pedal para todos.\n\nEn pista corta el objetivo es tocar en la zona prevista y frenar en el pavimento que queda. En pista blanda el objetivo es no clavar la rueda de nariz en una superficie que se hunde. Velocidades, flaps y uso de frenos son los del manual de ese avión. Si la cuenta de performance no cierra con margen, la variante correcta es no intentar la pista.',
      'Primero nombrá qué le estás pidiendo a la toma: alineación, poco pavimento o una superficie blanda. Después aplicá la técnica de ese avión.',
    ],
    [
      'El resbale',
      'En un resbale los mandos van cruzados: alerón hacia un lado y timón hacia el otro. El avión vuela un poco de costado. Eso aumenta la resistencia y permite perder altura sin ganar tanta velocidad, o alinear el eje con la pista mientras el viento empuja de costado.\n\nHay una diferencia útil. En el resbale hacia adelante, la nariz apunta hacia un lado de la pista y el eje de vuelo sigue hacia la pista: se usa para perder altura. En el de costado, el eje del avión va alineado con la pista y el viento viene de un lado: es la toma con viento cruzado. Los dos se sienten distintos en el asiento.\n\nNo todos los aviones permiten resbalar con flaps extendidos. Si hay una placa que lo prohíbe, esa placa gana. La altura a la que se inicia se practica con instructor.',
      'Mandos cruzados, a propósito, para perder altura o para alinear la toma. La placa del avión dice si se puede con flaps.',
    ],
  ],
  'decision-y-riesgo': [
    [
      'Cinco formas de engañarte',
      'Antes de una mala decisión suele haber una frase corta. “Las reglas no son para este vuelo.” “Hay que hacer algo ya.” “A mí no me pasa.” “Puedo con esto.” “No hay nada que hacer.” Cada una cierra una salida que todavía existía.\n\nLa respuesta también es corta, y se ensaya en tierra. La regla está por algo. No tan rápido. Me puede pasar. Demostrarlo no suma. Todavía puedo elegir otra cosa: demorar, desviar, pedir ayuda o cancelar.\n\nUS: Esos cinco nombres —antiautoridad, impulsividad, invulnerabilidad, macho y resignación— son la lista de estudio de la FAA. No son infracciones escritas en la RAAC. Sirven como espejo. El antidoto se practica igual en cualquier cabina.',
      'Si aparece la frase corta, frená la decisión un momento y decí la respuesta corta. El manual del avión y la norma siguen en pie.',
    ],
    [
      'Probabilidad y gravedad',
      'Un riesgo tiene dos preguntas, no una. ¿Qué tan seguido puede pasar? ¿Qué tan malo es si pasa? Una molestia que ocurre siempre puede ser menos importante que algo raro cuyo resultado es perder el avión. Las dos dimensiones juntas arman la decisión.\n\nAntes del vuelo podés marcar qué combinaciones no aceptás. Viento cruzado de más para tu experiencia, techo bajo y una sola alternativa, cansancio más una hora límite. Si el día cae en una casilla que ya habías pintado de “no”, el plan cambia en tierra.\n\nUS: El Risk Management Handbook de la FAA muestra esta idea como una tabla de colores. Los colores son una ayuda de ese libro. Tu límite lo elegís vos, más conservador que la norma. La norma no se afloja porque la casilla haya salido verde en un ejemplo extranjero.',
      'Preguntá las dos cosas: ¿qué tan probable y qué tan grave? La casilla que no aceptás se decide antes de subir.',
      'risk-matrix',
    ],
    [
      'Amenazas, errores y el estado en que queda el avión',
      'Una amenaza empuja el plan desde afuera: el pronóstico que empeora, un tránsito que no esperabas, un pasajero que apura. Un error es algo que hacés vos: una frecuencia mal puesta, un ítem salteado, un rumbo que no corregiste. El estado no deseado es el avión ya rápido, bajo, descoordinado o fuera de rumbo.\n\nConviene cortar la cadena cuando todavía es una amenaza. Ahí hay tiempo. Cuando ya es un estado del avión, la atención se va al control y el margen se achicó. Nombrar en voz alta “esto es una amenaza” ayuda a no tratarla como parte normal del vuelo.\n\nUS: El manual de riesgo de la FAA ilustra esta cadena con accidentes de Estados Unidos. Los relatos son de allá. El orden —amenaza, error, estado del avión— se reconoce en cualquier cabina.',
      'Cortá la cadena en la amenaza. Si el avión ya está en un estado que no querías, primero controlalo.',
    ],
    [
      'La automatización no elige por vos',
      'Un piloto automático vuela la trayectoria que le mandaste. No decide si esa trayectoria sigue siendo segura. Un mapa que se mueve tampoco. Si no podés decir, en una frase, qué modo está activo —rumbo, navegación, altitud, descenso— entonces el equipo está llevando el avión y vos estás mirando.\n\nEl hábito es nombrar el modo cuando lo cambiás y mirar que el avión haga eso y no otra cosa. Si no coincide, se vuelve al vuelo manual con la técnica que corresponde a ese equipo. En un avión sin piloto automático la misma idea vale para el GPS: si la línea magenta dobla y no sabés por qué, no la sigas hasta entenderla.\n\nUS: La FAA insiste con los anunciadores de modo en los aviones con cabina de vidrio, porque varios accidentes de ese país empezaron con un modo que nadie había nombrado. El hábito de decir en voz alta qué está haciendo el equipo no depende del país.',
      'Si no podés decir qué modo está volando, no estás al mando de esa trayectoria.',
    ],
  ],
  'factores-humanos': [
    [
      'Respirar de más',
      'La hiperventilación es respirar más de lo que el cuerpo necesita, en general por estrés, susto o dolor. Se va el dióxido de carbono, y aparecen hormigueo, mareo y la sensación de que no entra el aire. Se parece a la hipoxia, y no es lo mismo. La hipoxia es falta de oxígeno. Esta es demasiado intercambio de aire.\n\nEn tierra, la idea de estudio es bajar el ritmo de la respiración. En vuelo, si hay altura de por medio, no apuestes a un diagnóstico de libro: tratá la situación como un problema de oxígeno si el procedimiento del avión lo prevé, avisá y usá la salida que ya tenías planeada. No improvises una bolsa ni una maniobra que no practicaste.\n\nUS: Los textos de la FAA describen la hiperventilación junto con los factores aeromédicos y proponen controlar el ritmo respiratorio. Es una herramienta de entrenamiento. No reemplaza el procedimiento de oxígeno ni de descenso del avión en el que estás.',
      'Falta de aire por respirar de más no es lo mismo que falta de oxígeno. Si estás alto, no te quedes eligiendo el nombre.',
    ],
    [
      'Cómo mira el ojo',
      'De día, un vistazo único al parabrisas no alcanza. El tránsito aparece en sectores: se recorre el cielo, se mira hacia afuera un segundo y se vuelve a los instrumentos. De noche el centro de la retina ve peor. Se detecta mejor una luz débil si la mirás un poco de costado, y se pierde si la clavás.\n\nLa adaptación a la oscuridad tarda. Una pantalla brillante o una luz blanca de cabina la rompen. El cielo vacío también engaña: sin nada a lo que enfocar, el ojo se acomoda cerca y un avión lejano se diluye. Darle al ojo un horizonte, una luz o el instrumento lo mantiene trabajando a la distancia que importa.\n\nUS: El capítulo de vuelo nocturno del Airplane Flying Handbook detalla esta visión descentrada y el tiempo de adaptación con ejemplos de aeropuertos de Estados Unidos. El ojo funciona igual. Las luces de cada pista se confirman en la publicación local.',
      'De día, barré el sector. De noche, no claves la mirada en una luz débil y cuidá la adaptación con las luces de cabina.',
    ],
    [
      'Alcohol, medicamentos y la noche anterior',
      'El alcohol y muchos medicamentos hacen más lenta una decisión que todavía se siente normal. “Me siento bien” es un mal instrumento: la misma sustancia que te afecta también te convence de que no te afecta. El descanso entra en la misma cuenta. Dormir poco se parece, en los errores, a haber tomado.\n\nLa espera mínima y los medicamentos compatibles con volar salen de la norma vigente y de quien te hace el certificado médico. Tu mínimo personal puede ser más largo. No puede ser más corto que la norma.\n\nUS: La regla de la FAA, para actuar como tripulante, pide al menos 8 horas desde la última bebida alcohólica y un límite de alcohol en sangre de 0,04 %. Es la cifra de ese país. No la copies como si fuera la RAAC. En Argentina el límite y las condiciones se leen en la norma vigente.',
      'Si hace falta preguntarse si ya pasó el efecto, la respuesta de estudio es no volar. La cifra legal es la del país, y el mínimo personal puede ser más estricto.',
    ],
    [
      'Fatiga y estrés',
      'La fatiga se lleva el segundo error. El primero lo corregís. El que viene detrás —una frecuencia, un tanque, un rumbo— pasa porque la atención ya no tiene resto. No se arregla con café en la cabecera de pista.\n\nEl estrés agudo achica lo que podés mirar. Te quedás en un instrumento o en una conversación y el resto del avión sigue. La salida se prepara antes: dormir, dejar una hora de margen, y tener escrita la condición que te hace cancelar. En vuelo, nombrar que estás apurado ya es una mitigación.\n\nUS: El manual de factores humanos de la FAA lista fatiga, estrés y medicamentos en el mismo capítulo, con casos de ese sistema. La lista IMSAFE que ya viste en este tema es una ayuda de estudio, no un certificado médico argentino.',
      'El resto para encontrar el segundo error se consigue antes de salir. En la pista ya es tarde para dormir.',
    ],
    [
      'Volar de noche',
      'De noche hay menos referencias. Una luz puede ser un pueblo, un avión o una estrella, y el terreno deja de avisarte que está ahí. El clima se ve peor. En la aproximación, la senda se lee en las luces y en el PAPI, y el redondeo es más fácil de empezar demasiado alto o demasiado tarde.\n\nEn Argentina, volar VFR de noche depende de la instrucción que hayas hecho y de lo que diga tu licencia. Si la licencia trae una limitación, esa limitación se cumple. El detalle está en la Parte 61 vigente y en el texto de la licencia, no en un capítulo extranjero.\n\nUS: Para llevar pasajeros de noche, la FAA pide tres despegues y tres aterrizajes completos, hechos de noche, en los 90 días anteriores y en la misma categoría y clase. Define además qué franja horaria cuenta como noche para esa moneda. Es una regla de Estados Unidos. No la uses como requisito argentino.',
      'De noche se ven menos cosas y las luces engañan. Si tu licencia no trae esa atribución, el vuelo nocturno no está en el plan.',
    ],
  ],
};
