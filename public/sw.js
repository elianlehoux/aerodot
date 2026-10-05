/*
 * Service worker de Aerodot.
 *
 * `astro build` reemplaza BUILD_ID y PRECACHE (ver la integración `pwa` en astro.config.mjs):
 * el primero cambia en cada build para que el navegador detecte la versión nueva; el segundo
 * lista las páginas base y los assets que esas páginas cargan. En `astro dev` no se registra.
 *
 * Estrategias:
 * - Páginas: red primero, y si no hay señal, la copia guardada o /offline.
 * - /_assets/ (nombres con hash, inmutables) y fuentes: caché primero.
 * - Resto del mismo origen (figuras, íconos, manifest): se sirve lo guardado y se actualiza
 *   en segundo plano, así una figura corregida con el mismo nombre llega en la visita siguiente.
 * Las peticiones a otros orígenes (PostHog, ANAC) no pasan por acá.
 */
const BUILD_ID = '__BUILD_ID__';
const PRECACHE = self.__PRECACHE__ || ['/', '/offline'];

const PRECACHE_NAME = `aerodot-precache-${BUILD_ID}`;
const PAGES_NAME = 'aerodot-pages';
const ASSETS_NAME = 'aerodot-assets';
const KEEP = new Set([PRECACHE_NAME, PAGES_NAME, ASSETS_NAME]);
const MAX_PAGES = 80;
const MAX_ASSETS = 400;

const pageKey = (url) => {
  const { pathname } = new URL(url, self.location.origin);
  const clean = pathname.replace(/\/index\.html$/, '/').replace(/(.)\/$/, '$1');
  return new URL(clean, self.location.origin).href;
};

const trim = async (cacheName, max) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - max)).map((key) => cache.delete(key)));
};

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(PRECACHE_NAME);
    // Uno por uno: si falta un archivo, el resto igual queda guardado.
    await Promise.all(PRECACHE.map(async (path) => {
      try {
        const response = await fetch(path, { cache: 'reload' });
        if (response.ok) await cache.put(path.startsWith('/_assets/') ? path : pageKey(path), response);
      } catch { /* Se guarda en la próxima visita. */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name.startsWith('aerodot-') && !KEEP.has(name)).map((name) => caches.delete(name)));
    if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
    await self.clients.claim();
  })());
});

const handlePage = async (event) => {
  const key = pageKey(event.request.url);
  try {
    const response = (await event.preloadResponse) || (await fetch(event.request));
    if (response.ok && response.type === 'basic') {
      const copy = response.clone();
      event.waitUntil(caches.open(PAGES_NAME).then((cache) => cache.put(key, copy)).then(() => trim(PAGES_NAME, MAX_PAGES)));
    }
    return response;
  } catch {
    return (await caches.match(key))
      || (await caches.match(pageKey('/offline')))
      || new Response('Sin conexión', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
};

const handleImmutable = async (event) => {
  const cached = await caches.match(event.request);
  if (cached) return cached;
  const response = await fetch(event.request);
  if (response.ok) {
    const copy = response.clone();
    event.waitUntil(caches.open(ASSETS_NAME).then((cache) => cache.put(event.request, copy)).then(() => trim(ASSETS_NAME, MAX_ASSETS)));
  }
  return response;
};

const handleRevalidate = async (event) => {
  const cached = await caches.match(event.request);
  const network = fetch(event.request).then((response) => {
    if (response.ok) {
      const copy = response.clone();
      caches.open(ASSETS_NAME).then((cache) => cache.put(event.request, copy)).then(() => trim(ASSETS_NAME, MAX_ASSETS));
    }
    return response;
  });
  if (cached) {
    event.waitUntil(network.catch(() => undefined));
    return cached;
  }
  return network;
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === '/sw.js') return;

  if (request.mode === 'navigate') {
    event.respondWith(handlePage(event));
  } else if (/^\/(_assets|fonts)\//.test(url.pathname)) {
    event.respondWith(handleImmutable(event));
  } else {
    event.respondWith(handleRevalidate(event));
  }
});
