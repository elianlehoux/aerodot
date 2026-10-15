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
