/**
 * Inglés aeronáutico.
 *
 * Laguna y la matrícula LV-DEM son de práctica: no son un aeródromo, un parte ni un avión reales.
 * La fraseología sigue el uso de la OACI en radiotelefonía (pista en dos cifras, viento y QNH
 * cifra por cifra). Se escribe three, four, five y nine; por radio suenan
 * tree, fower, fife y niner, y eso es lo que muestra el campo sound y lo que dice la voz.
 */

/** Los seis pasos del recorrido, en el orden de la página. step es el número que se muestra. */
export const englishPhases = [
  { id: 'base', step: 1, title: 'Base', lede: 'Las palabras y los números que usás en cada llamada.' },
  { id: 'comunicaciones', step: 2, title: 'Comunicaciones', lede: 'Escuchar, entender y responder en la frecuencia.' },
  { id: 'emergencias', step: 3, title: 'Emergencias', lede: 'Qué decir cuando algo sale mal, y en qué orden.' },
  { id: 'anormal', step: 4, title: 'Situación anormal', lede: 'Nombrar y contar lo que pasó cuando no fue una operación normal.' },
  { id: 'comunicarla', step: 5, title: 'Comunicarla', lede: 'El mismo hecho se dice distinto según quién escucha.' },
  { id: 'historia', step: 6, title: 'Contá tu historia', lede: 'Tu propia historia, en inglés. Es opcional.' },
];

/** Todos los módulos. Los que tienen href ya están hechos; el resto aparece como próximamente. */
export const englishSections = [
  { slug: 'supervivencia', phase: 'base', title: 'Frases de supervivencia', blurb: 'Qué decir cuando no entendiste, no podés o te equivocaste.', href: '/ingles/supervivencia' },
  { slug: 'numeros', phase: 'base', title: 'Números y alfabeto', blurb: 'Cifras y letras como se dicen por radio.', href: '/ingles/numeros' },
  { slug: 'aerodromo', phase: 'base', title: 'El aeródromo', blurb: 'Pista, rodaje, plataforma y circuito.', href: '/ingles/aerodromo' },
  { slug: 'aeronave', phase: 'base', title: 'La aeronave', blurb: 'Partes, instrumentos y fallas.', href: '/ingles/aeronave' },
  { slug: 'tiempo', phase: 'base', title: 'El tiempo', blurb: 'Cómo se dicen las nubes y los fenómenos por radio.', href: '/ingles/tiempo' },

  { slug: 'atis', phase: 'comunicaciones', title: 'El ATIS', blurb: 'El parte grabado antes de llamar a la torre.', href: '/ingles/atis' },
  { phase: 'comunicaciones', title: 'Autorización y colación', blurb: 'Qué te autorizan, cómo lo repetís y cómo se detecta un error.' },
  { phase: 'comunicaciones', title: 'Radio por fase de vuelo', blurb: 'De la puesta en marcha a la final: qué se dice en cada tramo.' },

  { phase: 'emergencias', title: 'Mayday y Pan Pan', blurb: 'Aviar, navegar, comunicar: el mensaje de emergencia paso a paso.' },

  { phase: 'anormal', title: 'Vocabulario de accidentes', blurb: 'Las palabras para nombrar qué pasó.' },
  { phase: 'anormal', title: 'Contalo en pasado', blurb: 'Relatar un incidente con los tiempos verbales correctos.' },
  { phase: 'anormal', title: 'Describí la foto', blurb: 'Qué ves, dónde y qué está pasando.' },
  { phase: 'anormal', title: 'Línea de tiempo', blurb: 'Ordenar un incidente real, paso por paso.' },

  { phase: 'comunicarla', title: 'Un evento, tres públicos', blurb: 'El mismo hecho contado a ATC, a Operaciones y a los pasajeros.' },

  { phase: 'historia', title: 'Preguntas de entrevista', blurb: 'Contá quién sos y qué hacés, en inglés. Opcional.' },
];

/** Los temas que ya están hechos, en orden. Arman la paginación entre temas. */
export const englishTopics = englishSections.filter((section) => section.href);

export const englishReadySlugs = englishTopics.map((topic) => topic.slug);

export function englishNeighbors(slug) {
  const index = englishTopics.findIndex((topic) => topic.slug === slug);
  return {
    previous: index > 0 ? englishTopics[index - 1] : null,
    next: index > -1 && index < englishTopics.length - 1 ? englishTopics[index + 1] : null,
  };
}

/** x e y: dónde se apoya la etiqueta sobre el plano, en % del dibujo de 840 × 640. */
export const aerodromeWords = [
  {
    id: 'runway',
    pin: 'runway',
    en: 'runway',
    es: 'pista',
    say: 'Runway one three, cleared for take-off.',
    body: 'Es la superficie preparada para despegar y aterrizar. En la radio se nombra con el número, no con la palabra pista.',
    x: 64.29,
    y: 41.88,
  },
  {
    id: 'designator',
    pin: '13',
    en: 'runway designator',
    es: 'designador de pista',
    say: 'Runway one three.',
    body: 'Es el número pintado en el umbral. 13 quiere decir que el eje mira hacia unos 130 grados. Se dice cifra por cifra.',
    x: 30.71,
    y: 43.75,
  },
  {
    id: 'threshold',
    pin: 'threshold',
    en: 'threshold',
    es: 'umbral',
    say: 'Threshold runway one three.',
    body: 'Es el comienzo de la pista que se usa para aterrizar. Las franjas marcadas te avisan que ahí empieza.',
    x: 26.9,
    y: 41.88,
  },
  {
    id: 'centre',
    pin: 'centre line',
    en: 'centre line',
    es: 'eje de pista',
    say: 'Line up on the centre line.',
    body: 'Es la línea del medio. En el despegue y en el aterrizaje te mantiene sobre el eje. Centre se escribe así en la fraseología de la OACI.',
    x: 53.57,
    y: 45.31,
  },
  {
    id: 'taxiway',
    pin: 'taxiway',
    en: 'taxiway',
    es: 'calle de rodaje',
    say: 'Taxi via taxiway Alfa.',
    body: 'Es la calle que une la plataforma con la pista. Se nombra con una letra del alfabeto fonético.',
    x: 48.81,
    y: 59.38,
  },
  {
    id: 'holding',
    pin: 'holding point',
    en: 'holding point',
    es: 'punto de espera',
    say: 'Taxi to holding point runway one three.',
    body: 'Es donde frenás antes de entrar a la pista. Las líneas del piso te marcan hasta dónde podés llegar sin una autorización para ingresar.',
    x: 48.81,
    y: 51.56,
  },
  {
    id: 'apron',
    pin: 'apron',
    en: 'apron',
    es: 'plataforma',
    say: 'Taxi to the apron.',
    body: 'Es la zona donde el avión estaciona, carga y se abastece. No es una calle de rodaje: ahí se maniobra despacio.',
    x: 46.43,
    y: 78.12,
  },
  {
    id: 'windsock',
    pin: 'windsock',
    en: 'windsock',
    es: 'manga',
    say: 'Check the windsock.',
    body: 'Muestra hacia dónde se va el viento. La boca abierta mira al viento: si la manga apunta al este, el viento viene del oeste.',
    x: 93.1,
    y: 56.88,
  },
  {
    id: 'tower',
    pin: 'tower',
    en: 'control tower',
    es: 'torre de control',
    say: 'Laguna Tower, LV-DEM.',
    body: 'Es la dependencia que controla el tránsito del aeródromo. El primer llamado dice a quién llamás y quién sos.',
    x: 11.43,
    y: 60.47,
  },
  {
    id: 'hangar',
    pin: 'hangar',
    en: 'hangar',
    es: 'hangar',
    say: 'The aircraft is in the hangar.',
    body: 'Es el edificio donde se guarda el avión. En plataforma y en hangar se habla en inglés simple, no con la fraseología de la pista.',
    x: 69.05,
    y: 75.31,
  },
  {
    id: 'intersection',
    pin: 'intersection',
    en: 'intersection',
    es: 'intersección',
    say: 'Hold at the intersection.',
    body: 'Es el cruce de dos calles de rodaje. Si te dicen que esperes ahí, frenás antes de meterte en la otra calle.',
    x: 48.81,
    y: 68.75,
  },
  {
    id: 'bay',
    pin: 'holding bay',
    en: 'holding bay',
    es: 'bahía de espera',
    say: 'Hold in the holding bay.',
    body: 'Es un ensanche para esperar fuera de la calle. Te deja ceder el paso sin tapar a quien viene detrás.',
    x: 45,
    y: 59.38,
  },
  {
    id: 'final',
    pin: 'final',
    en: 'final',
    es: 'final',
    say: 'LV-DEM, final runway one three.',
    body: 'Es el tramo alineado con la pista, el del aterrizaje. Se reporta cuando ya estás en ese tramo.',
    x: 17.86,
    y: 45.62,
  },
  {
    id: 'downwind',
    pin: 'downwind',
    en: 'downwind',
    es: 'inicial',
    say: 'Report downwind.',
    body: 'Es la inicial: el tramo paralelo a la pista, volado en sentido contrario al aterrizaje. En inglés se llama downwind porque el viento te queda de cola.',
    x: 51.19,
    y: 21.25,
  },
  {
    id: 'base',
    pin: 'base',
    en: 'base',
    es: 'básica',
    say: 'Turn base.',
    body: 'Es la básica: el tramo perpendicular a la pista que te deja de frente a la final. De la inicial se pasa a la básica, y de la básica a la final.',
    x: 10.71,
    y: 31.25,
  },
];

export const aerodromeRadio = [
  {
    id: 'circuit',
    pin: 'circuit',
    en: 'circuit',
    es: 'circuito de tránsito',
    say: 'Join the circuit.',
    body: 'Es el recorrido alrededor de la pista. Los tramos que se reportan son la inicial (downwind), la básica (base) y la final. En este plano está por izquierda. El aeródromo real puede publicarlo de otra forma.',
  },
  {
    id: 'lineup',
    pin: 'line up',
    en: 'line up and wait',
    es: 'alinear y esperar',
    say: 'Line up and wait.',
    body: 'Entrás a la pista, te alineás con el eje y esperás. No es una autorización de despegue.',
  },
  {
    id: 'backtrack',
    pin: 'backtrack',
    en: 'backtrack',
    es: 'recorrer la pista en contra',
    say: 'Backtrack approved.',
    body: 'Recorrés la pista hacia el umbral, en contra del despegue, para usar todo el largo. Se hace cuando el control lo autoriza.',
  },
  {
    id: 'vacated',
    pin: 'vacated',
    en: 'runway vacated',
    es: 'pista libre',
    say: 'Runway vacated.',
    body: 'Ya saliste de la pista. Se dice para avisar que quedó libre.',
  },
];

export const spokenDigits = [
  { digit: '0', say: 'zero', special: false },
  { digit: '1', say: 'one', special: false },
  { digit: '2', say: 'two', special: false },
  { digit: '3', say: 'three', sound: 'tree', special: true },
  { digit: '4', say: 'four', sound: 'fower', special: true },
  { digit: '5', say: 'five', sound: 'fife', special: true },
  { digit: '6', say: 'six', special: false },
  { digit: '7', say: 'seven', special: false },
  { digit: '8', say: 'eight', special: false },
  { digit: '9', say: 'nine', sound: 'niner', special: true },
];

export const spokenGroups = [
  { say: 'decimal', es: 'el punto de una frecuencia' },
  { say: 'hundred', es: 'cien, en una altitud' },
  { say: 'thousand', es: 'mil, en una altitud' },
];

/** Tipos del conversor. La conversión vive en scripts/english.js. */
export const radioKinds = [
  { id: 'runway', label: 'Pista', example: '13', hint: '13, 31L, 04R', rule: 'Dos cifras, dichas una por una. L, R y C se dicen left, right y centre.' },
  { id: 'wind', label: 'Viento', example: '270/15', hint: '270/15', rule: 'Dirección en tres cifras y degrees. La intensidad, cifra por cifra, con knots.' },
  { id: 'frequency', label: 'Frecuencia', example: '118.3', hint: '118.3, 121.75', rule: 'Cifra por cifra. El punto se dice decimal.' },
  { id: 'altitude', label: 'Altitud', example: '3500', hint: '3500, 10000, FL180', rule: 'En pies, con thousand y hundred. Un nivel de vuelo va cifra por cifra: flight level.' },
  { id: 'qnh', label: 'QNH', example: '1016', hint: '1016, 998', rule: 'Cifra por cifra, después de las letras QNH.' },
  { id: 'time', label: 'Hora', example: '14:30', hint: '14:30, 0905', rule: 'Cuatro cifras, una por una. Sin los dos puntos.' },
  { id: 'callsign', label: 'Matrícula', example: 'LV-DEM', hint: 'LV-DEM, CX-ABC', rule: 'Letra por letra con el alfabeto. El guion no se dice.' },
];

export const phoneticAlphabet = [
  ['A', 'Alfa', 'AL-FA'],
  ['B', 'Bravo', 'BRA-VO'],
  ['C', 'Charlie', 'CHAR-LI'],
  ['D', 'Delta', 'DEL-TA'],
  ['E', 'Echo', 'E-KO'],
  ['F', 'Foxtrot', 'FOKS-TROT'],
  ['G', 'Golf', 'GOLF'],
  ['H', 'Hotel', 'JO-TEL'],
  ['I', 'India', 'IN-DIA'],
  ['J', 'Juliett', 'YU-LI-ET'],
  ['K', 'Kilo', 'KI-LO'],
  ['L', 'Lima', 'LI-MA'],
  ['M', 'Mike', 'MAIK'],
  ['N', 'November', 'NO-VEM-BER'],
  ['O', 'Oscar', 'OS-CAR'],
  ['P', 'Papa', 'PA-PA'],
  ['Q', 'Quebec', 'KE-BEC'],
  ['R', 'Romeo', 'RO-ME-O'],
  ['S', 'Sierra', 'SI-E-RRA'],
  ['T', 'Tango', 'TAN-GO'],
  ['U', 'Uniform', 'IU-NI-FORM'],
  ['V', 'Victor', 'VIC-TOR'],
  ['W', 'Whiskey', 'UIS-KI'],
  ['X', 'X-ray', 'EKS-REI'],
  ['Y', 'Yankee', 'IAN-KI'],
  ['Z', 'Zulu', 'ZU-LU'],
];

export const numberDrills = [
  {
    id: 'runway',
    kicker: 'Pista',
    shown: '13',
    prompt: '¿Cómo se dice esta pista?',
    answer: ['runway', 'one', 'three'],
  },
  {
    id: 'frequency',
    kicker: 'Frecuencia',
    shown: '118.3',
    prompt: '¿Cómo se dice esta frecuencia?',
    answer: ['one', 'one', 'eight', 'decimal', 'three'],
  },
  {
    id: 'registration',
    kicker: 'Matrícula de práctica',
    shown: 'LV-DEM',
    prompt: 'Deletreala. El guion no se dice.',
    answer: ['Lima', 'Victor', 'Delta', 'Echo', 'Mike'],
  },
  {
    id: 'wind',
    kicker: 'Viento',
    shown: '270° / 15 kt',
    prompt: '¿Cómo se dice este viento?',
    answer: ['two', 'seven', 'zero', 'degrees', 'one', 'five', 'knots'],
  },
  {
    id: 'altitude',
    kicker: 'Altitud',
    shown: '3.500 ft',
    prompt: '¿Cómo se dice esta altitud?',
    answer: ['three', 'thousand', 'five', 'hundred'],
    note: 'Un nivel de vuelo se dice cifra por cifra: flight level one eight zero.',
  },
  {
    id: 'qnh',
    kicker: 'QNH',
    shown: '1016',
    prompt: '¿Cómo se dice este QNH?',
    answer: ['QNH', 'one', 'zero', 'one', 'six'],
    note: 'QNH se dice con las letras: Quebec November Hotel.',
  },
];

/**
 * Las piezas del avión de práctica. view: en qué dibujo vive (side, top o panel).
 * moves: cómo se mueve al elegirla, cuando el dibujo la anima.
 */
export const aircraftWords = [
  { id: 'fuselage', view: 'side', en: 'fuselage', es: 'fuselaje', say: 'Check the fuselage for dents.', body: 'Es el cuerpo del avión. Une las alas, la cola y el motor, y lleva la cabina.' },
  { id: 'cowling', view: 'side', en: 'cowling', es: 'capó del motor', say: 'Open the cowling and check the oil.', body: 'Es la tapa que cubre el motor. Se abre en la inspección previa para mirar el aceite y buscar pérdidas.' },
  { id: 'propeller', view: 'side', en: 'propeller', es: 'hélice', say: 'Clear prop!', body: 'Tira del avión hacia adelante. Antes de arrancar se grita “Clear prop” para avisar que se va a poner en marcha.', moves: 'Al girar, las palas se ven como un borrón.' },
  { id: 'spinner', view: 'side', en: 'spinner', es: 'cono de la hélice', say: 'Check the spinner for cracks.', body: 'Es el cono que cubre el centro de la hélice. Se revisa que no tenga grietas ni golpes.' },
  { id: 'windshield', view: 'side', en: 'windshield', es: 'parabrisas', say: 'Clean the windshield.', body: 'Es el vidrio de adelante. Tiene que estar limpio y sin rayones para ver bien.' },
  { id: 'door', view: 'side', en: 'door', es: 'puerta', say: 'Check the door is closed and locked.', body: 'Es por donde se sube. Antes de rodar se verifica que esté cerrada y trabada.' },
  { id: 'wing', view: 'top', en: 'wing', es: 'ala', say: 'Check the wing for damage.', body: 'Es la pieza que hace la sustentación. Lleva los tanques de combustible, los alerones y los flaps.' },
  { id: 'nosegear', view: 'side', en: 'nose gear', es: 'tren de nariz', say: 'Check the nose gear and the tyre.', body: 'Es la rueda de adelante. Se usa para dirigir el avión en tierra. Se mira la presión y el estado de la goma.' },
  { id: 'maingear', view: 'side', en: 'main gear', es: 'tren principal', say: 'Check the main gear and the brakes.', body: 'Son las dos ruedas de atrás. Sostienen casi todo el peso y llevan los frenos.' },
  { id: 'fin', view: 'side', en: 'vertical stabilizer', es: 'estabilizador vertical', say: 'Check the vertical stabilizer.', body: 'Es la parte fija de la cola que apunta hacia arriba. Mantiene la nariz derecha, como la quilla de un barco.' },
  { id: 'rudder', view: 'side', en: 'rudder', es: 'timón de dirección', say: 'Check the rudder moves freely.', body: 'Es la parte móvil de la cola vertical. Se mueve con los pedales.', moves: 'Al moverlo, la nariz gira a un lado (guiñada).' },
  { id: 'hstab', view: 'side', en: 'horizontal stabilizer', es: 'estabilizador horizontal', say: 'Check the horizontal stabilizer.', body: 'Es la parte fija del plano horizontal de la cola. Mantiene la nariz estable, ni muy arriba ni muy abajo.' },
  { id: 'elevator', view: 'side', en: 'elevator', es: 'timón de profundidad', say: 'Check the elevator moves freely.', body: 'Es la parte móvil del plano horizontal de la cola. Se mueve con la palanca, hacia adelante y hacia atrás.', moves: 'Hacia arriba levanta la nariz. Hacia abajo la baja.' },
  { id: 'aileron', view: 'top', en: 'aileron', es: 'alerón', say: 'Check the ailerons move freely.', body: 'Están en la punta de cada ala, atrás. Se mueven en sentido contrario y con la palanca hacia los costados.', moves: 'Uno sube y el otro baja: el avión se inclina (alabeo).' },
  { id: 'flap', view: 'top', en: 'flap', es: 'flap', say: 'Set flaps ten degrees.', body: 'Están cerca del fuselaje, en el borde de atrás de cada ala. Agrandan el ala para volar más lento, en el despegue y en el aterrizaje.', moves: 'Bajan los dos juntos, hacia abajo.' },
  { id: 'wingtip', view: 'top', en: 'wingtip', es: 'punta de ala', say: 'Check the wingtip and the navigation light.', body: 'Es el extremo del ala. Lleva las luces de navegación: roja a la izquierda y verde a la derecha.' },
  { id: 'leadingedge', view: 'top', en: 'leading edge', es: 'borde de ataque', say: 'Check the leading edge for damage.', body: 'Es el borde de adelante del ala, el que corta el aire primero. Se revisa que no tenga golpes ni hielo.' },
  { id: 'fuelcap', view: 'top', en: 'fuel cap', es: 'tapa del tanque', say: 'Check the fuel caps are secure.', body: 'El combustible va en el ala. Se revisa que cada tapa esté bien cerrada antes de volar.' },
  { id: 'pitot', view: 'top', en: 'pitot tube', es: 'tubo pitot', say: 'Remove the pitot cover.', body: 'Mide la presión del aire de frente y alimenta el velocímetro. Se le saca la funda antes de volar.' },
  { id: 'panel', view: 'panel', en: 'instrument panel', es: 'panel de instrumentos', say: 'Check the instrument panel.', body: 'Es el tablero de la cabina de mando (cockpit). Los seis instrumentos del centro se llaman los básicos.' },
  { id: 'asi', view: 'panel', en: 'airspeed indicator', es: 'velocímetro', say: 'Airspeed alive.', body: 'Muestra la velocidad respecto del aire, en nudos. En la carrera de despegue se dice “airspeed alive” cuando la aguja se mueve.', moves: 'La aguja sube con la velocidad.' },
  { id: 'attitude', view: 'panel', en: 'attitude indicator', es: 'horizonte artificial', say: 'Check the attitude indicator.', body: 'Muestra la posición del avión respecto del horizonte: nariz arriba o abajo, y alas inclinadas.', moves: 'El horizonte se inclina cuando el avión se inclina.' },
  { id: 'altimeter', view: 'panel', en: 'altimeter', es: 'altímetro', say: 'Set the altimeter, QNH one zero one three.', body: 'Muestra la altura en pies. Se ajusta con el QNH que informa el ATIS o la torre.', moves: 'La aguja larga marca los cientos, la corta los miles.' },
  { id: 'turn', view: 'panel', en: 'turn coordinator', es: 'coordinador de giro', say: 'Turn coordinator, ball centred.', body: 'Muestra qué tan rápido gira el avión. La bolita de abajo dice si el giro está coordinado: tiene que estar en el medio.', moves: 'El avioncito se inclina con el giro.' },
  { id: 'heading', view: 'panel', en: 'heading indicator', es: 'indicador de rumbo', say: 'Set the heading indicator to the compass.', body: 'Muestra el rumbo del avión. Se compara con el compás y se corrige cada tanto, porque con el tiempo se desfasa.', moves: 'El disco gira cuando el avión cambia de rumbo.' },
  { id: 'vsi', view: 'panel', en: 'vertical speed indicator', es: 'variómetro', say: 'Climbing at five hundred feet per minute.', body: 'Muestra cuántos pies por minuto sube o baja el avión. En el medio, a la izquierda, está el cero.', moves: 'Sube la aguja si el avión asciende.' },
  { id: 'tach', view: 'panel', en: 'tachometer', es: 'tacómetro', say: 'Set power to two thousand four hundred RPM.', body: 'Muestra las vueltas del motor por minuto (RPM). El arco verde es el régimen normal. La marca roja, el máximo.', moves: 'La aguja sube con la potencia.' },
  { id: 'radio', view: 'panel', en: 'radio', es: 'radio', say: 'Radio check, one two three decimal four five.', body: 'Es la radio de comunicaciones (COM). La pantalla muestra la frecuencia en la que estás.' },
  { id: 'transponder', view: 'panel', en: 'transponder', es: 'transponder', say: 'Squawk one two zero zero.', body: 'Manda tu código al radar. Es el número de cuatro cifras que te da control. El 1200 se usa en vuelo visual cuando no te dan otro.' },
  { id: 'master', view: 'panel', en: 'master switch', es: 'llave general', say: 'Master switch on.', body: 'Enciende la electricidad del avión. Es lo primero que se activa en la cabina.' },
  { id: 'throttle', view: 'panel', en: 'throttle', es: 'acelerador', say: 'Throttle idle.', body: 'Es la perilla negra. Hacia adentro da más potencia y hacia afuera, menos. En marcha lenta está atrás del todo.' },
  { id: 'mixture', view: 'panel', en: 'mixture', es: 'mezcla', say: 'Mixture rich.', body: 'Es la perilla roja. Regula cuánto combustible recibe el motor. Rich es mezcla rica, y cut-off corta el motor.' },
  { id: 'yoke', view: 'panel', en: 'yoke', es: 'volante de mando', say: 'Pull back on the yoke.', body: 'Es el volante que maneja el piloto. Adelante y atrás mueve el timón de profundidad. Girado, mueve los alerones.', moves: 'Girá el volante: los alerones responden.' },
];

/** Lo que se dice cuando algo falla. Va como tarjetas que se dan vuelta. */
export const aircraftFaults = [
  { id: 'engine', en: 'engine failure', es: 'falla de motor', say: 'Engine failure.', body: 'El motor se detuvo. Es la emergencia que más se practica: se planea, se elige dónde bajar y se avisa por radio.' },
  { id: 'rough', en: 'rough engine', es: 'motor con vibraciones', say: 'The engine is running rough.', body: 'El motor sigue andando, pero con vibraciones o fallas. Se avisa y se busca un lugar donde aterrizar.' },
  { id: 'oil', en: 'low oil pressure', es: 'presión de aceite baja', say: 'Oil pressure is low.', body: 'La aguja del aceite bajó de lo normal. Puede ser el aviso de un problema grave en el motor.' },
  { id: 'leak', en: 'fuel leak', es: 'pérdida de combustible', say: 'I have a fuel leak.', body: 'Se pierde combustible. Se avisa enseguida, porque además de la autonomía hay riesgo de incendio.' },
  { id: 'smoke', en: 'smoke in the cockpit', es: 'humo en cabina', say: 'There is smoke in the cockpit.', body: 'Hay humo en la cabina de mando. Se dice primero qué pasa y después qué vas a hacer.' },
  { id: 'flaps', en: 'flaps jammed', es: 'flaps trabados', say: 'The flaps are jammed.', body: 'Los flaps no se mueven. El aterrizaje se hace más rápido y con más pista, así que se avisa.' },
  { id: 'electrical', en: 'electrical failure', es: 'falla eléctrica', say: 'Total electrical failure.', body: 'Se cortó la electricidad: se apagan la radio y el transponder. Es una de las causas de la falla de comunicaciones.' },
  { id: 'airspeed', en: 'unreliable airspeed', es: 'velocidad poco confiable', say: 'The airspeed indication is unreliable.', body: 'El velocímetro marca cualquier cosa. Una causa común es el pitot tapado: por eso se le saca la funda.' },
];
