import { aerodromeWords, aircraftWords, numberDrills, phoneticAlphabet, radioKinds } from '../data/english.js';
import { atisKey, atisLines, makeAtis } from '../data/atis.js';
import recorded from '../data/atis-recorded.json';

const KEY = 'aerodot:english-status';

const readMap = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
    return Object.fromEntries(Object.entries(saved).filter(([, value]) => value === 'listo'));
  } catch {
    return {};
  }
};

const writeMap = (map) => {
  localStorage.setItem(KEY, JSON.stringify(map));
};

const paintProgress = (map) => {
  document.querySelectorAll('[data-english-slug]').forEach((row) => {
    const ready = map[row.dataset.englishSlug] === 'listo';
    row.dataset.englishState = ready ? 'listo' : 'none';
    const badge = row.querySelector('[data-english-badge]');
    if (badge) badge.hidden = !ready;
    const start = row.querySelector('[data-english-start]');
    if (start) start.hidden = ready;
  });
  document.querySelectorAll('[data-english-complete]').forEach((button) => {
    const ready = map[button.dataset.englishComplete] === 'listo';
    const label = button.querySelector('[data-english-complete-label]');
    if (label) label.textContent = ready ? 'Tema visto' : 'Marcar como visto';
    button.setAttribute('aria-pressed', String(ready));
  });
  const notice = document.querySelector('[data-english-count]');
  if (notice) {
    const slugs = (notice.dataset.englishCount || '').split(/\s+/).filter(Boolean);
    const ready = slugs.filter((slug) => map[slug] === 'listo').length;
    const text = notice.querySelector('[data-english-count-text]');
    if (text) text.textContent = `${ready} de ${slugs.length} temas listos`;
    notice.hidden = !ready;
    notice.style.setProperty('--done', String(slugs.length ? ready / slugs.length : 0));
  }
};

const saveError = (anchor) => {
  const status = anchor?.closest('section')?.querySelector('.saved-state')
    ?? document.querySelector('[data-english-count]');
  if (status) status.textContent = 'No se pudo guardar en este dispositivo.';
};

export const markEnglishReady = (slug) => {
  const map = readMap();
  if (map[slug] === 'listo') return;
  map[slug] = 'listo';
  try {
    writeMap(map);
  } catch {
    saveError(document.querySelector(`[data-english-complete="${slug}"]`));
    return;
  }
  paintProgress(map);
  const status = document.querySelector('.saved-state');
  if (status) status.textContent = 'Avance guardado en este dispositivo.';
};

export const mountEnglishProgress = () => {
  let map = readMap();
  paintProgress(map);
  document.querySelectorAll('[data-english-complete]').forEach((button) => {
    button.addEventListener('click', () => {
      const slug = button.dataset.englishComplete;
      map = readMap();
      if (map[slug] === 'listo') delete map[slug];
      else map[slug] = 'listo';
      try {
        writeMap(map);
      } catch {
        saveError(button);
        return;
      }
      paintProgress(map);
      const status = button.closest('section')?.querySelector('.saved-state');
      if (status) status.textContent = map[slug] === 'listo' ? 'Avance guardado en este dispositivo.' : '';
    });
  });
};

/* La voz es la del navegador. Si no hay, los botones de escuchar se esconden y el resto funciona igual. */

const synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
let voice = null;
let speakId = 0;

/* El primer inglés del sistema suele ser una voz compacta y robótica. Se prefiere una de Google o una mejorada. */
const voiceScore = (item) => {
  if (!/^en/i.test(item.lang)) return -1;
  const name = item.name.toLowerCase();
  let score = /en[-_]gb/i.test(item.lang) ? 12 : 4;
  if (/google/.test(name)) score += 40;
  if (/premium|enhanced|natural|neural/.test(name)) score += 28;
  if (/female|samantha|karen|serena|fiona|moira|kate/.test(name)) score += 6;
  if (/compact|novelty|bad news|bells|boing|zarvox|whisper/.test(name)) score -= 40;
  return score;
};

const pickVoice = () => {
  const voices = synth?.getVoices() ?? [];
  voice = voices.reduce((best, item) => (voiceScore(item) > voiceScore(best ?? {}) ? item : best), null);
  if (voice && voiceScore(voice) < 0) voice = null;
};

if (synth) {
  pickVoice();
  synth.addEventListener?.('voiceschanged', pickVoice);
}

/** Las cifras que por radio suenan distinto, con su pronunciación de la OACI. */
const SOUND = { three: 'tree', four: 'fower', five: 'fife', nine: 'niner' };

/** Lo que se escribe para leer no siempre es lo que conviene darle a la voz: las cifras suenan como pide la OACI. */
const forVoice = (text) => text
  .replace(/LV-DEM/g, 'Lima Victor Delta Echo Mike')
  .replace(/\bQNH\b/g, 'Q N H')
  .replace(/\b(three|four|five|nine)\b/gi, (word) => SOUND[word.toLowerCase()]);

export const canSpeak = () => Boolean(synth);

export const stopSpeaking = () => {
  speakId += 1;
  synth?.cancel();
};

export const speak = (text, { rate = 0.92, onend } = {}) => {
  if (!synth) return;
  stopSpeaking();
  const id = speakId;
  const utterance = new SpeechSynthesisUtterance(forVoice(text));
  utterance.lang = voice?.lang || 'en-GB';
  if (voice) utterance.voice = voice;
  utterance.rate = rate;
  utterance.pitch = 1;
  const done = () => {
    if (id === speakId) onend?.();
  };
  utterance.onend = done;
  utterance.onerror = done;
  synth.speak(utterance);
};

const clearSpeaking = () => {
  document.querySelectorAll('.is-speaking').forEach((item) => item.classList.remove('is-speaking'));
};

const sayFrom = (button, text) => {
  clearSpeaking();
  button.classList.add('is-speaking');
  speak(text, { onend: () => button.classList.remove('is-speaking') });
};

let listenMounted = false;

/** Pestañas Ejercicios / Explicación. El panel oculto se conserva, no se desarma. */
export const mountLessonTabs = () => {
  document.querySelectorAll('[data-en-tabs]').forEach((wrap) => {
    if (wrap.dataset.tabsMounted) return;
    wrap.dataset.tabsMounted = '1';
    const tabs = [...wrap.querySelectorAll('[role="tab"]')];
    const panels = [...wrap.querySelectorAll('[role="tabpanel"]')];
    const show = (id) => {
      tabs.forEach((tab) => {
        const on = tab.getAttribute('aria-controls') === id;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
      });
      panels.forEach((panel) => { panel.hidden = panel.id !== id; });
    };
    tabs.forEach((tab) => tab.addEventListener('click', () => show(tab.getAttribute('aria-controls'))));
  });
};

/** Cualquier botón con data-say lee su texto en inglés. */
export const mountListen = () => {
  if (!synth) {
    document.documentElement.classList.add('en-no-speech');
    return;
  }
  if (listenMounted) return;
  listenMounted = true;
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-say]');
    if (!button || !button.dataset.say) return;
    sayFrom(button, button.dataset.say);
  });
};

/* Números y letras. */

const DIGITS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const SPECIAL = new Set(Object.keys(SOUND));
const ALPHA = Object.fromEntries(phoneticAlphabet.map(([letter, word]) => [letter, word]));
const SIDE = { L: 'left', R: 'right', C: 'centre' };

const HPA_PER_INHG = 33.8639;

const digitWords = (value) => [...value].map((digit) => DIGITS[Number(digit)]);

/** Devuelve las palabras de la frase, o un texto de error si no se puede decir. */
export const toRadio = (kind, raw) => {
  const value = raw.trim().toUpperCase().replace(/\s+/g, '');
  if (!value) return { error: 'Escribí un valor.' };
  if (kind === 'runway') {
    const match = value.replace(/^(RWY|RUNWAY|PISTA)/, '').match(/^(\d{1,2})([LRC])?$/);
    const number = match ? Number(match[1]) : 0;
    if (!match || number < 1 || number > 36) return { error: 'Una pista va de 01 a 36. Puede llevar L, R o C.' };
    return { words: ['runway', ...digitWords(String(number).padStart(2, '0')), ...(match[2] ? [SIDE[match[2]]] : [])] };
  }
  if (kind === 'wind') {
    const match = value.replace(/(KT|KTS|NUDOS)$/, '').match(/^(\d{3})°?[/\-]?(\d{1,3})$/);
    if (!match || Number(match[1]) > 360) return { error: 'Escribilo como dirección/intensidad: 270/15.' };
    return { words: [...digitWords(match[1]), 'degrees', ...digitWords(String(Number(match[2]))), 'knots'] };
  }
  if (kind === 'frequency') {
    const match = value.match(/^(\d{3})[.,](\d{1,3})$/);
    if (!match) return { error: 'Tres cifras, un punto y los decimales: 118.3.' };
    return { words: [...digitWords(match[1]), 'decimal', ...digitWords(match[2])] };
  }
  if (kind === 'altitude') {
    const level = value.match(/^FL(\d{2,3})$/);
    if (level) return { words: ['flight', 'level', ...digitWords(level[1].padStart(3, '0'))] };
    const feet = value.replace(/(FT|PIES)$/, '').replace(/[.,]/g, '');
    if (!/^\d{3,5}$/.test(feet)) return { error: 'Escribí los pies (3500) o un nivel (FL180).' };
    const number = Number(feet);
    if (number < 100 || number % 100) return { error: 'Una altitud se dice en cientos: 3500, no 3550.' };
    const thousands = Math.floor(number / 1000);
    const hundreds = Math.floor((number % 1000) / 100);
    return {
      words: [
        ...(thousands ? [...digitWords(String(thousands)), 'thousand'] : []),
        ...(hundreds ? [DIGITS[hundreds], 'hundred'] : []),
      ],
    };
  }
  if (kind === 'qnh') {
    const match = value.replace(/^QNH/, '').match(/^(\d{3,4})$/);
    const number = match ? Number(match[1]) : 0;
    if (!match || number < 900 || number > 1100) return { error: 'Un QNH en hectopascales va de 900 a 1100.' };
    return { words: ['QNH', ...digitWords(match[1])] };
  }
  if (kind === 'time') {
    const match = value.match(/^(\d{1,2})[:.H]?(\d{2})$/);
    if (!match || Number(match[1]) > 23 || Number(match[2]) > 59) return { error: 'Una hora de 00:00 a 23:59.' };
    return { words: digitWords(match[1].padStart(2, '0') + match[2]) };
  }
  if (kind === 'callsign') {
    const chars = [...value.replace(/[-.]/g, '')];
    if (!chars.length || chars.length > 10 || chars.some((char) => !ALPHA[char] && !/\d/.test(char))) {
      return { error: 'Solo letras y números, hasta 10.' };
    }
    return { words: chars.map((char) => ALPHA[char] ?? DIGITS[Number(char)]) };
  }
  return { error: 'No conozco ese tipo.' };
};

const wordChip = (word) => {
  const chip = document.createElement('span');
  chip.className = 'en-token';
  if (SPECIAL.has(word)) chip.classList.add('is-special');
  chip.lang = 'en';
  chip.textContent = word;
  if (SOUND[word]) {
    const sound = document.createElement('small');
    sound.textContent = `suena ${SOUND[word]}`;
    chip.append(sound);
  }
  return chip;
};

export const mountConverter = () => {
  const root = document.querySelector('[data-converter]');
  if (!root) return;
  const tabs = [...root.querySelectorAll('[data-kind]')];
  const input = root.querySelector('[data-converter-input]');
  const label = root.querySelector('[data-converter-label]');
  const output = root.querySelector('[data-converter-output]');
  const rule = root.querySelector('[data-converter-rule]');
  const error = root.querySelector('[data-converter-error]');
  const listen = root.querySelector('[data-converter-say]');
  const alt = root.querySelector('[data-converter-alt]');
  const altValue = root.querySelector('[data-converter-alt-value]');
  const altOutput = root.querySelector('[data-converter-alt-output]');
  const altListen = root.querySelector('[data-converter-alt-say]');
  let kind = radioKinds[0];

  // El QNH también en pulgadas de mercurio, como lo da Estados Unidos.
  const renderInches = (result) => {
    const hpa = Number(input.value.replace(/\D/g, ''));
    alt.hidden = kind.id !== 'qnh' || !result.words;
    if (alt.hidden) return;
    const inches = (hpa / HPA_PER_INHG).toFixed(2);
    const words = ['altimeter', ...digitWords(inches.replace('.', ''))];
    altValue.textContent = `${inches} inHg`;
    altOutput.replaceChildren(...words.map(wordChip));
    altListen.dataset.say = words.join(' ');
  };

  const render = () => {
    const result = toRadio(kind.id, input.value);
    output.replaceChildren();
    error.textContent = result.error || '';
    error.hidden = !result.error;
    input.toggleAttribute('aria-invalid', Boolean(result.error && input.value.trim()));
    if (result.words) {
      result.words.forEach((word) => output.append(wordChip(word)));
      listen.dataset.say = result.words.join(' ');
      listen.disabled = false;
    } else {
      listen.dataset.say = '';
      listen.disabled = true;
    }
    renderInches(result);
  };

  const choose = (id, keepValue = false) => {
    kind = radioKinds.find((item) => item.id === id) ?? radioKinds[0];
    tabs.forEach((tab) => tab.setAttribute('aria-pressed', String(tab.dataset.kind === kind.id)));
    label.textContent = kind.label;
    input.placeholder = kind.hint;
    rule.textContent = kind.rule;
    if (!keepValue) input.value = kind.example;
    render();
  };

  tabs.forEach((tab) => tab.addEventListener('click', () => {
    choose(tab.dataset.kind);
    input.focus({ preventScroll: true });
    input.select();
  }));
  input.addEventListener('input', render);
  choose(kind.id);
};

/** Botones que muestran y esconden un bloque (las tarjetas de la frecuencia). */
export const mountReveals = () => {
  document.querySelectorAll('[data-reveal]').forEach((button) => {
    const target = document.getElementById(button.getAttribute('aria-controls'));
    if (!target) return;
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      target.hidden = !open;
      button.closest('[data-flip]')?.classList.toggle('is-open', open);
      const label = button.querySelector('[data-reveal-label]');
      if (label) label.textContent = open ? 'Ocultar' : 'Qué significa';
    });
  });
};

/**
 * Índice de la página (el rail .study-page-toc): abierto en pantalla ancha, plegable en el celular.
 * Saca los enlaces cuya sección no está o quedó oculta y marca la sección que estás leyendo.
 */
export const mountPageToc = (selector) => {
  const toc = document.querySelector(selector);
  if (!toc) return;
  const wide = window.matchMedia('(min-width: 1181px)');
  const sync = () => {
    if (wide.matches) toc.open = true;
    toc.querySelector('summary').tabIndex = wide.matches ? -1 : 0;
  };
  sync();
  wide.addEventListener('change', sync);
  const links = [...toc.querySelectorAll('nav a')].filter((link) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target && !target.closest('[hidden]')) return true;
    link.hidden = true;
    return false;
  });
  const targets = links.map((link) => document.querySelector(link.getAttribute('href')));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      links.forEach((link) => {
        if (link.hash === `#${visible.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-12% 0px -72% 0px', threshold: 0 });
    targets.forEach((target) => observer.observe(target));
  }
};

const shuffle = (list) => {
  const copy = [...list];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
};

/* Los dibujos para tocar: recorrerlos o rendir la prueba sobre el mismo dibujo. */

const QUIZ_LENGTH = 8;
const QUIZ_PASS = 6;

const mountWordMap = ({ words, slug, noun, readyMsg }) => {
  const root = document.querySelector('[data-field]');
  if (!root) return;
  const stage = root.querySelector('[data-field-stage]');
  const hits = [...stage.querySelectorAll('.hit')];
  const tag = stage.querySelector('[data-field-tag]');
  const chipList = root.querySelector('[data-word-chips]');
  const chips = [...chipList.querySelectorAll('[data-word-chip]')];
  const panels = [...root.querySelectorAll('[data-word-panel]')];
  const explorePanel = root.querySelector('[data-explore-panel]');
  const quizPanel = root.querySelector('[data-quiz-panel]');
  const modes = [...root.querySelectorAll('[data-field-mode]')];
  const viewEls = [...stage.querySelectorAll('[data-view]')];
  const viewTabs = [...root.querySelectorAll('[data-view-tab]')];
  const viewTabBar = root.querySelector('[data-view-tabs]');
  const viewCaptions = Object.fromEntries(viewEls.map((el) => [el.dataset.view, el.dataset.viewLabel]));
  const byId = Object.fromEntries(words.map((word) => [word.id, word]));
  const order = words.map((word) => word.id);
  let mode = 'explore';
  let active = order[0];
  let view = viewEls[0]?.dataset.view ?? null;

  // Lo que se pinta y se toca es siempre lo del dibujo que está a la vista.
  const scope = () => (view ? stage.querySelector(`[data-view="${view}"]`) : stage);
  const marksOf = (id) => [...scope().querySelectorAll(`[data-hl="${id}"]`)];

  const paint = (id, state) => {
    stage.querySelectorAll('.hl').forEach((mark) => mark.classList.remove('is-on', 'is-bad'));
    if (id) marksOf(id).forEach((mark) => mark.classList.add(state || 'is-on'));
  };

  // Las piezas que se mueven lo hacen mientras están elegidas.
  const animate = (id) => {
    stage.querySelectorAll('[data-move]').forEach((el) => el.classList.toggle('is-moving', Boolean(id) && el.dataset.move === id));
  };

  // Que la etiqueta no se salga del dibujo: se corre y la punta sigue marcando el lugar.
  const anchorOf = (id) => {
    const word = byId[id];
    if (word.x !== undefined) return { x: (word.x / 100) * stage.clientWidth, y: (word.y / 100) * stage.clientHeight };
    const hit = scope().querySelector(`.hit[data-word="${id}"]`);
    if (!hit) return null;
    const svg = hit.ownerSVGElement;
    const scale = stage.clientWidth / svg.viewBox.baseVal.width;
    const box = hit.getBBox();
    return { x: (box.x + box.width / 2) * scale, y: box.y * scale };
  };

  const placeTag = (id) => {
    const anchor = anchorOf(id);
    if (!anchor) {
      tag.hidden = true;
      return;
    }
    const width = stage.clientWidth;
    const half = tag.offsetWidth / 2;
    const left = Math.min(Math.max(anchor.x, half + 6), width - half - 6);
    // Si la pieza está pegada al borde de arriba, la etiqueta baja un poco para no cortarse.
    tag.style.top = `${Math.max(anchor.y, tag.offsetHeight + 14)}px`;
    tag.style.left = `${left}px`;
    tag.style.setProperty('--tip', `calc(50% + ${anchor.x - left}px)`);
  };

  const showTag = (id) => {
    const word = byId[id];
    if (!word) {
      tag.hidden = true;
      return;
    }
    tag.textContent = word.en;
    tag.dataset.id = id;
    tag.hidden = false;
    placeTag(id);
    tag.classList.remove('is-in');
    void tag.offsetWidth;
    tag.classList.add('is-in');
  };

  const setView = (next) => {
    if (!viewEls.length || next === view) return;
    view = next;
    viewEls.forEach((el) => el.classList.toggle('is-on', el.dataset.view === next));
    viewTabs.forEach((tab) => tab.setAttribute('aria-pressed', String(tab.dataset.viewTab === next)));
    chips.forEach((chip) => {
      chip.parentElement.hidden = byId[chip.dataset.wordChip].view !== next;
    });
    const caption = stage.querySelector('[data-view-caption]');
    if (caption) caption.textContent = viewCaptions[next];
  };

  const show = (id, { fromChip = false } = {}) => {
    active = id;
    const word = byId[id];
    // Una pieza elegida desde una ficha puede estar en otro dibujo: se cambia al suyo.
    if (word.view && (fromChip || !scope().querySelector(`.hit[data-word="${id}"]`))) setView(word.view);
    paint(id);
    animate(id);
    showTag(id);
    chips.forEach((chip) => {
      chip.setAttribute('aria-pressed', String(chip.dataset.wordChip === id));
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.wordPanel !== id;
    });
  };

  chips.forEach((chip) => chip.addEventListener('click', () => show(chip.dataset.wordChip, { fromChip: true })));
  viewTabs.forEach((tab) => tab.addEventListener('click', () => {
    setView(tab.dataset.viewTab);
    const first = order.find((id) => byId[id].view === view);
    if (mode === 'explore' && first) show(first);
  }));
  window.addEventListener('resize', () => {
    if (!tag.hidden) placeTag(tag.dataset.id);
  });

  /* Prueba */
  const qCount = quizPanel.querySelector('[data-quiz-count]');
  const qPrompt = quizPanel.querySelector('[data-quiz-prompt]');
  const qTerm = quizPanel.querySelector('[data-quiz-term]');
  const qSay = quizPanel.querySelector('[data-quiz-say]');
  const qFeedback = quizPanel.querySelector('[data-quiz-feedback]');
  const qNext = quizPanel.querySelector('[data-quiz-next]');
  const qAsk = quizPanel.querySelector('[data-quiz-ask]');
  const qDone = quizPanel.querySelector('[data-quiz-done]');
  const qScore = quizPanel.querySelector('[data-quiz-score]');
  const qVerdict = quizPanel.querySelector('[data-quiz-verdict]');
  const qDots = quizPanel.querySelector('[data-quiz-dots]');
  let quiz = null;

  const paintDots = () => {
    qDots.replaceChildren();
    quiz.items.forEach((item, index) => {
      const dot = document.createElement('span');
      dot.className = 'quiz-dot';
      if (index < quiz.results.length) dot.dataset.state = quiz.results[index] ? 'ok' : 'bad';
      else if (index === quiz.index) dot.dataset.state = 'now';
      qDots.append(dot);
    });
  };

  const ask = () => {
    const item = quiz.items[quiz.index];
    const word = byId[item.id];
    quiz.locked = false;
    if (word.view) setView(word.view);
    paint(null);
    animate(null);
    showTag(null);
    qAsk.hidden = false;
    qDone.hidden = true;
    qNext.hidden = true;
    qFeedback.textContent = '';
    delete qFeedback.dataset.state;
    qCount.textContent = `Pregunta ${quiz.index + 1} de ${quiz.items.length}`;
    const where = word.view ? ` (${viewCaptions[word.view].toLowerCase()})` : '';
    qPrompt.textContent = item.lang === 'en' ? `Tocá en el ${noun}${where}:` : `Tocá en el ${noun}${where} lo que en inglés se llama:`;
    qTerm.textContent = item.lang === 'en' ? word.en : word.es;
    qTerm.lang = item.lang;
    qSay.hidden = item.lang !== 'en';
    qSay.dataset.say = word.en;
    paintDots();
  };

  const startQuiz = () => {
    const ids = shuffle(order).slice(0, QUIZ_LENGTH);
    quiz = { items: ids.map((id, index) => ({ id, lang: index % 2 ? 'es' : 'en' })), index: 0, results: [], locked: false };
    ask();
  };

  const finishQuiz = () => {
    const score = quiz.results.filter(Boolean).length;
    paint(null);
    showTag(null);
    qAsk.hidden = true;
    qDone.hidden = false;
    qScore.textContent = `${score} de ${quiz.items.length}`;
    if (score >= QUIZ_PASS) {
      qVerdict.textContent = readyMsg;
      markEnglishReady(slug);
    } else {
      qVerdict.textContent = `Con ${QUIZ_PASS} o más queda listo. Recorré el ${noun} y volvé a probar.`;
    }
    quiz.index = quiz.items.length;
    paintDots();
  };

  const answer = (id) => {
    if (!quiz || quiz.locked || qAsk.hidden) return;
    quiz.locked = true;
    const item = quiz.items[quiz.index];
    const target = byId[item.id];
    const ok = id === item.id;
    quiz.results.push(ok);
    paint(item.id);
    if (!ok) marksOf(id).forEach((mark) => mark.classList.add('is-bad'));
    animate(item.id);
    showTag(item.id);
    qFeedback.dataset.state = ok ? 'ok' : 'bad';
    qFeedback.textContent = ok
      ? `Bien. ${target.en} es ${target.es}.`
      : `Eso es ${byId[id].en}. ${target.en} (${target.es}) es lo marcado en azul.`;
    qSay.hidden = false;
    qNext.hidden = false;
    qNext.textContent = quiz.index === quiz.items.length - 1 ? 'Ver resultado' : 'Siguiente';
    paintDots();
    qNext.focus({ preventScroll: true });
  };

  qNext.addEventListener('click', () => {
    quiz.index += 1;
    if (quiz.index >= quiz.items.length) finishQuiz();
    else ask();
  });
  quizPanel.querySelector('[data-quiz-restart]').addEventListener('click', startQuiz);

  const setMode = (next) => {
    mode = next;
    stage.dataset.mode = next;
    modes.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.fieldMode === next)));
    explorePanel.hidden = next !== 'explore';
    quizPanel.hidden = next !== 'quiz';
    chipList.hidden = next !== 'explore';
    if (viewTabBar) viewTabBar.hidden = next !== 'explore';
    labelHits();
    if (next === 'quiz') startQuiz();
    else {
      animate(null);
      show(active);
    }
  };

  // En la prueba el nombre no puede estar en la etiqueta: se tocan lugares numerados.
  const labelHits = () => {
    hits.forEach((hit, index) => {
      hit.setAttribute('aria-label', mode === 'quiz' ? `Lugar ${index + 1}` : byId[hit.dataset.word].en);
      hit.setAttribute('tabindex', mode === 'quiz' ? '0' : '-1');
    });
  };

  modes.forEach((button) => button.addEventListener('click', () => setMode(button.dataset.fieldMode)));
  root.querySelector('[data-quiz-explore]')?.addEventListener('click', () => setMode('explore'));

  hits.forEach((hit) => {
    hit.setAttribute('role', 'button');
    const pick = () => {
      if (mode === 'quiz') {
        answer(hit.dataset.word);
        return;
      }
      show(hit.dataset.word);
      // En celular las fichas son una fila que se desliza: se acerca la elegida sin mover la página.
      const chip = chips.find((item) => item.dataset.wordChip === hit.dataset.word);
      if (chip && chipList.scrollWidth > chipList.clientWidth) {
        chipList.scrollTo({ left: chip.offsetLeft - (chipList.clientWidth - chip.offsetWidth) / 2, behavior: 'smooth' });
      }
    };
    hit.addEventListener('click', pick);
    hit.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      pick();
    });
    const marks = () => [...hit.closest('[data-view]')?.querySelectorAll(`[data-hl="${hit.dataset.word}"]`) ?? stage.querySelectorAll(`[data-hl="${hit.dataset.word}"]`)];
    hit.addEventListener('pointerenter', () => marks().forEach((mark) => mark.classList.add('is-hover')));
    hit.addEventListener('pointerleave', () => marks().forEach((mark) => mark.classList.remove('is-hover')));
  });

  // Al empezar se muestra la primera vista, con sus fichas.
  if (viewEls.length) {
    const first = view;
    view = null;
    setView(first);
  }
  setMode('explore');
};

export const mountAerodrome = () => mountWordMap({
  words: aerodromeWords,
  slug: 'aerodromo',
  noun: 'plano',
  readyMsg: 'Te ubicás en el aeródromo. Tema guardado como listo.',
});

export const mountAircraft = () => mountWordMap({
  words: aircraftWords,
  slug: 'aeronave',
  noun: 'dibujo',
  readyMsg: 'Conocés el avión por dentro y por fuera. Tema guardado como listo.',
});

/* Armar la frase con fichas. */

export const mountNumberDrill = () => {
  const root = document.querySelector('[data-number-drill]');
  if (!root) return;
  const prompt = root.querySelector('[data-drill-prompt]');
  const shown = root.querySelector('[data-drill-shown]');
  const kicker = root.querySelector('[data-drill-kicker]');
  const note = root.querySelector('[data-drill-note]');
  const built = root.querySelector('[data-drill-built]');
  const bank = root.querySelector('[data-drill-bank]');
  const status = root.querySelector('[data-drill-status]');
  const dots = root.querySelector('[data-drill-dots]');
  const check = root.querySelector('[data-drill-check]');
  const undo = root.querySelector('[data-drill-undo]');
  const next = root.querySelector('[data-drill-next]');
  const listen = root.querySelector('[data-drill-say]');
  const card = root.querySelector('[data-drill-card]');
  const done = root.querySelector('[data-drill-done]');
  let step = 0;
  let picked = [];
  let pool = [];
  const results = [];

  const setStatus = (state, text) => {
    status.textContent = text;
    if (state) status.dataset.state = state;
    else delete status.dataset.state;
  };

  const chip = (token, picked) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = picked ? 'drill-chip is-picked' : 'drill-chip';
    if (SPECIAL.has(token.text)) button.classList.add('is-special');
    button.lang = 'en';
    button.textContent = token.text;
    return button;
  };

  const paintDots = () => {
    dots.replaceChildren();
    numberDrills.forEach((drill, index) => {
      const dot = document.createElement('span');
      dot.className = 'quiz-dot';
      if (results[index] !== undefined) dot.dataset.state = results[index] ? 'ok' : 'bad';
      else if (index === step) dot.dataset.state = 'now';
      dots.append(dot);
    });
  };

  const render = () => {
    const drill = numberDrills[step];
    const solved = status.dataset.state === 'ok';
    kicker.textContent = `${drill.kicker} · ${step + 1} de ${numberDrills.length}`;
    shown.textContent = drill.shown;
    prompt.textContent = drill.prompt;
    note.textContent = drill.note || '';
    note.hidden = !drill.note;
    built.replaceChildren();
    built.classList.toggle('is-solved', solved);
    if (!picked.length) {
      const empty = document.createElement('span');
      empty.className = 'drill-empty';
      empty.textContent = 'Tocá las fichas en el orden en que se dicen.';
      built.append(empty);
    }
    picked.forEach((token, index) => {
      const button = chip(token, true);
      button.disabled = solved;
      button.addEventListener('click', () => {
        picked.splice(index, 1);
        pool.push(token);
        setStatus(null, '');
        render();
      });
      built.append(button);
    });
    bank.replaceChildren();
    pool.forEach((token) => {
      const button = chip(token, false);
      button.addEventListener('click', () => {
        pool = pool.filter((item) => item.id !== token.id);
        picked.push(token);
        setStatus(null, '');
        render();
      });
      bank.append(button);
    });
    bank.hidden = solved;
    check.hidden = solved;
    undo.hidden = solved;
    check.disabled = picked.length !== drill.answer.length;
    undo.disabled = !picked.length;
    next.hidden = !solved;
    listen.hidden = !solved;
    listen.dataset.say = drill.answer.join(' ');
    next.textContent = step === numberDrills.length - 1 ? 'Ver resultado' : 'Siguiente';
    paintDots();
  };

  const load = (index) => {
    step = index;
    const drill = numberDrills[step];
    let tokens = drill.answer.map((text, position) => ({ id: `${drill.id}-${position}`, text }));
    let guard = 0;
    do {
      tokens = shuffle(tokens);
      guard += 1;
    } while (guard < 4 && tokens.every((token, position) => token.text === drill.answer[position]));
    pool = tokens;
    picked = [];
    setStatus(null, '');
    render();
  };

  check.addEventListener('click', () => {
    const drill = numberDrills[step];
    const said = picked.map((token) => token.text).join(' ');
    const expected = drill.answer.join(' ');
    if (said === expected) {
      if (results[step] === undefined) results[step] = true;
      setStatus('ok', 'Así se dice.');
      render();
      speak(expected);
      next.focus({ preventScroll: true });
      return;
    }
    if (results[step] === undefined) results[step] = false;
    setStatus('bad', `Casi. El orden es: ${expected}.`);
    built.classList.remove('is-shaking');
    void built.offsetWidth;
    built.classList.add('is-shaking');
    paintDots();
  });

  // El borde rojo dura lo que dura la sacudida.
  built.addEventListener('animationend', () => built.classList.remove('is-shaking'));

  undo.addEventListener('click', () => {
    const last = picked.pop();
    if (last) pool.push(last);
    setStatus(null, '');
    render();
  });

  next.addEventListener('click', () => {
    if (step < numberDrills.length - 1) {
      load(step + 1);
      return;
    }
    const firstTry = results.filter(Boolean).length;
    card.hidden = true;
    done.hidden = false;
    done.querySelector('[data-drill-score]').textContent = `${firstTry} de ${numberDrills.length}`;
    step = numberDrills.length;
    paintDots();
    markEnglishReady('numeros');
  });

  done.querySelector('[data-drill-restart]').addEventListener('click', () => {
    results.length = 0;
    card.hidden = false;
    done.hidden = true;
    load(0);
  });

  load(0);
};

/* El ATIS: escuchar, anotar en papel y recién después mirar el texto. */

const PASS_RATIO = 0.8;
const clock = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, '0')}`;

export const mountAtis = () => {
  const root = document.querySelector('[data-atis]');
  if (!root) return;
  const $ = (name) => root.querySelector(`[data-atis-${name}]`);
  const player = $('player');
  const sourceButtons = [...root.querySelectorAll('[data-atis-source]')];
  const pick = $('pick');
  const play = $('play');
  const playLabel = $('play-label');
  const slow = $('slow');
  const showText = $('show-text');
  const meta = $('meta');
  const progress = $('progress');
  const readList = $('read');
  const revealButton = $('reveal');
  const revealBox = $('revealed');
  const keyList = $('key');
  const score = $('score');
  const verdict = $('verdict');
  const next = $('next');
  const again = $('again');
  const status = $('status');
  const audio = new Audio();
  audio.preload = 'none';

  const items = recorded.items;
  let source = canSpeak() ? 'random' : 'recorded';
  let recordedIndex = 0;
  let current = null;
  let lines = [];
  let plays = 0;
  let playing = false;
  let revealed = false;
  let stopAt = null;
  let rows = [];

  const textVisible = () => revealed || showText.getAttribute('aria-pressed') === 'true';
  const rate = () => (slow.getAttribute('aria-pressed') === 'true' ? 0.72 : 0.92);

  const live = (index) => rows.forEach((row, position) => row.classList.toggle('is-live', position === index));

  const paintMeta = () => {
    const parts = [source === 'random' ? 'Voz del navegador' : 'Grabado'];
    if (current?.duration) parts.push(clock(current.duration));
    parts.push(plays === 0 ? 'Todavía no lo escuchaste' : plays === 1 ? 'Lo escuchaste 1 vez' : `Lo escuchaste ${plays} veces`);
    meta.textContent = parts.join(' · ');
    revealButton.disabled = plays === 0 || revealed;
    playLabel.textContent = playing ? 'Detener' : plays ? 'Escuchar otra vez' : 'Escuchar el ATIS';
  };

  const paintText = () => {
    player.dataset.text = String(textVisible());
  };

  const halt = () => {
    playing = false;
    stopAt = null;
    stopSpeaking();
    audio.pause();
    live(-1);
    progress.style.setProperty('--played', '0');
    player.dataset.playing = 'false';
    paintMeta();
  };

  const finish = () => {
    halt();
  };

  const playRandomFrom = (index) => {
    if (!playing) return;
    if (index >= lines.length) {
      finish();
      return;
    }
    live(index);
    speak(lines[index].text, { rate: rate(), onend: () => window.setTimeout(() => playRandomFrom(index + 1), 550) });
  };

  const start = () => {
    status.textContent = '';
    playing = true;
    plays += 1;
    player.dataset.playing = 'true';
    paintMeta();
    if (source === 'random') {
      playRandomFrom(0);
      return;
    }
    audio.currentTime = 0;
    audio.playbackRate = slow.getAttribute('aria-pressed') === 'true' ? 0.8 : 1;
    audio.play().catch(() => {
      halt();
      plays = Math.max(0, plays - 1);
      paintMeta();
      status.textContent = 'No se pudo reproducir el audio. Revisá la conexión y probá de nuevo.';
    });
  };

  audio.addEventListener('timeupdate', () => {
    if (!playing && stopAt === null) return;
    const time = audio.currentTime;
    if (current?.cues) {
      const index = current.cues.findIndex(([from, to]) => time >= from && time < to + 0.25);
      live(index);
    }
    if (current?.duration) progress.style.setProperty('--played', String(Math.min(1, time / current.duration)));
    if (stopAt !== null && time >= stopAt) {
      stopAt = null;
      audio.pause();
      live(-1);
    }
  });
  audio.addEventListener('ended', () => {
    if (playing) finish();
  });

  const renderText = () => {
    readList.replaceChildren();
    rows = lines.map((line, index) => {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'atis-group';
      button.lang = 'en';
      const number = document.createElement('span');
      number.className = 'atis-n';
      number.setAttribute('aria-hidden', 'true');
      number.textContent = String(index + 1).padStart(2, '0');
      const text = document.createElement('span');
      text.className = 'atis-text';
      text.textContent = line.text;
      button.append(number, text);
      button.addEventListener('click', () => {
        if (!textVisible()) return;
        halt();
        live(index);
        if (source === 'random') {
          speak(line.text, { rate: rate(), onend: () => live(-1) });
          return;
        }
        const [from, to] = current.cues[index];
        stopAt = to;
        audio.currentTime = from;
        audio.playbackRate = slow.getAttribute('aria-pressed') === 'true' ? 0.8 : 1;
        audio.play().catch(() => {
          stopAt = null;
          live(-1);
        });
      });
      item.append(button);
      readList.append(item);
      return button;
    });
  };

  const paintScore = () => {
    const total = keyList.children.length;
    const ok = keyList.querySelectorAll('[aria-pressed="true"]').length;
    score.textContent = `${ok} de ${total}`;
    if (ok / total >= PASS_RATIO) {
      verdict.textContent = 'Anotaste bien casi todo. Tema guardado como listo.';
      markEnglishReady('atis');
    } else {
      verdict.textContent = `Con ${Math.ceil(total * PASS_RATIO)} o más queda listo. Escuchalo otra vez y compará con tu papel.`;
    }
  };

  const renderKey = () => {
    keyList.replaceChildren();
    atisKey(current.atis).forEach((entry) => {
      const item = document.createElement('li');
      const label = document.createElement('span');
      label.className = 'key-label';
      label.textContent = entry.label;
      const value = document.createElement('strong');
      value.className = 'key-value';
      value.textContent = entry.value;
      const heard = document.createElement('span');
      heard.className = 'key-heard';
      heard.lang = 'en';
      heard.textContent = entry.text;
      const mine = document.createElement('button');
      mine.type = 'button';
      mine.className = 'chip-toggle key-mine';
      mine.setAttribute('aria-pressed', 'false');
      mine.textContent = 'Lo tenía';
      mine.addEventListener('click', () => {
        mine.setAttribute('aria-pressed', String(mine.getAttribute('aria-pressed') !== 'true'));
        paintScore();
      });
      const stack = document.createElement('span');
      stack.className = 'key-stack';
      stack.append(value, heard);
      item.append(label, stack, mine);
      keyList.append(item);
    });
  };

  const load = () => {
    halt();
    plays = 0;
    revealed = false;
    revealBox.hidden = true;
    status.textContent = '';
    if (source === 'random') {
      const atis = makeAtis();
      current = { atis };
    } else {
      current = items[recordedIndex];
      audio.src = current.src;
    }
    lines = atisLines(current.atis);
    renderText();
    renderKey();
    paintText();
    paintMeta();
    next.textContent = source === 'random' ? 'Otro ATIS' : 'Siguiente audio';
    pick.hidden = source !== 'recorded';
    pick.querySelectorAll('button').forEach((button, index) => button.setAttribute('aria-pressed', String(index === recordedIndex)));
  };

  const reveal = () => {
    revealed = true;
    revealBox.hidden = false;
    paintText();
    paintMeta();
    paintScore();
    revealBox.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };

  items.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chip-toggle';
    button.setAttribute('aria-pressed', 'false');
    button.textContent = `Audio ${index + 1} · ${clock(item.duration)}`;
    button.addEventListener('click', () => {
      recordedIndex = index;
      load();
    });
    pick.append(button);
  });

  sourceButtons.forEach((button) => {
    if (button.dataset.atisSource === 'random' && !canSpeak()) button.hidden = true;
    button.addEventListener('click', () => {
      source = button.dataset.atisSource;
      sourceButtons.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
      load();
    });
  });

  play.addEventListener('click', () => {
    if (playing) {
      halt();
      return;
    }
    start();
  });
  slow.addEventListener('click', () => {
    const on = slow.getAttribute('aria-pressed') !== 'true';
    slow.setAttribute('aria-pressed', String(on));
    audio.playbackRate = on ? 0.8 : 1;
  });
  showText.addEventListener('click', () => {
    showText.setAttribute('aria-pressed', String(showText.getAttribute('aria-pressed') !== 'true'));
    paintText();
  });
  revealButton.addEventListener('click', reveal);
  next.addEventListener('click', () => {
    if (source === 'recorded') recordedIndex = (recordedIndex + 1) % items.length;
    load();
  });
  again.addEventListener('click', () => {
    halt();
    start();
  });
  root.querySelector('[data-atis-print]')?.addEventListener('click', () => window.print());

  sourceButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.atisSource === source)));
  window.addEventListener('pagehide', halt);
  load();
};
