/** Qué pantalla se ve, guardado en el # de la dirección: #c/<cabina>/f/<flujo>/<modo>. */

export const MODES = ['editar', 'mirar', 'repasar'];

export function parseRoute(hash) {
  const parts = hash.replace(/^#/, '').split('/');
  if (parts[0] !== 'c' || parts[2] !== 'f' || !parts[1] || !parts[3]) return { screen: 'list' };
  try {
    const mode = MODES.includes(parts[4]) ? parts[4] : 'editar';
    return { screen: 'flow', cabinId: decodeURIComponent(parts[1]), flowId: decodeURIComponent(parts[3]), mode };
  } catch {
    return { screen: 'list' };
  }
}

export function formatRoute(route) {
  if (route.screen !== 'flow') return '#';
  return `#c/${encodeURIComponent(route.cabinId)}/f/${encodeURIComponent(route.flowId)}/${route.mode ?? 'editar'}`;
}
