/** Sets de ejercicios del motor. Esquema en src/scripts/exercises/validate.js. */

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
    { id: 'w6', type: 'tf', prompt: 'Por radio, un QNH de 1013 se dice “one zero one three”.', answer: true },
    { id: 'w7', type: 'mcq', prompt: 'Querés avisar que se reportó cortante de viento en final.', say: 'Windshear reported on final',
      options: ['Wind cut on the end', 'Windshear reported on final', 'Final has wind change report', 'Shear of wind is final'], answer: 1 },
    { id: 'w8', type: 'tf', prompt: '“Visible is eight kilometres” es la forma correcta de informar la visibilidad.', answer: false,
      explain: 'La palabra es “visibility”.' },
  ],
};

/** Frases de supervivencia. Las opciones incorrectas son los errores típicos de quien habla español. */
export const survivalSet = {
  id: 'survival-say',
  slug: 'supervivencia',
  title: 'Salvate en la radio',
  lede: 'Diez situaciones en las que algo no sale bien. Elegí, completá u ordená la frase justa.',
  items: [
    { id: 's1', type: 'mcq', prompt: 'No escuchaste el último mensaje de la torre. ¿Qué decís?',
      options: ['Repeat', 'Say again', 'Again, please', 'Roger'], answer: 1,
      explain: 'Repeat no es una palabra normalizada de la radio, y roger diría que lo recibiste.' },
    { id: 's2', type: 'mcq', prompt: 'La torre te hace una pregunta y la respuesta es sí. ¿Qué contestás?',
      options: ['Yes', 'Roger', 'Affirm', 'Okay'], answer: 2,
      explain: 'Yes no es fraseología, y roger no contesta una pregunta de sí o no.' },
    { id: 's3', type: 'mcq', prompt: 'La torre te pide que avises cuando estés en final. Lo entendiste y lo vas a hacer. ¿Qué contestás?',
      options: ['Roger', 'Affirm', 'Copy that', 'Wilco'], answer: 3,
      explain: 'Roger solo dice que lo recibiste. Wilco agrega que lo vas a cumplir.' },
    { id: 's4', type: 'gap', prompt: 'Te hablan muy rápido. Pedí que hablen más despacio.',
      sentence: 'LV-DEM, speak ___', answers: ['slower'] },
    { id: 's5', type: 'order', prompt: 'Entendiste hasta el viento y lo demás se perdió. Pedí que te repitan todo lo que vino después.',
      tokens: ['wind', 'all', 'again', 'after', 'say'], answer: ['say', 'again', 'all', 'after', 'wind'] },
    { id: 's6', type: 'tf', prompt: '“Roger” quiere decir que vas a cumplir la instrucción.', say: 'Roger', answer: false,
      explain: 'Roger es solo “recibí todo tu último mensaje”. El que dice que vas a cumplir es wilco.' },
    { id: 's7', type: 'tf', prompt: 'Para decir que sí por radio se usa “affirm”, no “yes”.', say: 'Affirm', answer: true },
    { id: 's8', type: 'mcq', prompt: 'Dijiste mal el número de la pista. ¿Con qué palabra arrancás la versión correcta?',
      options: ['Correct', 'Correction', 'Disregard', 'Sorry'], answer: 1,
      explain: 'Correct quiere decir “es cierto”. Correction quiere decir “me equivoqué, va lo correcto”.' },
    { id: 's9', type: 'mcq', prompt: 'La torre no te puede atender ahora: te pide que esperes y te va a llamar. ¿Qué palabra usa?',
      options: ['Hold on', 'Standby', 'Wait me', 'Roger'], answer: 1 },
    { id: 's10', type: 'tf', prompt: 'Un “roger” alcanza para responder una autorización que hay que colacionar.', answer: false,
      explain: 'Las partes de seguridad de una autorización se colacionan. Roger no las reemplaza.' },
  ],
};
