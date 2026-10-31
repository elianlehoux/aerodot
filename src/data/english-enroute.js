/**
 * En ruta y aproximación: pasar de una frecuencia a otra, decir dónde estás y hacer una ida al aire.
 *
 * Fuentes (los textos en español son propios):
 * - Las frases de cambio de frecuencia (contact, monitor, request change to, frequency change
 *   approved) son las de la lista de la OACI (Doc 4444, cap. 12), tal como las reproduce el
 *   reglamento europeo SERA. La respuesta del piloto a monitor es monitoring.
 * - Qué se repite siempre (pista en uso, QNH, frecuencias que te indican): SERA.8015, igual que
 *   en el módulo de radio por fase de vuelo.
 * - Lugar del distintivo: CAP 413 de la CAA británica, 2.49 (la dependencia lo dice primero; una
 *   llamada nueva del piloto también; la repetición o el acuse terminan con él).
 * - El reporte de posición en VFR no tiene un formato único: las piezas (a quién llamás, quién sos,
 *   dónde estás, a qué altura, qué querés hacer) son uso habitual y así se rotulan en la página.
 *
 * Cada grupo: id, title, lede, call (la llamada de ejemplo) y phrases.
 * Cada línea: who ('pilot' | 'tower'), unit (la dependencia), text, say, kind (en el piloto: 'call'
 * o 'readback'), key (la frase que se resalta) y note.
 * Cada frase: id, en, es, use, say y body; tag es opcional.
 * En lede, note y body, el inglés va entre asteriscos: la página les pone lang="en".
 * Laguna, Costa, Santa Brisa, Piedra Alta, LV-DEM y todas las cifras (frecuencias, QNH, pista,
 * distancias, alturas) son de práctica. Las cifras de say van en palabras; se escribe three, four,
 * five y nine (ver english.js).
 */

const DEM = 'Lima Victor Delta Echo Mike';

/** Lo que lee la voz: el mismo texto, con la matrícula deletreada. */
const spoken = (text) => text.replaceAll('LV-DEM', DEM);

const line = (entry) => ({ ...entry, say: spoken(entry.text) });
const phrase = (entry) => ({ ...entry, say: spoken(entry.use) });

export const enrouteGroups = [
  {
    id: 'frecuencia',
    title: 'Cambiar de frecuencia',
    lede: 'Saliendo de la zona de Laguna, la torre te pasa a *Costa Information*. Cada cambio usa una frase fija, y repetís la frecuencia entera.',
    call: [
      line({ who: 'tower', unit: 'Laguna Tower', text: 'LV-DEM, contact Costa Information one two six decimal five.', key: 'contact Costa Information',
        note: 'Salís de la zona y la torre te pasa a otra dependencia. *Contact* es la frase para pasar de una a otra.' }),
      line({ who: 'pilot', kind: 'readback', text: 'Contact Costa Information one two six decimal five, LV-DEM.',
        note: 'Repetís la frecuencia completa: con una cifra mal copiada llamás donde nadie te escucha.' }),
      line({ who: 'pilot', kind: 'call', text: 'Costa Information, LV-DEM, VFR from Laguna to Santa Brisa, over Piedra Alta, two thousand five hundred feet.', key: 'over Piedra Alta',
        note: 'Primera llamada en la frecuencia nueva: a quién llamás, quién sos, de dónde a dónde vas, dónde estás y a qué altura.' }),
      line({ who: 'tower', unit: 'Costa Information', text: 'LV-DEM, Costa Information, QNH one zero one two.', key: 'QNH one zero one two',
        note: 'Te da el QNH de la zona.' }),
      line({ who: 'pilot', kind: 'readback', text: 'QNH one zero one two, request change to one one eight decimal three, LV-DEM.', key: 'request change to',
        note: 'Repetís el QNH y, en la misma llamada, pedís pasar a la frecuencia de la torre de tu destino.' }),
      line({ who: 'tower', unit: 'Costa Information', text: 'LV-DEM, frequency change approved.', key: 'frequency change approved',
        note: 'Es un permiso. Hasta que lo escuchás, seguís en esta frecuencia.' }),
      line({ who: 'pilot', kind: 'readback', text: 'Roger, LV-DEM.',
        note: 'Como es un permiso y no una orden, solo acusás recibo y pasás a la frecuencia nueva.' }),
    ],
    phrases: [
      phrase({ id: 'contact', en: 'contact', es: 'comunicate con',
        use: 'LV-DEM, contact Costa Information one two six decimal five.',
        body: 'Te pasan a otra dependencia y te dan su frecuencia. La repetís entera. Es la misma frase que usás al pasar de rodaje a la torre.' }),
      phrase({ id: 'monitor', en: 'monitor', es: 'escuchá en…',
        use: 'LV-DEM, monitor Costa Information one two six decimal five.',
        body: 'Te piden que escuches esa frecuencia sin llamar: desde ahí te pasan información. Contestás *monitoring* y la frecuencia.' }),
      phrase({ id: 'request-change', en: 'request change to…', es: 'solicito cambiar a…',
        use: 'LV-DEM, request change to one one eight decimal three.',
        body: 'Pedís permiso para pasar a otra frecuencia. Seguís en la actual hasta que te contesten *frequency change approved*.' }),
      phrase({ id: 'change-approved', en: 'frequency change approved', es: 'cambio de frecuencia aprobado',
        use: 'LV-DEM, frequency change approved.',
        body: 'Te dejan cambiar. Acusás recibo y llamás en la frecuencia nueva, con la misma estructura de la primera llamada.' }),
    ],
  },
  {
    id: 'posicion',
    title: 'Decir dónde estás',
    lede: 'Un reporte de posición dice quién sos, dónde estás, a qué altura y qué querés. En VFR no hay una frase única. Armás el reporte con piezas cortas, en este orden.',
    call: [
      line({ who: 'pilot', kind: 'call', text: 'Santa Brisa Tower, LV-DEM, five miles north, two thousand feet, inbound for landing, information Charlie.', key: 'five miles north',
        note: 'Llamás a la torre de tu destino: quién sos, dónde estás, a qué altura, qué querés y la letra del ATIS que escuchaste.' }),
      line({ who: 'tower', unit: 'Santa Brisa Tower', text: 'LV-DEM, Santa Brisa Tower, runway zero nine, QNH one zero one three, report downwind.', key: 'runway zero nine',
        note: 'Te da la pista en uso y el QNH de su aeródromo, y te pide un aviso.' }),
      line({ who: 'pilot', kind: 'readback', text: 'Runway zero nine, QNH one zero one three, wilco, LV-DEM.',
        note: 'Repetís la pista y el QNH, y con *wilco* decís que vas a avisar en la inicial.' }),
    ],
    phrases: [
      phrase({ id: 'over', tag: 'Uso habitual', en: 'over…', es: 'sobre…',
        use: 'LV-DEM, over Piedra Alta, two thousand five hundred feet.',
        body: 'Estás justo encima de un punto conocido: un pueblo, un cruce o un punto de notificación. Después del lugar va la altura.' }),
      phrase({ id: 'miles', tag: 'Uso habitual', en: 'five miles north', es: 'a cinco millas al norte',
        use: 'LV-DEM, five miles north of the field, two thousand feet.',
        body: 'Cuando no estás sobre un punto, decís la distancia y hacia dónde queda el aeródromo desde vos: *north*, *south*, *east* o *west*. La distancia va cifra por cifra.' }),
      phrase({ id: 'inbound', tag: 'Uso habitual', en: 'inbound for landing', es: 'en aproximación para aterrizar',
        use: 'LV-DEM, inbound for landing, information Charlie.',
        body: 'Avisás que venís a aterrizar ahí. Terminás con la letra del ATIS que escuchaste, así la torre sabe que ya tenés el parte. Un aeródromo puede pedirte otra forma. Seguí lo que publique.' }),
    ],
  },
  {
    id: 'ida-al-aire',
    title: 'Si no podés aterrizar',
    lede: 'A veces la pista no está libre o la aproximación no sale bien. Entonces hacés *go around*. Te lo pide la torre o lo decidís vos, y en los dos casos avisás.',
    call: [
      line({ who: 'tower', unit: 'Santa Brisa Tower', text: 'LV-DEM, go around, vehicle on the runway.', key: 'go around',
        note: 'La torre ve un vehículo en la pista. Te ordena la ida al aire y te dice por qué.' }),
      line({ who: 'pilot', kind: 'readback', text: 'Going around, LV-DEM.',
        note: 'Acusás con *going around* y la torre sabe que ya estás subiendo. Primero volás el avión. Después hablás.' }),
      line({ who: 'tower', unit: 'Santa Brisa Tower', text: 'LV-DEM, report downwind.', key: 'report downwind',
        note: 'Te pide que avises en la inicial para volver a entrar al circuito.' }),
      line({ who: 'pilot', kind: 'readback', text: 'Wilco, LV-DEM.' }),
    ],
    phrases: [
      phrase({ id: 'go-around', en: 'go around', es: 'ida al aire',
        use: 'LV-DEM, go around.',
        body: 'Es una orden. Cortás la aproximación y subís. Mantenés el control del avión y, cuando podés, contestás *going around*.' }),
      phrase({ id: 'going-around', en: 'going around', es: 'estoy haciendo la ida al aire',
        use: 'LV-DEM, going around.',
        body: 'Lo decís vos cuando abortás el aterrizaje, porque la torre te lo ordenó o porque la aproximación no está bien. No esperás un permiso para decidirlo. Primero volás, después avisás.' }),
    ],
  },
];
