/**
 * Los tres dibujos de /ingles/aeronave, en unidades de un viewBox de 840 × 480.
 * El avión es de práctica (ala alta, monomotor, matrícula LV-DEM): no es un modelo real.
 *
 * Cada vista es una lista de capas, de atrás hacia adelante:
 *   { cls, d }               dibujo suelto
 *   { cls, html }            dibujo suelto en SVG a mano
 *   { word, cls, d, ... }    pieza que se toca: d dibuja, resalta y recibe el toque
 * Opciones de una pieza: hit (zona para tocar, si la pieza es chica), z (qué zona queda arriba),
 * html (detalles encima), move ({ anim, origin, sw }: cómo se mueve al elegirla).
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

/* ───────────── De costado ───────────── */

const sideLayers = [
  { cls: 'ac-shadow', d: 'M100 404a330 7 0 1 0 660 0a330 7 0 1 0 -660 0Z' },
  { cls: 'ac-groundline', d: 'M40 400H800' },

  {
    word: 'maingear',
    cls: 'ac-gear',
    d: ['M382 326L406 326L402 372L388 372Z', circle(395, 374, 26)],
    hit: box(366, 336, 58, 66, 8),
    z: 3,
    html: '<circle class="ac-hub" cx="395" cy="374" r="10"/>',
  },
  {
    word: 'nosegear',
    cls: 'ac-gear',
    d: ['M185 328L201 328L197 378L189 378Z', circle(193, 380, 20)],
    hit: box(168, 336, 50, 66, 8),
    z: 3,
    html: '<circle class="ac-hub" cx="193" cy="380" r="7"/>',
  },
  {
    word: 'propeller',
    cls: 'ac-prop',
    d: box(108, 198, 12, 192, 6),
    hit: box(96, 190, 36, 212),
    z: 1,
    move: { anim: 'spin', origin: [114, 294] },
  },

  {
    word: 'fuselage',
    cls: 'ac-body',
    d: 'M235 258L300 256L345 214L470 208Q512 210 530 226L735 270V304L560 326L235 332Z',
    z: 0,
  },
  {
    word: 'cowling',
    cls: 'ac-soft',
    d: 'M135 262L235 258V332L135 326Q118 322 118 294Q118 266 135 262Z',
    z: 2,
    html: '<path class="ac-line" d="M203 278V314M212 278V314M221 278V314"/>',
  },
  {
    word: 'spinner',
    cls: 'ac-soft2',
    d: 'M121 276Q94 294 121 312Z',
    hit: box(86, 264, 48, 60, 12),
    z: 5,
  },
  {
    word: 'door',
    cls: 'ac-soft',
    d: 'M372 211L474 208L482 318L372 321Z',
    z: 2,
    html: '<path class="ac-glass" d="M380 217L468 214L470 256L380 256Z"/><rect class="ac-handle" x="446" y="284" width="18" height="5" rx="2.5"/>',
  },
  { cls: 'ac-glass', d: 'M486 213Q510 215 524 229L500 256L486 256Z' },
  {
    word: 'windshield',
    cls: 'ac-glass',
    d: 'M303 254L345 214L368 213V254Z',
    hit: box(296, 206, 76, 54, 6),
    z: 4,
  },
  {
    word: 'wing',
    cls: 'ac-body',
    d: 'M338 200Q352 190 392 190L478 195Q486 200 478 205L338 207Q332 204 338 200Z',
    hit: box(322, 180, 176, 34, 8),
    z: 2,
  },

  { word: 'fin', cls: 'ac-body', d: 'M612 244L690 150H716V266Z', z: 2 },
  {
    word: 'rudder',
    cls: 'ac-move',
    d: 'M716 150L746 152L752 270L716 266Z',
    z: 4,
    move: { anim: 'squeeze', origin: [716, 210] },
  },
  {
    word: 'hstab',
    cls: 'ac-body',
    d: 'M642 284Q634 287 642 290L718 292V281Z',
    hit: box(626, 268, 94, 36, 8),
    z: 4,
  },
  {
    word: 'elevator',
    cls: 'ac-move',
    d: 'M718 281L756 283.5V289.5L718 292Z',
    hit: box(714, 270, 56, 34, 8),
    z: 5,
    move: { anim: 'wobble', origin: [718, 286.5], sw: 22 },
  },

  { cls: 'ac-reg', html: '<text class="ac-regtext" x="556" y="290">LV-DEM</text>' },
];

/* ───────────── Desde arriba ───────────── */

const topFuselage = 'M118 212L216 206Q240 200 300 198L470 200Q520 204 600 224L742 233V247L600 256Q520 276 470 280L300 282Q240 280 216 274L118 268Q100 266 100 240Q100 214 118 212Z';

const topLayers = [
  { cls: 'ac-prop', d: box(84, 145, 12, 190, 6) },
  { word: 'fuselage', cls: 'ac-body', d: topFuselage, z: 0 },
  {
    word: 'cowling',
    cls: 'ac-soft',
    d: 'M118 212L216 206V274L118 268Q100 266 100 240Q100 214 118 212Z',
    z: 1,
  },
  { cls: 'ac-soft2', d: circle(104, 240, 9) },
  { cls: 'ac-glass', d: 'M228 214Q250 240 228 266L248 266Q268 240 248 214Z' },

  {
    word: 'hstab',
    cls: 'ac-body',
    d: 'M650 228L664 192Q668 188 676 188H706V292H676Q668 292 664 288L650 252Z',
    z: 2,
  },
  {
    word: 'elevator',
    cls: 'ac-move',
    d: box(706, 190, 40, 100),
    z: 3,
    move: { anim: 'squeeze', origin: [706, 240] },
  },
  { cls: 'ac-soft2', d: box(640, 237, 104, 6, 3) },

  {
    word: 'wing',
    cls: 'ac-body',
    d: 'M300 200L304 40Q304 30 314 30H410Q420 30 420 40L440 200V280L420 440Q420 450 410 450H314Q304 450 304 440L300 280Z',
    z: 1,
  },
  {
    word: 'leadingedge',
    cls: 'ac-edge',
    d: ['M300 200L304 40H318L314 200Z', 'M300 280L304 440H318L314 280Z'],
    z: 2,
  },
  {
    word: 'flap',
    cls: 'ac-move',
    d: ['M394 120H430L439.5 196H403.5Z', 'M394 360H430L439.5 284H403.5Z'],
    z: 3,
    move: { anim: 'squeeze', origin: [398, 0] },
  },
  {
    word: 'aileron',
    cls: 'ac-move',
    d: ['M387.25 66H423.25L429.5 116H393.5Z', 'M387.25 414H423.25L429.5 364H393.5Z'],
    z: 3,
    move: { anim: 'squeeze', origin: [390, 0] },
  },
  {
    word: 'wingtip',
    cls: 'ac-tip-g',
    d: 'M303.5 62L304 40Q304 30 314 30H410Q420 30 420 40L422.75 62Z',
    hit: box(298, 22, 132, 46, 8),
    z: 4,
  },
  {
    word: 'wingtip',
    cls: 'ac-tip-r',
    d: 'M303.5 418L304 440Q304 450 314 450H410Q420 450 420 440L422.75 418Z',
    hit: box(298, 412, 132, 46, 8),
    z: 4,
  },
  {
    word: 'fuelcap',
    cls: 'ac-cap-fuel',
    d: [circle(336, 100, 9), circle(336, 380, 9)],
    hit: [circle(336, 100, 26), circle(336, 380, 26)],
    z: 5,
  },
  {
    word: 'pitot',
    cls: 'ac-pitot',
    d: box(280, 377, 28, 7, 3.5),
    hit: circle(294, 380, 34),
    z: 6,
  },
  { cls: 'ac-note', html: '<text class="ac-notetext" x="470" y="44">DERECHA · luz verde</text><text class="ac-notetext" x="470" y="446">IZQUIERDA · luz roja</text>' },
];

/* ───────────── La cabina ───────────── */

const panelLayers = [
  { word: 'panel', cls: 'ac-board', d: box(40, 70, 760, 326, 26), z: 0 },
  { cls: 'ac-glare', d: 'M30 92Q30 30 420 26Q810 30 810 92L800 98Q420 60 40 98Z' },

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
