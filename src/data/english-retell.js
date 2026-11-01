/**
 * Resumir una noticia: la parte del examen en la que mirás un video de un hecho real y contás qué
 * pasó. Cómo se arma el resumen, las palabras para nombrar el hecho, los tiempos del relato y
 * noticias reales de YouTube para practicar.
 *
 * Fuentes (los textos en español son propios):
 * - El orden del resumen (rótulo, quién, cuándo y dónde, problema, decisión, resultado y datos) es
 *   el que enseña el curso E4A para el examen de la OACI.
 * - Accidente e incidente siguen el Anexo 13 de la OACI, en palabras propias. Una muerte o lesión
 *   por causas naturales no hace que el hecho sea un accidente.
 * - Los resúmenes modelo se arman con lo que publicaron sobre cada hecho las notas de prensa que
 *   figuran en source, no con el audio del video. Pueden no coincidir palabra por palabra con lo que
 *   dice el periodista: verificalos con el video antes de darlos por buenos.
 *
 * En body y note, el inglés va entre asteriscos: la página les pone lang="en".
 * Las cifras de say van en palabras; se escribe three, four, five y nine (ver english.js).
 */

const withSay = (entry) => ({ ...entry, say: entry.say ?? entry.use ?? entry.en });

/** Las piezas del resumen, en el orden en que se dicen. frame es cómo suele empezar la oración. */
export const summaryPieces = [
  { id: 'label', es: 'Qué fue', en: 'Label', body: 'Accidente, incidente grave o incidente. Si no estás seguro, decí por qué dudás.', frame: 'This was an incident.' },
  { id: 'who', es: 'Quién', en: 'Who', body: 'La empresa, el vuelo, el avión, de dónde a dónde.', frame: 'It involved a Boeing 737 flying from Chicago to Boston.' },
  { id: 'when', es: 'Cuándo y dónde', en: 'When and where', body: 'La fecha o la fase del vuelo y el lugar.', frame: 'It happened in July, during the takeoff run.' },
  { id: 'problem', es: 'Qué pasó', en: 'Problem', body: 'El problema, en pasado.', frame: 'While the aircraft was taking off, the right engine caught fire.' },
  { id: 'decision', es: 'Qué decidieron', en: 'Decision', body: 'Qué hizo la tripulación o el control.', frame: 'The pilot rejected the takeoff.' },
  { id: 'result', es: 'Cómo terminó', en: 'Result', body: 'Cómo terminó y si hubo heridos o daños.', frame: 'The aircraft stopped safely and nobody was injured.' },
  { id: 'info', es: 'Datos', en: 'Extra information', body: 'Personas a bordo y lo que dijeron los testigos.', frame: 'There were 143 passengers on board.' },
].map((piece) => ({ ...piece, say: piece.frame }));

/** Accidente, incidente grave e incidente. De la más grave a la menos grave. */
export const eventKinds = [
  withSay({ id: 'accident', en: 'accident', es: 'accidente',
    body: 'Alguien muere o queda gravemente herido, el avión sufre un daño estructural grande, o desaparece. Si la causa es natural, como un infarto, no cuenta.',
    use: 'The aircraft was destroyed and the pilot was seriously injured.' }),
  withSay({ id: 'serious-incident', en: 'serious incident', es: 'incidente grave',
    body: 'Casi fue un accidente. No hubo heridos graves ni daños mayores, pero estuvo cerca.',
    use: 'The two aircraft nearly collided on the runway.' }),
  withSay({ id: 'incident', en: 'incident', es: 'incidente',
    body: 'Cualquier otro hecho que afecta o podría afectar la seguridad.',
    use: 'A bird hit the aircraft, but there was no damage.' }),
];

/** Las palabras para nombrar qué pasó. */
export const eventLabels = [
  withSay({ id: 'runway-incursion', en: 'runway incursion', es: 'algo entra a la pista sin autorización' }),
  withSay({ id: 'runway-excursion', en: 'runway excursion', es: 'el avión se sale de la pista' }),
  withSay({ id: 'near-miss', en: 'near miss', es: 'dos aviones casi chocan' }),
  withSay({ id: 'bird-strike', en: 'bird strike', es: 'choque con un ave' }),
  withSay({ id: 'engine-failure', en: 'engine failure', es: 'falla de motor' }),
  withSay({ id: 'engine-fire', en: 'engine fire', es: 'fuego en un motor' }),
  withSay({ id: 'rejected-takeoff', en: 'rejected takeoff', es: 'despegue abortado' }),
  withSay({ id: 'belly-landing', en: 'belly landing', es: 'aterrizaje sin tren' }),
  withSay({ id: 'pilot-incapacitation', en: 'pilot incapacitation', es: 'un piloto queda incapacitado' }),
  withSay({ id: 'medical-emergency', en: 'medical emergency', es: 'emergencia médica a bordo' }),
  withSay({ id: 'severe-turbulence', en: 'severe turbulence', es: 'turbulencia fuerte' }),
  withSay({ id: 'unruly-passenger', en: 'unruly passenger', es: 'pasajero violento o que no obedece' }),
];

/** Verbos del relato que se confunden. */
export const eventVerbs = [
  withSay({ id: 'divert', en: 'divert', es: 'ir a otro aeropuerto', use: 'The crew diverted to Denver.' }),
  withSay({ id: 'deviate', en: 'deviate', es: 'cambiar la ruta, por ejemplo por el tiempo', use: 'The aircraft deviated around the storm.' }),
  withSay({ id: 'evacuate', en: 'evacuate', es: 'hacer bajar a todos rápido', use: 'The passengers evacuated using the slides.' }),
  withSay({ id: 'restrain', en: 'restrain', es: 'sujetar a alguien', use: 'Two passengers restrained the man.' }),
];

/** Las tres formas del relato. */
export const tenseRules = [
  withSay({ id: 'past-simple', name: 'Pasado simple', title: 'Los hechos, en orden',
    rule: 'Un verbo en pasado detrás del otro: *took off*, *diverted*, *landed*.',
    use: 'The crew diverted to Denver and landed safely.' }),
  withSay({ id: 'past-continuous', name: 'Pasado continuo', title: 'Lo que estaba pasando',
    rule: '*Was* o *were* y el verbo con *-ing*. Lo que lo interrumpió va en pasado simple, con *while* o *when*.',
    use: 'While the aircraft was taking off, the engine caught fire.' }),
  withSay({ id: 'passive', name: 'Voz pasiva', title: 'Qué les pasó',
    rule: '*Was* o *were* y el participio, cuando importa el resultado: *was injured*, *was damaged*.',
    use: 'Nobody was injured and the aircraft was not damaged.' }),
];

/**
 * Noticias reales para practicar. id es el del video de YouTube; course, true si la dio el curso.
 * summary sigue el orden de summaryPieces: [id de la pieza, oración]. source dice de dónde salen
 * los datos del resumen.
 */
export const newsVideos = [
  {
    id: 'oG-C0coLTVQ',
    outlet: 'CNN',
    year: '2015',
    course: true,
    summary: [
      ['label', 'This was an incident, not an accident, because the captain died of natural causes.'],
      ['who', 'It involved American Airlines flight 550, an Airbus A320 flying from Phoenix to Boston.'],
      ['when', 'It happened in October 2015, during the flight.'],
      ['problem', 'While the aircraft was flying to Boston, the captain became ill.'],
      ['decision', 'The first officer took control and diverted to Syracuse, in New York.'],
      ['result', 'The first officer landed the aircraft safely, but the captain died.'],
      ['info', 'There were 147 passengers and five crew members on board. A new crew flew the passengers to Boston.'],
    ],
    source: 'CBS News y el informe del médico forense, octubre de 2015.',
  },
  {
    id: 'cULRV0OeN_I',
    outlet: 'Associated Press',
    year: '2010',
    course: true,
    summary: [
      ['label', 'This was an incident.'],
      ['who', 'It involved United Airlines flight 223, flying from Washington to Las Vegas.'],
      ['when', 'It happened in January 2010, during the flight.'],
      ['problem', 'A passenger tried to open an exterior door while the aircraft was in flight.'],
      ['decision', 'Other passengers restrained him, and the crew diverted to Denver.'],
      ['result', 'The aircraft landed safely in Denver, and the passenger was arrested.'],
      ['info', 'There were more than 100 people on board. Later, the flight continued to Las Vegas.'],
    ],
    source: 'Associated Press y el comunicado del FBI de Denver, enero de 2010.',
  },
  {
    id: 'T3u5XAhmEvo',
    outlet: 'NBC News',
    year: '2026',
    summary: [
      ['label', 'This was a serious incident, because two aircraft nearly collided on the runway.'],
      ['who', 'It involved a Southwest Boeing 737 and a private Pilatus PC-12.'],
      ['when', 'It happened in January 2026, at San Antonio International Airport, in Texas.'],
      ['problem', 'While the 737 was accelerating for takeoff, the PC-12 entered the same runway without a clearance.'],
      ['decision', 'The controller cancelled the takeoff clearance, and the crew rejected the takeoff.'],
      ['result', 'The 737 stopped in time, using maximum braking and reverse thrust.'],
      ['info', 'Later, the flight departed for Dallas without any problems.'],
    ],
    source: 'NBC News, ABC News y AeroXplorer, enero de 2026.',
  },
  {
    id: 'vEXuJSLwp6g',
    outlet: 'CBS Boston',
    year: '2015',
    summary: [
      ['label', 'This was an incident.'],
      ['who', 'It involved a Southwest flight from Chicago Midway to Boston.'],
      ['when', 'It happened in July 2015, at night, during the takeoff run.'],
      ['problem', 'While the aircraft was taking off, the right engine caught fire.'],
      ['decision', 'The pilot rejected the takeoff and stopped the aircraft.'],
      ['result', 'The passengers left the aircraft by the stairs and went back to the terminal. Nobody was injured.'],
      ['info', 'There were 143 passengers on board. Another aircraft flew them to Boston the next morning.'],
    ],
    source: 'CBS Chicago, CBS Boston y Fox Business, julio de 2015.',
  },
  {
    id: 'NUcWNTvcFY0',
    outlet: 'ABC News',
    year: '2024',
    summary: [
      ['label', 'If any passenger was seriously injured, this was an accident.'],
      ['who', 'It involved Air Europa flight 45, a Boeing 787 flying from Madrid to Montevideo.'],
      ['when', 'It happened in July 2024, over the Atlantic Ocean, near the coast of Brazil.'],
      ['problem', 'The aircraft flew into severe turbulence, and some passengers were thrown into the air.'],
      ['decision', 'The crew diverted to Natal, in Brazil, and made an emergency landing.'],
      ['result', 'About 30 passengers were injured, with cuts, bruises and head injuries.'],
      ['info', 'There were 325 passengers on board. The airline sent another aircraft to take them to Montevideo.'],
    ],
    source: 'ABC News, NBC News y Swissinfo, julio de 2024. Las cifras de heridos cambian según la nota.',
  },
].map((video) => ({ ...video, summary: video.summary.map(([piece, text]) => ({ piece, text })) }));
