/**
 * NOTAM de ANAC: lee la tabla que publica ais.anac.gob.ar/notam y la ordena por importancia.
 * Lo usan la función del servidor (api/notam.js) y las pruebas. Sin DOM: se lee con expresiones.
 */

const decode = (text) => String(text)
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/&aacute;/g, 'á').replace(/&eacute;/g, 'é').replace(/&iacute;/g, 'í').replace(/&oacute;/g, 'ó').replace(/&uacute;/g, 'ú')
  .replace(/&Aacute;/g, 'Á').replace(/&Eacute;/g, 'É').replace(/&Iacute;/g, 'Í').replace(/&Oacute;/g, 'Ó').replace(/&Uacute;/g, 'Ú')
  .replace(/&ntilde;/g, 'ñ').replace(/&Ntilde;/g, 'Ñ').replace(/&uuml;/g, 'ü').replace(/&Uuml;/g, 'Ü')
  .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ')
  .trim();

const paragraphs = (html) => [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((match) => match[1]);

/** De la tabla HTML a una lista de NOTAM: { id, place, location, from, to, text, textEs }. */
export function parseNotamTable(html) {
  const rows = [...String(html).matchAll(/<tr>\s*<td id="place">([\s\S]*?)<\/td>\s*<td id="info">([\s\S]*?)<\/td>\s*<\/tr>/g)];
  return rows.map(([, place, info]) => {
    const [id = '', name = '', code = ''] = paragraphs(place).map(decode);
    const [fromLine = '', toLine = '', body = ''] = paragraphs(info);
    const [en, es] = body.split(/<span id="versionbreak">[\s\S]*?<\/span>/);
    return {
      id,
      place: name,
      location: code.replace(/[()]/g, ''),
      from: decode(fromLine).replace(/^Desde:\s*/, ''),
      to: decode(toLine).replace(/^Hasta:\s*/, ''),
      text: decode(en ?? ''),
      textEs: decode(es ?? ''),
    };
  });
}

/** Los lugares del selector de la página de ANAC: { code, name }. */
export function parseNotamPlaces(html) {
  const select = String(html).match(/<select[^>]*id="locations"[^>]*>([\s\S]*?)<\/select>/);
  if (!select) return [];
  return [...select[1].matchAll(/<option value="([^"]+)">([\s\S]*?)<\/option>/g)].map(([, code, name]) => ({ code, name: decode(name) }));
}

/** La hora de la última actualización que muestra ANAC, en hora local argentina. */
export const parseUpdated = (html) => decode(String(html).match(/id="pibupdate"[^>]*>([\s\S]*?)</)?.[1] ?? '').replace(/^Última actualización:\s*/, '');

/**
 * Importancia, para ordenar y resaltar: 3 si cierra pista o aeródromo o falla un aid que suele usarse,
 * 2 si cambia algo de la operación, 1 si es informativo.
 */
export function severity(text) {
  const t = ` ${String(text).toUpperCase()} `;
  if (/\b(AD|RWY|AERODROME|ARPT)\b[^.]*\bCLSD\b|\bCLSD\b[^.]*\b(AD|RWY)\b|\bAD CLOSED\b|\bRWY [\d/LRC]+ CLSD\b/.test(t)) return 3;
  if (/\b(ILS|LOC|GP|VOR|DME|NDB|PAPI|ALS|TWR|APP|ATIS)\b[^.]*\b(U\/S|OUT OF SERVICE|UNSERVICEABLE|NOT AVBL)\b/.test(t)) return 3;
  if (/\b(CLSD|U\/S|NOT AVBL|OBST|CRANE|WIP|RESTRICTED|PROHIBITED|DANGER|ACT|LIMITED|CHANGED|REDUCED)\b/.test(t)) return 2;
  return 1;
}

/** Vigente ahora: empezó y no terminó. Las fechas de ANAC están en UTC, "AAAA-MM-DD HH:MM:SS". */
export function isActive(notam, now = Date.now()) {
  const parse = (text) => {
    const match = String(text).match(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})/);
    return match ? Date.parse(`${match[1]}T${match[2]}:00Z`) : NaN;
  };
  const from = parse(notam.from);
  const to = parse(notam.to);
  return (Number.isNaN(from) || from <= now) && (Number.isNaN(to) || to >= now);
}
