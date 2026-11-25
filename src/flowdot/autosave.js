/**
 * Guardado con demora: guarda solo el último valor pedido, `delay` ms después del último cambio.
 * Si guardar falla, avisa con `onError` y el próximo cambio vuelve a intentar.
 */
export function createAutosave(save, delay = 400, onError = () => {}) {
  let timer = null;
  let pending = false;
  let value;

  const run = async () => {
    clearTimeout(timer);
    timer = null;
    if (!pending) return;
    pending = false;
    try {
      await save(value);
    } catch (error) {
      onError(error);
    }
  };

  return {
    schedule(next) {
      value = next;
      pending = true;
      clearTimeout(timer);
      timer = setTimeout(run, delay);
    },
    flush: run,
  };
}
