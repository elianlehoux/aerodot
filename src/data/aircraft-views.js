/**
 * Los tres dibujos de /ingles/aeronave, en unidades de un viewBox de 840 × 480.
 * El avión es de práctica (ala alta, monomotor, matrícula LV-DEM): no es un modelo real.
 *
 * Cada vista es una lista de capas, de atrás hacia adelante:
 *   { cls, d }               dibujo suelto
 *   { cls, html }            dibujo suelto en SVG a mano
 *   { word, cls, d, ... }    pieza que se toca: d dibuja, resalta y recibe el toque
 * Opciones de una pieza: hit (zona para tocar, si la pieza es chica), z (qué zona queda arriba),
 * html (detalles encima), move ({ anim, origin, sw, hk }: cómo se mueve al elegirla; hk es lo que se inclina
 * la bisagra, en grados, para que una pieza de bisagra oblicua se encoja sin despegarse de ella).
 */

const circle = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;

const box = (x, y, w, h, r = 0) => (r
  ? `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`
  : `M${x} ${y}H${x + w}V${y + h}H${x}Z`);

const round = (n) => Math.round(n * 10) / 10;

/** Ángulo en grados, en sentido horario desde las 12. */
const polar = (cx, cy, r, deg) => {
  const rad = (deg * Math.PI) / 180;
  return [round(cx + r * Math.sin(rad)), round(cy - r * Math.cos(rad))];
};

const ticks = (cx, cy, outer, inner, from, to, count, cls = 'ac-tick') => {
  let d = '';
  for (let index = 0; index <= count; index += 1) {
    const deg = from + ((to - from) * index) / count;
    const [x1, y1] = polar(cx, cy, outer, deg);
    const [x2, y2] = polar(cx, cy, inner, deg);
    d += `M${x1} ${y1}L${x2} ${y2}`;
  }
  return `<path class="${cls}" d="${d}"/>`;
};

const arc = (cx, cy, r, from, to, cls) => {
  const [x1, y1] = polar(cx, cy, r, from);
  const [x2, y2] = polar(cx, cy, r, to);
  return `<path class="${cls}" d="M${x1} ${y1}A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2}"/>`;
};

const label = (x, y, text, cls = 'ac-gtext') => `<text class="${cls}" x="${x}" y="${y}">${text}</text>`;

/** Una aguja: dibujada hacia las 12 y girada con un atributo; lo que se anima es el hijo. */
const needle = (cx, cy, length, deg, move, { sw = 14, cls = 'ac-needle' } = {}) =>
  `<g transform="rotate(${deg} ${cx} ${cy})"><path class="${cls}" data-move="${move}" data-anim="wobble" style="transform-origin:${cx}px ${cy}px;--sw:${sw}deg" d="M${cx} ${cy + 5}V${cy - length}"/></g>`;

const bezel = (cx, cy) => `<circle class="ac-dial" cx="${cx}" cy="${cy}" r="43"/>`;

/** Un instrumento redondo de la cabina. */
const gauge = (word, cx, cy, face) => ({
  word,
  cls: 'ac-bezel',
  d: circle(cx, cy, 50),
  hit: circle(cx, cy, 54),
  z: 3,
  html: `${bezel(cx, cy)}${face}<circle class="ac-cap" cx="${cx}" cy="${cy}" r="3"/>`,
});

/** Silueta de avión vista desde arriba, centrada en cx, cy. */
const plane = (cx, cy, scale = 1) => {
  const points = [[0, -15], [3, -5], [14, 3], [14, 6], [3, 2], [3, 9], [8, 13], [8, 15], [0, 13], [-8, 15], [-8, 13], [-3, 9], [-3, 2], [-14, 6], [-14, 3], [-3, -5]];
  return `M${points.map(([x, y]) => `${round(cx + x * scale)} ${round(cy + y * scale)}`).join('L')}Z`;
};

/* ───────────── Proporciones ─────────────
 * Las vistas de costado y de arriba se dibujan con las medidas de una foto de un monomotor de ala alta
 * (tipo Cessna 172) y se llevan al viewBox con estas dos escalas.
 */

const PAIR = /(-?\d+(?:\.\d+)?)[ ,](-?\d+(?:\.\d+)?)/g;
const fit = (fx, fy) => (d) => d.replace(PAIR, (_, x, y) => `${fx(+x)} ${fy(+y)}`);
/** Espeja un dibujo respecto del eje del avión (y = 410). */
const mirror = (d) => d.replace(PAIR, (_, x, y) => `${x} ${820 - +y}`);

/* ───────────── De costado ───────────── */

const SIDE = 0.65;
const sx = (x) => round(70 + (x - 75) * SIDE);
const sy = (y) => round(400 - (467 - y) * SIDE);
const S = fit(sx, sy);
const sCircle = (cx, cy, r) => circle(sx(cx), sy(cy), round(r * SIDE));
const sBox = (x, y, w, h, r = 0) => box(sx(x), sy(y), round(w * SIDE), round(h * SIDE), r);
const sHub = (cx, cy, r) => `<circle class="ac-hub" cx="${sx(cx)}" cy="${sy(cy)}" r="${round(r * SIDE)}"/>`;

const sideLayers = [
  { cls: 'ac-shadow', d: 'M100 404a330 7 0 1 0 660 0a330 7 0 1 0 -660 0Z' },
  { cls: 'ac-groundline', d: 'M40 400H800' },

  {
    word: 'maingear',
    cls: 'ac-gear',
    d: [S('M492 384 L516 384 L512 414 L497 414 Z'), sCircle(502, 438, 29)],
    hit: sBox(470, 380, 64, 90, 8),
    z: 3,
    html: sHub(502, 438, 11),
  },
  {
    word: 'nosegear',
    cls: 'ac-gear',
    d: [S('M232 384 L248 384 L246 420 L236 420 Z'), sCircle(240, 445, 22)],
    hit: sBox(212, 380, 56, 90, 8),
    z: 3,
    html: sHub(240, 445, 8),
  },
  {
    word: 'propeller',
    cls: 'ac-prop',
    d: S('M97 152 Q101 146 105 152 L107 271 L105 392 Q101 398 97 392 L95 271 Z'),
    hit: sBox(84, 138, 34, 270),
    z: 1,
    move: { anim: 'spin', origin: [sx(101), sy(271)] },
  },

  {
    word: 'fuselage',
    cls: 'ac-body',
    d: S('M112 258 Q125 245 160 243 L268 237 L296 236 L342 200 L640 206 Q672 218 700 243 L850 262 L1100 287 L1100 297 L950 303 Q800 345 640 372 L520 382 L260 384 Q190 380 150 345 Q112 300 112 258 Z'),
    z: 0,
  },
  {
    word: 'cowling',
    cls: 'ac-cowl',
    d: S('M112 258 Q125 245 160 243 L268 237 L268 384 L260 384 Q190 380 150 345 Q112 300 112 258 Z'),
    z: 2,
    html: `<path class="ac-line" d="${S('M268 237 L268 382')}"/><path class="ac-line" d="${S('M205 352 L245 360 M210 344 L250 352')}"/>`,
  },
  {
    word: 'spinner',
    cls: 'ac-soft2',
    d: S('M75 271 Q92 258 114 254 L114 288 Q92 284 75 271 Z'),
    hit: sBox(70, 250, 48, 42, 10),
    z: 5,
  },
  {
    word: 'door',
    cls: 'ac-soft',
    d: S('M388 220 L514 220 L518 354 L392 354 Z'),
    z: 2,
    html: `<path class="ac-glass" d="${S('M402 230 Q402 226 408 226 L494 226 Q500 226 500 232 L502 262 Q502 266 497 266 L408 266 Q403 266 403 262 Z')}"/><rect class="ac-handle" x="${sx(488)}" y="${sy(300)}" width="${round(22 * SIDE)}" height="${round(6 * SIDE)}" rx="2"/>`,
  },
  { cls: 'ac-glass', d: S('M540 230 Q540 226 546 226 L612 226 Q618 226 620 232 L628 262 Q629 266 624 266 L546 266 Q541 266 541 262 Z') },
  {
    word: 'windshield',
    cls: 'ac-glass',
    d: S('M292 240 Q316 218 338 209 L362 209 L362 254 L300 248 Z'),
    hit: sBox(284, 200, 84, 60, 6),
    z: 4,
  },
  { cls: 'ac-soft', d: S('M364 214 L380 214 L376 382 L362 382 Z') },
  {
    word: 'wing',
    cls: 'ac-body',
    d: S('M246 200 Q248 186 300 183 L600 191 Q664 196 664 204 Q650 214 600 214 L300 215 Q246 214 246 200 Z'),
    hit: sBox(240, 176, 430, 46, 8),
    z: 2,
  },

  { word: 'fin', cls: 'ac-body', d: S('M862 262 Q1000 252 1052 150 L1085 94 L1118 94 L1092 287 L960 291 Z'), z: 2 },
  {
    word: 'rudder',
    cls: 'ac-move',
    d: S('M1118 94 L1152 96 L1108 287 L1092 287 Z'),
    hit: sBox(1086, 88, 72, 204, 6),
    z: 4,
    move: { anim: 'squeeze', origin: [sx(1112.5), sy(190)], hk: -3 },
  },
  {
    word: 'hstab',
    cls: 'ac-body',
    d: S('M956 285 Q1060 287 1172 293 L1176 297 Q1060 302 956 303 Z'),
    hit: sBox(950, 274, 230, 38, 8),
    z: 4,
  },
  {
    word: 'elevator',
    cls: 'ac-move',
    d: S('M1104 292 L1172 293 L1176 297 L1104 300 Z'),
    hit: sBox(1098, 278, 86, 34, 8),
    z: 5,
    move: { anim: 'wobble', origin: [sx(1104), sy(296)], sw: 22 },
  },

  { cls: 'ac-reg', html: `<text class="ac-regtext" x="${sx(715)}" y="${sy(314)}">LV-DEM</text>` },
];

/* ───────────── Desde arriba ───────────── */

const TOP = 0.6;
const tx = (x) => round(270 + (x - 140) * TOP);
const ty = (y) => round(240 + (y - 410) * TOP);
const T = fit(tx, ty);
const both = (d) => [T(d), T(mirror(d))];
const tCircle = (cx, cy, r) => circle(tx(cx), ty(cy), round(r * TOP));
const tBox = (x, y, w, h, r = 0) => box(tx(x), ty(y), round(w * TOP), round(h * TOP), r);

const wingTop = 'M262 68 L322 68 Q334 70 336 84 L360 260 L368 376 L368 444 L360 560 L336 736 Q334 750 322 752 L262 752 Q250 752 250 740 L250 80 Q250 68 262 68 Z';
const tipTop = 'M250 82 Q250 68 262 68 L322 68 Q334 70 336 84 L333 102 L251 102 Z';

const topLayers = [
  { cls: 'ac-prop', d: T('M138 350 Q141 346 144 350 L145 410 L144 470 Q141 474 138 470 L137 410 Z') },
  {
    word: 'fuselage',
    cls: 'ac-body',
    d: T('M162 386 Q150 410 162 434 L200 440 L250 441 L368 446 L430 433 L600 414 L604 410 L600 406 L430 387 L368 374 L250 379 L200 380 Z'),
    z: 0,
  },
  {
    word: 'cowling',
    cls: 'ac-cowl',
    d: T('M162 386 Q150 410 162 434 L200 440 L250 441 L250 379 L200 380 Z'),
    z: 1,
    html: `<path class="ac-line" d="${T('M250 379 L250 441')}"/>`,
  },
  { cls: 'ac-soft2', d: tCircle(143, 410, 8) },
  { cls: 'ac-glass', d: T('M226 388 Q246 410 226 432 L250 438 L250 382 Z') },
  { cls: 'ac-glass', d: both('M384 382 Q400 384 402 394 L400 404 L386 404 Z') },

  {
    word: 'hstab',
    cls: 'ac-body',
    d: T('M548 408 L534 318 Q534 308 544 306 L598 306 L598 514 L544 514 Q534 512 534 502 L548 412 Z'),
    z: 2,
  },
  {
    word: 'elevator',
    cls: 'ac-move',
    d: T('M570 306 L598 306 L598 514 L570 514 Z'),
    z: 3,
    move: { anim: 'squeeze', origin: [tx(570), ty(410)] },
  },
  { cls: 'ac-soft2', d: T('M540 407 L604 407 L604 413 L540 413 Z') },

  { word: 'wing', cls: 'ac-body', d: T(wingTop), z: 1 },
  {
    word: 'leadingedge',
    cls: 'ac-edge',
    d: both('M250 82 Q250 70 262 68 L268 68 L268 376 L250 376 Z'),
    z: 2,
  },
  {
    word: 'flap',
    cls: 'ac-move',
    d: T('M343 264 L361 264 L367 374 L347 374 Z'),
    z: 3,
    move: { anim: 'squeeze', origin: [tx(343), ty(264)], hk: 2.1 },
  },
  {
    word: 'flap',
    cls: 'ac-move',
    d: T(mirror('M343 264 L361 264 L367 374 L347 374 Z')),
    z: 3,
    move: { anim: 'squeeze', origin: [tx(343), ty(556)], hk: -2.1 },
  },
  {
    word: 'aileron',
    cls: 'ac-move',
    d: T('M318 102 L337 102 L360 260 L341 260 Z'),
    z: 3,
    move: { anim: 'squeeze', origin: [tx(318), ty(102)], hk: 8.3 },
  },
  {
    word: 'aileron',
    cls: 'ac-move',
    d: T(mirror('M318 102 L337 102 L360 260 L341 260 Z')),
    z: 3,
    move: { anim: 'squeeze', origin: [tx(318), ty(718)], hk: -8.3 },
  },
  {
    word: 'wingtip',
    cls: 'ac-tip-g',
    d: T(tipTop),
    hit: tBox(244, 60, 100, 52, 8),
    z: 4,
  },
  {
    word: 'wingtip',
    cls: 'ac-tip-r',
    d: T(mirror(tipTop)),
    hit: tBox(244, 708, 100, 52, 8),
    z: 4,
  },
  {
    word: 'fuelcap',
    cls: 'ac-cap-fuel',
    d: [tCircle(277, 355, 6), tCircle(277, 465, 6)],
    hit: [tCircle(277, 355, 22), tCircle(277, 465, 22)],
    z: 5,
  },
  {
    word: 'pitot',
    cls: 'ac-pitot',
    d: tBox(228, 556, 26, 8, 4),
    hit: tCircle(240, 560, 32),
    z: 6,
  },
  { cls: 'ac-note', html: '<text class="ac-notetext" x="440" y="44">DERECHA · luz verde</text><text class="ac-notetext" x="440" y="446">IZQUIERDA · luz roja</text>' },
];

/* ───────────── La cabina ───────────── */

const panelLayers = [
  { word: 'panel', cls: 'ac-board', d: box(40, 70, 760, 326, 26), z: 0 },
  { cls: 'ac-glare', d: 'M34 94Q34 64 420 62Q806 64 806 94L798 99Q420 84 42 99Z' },

  gauge('asi', 170, 160, `${arc(170, 160, 37, 66, 232, 'ac-arc-g')}${arc(170, 160, 41, 40, 66, 'ac-arc-w')}${ticks(170, 160, 43, 37, 40, 320, 14)}${label(170, 184, 'KT')}${needle(170, 160, 33, 118, 'asi', { sw: 12 })}`),
  gauge('attitude', 290, 160, `<g transform="rotate(-9 290 160)"><g data-move="attitude" data-anim="wobble" style="transform-origin:290px 160px;--sw:12deg"><path class="ac-sky" d="M250 160A40 40 0 0 1 330 160Z"/><path class="ac-earth" d="M250 160A40 40 0 0 0 330 160Z"/><path class="ac-horizon" d="M250 160H330"/></g></g>${ticks(290, 160, 43, 39, -60, 60, 6)}<path class="ac-symbol" d="M262 166H280L290 174L300 166H318"/>`),
  gauge('altimeter', 410, 160, `${ticks(410, 160, 43, 37, 0, 324, 10)}${Array.from({ length: 10 }, (_, index) => {
    const [x, y] = polar(410, 160, 29, index * 36);
    return label(x, y, String(index));
  }).join('')}${needle(410, 160, 20, 64, 'altimeter', { cls: 'ac-needle is-short', sw: 20 })}${needle(410, 160, 35, 196, 'altimeter', { sw: 20 })}`),
  gauge('turn', 170, 280, `${label(138, 296, 'L')}${label(202, 296, 'R')}<g transform="rotate(-12 170 280)"><g data-move="turn" data-anim="wobble" style="transform-origin:170px 280px;--sw:16deg"><path class="ac-symbol" d="M140 276L170 280L200 276M170 264V284"/></g></g><path class="ac-tube" d="M144 304Q170 314 196 304"/><circle class="ac-ball" cx="172" cy="309" r="4.5"/>`),
  gauge('heading', 290, 280, `<g data-move="heading" data-anim="wobble" style="transform-origin:290px 280px;--sw:28deg"><g transform="rotate(-30 290 280)">${ticks(290, 280, 42, 38, 0, 350, 35)}${ticks(290, 280, 42, 34, 0, 330, 11)}${label(290, 253, 'N')}${label(317, 280, 'E')}${label(290, 307, 'S')}${label(263, 280, 'W')}</g></g><path class="ac-symbol is-fill" d="${plane(290, 280, 1.15)}"/>`),
  gauge('vsi', 410, 280, `${ticks(410, 280, 43, 37, 195, 255, 4)}${ticks(410, 280, 43, 37, 285, 345, 4)}<path class="ac-tick" d="M367 280H378" style="stroke-width:3"/>${label(424, 262, 'UP')}${label(424, 302, 'DN')}${needle(410, 280, 33, 284, 'vsi', { sw: 12 })}`),
  gauge('tach', 700, 160, `${arc(700, 160, 38, 160, 250, 'ac-arc-g')}${ticks(700, 160, 43, 37, 40, 320, 14)}<path class="ac-tick is-red" d="M${polar(700, 160, 43, 300).join(' ')}L${polar(700, 160, 33, 300).join(' ')}"/>${label(700, 184, 'RPM')}${needle(700, 160, 33, 218, 'tach', { sw: 14 })}`),

  { cls: 'ac-bezel', d: circle(700, 280, 50), html: `${bezel(700, 280)}${label(700, 262, 'OIL')}<path class="ac-bar" d="M676 272H724"/>${label(700, 292, 'FUEL')}<path class="ac-bar" d="M676 302H724"/><circle class="ac-cap" cx="700" cy="280" r="0"/>` },

  {
    word: 'radio',
    cls: 'ac-radio',
    d: box(480, 100, 150, 56, 8),
    z: 3,
    html: `<rect class="ac-lcd" x="490" y="109" width="80" height="24" rx="3"/>${label(530, 122, '123.45', 'ac-lcdtext')}${label(497, 146, 'COM', 'ac-gtext is-left')}<circle class="ac-knob-s" cx="598" cy="128" r="11"/>`,
  },
  {
    word: 'transponder',
    cls: 'ac-radio',
    d: box(480, 172, 150, 56, 8),
    z: 3,
    html: `<rect class="ac-lcd" x="490" y="181" width="80" height="24" rx="3"/>${label(530, 194, '1200', 'ac-lcdtext')}${label(497, 218, 'XPDR', 'ac-gtext is-left')}<circle class="ac-knob-s" cx="598" cy="200" r="11"/>`,
  },
  {
    word: 'master',
    cls: 'ac-radio',
    d: box(82, 334, 34, 46, 7),
    hit: box(70, 316, 58, 72, 10),
    z: 3,
    html: `${label(99, 326, 'MASTER')}<path class="ac-toggle" d="M99 344V358"/><circle class="ac-knob-s" cx="99" cy="341" r="5"/>`,
  },
  {
    word: 'throttle',
    cls: 'ac-knob',
    d: [box(536, 352, 8, 44), circle(540, 340, 16)],
    hit: box(514, 318, 52, 82, 8),
    z: 3,
    html: label(540, 312, 'THR'),
  },
  {
    word: 'mixture',
    cls: 'ac-knob is-red',
    d: [box(596, 352, 8, 44), circle(600, 340, 16)],
    hit: box(574, 318, 52, 82, 8),
    z: 3,
    html: label(600, 312, 'MIX'),
  },

  { cls: 'ac-column', d: box(292, 430, 16, 50) },
  {
    word: 'yoke',
    cls: 'ac-yoke',
    d: 'M244 352H262V408Q262 418 272 418H328Q338 418 338 408V352H356V412Q356 436 332 436H268Q244 436 244 412Z',
    hit: box(236, 344, 128, 136, 12),
    z: 4,
    move: { anim: 'wobble', origin: [300, 440], sw: 14 },
  },
];

export const aircraftViews = [
  { id: 'side', label: 'De costado', caption: 'LV-DEM · VISTA LATERAL', layers: sideLayers },
  { id: 'top', label: 'Desde arriba', caption: 'LV-DEM · VISTA SUPERIOR', layers: topLayers },
  { id: 'panel', label: 'La cabina', caption: 'LV-DEM · PANEL DE INSTRUMENTOS', layers: panelLayers },
];
