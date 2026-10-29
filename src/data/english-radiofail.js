/**
 * Falla de comunicaciones: qué hacer y qué decir cuando la radio no funciona, y las señales luminosas
 * de la torre.
 *
 * Fuentes (los textos en español son propios):
 * - Transmitir a ciegas: SERA.14085 (Reglamento (UE) 923/2012). Sin contacto en ningún canal, el
 *   mensaje se transmite dos veces, precedido de "TRANSMITTING BLIND". Con el receptor fallado, cada
 *   llamada se abre con "TRANSMITTING BLIND DUE TO RECEIVER FAILURE", se transmite el mensaje y se
 *   repite completo, se avisa la hora de la próxima transmisión y, si hay servicio de tránsito aéreo,
 *   la intención del piloto al mando.
 * - Señales luminosas del control de aeródromo y cómo se acusa recibo: SERA, Apéndice 1 (la tabla
 *   del Anexo 2 de la OACI).
 * - Código 7600 = falla de comunicaciones: SERA.13005 (a), igual que en el módulo de emergencias.
 * - Qué hacer en un vuelo VMC (seguir en VMC, aterrizar en el aeródromo adecuado más próximo y avisar
 *   la llegada por el medio más rápido) es la regla general de la OACI. Cada país puede agregar
 *   detalles y la Unión Europea cambió sus pasos en 2025: la página manda a la AIP de cada país.
 *
 * En body y note, el inglés va entre asteriscos: la página les pone lang="en".
 * Laguna, LV-DEM y todas las cifras (distancias, alturas, horas) son de práctica. Las cifras de say
 * van en palabras; se escribe three, four, five y nine (ver english.js).
 */

const DEM = 'Lima Victor Delta Echo Mike';

/** Lo que lee la voz: el mismo texto, con la matrícula deletreada. */
const spoken = (text) => text.replaceAll('LV-DEM', DEM);

/** Los pasos, en el orden en que se hacen. */
export const failSteps = [
  { id: 'fly', title: 'Seguí volando',
    body: 'Primero el avión: mantené el control, la altura y el rumbo. La radio puede esperar unos segundos.' },
  { id: 'code', title: 'Poné 7600 en el transpondedor',
    body: 'El código 7600 le dice al controlador que perdiste las comunicaciones (SERA.13005). Si el transpondedor funciona, el controlador lo ve en su pantalla.' },
  { id: 'blind', title: 'Transmití a ciegas',
    body: 'Que no te contesten no quiere decir que no te escuchen. Seguís informando lo que vas a hacer, con las frases de abajo, en la frecuencia que estabas usando.' },
  { id: 'land', title: 'Si volás en condiciones visuales, aterrizá',
    body: 'La regla general de la OACI para un vuelo en VMC es seguir en VMC, aterrizar en el aeródromo adecuado más cercano y avisar la llegada por el medio más rápido. Cada país puede agregar detalles: seguí lo que publique la AIP y lo que te enseñe tu instructor.' },
];

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
    when: 'Probaste el canal asignado, el anterior y otro adecuado, y no podés hablar con ninguna dependencia ni con otro avión.',
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
    when: 'Nadie te va a contestar, pero te pueden escuchar. Cada llamada va en la hora o el punto que correspondían y se abre con esta frase.',
    parts: [
      { label: 'Frase de apertura', text: 'Transmitting blind due to receiver failure.' },
      { label: 'El mensaje', text: MESSAGE },
      { label: 'El mensaje completo, otra vez', text: MESSAGE },
      { label: 'Cuándo volvés a transmitir', text: 'Next transmission at one zero four five.' },
    ],
  }),
];

/** Las cinco luces del control de aeródromo. flash: se ve como destellos; air y ground, qué significa en cada caso. */
export const lightSignals = [
  { id: 'green-steady', label: 'Verde fijo', color: 'green', flash: false,
    air: 'Autorizado a aterrizar.',
    ground: 'Autorizado a despegar.' },
  { id: 'green-flash', label: 'Destellos verdes', color: 'green', flash: true,
    air: 'Volvé para aterrizar. La autorización para aterrizar y para rodar llega después.',
    ground: 'Autorizado a rodar.' },
  { id: 'red-steady', label: 'Rojo fijo', color: 'red', flash: false,
    air: 'Cedé el paso a otros aviones y seguí en circuito.',
    ground: 'Detenete.' },
  { id: 'red-flash', label: 'Destellos rojos', color: 'red', flash: true,
    air: 'Aeródromo inseguro: no aterrices.',
    ground: 'Salí de la zona de aterrizaje en uso.' },
  { id: 'white-flash', label: 'Destellos blancos', color: 'white', flash: true,
    air: 'Aterrizá en este aeródromo y andá a la plataforma. Las autorizaciones llegan después.',
    ground: 'Volvé al punto de partida en el aeródromo.' },
];

/** Cómo acusás recibo de una señal luminosa. */
export const lightAcks = [
  { id: 'air-day', where: 'En vuelo, de día', how: 'Balanceá las alas. No lo hagas en el tramo de base ni en final.' },
  { id: 'air-night', where: 'En vuelo, de noche', how: 'Encendé y apagá dos veces el faro de aterrizaje. Si no tenés, las luces de navegación.' },
  { id: 'ground-day', where: 'En tierra, de día', how: 'Mové los alerones o el timón de dirección.' },
  { id: 'ground-night', where: 'En tierra, de noche', how: 'Encendé y apagá dos veces el faro de aterrizaje. Si no tenés, las luces de navegación.' },
];
