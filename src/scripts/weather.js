import {
  cloudAmounts,
  heightSay,
  wxDescriptors,
  wxIntensity,
  wxPhenomena,
  wxRules,
} from '../data/weather.js';

/* El tiempo: armar las nubes y los fenómenos, y escuchar cómo se dicen. */

const esc = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const $ = (root, name) => root.querySelector(`[data-${name}]`);
const rad = (deg) => (deg * Math.PI) / 180;
const pad = (value, size) => String(value).padStart(size, '0');

const sayButton = (text, label = 'Escuchar', quiet = false) => `<button class="en-say${quiet ? ' is-quiet' : ''}" type="button" data-say="${esc(text)}"><animate-icons name="volume-2" size="16"></animate-icons><span${quiet ? ' class="visually-hidden"' : ''}>${esc(label)}</span></button>`;

/** Una nube de dibujo: la usa el corte lateral de las nubes. */
const blob = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-38" y="-16" width="82" height="16" rx="8"/><circle cx="-16" cy="-18" r="15"/><circle cx="6" cy="-27" r="21"/><circle cx="29" cy="-17" r="13"/></g>`;

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
      out.innerHTML = `<p class="card-kicker">El código</p><div class="wx-code"><code lang="en">SKC</code></div><p class="wx-es">Cielo despejado. Si hay nubes pero ninguna importa, por radio vas a escuchar <span lang="en">“no significant cloud”</span>.</p><div class="word-say"><p lang="en">“sky clear”</p>${sayButton('sky clear')}</div>`;
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

export const mountWeather = () => {
  mountClouds();
  mountPhenomena();
};
