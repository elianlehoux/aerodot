/**
 * Función de Vercel: trae los NOTAM de ANAC (ais.anac.gob.ar/notam) y los devuelve en JSON.
 * Hace falta porque ANAC solo responde la tabla con un encabezado que el navegador no puede mandar
 * desde otro sitio. No guarda nada ni recibe datos personales: solo el lugar consultado.
 *
 *   GET /api/notam            → { updated, places: [{ code, name }] }
 *   GET /api/notam?lugar=AER  → { updated, place, notams: [...] }
 */
import { parseNotamPlaces, parseNotamTable, parseUpdated, severity } from '../src/bitacora/notam.js';

const BASE = 'https://ais.anac.gob.ar/notam';

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    // Cinco minutos en el borde de Vercel: ANAC actualiza seguido, pero no hace falta pedirle en cada visita.
    'cache-control': status === 200 ? 'public, s-maxage=300, stale-while-revalidate=600' : 'no-store',
  },
});

export async function GET(request) {
  const place = new URL(request.url).searchParams.get('lugar')?.toUpperCase() ?? '';
  if (place && !/^[A-Z-]{3}$/.test(place)) return json({ error: 'Lugar no válido.' }, 400);
  try {
    const page = await fetch(BASE, { signal: AbortSignal.timeout(8000) });
    if (!page.ok) throw new Error(`ANAC respondió ${page.status}`);
    const html = await page.text();
    const updated = parseUpdated(html);
    if (!place) return json({ updated, places: parseNotamPlaces(html) });
    const table = await fetch(`${BASE}/pib`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-requested-with': 'XMLHttpRequest' },
      body: new URLSearchParams({ indicador: place }),
      signal: AbortSignal.timeout(8000),
    });
    if (!table.ok) throw new Error(`ANAC respondió ${table.status}`);
    const notams = parseNotamTable(await table.text()).map((notam) => ({ ...notam, severity: severity(notam.text) }));
    return json({ updated, place, notams });
  } catch {
    return json({ error: 'No se pudo leer el sitio de ANAC.' }, 502);
  }
}
