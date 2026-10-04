# Guía de estilo del contenido de estudio (Aerodot)

Público: alguien que empieza el curso de Piloto Privado de Avión (PPA) en Argentina, sin base técnica.
Objetivo: que entienda el concepto la primera vez que lo lee y pueda responder el examen ANAC.

## Formato de cada lección (no cambiar)

Cada lección es un array: `[título, cuerpo, ideaParaRecordar, diagrama?]`.

- El 4.º elemento (id de diagrama, p. ej. `'forces'`) se conserva **exactamente** donde está. No agregar ni quitar ids.
- No cambiar la cantidad ni el orden de lecciones de cada capítulo, ni `id`, `slug`, `minutes`, `sourceIds`, ni la lógica JS.
- Se pueden reescribir: título de lección, cuerpo, idea para recordar, `eyebrow` e `intro` del capítulo.
- Los párrafos del cuerpo se separan con `\n\n`.
- Un párrafo que empieza con `US: ` es una nota sobre la práctica de EE. UU. (FAA); mantener ese prefijo si se conserva la nota.

## Voz

- Español rioplatense con voseo ("fijate", "pensá", "tu avión"), cálido y directo, como un buen instructor.
- Oraciones cortas: apuntá a menos de 25 palabras. Una idea por oración.
- Cada término técnico se explica en palabras simples la primera vez que aparece: "el ángulo de ataque (el ángulo con que el ala 'muerde' el aire que le llega)".
- Siglas: la primera vez, sigla + significado (IAS, velocidad indicada).
- Usá analogías cotidianas cuando aclaren (mano por la ventanilla del auto, manguera con el dedo en la punta, balancín de plaza) pero sin forzarlas.
- Ejemplos con números concretos cuando ayudan a entender ("a 60° de inclinación, el ala carga el doble: 2 g").

## Estructura del cuerpo (2 a 4 párrafos)

1. **Qué es**: una o dos frases simples que definan la idea.
2. **Cómo funciona / por qué**: el mecanismo, paso a paso.
3. **Qué significa para vos en el avión**: ejemplo práctico, qué ves o sentís en cabina.
4. (Opcional) **Ojo en el examen**: la confusión típica o la trampa frecuente, si existe.

## Advertencias: menos es más

El texto actual repite en casi cada párrafo "depende del avión / consultá el manual / no es universal". Eso cansa y tapa la idea.
- Como máximo **una** advertencia breve por lección, solo donde realmente importa (procedimientos, velocidades, límites, emergencias).
- Fórmula sugerida: "Los valores exactos están en el manual de vuelo de tu avión." o "La técnica la practicás con tu instructor."
- Nunca inventes procedimientos, números de lista de emergencia ni velocidades de un modelo concreto.

## Exactitud (lo más importante)

- No cambies datos técnicos ni normativos que ya estén (citas RAAC, alturas de circuito, fórmulas). Si al simplificar dudás, conservá el dato tal cual.
- No agregues normativa argentina que no puedas sostener con certeza. Mejor omitir que inventar.
- Las fórmulas se mantienen correctas (p. ej. n = 1/cos φ; Vs aumenta con √n).
- Simplificar no es deformar: si una simplificación vuelve falsa la frase, no la uses.

## Idea para recordar

- Una sola frase, máximo ~20 palabras, fácil de memorizar. Idealmente una regla o un contraste ("Pérdida = ángulo, no velocidad").
