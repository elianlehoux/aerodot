/**
 * Elegir una pieza y ver su panel (CRAFT en Autorización, la cinta de Emergencias).
 * Un grupo de radios nativo (teclado y toque): muestra el panel de la pieza elegida y
 * resalta su trozo en el ejemplo con .is-on. Sin JavaScript se ven todos los paneles.
 * pick, panel y chunk son nombres de atributos data-* sin el prefijo: el radio lleva el id
 * de la pieza en value; el panel y el trozo, en su atributo.
 */
export const mountPiecePicker = (root, { pick, panel, chunk }) => {
  const radios = [...root.querySelectorAll(`[data-${pick}]`)];
  const panels = [...root.querySelectorAll(`[data-${panel}]`)];
  const chunks = [...root.querySelectorAll(`[data-${chunk}]`)];
  const select = (id) => {
    panels.forEach((node) => { node.hidden = node.getAttribute(`data-${panel}`) !== id; });
    chunks.forEach((node) => node.classList.toggle('is-on', node.getAttribute(`data-${chunk}`) === id));
  };
  radios.forEach((radio) => radio.addEventListener('change', () => { if (radio.checked) select(radio.value); }));
  const start = radios.find((radio) => radio.checked) ?? radios[0];
  if (start) select(start.value);
};
