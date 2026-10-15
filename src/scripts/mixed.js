/**
 * Texto en español con pedazos en inglés marcados entre asteriscos: "se dice *say again*".
 * splitMixed lo parte en trozos { text, en }; quien lo pinta pone lang="en" en los trozos en inglés.
 * Un asterisco sin pareja queda como texto. No devuelve trozos vacíos.
 */
export const splitMixed = (value) => {
  const text = String(value ?? '');
  const pieces = text.split('*');
  // Cantidad impar de asteriscos: el último no tiene pareja y vuelve al texto.
  if (pieces.length % 2 === 0) {
    const tail = pieces.pop();
    pieces[pieces.length - 1] += `*${tail}`;
  }
  return pieces
    .map((piece, index) => ({ text: piece, en: index % 2 === 1 }))
    .filter((part) => part.text !== '');
};

/** true si hay un asterisco sin pareja. */
export const hasUnmatchedMarker = (value) => (String(value ?? '').split('*').length - 1) % 2 === 1;
