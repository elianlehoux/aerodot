/**
 * Geometría de Flowdot. Los pasos guardan su posición como fracción de la imagen (0 a 1);
 * la pantalla muestra la imagen escalada y corrida: pantalla = imagen × scale + t.
 *
 * View: { scale, tx, ty, width, height }, con width y height en px de la imagen guardada.
 */

export const HIT_RADIUS = 28;
export const MAX_SIDE = 2560;

export const toFraction = (px, py, view) => ({
  x: (px - view.tx) / (view.scale * view.width),
  y: (py - view.ty) / (view.scale * view.height),
});

export const toScreen = (x, y, view) => ({
  px: x * view.width * view.scale + view.tx,
  py: y * view.height * view.scale + view.ty,
});

/** Índice del paso más cercano al toque dentro del radio (en px de pantalla), o -1. */
export function hitTest(steps, px, py, view, radius = HIT_RADIUS) {
  let best = -1;
  let bestDistance = radius;
  steps.forEach((step, index) => {
    const point = toScreen(step.x, step.y, view);
    const distance = Math.hypot(point.px - px, point.py - py);
    if (distance <= bestDistance) {
      best = index;
      bestDistance = distance;
    }
  });
  return best;
}

/** Un toque se mueve menos de 10 px y dura menos de 300 ms; lo demás es arrastre. */
export const classifyGesture = (dx, dy, ms) => (Math.hypot(dx, dy) < 10 && ms < 300 ? 'tap' : 'drag');

/** Achica para que el lado mayor no pase de `max`. Nunca agranda. */
export function fitWithin(width, height, max = MAX_SIDE) {
  const ratio = Math.min(1, max / Math.max(width, height));
  return { width: Math.round(width * ratio), height: Math.round(height * ratio) };
}

const r = (n) => Math.round(n * 10) / 10;

/**
 * Puntos de la ruta en px de la imagen. `bend` es la curva de la flecha que llega a ese paso,
 * y solo vale si el punto sigue al anterior: entre pasos salteados no hay flecha guardada.
 */
export function routePoints(steps, width, height, shown = steps.map((_, index) => index)) {
  return shown.map((index, i) => {
    const step = steps[index];
    const point = { index, px: step.x * width, py: step.y * height };
    if (i > 0 && shown[i - 1] === index - 1 && typeof step.bend === 'number') point.bend = step.bend;
    return point;
  });
}

const clampBend = (n) => Math.min(1, Math.max(-1, n));

/**
 * Curva que deja el puntito en `point`: distancia perpendicular al medio del tramo, dividida por su largo.
 * Positiva hacia la normal (-dy, dx).
 */
export function bendFrom(p1, p2, point) {
  const dx = p2.px - p1.px;
  const dy = p2.py - p1.py;
  const length2 = dx * dx + dy * dy;
  if (!length2) return 0;
  const mx = (p1.px + p2.px) / 2;
  const my = (p1.py + p2.py) / 2;
  return clampBend(((point.px - mx) * -dy + (point.py - my) * dx) / length2);
}

/** Tramo arqueado: la cuadrática que pasa por el puntito en su mitad, escrita como cúbica. */
export function bentSegment(p1, p2, bend) {
  const dx = p2.px - p1.px;
  const dy = p2.py - p1.py;
  const cx = (p1.px + p2.px) / 2 - 2 * bend * dy;
  const cy = (p1.py + p2.py) / 2 + 2 * bend * dx;
  return [
    p1,
    { px: p1.px + ((cx - p1.px) * 2) / 3, py: p1.py + ((cy - p1.py) * 2) / 3 },
    { px: p2.px + ((cx - p2.px) * 2) / 3, py: p2.py + ((cy - p2.py) * 2) / 3 },
    p2,
  ];
}

/**
 * Tramos de la curva por todos los puntos: Catmull-Rom (tensión 0,5) pasada a Bézier cúbicas.
 * Un punto con `bend` hace arqueada la flecha que llega a él, en vez de automática.
 * Con `bounds` ({ width, height, top }), los puntos de control no salen de la imagen,
 * así la curva entre pasos pegados al borde no se dibuja afuera de la foto.
 */
export function routeSegments(points, bounds) {
  const keep = bounds
    ? (p) => ({ px: Math.min(bounds.width, Math.max(0, p.px)), py: Math.min((bounds.top ?? 0) + bounds.height, Math.max(bounds.top ?? 0, p.py)) })
    : (p) => p;
  const segments = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    if (typeof p2.bend === 'number') {
      const [, c1, c2] = bentSegment(p1, p2, clampBend(p2.bend));
      segments.push([p1, keep(c1), keep(c2), p2]);
      continue;
    }
    segments.push([
      p1,
      keep({ px: p1.px + (p2.px - p0.px) / 6, py: p1.py + (p2.py - p0.py) / 6 }),
      keep({ px: p2.px - (p3.px - p1.px) / 6, py: p2.py - (p3.py - p1.py) / 6 }),
      p2,
    ]);
  }
  return segments;
}

const cubicAt = ([p1, c1, c2, p2], t) => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return { px: a * p1.px + b * c1.px + c * c2.px + d * p2.px, py: a * p1.py + b * c1.py + c * c2.py + d * p2.py };
};

/** Índice del tramo más cercano a (px, py) dentro del radio, o -1. Muestrea 24 puntos por tramo. */
export function segmentAt(segments, px, py, radius) {
  let best = -1;
  let bestDistance = radius;
  segments.forEach((segment, index) => {
    for (let k = 0; k <= 24; k += 1) {
      const point = cubicAt(segment, k / 24);
      const distance = Math.hypot(point.px - px, point.py - py);
      if (distance <= bestDistance) {
        best = index;
        bestDistance = distance;
      }
    }
  });
  return best;
}

const segmentCommand = ([, c1, c2, end]) => ` C${r(c1.px)} ${r(c1.py)} ${r(c2.px)} ${r(c2.py)} ${r(end.px)} ${r(end.py)}`;

/** Atributo `d` del SVG para tramos seguidos. */
export function segmentsPath(segments) {
  if (!segments.length) return '';
  return `M${r(segments[0][0].px)} ${r(segments[0][0].py)}${segments.map(segmentCommand).join('')}`;
}

/** Atributo `d` del SVG para la ruta entera. */
export const routePath = (points, bounds) => segmentsPath(routeSegments(points, bounds));

/**
 * Tramos de la ruta que se ve (`shown`: índices de pasos; sin él, todos). Con `ahead`, el paso que sigue
 * y todavía no se muestra, el final ya toma la forma de la ruta completa: al sumar el tramo siguiente,
 * los anteriores no se reacomodan. Sirve para Mirar; en Repasar no se usa porque adelantaría hacia dónde sigue.
 */
export function shownSegments(steps, width, height, shown = steps.map((_, index) => index), ahead) {
  const bounds = { width, height };
  const useAhead = Number.isInteger(ahead) && ahead >= 0 && ahead < steps.length && shown.length > 0 && !shown.includes(ahead);
  const segments = routeSegments(routePoints(steps, width, height, useAhead ? [...shown, ahead] : shown), bounds);
  return useAhead ? segments.slice(0, -1) : segments;
}

/** `d` de un solo tramo, para animarlo aparte. */
export const segmentPath = (segment) => `M${r(segment[0].px)} ${r(segment[0].py)}${segmentCommand(segment)}`;

/** Punto y ángulo (grados) en la mitad de un tramo, para la punta de flecha. */
export function segmentMiddle([p1, c1, c2, p2]) {
  const px = (p1.px + 3 * c1.px + 3 * c2.px + p2.px) / 8;
  const py = (p1.py + 3 * c1.py + 3 * c2.py + p2.py) / 8;
  const dx = p2.px + c2.px - c1.px - p1.px;
  const dy = p2.py + c2.py - c1.py - p1.py;
  return { px, py, angle: (Math.atan2(dy, dx) * 180) / Math.PI };
}
