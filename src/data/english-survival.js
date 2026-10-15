/**
 * Frases de supervivencia: las palabras normalizadas de la radio para cuando algo no sale bien.
 *
 * Los significados siguen la tabla de palabras y frases normalizadas de la OACI
 * (Anexo 10, Vol. II, cap. 5; Doc 4444, cap. 12) y, para el uso de EE. UU., el Glosario
 * Piloto/Controlador de la FAA. Los textos en español son propios.
 * En body, lede y note, las palabras en inglés van entre asteriscos: la página les pone lang="en".
 * Cada frase: en (cómo se escribe), es (su nombre en español), say (lo que lee la voz, sin
 * cifras), body (qué significa y cuándo se usa) y use (un ejemplo corto en contexto).
 * Opcionales: tag (una etiqueta, por ejemplo la de lenguaje claro: no está en la tabla de palabras
 * normalizadas) y link ({ href, text }, un enlace al pie de la explicación).
 * Laguna y LV-DEM son de práctica. Se escribe three, four, five y nine (ver english.js).
 */

const DEM = 'Lima Victor Delta Echo Mike';

export const survivalGroups = [
  {
    id: 'no-entendi',
    title: 'No entendí',
    lede: 'Cuando no escuchaste, escuchaste a medias o te hablan muy rápido. Pedir que repitan es normal: adivinar, no.',
    phrases: [
      {
        id: 'say-again',
        en: 'say again',
        es: 'repetí',
        say: `${DEM}, say again.`,
        use: 'LV-DEM, say again.',
        body: 'Pedís que te repitan todo el último mensaje, o la parte que nombres. *Repeat* no está entre las palabras normalizadas: se dice *say again*.',
      },
      {
        id: 'all-after',
        en: 'say again all after…',
        es: 'repetí todo lo que vino después de…',
        say: `${DEM}, say again all after wind.`,
        use: 'LV-DEM, say again all after wind.',
        body: 'Pedís solo el pedazo que te perdiste. Nombrás la última palabra que sí entendiste y te repiten desde ahí.',
      },
      {
        id: 'speak-slower',
        en: 'speak slower',
        es: 'hablá más despacio',
        say: `${DEM}, say again, speak slower.`,
        use: 'LV-DEM, say again, speak slower.',
        body: 'Pedís que bajen la velocidad al hablar. Sirve cuando el mensaje llega todo junto y no alcanzás a anotarlo.',
      },
      {
        id: 'spell',
        tag: 'Lenguaje claro',
        en: 'please spell',
        es: 'deletreá, por favor',
        say: `${DEM}, please spell the name of the reporting point.`,
        use: 'LV-DEM, please spell the name of the reporting point.',
        body: 'No está en la tabla de palabras normalizadas: es lenguaje claro, y se usa cuando no hay una frase normalizada. Pedís que te deletreen un nombre que no conocés, como un punto de notificación, y te lo dicen letra por letra con el alfabeto fonético.',
        link: { href: '/ingles/numeros', text: 'Repasá el alfabeto fonético' },
      },
      {
        id: 'words-twice',
        en: 'words twice',
        es: 'cada palabra dos veces',
        say: `${DEM}, words twice.`,
        use: 'LV-DEM, words twice.',
        body: 'Con la comunicación difícil, pedís que digan cada palabra o grupo de palabras dos veces. Dicho como aviso, significa que vos vas a decir todo dos veces.',
      },
      {
        id: 'how-read',
        en: 'how do you read',
        es: '¿cómo me escuchás?',
        say: `Laguna Tower, ${DEM}, how do you read?`,
        use: 'Laguna Tower, LV-DEM, how do you read?',
        body: 'Preguntás qué tan bien llega tu transmisión. Se usa en una prueba de radio o cuando sospechás que tu equipo falla.',
      },
    ],
  },
  {
    id: 'responder',
    title: 'Confirmar y responder',
    lede: 'Recibir no es lo mismo que cumplir, y un sí no se dice *yes*. Son las palabras que más se confunden.',
    phrases: [
      {
        id: 'roger',
        en: 'roger',
        es: 'recibido',
        say: `Roger, ${DEM}.`,
        use: 'Roger, LV-DEM.',
        body: 'Quiere decir que recibiste todo el último mensaje, nada más. No es un sí, no contesta una pregunta de sí o no y no reemplaza la colación.',
      },
      {
        id: 'wilco',
        en: 'wilco',
        es: 'entendido, voy a cumplir',
        say: `Wilco, ${DEM}.`,
        use: 'Wilco, LV-DEM.',
        body: 'Recibiste el mensaje, lo entendiste y lo vas a cumplir. Ya incluye lo que dice *roger*, así que con *wilco* solo alcanza. Y lo que se colaciona, se colaciona igual: *wilco* no reemplaza la colación.',
      },
      {
        id: 'affirm',
        en: 'affirm',
        es: 'sí',
        say: `Affirm, ${DEM}.`,
        use: 'Affirm, LV-DEM.',
        body: 'Es el sí de la radio. La palabra *yes* no es fraseología: a una pregunta de sí o no se contesta *affirm*.',
      },
      {
        id: 'negative',
        en: 'negative',
        es: 'no',
        say: `Negative, ${DEM}.`,
        use: 'Negative, LV-DEM.',
        body: 'Es el no de la radio. También quiere decir que algo no se autoriza, que lo que se dijo no es correcto o que no estás en condiciones de hacerlo.',
      },
      {
        id: 'confirm',
        en: 'confirm',
        es: 'confirmá',
        say: `${DEM}, confirm runway one three.`,
        use: 'LV-DEM, confirm runway one three.',
        body: 'Pedís que te verifiquen una autorización, una instrucción, una acción o un dato. Lo usás cuando dudás de lo que escuchaste.',
      },
      {
        id: 'correct',
        en: 'correct',
        es: 'correcto',
        say: `${DEM}, correct.`,
        use: 'LV-DEM, correct.',
        body: 'Quiere decir que lo que dijo el otro es cierto o exacto. Por ejemplo, la torre puede decirlo después de tu colación; muchas veces, si la colación está bien, no te dice nada.',
      },
    ],
    /** Tarjeta aparte: el uso de EE. UU. */
    aside: {
      id: 'verify',
      tag: 'EE. UU.',
      en: 'verify',
      es: 'confirmá, en EE. UU.',
      say: 'Verify heading two seven zero.',
      use: 'Verify heading two seven zero.',
      body: 'En los Estados Unidos, el control dice *verify* donde la OACI dice *confirm*: te pide que confirmes un dato. Ahí también vas a oír *affirmative* en lugar de *affirm*.',
    },
  },
  {
    id: 'no-puedo',
    title: 'No puedo o esperá',
    lede: 'Decir que no podés a tiempo es parte de volar seguro. Esperar también tiene su palabra.',
    phrases: [
      {
        id: 'unable',
        en: 'unable',
        es: 'no puedo cumplir',
        say: `Unable, due weather, ${DEM}.`,
        use: 'Unable, due weather, LV-DEM.',
        body: 'No podés cumplir lo que te piden, te instruyen o te autorizan. Decilo enseguida y, si podés, agregá el motivo, así el control busca otra opción.',
      },
      {
        id: 'standby',
        en: 'standby',
        es: 'esperá, te llamo',
        say: `${DEM}, standby.`,
        use: 'LV-DEM, standby.',
        body: 'Esperá: el que lo dice te va a llamar. No es un sí ni un no, y si la espera se alarga, volvés a llamar.',
      },
      {
        id: 'request',
        en: 'request',
        es: 'solicito',
        say: `Laguna Tower, ${DEM}, request taxi.`,
        use: 'Laguna Tower, LV-DEM, request taxi.',
        body: 'Pedís algo: un dato o un permiso. Va adelante de lo que querés obtener.',
      },
    ],
  },
  {
    id: 'corregir',
    title: 'Corregir',
    lede: 'Equivocarse en la radio pasa. Lo que importa es corregirlo con la palabra justa.',
    phrases: [
      {
        id: 'correction',
        en: 'correction',
        es: 'corrección',
        say: `Holding point runway three one, correction, runway one three, ${DEM}.`,
        use: 'Holding point runway three one, correction, runway one three, LV-DEM.',
        body: 'Te equivocaste en lo que acabás de decir. Después de la palabra va la versión correcta.',
      },
      {
        id: 'i-say-again',
        en: 'I say again',
        es: 'repito',
        say: `${DEM}, hold position, I say again, hold position.`,
        use: 'LV-DEM, hold position, I say again, hold position.',
        body: 'Repetís algo vos mismo, para que quede claro o para remarcarlo. No es *say again*: ahí le pedís al otro que repita.',
      },
      {
        id: 'read-back',
        en: 'read back',
        es: 'colacioná',
        say: `${DEM}, read back.`,
        use: 'LV-DEM, read back.',
        body: 'Te piden que repitas el mensaje, o la parte que nombren, exactamente como lo recibiste.',
      },
      {
        id: 'disregard',
        en: 'disregard',
        es: 'ignorá',
        say: `${DEM}, disregard.`,
        use: 'LV-DEM, disregard.',
        body: 'Pedís que no tengan en cuenta lo que dijiste. Se usa cuando un mensaje salió por error o ya no sirve.',
      },
    ],
  },
];

/**
 * Una llamada con problemas, en el aeródromo de práctica Laguna.
 * parts: los pedazos de la frase; hl marca la frase de supervivencia que se resalta.
 */
export const survivalCall = [
  {
    who: 'tower',
    say: `${DEM}, wind one four zero degrees eight knots, QNH one zero one six, taxi to holding point runway one three.`,
    parts: [{ text: 'LV-DEM, wind one four zero degrees eight knots, QNH one zero one six, taxi to holding point runway one three.' }],
    note: 'La torre manda viento, QNH y la autorización de rodaje. Una parte se pierde por el ruido.',
  },
  {
    who: 'pilot',
    say: `${DEM}, say again all after wind.`,
    parts: [{ text: 'LV-DEM, ' }, { text: 'say again all after wind', hl: true }, { text: '.' }],
    note: 'Pedís solo lo que vino después de la palabra *wind*.',
  },
  {
    who: 'tower',
    say: `${DEM}, wind one four zero degrees eight knots, QNH one zero one six, taxi to holding point runway one three.`,
    parts: [{ text: 'LV-DEM, wind one four zero degrees eight knots, QNH one zero one six, taxi to holding point runway one three.' }],
    note: 'La torre repite desde el viento.',
  },
  {
    who: 'pilot',
    say: `QNH one zero one six, taxi to holding point runway three one, ${DEM}.`,
    parts: [{ text: 'QNH one zero one six, taxi to holding point runway three one, LV-DEM.' }],
    note: 'Colacionás, pero cambiaste el número de la pista.',
  },
  {
    who: 'tower',
    say: `${DEM}, negative, I say again, taxi to holding point runway one three.`,
    parts: [{ text: 'LV-DEM, ' }, { text: 'negative', hl: true }, { text: ', ' }, { text: 'I say again', hl: true }, { text: ', taxi to holding point runway one three.' }],
    note: 'La torre te dice que la colación no es correcta y repite la instrucción entera.',
  },
  {
    who: 'pilot',
    say: `Taxi to holding point runway one three, ${DEM}.`,
    parts: [{ text: 'Taxi to holding point runway one three, LV-DEM.' }],
    note: 'Colacionás la pista correcta.',
  },
];
