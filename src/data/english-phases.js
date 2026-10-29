/**
 * Radio por fase de vuelo: un vuelo de circuito VFR en el aeródromo de práctica Laguna, fase por fase.
 *
 * Fuentes (los textos en español son propios; cada línea sigue un ejemplo de la fuente):
 * - Fraseología de aeródromo: CAP 413 de la CAA británica, ed. 24, cap. 4 (4.9 a 4.68) y los ejemplos
 *   del cap. 11 (figuras 2, 5, 6, 7, 22 y 23).
 * - Lugar del distintivo: CAP 413, 2.49 (la torre lo dice primero; una llamada nueva del piloto
 *   también; la repetición o el acuse terminan con él). SERA.14055 solo exige que la repetición lo lleve.
 * - Qué se repite siempre: SERA.8015 (e).
 * - Uso de EE. UU.: AIM de la FAA, 4-3-3 (tramos del circuito) y 4-3-18 (rodaje y hold short), y el
 *   Glosario Piloto/Controlador.
 *
 * Cada fase: id, mapLabel (el nombre corto del mapa), es, en, summary (qué pasa), listen (qué escuchás y qué respondés), lines y phrases.
 * Cada línea: who ('pilot' | 'tower'), unit (la dependencia, si no es Laguna Tower), text (lo que se
 * lee), say (lo que dice la voz), kind (en el piloto: 'call' si trae algo nuevo o pide, 'readback' si
 * repite o acusa recibo), key (la frase que se resalta) y note.
 * Cada frase: id, en, es, use (un ejemplo), say y body.
 * En summary, listen, note y body, el inglés va entre asteriscos: la página les pone lang="en".
 * Laguna, LV-DEM, el aeroclub y todas las cifras (frecuencias, QNH, pista, viento) son de práctica.
 * Las cifras de say van en palabras; se escribe three, four, five y nine (ver english.js).
 */

const DEM = 'Lima Victor Delta Echo Mike';

/** Lo que lee la voz: el mismo texto, con la matrícula deletreada. */
const spoken = (text) => text.replaceAll('LV-DEM', DEM);

const GROUND = 'Laguna Ground';

const line = (entry) => ({ ...entry, say: spoken(entry.text) });
const phrase = (entry) => ({ ...entry, say: spoken(entry.use) });

const phases = [
  {
    id: 'puesta-en-marcha',
    mapLabel: 'Arranque',
    es: 'Puesta en marcha',
    en: 'Start up',
    summary: 'Antes de poner en marcha el motor, probás la radio con rodaje (*Laguna Ground*) y pedís permiso. Ya escuchaste el ATIS, así que nombrás su letra y el QNH.',
    listen: 'Escuchás *readability five*: te oyen perfecto. Escuchás *start up approved*: podés poner en marcha.',
    lines: [
      { who: 'pilot', kind: 'call', text: 'Laguna Ground, LV-DEM, radio check one two one decimal eight.', key: 'radio check',
        note: 'La primera llamada: primero la dependencia a la que llamás, después vos, y la frecuencia en la que probás.' },
      { who: 'tower', unit: GROUND, text: 'LV-DEM, Laguna Ground, readability five.', key: 'readability five',
        note: 'Te contesta con tu distintivo primero y su nombre después. Cinco es la mejor nota de la escala.' },
      { who: 'pilot', kind: 'call', text: 'LV-DEM, at the flying club, information Alfa, QNH one zero one three, request start up.', key: 'request start up',
        note: 'Pedís algo nuevo: tu distintivo va primero. Decís dónde estás, la letra del ATIS que escuchaste y el QNH.' },
      { who: 'tower', unit: GROUND, text: 'LV-DEM, start up approved.', key: 'start up approved',
        note: 'Podés poner en marcha. Fijate que dice *approved*, no *cleared*.' },
    ],
    phrases: [
      { id: 'radio-check', en: 'radio check', es: 'prueba de radio',
        use: 'Laguna Ground, LV-DEM, radio check one two one decimal eight.',
        body: 'Pedís que te digan cómo se escucha tu transmisión. Llevás la dependencia, tu distintivo, las palabras *radio check* y la frecuencia.' },
      { id: 'readability', en: 'readability five', es: 'te escucho perfecto',
        use: 'LV-DEM, Laguna Ground, readability five.',
        body: 'La respuesta a la prueba de radio usa una escala del uno al cinco: *one* es ilegible y *five*, perfectamente legible.' },
      { id: 'request-start-up', en: 'request start up', es: 'solicito puesta en marcha',
        use: 'LV-DEM, at the flying club, information Alfa, QNH one zero one three, request start up.',
        body: 'Pedís permiso para poner en marcha. En algunos aeródromos se suma dónde estás, la letra del ATIS y el QNH. Con un avión liviano, en muchos aeródromos no se pide permiso: avisás que ponés en marcha o pedís rodaje directamente. Seguí lo que publique el aeródromo.' },
      { id: 'start-up-approved', en: 'start up approved', es: 'puesta en marcha aprobada',
        use: 'LV-DEM, start up approved.',
        body: 'Te dan permiso para poner en marcha. Se dice *approved* (permiso para lo que propusiste) y no *cleared*, que se reserva para las autorizaciones.' },
    ],
  },
  {
    id: 'rodaje',
    mapLabel: 'Rodaje',
    es: 'Rodaje',
    en: 'Taxi',
    summary: 'Pedís rodaje y te dan un límite: el punto de espera de la pista, con el camino para llegar. Hasta ahí podés rodar. De ahí no pasás.',
    listen: 'Escuchás *taxi holding point Alfa one runway one three via taxiway Bravo* y lo repetís entero, con tu distintivo al final. El viento es información: no se repite.',
    lines: [
      { who: 'pilot', kind: 'call', text: 'LV-DEM, request taxi for local VFR flight.', key: 'request taxi',
        note: 'Motor en marcha y listo para moverte: pedís rodaje y decís qué vuelo vas a hacer.' },
      { who: 'tower', unit: GROUND, text: 'LV-DEM, taxi holding point Alfa one runway one three via taxiway Bravo.', key: 'taxi holding point Alfa one',
        note: 'El punto de espera Alfa uno de la pista uno tres es tu límite, y llegás por la calle de rodaje Bravo.' },
      { who: 'pilot', kind: 'readback', text: 'Taxi holding point Alfa one runway one three via taxiway Bravo, request surface wind, LV-DEM.',
        note: 'Repetís el rodaje entero y, en la misma llamada, pedís el viento actual: puede haber cambiado desde el ATIS. Tu distintivo cierra el mensaje.' },
      { who: 'tower', unit: GROUND, text: 'LV-DEM, surface wind one four zero degrees eight knots.', key: 'surface wind',
        note: 'Te dan el viento. Es información: no hace falta repetirlo.' },
    ],
    phrases: [
      { id: 'request-taxi', en: 'request taxi', es: 'solicito rodaje',
        use: 'LV-DEM, request taxi for local VFR flight.',
        body: 'Pedís permiso para rodar y decís qué vuelo vas a hacer: acá, un vuelo local VFR. Si no lo dijiste antes, sumás dónde estás.' },
      { id: 'taxi-holding-point', en: 'taxi holding point', es: 'rodá hasta el punto de espera',
        use: 'LV-DEM, taxi holding point Alfa one runway one three via taxiway Bravo.',
        body: 'El punto de espera es tu límite: ahí parás hasta que te den otra instrucción. La palabra *cleared* no se usa para rodar. En EE. UU. te dan la pista y el camino, sin nombrar el punto de espera: *runway two seven, taxi via Charlie* (AIM 4-3-18).' },
      { id: 'hold-short', en: 'hold short', es: 'detenete antes de',
        use: 'LV-DEM, hold short of runway one three.',
        body: 'Te detenés antes de llegar al lugar que te nombran. En el manual británico (CAP 413) se usa poco: donde no hay un punto de espera marcado o para reforzar tu límite. Se repite siempre y *roger* o *wilco* no alcanzan: contestás *holding short* con la pista y tu distintivo, por ejemplo *holding short of runway one three, LV-DEM*. En EE. UU. es la forma de detenerte antes de una pista, y la repetición lleva *hold short of* y la pista (AIM 4-3-18).' },
      { id: 'surface-wind', en: 'surface wind', es: 'viento en superficie',
        use: 'LV-DEM, surface wind one four zero degrees eight knots.',
        body: 'El viento en la pista: de dónde viene, en grados, y su velocidad, en nudos. Es información y no se repite. Si no lo entendiste, pedís *say again*.' },
    ],
  },
  {
    id: 'punto-de-espera',
    mapLabel: 'Espera',
    es: 'Punto de espera y prueba de motor',
    en: 'Holding point',
    summary: 'En el punto de espera hacés la prueba de motor y los controles antes de despegar. Rodaje te pasa a la frecuencia de la torre (*Laguna Tower*) y, cuando estás listo, la llamás.',
    listen: 'Escuchás *contact Laguna Tower* y la frecuencia, y la repetís. Escuchás *hold position* y contestás *holding*: *wilco* no alcanza.',
    lines: [
      { who: 'tower', unit: GROUND, text: 'LV-DEM, contact Laguna Tower one one eight decimal three.', key: 'contact Laguna Tower',
        note: 'Al llegar al punto de espera, rodaje te pasa a la torre. Rodaje ya le pasó tus datos.' },
      { who: 'pilot', kind: 'readback', text: 'Laguna Tower one one eight decimal three, LV-DEM.',
        note: 'Una frecuencia nueva se repite: la dependencia, la frecuencia y tu distintivo al final.' },
      { who: 'pilot', kind: 'call', text: 'Laguna Tower, LV-DEM, ready for departure.', key: 'ready for departure',
        note: 'Cambiás de frecuencia y hacés la prueba de motor en el punto de espera. Cuando terminás, llamás a la torre: primera llamada, así que va la dependencia y después vos.' },
      { who: 'tower', text: 'LV-DEM, Laguna Tower, hold position, traffic is a Cherokee on final.', key: 'hold position',
        note: 'Hay un avión en final: te quedás donde estás. La torre te dice por qué.' },
      { who: 'pilot', kind: 'readback', text: 'Holding, LV-DEM.',
        note: 'A *hold position* se contesta *holding* y tu distintivo.' },
    ],
    phrases: [
      { id: 'contact', en: 'contact', es: 'comunicate con',
        use: 'LV-DEM, contact Laguna Tower one one eight decimal three.',
        body: 'Te pasan a otra dependencia, que ya tiene tus datos. Repetís la dependencia y la frecuencia: las frecuencias nuevas se repiten siempre.' },
      { id: 'report-ready', en: 'report ready for departure', es: 'avisá cuando estés listo',
        use: 'LV-DEM, report ready for departure.',
        body: 'Muchos aviones hacen la prueba de motor en el punto de espera, así que la torre puede pedirte que avises cuando termines. Contestás *wilco* y después llamás.' },
      { id: 'ready-for-departure', en: 'ready for departure', es: 'listo para salir',
        use: 'Laguna Tower, LV-DEM, ready for departure.',
        body: 'Avisás que estás listo para despegar. Según el manual británico (CAP 413), acá se dice *departure*: la palabra *take-off* se reserva para la autorización de despegue y para cancelarla.' },
      { id: 'hold-position', en: 'hold position', es: 'mantené posición',
        use: 'LV-DEM, hold position.',
        body: 'Te quedás donde estás hasta que te den otra instrucción. Contestás *holding* y tu distintivo, como en los ejemplos del manual británico (CAP 413, 2.69). El mismo manual aclara que *roger* o *wilco* no alcanzan para *hold*, *hold position* ni *hold short*.' },
    ],
  },
  {
    id: 'despegue',
    mapLabel: 'Despegue',
    es: 'Despegue',
    en: 'Take-off',
    summary: 'Entrar a la pista y despegar son dos pasos distintos: primero te alineás y esperás. Después llega la autorización de despegue.',
    listen: 'Escuchás *runway one three, line up and wait* y *runway one three, cleared for take-off*. Las dos se repiten enteras, con la pista y tu distintivo al final.',
    lines: [
      { who: 'tower', text: 'LV-DEM, runway one three, line up and wait.', key: 'line up and wait',
        note: 'El Cherokee aterrizó, pero todavía está en la pista. Te dejan entrar y alinearte, no despegar.' },
      { who: 'pilot', kind: 'readback', text: 'Runway one three, line up and wait, LV-DEM.',
        note: 'Una instrucción para entrar a la pista se repite siempre, con el número de pista.' },
      { who: 'tower', text: 'LV-DEM, runway one three, cleared for take-off.', key: 'cleared for take-off',
        note: 'La pista quedó libre. La torre nombra la pista antes de la autorización.' },
      { who: 'pilot', kind: 'readback', text: 'Runway one three, cleared for take-off, LV-DEM.',
        note: 'La autorización de despegue se repite con la pista. Recién ahora despegás.' },
    ],
    phrases: [
      { id: 'line-up-and-wait', en: 'line up and wait', es: 'alineate y esperá',
        use: 'LV-DEM, runway one three, line up and wait.',
        body: 'Entrás a la pista, te alineás y esperás. No es una autorización de despegue. En EE. UU. se usa la misma frase (Glosario Piloto/Controlador de la FAA).' },
      { id: 'cleared-for-take-off', en: 'cleared for take-off', es: 'autorizado a despegar',
        use: 'LV-DEM, runway one three, cleared for take-off.',
        body: 'Te autorizan a despegar. Va en un mensaje aparte de cualquier otra autorización y se repite con la pista.' },
      { id: 'runway-first', en: 'runway one three', es: 'pista uno tres',
        use: 'Runway one three, cleared for take-off, LV-DEM.',
        body: 'Toda instrucción para usar una pista lleva su número, y la torre lo dice antes de la autorización. Cuando repetís, el número también va, para que el controlador compruebe que entendiste la pista correcta.' },
    ],
  },
  {
    id: 'ascenso',
    mapLabel: 'Ascenso',
    es: 'Ascenso',
    en: 'Upwind',
    summary: 'Ya en el aire, subís derecho por la prolongación de la pista (*upwind*) y después virás al tramo perpendicular (*crosswind*) y a la inicial (*downwind*). La torre te pide avisos y te pasa el tránsito.',
    listen: 'Escuchás *report downwind* y contestás *wilco*. Escuchás *traffic is…* y, cuando lo ves, contestás *traffic in sight*.',
    lines: [
      { who: 'tower', text: 'LV-DEM, report downwind.', key: 'report downwind',
        note: 'Después del despegue, la torre te pide que avises al llegar a la inicial.' },
      { who: 'pilot', kind: 'readback', text: 'Wilco, LV-DEM.',
        note: 'Entendiste y lo vas a hacer: *wilco*.' },
      { who: 'tower', text: 'LV-DEM, traffic is a Tomahawk late downwind.', key: 'traffic is a Tomahawk',
        note: 'Te pasa el tránsito: qué avión es y dónde está. Va al final de la inicial, adelante tuyo.' },
      { who: 'pilot', kind: 'readback', text: 'Traffic in sight, LV-DEM.',
        note: 'Lo encontraste: lo avisás.' },
    ],
    phrases: [
      { id: 'upwind', en: 'upwind', es: 'tramo de ascenso',
        use: 'LV-DEM, traffic is a Cherokee upwind.',
        body: 'El tramo recto por la prolongación de la pista, después del despegue. Después viene el tramo perpendicular (*crosswind*) y la inicial (*downwind*). En el AIM de la FAA (4-3-3), la subida recta justo después del despegue se llama *departure* y *upwind* es su continuación sobre la misma línea. El manual británico (CAP 413) usa *upwind* para un avión en ese tramo.' },
      { id: 'report-downwind', en: 'report downwind', es: 'avisá en la inicial',
        use: 'LV-DEM, report downwind.',
        body: 'Te piden que avises cuando llegues a la inicial. Contestás *wilco* y, al llegar, llamás.' },
      { id: 'traffic', en: 'traffic is…', es: 'tenés tránsito',
        use: 'LV-DEM, traffic is a Tomahawk late downwind.',
        body: 'La torre te avisa de otro avión: qué tipo es y dónde está. Si lo ves, contestás *traffic in sight*. Si todavía no lo ves, contestás *roger* y avisás cuando lo veas (CAP 413, 4.45).' },
      { id: 'traffic-in-sight', en: 'traffic in sight', es: 'tránsito a la vista',
        use: 'Traffic in sight, LV-DEM.',
        body: 'Ves el avión que te nombraron. Es tu respuesta a un aviso de tránsito, así que tu distintivo va al final.' },
    ],
  },
  {
    id: 'circuito',
    mapLabel: 'Circuito',
    es: 'Circuito: inicial, base y final',
    en: 'Circuit',
    summary: 'En la inicial (*downwind*) avisás tu posición. La torre te da tu número en la secuencia y a quién seguir, y te pide que avises en final.',
    listen: 'Escuchás *number two, follow the Tomahawk on base* y contestás con tu número y si lo ves. Escuchás *report final* y contestás *wilco*.',
    lines: [
      { who: 'pilot', kind: 'call', text: 'LV-DEM, downwind.', key: 'downwind',
        note: 'Llegaste a la inicial y avisás. Es información nueva: tu distintivo va primero.' },
      { who: 'tower', text: 'LV-DEM, number two, follow the Tomahawk on base.', key: 'number two',
        note: 'Sos el segundo para aterrizar. El primero es el Tomahawk, que está en básica.' },
      { who: 'pilot', kind: 'readback', text: 'Number two, Tomahawk in sight, LV-DEM.',
        note: 'Repetís tu número y avisás que ves al avión que tenés que seguir.' },
      { who: 'tower', text: 'LV-DEM, report final.', key: 'report final',
        note: 'Te piden que avises al entrar en final.' },
      { who: 'pilot', kind: 'readback', text: 'Wilco, LV-DEM.' },
    ],
    phrases: [
      { id: 'downwind', en: 'downwind', es: 'inicial',
        use: 'LV-DEM, downwind.',
        body: 'En español de Argentina el tramo se llama «inicial». En inglés es *downwind*. La palabra inglesa *initial* suele referirse a otra cosa (por ejemplo, la aproximación inicial), así que no la uses para el circuito.' },
      { id: 'late-downwind', en: 'late downwind', es: 'al final de la inicial',
        use: 'LV-DEM, late downwind.',
        body: 'Estás en la inicial pero ya pasaste el extremo de la pista y no habías podido avisar antes.' },
      { id: 'base', en: 'base', es: 'básica',
        use: 'LV-DEM, base.',
        body: 'El tramo perpendicular a la pista antes de la final. Según el manual británico (CAP 413), lo avisás solo si te lo piden (*report base*) o si lo exige el aeródromo.' },
      { id: 'number-two', en: 'number two', es: 'sos el número dos',
        use: 'LV-DEM, number two, follow the Tomahawk on base.',
        body: 'Tu lugar en la secuencia para aterrizar, con el avión que va adelante. Repetís el número y, si lo ves, lo decís.' },
    ],
  },
  {
    id: 'aterrizaje',
    mapLabel: 'Aterrizaje',
    es: 'Aterrizaje y pista libre',
    en: 'Landing',
    summary: 'En final avisás y esperás la autorización de aterrizaje. Después de la carrera, la torre te dice por dónde dejar la pista.',
    listen: 'Escuchás *runway one three, cleared to land* y lo repetís con la pista. Escuchás *vacate left* y lo repetís.',
    lines: [
      { who: 'pilot', kind: 'call', text: 'LV-DEM, final.', key: 'final',
        note: 'Viraste a final y avisás, como te pidieron.' },
      { who: 'tower', text: 'LV-DEM, runway one three, cleared to land, surface wind one four zero degrees eight knots.', key: 'cleared to land',
        note: 'El Tomahawk ya dejó la pista: te autorizan a aterrizar y te dan el viento.' },
      { who: 'pilot', kind: 'readback', text: 'Runway one three, cleared to land, LV-DEM.',
        note: 'Repetís la pista y la autorización. El viento no se repite.' },
      { who: 'tower', text: 'LV-DEM, vacate left.', key: 'vacate left',
        note: 'Terminaste la carrera de aterrizaje. Te indican que dejes la pista hacia la izquierda.' },
      { who: 'pilot', kind: 'readback', text: 'Vacate left, LV-DEM.' },
    ],
    phrases: [
      { id: 'final', en: 'final', es: 'final',
        use: 'LV-DEM, final.',
        body: 'Avisás que viraste a final. Ahí la torre da la autorización de aterrizaje.' },
      { id: 'cleared-to-land', en: 'cleared to land', es: 'autorizado a aterrizar',
        use: 'LV-DEM, runway one three, cleared to land.',
        body: 'Te autorizan a aterrizar en esa pista. Se repite con el número de pista. Sin esta autorización no aterrizás: seguís la aproximación o hacés *go around*.' },
      { id: 'continue-approach', en: 'continue approach', es: 'continuá la aproximación',
        use: 'LV-DEM, continue approach.',
        body: 'La pista todavía no está libre: seguís la aproximación, pero no estás autorizado a aterrizar. Esperás el *cleared to land* o hacés *go around*.' },
      { id: 'vacate', en: 'vacate', es: 'dejá la pista',
        use: 'LV-DEM, vacate left.',
        body: 'Salís de la pista por donde te dicen. En la fraseología británica (CAP 413) se dice *vacate*, no *clear*, para dejar la pista. En EE. UU. el AIM habla de quedar *clear of the runway* (AIM 4-3-21).' },
    ],
  },
  {
    id: 'estacionamiento',
    mapLabel: 'Estacionar',
    es: 'Estacionamiento',
    en: 'After landing',
    summary: 'Cuando dejás la pista, volvés a la frecuencia de rodaje y rodás hasta el aeroclub. El manual británico no trae una llamada para cuando apagás el motor: por eso el diálogo termina con el rodaje.',
    listen: 'Escuchás *when vacated contact Ground* y la frecuencia, y la repetís. Escuchás *taxi to the flying club via taxiway Bravo* y lo repetís.',
    lines: [
      { who: 'tower', text: 'LV-DEM, when vacated contact Ground one two one decimal eight.', key: 'when vacated contact Ground',
        note: 'Primero dejás la pista. Recién después cambiás de frecuencia.' },
      { who: 'pilot', kind: 'readback', text: 'When vacated Ground one two one decimal eight, LV-DEM.' },
      { who: 'pilot', kind: 'call', text: 'Laguna Ground, LV-DEM, runway vacated.', key: 'runway vacated',
        note: 'Ya fuera de la pista, cambiás de frecuencia y llamás a rodaje: primera llamada, así que va la dependencia y después vos.' },
      { who: 'tower', unit: GROUND, text: 'LV-DEM, Laguna Ground, taxi to the flying club via taxiway Bravo.', key: 'taxi to the flying club',
        note: 'Te dan el camino hasta el aeroclub.' },
      { who: 'pilot', kind: 'readback', text: 'Taxi to the flying club via taxiway Bravo, LV-DEM.' },
    ],
    phrases: [
      { id: 'when-vacated', en: 'when vacated', es: 'cuando dejes la pista',
        use: 'LV-DEM, when vacated contact Ground one two one decimal eight.',
        body: 'La instrucción vale recién cuando dejaste la pista. Mientras sigas en ella, te quedás en la frecuencia de la torre.' },
      { id: 'runway-vacated', en: 'runway vacated', es: 'pista libre',
        use: 'Laguna Ground, LV-DEM, runway vacated.',
        body: 'Avisás que ya dejaste la pista. El manual británico (CAP 413) dice *vacated*, no *clear*.' },
      { id: 'taxi-to', en: 'taxi to the flying club', es: 'rodá hasta el aeroclub',
        use: 'LV-DEM, Laguna Ground, taxi to the flying club via taxiway Bravo.',
        body: 'El rodaje de vuelta, hasta el lugar donde estacionás. Lo repetís como cualquier instrucción de rodaje.' },
    ],
  },
];

export const radioPhases = phases.map((phase) => ({
  ...phase,
  lines: phase.lines.map(line),
  phrases: phase.phrases.map(phrase),
}));
