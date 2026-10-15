/** Sets de ejercicios del motor. Esquema en src/scripts/exercises/validate.js. */

import { hearbackCases, hearbackDrills } from './english-clearance.js';

/** Cómo se dice el tiempo por radio. */
export const weatherSet = {
  id: 'weather-say',
  slug: 'tiempo',
  title: 'Decilo en la radio',
  lede: 'Ocho frases del tiempo. Elegí, completá u ordená cómo se dicen.',
  items: [
    { id: 'w1', type: 'mcq', prompt: 'Querés pedir el tiempo actual del aeródromo. ¿Qué decís?', say: 'Request current weather',
      options: ['Request current weather', 'Weather is requested by me', 'Give weather now', 'Say the cloud'], answer: 0 },
    { id: 'w2', type: 'mcq', prompt: 'El controlador te da la visibilidad: ocho kilómetros.', say: 'Visibility eight kilometres',
      options: ['Visible is eight kilometres', 'See eight kilometres', 'Visibility eight kilometres', 'Visibility is of eight'], answer: 2 },
    { id: 'w3', type: 'gap', prompt: 'Viento de 270 grados, 15 nudos.', say: 'Wind two seven zero degrees one five knots',
      sentence: 'Wind two seven zero degrees ___ knots', answers: ['one five'] },
    { id: 'w4', type: 'gap', prompt: 'Nubes fragmentadas a dos mil pies.', say: 'Cloud broken at two thousand feet',
      sentence: 'Cloud ___ at two thousand feet', answers: ['broken'] },
    { id: 'w5', type: 'order', prompt: 'Hay tormenta eléctrica en las cercanías del aeródromo.', say: 'Thunderstorm in the vicinity',
      tokens: ['thunderstorm', 'in', 'the', 'vicinity'], answer: ['thunderstorm', 'in', 'the', 'vicinity'] },
    { id: 'w6', type: 'tf', prompt: 'Por radio, un QNH de 1013 se dice “*one zero one three*”.', answer: true },
    { id: 'w7', type: 'mcq', prompt: 'Querés avisar que se reportó cortante de viento en final.', say: 'Windshear reported on final',
      options: ['Wind cut on the end', 'Windshear reported on final', 'Final has wind change report', 'Shear of wind is final'], answer: 1 },
    { id: 'w8', type: 'tf', prompt: '“*Visible is eight kilometres*” es la forma correcta de informar la visibilidad.', answer: false,
      explain: 'La palabra es “*visibility*”.' },
  ],
};

/**
 * Frases de supervivencia. En prompt y explain, el inglés va entre asteriscos (ver scripts/mixed.js).
 * Las opciones incorrectas son los errores típicos de quien habla español. */
export const survivalSet = {
  id: 'survival-say',
  slug: 'supervivencia',
  title: 'Salvate en la radio',
  lede: 'Diez situaciones en las que algo no sale bien. Elegí, completá u ordená la frase justa.',
  items: [
    { id: 's1', type: 'mcq', prompt: 'No escuchaste el último mensaje de la torre. ¿Qué decís?',
      options: ['Repeat', 'Say again', 'Again, please', 'Roger'], answer: 1,
      explain: '*Repeat* no es una palabra normalizada de la radio, y *roger* diría que lo recibiste.' },
    { id: 's2', type: 'mcq', prompt: 'La torre te hace una pregunta y la respuesta es sí. ¿Qué contestás?',
      options: ['Yes', 'Roger', 'Affirm', 'Okay'], answer: 2,
      explain: '*Yes* no es fraseología, y *roger* no contesta una pregunta de sí o no.' },
    { id: 's3', type: 'mcq', prompt: 'La torre te pide que avises cuando estés en final. Lo entendiste y lo vas a hacer. ¿Qué contestás?',
      options: ['Roger', 'Affirm', 'Copy that', 'Wilco'], answer: 3,
      explain: '*Roger* solo dice que lo recibiste. *Wilco* agrega que lo vas a cumplir.' },
    { id: 's4', type: 'gap', prompt: 'Te hablan muy rápido. Pedí que hablen más despacio.',
      sentence: 'LV-DEM, speak ___', answers: ['slower'] },
    { id: 's5', type: 'order', prompt: 'Entendiste hasta el viento y lo demás se perdió. Pedí que te repitan todo lo que vino después.',
      tokens: ['wind', 'all', 'again', 'after', 'say'], answer: ['say', 'again', 'all', 'after', 'wind'] },
    { id: 's6', type: 'tf', prompt: '“*Roger*” quiere decir que vas a cumplir la instrucción.', say: 'Roger', answer: false,
      explain: '*Roger* es solo “recibí todo tu último mensaje”. El que dice que vas a cumplir es *wilco*.' },
    { id: 's7', type: 'tf', prompt: 'Para decir que sí por radio se usa “*affirm*”, no “*yes*”.', say: 'Affirm', answer: true },
    { id: 's8', type: 'mcq', prompt: 'Dijiste mal el número de la pista. ¿Con qué palabra arrancás la versión correcta?',
      options: ['Correct', 'Correction', 'Disregard', 'Sorry'], answer: 1,
      explain: '*Correct* quiere decir “es cierto”. *Correction* quiere decir “me equivoqué, va lo correcto”.' },
    { id: 's9', type: 'mcq', prompt: 'La torre no te puede atender ahora: te pide que esperes y te va a llamar. ¿Qué palabra usa?',
      options: ['Hold on', 'Standby', 'Wait me', 'Roger'], answer: 1 },
    { id: 's10', type: 'tf', prompt: 'Un “*roger*” alcanza para responder una autorización que hay que colacionar.', answer: false,
      explain: 'Las partes de seguridad de una autorización se colacionan. *Roger* no las reemplaza.' },
  ],
};

/** Una pregunta de hearback: el dato mal colacionado es la opción que el caso declara en wrong.label. */
const hearbackItem = (entry, prompt) => ({
  id: entry.id,
  type: 'mcq',
  prompt,
  options: entry.options,
  answer: entry.options.indexOf(entry.wrong.label),
  lead: 'El dato mal colacionado era:',
  explain: entry.explain,
});

/**
 * Encontrá el error: una pregunta por cada caso de la página (las burbujas están arriba).
 * No marca el tema como listo (track: false): eso lo hace la práctica del final.
 */
export const hearbackSet = {
  id: 'hearback-cases',
  slug: 'autorizacion',
  track: false,
  title: 'Encontrá el error',
  lede: 'El controlador también escucha la colación: así se agarra un error a tiempo. Pero no te confíes: si el controlador no corrige, no quiere decir que hayas colacionado bien. Ante la duda, pedí confirmación (*confirm*). En cada caso hay un solo dato mal repetido: escuchá o leé y elegí cuál es.',
  items: hearbackCases.map((entry, index) => hearbackItem(entry, `Caso ${index + 1}. ¿Qué dato colacionó mal el piloto?`)),
};

/**
 * Autorización y colación. En prompt y explain, el inglés va entre asteriscos (ver scripts/mixed.js).
 * Las opciones incorrectas son los errores típicos: contestar *roger*, olvidar el distintivo,
 * tomar *line up and wait* como permiso para despegar o colacionar la información.
 */
export const clearanceSet = {
  id: 'clearance-say',
  slug: 'autorizacion',
  title: 'Colacioná bien',
  lede: 'Diez mensajes del control. Armá la colación, encontrá el dato mal repetido y decidí qué se colaciona.',
  items: [
    { id: 'c1', type: 'order', prompt: 'La torre te dice “*LV-DEM, runway one three, cleared for take-off.*” Armá tu colación.',
      tokens: ['runway', 'one three', 'cleared', 'for', 'take-off', 'LV-DEM'],
      answer: ['runway', 'one three', 'cleared', 'for', 'take-off', 'LV-DEM'],
      alternatives: [['cleared', 'for', 'take-off', 'runway', 'one three', 'LV-DEM']],
      explain: 'Repetís la pista y la autorización, y terminás con tu distintivo.' },
    ...hearbackDrills.map((entry) => hearbackItem(entry,
      `Control: “*${entry.tower}*” Piloto: “*${entry.pilot}*” ¿Qué dato colacionó mal el piloto?`)),
    { id: 'c5', type: 'gap', prompt: 'El código de transpondedor que te asignaron es 4521. Completá la pieza que falta en tu colación.',
      sentence: 'Squawk ___, LV-DEM', answers: ['four five two one', '4521'],
      explain: 'Este código se dice cifra por cifra: *four five two one*.' },
    { id: 'c6', type: 'tf', prompt: 'En la colación, primero repetís el mensaje y al final va tu distintivo: “*Runway one three, cleared to land, LV-DEM.*”',
      say: 'Runway one three, cleared to land, Lima Victor Delta Echo Mike.', answer: true,
      explain: 'Así lo indica el manual de radio británico (CAP 413): la torre te nombra primero y vos terminás con tu distintivo.' },
    { id: 'c7', type: 'tf', prompt: 'El viento que te pasa la torre (“*wind one four zero degrees eight knots*”) está en la lista de lo que se colaciona siempre.',
      say: 'Wind one four zero degrees eight knots', answer: false,
      explain: 'El viento es información y no está en la lista. Si no lo entendiste, pedí *say again*.' },
    { id: 'c8', type: 'tf', prompt: 'El código de transpondedor (*squawk*) está en la lista de lo que se colaciona siempre.', answer: true,
      explain: 'Los códigos SSR están en la lista, junto con la pista en uso, el QNH y las instrucciones de nivel, rumbo y velocidad.' },
    { id: 'c9', type: 'tf', prompt: '“*Line up and wait*” te autoriza a despegar.', say: 'Line up and wait', answer: false,
      explain: 'Te alineás en la pista y esperás. Para despegar necesitás *cleared for take-off*.' },
    { id: 'c10', type: 'mcq', prompt: 'La torre te dice “*LV-DEM, QNH one zero one three.*” ¿Qué contestás?',
      options: ['QNH one zero one three, LV-DEM', 'Roger, LV-DEM', 'QNH one zero one three', 'Copied, LV-DEM'], answer: 0,
      explain: 'El ajuste del altímetro se colaciona: *roger* o *copied* no lo reemplazan. Y sin tu distintivo, la torre no sabe quién colacionó.' },
  ],
};

/** Las cuatro señales que se ofrecen en cada situación: solo dos son señales de la radio. */
const SIGNALS = ['MAYDAY, MAYDAY, MAYDAY', 'PAN PAN, PAN PAN, PAN PAN', 'Emergency, emergency, emergency', 'Help, help, help'];

/** Una situación de socorro o urgencia: level declara la clave y explain, el porqué. */
const situation = (id, level, prompt, explain) => ({
  id, type: 'mcq', level, prompt, options: SIGNALS, answer: level === 'mayday' ? 0 : 1, explain,
});

/**
 * Mayday y Pan Pan. En prompt y explain, el inglés va entre asteriscos (ver scripts/mixed.js).
 * Las opciones incorrectas son los errores típicos: confundir socorro con urgencia, decir *emergency*
 * o *help* en lugar de la señal, o nombrar el problema sin decir cuál es.
 */
export const emergencySet = {
  id: 'emergency-say',
  slug: 'emergencias',
  title: 'Declaralo bien',
  lede: 'Diez preguntas: socorro o urgencia, el orden del mensaje y los códigos del transpondedor.',
  items: [
    { id: 'e1', type: 'order', prompt: 'Se te detuvo el motor y vas a hacer un aterrizaje forzoso. Ordená el mensaje de socorro.',
      tokens: ['MAYDAY MAYDAY MAYDAY', 'Laguna Tower', 'LV-DEM', 'engine failure', 'intend forced landing', 'five miles south of Laguna', 'two thousand feet heading three six zero'],
      answer: ['MAYDAY MAYDAY MAYDAY', 'Laguna Tower', 'LV-DEM', 'engine failure', 'intend forced landing', 'five miles south of Laguna', 'two thousand feet heading three six zero'],
      explain: 'La señal, la estación, tu distintivo, qué pasa, qué vas a hacer y dónde estás, con altura y rumbo (SERA.14095).' },
    situation('e2', 'mayday', 'Se detuvo el motor en crucero y no vuelve a arrancar. Vas a aterrizar en un campo. ¿Con qué empezás la llamada?',
      'Es socorro: un peligro grave o inminente y necesitás ayuda ya. *Emergency* y *help* no son las señales de la radio.'),
    situation('e3', 'panpan', 'Un pasajero se descompone. Está consciente y estable, y querés aterrizar cuanto antes en Laguna. ¿Con qué empezás?',
      'Es urgencia: está en juego la seguridad de una persona a bordo, pero no necesitás ayuda inmediata. Si empeora y su vida corre peligro, pasás a *MAYDAY*.'),
    situation('e4', 'mayday', 'Sale humo y ves llamas debajo del panel de instrumentos. ¿Con qué empezás?',
      'El fuego a bordo es un peligro grave e inminente y necesitás ayuda ya: socorro.'),
    situation('e5', 'panpan', 'El motor anda irregular y pierde algunas vueltas, pero mantenés potencia y altura, y Laguna está a cinco millas. Vas a aterrizar ahí. ¿Con qué empezás?',
      'La seguridad del avión está comprometida, pero seguís volando con potencia y altura y tenés dónde aterrizar cerca: no necesitás ayuda inmediata, es urgencia. Si perdieras altura sin un lugar seguro donde aterrizar, sería *MAYDAY*.'),
    { id: 'e6', type: 'mcq', nature: true, prompt: 'Se te detuvo el motor. ¿Qué frase dice mejor qué pasa?',
      options: ['The engine has a problem', 'Engine failure', 'Failure of the motor', 'Engine is no good'], answer: 1,
      explain: '*Engine failure* dice qué pasó, corto. *The engine has a problem* no dice cuál, y el motor del avión es *engine*, no *motor*.' },
    { id: 'e7', type: 'gap', prompt: 'Falta la palabra que anuncia lo que vas a hacer.',
      sentence: 'MAYDAY, MAYDAY, MAYDAY, Laguna Tower, LV-DEM, fire on board, ___ to land at Laguna', answers: ['intend'],
      explain: 'Tu intención se anuncia con *intend*: *intend to land at Laguna*.' },
    { id: 'e8', type: 'tf', prompt: 'La señal de socorro se dice tres veces: “*MAYDAY, MAYDAY, MAYDAY*”.', say: 'Mayday, mayday, mayday', answer: true,
      explain: 'La norma europea (SERA.14095) dice «preferiblemente tres veces», y lo mismo para *PAN PAN*.' },
    { id: 'e9', type: 'tf', prompt: 'El código 7600 en el transpondedor indica una emergencia.', answer: false,
      explain: 'La emergencia es el 7700. El 7600 indica falla de comunicaciones (SERA.13005).' },
    { id: 'e10', type: 'tf', prompt: 'El código 7500 indica interferencia ilícita, por ejemplo un secuestro.', answer: true,
      explain: 'Así lo dice SERA.13005: 7700 emergencia, 7600 falla de comunicaciones y 7500 interferencia ilícita.' },
  ],
};

/** Los nombres en inglés de cuatro fases (los de english-phases.js): opciones de la pregunta “¿en qué fase?”. */
const PHASE_NAMES = ['Start up', 'Taxi', 'Holding point', 'Take-off'];

/**
 * Radio por fase de vuelo. En prompt y explain, el inglés va entre asteriscos (ver scripts/mixed.js).
 * Cada ítem declara phase (el id de la fase en english-phases.js). pick marca “elegí la frase”: la clave
 * sale del diálogo de esa fase. ask: 'phase' marca la pregunta de en qué fase se dice algo.
 * Las opciones incorrectas son los errores típicos: decir *take-off* antes de la autorización, contestar
 * *roger* o *wilco* a lo que se colaciona, llamar *initial* a la inicial o traducir «pista libre».
 */
export const radioPhasesSet = {
  id: 'radio-say',
  slug: 'radio-fases',
  title: 'Hablá en cada fase',
  lede: 'Doce preguntas del circuito en Laguna: armá colaciones, elegí la frase justa y decidí qué se colaciona.',
  items: [
    { id: 'r1', type: 'order', phase: 'aterrizaje',
      prompt: 'La torre te dice “*LV-DEM, runway one three, cleared to land, surface wind one four zero degrees eight knots.*” Armá tu colación.',
      tokens: ['runway', 'one three', 'cleared', 'to', 'land', 'LV-DEM'],
      answer: ['runway', 'one three', 'cleared', 'to', 'land', 'LV-DEM'],
      alternatives: [['cleared', 'to', 'land', 'runway', 'one three', 'LV-DEM']],
      explain: 'Repetís la pista y la autorización, y terminás con tu distintivo. El viento no se colaciona.' },
    { id: 'r2', type: 'order', phase: 'estacionamiento',
      prompt: 'Rodaje te dice “*LV-DEM, Laguna Ground, taxi to the flying club via taxiway Bravo.*” Armá tu colación.',
      tokens: ['taxi', 'to the flying club', 'via', 'taxiway Bravo', 'LV-DEM'],
      answer: ['taxi', 'to the flying club', 'via', 'taxiway Bravo', 'LV-DEM'],
      explain: 'Repetís el rodaje como te lo dieron y tu distintivo va al final.' },
    { id: 'r3', type: 'mcq', phase: 'punto-de-espera', pick: true,
      prompt: 'Terminaste la prueba de motor en el punto de espera y estás listo para salir. ¿Qué le decís a la torre, con la fraseología de esta página (CAP 413)?',
      options: ['Laguna Tower, LV-DEM, ready for departure', 'Laguna Tower, LV-DEM, ready for take-off', 'Laguna Tower, LV-DEM, ready to go', 'Laguna Tower, LV-DEM, request take-off now'], answer: 0,
      explain: 'Según el manual británico (CAP 413), *take-off* se dice solo en la autorización de despegue o al cancelarla; antes se dice *departure*.' },
    { id: 'r4', type: 'mcq', phase: 'despegue', pick: true,
      prompt: 'La torre te dice “*LV-DEM, runway one three, line up and wait.*” ¿Qué contestás?',
      options: ['Runway one three, line up and wait, LV-DEM', 'Roger, LV-DEM', 'Wilco, LV-DEM', 'Runway one three, cleared for take-off, LV-DEM'], answer: 0,
      explain: 'Entrar a la pista se colaciona entero: *roger* o *wilco* no alcanzan. Y *line up and wait* no te autoriza a despegar.' },
    { id: 'r5', type: 'mcq', phase: 'circuito', pick: true,
      prompt: 'Llegaste al tramo que en Argentina llamamos «inicial». ¿Qué decís?',
      options: ['LV-DEM, downwind', 'LV-DEM, initial', 'LV-DEM, base', 'LV-DEM, crosswind'], answer: 0,
      explain: 'La inicial es *downwind*. La palabra *initial* suele referirse a otra cosa, como la aproximación inicial.' },
    { id: 'r6', type: 'mcq', phase: 'estacionamiento', pick: true,
      prompt: 'Dejaste la pista y cambiaste a la frecuencia de rodaje. ¿Qué decís?',
      options: ['Laguna Ground, LV-DEM, runway free', 'Laguna Ground, LV-DEM, runway vacated', 'Laguna Ground, LV-DEM, out of the runway', 'Laguna Ground, LV-DEM, landed'], answer: 1,
      explain: 'Se dice *runway vacated*. *Runway free* es la traducción de «pista libre», pero no es fraseología.' },
    { id: 'r7', type: 'gap', phase: 'aterrizaje',
      prompt: 'Estás en final, la pista todavía está ocupada y la torre no te autoriza a aterrizar: te dice que sigas. Completá la palabra.',
      sentence: 'LV-DEM, ___ approach', answers: ['continue'],
      explain: '*Continue approach* no te autoriza a aterrizar: esperás el *cleared to land* o hacés *go around*.' },
    { id: 'r8', type: 'gap', phase: 'puesta-en-marcha',
      prompt: 'Rodaje te da permiso para poner en marcha. Completá la palabra que usa.',
      sentence: 'LV-DEM, start up ___', answers: ['approved'],
      explain: 'Es *approved*: permiso para lo que pediste. *Cleared* se guarda para las autorizaciones.' },
    { id: 'r9', type: 'tf', phase: 'punto-de-espera',
      prompt: 'A “*LV-DEM, hold position*” alcanza con contestar “*Wilco, LV-DEM*”.', answer: false,
      explain: 'Contestás *holding* y tu distintivo, como en los ejemplos del manual británico (CAP 413, 2.69); el mismo manual aclara que *roger* o *wilco* no alcanzan para *hold position*.' },
    { id: 'r10', type: 'tf', phase: 'aterrizaje',
      prompt: '“*Continue approach*” te autoriza a aterrizar.', say: 'Continue approach', answer: false,
      explain: 'Seguís la aproximación, pero para aterrizar necesitás *cleared to land*.' },
    { id: 'r11', type: 'tf', phase: 'punto-de-espera',
      prompt: 'Cuando te dicen “*contact Laguna Tower one one eight decimal three*”, colacionás la frecuencia.', answer: true,
      explain: 'Las frecuencias nuevas están en la lista de lo que se colaciona siempre: *Laguna Tower one one eight decimal three, LV-DEM*.' },
    { id: 'r12', type: 'mcq', phase: 'puesta-en-marcha', ask: 'phase',
      prompt: '¿En qué fase escuchás “*LV-DEM, start up approved*”? Elegila por su nombre en inglés.',
      options: PHASE_NAMES, answer: 0, lead: 'La fase es:',
      explain: 'Es la puesta en marcha (*start up*): el permiso para encender el motor, antes de pedir rodaje.' },
  ],
};
