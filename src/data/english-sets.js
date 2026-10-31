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
      explain: '*Repeat* no es una palabra normalizada de la radio, y *roger* dice que lo recibiste.' },
    { id: 's2', type: 'mcq', prompt: 'La torre te hace una pregunta y la respuesta es sí. ¿Qué contestás?',
      options: ['Yes', 'Roger', 'Affirm', 'Okay'], answer: 2,
      explain: '*Yes* no es fraseología, y *roger* no contesta una pregunta de sí o no.' },
    { id: 's3', type: 'mcq', prompt: 'La torre te pide que avises cuando estés en final. Lo entendiste y lo vas a hacer. ¿Qué contestás?',
      options: ['Roger', 'Affirm', 'Copy that', 'Wilco'], answer: 3,
      explain: '*Roger* solo dice que lo recibiste. *Wilco* agrega que lo vas a cumplir.' },
    { id: 's4', type: 'gap', prompt: 'Te hablan muy rápido. Elegí la palabra del hueco.',
      sentence: 'LV-DEM, speak ___', answers: ['slower'], choices: ['slower', 'slow', 'more slow'] },
    { id: 's5', type: 'order', prompt: 'Entendiste hasta el viento y lo demás se perdió. Pedí que te repitan todo lo que vino después.',
      tokens: ['wind', 'all', 'again', 'after', 'say'], answer: ['say', 'again', 'all', 'after', 'wind'] },
    { id: 's6', type: 'tf', prompt: '“*Roger*” quiere decir que vas a cumplir la instrucción.', say: 'Roger', answer: false,
      explain: '*Roger* es solo “recibí todo tu último mensaje”. El que dice que vas a cumplir es *wilco*.' },
    { id: 's7', type: 'tf', prompt: 'Para decir que sí por radio se usa “*affirm*”, no “*yes*”.', say: 'Affirm', answer: true },
    { id: 's8', type: 'mcq', prompt: 'Dijiste mal el número de la pista. ¿Con qué palabra arrancás la versión correcta?',
      options: ['Correct', 'Correction', 'Disregard', 'Sorry'], answer: 1,
      explain: '*Correct* quiere decir “es cierto”. *Correction* quiere decir “me equivoqué, lo que sigue es lo correcto”.' },
    { id: 's9', type: 'mcq', prompt: 'La torre no te puede atender ahora: te pide que esperes y te va a llamar. ¿Qué palabra usa?',
      options: ['Hold on', 'Standby', 'Wait me', 'Roger'], answer: 1 },
    { id: 's10', type: 'tf', prompt: 'Un “*roger*” alcanza para responder una autorización que hay que repetir.', answer: false,
      explain: 'Las partes de seguridad de una autorización se repiten. *Roger* no las reemplaza.' },
  ],
};

/** Una pregunta de hearback: el dato mal repetido es la opción que el caso declara en wrong.label. */
const hearbackItem = (entry, prompt) => ({
  id: entry.id,
  type: 'mcq',
  prompt,
  options: entry.options,
  answer: entry.options.indexOf(entry.wrong.label),
  lead: 'El dato mal repetido era:',
  explain: entry.explain,
});

/**
 * Encontrá el error: una pregunta por cada caso de la página (las burbujas están arriba).
 * No marca el tema como listo (track: false): eso lo hace la práctica del final.
 * Las preguntas van en orden (shuffle: false): cada una nombra su caso, numerado arriba.
 */
export const hearbackSet = {
  id: 'hearback-cases',
  slug: 'autorizacion',
  track: false,
  shuffle: false,
  title: 'Encontrá el error',
  lede: 'En cada caso hay un solo dato mal repetido. Escuchá o leé y elegí cuál es.',
  items: hearbackCases.map((entry, index) => hearbackItem(entry, `Caso ${index + 1}. ¿Qué dato repitió mal el piloto?`)),
};

/**
 * Autorizaciones. En prompt y explain, el inglés va entre asteriscos (ver scripts/mixed.js).
 * Las opciones incorrectas son los errores típicos: contestar *roger*, olvidar el distintivo,
 * tomar *line up and wait* como permiso para despegar o repetir la información.
 */
export const clearanceSet = {
  id: 'clearance-say',
  slug: 'autorizacion',
  title: 'Repetí bien',
  lede: 'Diez mensajes del control. Armá la repetición, encontrá el dato mal repetido y decidí qué se repite.',
  items: [
    { id: 'c1', type: 'order', prompt: 'La torre te dice “*LV-DEM, runway one three, cleared for take-off.*” Armá tu repetición.',
      tokens: ['runway', 'one three', 'cleared', 'for', 'take-off', 'LV-DEM'],
      answer: ['runway', 'one three', 'cleared', 'for', 'take-off', 'LV-DEM'],
      alternatives: [['cleared', 'for', 'take-off', 'runway', 'one three', 'LV-DEM']],
      explain: 'Repetís la pista y la autorización, y terminás con tu distintivo.' },
    ...hearbackDrills.map((entry) => hearbackItem(entry,
      `Control: “*${entry.tower}*” Piloto: “*${entry.pilot}*” ¿Qué dato repitió mal el piloto?`)),
    { id: 'c5', type: 'gap', prompt: 'El código de transpondedor que te asignaron es 4521. Completá la pieza que falta en tu repetición.',
      sentence: 'Squawk ___, LV-DEM', answers: ['four five two one', '4521'],
      explain: 'Este código se dice cifra por cifra: *four five two one*.' },
    { id: 'c6', type: 'tf', prompt: 'En la repetición, primero repetís el mensaje y al final va tu distintivo: “*Runway one three, cleared to land, LV-DEM.*”',
      say: 'Runway one three, cleared to land, Lima Victor Delta Echo Mike.', answer: true,
      explain: 'Así lo indica el manual de radio británico (CAP 413): la torre te nombra primero y vos terminás con tu distintivo.' },
    { id: 'c7', type: 'tf', prompt: 'El viento que te pasa la torre (“*wind one four zero degrees eight knots*”) está en la lista de lo que se repite siempre.',
      say: 'Wind one four zero degrees eight knots', answer: false,
      explain: 'El viento es información y no está en la lista. Si no lo entendiste, pedí *say again*.' },
    { id: 'c8', type: 'tf', prompt: 'El código de transpondedor (*squawk*) está en la lista de lo que se repite siempre.', answer: true,
      explain: 'Los códigos SSR están en la lista, junto con la pista en uso, el QNH y las instrucciones de nivel, rumbo y velocidad.' },
    { id: 'c9', type: 'tf', prompt: '“*Line up and wait*” te autoriza a despegar.', say: 'Line up and wait', answer: false,
      explain: 'Te alineás en la pista y esperás. Para despegar necesitás *cleared for take-off*.' },
    { id: 'c10', type: 'mcq', prompt: 'La torre te dice “*LV-DEM, QNH one zero one three.*” ¿Qué contestás?',
      options: ['QNH one zero one three, LV-DEM', 'Roger, LV-DEM', 'QNH one zero one three', 'Copied, LV-DEM'], answer: 0,
      explain: 'El ajuste del altímetro se repite. *Roger* o *copied* no lo reemplazan. Y sin tu distintivo, la torre no sabe quién repitió.' },
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
      explain: 'El mensaje lleva la señal, la estación, tu distintivo, qué pasa, qué vas a hacer y dónde estás, con altura y rumbo (SERA.14095).' },
    situation('e2', 'mayday', 'Se detuvo el motor en crucero y no vuelve a arrancar. Vas a aterrizar en un campo. ¿Con qué empezás la llamada?',
      'Es socorro. Hay un peligro grave o inminente y necesitás ayuda ya. *Emergency* y *help* no son las señales de la radio.'),
    situation('e3', 'panpan', 'Un pasajero se descompone. Está consciente y estable, y querés aterrizar cuanto antes en Laguna. ¿Con qué empezás?',
      'Es urgencia. Está en juego la seguridad de una persona a bordo, pero no necesitás ayuda inmediata. Si empeora y su vida corre peligro, pasás a *MAYDAY*.'),
    situation('e4', 'mayday', 'Sale humo y ves llamas debajo del panel de instrumentos. ¿Con qué empezás?',
      'El fuego a bordo es un peligro grave e inminente y necesitás ayuda ya. Es socorro.'),
    situation('e5', 'panpan', 'El motor anda irregular y pierde algunas vueltas, pero mantenés potencia y altura, y Laguna está a cinco millas. Vas a aterrizar ahí. ¿Con qué empezás?',
      'La seguridad del avión está comprometida, pero seguís volando con potencia y altura y tenés dónde aterrizar cerca. No necesitás ayuda inmediata, es urgencia. Si perdieras altura sin un lugar seguro donde aterrizar, sería *MAYDAY*.'),
    { id: 'e6', type: 'mcq', nature: true, prompt: 'Se te detuvo el motor. ¿Qué frase dice mejor qué pasa?',
      options: ['The engine has a problem', 'Engine failure', 'Failure of the motor', 'Engine is no good'], answer: 1,
      explain: '*Engine failure* dice qué pasó en pocas palabras. *The engine has a problem* no dice cuál, y el motor del avión es *engine*, no *motor*.' },
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
 * *roger* o *wilco* a lo que se repite, llamar *initial* a la inicial o traducir «pista libre».
 */
export const radioPhasesSet = {
  id: 'radio-say',
  slug: 'radio-fases',
  title: 'Hablá en cada fase',
  lede: 'Doce preguntas del circuito en Laguna: armá repeticiones, elegí la frase justa y decidí qué se repite.',
  items: [
    { id: 'r1', type: 'order', phase: 'aterrizaje',
      prompt: 'La torre te dice “*LV-DEM, runway one three, cleared to land, surface wind one four zero degrees eight knots.*” Armá tu repetición.',
      tokens: ['runway', 'one three', 'cleared', 'to', 'land', 'LV-DEM'],
      answer: ['runway', 'one three', 'cleared', 'to', 'land', 'LV-DEM'],
      alternatives: [['cleared', 'to', 'land', 'runway', 'one three', 'LV-DEM']],
      explain: 'Repetís la pista y la autorización, y terminás con tu distintivo. El viento no se repite.' },
    { id: 'r2', type: 'order', phase: 'estacionamiento',
      prompt: 'Rodaje te dice “*LV-DEM, Laguna Ground, taxi to the flying club via taxiway Bravo.*” Armá tu repetición.',
      tokens: ['taxi', 'to the flying club', 'via', 'taxiway Bravo', 'LV-DEM'],
      answer: ['taxi', 'to the flying club', 'via', 'taxiway Bravo', 'LV-DEM'],
      explain: 'Repetís el rodaje como te lo dieron y tu distintivo va al final.' },
    { id: 'r3', type: 'mcq', phase: 'punto-de-espera', pick: true,
      prompt: 'Terminaste la prueba de motor en el punto de espera y estás listo para salir. ¿Qué le decís a la torre, con la fraseología de esta página (CAP 413)?',
      options: ['Laguna Tower, LV-DEM, ready for departure', 'Laguna Tower, LV-DEM, ready for take-off', 'Laguna Tower, LV-DEM, ready to go', 'Laguna Tower, LV-DEM, request take-off now'], answer: 0,
      explain: 'Según el manual británico (CAP 413), *take-off* se dice solo en la autorización de despegue o al cancelarla. Antes se dice *departure*.' },
    { id: 'r4', type: 'mcq', phase: 'despegue', pick: true,
      prompt: 'La torre te dice “*LV-DEM, runway one three, line up and wait.*” ¿Qué contestás?',
      options: ['Runway one three, line up and wait, LV-DEM', 'Roger, LV-DEM', 'Wilco, LV-DEM', 'Runway one three, cleared for take-off, LV-DEM'], answer: 0,
      explain: 'Entrar a la pista se repite entero. *Roger* o *wilco* no alcanzan. Y *line up and wait* no te autoriza a despegar.' },
    { id: 'r5', type: 'mcq', phase: 'circuito', pick: true,
      prompt: 'Llegaste al tramo que en Argentina llamamos «inicial». ¿Qué decís?',
      options: ['LV-DEM, downwind', 'LV-DEM, initial', 'LV-DEM, base', 'LV-DEM, crosswind'], answer: 0,
      explain: 'La inicial es *downwind*. La palabra *initial* suele referirse a otra cosa, como la aproximación inicial.' },
    { id: 'r6', type: 'mcq', phase: 'estacionamiento', pick: true,
      prompt: 'Dejaste la pista y cambiaste a la frecuencia de rodaje. ¿Qué decís?',
      options: ['Laguna Ground, LV-DEM, runway free', 'Laguna Ground, LV-DEM, runway vacated', 'Laguna Ground, LV-DEM, out of the runway', 'Laguna Ground, LV-DEM, landed'], answer: 1,
      explain: 'Se dice *runway vacated*. *Runway free* es la traducción de «pista libre», pero no es fraseología.' },
    { id: 'r7', type: 'gap', phase: 'aterrizaje',
      prompt: 'Estás en final, la pista todavía está ocupada y la torre no te autoriza a aterrizar. Te dice que sigas. Completá la palabra.',
      sentence: 'LV-DEM, ___ approach', answers: ['continue'],
      explain: '*Continue approach* no te autoriza a aterrizar. Esperás el *cleared to land* o hacés *go around*.' },
    { id: 'r8', type: 'gap', phase: 'puesta-en-marcha',
      prompt: 'Rodaje te da permiso para poner en marcha. Completá la palabra que usa.',
      sentence: 'LV-DEM, start up ___', answers: ['approved'],
      explain: 'Es *approved*, el permiso para lo que pediste. *Cleared* se usa solo para las autorizaciones.' },
    { id: 'r9', type: 'tf', phase: 'punto-de-espera',
      prompt: 'A “*LV-DEM, hold position*” alcanza con contestar “*Wilco, LV-DEM*”.', answer: false,
      explain: 'Contestás *holding* y tu distintivo, como en los ejemplos del manual británico (CAP 413, 2.69). El mismo manual aclara que *roger* o *wilco* no alcanzan para *hold position*.' },
    { id: 'r10', type: 'tf', phase: 'aterrizaje',
      prompt: '“*Continue approach*” te autoriza a aterrizar.', say: 'Continue approach', answer: false,
      explain: 'Seguís la aproximación, pero para aterrizar necesitás *cleared to land*.' },
    { id: 'r11', type: 'tf', phase: 'punto-de-espera',
      prompt: 'Cuando te dicen “*contact Laguna Tower one one eight decimal three*”, repetís la frecuencia.', answer: true,
      explain: 'Las frecuencias nuevas están en la lista de lo que se repite siempre: *Laguna Tower one one eight decimal three, LV-DEM*.' },
    { id: 'r12', type: 'mcq', phase: 'puesta-en-marcha', ask: 'phase',
      prompt: '¿En qué fase escuchás “*LV-DEM, start up approved*”? Elegila por su nombre en inglés.',
      options: PHASE_NAMES, answer: 0, lead: 'La fase es:',
      explain: 'Es la puesta en marcha (*start up*), el permiso para encender el motor antes de pedir rodaje.' },
  ],
};

/**
 * En ruta y aproximación. En prompt y explain, el inglés va entre asteriscos (ver scripts/mixed.js).
 * Las opciones incorrectas son los errores típicos: pedir el cambio de frecuencia con palabras propias,
 * ordenar mal la primera llamada, contestar *roger* o *negative* a una ida al aire.
 */
export const enrouteSet = {
  id: 'enroute-say',
  slug: 'en-ruta',
  title: 'Hablá en ruta',
  lede: 'Diez preguntas: cambios de frecuencia, reportes de posición e ida al aire. Elegí, completá u ordená la frase.',
  items: [
    { id: 'e1', type: 'mcq', prompt: 'Querés pasar a la frecuencia de la torre de tu destino. ¿Cómo lo pedís?',
      options: ['LV-DEM, request change to one one eight decimal three', 'LV-DEM, I change to one one eight decimal three', 'LV-DEM, switching now to one one eight decimal three', 'LV-DEM, give me one one eight decimal three'], answer: 0,
      explain: 'La frase es *request change to* y la frecuencia. Seguís en la frecuencia actual hasta que te contesten *frequency change approved*.' },
    { id: 'e2', type: 'tf', prompt: '“*Frequency change approved*” es un permiso. Podés pasar a la frecuencia que pediste.', say: 'Frequency change approved', answer: true,
      explain: 'Acusás recibo y llamás en la frecuencia nueva.' },
    { id: 'e3', type: 'gap', prompt: 'La torre te dice “*monitor Costa Information one two six decimal five*”. Te pide que escuches sin llamar. Completá tu respuesta.',
      sentence: '___ one two six decimal five, LV-DEM', answers: ['monitoring'],
      explain: 'A *monitor* se contesta *monitoring* y la frecuencia.' },
    { id: 'e4', type: 'order', prompt: 'La torre te dice “*LV-DEM, contact Costa Information one two six decimal five.*” Armá tu repetición.',
      tokens: ['contact', 'Costa Information', 'one two six decimal five', 'LV-DEM'],
      answer: ['contact', 'Costa Information', 'one two six decimal five', 'LV-DEM'],
      explain: 'Repetís la dependencia y la frecuencia entera, y tu distintivo va al final.' },
    { id: 'e5', type: 'mcq', prompt: 'Llamás por primera vez a la torre de tu destino. ¿Cómo armás la llamada?',
      options: ['Santa Brisa Tower, LV-DEM, five miles north, two thousand feet, inbound for landing, information Charlie', 'Five miles north, Santa Brisa Tower, I am LV-DEM, I want land', 'LV-DEM, LV-DEM, Santa Brisa, landing five miles', 'Information Charlie, two thousand feet, LV-DEM, Tower'], answer: 0,
      explain: 'La llamada dice a quién llamás, quién sos, dónde estás, a qué altura, qué querés y la letra del ATIS que escuchaste.' },
    { id: 'e6', type: 'gap', prompt: 'Estás justo encima de un punto de notificación. Completá la palabra.',
      sentence: 'LV-DEM, ___ Piedra Alta, two thousand five hundred feet', answers: ['over'],
      explain: 'Sobre un punto conocido se dice *over*. Si no estás encima de ninguno, decís distancia y rumbo.' },
    { id: 'e7', type: 'order', prompt: 'No estás sobre ningún punto. Decí primero la distancia y hacia dónde queda el aeródromo, y después la altura.',
      tokens: ['five', 'miles', 'north', 'two thousand', 'feet'],
      answer: ['five', 'miles', 'north', 'two thousand', 'feet'],
      explain: 'Se dicen la distancia, el lado (*north*) y la altura, en ese orden.' },
    { id: 'e8', type: 'mcq', prompt: 'La torre te dice “*LV-DEM, go around, vehicle on the runway.*” ¿Qué contestás?',
      options: ['Going around, LV-DEM', 'Roger, continuing approach, LV-DEM', 'Negative, LV-DEM', 'Standby, LV-DEM'], answer: 0,
      explain: '*Go around* es una orden. Acusás con *going around*. Primero volás el avión y después hablás.' },
    { id: 'e9', type: 'tf', prompt: 'Si decidís hacer la ida al aire vos, primero tenés que pedirle permiso a la torre.', answer: false,
      explain: 'No esperás un permiso. Primero volás el avión y después avisás con *going around*.' },
    { id: 'e10', type: 'mcq', prompt: 'La torre te da la pista en uso y el QNH. ¿Cómo repetís?',
      options: ['Runway zero nine, QNH one zero one three, LV-DEM', 'LV-DEM, runway zero nine, QNH one zero one three', 'Roger, LV-DEM', 'QNH one zero one three, thank you'], answer: 0,
      explain: 'La pista en uso y el QNH se repiten siempre, y tu distintivo va al final.' },
  ],
};

/**
 * Falla de comunicaciones. En prompt y explain, el inglés va entre asteriscos (ver scripts/mixed.js).
 * Las luces se preguntan en verdadero o falso porque el significado va en español: las opciones de un
 * mcq se muestran tal cual, con lang="en".
 */
export const radioFailSet = {
  id: 'radiofail-say',
  slug: 'falla-radio',
  title: 'Sin radio',
  lede: 'Diez preguntas: el código, la transmisión a ciegas y las señales de la torre.',
  items: [
    { id: 'f1', type: 'tf', prompt: 'El código 7600 en el transpondedor indica falla de comunicaciones.', answer: true,
      explain: 'Así lo dice SERA.13005: 7700 emergencia, 7600 falla de comunicaciones y 7500 interferencia ilícita.' },
    { id: 'f2', type: 'mcq', prompt: 'Tu radio dejó de funcionar y el transpondedor anda. ¿Qué código ponés?',
      options: ['seven six zero zero', 'seven seven zero zero', 'seven five zero zero', 'two zero zero zero'], answer: 0,
      explain: 'El 7600 es falla de comunicaciones. El 7700 es emergencia y el 7500, interferencia ilícita.' },
    { id: 'f3', type: 'mcq', prompt: 'Tu receptor no funciona, pero tu transmisor sí. ¿Con qué frase abrís tus llamadas?',
      options: ['Transmitting blind due to receiver failure', 'Receiver failure, please answer', 'Mayday, no receiver', 'Say again all, receiver'], answer: 0,
      explain: 'Es la frase de SERA.14085. Das tu mensaje, lo repetís completo y avisás cuándo vas a volver a transmitir.' },
    { id: 'f4', type: 'gap', prompt: 'Falta la palabra que dice que hablás sin que te contesten.',
      sentence: 'Transmitting ___ due to receiver failure', answers: ['blind'],
      explain: '*Blind* es «a ciegas». Transmitís sin saber si te escuchan.' },
    { id: 'f5', type: 'order', prompt: 'Armá la frase con la que abrís una llamada cuando tu receptor no funciona.',
      tokens: ['transmitting', 'blind', 'due to', 'receiver', 'failure'],
      answer: ['transmitting', 'blind', 'due to', 'receiver', 'failure'] },
    { id: 'f6', type: 'tf', prompt: 'Si no lográs contacto por ningún canal, transmitís el mensaje dos veces, después de “*transmitting blind*”.', answer: true,
      explain: 'Según SERA.14085, transmitís el mensaje dos veces en los canales designados, después de esa frase.' },
    { id: 'f7', type: 'tf', prompt: 'Una luz verde fija dirigida a un avión en vuelo lo autoriza a aterrizar.', answer: true },
    { id: 'f8', type: 'tf', prompt: 'Una luz roja fija dirigida a un avión en vuelo le dice que ceda el paso a otros y siga en circuito.', answer: true },
    { id: 'f9', type: 'tf', prompt: 'Los destellos rojos dirigidos a un avión que rueda en tierra le indican que se detenga.', answer: false,
      explain: 'Los destellos rojos en tierra dicen que salgas de la zona de aterrizaje en uso. Detenerte es el rojo fijo.' },
    { id: 'f10', type: 'tf', prompt: 'De día, un avión en vuelo acusa recibo de una señal luminosa balanceando las alas, también cuando está en final.', answer: false,
      explain: 'Balanceás las alas, salvo en los tramos de base y de final.' },
  ],
};

/**
 * Contá un incidente. En prompt y explain, el inglés va entre asteriscos (ver scripts/mixed.js).
 * El relato de order sale de incidentStory (english-incident.js): las fichas son oraciones enteras.
 */
export const incidentSet = {
  id: 'incident-say',
  slug: 'incidentes',
  title: 'Contalo bien',
  lede: 'Diez preguntas: accidente o incidente, el vocabulario y los tiempos del relato.',
  items: [
    { id: 'i1', type: 'tf', prompt: 'Un incidente grave y un accidente se diferencian solo por el resultado.', answer: true,
      explain: 'En el incidente grave las circunstancias indicaban una alta probabilidad de accidente, pero no hubo heridos graves ni daños mayores (Anexo 13 de la OACI).' },
    { id: 'i2', type: 'tf', prompt: 'Un ave que golpea el avión sin dejar daños puede ser un incidente.', answer: true,
      explain: 'Es un hecho que no es un accidente y que podría afectar la seguridad.' },
    { id: 'i3', type: 'mcq', prompt: 'El avión se salió de la pista por el costado. ¿Cómo se llama el hecho?',
      options: ['runway excursion', 'runway exercise', 'runway extension', 'runway exit'], answer: 0,
      explain: 'Es *runway excursion*, salir de la pista, por el costado o por el final.' },
    { id: 'i4', type: 'mcq', prompt: 'Un ave golpeó el avión en la carrera de despegue. ¿Cómo se dice el hecho?',
      options: ['bird strike', 'bird crash', 'bird touch', 'bird accident'], answer: 0 },
    { id: 'i5', type: 'gap', prompt: 'El avión tocó la pista con mucha fuerza y se dañó el tren de nariz. Completá la palabra.',
      sentence: 'The pilot made a hard ___ and the nose wheel collapsed', answers: ['landing'],
      explain: '*Hard landing* es un aterrizaje duro.' },
    { id: 'i6', type: 'gap', prompt: 'Contás qué estaba pasando cuando empezó la falla. Completá la palabra.',
      sentence: 'While the aircraft ___ climbing, the engine started to run rough', answers: ['was'],
      explain: 'Lo que estaba en curso va en pasado continuo (*was climbing*). El hecho que lo interrumpió va en pasado simple (*started*).' },
    { id: 'i7', type: 'gap', prompt: 'Contás cómo terminó el vuelo: el avión aterrizó sin problemas.',
      sentence: 'The aircraft ___ safely', answers: ['landed'],
      explain: 'Un hecho terminado va en pasado simple: *landed*.' },
    { id: 'i8', type: 'order', prompt: 'Ordená cuatro hechos del relato, del primero al último.',
      tokens: ['The pilot turned back and called Laguna Tower.', 'LV-DEM took off from Laguna for a local flight.', 'The aircraft landed safely.', 'While the aircraft was climbing through two thousand feet, the engine started to run rough.'],
      answer: ['LV-DEM took off from Laguna for a local flight.', 'While the aircraft was climbing through two thousand feet, the engine started to run rough.', 'The pilot turned back and called Laguna Tower.', 'The aircraft landed safely.'],
      explain: 'Despegó, falló el motor, el piloto volvió y aterrizó.' },
    { id: 'i9', type: 'mcq', prompt: 'Querés decir en un informe que nadie se lastimó. ¿Cómo lo decís?',
      options: ['Nobody was injured', 'Nobody injured', 'Nobody did injure', 'Nobody is injure'], answer: 0,
      explain: 'Es una pasiva en pasado: *was injured*.' },
    { id: 'i10', type: 'mcq', prompt: 'Ayer el motor falló a dos mil pies. ¿Cómo lo contás en el informe?',
      options: ['The engine failed at two thousand feet.', 'The engine fails at two thousand feet.', 'The engine has fail at two thousand feet.', 'The engine failing at two thousand feet.'], answer: 0,
      explain: 'Un hecho terminado va en pasado simple: *failed*. Por radio, en cambio, hablás en presente.' },
  ],
};

/**
 * Un evento, tres públicos. En prompt y explain, el inglés va entre asteriscos (ver scripts/mixed.js).
 * Las opciones incorrectas son la frase de otro público: la de la radio en el informe, la del informe
 * en la radio, o la jerga de radio en el altavoz.
 */
export const audiencesSet = {
  id: 'audience-say',
  slug: 'tres-publicos',
  title: 'Elegí tu público',
  lede: 'Diez preguntas: la frase justa para la torre, la empresa y los pasajeros.',
  items: [
    { id: 'a1', type: 'mcq', prompt: 'El motor anda irregular y avisás a la torre. ¿Qué decís?',
      options: ['PAN PAN, PAN PAN, PAN PAN, Laguna Tower, LV-DEM, rough running engine, intend to return to Laguna', 'Laguna Tower, my engine has been running rough since the climb and I am afraid we might have to land soon', 'Ladies and gentlemen, we have a small problem with the engine', 'The engine ran rough during the climb and I returned to Laguna'], answer: 0,
      explain: 'A la torre le hablás con la señal y las piezas del mensaje. Va corto, en orden y en presente.' },
    { id: 'a2', type: 'mcq', prompt: 'Ya aterrizaste y le escribís a la empresa. ¿Qué frase usás?',
      options: ['The engine ran rough during the climb and I returned to Laguna.', 'PAN PAN, PAN PAN, PAN PAN, rough running engine.', 'Please keep your seat belts fastened and stay calm.', 'Do not worry, nothing happened.'], answer: 0,
      explain: 'El informe cuenta lo que pasó, en pasado y con hechos. La señal de radio ya no hace falta, y «no pasó nada» no es un hecho.' },
    { id: 'a3', type: 'mcq', prompt: 'Le hablás a los pasajeros con el avión bajo control. ¿Qué decís?',
      options: ['We have a small problem with the engine and we are returning to Laguna.', 'Engine failure, intend forced landing, two persons on board.', 'The engine ran rough and was inspected after landing.', 'PAN PAN, PAN PAN, PAN PAN, Laguna Tower.'], answer: 0,
      explain: 'Los pasajeros necesitan palabras simples: qué pasa y qué vas a hacer. Las otras tres son para la torre o para la empresa.' },
    { id: 'a4', type: 'tf', prompt: 'A los pasajeros les decís las siglas de la radio, como “*PAN PAN*” y “*QNH*”.', answer: false,
      explain: 'No las conocen. Usás palabras simples.' },
    { id: 'a5', type: 'tf', prompt: 'En el informe a la empresa contás lo que pasó en pasado y en orden.', answer: true },
    { id: 'a6', type: 'tf', prompt: 'Al mensaje a la torre le sumás todos los detalles del problema antes de decir qué vas a hacer.', answer: false,
      explain: 'Va corto y en orden: la señal, qué pasa, qué vas a hacer y dónde estás. Los detalles vienen después.' },
    { id: 'a7', type: 'order', prompt: 'Armá el aviso a los pasajeros: primero qué pasa, después qué va a hacer el avión y al final qué tienen que hacer los pasajeros.',
      tokens: ['We have a small problem with the engine', 'We are returning to Laguna', 'Please keep your seat belts fastened'],
      answer: ['We have a small problem with the engine', 'We are returning to Laguna', 'Please keep your seat belts fastened'] },
    { id: 'a8', type: 'gap', prompt: 'Cerrás el aviso con una frase que pide calma. Completá la palabra.',
      sentence: 'Please keep your seat belts fastened and stay ___', answers: ['calm'] },
    { id: 'a9', type: 'gap', prompt: 'En el informe, el daño va en voz pasiva. Completá la palabra.',
      sentence: 'The aircraft was not ___', answers: ['damaged'],
      explain: 'Para los daños y los heridos se usa la pasiva: *was damaged*, *was injured*.' },
    { id: 'a10', type: 'mcq', prompt: 'La torre te pregunta qué pasa. ¿Cómo contestás por radio?',
      options: ['Rough running engine', 'The engine was running rough, I think', 'I have a small problem, please help me', 'It ran rough before'], answer: 0,
      explain: 'Nombrás la naturaleza del problema en pocas palabras, sin pasado ni explicaciones.' },
  ],
};

/** El plano del aeródromo ya nombró los lugares. Acá hay que decir la frase. */
export const aerodromeSet = {
  id: 'aerodrome-say',
  slug: 'aerodromo',
  title: 'Decilo en la frecuencia',
  lede: 'Ocho frases del aeródromo. Elegí la que se dice, no la traducción literal.',
  items: [
    { id: 'd1', type: 'mcq', prompt: 'La torre te dice “*line up and wait*”. ¿Qué podés hacer?',
      options: ['Alinearte en la pista y despegar', 'Alinearte en la pista y esperar', 'Esperar fuera de la pista', 'Recorrer la pista en contra'], answer: 1,
      explain: '*Line up and wait* te mete en la pista y te deja alineado. No es la autorización de despegue.' },
    { id: 'd2', type: 'mcq', prompt: 'Ya saliste de la pista y querés avisar que quedó libre. ¿Qué decís?',
      options: ['Runway free', 'Runway vacated', 'Runway empty', 'Clear of the street'], answer: 1,
      explain: 'La frase es *runway vacated*. “Pista libre” no se traduce palabra por palabra.' },
    { id: 'd3', type: 'mcq', prompt: 'Llegaste al tramo que en Argentina llamamos «inicial». ¿Qué decís?',
      options: ['Initial', 'Downwind', 'Base', 'Upwind'], answer: 1,
      explain: 'La inicial es *downwind*. *Initial* suele nombrar otra cosa, como la aproximación inicial.' },
    { id: 'd4', type: 'gap', prompt: 'Te piden que frenes antes de entrar a la pista. Completá el lugar.',
      sentence: 'Hold short of the ___', answers: ['runway'],
      explain: 'El punto de espera es el límite. *Hold short of the runway* es frenar antes de la pista.' },
    { id: 'd5', type: 'order', prompt: 'La torre te autoriza a entrar, alinearte y esperar. Ordená la frase.',
      tokens: ['line', 'up', 'and', 'wait'], answer: ['line', 'up', 'and', 'wait'] },
    { id: 'd6', type: 'tf', prompt: '“*Backtrack*” es recorrer la pista hacia el umbral, en contra del despegue, cuando te lo autorizan.',
      say: 'Backtrack approved', answer: true },
    { id: 'd7', type: 'mcq', prompt: 'La básica es el tramo perpendicular que te deja de frente a la final. ¿Cómo se llama en inglés?',
      options: ['Base', 'Final', 'Downwind', 'Crosswind'], answer: 0 },
    { id: 'd8', type: 'tf', prompt: '“*Join the circuit*” te pide que te incorpores al recorrido alrededor de la pista.',
      say: 'Join the circuit', answer: true },
  ],
};

/** Las piezas del avión y las fallas, dichas como en la cabina. */
export const aircraftSet = {
  id: 'aircraft-say',
  slug: 'aeronave',
  title: 'Decilo en la cabina',
  lede: 'Ocho frases de la inspección y de una falla. Elegí la palabra que se usa, no la traducción.',
  items: [
    { id: 'p1', type: 'mcq', prompt: 'Vas a arrancar el motor y hay gente cerca de la hélice. ¿Qué gritás?',
      options: ['Clear prop', 'Propeller go', 'Start now', 'Engine on'], answer: 0,
      explain: '*Clear prop* avisa que la hélice se va a mover. No es una frase de la torre.' },
    { id: 'p2', type: 'gap', prompt: 'La mezcla va rica para el despegue. Completá la palabra.',
      sentence: 'Mixture ___', answers: ['rich'] },
    { id: 'p3', type: 'tf', prompt: '“*The flaps are jammed*” quiere decir que los flaps no se mueven.',
      say: 'The flaps are jammed', answer: true },
    { id: 'p4', type: 'mcq', prompt: 'La aguja del aceite bajó de lo normal. ¿Cómo lo decís?',
      options: ['Oil pressure is low', 'Oil is finished', 'The oil is cold', 'Pressure of the oil down'], answer: 0 },
    { id: 'p5', type: 'order', prompt: 'El motor sigue andando, pero vibra. Ordená la frase.',
      tokens: ['the', 'engine', 'is', 'running', 'rough'], answer: ['the', 'engine', 'is', 'running', 'rough'] },
    { id: 'p6', type: 'gap', prompt: 'Antes de volar le sacás la funda al tubo que alimenta el velocímetro. Completá la palabra.',
      sentence: 'Remove the pitot ___', answers: ['cover'] },
    { id: 'p7', type: 'tf', prompt: 'Si el control no te asignó un código, en Argentina ponés 1200.',
      answer: false,
      explain: 'El 1200 es un código de Estados Unidos para el vuelo visual. El código lo asigna el control, o seguís lo que publica la AIP.' },
    { id: 'p8', type: 'mcq', prompt: 'El comando gira y un ala sube mientras la otra baja. ¿Qué superficie se movió?',
      options: ['The ailerons', 'The flaps', 'The elevator', 'The rudder'], answer: 0,
      explain: 'Los alerones van en sentido contrario. Los flaps bajan los dos juntos.' },
  ],
};
