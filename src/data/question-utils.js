/**
 * Predicados compartidos sobre preguntas de examen.
 *
 * Antes cada superficie repetia la definicion de "puntuable" por su cuenta: la pagina de
 * examen la calculaba en build para anunciar el tamano del examen, y practice.js la repetia
 * en el navegador para armar la cola. Editar una sola mitad desincronizaba el numero
 * anunciado del examen que se served de verdad, asi que vive aqui una sola vez.
 */

/** Una pregunta suma al puntaje si tiene clave entera y la clave esta confirmada. */
export function isScoreableQuestion(question) {
  return Number.isInteger(question?.answerIndex)
    && (question?.confidence === undefined || question?.confidence === 'high');
}

export const allQuestionsOf = (bank) => (bank?.chapters ?? []).flatMap((chapter) => chapter.questions);

export const scoreableQuestionsOf = (bank) => allQuestionsOf(bank).filter(isScoreableQuestion);

/** Cantidad de preguntas que efectivamente pueden puntuarse en un banco. */
export const scoreableCount = (bank) => scoreableQuestionsOf(bank).length;

/**
 * Tamano real del simulacro: lo que ANAC publica para ese examen, limitado por la cantidad
 * de preguntas que este banco tiene con clave confirmada. No se anuncia mas de lo que hay.
 */
export const mockSizeOf = (bank, testSize) => Math.min(testSize, scoreableCount(bank));
