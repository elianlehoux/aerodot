/**
 * Falla de comunicaciones: qué se dice por radio cuando la radio no funciona del todo. El
 * procedimiento (el orden de los pasos, el 7600 y las señales luminosas de la torre) está en la
 * biblioteca, en Procedimientos y emergencias.
 *
 * Fuentes (los textos en español son propios):
 * - Transmitir a ciegas: SERA.14085 (Reglamento (UE) 923/2012) y CAP 413 de la CAA británica,
 *   ed. 24, 2.88. Sin contacto en ningún canal, el mensaje se transmite dos veces, precedido de
 *   "TRANSMITTING BLIND". Con el receptor fallado, cada llamada se abre con "TRANSMITTING BLIND DUE
 *   TO RECEIVER FAILURE", se transmite el mensaje y se repite completo, se avisa la hora de la
 *   próxima transmisión y, si hay servicio de tránsito aéreo, la intención del piloto al mando.
 * - Si el control te prueba: CAP 413, 5.36 y 8.19, con el formato de la OACI (Doc 4444, cap. 12)
 *   que reproduce también la AC91-9 de Nueva Zelanda, 6.6: "REPLY NOT RECEIVED, IF YOU READ
 *   (maniobra o SQUAWK IDENT)" y después "(maniobra o SQUAWK) OBSERVED ... WILL CONTINUE TO PASS
 *   INSTRUCTIONS". Contestás con el transpondedor o con la maniobra, no con la voz.
 * - Pedir un relevo: CAP 413, 2.88 (si no hay contacto, intentar con otras aeronaves) y 2.98 (usar
 *   cualquier medio de relevo). Para pedirlo no hay una frase única: la llamada usa uso habitual y
 *   así se rotula. Lo fijo es cómo se pasa el mensaje de la dependencia, "(dependencia) CLEARS" o
 *   "(dependencia) ADVISES" (CAP 413, frases de aeródromo), y que la autorización recibida por
 *   relevo se colaciona completa (CAP 413; AC91-9, 4.12.3). "ALL STATIONS" es para un aviso que
 *   no espera respuesta (CAP 413), así que no sirve para pedir ayuda.
 *
 * Cada línea de diálogo: who ('pilot' | 'tower' | 'other'), unit (quién habla, si no sos vos),
 * text, say, kind ('call' | 'readback' | 'action'), key (la frase que se resalta) y note. En una
 * línea action no se habla: text describe en español lo que hacés, y no lleva say.
 * En when y note, el inglés va entre asteriscos: la página les pone lang="en".
 * Laguna, LV-DEM, LV-KTR y todas las cifras (distancias, alturas, horas, rumbos, QNH) son de
 * práctica. Las cifras de say van en palabras; se escribe three, four, five y nine (ver english.js).
 */

const DEM = 'Lima Victor Delta Echo Mike';
const KTR = 'Lima Victor Kilo Tango Romeo';

/** Lo que lee la voz: el mismo texto, con las matrículas deletreadas. */
const spoken = (text) => text.replaceAll('LV-DEM', DEM).replaceAll('LV-KTR', KTR);

const line = (entry) => (entry.kind === 'action' ? entry : { ...entry, say: spoken(entry.text) });

/**
 * Los dos mensajes a ciegas. Cada parte: label (qué es) y text (lo que se dice). say lee todo seguido.
 * El mensaje va dos veces: la norma pide "transmitir el mensaje dos veces" sin contacto, y en la falla
 * de receptor, "repetirlo completo".
 */
const MESSAGE = 'Laguna Tower, LV-DEM, five miles south, two thousand feet, intend to land at Laguna.';

const blindMessage = (entry) => ({ ...entry, say: spoken(entry.parts.map((part) => part.text).join(' ')) });

export const blindMessages = [
  blindMessage({
    id: 'no-contact',
    en: 'Transmitting blind',
    es: 'No lográs contacto por ningún canal',
    when: 'El mensaje va dos veces.',
    parts: [
      { label: 'Frase de apertura', text: 'Transmitting blind.' },
      { label: 'El mensaje', text: MESSAGE },
      { label: 'El mismo mensaje, otra vez', text: MESSAGE },
    ],
  }),
  blindMessage({
    id: 'receiver',
    en: 'Transmitting blind due to receiver failure',
    es: 'Tu receptor no funciona, pero tu transmisor sí',
    when: 'El mensaje va dos veces y avisás la próxima llamada.',
    parts: [
      { label: 'Frase de apertura', text: 'Transmitting blind due to receiver failure.' },
      { label: 'El mensaje', text: MESSAGE },
      { label: 'El mensaje completo, otra vez', text: MESSAGE },
      { label: 'Cuándo volvés a transmitir', text: 'Next transmission at one zero four five.' },
    ],
  }),
];

/**
 * Si el control te prueba: el controlador sospecha que lo escuchás pero no podés transmitir, y te
 * pide una respuesta que vea en el radar. Dos variantes: con el transpondedor y con un viraje.
 */
export const controlChecks = [
  {
    id: 'ident',
    title: 'Te piden el IDENT',
    call: [
      line({ who: 'tower', unit: 'Laguna Approach', text: 'LV-DEM, reply not received. If you read, squawk ident.', key: 'reply not received' }),
      line({ who: 'pilot', kind: 'action', text: 'Apretás IDENT. No hablás.' }),
      line({ who: 'tower', unit: 'Laguna Approach', text: 'LV-DEM, squawk observed. I will continue to pass instructions.', key: 'squawk observed' }),
    ],
  },
  {
    id: 'turn',
    title: 'Te piden un viraje',
    call: [
      line({ who: 'tower', unit: 'Laguna Approach', text: 'LV-DEM, reply not received. If you read, turn left heading zero four zero. I say again, turn left heading zero four zero.', key: 'If you read' }),
      line({ who: 'pilot', kind: 'action', text: 'Virás a la izquierda, rumbo 040. No hablás.' }),
      line({ who: 'tower', unit: 'Laguna Approach', text: 'LV-DEM, turn observed, five miles south of Laguna. I will continue to pass instructions.', key: 'turn observed' }),
    ],
  },
];

/** Las palabras clave de la prueba del control. */
export const checkWords = [
  { en: 'reply not received', es: 'no recibí tu respuesta' },
  { en: 'if you read', es: 'si me escuchás' },
  { en: 'squawk ident', es: 'apretá IDENT en el transpondedor' },
  { en: 'observed', es: 'lo vi en el radar' },
  { en: 'I will continue to pass instructions', es: 'sigo dándote instrucciones' },
];

/**
 * Pedir un relevo: la torre no te escucha (estás lejos o bajo), pero otro avión sí. La primera
 * llamada no tiene frase fija; el resto sigue el formato de CAP 413.
 */
export const relayCall = [
  line({ who: 'pilot', kind: 'call', text: 'Any aircraft, LV-DEM, unable to contact Laguna Tower, request relay.', key: 'request relay',
    note: 'No uses *all stations*: no espera respuesta.' }),
  line({ who: 'other', unit: 'LV-KTR', text: 'LV-DEM, LV-KTR, go ahead.' }),
  line({ who: 'pilot', kind: 'call', text: 'LV-DEM, five miles south, two thousand feet, intend to land at Laguna. Please pass to Laguna Tower.', key: 'Please pass to Laguna Tower', }),
  line({ who: 'other', unit: 'LV-KTR', text: 'LV-DEM, Laguna Tower clears you to join left downwind runway one eight, QNH one zero one three.', key: 'Laguna Tower clears',
    note: '*Clears* si es una autorización, *advises* si es información.' }),
  line({ who: 'pilot', kind: 'readback', text: 'Join left downwind runway one eight, QNH one zero one three, LV-DEM.', key: 'Join left downwind runway one eight' }),
];
