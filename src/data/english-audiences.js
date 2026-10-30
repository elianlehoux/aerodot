/**
 * Un evento, tres públicos: el mismo evento dicho a la torre, a la empresa y a los pasajeros.
 *
 * El evento: en el ascenso, el motor empieza a funcionar irregular; el piloto vuelve a Laguna y aterriza
 * sin problemas. Es inventado: no cuenta un incidente real.
 *
 * Fuentes: la forma del mensaje a la torre es la del módulo de Mayday y Pan Pan (SERA.14095; la
 * urgencia con motor irregular sigue el mismo ejemplo). El informe a la empresa y el aviso a los
 * pasajeros son ejemplos de práctica y de lenguaje claro: ningún texto oficial los fija. Los textos
 * en español son propios.
 *
 * Cada público: id, es (cómo se lo nombra), when (cuándo se habla), rules (cuatro consejos), label
 * (qué es el texto), text (el ejemplo, lo que se lee) y say (lo que lee la voz).
 * En rules, el inglés va entre asteriscos: la página les pone lang="en".
 * Laguna y LV-DEM son de práctica. Las cifras de say van en palabras; se escribe three, four, five y
 * nine (ver english.js).
 */

const DEM = 'Lima Victor Delta Echo Mike';

/** Lo que lee la voz: el mismo texto, con la matrícula deletreada. */
const spoken = (text) => text.replaceAll('LV-DEM', DEM);

const audience = (entry) => ({ ...entry, say: spoken(entry.text) });

export const audiences = [
  audience({
    id: 'atc',
    es: 'La torre',
    when: 'Mientras pasa. Corto y con las frases de siempre.',
    label: 'Por radio',
    rules: [
      'Empezás con la señal (*PAN PAN* o *MAYDAY*) y seguís con las piezas del mensaje, en orden.',
      'Una idea por pieza: qué pasa, qué vas a hacer y dónde estás.',
      'Hablás en presente, porque está pasando ahora.',
      'No contás de más. Los detalles vienen después.',
    ],
    text: 'PAN PAN, PAN PAN, PAN PAN, Laguna Tower, LV-DEM, rough running engine, intend to return to Laguna, five miles south, two thousand feet, two persons on board.',
  }),
  audience({
    id: 'ops',
    es: 'La empresa',
    when: 'Después de aterrizar. En pasado, con hechos.',
    label: 'En un informe',
    rules: [
      'Contás en pasado, en el orden en que pasó.',
      'Hechos, no culpas ni suposiciones: qué viste y qué hiciste.',
      'Incluís cuándo, dónde, qué hiciste y cómo terminó.',
      'Para los daños y los heridos, usás la voz pasiva:*was damaged*, *was injured*.',
    ],
    text: 'At about ten fifteen local time, while climbing through two thousand feet, the engine started to run rough. I turned back and landed at Laguna without any problems. Nobody was injured and the aircraft was not damaged. The engine needs to be inspected.',
  }),
  audience({
    id: 'pax',
    es: 'Los pasajeros',
    when: 'Mientras pasa, cuando ya controlás el avión. Con calma y palabras simples.',
    label: 'Por el altavoz',
    rules: [
      'Usás palabras simples, sin siglas ni jerga de radio.',
      'Decís qué pasa, qué vamos a hacer y qué tienen que hacer ellos, en frases cortas.',
      'Mantenés la voz tranquila, sin minimizar ni dramatizar.',
      'No das detalles técnicos que no necesitan para estar seguros.',
    ],
    text: 'Ladies and gentlemen, this is your pilot. We have a small problem with the engine. We are returning to Laguna and we will land in a few minutes. Please keep your seat belts fastened and stay calm.',
  }),
];
