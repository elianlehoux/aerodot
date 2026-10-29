/**
 * Contá un incidente: accidente, incidente grave e incidente; las palabras para nombrar qué pasó y
 * cómo contarlo en pasado.
 *
 * Fuentes (los textos en español son propios):
 * - Las tres definiciones siguen el Anexo 13 de la OACI (Investigación de accidentes e incidentes de
 *   aviación), en palabras propias. Un incidente grave es un incidente con circunstancias que indican
 *   una alta probabilidad de accidente: lo que lo separa de un accidente es el resultado.
 * - El relato y los ejemplos son inventados: no cuentan un hecho real.
 *
 * En body, rule y note, el inglés va entre asteriscos: la página les pone lang="en".
 * Laguna y LV-DEM son de práctica. Las cifras de say van en palabras; se escribe three, four, five y
 * nine (ver english.js).
 */

const DEM = 'Lima Victor Delta Echo Mike';

/** Lo que lee la voz: el mismo texto, con la matrícula deletreada. */
const spoken = (text) => text.replaceAll('LV-DEM', DEM);

const withSay = (entry) => ({ ...entry, say: spoken(entry.use ?? entry.text) });

/** Tres palabras que se confunden. De la más grave a la menos grave. */
export const incidentKinds = [
  withSay({ id: 'accident', en: 'accident', es: 'accidente',
    body: 'Durante la operación de un avión, una persona muere o queda gravemente herida, el avión sufre un daño o una falla estructural que normalmente exige una reparación mayor, o queda desaparecido o inaccesible.',
    use: 'The aircraft was destroyed and the pilot was seriously injured.' }),
  withSay({ id: 'serious-incident', en: 'serious incident', es: 'incidente grave',
    body: 'Un incidente con circunstancias que indican una alta probabilidad de accidente. Lo que lo separa de un accidente es solo el resultado: no hubo heridos graves ni daños mayores, pero estuvo cerca.',
    use: 'The two aircraft nearly collided on the runway.' }),
  withSay({ id: 'incident', en: 'incident', es: 'incidente',
    body: 'Cualquier hecho que no es un accidente y que afecta o podría afectar la seguridad de la operación.',
    use: 'A bird hit the aircraft, but there was no damage.' }),
];

/** Las palabras para nombrar qué pasó y qué consecuencias tuvo. */
export const incidentTerms = [
  withSay({ id: 'bird-strike', en: 'bird strike', es: 'choque con un ave',
    body: 'Un ave golpea el avión. Se usa para el hecho y también para el informe.',
    use: 'A bird strike damaged the left wing.' }),
  withSay({ id: 'engine-failure', en: 'engine failure', es: 'falla de motor',
    body: 'Es la misma frase que decís por radio en una emergencia. En el relato va en pasado: *the engine failed*.',
    use: 'The engine failed at two thousand feet.' }),
  withSay({ id: 'runway-excursion', en: 'runway excursion', es: 'salida de pista',
    body: 'El avión se sale de la pista, por el costado o por el final. El verbo de todos los días es *veer off* (irse hacia un costado).',
    use: 'The aircraft veered off the side of the runway.' }),
  withSay({ id: 'hard-landing', en: 'hard landing', es: 'aterrizaje duro',
    body: 'El avión toca la pista con más fuerza de la que debería. Puede dañar el tren de aterrizaje.',
    use: 'The pilot made a hard landing and the nose wheel collapsed.' }),
  withSay({ id: 'out-of-fuel', en: 'ran out of fuel', es: 'se quedó sin combustible',
    body: 'El combustible se agotó antes de llegar. *Run out of* es el verbo para todo lo que se acaba.',
    use: 'The aircraft ran out of fuel and landed in a field.' }),
  withSay({ id: 'fire', en: 'fire on board', es: 'fuego a bordo',
    body: 'Hay fuego o humo dentro del avión. Para avisarlo por radio, el mensaje de emergencia empieza con *MAYDAY*.',
    use: 'Smoke and fire were reported in the cockpit.' }),
  withSay({ id: 'injured', en: 'injured', es: 'herido',
    body: 'Una persona que sufrió una lesión. Se gradúa con *slightly* (levemente) y *seriously* (gravemente).',
    use: 'Two passengers were slightly injured.' }),
  withSay({ id: 'damaged', en: 'damaged', es: 'dañado',
    body: 'Una parte o todo el avión sufrió un daño. Se usa en pasiva: *the propeller was damaged*.',
    use: 'The propeller was damaged.' }),
];

/** Un incidente inventado, en el orden en que pasó. Cada oración usa una de las formas de tenseRules. */
export const incidentStory = [
  withSay({ id: 'p1', text: 'LV-DEM took off from Laguna for a local flight.', form: 'past-simple' }),
  withSay({ id: 'p2', text: 'While the aircraft was climbing through two thousand feet, the engine started to run rough.', form: 'past-continuous' }),
  withSay({ id: 'p3', text: 'The pilot turned back and called Laguna Tower.', form: 'past-simple' }),
  withSay({ id: 'p4', text: 'The tower cleared the aircraft to land on runway one three.', form: 'past-simple' }),
  withSay({ id: 'p5', text: 'The aircraft landed safely.', form: 'past-simple' }),
  withSay({ id: 'p6', text: 'Nobody was injured and the aircraft was not damaged.', form: 'passive' }),
];

/** Las tres formas del relato. example es una oración de incidentStory o muy parecida. */
export const tenseRules = [
  withSay({ id: 'past-simple', title: 'Lo que pasó, en orden',
    name: 'Pasado simple',
    rule: 'Cada hecho es un verbo en pasado, uno detrás del otro: *took off*, *turned*, *called*, *landed*. Los verbos regulares terminan en *-ed*. Muchos de uso frecuente son irregulares: *take* pasa a *took*.',
    use: 'The pilot turned back and called Laguna Tower.' }),
  withSay({ id: 'past-continuous', title: 'Lo que estaba pasando cuando ocurrió otra cosa',
    name: 'Pasado continuo',
    rule: 'Se arma con *was* o *were* y el verbo con *-ing*. Describe lo que estaba en curso (*was climbing*). El hecho puntual que lo interrumpió va en pasado simple (*started*).',
    use: 'While the aircraft was climbing, the engine started to run rough.' }),
  withSay({ id: 'passive', title: 'Qué les pasó al avión y a las personas',
    name: 'Voz pasiva',
    rule: 'Cuando importa el resultado más que quién lo causó, se usa *was* o *were* y el participio: *was damaged*, *was injured*. Es la forma habitual de los informes.',
    use: 'Nobody was injured and the aircraft was not damaged.' }),
];
