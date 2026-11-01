/**
 * Describir una imagen: la parte del examen online en la que te muestran una foto de aviación y la
 * describís durante un minuto o dos. En qué orden hablar, dónde está cada cosa, qué está pasando y
 * qué pudo haber pasado.
 *
 * Fuentes (los textos en español son propios):
 * - El orden (qué muestra, dónde está cada cosa, qué está pasando, qué pudo pasar) y las frases de
 *   posición (in the foreground, at the top…) son las que enseña el curso E4A para el examen de la OACI.
 * - Las fotos son de Wikimedia Commons, con licencia libre; credit dice el autor y la licencia.
 *   Las descripciones modelo son propias y describen solo lo que se ve en cada foto.
 *
 * En body, el inglés va entre asteriscos: la página les pone lang="en".
 */

/** Los cuatro pasos de la descripción. frames son formas de empezar la oración. */
export const pictureSteps = [
  { id: 'general', es: 'Qué muestra', body: 'Una oración: qué es y dónde.',
    frames: ['This picture shows…', 'In this picture, I can see…'] },
  { id: 'layout', es: 'Dónde está cada cosa', body: 'Recorré la foto: adelante, atrás, a cada lado.',
    frames: ['In the foreground, there is…', 'On the right, there are…'] },
  { id: 'action', es: 'Qué está pasando', body: 'Presente continuo: *is spraying*, *are standing*.',
    frames: ['The truck is spraying…', 'A man is standing next to…'] },
  { id: 'guess', es: 'Qué pudo pasar', body: 'Lo que suponés, sin afirmarlo.',
    frames: ['It looks like…', 'It seems that…', 'The aircraft might have…', 'It was probably…'] },
].map((step) => ({ ...step, say: step.frames.map((frame) => frame.replace('…', '')).join('. ') }));

/** Dónde está cada cosa en la foto. */
export const positionWords = [
  { en: 'in the foreground', es: 'adelante, lo más cerca' },
  { en: 'in the background', es: 'atrás, lo más lejos' },
  { en: 'in the middle', es: 'en el centro' },
  { en: 'on the left', es: 'a la izquierda' },
  { en: 'on the right', es: 'a la derecha' },
  { en: 'at the top', es: 'arriba' },
  { en: 'at the bottom', es: 'abajo' },
  { en: 'next to', es: 'al lado de' },
  { en: 'behind', es: 'detrás de' },
  { en: 'in front of', es: 'delante de' },
];

/** Palabras que aparecen en casi cualquier foto de aviación, por grupo. */
export const pictureWords = [
  { id: 'people', es: 'Personas', words: [
    ['ground crew', 'personal de plataforma'],
    ['marshaller', 'señalero'],
    ['firefighters', 'bomberos'],
    ['cabin crew', 'tripulantes de cabina'],
    ['paramedics', 'paramédicos'],
  ] },
  { id: 'vehicles', es: 'Vehículos y equipos', words: [
    ['fire truck', 'autobomba'],
    ['fuel truck', 'camión de combustible'],
    ['de-icing truck', 'camión de deshielo'],
    ['tug', 'tractor de remolque'],
    ['baggage cart', 'carro de equipaje'],
    ['jet bridge', 'manga'],
    ['evacuation slide', 'tobogán de evacuación'],
  ] },
  { id: 'places', es: 'Lugares', words: [
    ['apron', 'plataforma'],
    ['taxiway', 'calle de rodaje'],
    ['runway', 'pista'],
    ['terminal', 'terminal'],
    ['hangar', 'hangar'],
    ['fence', 'alambrado'],
  ] },
  { id: 'weather', es: 'Tiempo y luz', words: [
    ['clear sky', 'cielo despejado'],
    ['overcast', 'cubierto'],
    ['snow', 'nieve'],
    ['at night', 'de noche'],
    ['wet ground', 'suelo mojado'],
  ] },
].map((group) => ({ ...group, words: group.words.map(([en, es]) => ({ en, es })) }));

/**
 * Las fotos para practicar. file está en public/img/ingles. model sigue el orden de pictureSteps:
 * [id del paso, oraciones]. words son las palabras que sirven para esa foto.
 */
export const practicePhotos = [
  {
    id: 'deshielo',
    file: '/img/ingles/deshielo.jpg',
    width: 1100, height: 825,
    alt: 'Un avión de pasajeros en la manga, de noche y con nieve. Un camión con un brazo largo rocía el ala.',
    words: ['de-icing', 'de-icing fluid', 'jet bridge', 'gate', 'snow', 'to spray'],
    model: [
      ['general', 'This picture shows a passenger jet at the gate on a snowy night.'],
      ['layout', 'On the right, the aircraft is connected to a jet bridge. In the background, a de-icing truck with a long arm is next to the left wing. On the left, there is a service truck.'],
      ['action', 'The truck is spraying de-icing fluid on the wing, and there is a lot of mist around it.'],
      ['guess', 'It looks very cold. The aircraft is probably getting ready to depart, and there might be delays because of the snow.'],
    ],
    credit: { author: 'Nicholas Hartmann', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:2008_aircraft_deicing_at_gate.jpg' },
  },
  {
    id: 'evacuacion',
    file: '/img/ingles/evacuacion.jpg',
    width: 1100, height: 712,
    alt: 'La puerta delantera de un avión grande con el tobogán de evacuación desplegado hasta el suelo mojado, con manchas de espuma.',
    words: ['evacuation slide', 'front door', 'foam', 'wet', 'to evacuate'],
    model: [
      ['general', 'This picture shows the front of a large passenger aircraft after an emergency.'],
      ['layout', 'In the middle, an evacuation slide goes from the front door down to the ground. On the right, a man in a green uniform is standing. In the background, there is a person in a yellow vest.'],
      ['action', 'Nobody is using the slide now. The ground is wet, and there are white patches of foam.'],
      ['guess', 'It looks like the passengers evacuated using the slide. Firefighters probably sprayed foam, so there might have been a risk of fire.'],
    ],
    credit: { author: 'Comisión Estatal de Investigación de Accidentes Aéreos de Polonia (PKBWL)', license: 'CC BY 3.0 PL', url: 'https://commons.wikimedia.org/wiki/File:Lot_Flight_16_emergency_slide_1.jpg' },
  },
  {
    id: 'bomberos',
    file: '/img/ingles/bomberos.jpg',
    width: 1100, height: 733,
    alt: 'Una autobomba de aeropuerto verde amarillenta con un brazo extendido que rocía agua sobre una estructura de metal.',
    words: ['fire truck', 'firefighters', 'arm', 'to spray', 'training', 'clear sky'],
    model: [
      ['general', 'This picture shows an airport fire truck during a training exercise.'],
      ['layout', 'In the middle, there is a big yellow-green truck with the words Tulsa International Airport on its side. On the right, there is a metal structure that looks like part of a fuselage.'],
      ['action', 'The truck has a long arm, and it is spraying water onto the metal structure.'],
      ['guess', 'It seems that the firefighters are practising for an aircraft fire. The sky is clear, so the weather is good for the exercise.'],
    ],
    credit: { author: 'woodleywonderworks', license: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Oshkosh_Striker_fire_rescue_vehicle_in_action.jpg' },
  },
  {
    id: 'avioneta',
    file: '/img/ingles/avioneta.jpg',
    width: 1100, height: 733,
    alt: 'Una avioneta de ala baja apoyada de nariz contra un alambrado, al lado de una cancha. Adelante hay una cinta amarilla de la policía.',
    words: ['light aircraft', 'fence', 'police tape', 'damaged', 'forced landing'],
    model: [
      ['general', 'This picture shows a small aircraft that crashed next to a sports field.'],
      ['layout', 'In the middle, the aircraft is resting against a fence with its nose down. In the foreground, there is yellow police tape. On the right, there is a grey building and an orange cone. In the background, there are trees.'],
      ['action', 'Nobody is near the aircraft now, and the area is closed.'],
      ['guess', 'It looks like the pilot tried to make a forced landing, maybe after an engine failure. The aircraft is damaged, so this was probably an accident.'],
    ],
    credit: { author: 'Can Pac Swire', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Plane_crash_near_our_home!.jpg' },
  },
  {
    id: 'senalero',
    file: '/img/ingles/senalero.jpg',
    width: 1100, height: 799,
    alt: 'Un bimotor chico en la plataforma de un aeropuerto regional. A la izquierda, un señalero con los brazos en alto.',
    words: ['twin-engine aircraft', 'apron', 'marshaller', 'terminal', 'baggage cart', 'to taxi'],
    model: [
      ['general', 'This picture shows a small twin-engine aircraft at a small regional airport.'],
      ['layout', 'In the middle, the aircraft is on the apron, in front of the terminal. On the left, a marshaller is standing with both arms up. In the background, on the right, there is a fire station with a red fire truck inside.'],
      ['action', 'The aircraft is taxiing, and the marshaller is guiding the pilot. A worker is waiting with a baggage cart.'],
      ['guess', 'It seems that the aircraft has just landed and is going to park. The weather looks good: it is sunny, with some clouds.'],
    ],
    credit: { author: 'まも', license: 'Dominio público', url: 'https://commons.wikimedia.org/wiki/File:Sado_Airport_BN-2B.JPG' },
  },
  {
    id: 'salida-de-pista',
    file: '/img/ingles/salida-de-pista.jpg',
    width: 1100, height: 793,
    alt: 'Un avión de pasajeros cubierto de nieve, con la nariz hacia abajo sobre una calle. Adelante hay patrulleros y a la izquierda una ambulancia.',
    words: ['runway excursion', 'to overrun', 'police cars', 'ambulance', 'snow', 'emergency services'],
    model: [
      ['general', 'This picture shows a passenger jet that left the airport and stopped on a street.'],
      ['layout', 'In the middle, the aircraft is resting with its nose down on the road. In the foreground, there are police cars. On the left, there is an ambulance. On the right, there is a sign for Midway airport.'],
      ['action', 'Emergency services are working around the aircraft, and the road is closed.'],
      ['guess', 'It looks like the aircraft overran the runway when it was landing, maybe because there was snow on the runway. The engine and the nose seem damaged.'],
    ],
    credit: { author: 'Gabriel Widyna', license: 'Dominio público', url: 'https://commons.wikimedia.org/wiki/File:Southwest_Airlines_Flight_1248_-1.jpg' },
  },
].map((photo) => ({
  ...photo,
  model: photo.model.map(([step, text]) => ({ step, text })),
  say: photo.model.map(([, text]) => text).join(' '),
}));

/** Videos de ejemplo: alguien describe una foto como en el examen. course, true si la dio el curso. */
export const exampleVideos = [
  { id: 'rcQU23JKqs0', title: 'Salida de pista', channel: 'Easy Aviation English', start: 490, course: true },
  { id: 'AWUyTjUZIfs', title: 'Evacuación', channel: 'Easy Aviation English' },
  { id: 'z-LB4DPNopE', title: 'Deshielo', channel: 'Easy Aviation English' },
  { id: 'cHDOGKZPAB0', title: 'Emergencia médica', channel: 'Easy Aviation English' },
  { id: 'N4HVQTk7s6I', title: 'Señalero', channel: 'Fluentpilot', course: true },
  { id: 'hG0XNDH-Qsc', title: 'Varias fotos', channel: 'Fly with Jack', course: true },
];
