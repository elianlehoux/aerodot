/**
 * Foto o página de PDF a imagen lista para guardar: lado mayor de hasta 2560 px, WebP 0,85
 * (JPEG si el navegador no codifica WebP). pdf.js se descarga solo cuando alguien sube un PDF.
 */
import { MAX_SIDE, fitWithin } from './geometry.js';

const ACCEPTED = new Set(['image/jpeg', 'image/png', 'image/webp']);
export const NOT_A_PHOTO = 'Ese archivo no es una foto. Usá JPG, PNG, WebP o PDF.';

const canvasToBlob = (canvas, type) => new Promise((resolve) => canvas.toBlob(resolve, type, 0.85));

async function encodeOnPage(bitmap, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.imageSmoothingQuality = 'high';
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  let blob = await canvasToBlob(canvas, 'image/webp');
  if (!blob || blob.type !== 'image/webp') blob = await canvasToBlob(canvas, 'image/jpeg');
  return blob;
}

let worker;
function encodeInWorker(bitmap, width, height) {
  worker ??= new Worker(new URL('./image-worker.js', import.meta.url), { type: 'module' });
  return new Promise((resolve, reject) => {
    worker.onmessage = ({ data }) => (data.error ? reject(new Error(data.error)) : resolve(data.blob));
    worker.onerror = (event) => reject(event.error ?? new Error('No se pudo procesar la imagen.'));
    worker.postMessage({ bitmap, width, height }, [bitmap]);
  });
}

export async function prepareImage(file) {
  if (!ACCEPTED.has(file.type)) throw new Error(NOT_A_PHOTO);
  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new Error('No se pudo abrir la foto. Probá con otra.');
  }
  const { width, height } = fitWithin(bitmap.width, bitmap.height);
  let blob;
  if (typeof OffscreenCanvas === 'function') {
    try {
      blob = await encodeInWorker(bitmap, width, height);
    } catch {
      bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    }
  }
  blob ??= await encodeOnPage(bitmap, width, height);
  return { blob, type: blob.type, width, height };
}

async function renderPage(page, maxSide) {
  const base = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({ scale: maxSide / Math.max(base.width, base.height) });
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  await page.render({ canvas, canvasContext: canvas.getContext('2d'), viewport }).promise;
  return canvasToBlob(canvas, 'image/png');
}

export async function pdfPages(file) {
  const [pdfjs, { default: workerUrl }] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ]);
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  return {
    count: doc.numPages,
    thumbnail: async (index) => renderPage(await doc.getPage(index + 1), 240),
    render: async (index) => prepareImage(await renderPage(await doc.getPage(index + 1), MAX_SIDE)),
  };
}
