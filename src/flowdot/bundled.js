/**
 * Cabinas de prueba que vienen con Flowdot. Se cargan solas la primera vez y nunca se borran:
 * «borrar» una solo la oculta, y se puede volver a mostrar.
 *
 * Solo se publica la 737 (foto CC0, en public/flowdot/). La A320 de prueba usa un diagrama de la
 * documentación de FlyByWire, que no tiene licencia publicada: no va al sitio ni al repositorio.
 * Vive en local/ (ignorada por git) y se carga solo en desarrollo, si el archivo está.
 */
const B737 = { id: 'ejemplo-boeing-737', file: '/flowdot/ejemplo-boeing-737.flowdot' };
const LOCAL_A320 = { id: 'prueba-a320-completo', file: '/local/flowdot/prueba-a320.flowdot', optional: true };

export const bundledList = (dev) => (dev ? [B737, LOCAL_A320] : [B737]);

export const BUNDLED = bundledList(import.meta.env?.DEV === true);

export const isBundled = (id) => BUNDLED.some((item) => item.id === id);

/** Las que faltan en el dispositivo y todavía no se cargaron nunca: una ya cargada no vuelve sola. */
export const bundledToSeed = (seen, existingIds, list = BUNDLED) => list.filter((item) => !seen.includes(item.id) && !existingIds.has(item.id));

/** Las que no se ven en la lista: ocultas o que no están en el dispositivo. */
export const bundledMissing = (cabins, list = BUNDLED) => list.filter((item) => !cabins.some((cabin) => cabin.id === item.id && !cabin.hidden));
