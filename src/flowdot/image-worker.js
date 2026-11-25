/** Achica y comprime una imagen fuera del hilo de la página. Recibe { bitmap, width, height }. */
self.onmessage = async ({ data }) => {
  try {
    const canvas = new OffscreenCanvas(data.width, data.height);
    const context = canvas.getContext('2d');
    context.imageSmoothingQuality = 'high';
    context.drawImage(data.bitmap, 0, 0, data.width, data.height);
    data.bitmap.close();
    let blob = await canvas.convertToBlob({ type: 'image/webp', quality: 0.85 });
    if (blob.type !== 'image/webp') blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.85 });
    self.postMessage({ blob });
  } catch (error) {
    self.postMessage({ error: String(error?.message ?? error) });
  }
};
