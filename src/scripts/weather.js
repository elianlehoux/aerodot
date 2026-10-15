import { canSpeak } from './english.js';
import {
  ceilingNote,
  cloudAmounts,
  heightSay,
  kindLabels,
  metars,
  taf,
  weatherPool,
  wxDescriptors,
  wxIntensity,
  wxPhenomena,
  wxRules,
} from '../data/weather.js';

/* El tiempo: leer un METAR sobre un dibujo, armar nubes y fenómenos, recorrer un TAF y rendir la prueba. */

const esc = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const $ = (root, name) => root.querySelector(`[data-${name}]`);
const rad = (deg) => (deg * Math.PI) / 180;
const pad = (value, size) => String(value).padStart(size, '0');
const ordinalEs = (value) => String(value).replace('.', ',');

const sayButton = (text, label = 'Escuchar', quiet = false) => `<button class="en-say${quiet ? ' is-quiet' : ''}" type="button" data-say="${esc(text)}"><svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M3 8v4h3l4 3.5v-11L6 8H3Z" fill="currentColor"/><path class="say-wave" d="M13 7.2a4 4 0 0 1 0 5.6M15.2 5a7 7 0 0 1 0 10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg><span${quiet ? ' class="visually-hidden"' : ''}>${esc(label)}</span></button>`;

const shuffle = (list) => {
  const copy = [...list];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
};

/* ───────────── El dibujo del cielo ───────────── */

const GROUND = 292;
const FT = 0.05; // píxeles por pie
const KM = 0.054; // píxeles por metro
const OBS = 60; // dónde está el observador
const yAt = (ft) => GROUND - ft * FT;

const blob = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-38" y="-16" width="82" height="16" rx="8"/><circle cx="-16" cy="-18" r="15"/><circle cx="6" cy="-27" r="21"/><circle cx="29" cy="-17" r="13"/></g>`;
const tower = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-30" y="-18" width="70" height="18" rx="9"/><circle cx="0" cy="-34" r="26"/><circle cx="16" cy="-62" r="22"/><circle cx="4" cy="-86" r="17"/><ellipse cx="14" cy="-100" rx="52" ry="9"/></g>`;

const CLOUD_X = {
  FEW: [150, 430],
  SCT: [90, 250, 410, 560],
  BKN: [50, 150, 250, 350, 470, 570],
  OVC: [10, 80, 150, 220, 290, 360, 430, 500, 570, 640],
};

const layerSvg = (layer, index, lit) => {
  const y = yAt(layer.ft);
  const xs = CLOUD_X[layer.amount];
  const size = layer.amount === 'OVC' ? 1.45 : layer.amount === 'BKN' ? 1.2 : 1;
  const parts = xs.map((x, position) => (layer.cb && position === xs.length - 2 ? tower(x, y) : blob(x, y, size)));
  const base = layer.amount === 'OVC' ? `<rect x="0" y="${y - 12}" width="640" height="12"/>` : '';
  return `<g class="tm-cloud${layer.cb ? ' is-cb' : ''}${lit ? ' is-ceiling' : ''}" data-part="cloud" data-layer="${index}">${base}${parts.join('')}</g>`;
};

const distanceLabel = (meters) => {
  if (meters >= 10000) return '10 km o más';
  if (meters < 1000) return `${meters} m`;
  return `${ordinalEs(meters / 1000)} km`;
};

const raindrops = (count, top, storm) => {
  const lines = [];
  for (let index = 0; index < count; index += 1) {
    const x = 20 + ((index * 53) % 600);
    const delay = ((index * 37) % 10) / 10;
    lines.push(`<line class="tm-drop" x1="${x}" y1="${top}" x2="${x - 5}" y2="${top + 16}" style="--d:${delay}s"/>`);
  }
  const bolt = storm ? '<path class="tm-bolt" d="M468 150L450 196h14l-10 40 30-52h-15l12-34Z"/>' : '';
  return `<g class="tm-rain" data-part="wx"><clipPath id="wx-rain-clip"><rect x="0" y="${top}" width="640" height="${GROUND - top}"/></clipPath><g clip-path="url(#wx-rain-clip)">${lines.join('')}</g>${bolt}</g>`;
};

/** Qué tan cargado está el cielo. Elige los colores de fondo. */
const moodOf = (scene) => {
  if (scene.fog) return 'fog';
  if (scene.precip === 'storm') return 'storm';
  if (scene.precip || scene.clouds.some((layer) => layer.amount === 'OVC')) return 'grey';
  return 'clear';
};

/** El techo es la capa más baja de BKN u OVC, o la visibilidad vertical. */
const ceilingIndex = (scene) => {
  let best = -1;
  scene.clouds.forEach((layer, index) => {
    if (layer.amount !== 'BKN' && layer.amount !== 'OVC') return;
    if (best < 0 || layer.ft < scene.clouds[best].ft) best = index;
  });
  return best;
};

const skySvg = (scene) => {
  const ceiling = ceilingIndex(scene);
  const layers = scene.clouds
    .map((layer, index) => ({ layer, index }))
    .sort((a, b) => b.layer.ft - a.layer.ft);
  const lowest = scene.clouds.length ? Math.min(...scene.clouds.map((layer) => layer.ft)) : 3000;
  const rainTop = scene.precip ? Math.min(yAt(lowest) + 2, GROUND - 40) : 0;
  const visible = scene.vis < 10000;
  const visX = OBS + Math.min(scene.vis, 10000) * KM;

  const axis = [1000, 2000, 3000, 4000, 5000]
    .map((ft) => `<line class="tm-grid" x1="34" y1="${yAt(ft)}" x2="640" y2="${yAt(ft)}"/><text class="tm-axis" x="8" y="${yAt(ft) + 5}">${ft / 1000}</text>`)
    .join('');

  const trees = Array.from({ length: 10 }, (_, index) => {
    const km = index + 1;
    const x = OBS + km * 1000 * KM;
    const s = 1.25 - km * 0.07;
    return `<path class="tm-tree" d="M${x - 7 * s} ${GROUND}L${x} ${GROUND - 20 * s}L${x + 7 * s} ${GROUND}Z"/>`;
  }).join('');

  const ruler = [0, 2, 4, 6, 8, 10]
    .map((km) => {
      const x = OBS + km * 1000 * KM;
      return `<line class="tm-tick" x1="${x}" y1="${GROUND + 10}" x2="${x}" y2="${GROUND + 18}"/><text class="tm-km" x="${x}" y="${GROUND + 38}" text-anchor="middle">${km}${km === 10 ? ' km' : ''}</text>`;
    })
    .join('');

  const tags = scene.clouds
    .map((layer, index) => {
      const label = `${layer.amount} ${layer.ft}${index === ceiling ? ' · techo' : ''}`;
      const width = 14 + label.length * 8.6;
      const y = yAt(layer.ft);
      return `<g class="tm-tag" data-part="cloud" data-layer="${index}"><rect x="${634 - width}" y="${y - 12}" width="${width}" height="22" rx="11"/><text x="${634 - width / 2}" y="${y + 4}" text-anchor="middle">${label}</text></g>`;
    })
    .join('');

  const vv = scene.vv
    ? `<g class="tm-tag" data-part="cloud" data-layer="0"><rect x="400" y="${yAt(scene.vv) - 34}" width="226" height="24" rx="12"/><text x="513" y="${yAt(scene.vv) - 18}" text-anchor="middle">VV ${scene.vv} ft · techo</text></g><line class="tm-vv" data-part="cloud" data-layer="0" x1="330" y1="${GROUND}" x2="330" y2="${yAt(scene.vv)}"/>`
    : '';

  const sun = scene.sun
    ? `<g class="tm-sun" data-part="vis"><circle cx="560" cy="70" r="24"/>${Array.from({ length: 12 }, (_, index) => {
      const a = rad(index * 30);
      return `<line x1="${560 + Math.cos(a) * 34}" y1="${70 + Math.sin(a) * 34}" x2="${560 + Math.cos(a) * 46}" y2="${70 + Math.sin(a) * 46}"/>`;
    }).join('')}</g>`
    : '';

  const fog = scene.fog
    ? `<g class="tm-fog" data-part="wx"><rect x="-40" y="40" width="720" height="${GROUND - 40}" fill="url(#wx-fog-grad)"/><rect class="tm-fog-band" x="-60" y="${GROUND - 70}" width="560" height="26" rx="13"/><rect class="tm-fog-band is-slow" x="160" y="${GROUND - 120}" width="560" height="22" rx="11"/><rect class="tm-fog-band" x="-120" y="${GROUND - 36}" width="620" height="22" rx="11"/></g>`
    : '';

  const veil = visible
    ? `<g class="tm-veil" data-part="vis"><rect x="${visX - 70}" y="0" width="${720 - visX}" height="${GROUND}" fill="url(#wx-veil-grad)" mask="url(#wx-veil-mask)"/><line class="tm-visline" x1="${visX}" y1="${GROUND - 18}" x2="${visX}" y2="${GROUND + 8}"/></g>`
    : '';

  const marker = `<g class="tm-vismark" data-part="vis"><rect x="${Math.min(Math.max(visX, 80), 584) - 42}" y="${GROUND + 44}" width="84" height="22" rx="11"/><text x="${Math.min(Math.max(visX, 80), 584)}" y="${GROUND + 59}" text-anchor="middle">${distanceLabel(scene.vis >= 9999 ? 10000 : scene.vis)}</text></g>`;

  return `<svg viewBox="0 0 640 372" role="img" aria-label="Dibujo del cielo, la visibilidad y las nubes del parte" data-mood="${moodOf(scene)}">
    <defs>
      <linearGradient id="wx-sky-grad" x1="0" y1="0" x2="0" y2="1"><stop class="tm-sky-a" offset="0"/><stop class="tm-sky-b" offset="1"/></linearGradient>
      <linearGradient id="wx-veil-grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="var(--tm-veil)" stop-opacity="0"/><stop offset="0.1" stop-color="var(--tm-veil)" stop-opacity=".92"/><stop offset="1" stop-color="var(--tm-veil)" stop-opacity=".92"/></linearGradient>
      <linearGradient id="wx-veil-v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset=".45" stop-color="#fff"/><stop offset="1" stop-color="#fff"/></linearGradient>
      <mask id="wx-veil-mask"><rect x="0" y="0" width="720" height="372" fill="url(#wx-veil-v)"/></mask>
      <linearGradient id="wx-fog-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--tm-veil)" stop-opacity=".55"/><stop offset="1" stop-color="var(--tm-veil)" stop-opacity=".9"/></linearGradient>
    </defs>
    <rect class="tm-sky" width="640" height="${GROUND}" fill="url(#wx-sky-grad)"/>
    ${axis}
    <text class="tm-axis is-unit" x="8" y="22">miles de pies</text>
    ${sun}
    ${layers.map(({ layer, index }) => layerSvg(layer, index, index === ceiling)).join('')}
    ${scene.precip ? raindrops(scene.precip === 'storm' ? 34 : 22, rainTop, scene.precip === 'storm') : ''}
    <rect class="tm-ground" y="${GROUND}" width="640" height="80"/>
    <g data-part="vis">${trees}</g>
    <g class="tm-obs"><rect x="${OBS - 4}" y="${GROUND - 44}" width="8" height="44"/><rect x="${OBS - 11}" y="${GROUND - 56}" width="22" height="13" rx="3"/></g>
    ${fog}
    ${veil}
    <g data-part="vis">${ruler}</g>
    ${marker}
    ${tags}
    ${vv}
  </svg>`;
};

/* ───────────── Los instrumentos ───────────── */

/** Viento contra la pista: cuánto sopla de frente y cuánto de costado. */
const windParts = (wind, runway) => {
  const hdg = runway * 10;
  const rel = ((wind.dir - hdg + 540) % 360) - 180;
  const pieces = (speed) => ({
    head: Math.round(speed * Math.cos(rad(rel))),
    cross: Math.round(Math.abs(speed * Math.sin(rad(rel)))),
  });
  return { rel, side: Math.sin(rad(rel)) >= 0 ? 'derecha' : 'izquierda', steady: pieces(wind.spd), gust: wind.gust ? pieces(wind.gust) : null };
};

const windSentence = (wind, runway) => {
  if (!wind.spd) return 'Sin viento: no hay ni frente ni costado.';
  const { side, steady, gust } = windParts(wind, runway);
  const text = (item) => `${Math.abs(item.head)} kt ${item.head >= 0 ? 'de frente' : 'en cola'} y ${item.cross} kt de costado`;
  return `Con la pista ${runway}: ${text(steady)}, por la ${side}.${gust ? ` Con ráfagas: ${text(gust)}.` : ''}`;
};

const windDial = (wind, runway) => {
  const hdg = runway * 10;
  const reciprocal = (hdg + 180) % 360;
  const at = (deg, radius) => [100 + Math.sin(rad(deg)) * radius, 100 - Math.cos(rad(deg)) * radius];
  const [x1, y1] = at(hdg, -78);
  const [x2, y2] = at(hdg, 78);
  const [tx, ty] = at(hdg, -92);
  const [ux, uy] = at(reciprocal, -92);
  const ticks = Array.from({ length: 12 }, (_, index) => {
    const [a, b] = at(index * 30, 76);
    const [c, d] = at(index * 30, index % 3 ? 82 : 88);
    return `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}"/>`;
  }).join('');
  let arrow = '<circle class="wd-calm" cx="100" cy="100" r="14"/><text class="wd-calm-text" x="100" y="136" text-anchor="middle">calma</text>';
  if (wind.spd) {
    const [sx, sy] = at(wind.dir, 80);
    const [ex, ey] = at(wind.dir, 22);
    const [bx, by] = at(wind.dir, 36);
    const [lx, ly] = [bx + Math.cos(rad(wind.dir)) * 8, by + Math.sin(rad(wind.dir)) * 8];
    const [rx, ry] = [bx - Math.cos(rad(wind.dir)) * 8, by - Math.sin(rad(wind.dir)) * 8];
    const gust = wind.gust ? (() => { const [gx, gy] = at(wind.dir, 92); return `<line class="wd-gust" x1="${gx}" y1="${gy}" x2="${sx}" y2="${sy}"/>`; })() : '';
    arrow = `${gust}<line class="wd-arrow" x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}"/><path class="wd-head" d="M${ex} ${ey}L${lx} ${ly}L${rx} ${ry}Z"/>`;
  }
  return `<svg viewBox="-6 -8 212 216" aria-hidden="true">
    <circle class="wd-ring" cx="100" cy="100" r="76"/>
    <g class="wd-ticks">${ticks}</g>
    <text class="wd-n" x="100" y="-1" text-anchor="middle">N</text>
    <line class="wd-rwy" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>
    <line class="wd-rwy-line" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>
    <text class="wd-rwy-n" x="${tx}" y="${ty + 4}" text-anchor="middle">${pad(runway, 2)}</text>
    <text class="wd-rwy-n" x="${ux}" y="${uy + 4}" text-anchor="middle">${pad(reciprocal / 10, 2)}</text>
    ${arrow}
  </svg>`;
};

const tempBars = (scene) => {
  const min = -5;
  const max = 40;
  const pct = (value) => Math.max(2, Math.min(100, ((value - min) / (max - min)) * 100));
  const spread = scene.temp - scene.dew;
  const note = spread <= 2
    ? 'Casi iguales: el aire está saturado. Hay niebla o puede formarse.'
    : spread <= 4
      ? 'Se acercan: puede haber niebla o nubes bajas.'
      : 'Hay diferencia: el aire está seco.';
  return `<div class="wd-bars">
    <p class="wd-bar"><span>Temp.</span><i style="--w:${pct(scene.temp)}%"></i><b>${scene.temp} °C</b></p>
    <p class="wd-bar is-dew"><span>Rocío</span><i style="--w:${pct(scene.dew)}%"></i><b>${scene.dew} °C</b></p>
  </div><p class="wd-note">${note}</p>`;
};

const qnhGauge = (hpa) => {
  const min = 980;
  const max = 1040;
  const point = (value, radius) => {
    const t = (Math.max(min, Math.min(max, value)) - min) / (max - min);
    const a = Math.PI - t * Math.PI;
    return [100 + Math.cos(a) * radius, 100 - Math.sin(a) * radius];
  };
  const [nx, ny] = point(hpa, 66);
  const [sx, sy] = point(1013, 58);
  const [sx2, sy2] = point(1013, 84);
  const [lx, ly] = point(1013, 96);
  const inches = Math.round((hpa / 33.8639) * 100);
  return `<svg viewBox="0 0 200 128" aria-hidden="true">
    <path class="qd-arc" d="M20 100A80 80 0 0 1 180 100"/>
    <line class="qd-std" x1="${sx}" y1="${sy}" x2="${sx2}" y2="${sy2}"/>
    <text class="qd-std-label" x="${lx}" y="${ly + 2}" text-anchor="middle">1013</text>
    <text class="qd-end" x="20" y="120" text-anchor="middle">980</text>
    <text class="qd-end" x="180" y="120" text-anchor="middle">1040</text>
    <line class="qd-needle" x1="100" y1="100" x2="${nx}" y2="${ny}"/>
    <circle class="qd-hub" cx="100" cy="100" r="6"/>
  </svg><p class="qd-value"><b>${hpa}</b> hPa</p><p class="wd-note">En EE.UU. se da en pulgadas: A${inches}.</p>`;
};

/* ───────────── El lector de METAR ───────────── */

const mountReader = () => {
  const root = document.querySelector('[data-wx-reader]');
  if (!root) return;
  const presetBox = $(root, 'wx-presets');
  const tokenBox = $(root, 'wx-tokens');
  const skyBox = $(root, 'wx-sky');
  const panel = $(root, 'wx-panel');
  const listenAll = $(root, 'wx-all');
  const note = $(root, 'wx-note');
  const dials = {
    wind: root.querySelector('[data-wx-dial="wind"] [data-wx-dial-body]'),
    temp: root.querySelector('[data-wx-dial="temp"] [data-wx-dial-body]'),
    qnh: root.querySelector('[data-wx-dial="qnh"] [data-wx-dial-body]'),
  };
  const dialButtons = [...root.querySelectorAll('[data-wx-dial]')];

  let preset = metars[0];
  let selected = 2;

  const extraFor = (token) => {
    const scene = preset.scene;
    if (token.kind === 'wind') return `<p class="wx-extra">${windSentence(scene.wind, preset.runway)}</p>`;
    if (token.kind === 'time') return '<p class="wx-extra">La Z es la hora de Greenwich. En Argentina son 3 horas menos: 15:00 UTC son las 12:00.</p>';
    if (token.kind === 'cloud') {
      const layer = scene.clouds[token.layer];
      if (token.code.startsWith('VV')) return '<p class="wx-extra">Cuando el cielo no se ve, no se dan nubes: se da cuánto se ve hacia arriba. Hace de techo.</p>';
      const isCeiling = layer && (layer.amount === 'BKN' || layer.amount === 'OVC') && ceilingIndex(scene) === token.layer;
      return `<p class="wx-extra">${isCeiling ? 'Esta capa es el techo: la más baja que cubre 5 octas o más.' : ceilingNote}</p>`;
    }
    if (token.kind === 'temp') {
      const spread = scene.temp - scene.dew;
      return `<p class="wx-extra">La diferencia entre las dos es de ${spread} °C. ${spread <= 3 ? 'Es poca: mirá la niebla y las nubes bajas.' : 'Cuando se acercan, el aire se satura y aparece niebla o nube.'}</p>`;
    }
    if (token.kind === 'vis' && token.code === 'CAVOK') return '<p class="wx-extra">Si ves CAVOK, no hace falta leer visibilidad, nubes ni tiempo: no hay nada que importe.</p>';
    return '';
  };

  const paintPanel = () => {
    const token = preset.tokens[selected];
    const last = selected === preset.tokens.length - 1;
    panel.innerHTML = `
      <p class="card-kicker">${kindLabels[token.kind]} · grupo ${selected + 1} de ${preset.tokens.length}</p>
      <div class="wx-code"><code lang="en">${esc(token.code)}</code></div>
      <p class="wx-es">${esc(token.es)}</p>
      <dl class="wx-parts">${token.parts.map(([piece, meaning]) => `<div><dt lang="en">${esc(piece)}</dt><dd>${esc(meaning)}</dd></div>`).join('')}</dl>
      ${extraFor(token)}
      <div class="word-say"><p lang="en">“${esc(token.say)}”</p>${sayButton(token.say, 'Escuchar')}</div>
      <div class="wx-nav">
        <button class="button-quiet" type="button" data-wx-step="-1"${selected === 0 ? ' disabled' : ''}>← Anterior</button>
        <button class="button-primary" type="button" data-wx-step="1">${last ? 'Volver al inicio' : 'Siguiente grupo →'}</button>
      </div>`;
  };

  const paintFocus = () => {
    const token = preset.tokens[selected];
    const svg = skyBox.querySelector('svg');
    const sky = ['vis', 'wx', 'cloud'].includes(token.kind);
    if (svg) {
      svg.querySelectorAll('[data-part]').forEach((part) => {
        const same = part.dataset.part === token.kind && (token.kind !== 'cloud' || part.dataset.layer === undefined || Number(part.dataset.layer) === token.layer);
        part.classList.toggle('is-dim', sky && !same);
        part.classList.toggle('is-lit', sky && same);
      });
    }
    dialButtons.forEach((dial) => dial.classList.toggle('is-lit', dial.dataset.wxDial === token.kind || (dial.dataset.wxDial === 'temp' && token.kind === 'temp')));
    [...tokenBox.children].forEach((button, index) => button.setAttribute('aria-pressed', String(index === selected)));
  };

  const select = (index) => {
    selected = (index + preset.tokens.length) % preset.tokens.length;
    paintPanel();
    paintFocus();
  };

  const paintScene = () => {
    const scene = preset.scene;
    skyBox.innerHTML = skySvg(scene);
    dials.wind.innerHTML = `${windDial(scene.wind, preset.runway)}<p class="wd-note">${scene.wind.spd ? `${scene.wind.spd} kt${scene.wind.gust ? `, ráfagas de ${scene.wind.gust}` : ''}, desde los ${pad(scene.wind.dir, 3)}°` : 'Viento calmo'}. Pista ${preset.runway}.</p>`;
    dials.temp.innerHTML = tempBars(scene);
    dials.qnh.innerHTML = qnhGauge(scene.qnh);
  };

  const paintAll = () => {
    note.textContent = preset.note;
    listenAll.dataset.say = preset.tokens.map((token) => token.say).join('. ');
    tokenBox.innerHTML = preset.tokens
      .map((token, index) => `<button class="wx-token" type="button" data-token="${index}" data-kind="${token.kind}" aria-pressed="false" aria-label="${kindLabels[token.kind]}: ${esc(token.code)}"><b lang="en">${esc(token.code)}</b><small>${kindLabels[token.kind]}</small></button>`)
      .join('');
    paintScene();
    selected = Math.max(0, preset.tokens.findIndex((token) => token.kind === 'wind'));
    paintPanel();
    paintFocus();
  };

  presetBox.innerHTML = metars.map((item, index) => `<button type="button" data-preset="${item.id}" aria-pressed="${index === 0}">${item.label}</button>`).join('');
  presetBox.addEventListener('click', (event) => {
    const button = event.target.closest('[data-preset]');
    if (!button) return;
    preset = metars.find((item) => item.id === button.dataset.preset) ?? preset;
    [...presetBox.children].forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
    paintAll();
  });
  tokenBox.addEventListener('click', (event) => {
    const button = event.target.closest('[data-token]');
    if (button) select(Number(button.dataset.token));
  });
  panel.addEventListener('click', (event) => {
    const step = event.target.closest('[data-wx-step]');
    if (step) select(selected + Number(step.dataset.wxStep));
  });
  dialButtons.forEach((dial) => dial.addEventListener('click', () => {
    const index = preset.tokens.findIndex((token) => token.kind === dial.dataset.wxDial);
    if (index >= 0) select(index);
  }));
  paintAll();
};

/* ───────────── Las nubes ───────────── */

const mountClouds = () => {
  const root = document.querySelector('[data-wc]');
  if (!root) return;
  const pie = $(root, 'wc-pie');
  const amountBox = $(root, 'wc-amounts');
  const slider = $(root, 'wc-height');
  const heightText = $(root, 'wc-height-text');
  const side = $(root, 'wc-side');
  const out = $(root, 'wc-out');

  let oktas = 6;
  let height = 12;

  const amountOf = (count) => (count === 0 ? null : cloudAmounts.find((item) => count >= item.oktas[0] && count <= item.oktas[1]));
  const FILL = { FEW: 2, SCT: 4, BKN: 6, OVC: 8 };

  const wedge = (index) => {
    const a0 = rad(index * 45 - 90);
    const a1 = rad((index + 1) * 45 - 90);
    const r = 74;
    return `M80 80L${80 + Math.cos(a0) * r} ${80 + Math.sin(a0) * r}A${r} ${r} 0 0 1 ${80 + Math.cos(a1) * r} ${80 + Math.sin(a1) * r}Z`;
  };

  const paintPie = () => {
    pie.innerHTML = `<svg viewBox="0 0 160 160" role="group" aria-label="El cielo visto desde abajo, en ocho octavos">${Array.from({ length: 8 }, (_, index) => `<path class="wc-wedge${index < oktas ? ' is-on' : ''}" d="${wedge(index)}" data-wedge="${index}" role="button" tabindex="0" aria-label="Octavo ${index + 1}${index < oktas ? ', cubierto' : ', despejado'}"/>`).join('')}<circle class="wc-pie-ring" cx="80" cy="80" r="74"/></svg>`;
  };

  const paintSide = (amount, ft) => {
    const y = 196 - ft * 0.03;
    const count = { FEW: 1, SCT: 2, BKN: 3, OVC: 5 }[amount?.id] ?? 0;
    const xs = amount?.id === 'OVC' ? [14, 48, 82, 116, 150] : [34, 78, 122].slice(0, count);
    const clouds = xs.map((x) => blob(x, y, amount.id === 'OVC' ? 0.95 : 0.8)).join('');
    const ticks = [1000, 2000, 3000, 4000, 5000, 6000].map((value) => `<line class="tm-grid" x1="26" y1="${196 - value * 0.03}" x2="190" y2="${196 - value * 0.03}"/><text class="tm-axis" x="2" y="${196 - value * 0.03 + 5}">${value / 1000}</text>`).join('');
    side.innerHTML = `<svg viewBox="0 0 200 224" role="img" aria-label="Altura de la capa, en miles de pies" data-mood="${amount?.id === 'OVC' || amount?.id === 'BKN' ? 'grey' : 'clear'}">
      <defs><linearGradient id="wc-sky-grad" x1="0" y1="0" x2="0" y2="1"><stop class="tm-sky-a" offset="0"/><stop class="tm-sky-b" offset="1"/></linearGradient></defs>
      <rect class="tm-sky" width="200" height="196" fill="url(#wc-sky-grad)"/>${ticks}
      <g class="tm-cloud${amount && (amount.id === 'BKN' || amount.id === 'OVC') ? ' is-ceiling' : ''}">${clouds}</g>
      <rect class="tm-ground" y="196" width="200" height="28"/>
      <text class="tm-axis is-unit" x="40" y="14">miles de pies</text>
    </svg>`;
  };

  const paintOut = () => {
    const amount = amountOf(oktas);
    const feet = height * 100;
    slider.disabled = !amount;
    heightText.textContent = amount ? `${feet.toLocaleString('es-AR')} ft` : '—';
    paintSide(amount, feet);
    [...amountBox.children].forEach((button) => {
      const target = button.dataset.wcAmount === 'SKC' ? 0 : FILL[button.dataset.wcAmount];
      button.setAttribute('aria-pressed', String(amount ? amount.id === button.dataset.wcAmount : target === 0));
    });
    if (!amount) {
      out.innerHTML = `<p class="card-kicker">El código</p><div class="wx-code"><code lang="en">SKC</code></div><p class="wx-es">Cielo despejado. En un parte también se ve NSC (sin nubes significativas) o CAVOK.</p><div class="word-say"><p lang="en">“sky clear”</p>${sayButton('sky clear')}</div>`;
      return;
    }
    const code = `${amount.id}${pad(height, 3)}`;
    const say = `${amount.say} ${heightSay(feet)} feet`;
    const makesCeiling = amount.id === 'BKN' || amount.id === 'OVC';
    out.innerHTML = `
      <p class="card-kicker">El código</p>
      <div class="wx-code"><code lang="en">${code}</code></div>
      <p class="wx-es">${cap(amount.es)} a ${feet.toLocaleString('es-AR')} ft sobre el terreno. ${amount.body}</p>
      <dl class="wx-parts"><div><dt lang="en">${amount.id}</dt><dd>${amount.en} · de ${amount.oktas[0]}${amount.oktas[1] !== amount.oktas[0] ? ` a ${amount.oktas[1]}` : ''} octas</dd></div><div><dt>${pad(height, 3)}</dt><dd>${feet} ft: la altura va en cientos de pies</dd></div></dl>
      <p class="wx-extra ${makesCeiling ? 'is-ceiling' : ''}">${makesCeiling ? `Esta capa hace techo a ${feet} ft.` : `No hace techo, aunque esté a ${feet} ft. ${amount.id === 'FEW' || amount.id === 'SCT' ? 'Para el techo cuentan solo BKN y OVC.' : ''}`}</p>
      <div class="word-say"><p lang="en">“${say}”</p>${sayButton(say)}</div>`;
  };

  const cap = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  const paintAll = () => {
    paintPie();
    paintOut();
  };

  amountBox.addEventListener('click', (event) => {
    const button = event.target.closest('[data-wc-amount]');
    if (!button) return;
    oktas = button.dataset.wcAmount === 'SKC' ? 0 : FILL[button.dataset.wcAmount];
    paintAll();
  });
  const toggle = (index) => {
    oktas = oktas === index + 1 ? index : index + 1;
    paintAll();
  };
  pie.addEventListener('click', (event) => {
    const part = event.target.closest('[data-wedge]');
    if (part) toggle(Number(part.dataset.wedge));
  });
  pie.addEventListener('keydown', (event) => {
    const part = event.target.closest('[data-wedge]');
    if (part && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      toggle(Number(part.dataset.wedge));
      pie.querySelector(`[data-wedge="${part.dataset.wedge}"]`)?.focus();
    }
  });
  slider.addEventListener('input', () => {
    height = Number(slider.value);
    paintOut();
  });
  slider.value = String(height);
  paintAll();
};

/* ───────────── Los fenómenos ───────────── */

const wxIcon = (intensity, descriptor, phenomenon) => {
  const count = intensity === '-' ? 4 : intensity === '+' ? 11 : 7;
  const drops = (shape) => Array.from({ length: count }, (_, index) => {
    const x = 28 + ((index * 17) % 104);
    const delay = ((index * 3) % 10) / 10;
    return shape === 'snow'
      ? `<circle class="wi-snow" cx="${x}" cy="78" r="2.4" style="--d:${delay}s"/>`
      : shape === 'hail'
        ? `<circle class="wi-hail" cx="${x}" cy="78" r="3" style="--d:${delay}s"/>`
        : `<line class="wi-drop${shape === 'drizzle' ? ' is-fine' : ''}" x1="${x}" y1="70" x2="${x - 3}" y2="${shape === 'drizzle' ? 78 : 84}" style="--d:${delay}s"/>`;
  }).join('');
  const cloud = '<g class="wi-cloud"><rect x="34" y="42" width="92" height="20" rx="10"/><circle cx="58" cy="44" r="16"/><circle cx="86" cy="36" r="22"/><circle cx="110" cy="46" r="14"/></g>';
  const bolt = descriptor === 'TS' ? '<path class="wi-bolt" d="M84 58L74 80h9l-6 20 17-26h-9l7-16Z"/>' : '';
  const bands = (gap, opacity) => [0, 1, 2, 3].map((row) => `<rect class="wi-band${row % 2 ? ' is-slow' : ''}" x="${22 + (row % 2) * 12}" y="${34 + row * gap}" width="${116 - (row % 2) * 12}" height="9" rx="4.5" style="opacity:${opacity}"/>`).join('');
  let body;
  if (['RA', 'DZ', 'SN', 'GR'].includes(phenomenon) || descriptor === 'TS') {
    const shape = phenomenon === 'SN' ? 'snow' : phenomenon === 'GR' ? 'hail' : phenomenon === 'DZ' ? 'drizzle' : 'rain';
    body = `${cloud}${phenomenon ? drops(shape) : ''}${bolt}`;
  } else if (phenomenon === 'FG') body = bands(16, descriptor === 'BC' ? 0.55 : 0.9);
  else if (phenomenon === 'BR') body = bands(16, 0.45);
  else if (phenomenon === 'HZ') body = Array.from({ length: 18 }, (_, index) => `<circle class="wi-haze" cx="${26 + ((index * 29) % 110)}" cy="${34 + ((index * 17) % 60)}" r="3.2"/>`).join('');
  else body = '<path class="wi-smoke" d="M62 100C46 84 76 72 62 56S78 36 70 24"/><path class="wi-smoke is-2" d="M92 100C76 84 106 72 92 56S108 36 100 24"/>';
  return `<svg viewBox="0 0 160 110" aria-hidden="true">${body}</svg>`;
};

const mountPhenomena = () => {
  const root = document.querySelector('[data-wp]');
  if (!root) return;
  const intensityBox = $(root, 'wp-intensity');
  const descriptorBox = $(root, 'wp-descriptor');
  const phenomenonBox = $(root, 'wp-phenomenon');
  const out = $(root, 'wp-out');
  const art = $(root, 'wp-art');
  const hint = $(root, 'wp-hint');

  const state = { intensity: '', descriptor: '', phenomenon: 'RA' };

  const allowed = () => {
    if (!state.descriptor) return wxPhenomena.map((item) => item.id);
    return wxRules[state.descriptor];
  };
  const hasIntensity = () => ['RA', 'DZ', 'SN', 'GR'].includes(state.phenomenon) || state.descriptor === 'TS' || state.descriptor === 'SH';

  const fix = () => {
    const list = allowed();
    if (!list.includes(state.phenomenon)) state.phenomenon = list[0];
    if (!hasIntensity()) state.intensity = '';
  };

  const english = () => {
    const light = wxIntensity.find((item) => item.id === state.intensity)?.en ?? '';
    const noun = wxPhenomena.find((item) => item.id === state.phenomenon)?.en ?? '';
    let text;
    if (state.descriptor === 'SH') text = `${noun} showers`;
    else if (state.descriptor === 'TS') text = noun ? `thunderstorm with ${noun}` : 'thunderstorm';
    else if (state.descriptor === 'FZ') text = `freezing ${noun}`;
    else if (state.descriptor === 'BC') text = `patches of ${noun}`;
    else text = noun;
    return [light, text].filter(Boolean).join(' ');
  };

  const spanish = () => {
    const level = state.intensity === '-' ? 'leve' : state.intensity === '+' ? 'fuerte' : '';
    const levelPlural = state.intensity === '-' ? 'leves' : state.intensity === '+' ? 'fuertes' : '';
    const noun = wxPhenomena.find((item) => item.id === state.phenomenon)?.es ?? '';
    let text;
    if (state.descriptor === 'SH') return [`chubascos de ${noun}`, levelPlural].filter(Boolean).join(' ');
    if (state.descriptor === 'TS') text = noun ? `tormenta con ${noun}` : 'tormenta eléctrica';
    else if (state.descriptor === 'FZ') text = `${noun} ${state.phenomenon === 'FG' ? 'engelante' : 'congelante'}`;
    else if (state.descriptor === 'BC') text = `bancos de ${noun}`;
    else text = noun;
    return [text, state.descriptor === 'BC' || state.descriptor === 'FZ' ? '' : level].filter(Boolean).join(' ');
  };

  const paint = () => {
    fix();
    const code = `${state.intensity}${state.descriptor}${state.phenomenon}`;
    const say = english();
    intensityBox.innerHTML = wxIntensity.map((item) => `<button type="button" data-v="${item.id}" aria-pressed="${state.intensity === item.id}"${!hasIntensity() && item.id ? ' disabled' : ''}>${item.label}</button>`).join('');
    descriptorBox.innerHTML = wxDescriptors.map((item) => `<button type="button" data-v="${item.id}" aria-pressed="${state.descriptor === item.id}">${item.label}</button>`).join('');
    const list = allowed();
    const none = state.descriptor === 'TS' ? '<button type="button" data-v="" aria-pressed="false">solo TS</button>' : '';
    phenomenonBox.innerHTML = wxPhenomena.map((item) => `<button type="button" data-v="${item.id}" aria-pressed="${state.phenomenon === item.id}"${list.includes(item.id) ? '' : ' disabled'}><b>${item.id}</b> ${item.es}</button>`).join('') + none;
    if (state.descriptor === 'TS' && !state.phenomenon) phenomenonBox.lastElementChild.setAttribute('aria-pressed', 'true');
    art.innerHTML = wxIcon(state.intensity, state.descriptor, state.phenomenon);
    const descriptor = wxDescriptors.find((item) => item.id === state.descriptor);
    hint.textContent = !hasIntensity() && state.phenomenon
      ? 'La intensidad (− o +) solo se usa con lluvia, nieve y otras precipitaciones.'
      : descriptor?.hint ?? 'Armalo de izquierda a derecha: intensidad, descriptor y fenómeno.';
    out.innerHTML = `<div class="wx-code"><code lang="en">${esc(code || 'TS')}</code></div>
      <p class="wx-es">${esc(spanish().replace(/^./, (letter) => letter.toUpperCase()))}.</p>
      <div class="word-say"><p lang="en">“${esc(say)}”</p>${sayButton(say)}</div>`;
  };

  intensityBox.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-v]');
    if (!button || button.disabled) return;
    state.intensity = button.dataset.v;
    paint();
  });
  descriptorBox.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-v]');
    if (!button) return;
    state.descriptor = button.dataset.v;
    paint();
  });
  phenomenonBox.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-v]');
    if (!button || button.disabled) return;
    state.phenomenon = button.dataset.v;
    paint();
  });
  paint();
};

/* ───────────── El TAF ───────────── */

const clockOf = (offset) => {
  const hour = (taf.startHour + offset) % 24;
  const day = 9 + (taf.startHour + offset >= 24 ? 1 : 0);
  return { hour, day, text: `${pad(hour, 2)}:00 UTC`, day2: pad(day, 2) };
};

const forecastAt = (t) => {
  const rows = [];
  if (t >= 14) {
    rows.push(['Viento', 'variable, 3 kt', 'FM']);
    rows.push(['Visibilidad y nubes', 'CAVOK: 10 km o más, sin nubes bajas ni fenómenos', 'FM']);
  } else {
    if (t >= 5) rows.push(['Viento', 'desde los 180°, 15 kt con ráfagas de 25', 'BECMG']);
    else if (t > 3) rows.push(['Viento', 'está cambiando: de los 130° a los 180°', 'BECMG']);
    else rows.push(['Viento', 'desde los 130°, 10 kt', 'Base']);
    rows.push(['Visibilidad', '10 km o más', 'Base']);
    rows.push(['Nubes', 'dispersas a 3000 ft', 'Base']);
  }
  if (t >= 4 && t <= 8) rows.push(['A ratos', 'visibilidad 4000 m, tormenta con lluvia, nubes rotas a 1500 ft con cumulonimbus', 'TEMPO']);
  if (t >= 16 && t <= 19) rows.push(['Quizás (30 %)', 'visibilidad 3000 m con neblina', 'PROB30']);
  return rows;
};

const mountTaf = () => {
  const root = document.querySelector('[data-wt]');
  if (!root) return;
  const board = $(root, 'wt-board');
  const slider = $(root, 'wt-time');
  const clock = $(root, 'wt-clock');
  const now = $(root, 'wt-now');
  const panel = $(root, 'wt-panel');
  const code = $(root, 'wt-code');

  let selected = 'becmg';
  const pctOf = (hours) => `${(hours / taf.hours) * 100}%`;

  const ticks = [];
  for (let hour = 0; hour <= taf.hours; hour += 3) ticks.push(hour);

  const track = (group) => {
    const left = pctOf(group.from);
    const width = `${((group.to - group.from) / taf.hours) * 100}%`;
    if (group.shape === 'burst') {
      return `<span class="wt-window" style="left:${left};width:${width}"></span>${[0.15, 1.45, 2.8].map((offset, index) => `<i class="wt-pulse" style="left:${pctOf(group.from + offset)};width:${(0.85 / taf.hours) * 100}%;--d:${index * 0.4}s"></i>`).join('')}`;
    }
    if (group.shape === 'ramp') {
      return `<span class="wt-bar is-ramp" style="left:${left};width:${width}"></span><span class="wt-after" style="left:${pctOf(group.to)};width:${((14 - group.to) / taf.hours) * 100}%"></span>`;
    }
    return `<span class="wt-bar is-${group.shape}" style="left:${left};width:${width}"></span>`;
  };

  board.innerHTML = `
    <div class="wt-axis"><span class="wt-axis-label">Hora UTC</span><div class="wt-axis-track">${ticks.map((hour) => `<span style="left:${pctOf(hour)}">${pad(clockOf(hour).hour, 2)}</span>`).join('')}</div></div>
    <div class="wt-days"><span></span><div class="wt-axis-track"><b style="left:0;width:${pctOf(12)}">Día 9</b><b style="left:${pctOf(12)};width:${pctOf(12)}">Día 10</b></div></div>
    ${taf.groups.map((group) => `<button class="wt-row" type="button" data-group="${group.id}" aria-pressed="${group.id === selected}"><span class="wt-label" lang="en">${group.label}</span><span class="wt-track">${track(group)}</span></button>`).join('')}
    <div class="wt-cursor" data-wt-cursor aria-hidden="true"><i></i></div>`;
  const cursor = board.querySelector('[data-wt-cursor]');

  const paintPanel = () => {
    const group = taf.groups.find((item) => item.id === selected);
    panel.innerHTML = `
      <p class="card-kicker">${group.en}</p>
      <div class="wx-code"><code lang="en">${esc(group.code)}</code></div>
      <p class="wx-es">${esc(group.es)}</p>
      <div class="word-say"><p lang="en">“${esc(group.say)}”</p>${sayButton(group.say)}</div>`;
    [...board.querySelectorAll('[data-group]')].forEach((row) => row.setAttribute('aria-pressed', String(row.dataset.group === selected)));
  };

  const paintTime = () => {
    const t = Number(slider.value);
    const stamp = clockOf(t);
    clock.textContent = `${stamp.text} · día ${stamp.day2}`;
    cursor.style.left = `calc(var(--wt-label) + (100% - var(--wt-label)) * ${t / taf.hours})`;
    const rows = forecastAt(t);
    now.innerHTML = rows.map(([label, text, tag]) => `<li class="is-${tag.toLowerCase()}"><span>${label}</span><b>${text}</b><em lang="en">${tag}</em></li>`).join('');
    board.querySelectorAll('[data-group]').forEach((row) => {
      const group = taf.groups.find((item) => item.id === row.dataset.group);
      const active = t >= group.from && t <= group.to;
      row.classList.toggle('is-active', active);
    });
  };

  code.textContent = taf.text;
  board.addEventListener('click', (event) => {
    const row = event.target.closest('[data-group]');
    if (!row) return;
    selected = row.dataset.group;
    paintPanel();
  });
  slider.addEventListener('input', paintTime);
  slider.max = String(taf.hours);
  slider.value = '6';
  paintPanel();
  paintTime();
};

/* ───────────── La prueba ───────────── */

const QUIZ_LENGTH = 8;
const QUIZ_PASS = 6;

const mountQuiz = () => {
  const root = document.querySelector('[data-wq]');
  if (!root) return;
  const dots = $(root, 'wq-dots');
  const count = $(root, 'wq-count');
  const prompt = $(root, 'wq-prompt');
  const stage = $(root, 'wq-stage');
  const options = $(root, 'wq-options');
  const feedback = $(root, 'wq-feedback');
  const next = $(root, 'wq-next');
  const ask = $(root, 'wq-ask');
  const done = $(root, 'wq-done');
  const score = $(root, 'wq-score');
  const verdict = $(root, 'wq-verdict');
  const restart = $(root, 'wq-restart');

  let questions = [];
  let index = 0;
  let correct = 0;
  let answered = false;

  const build = () => {
    const kinds = shuffle([...new Set(weatherPool.map((item) => item.kind))]);
    const picks = [];
    let round = 0;
    while (picks.length < QUIZ_LENGTH) {
      const kind = kinds[round % kinds.length];
      const pool = shuffle(weatherPool.filter((item) => item.kind === kind && !picks.some((pick) => pick.code === item.code)));
      if (pool.length) picks.push(pool[0]);
      round += 1;
      if (round > 40) break;
    }
    return shuffle(picks).map((item, position) => {
      const listen = canSpeak() && position % 2 === 1;
      const same = shuffle(weatherPool.filter((other) => other.kind === item.kind && other.code !== item.code)).slice(0, 3);
      const choices = shuffle([item, ...same]);
      return { item, listen, choices };
    });
  };

  const paintDots = () => {
    dots.innerHTML = questions.map((_, position) => `<span class="quiz-dot" data-state="${position < index ? questions[position].result : position === index ? 'now' : ''}"></span>`).join('');
  };

  const show = () => {
    const question = questions[index];
    answered = false;
    paintDots();
    count.textContent = `Pregunta ${index + 1} de ${questions.length}`;
    feedback.textContent = '';
    feedback.removeAttribute('data-state');
    next.hidden = true;
    if (question.listen) {
      prompt.textContent = 'Escuchá y elegí el código que se dijo.';
      stage.innerHTML = sayButton(question.item.say, 'Escuchar el parte');
    } else {
      prompt.textContent = '¿Qué quiere decir este grupo?';
      stage.innerHTML = `<div class="wx-code"><code lang="en">${esc(question.item.code)}</code></div>`;
    }
    options.innerHTML = question.choices.map((choice, position) => `<button class="wq-option" type="button" data-choice="${position}"${question.listen ? ' lang="en"' : ''}>${esc(question.listen ? choice.code : choice.es)}</button>`).join('');
  };

  const finish = () => {
    ask.hidden = true;
    done.hidden = false;
    dots.innerHTML = questions.map((item) => `<span class="quiz-dot" data-state="${item.result}"></span>`).join('');
    score.textContent = `${correct} de ${questions.length}`;
    verdict.textContent = correct >= QUIZ_PASS
      ? 'Muy bien. Ya leés un parte sin pensar el orden.'
      : correct >= 4
        ? 'Vas bien. Volvé al METAR y repasá los grupos que te costaron.'
        : 'Todavía cuesta. Recorré el METAR grupo por grupo y probá de nuevo.';
  };

  const start = () => {
    questions = build();
    index = 0;
    correct = 0;
    ask.hidden = false;
    done.hidden = true;
    show();
  };

  options.addEventListener('click', (event) => {
    const button = event.target.closest('[data-choice]');
    if (!button || answered) return;
    answered = true;
    const question = questions[index];
    const choice = question.choices[Number(button.dataset.choice)];
    const right = choice.code === question.item.code;
    question.result = right ? 'ok' : 'bad';
    if (right) correct += 1;
    [...options.children].forEach((other) => {
      const item = question.choices[Number(other.dataset.choice)];
      other.disabled = true;
      if (item.code === question.item.code) other.dataset.state = 'ok';
      else if (other === button) other.dataset.state = 'bad';
    });
    feedback.dataset.state = right ? 'ok' : 'bad';
    feedback.textContent = right ? `Eso es: ${question.item.code} — ${question.item.es}.` : `Era ${question.item.code}: ${question.item.es}.`;
    stage.innerHTML = question.listen
      ? `${sayButton(question.item.say, 'Escuchar otra vez')}`
      : `<div class="wx-code"><code lang="en">${esc(question.item.code)}</code></div>${sayButton(question.item.say, 'Escuchar cómo se dice')}`;
    next.hidden = false;
    next.textContent = index === questions.length - 1 ? 'Ver el resultado' : 'Siguiente';
    next.focus({ preventScroll: true });
  });
  next.addEventListener('click', () => {
    if (index === questions.length - 1) {
      finish();
      return;
    }
    index += 1;
    show();
  });
  restart.addEventListener('click', start);
  start();
};

export const mountWeather = () => {
  mountReader();
  mountClouds();
  mountPhenomena();
  mountTaf();
  mountQuiz();
};
