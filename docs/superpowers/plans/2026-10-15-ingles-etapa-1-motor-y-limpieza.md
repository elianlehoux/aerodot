# Inglés — Etapa 1: motor de ejercicios y limpieza — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dejar la base técnica del rediseño de Inglés: higiene del repo, un motor de ejercicios genérico (probado con `node --test`), el audio funcionando offline en iOS y la sección Tiempo convertida de "teoría en español" a "cómo se dice" usando el motor.

**Architecture:** La lógica de corrección vive en módulos JS puros (`grade.js`, `validate.js`) sin DOM, testeados con `node:test`. Un renderizador DOM (`engine.js`) lee un set de ejercicios en JSON embebido por un componente Astro (`ExerciseSet.astro`) y lo muestra de a un ítem, pensado para toque en celular. El service worker pasa a servir audio por rangos desde caché.

**Tech Stack:** Astro 6 (estático, JS plano), `node:test` (sin dependencias nuevas), CSS con tokens `var(--*)`.

**Spec:** `docs/superpowers/specs/2026-10-15-ingles-redesign-design.md`

**Alcance respecto del spec (decisión deliberada):** esta etapa NO migra el drill de números ni el dictado ATIS al motor (ya funcionan con mecánicas propias; YAGNI) y NO reformula aeródromo/aeronave (eso va con los módulos nuevos de la etapa 2). Sí cubre: higiene, motor, audio offline, limpieza de Tiempo y corrección de contenido.

## Global Constraints

- Español rioplatense con voseo en la UI ("Tocá", "Escuchá", "Elegí"); sin emojis; inglés marcado con `lang="en"`.
- Sin dependencias nuevas en `package.json` (solo se quita `cursor-agent`).
- Hooks de JS por atributos `data-*`; cada `mount*` hace `if (!root) return`; DOM con `createElement` + `textContent` (nunca `innerHTML` con datos).
- CSS: un archivo por área, prefijo por módulo (acá `ex-`), una regla por línea, tokens `var(--*)`, sin colores fijos, respetar `prefers-reduced-motion`; breakpoints 540/380/340.
- Progreso: claves `aerodot:*` en `localStorage` dentro de `try/catch`; si se guardan datos nuevos, actualizar `src/pages/privacidad.astro`.
- Toda página nueva con soporte offline va a `precachePages` en `astro.config.mjs`.
- Contenido 100 % original; datos de práctica fijos (Laguna / SAXL / LV-DEM / pista 13), nunca reales.
- Mantener el aviso de que la sección es práctica independiente y no acredita nivel (`EnglishShell.astro`, `index.astro`).

## Review Focus

- Respuesta de gap con mayúsculas, espacios dobles o acentos: debe corregirse igual (`"  Broken "` = `broken`).
- Set vacío o malformado en el JSON embebido: la página no debe romperse (se registra error en consola y el bloque queda oculto).
- Pedido con cabecera `Range` fuera de rango o sufijo (`bytes=-500`): el SW devuelve 206 o 416, nunca lanza.
- `localStorage` bloqueado (modo privado): terminar un set no debe lanzar (ya lo cubre `markEnglishReady`; no envolverlo de nuevo).
- Ítem `order` con fichas repetidas ("one", "one"): se corrige por texto, no por identidad de ficha.

## File Structure

Crear:
- `test/exercises/grade.test.mjs` — tests de corrección.
- `test/exercises/validate.test.mjs` — tests del validador.
- `test/sw-range.test.mjs` — tests de `rangeResponse`.
- `src/scripts/exercises/grade.js` — funciones puras de corrección.
- `src/scripts/exercises/validate.js` — validador de sets.
- `src/scripts/exercises/engine.js` — renderizador DOM (`mountExerciseSets`).
- `src/components/ExerciseSet.astro` — contenedor + JSON embebido.
- `src/styles/english-exercises.css` — estilos `ex-*`.
- `src/data/english-sets.js` — sets de ejercicios (primero `weatherSet`).
- `public/sw-range.js` — `rangeResponse` para el service worker.

Modificar:
- `.gitignore`, `package.json` (script `test`, quitar `cursor-agent`).
- `src/data/english.js` (Whiskey, blurb de Tiempo).
- `src/pages/ingles/index.astro` (texto de audio).
- `src/pages/ingles/tiempo.astro`, `src/scripts/weather.js`, `src/data/weather.js`, `src/styles/english-weather.css` (limpieza).
- `public/sw.js`, `astro.config.mjs` (audio offline).
- `src/pages/privacidad.astro` (solo si hace falta; ver Task 6).

---

### Task 1: Higiene del repo y línea base

**Files:**
- Modify: `.gitignore`, `package.json`

**Interfaces:**
- Produces: script `npm test` (`node --test`), rama `feat/ingles-rediseno` con la sección actual commiteada.

- [ ] **Step 1: Crear la rama**

Run: `cd "/Users/elianlehoux/Desktop/Proyectos web/aviation-bud" && git checkout -b feat/ingles-rediseno`
Expected: `Switched to a new branch 'feat/ingles-rediseno'`

- [ ] **Step 2: Ignorar capturas de Playwright**

Run: `grep -qxF '.playwright-mcp/' .gitignore || printf '\n.playwright-mcp/\n' >> .gitignore && tail -3 .gitignore`
Expected: la última línea no vacía es `.playwright-mcp/`.

- [ ] **Step 3: Quitar `cursor-agent` y agregar el script de tests**

Run: `npm uninstall cursor-agent`
Luego editar `package.json` para que `scripts` quede:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "test": "node --test"
},
```

- [ ] **Step 4: Verificar que el build sigue andando**

Run: `npm run build 2>&1 | tail -8`
Expected: termina con `sw.js <hash>: N archivos de precarga` y sin errores.

- [ ] **Step 5: Commitear la sección actual como línea base**

Solo los archivos de inglés (no los cambios ajenos de `estudiar/`, `examenes/`, `forms/`):

```bash
git add .gitignore package.json package-lock.json astro.config.mjs src/components/SiteNav.astro src/pages/privacidad.astro src/styles/visual-system.css \
  src/components/EnglishFinish.astro src/components/EnglishSay.astro src/components/EnglishShell.astro \
  src/data/aircraft-views.js src/data/atis-recorded.json src/data/atis.js src/data/english.js src/data/weather.js \
  src/pages/ingles src/scripts/english.js src/scripts/weather.js \
  src/styles/english-aircraft.css src/styles/english-art.css src/styles/english-weather.css src/styles/english.css \
  public/audio scripts docs
git commit -m "feat: baseline de la sección de Inglés y limpieza del repo"
```

---

### Task 2: Corregir contenido

**Files:**
- Modify: `src/data/english.js` (línea ~330), `src/pages/ingles/index.astro` (líneas ~131-133)

**Interfaces:** ninguna.

- [ ] **Step 1: Unificar Whiskey**

Run: `grep -n "Whisky" src/data/english.js src/data/atis.js`
Cambiar cada `Whisky` por `Whiskey` (la OACI usa "Whiskey"; `atis.js` ya lo usa).

- [ ] **Step 2: Corregir el texto del índice sobre el audio**

Run: `grep -n "navegador" src/pages/ingles/index.astro`
Reemplazar la oración que dice que el audio usa la voz del navegador por: `Los ATIS grabados llevan efecto de radio; el resto de los audios usa la voz de tu navegador.`

- [ ] **Step 3: Verificar**

Run: `grep -rn "Whisky" src/ || echo "sin Whisky"; npm run build 2>&1 | tail -3`
Expected: `sin Whisky` y build sin errores.

- [ ] **Step 4: Commit**

```bash
git add src/data/english.js src/pages/ingles/index.astro
git commit -m "fix: unificar Whiskey y corregir el texto de audio del índice"
```

---

### Task 3: Corrección de ejercicios (módulo puro)

**Files:**
- Create: `src/scripts/exercises/grade.js`
- Test: `test/exercises/grade.test.mjs`

**Interfaces:**
- Produces (todos exportados desde `grade.js`):
  - `normalize(text: string): string`
  - `shuffle<T>(items: T[], rand?: () => number): T[]` (copia, Fisher–Yates)
  - `gradeChoice(item: {options: string[], answer: number}, picked: number): {correct: boolean, expected: string}`
  - `gradeTf(item: {answer: boolean}, picked: boolean): {correct: boolean, expected: string}`
  - `gradeGap(item: {answers: string[]}, typed: string): {correct: boolean, expected: string}`
  - `gradeOrder(item: {answer: string[], alternatives?: string[][]}, built: string[]): {correct: boolean, expected: string}`
  - `summarize(results: boolean[], passMark?: number): {correct: number, total: number, passed: boolean}`

- [ ] **Step 1: Escribir los tests que fallan**

`test/exercises/grade.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { gradeChoice, gradeGap, gradeOrder, gradeTf, normalize, shuffle, summarize } from '../../src/scripts/exercises/grade.js';

test('normalize ignora mayúsculas, espacios, acentos y puntuación', () => {
  assert.equal(normalize('  Broken '), 'broken');
  assert.equal(normalize('Hold   SHORT.'), 'hold short');
  assert.equal(normalize('Ceiling, broken!'), 'ceiling broken');
});

test('gradeGap acepta cualquier respuesta válida', () => {
  const item = { answers: ['one five', 'fifteen'] };
  assert.deepEqual(gradeGap(item, ' One  Five '), { correct: true, expected: 'one five' });
  assert.equal(gradeGap(item, 'Fifteen').correct, true);
  assert.equal(gradeGap(item, 'five').correct, false);
  assert.equal(gradeGap(item, '').correct, false);
});

test('gradeChoice compara por índice y devuelve el texto esperado', () => {
  const item = { options: ['a', 'b', 'c'], answer: 1 };
  assert.deepEqual(gradeChoice(item, 1), { correct: true, expected: 'b' });
  assert.equal(gradeChoice(item, 0).correct, false);
});

test('gradeTf compara booleanos', () => {
  assert.deepEqual(gradeTf({ answer: true }, true), { correct: true, expected: 'Verdadero' });
  assert.deepEqual(gradeTf({ answer: false }, true), { correct: false, expected: 'Falso' });
});

test('gradeOrder compara por texto y admite alternativas y fichas repetidas', () => {
  const item = { answer: ['one', 'one', 'zero'], alternatives: [['one', 'zero', 'one']] };
  assert.equal(gradeOrder(item, ['one', 'one', 'zero']).correct, true);
  assert.equal(gradeOrder(item, ['One', 'zero', 'one']).correct, true);
  assert.equal(gradeOrder(item, ['zero', 'one', 'one']).correct, false);
  assert.equal(gradeOrder(item, ['one', 'one']).correct, false);
  assert.equal(gradeOrder(item, ['one', 'one', 'zero']).expected, 'one one zero');
});

test('summarize usa 0.75 por defecto y no aprueba un set vacío', () => {
  assert.deepEqual(summarize([true, true, true, false]), { correct: 3, total: 4, passed: true });
  assert.deepEqual(summarize([true, false, false, false]), { correct: 1, total: 4, passed: false });
  assert.deepEqual(summarize([]), { correct: 0, total: 0, passed: false });
  assert.equal(summarize([true, false], 0.5).passed, true);
});

test('shuffle devuelve una copia con los mismos elementos y respeta rand', () => {
  const source = [1, 2, 3, 4, 5];
  const out = shuffle(source, () => 0);
  assert.notEqual(out, source);
  assert.deepEqual([...out].sort(), source);
  assert.deepEqual(source, [1, 2, 3, 4, 5]);
});
```

- [ ] **Step 2: Correrlos y ver que fallan**

Run: `npm test 2>&1 | tail -15`
Expected: FAIL (`Cannot find module .../grade.js`).

- [ ] **Step 3: Implementar**

`src/scripts/exercises/grade.js`:

```js
/** Texto comparable: sin mayúsculas, acentos, puntuación ni espacios de más. */
export const normalize = (text) => String(text ?? '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9\s'-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

export const shuffle = (items, rand = Math.random) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

export const gradeChoice = (item, picked) => ({
  correct: picked === item.answer,
  expected: item.options[item.answer],
});

export const gradeTf = (item, picked) => ({
  correct: picked === item.answer,
  expected: item.answer ? 'Verdadero' : 'Falso',
});

export const gradeGap = (item, typed) => {
  const given = normalize(typed);
  return {
    correct: given !== '' && item.answers.some((answer) => normalize(answer) === given),
    expected: item.answers[0],
  };
};

const joined = (tokens) => tokens.map(normalize).join(' ');

export const gradeOrder = (item, built) => {
  const given = joined(built);
  const valid = [item.answer, ...(item.alternatives ?? [])].map(joined);
  return { correct: valid.includes(given), expected: item.answer.join(' ') };
};

export const summarize = (results, passMark = 0.75) => {
  const total = results.length;
  const correct = results.filter(Boolean).length;
  return { correct, total, passed: total > 0 && correct / total >= passMark };
};
```

- [ ] **Step 4: Correrlos y ver que pasan**

Run: `npm test 2>&1 | tail -12`
Expected: `pass 7`, `fail 0`.

- [ ] **Step 5: Commit**

```bash
git add src/scripts/exercises/grade.js test/exercises/grade.test.mjs
git commit -m "feat: módulo puro de corrección de ejercicios con tests"
```

---

### Task 4: Validador del esquema de sets

**Files:**
- Create: `src/scripts/exercises/validate.js`
- Test: `test/exercises/validate.test.mjs`

**Interfaces:**
- Consumes: nada.
- Produces: `validateSet(set: unknown): string[]` (lista de errores; vacía = válido). Esquema:
  - Set: `{ id, slug, title, lede?, passMark?, items: Item[] }`.
  - Item común: `{ id, type: 'mcq'|'tf'|'gap'|'order', prompt, say?, explain? }`.
  - `mcq`: `options: string[]` (≥2), `answer: number` (índice válido).
  - `tf`: `answer: boolean`.
  - `gap`: `sentence: string` con exactamente un `___`, `answers: string[]` (≥1).
  - `order`: `tokens: string[]` (≥2), `answer: string[]` (mismas fichas que `tokens`), `alternatives?: string[][]`.

- [ ] **Step 1: Escribir los tests que fallan**

`test/exercises/validate.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSet } from '../../src/scripts/exercises/validate.js';

const good = () => ({
  id: 's1', slug: 'tiempo', title: 'Decilo',
  items: [
    { id: 'a', type: 'mcq', prompt: 'p', options: ['x', 'y'], answer: 1 },
    { id: 'b', type: 'tf', prompt: 'p', answer: false },
    { id: 'c', type: 'gap', prompt: 'p', sentence: 'Cloud ___ at two thousand', answers: ['broken'] },
    { id: 'd', type: 'order', prompt: 'p', tokens: ['in', 'the', 'vicinity'], answer: ['in', 'the', 'vicinity'] },
  ],
});

test('un set correcto no tiene errores', () => {
  assert.deepEqual(validateSet(good()), []);
});

test('detecta set vacío, ids repetidos y tipos inválidos', () => {
  assert.ok(validateSet(null).length > 0);
  assert.ok(validateSet({ ...good(), items: [] }).length > 0);
  const dup = good(); dup.items[1].id = 'a';
  assert.ok(validateSet(dup).some((e) => e.includes('repetido')));
  const bad = good(); bad.items[0].type = 'zzz';
  assert.ok(validateSet(bad).some((e) => e.includes('tipo')));
});

test('mcq: respuesta fuera de rango', () => {
  const s = good(); s.items[0].answer = 5;
  assert.ok(validateSet(s).length > 0);
});

test('gap: exige exactamente un hueco y respuestas', () => {
  const none = good(); none.items[2].sentence = 'sin hueco';
  assert.ok(validateSet(none).length > 0);
  const two = good(); two.items[2].sentence = '___ y ___';
  assert.ok(validateSet(two).length > 0);
  const empty = good(); empty.items[2].answers = [];
  assert.ok(validateSet(empty).length > 0);
});

test('order: la respuesta debe usar las mismas fichas', () => {
  const s = good(); s.items[3].answer = ['in', 'the'];
  assert.ok(validateSet(s).length > 0);
  const t = good(); t.items[3].answer = ['the', 'in', 'vicinity'];
  assert.deepEqual(validateSet(t), []);
});
```

- [ ] **Step 2: Correrlos y ver que fallan**

Run: `npm test 2>&1 | tail -10`
Expected: FAIL (`Cannot find module .../validate.js`).

- [ ] **Step 3: Implementar**

`src/scripts/exercises/validate.js`:

```js
const TYPES = ['mcq', 'tf', 'gap', 'order'];
const isText = (value) => typeof value === 'string' && value.trim() !== '';
const isTexts = (value, min) => Array.isArray(value) && value.length >= min && value.every(isText);
const key = (tokens) => [...tokens].sort().join('\u0000');

const checkItem = (item, where) => {
  const errors = [];
  if (!isText(item.prompt)) errors.push(`${where}: falta prompt.`);
  if (item.type === 'mcq') {
    if (!isTexts(item.options, 2)) errors.push(`${where}: options necesita al menos 2 textos.`);
    else if (!Number.isInteger(item.answer) || item.answer < 0 || item.answer >= item.options.length) errors.push(`${where}: answer fuera de rango.`);
  } else if (item.type === 'tf') {
    if (typeof item.answer !== 'boolean') errors.push(`${where}: answer debe ser true o false.`);
  } else if (item.type === 'gap') {
    if (!isText(item.sentence) || item.sentence.split('___').length !== 2) errors.push(`${where}: sentence necesita exactamente un ___.`);
    if (!isTexts(item.answers, 1)) errors.push(`${where}: answers necesita al menos 1 texto.`);
  } else if (item.type === 'order') {
    if (!isTexts(item.tokens, 2)) errors.push(`${where}: tokens necesita al menos 2 fichas.`);
    else if (!isTexts(item.answer, 1) || key(item.answer) !== key(item.tokens)) errors.push(`${where}: answer debe usar las mismas fichas que tokens.`);
  }
  return errors;
};

/** Devuelve la lista de errores del set; vacía si es válido. */
export const validateSet = (set) => {
  if (!set || typeof set !== 'object') return ['El set no es un objeto.'];
  const errors = [];
  const id = isText(set.id) ? set.id : '(sin id)';
  if (!isText(set.id)) errors.push('Falta set.id.');
  if (!isText(set.slug)) errors.push(`${id}: falta slug.`);
  if (!isText(set.title)) errors.push(`${id}: falta title.`);
  if (!Array.isArray(set.items) || set.items.length === 0) return [...errors, `${id}: items está vacío.`];
  const seen = new Set();
  set.items.forEach((item, index) => {
    const where = `${id}[${index}]`;
    if (!item || typeof item !== 'object') { errors.push(`${where}: no es un objeto.`); return; }
    if (!isText(item.id)) errors.push(`${where}: falta id.`);
    else if (seen.has(item.id)) errors.push(`${where}: id repetido (${item.id}).`);
    else seen.add(item.id);
    if (!TYPES.includes(item.type)) { errors.push(`${where}: tipo inválido (${item.type}).`); return; }
    errors.push(...checkItem(item, where));
  });
  return errors;
};
```

- [ ] **Step 4: Correrlos y ver que pasan**

Run: `npm test 2>&1 | tail -12`
Expected: `pass 12`, `fail 0`.

- [ ] **Step 5: Commit**

```bash
git add src/scripts/exercises/validate.js test/exercises/validate.test.mjs
git commit -m "feat: validador del esquema de sets de ejercicios"
```

---

### Task 5: Renderizador, componente y estilos del motor

**Files:**
- Create: `src/scripts/exercises/engine.js`, `src/components/ExerciseSet.astro`, `src/styles/english-exercises.css`

**Interfaces:**
- Consumes: `grade.js` y `validate.js` (Tasks 3–4); `markEnglishReady(slug)` de `src/scripts/english.js`.
- Produces: `mountExerciseSets(): void` (monta todos los `[data-exercise-set]` de la página); componente `<ExerciseSet set={...} />`; al aprobar (≥ `passMark`, 0.75 por defecto) llama `markEnglishReady(set.slug)`. Los botones `data-say` los resuelve `mountListen()` ya existente.

La verificación de este task es el build y la revisión visual en el Task 6 (el DOM no se testea con `node:test`).

- [ ] **Step 1: Componente**

`src/components/ExerciseSet.astro`:

```astro
---
import '../styles/english-exercises.css';

interface Props {
  set: { id: string; title: string; lede?: string; [key: string]: unknown };
}

const { set } = Astro.props;
const json = JSON.stringify(set).replace(/</g, '\\u003c');
---
<section class="en-block ex-set" data-exercise-set aria-labelledby={`${set.id}-title`}>
  <h2 id={`${set.id}-title`}>{set.title}</h2>
  {set.lede && <p class="en-block-lede">{set.lede}</p>}
  <div class="ex-stage" data-exercise-stage></div>
  <script is:inline type="application/json" data-exercise-json set:html={json}></script>
  <noscript><p>La práctica necesita JavaScript.</p></noscript>
</section>
```

- [ ] **Step 2: Motor**

`src/scripts/exercises/engine.js`:

```js
import { gradeChoice, gradeGap, gradeOrder, gradeTf, shuffle, summarize } from './grade.js';
import { validateSet } from './validate.js';
import { markEnglishReady } from '../english.js';

const el = (tag, props = {}, ...children) => {
  const node = document.createElement(tag);
  for (const [name, value] of Object.entries(props)) {
    if (value === undefined || value === false) continue;
    if (name === 'class') node.className = value;
    else if (name === 'text') node.textContent = value;
    else node.setAttribute(name, value === true ? '' : value);
  }
  children.flat().forEach((child) => child != null && node.append(child));
  return node;
};

/* Cada builder devuelve { node, value(), lock() }. value() es undefined hasta que haya respuesta. */

const buildChoice = (item, change) => {
  let picked = -1;
  const buttons = item.options.map((label) => el('button', { class: 'ex-option', type: 'button', 'aria-pressed': 'false', lang: 'en', text: label }));
  buttons.forEach((button, index) => button.addEventListener('click', () => {
    picked = index;
    buttons.forEach((other, i) => other.setAttribute('aria-pressed', String(i === index)));
    change();
  }));
  return {
    node: el('div', { class: 'ex-options', role: 'group', 'aria-label': 'Opciones' }, buttons),
    value: () => (picked >= 0 ? picked : undefined),
    lock: () => buttons.forEach((button) => { button.disabled = true; }),
  };
};

const buildTf = (item, change) => {
  let picked;
  const labels = [[true, 'Verdadero'], [false, 'Falso']];
  const buttons = labels.map(([, text]) => el('button', { class: 'ex-option', type: 'button', 'aria-pressed': 'false', text }));
  buttons.forEach((button, index) => button.addEventListener('click', () => {
    picked = labels[index][0];
    buttons.forEach((other, i) => other.setAttribute('aria-pressed', String(i === index)));
    change();
  }));
  return {
    node: el('div', { class: 'ex-options ex-options-row', role: 'group', 'aria-label': 'Verdadero o falso' }, buttons),
    value: () => picked,
    lock: () => buttons.forEach((button) => { button.disabled = true; }),
  };
};

const buildGap = (item, change) => {
  const [before, after] = item.sentence.split('___');
  const input = el('input', { class: 'ex-input', type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': 'Palabra que falta', lang: 'en' });
  input.addEventListener('input', change);
  return {
    node: el('p', { class: 'ex-sentence', lang: 'en' }, before, input, after),
    value: () => (input.value.trim() ? input.value : undefined),
    lock: () => { input.disabled = true; },
  };
};

const buildOrder = (item, change) => {
  const bank = [];
  const built = [];
  const bankRow = el('div', { class: 'ex-bank', 'aria-label': 'Fichas' });
  const builtRow = el('div', { class: 'ex-built', 'aria-live': 'polite', 'aria-label': 'Tu frase' });
  let locked = false;
  const paint = () => {
    bankRow.replaceChildren(...bank.map((token, i) => {
      const chip = el('button', { class: 'ex-chip', type: 'button', lang: 'en', text: token });
      chip.addEventListener('click', () => { if (locked) return; built.push(...bank.splice(i, 1)); paint(); change(); });
      return chip;
    }));
    builtRow.replaceChildren(...built.map((token, i) => {
      const chip = el('button', { class: 'ex-chip is-built', type: 'button', lang: 'en', text: token });
      chip.addEventListener('click', () => { if (locked) return; bank.push(...built.splice(i, 1)); paint(); change(); });
      return chip;
    }));
  };
  bank.push(...shuffle(item.tokens));
  paint();
  return {
    node: el('div', { class: 'ex-order' }, builtRow, bankRow),
    value: () => (bank.length === 0 ? [...built] : undefined),
    lock: () => { locked = true; },
  };
};

const BUILDERS = { mcq: buildChoice, tf: buildTf, gap: buildGap, order: buildOrder };
const GRADERS = { mcq: gradeChoice, tf: gradeTf, gap: gradeGap, order: gradeOrder };

const runSet = (root, set) => {
  const stage = root.querySelector('[data-exercise-stage]');
  if (!stage) return;
  let items = [];
  let results = [];
  let index = 0;

  const start = () => {
    items = shuffle(set.items);
    results = [];
    index = 0;
    show();
  };

  const dots = () => el('div', { class: 'ex-dots', 'aria-hidden': 'true' },
    items.map((_, i) => el('span', { class: i < results.length ? (results[i] ? 'is-ok' : 'is-bad') : i === index ? 'is-now' : '' })));

  const show = () => {
    if (index >= items.length) { finish(); return; }
    const item = items[index];
    const feedback = el('p', { class: 'ex-feedback', 'aria-live': 'polite' });
    const check = el('button', { class: 'button-primary', type: 'button', disabled: true, text: 'Corregir' });
    const next = el('button', { class: 'button-primary', type: 'button', hidden: true, text: index === items.length - 1 ? 'Ver resultado' : 'Siguiente' });
    const built = BUILDERS[item.type](item, () => { check.disabled = built.value() === undefined; });
    const say = item.say ? el('button', { class: 'button-quiet ex-say', type: 'button', 'data-say': item.say, text: 'Escuchar' }) : null;

    check.addEventListener('click', () => {
      const given = built.value();
      if (given === undefined) return;
      const verdict = GRADERS[item.type](item, given);
      results.push(verdict.correct);
      built.lock();
      check.hidden = true;
      next.hidden = false;
      feedback.className = `ex-feedback ${verdict.correct ? 'is-ok' : 'is-bad'}`;
      const lead = verdict.correct ? 'Bien.' : 'Se dice:';
      feedback.replaceChildren(lead, ' ', el('b', { lang: 'en', text: verdict.expected }), item.explain ? ` ${item.explain}` : '');
      next.focus();
    });
    next.addEventListener('click', () => { index += 1; show(); });

    stage.replaceChildren(el('div', { class: 'ex-card' }, dots(), say, el('p', { class: 'ex-prompt', text: item.prompt }), built.node, feedback, el('div', { class: 'ex-actions' }, check, next)));
  };

  const finish = () => {
    const { correct, total, passed } = summarize(results, set.passMark);
    if (passed) markEnglishReady(set.slug);
    const again = el('button', { class: 'button-primary', type: 'button', text: 'Otra vez' });
    again.addEventListener('click', start);
    stage.replaceChildren(el('div', { class: 'ex-card ex-done' },
      el('p', { class: 'card-kicker', text: 'Al primer intento' }),
      el('p', { class: 'quiz-score', text: `${correct} de ${total}` }),
      el('p', { class: 'quiz-verdict', text: passed ? 'Lo tenés. Tema guardado como listo.' : 'Casi. Repasá las frases y probá de nuevo.' }),
      el('div', { class: 'ex-actions' }, again)));
  };

  start();
};

export const mountExerciseSets = () => {
  document.querySelectorAll('[data-exercise-set]').forEach((root) => {
    if (root.dataset.exMounted) return;
    root.dataset.exMounted = '1';
    let set;
    try {
      set = JSON.parse(root.querySelector('[data-exercise-json]')?.textContent ?? '');
    } catch {
      root.hidden = true;
      return;
    }
    const errors = validateSet(set);
    if (errors.length) {
      console.error('Set de ejercicios inválido:', errors);
      root.hidden = true;
      return;
    }
    runSet(root, set);
  });
};
```

- [ ] **Step 3: Estilos (mobile-first, blancos de toque de 48 px)**

`src/styles/english-exercises.css`:

```css
.ex-card{display:grid;gap:14px;padding:18px;border:1px solid var(--line);border-radius:var(--radius-card);background:var(--card)}
.ex-dots{display:flex;gap:6px}
.ex-dots span{width:10px;height:10px;border-radius:50%;background:var(--line)}
.ex-dots .is-now{background:var(--accent)}
.ex-dots .is-ok{background:var(--en-ok,var(--accent))}
.ex-dots .is-bad{background:var(--en-bad,var(--ember))}
.ex-prompt{margin:0;font-size:1.05rem;line-height:1.45;color:var(--ink)}
.ex-say{justify-self:start}
.ex-options{display:grid;gap:10px}
.ex-options-row{grid-template-columns:1fr 1fr}
.ex-option{min-height:48px;padding:12px 14px;text-align:left;font:inherit;color:var(--ink);background:var(--paper);border:1px solid var(--line);border-radius:var(--radius-button)}
.ex-options-row .ex-option{text-align:center}
.ex-option[aria-pressed="true"]{border-color:var(--accent);box-shadow:0 0 0 1px var(--accent)}
.ex-option:disabled{opacity:.7}
.ex-sentence{margin:0;display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:1.05rem;color:var(--ink)}
.ex-input{min-height:48px;min-width:8ch;flex:1 1 8ch;padding:10px 12px;font:inherit;color:var(--ink);background:var(--paper);border:1px solid var(--line);border-radius:var(--radius-button)}
.ex-input:focus{outline:2px solid var(--accent);outline-offset:1px}
.ex-order{display:grid;gap:12px}
.ex-built,.ex-bank{display:flex;flex-wrap:wrap;gap:8px;min-height:56px;padding:10px;border:1px dashed var(--line);border-radius:var(--radius-card)}
.ex-bank{border-style:solid}
.ex-chip{min-height:44px;padding:8px 14px;font:inherit;color:var(--ink);background:var(--paper);border:1px solid var(--line);border-radius:var(--radius-button)}
.ex-chip.is-built{border-color:var(--accent)}
.ex-feedback{min-height:1.4em;margin:0;color:var(--muted)}
.ex-feedback.is-ok{color:var(--en-ok,var(--accent))}
.ex-feedback.is-bad{color:var(--en-bad,var(--ember))}
.ex-actions{display:flex;flex-wrap:wrap;gap:10px}
.ex-actions>*{flex:1 1 140px}
@media (prefers-reduced-motion:no-preference){.ex-option,.ex-chip{transition:border-color .15s,box-shadow .15s}}
@media (min-width:541px){.ex-actions>*{flex:0 0 auto}}
```

- [ ] **Step 4: Verificar que compila**

Run: `npm run build 2>&1 | tail -5`
Expected: build sin errores (el componente aún no se usa; solo debe compilar).

- [ ] **Step 5: Commit**

```bash
git add src/scripts/exercises/engine.js src/components/ExerciseSet.astro src/styles/english-exercises.css
git commit -m "feat: motor de ejercicios (mcq, tf, gap, order) con componente y estilos"
```

---

### Task 6: Tiempo — de teoría a "cómo se dice"

**Files:**
- Create: `src/data/english-sets.js`
- Modify: `src/pages/ingles/tiempo.astro`, `src/scripts/weather.js`, `src/data/weather.js`, `src/styles/english-weather.css`, `src/data/english.js` (blurb de Tiempo)

**Interfaces:**
- Consumes: `ExerciseSet.astro` y `mountExerciseSets` (Task 5); `mountListen`, `mountEnglishProgress` de `src/scripts/english.js`.
- Produces: `weatherSet` (esquema del Task 4) con slug `tiempo`.

Se conservan los bloques **Nubes (octas)**, **Fenómenos (combinador)** y **En la radio**, que la dueña quiere mantener simplificados; se eliminan **METAR**, **TAF** y **Ponete a prueba** (el quiz código→significado), que se reemplaza por el set nuevo.

- [ ] **Step 1: Crear el set de ejercicios (contenido original)**

`src/data/english-sets.js`:

```js
/** Sets de ejercicios del motor. Esquema en src/scripts/exercises/validate.js. */

/** Cómo se dice el tiempo por radio. */
export const weatherSet = {
  id: 'weather-say',
  slug: 'tiempo',
  title: 'Decilo en la radio',
  lede: 'Ocho frases del tiempo. Elegí, completá u ordená cómo se dicen.',
  items: [
    { id: 'w1', type: 'mcq', prompt: 'Querés pedir el tiempo actual del aeródromo. ¿Qué decís?', say: 'Request current weather',
      options: ['Request current weather', 'Weather is requested by me', 'Give weather now', 'Say the cloud'], answer: 0 },
    { id: 'w2', type: 'mcq', prompt: 'El controlador te da la visibilidad: ocho kilómetros.', say: 'Visibility eight kilometres',
      options: ['Visible is eight kilometres', 'See eight kilometres', 'Visibility eight kilometres', 'Visibility is of eight'], answer: 2 },
    { id: 'w3', type: 'gap', prompt: 'Viento de 270 grados, 15 nudos.', say: 'Wind two seven zero degrees one five knots',
      sentence: 'Wind two seven zero degrees ___ knots', answers: ['one five'] },
    { id: 'w4', type: 'gap', prompt: 'Nubes fragmentadas a dos mil pies.', say: 'Cloud broken at two thousand feet',
      sentence: 'Cloud ___ at two thousand feet', answers: ['broken'] },
    { id: 'w5', type: 'order', prompt: 'Hay tormenta eléctrica en las cercanías del aeródromo.', say: 'Thunderstorm in the vicinity',
      tokens: ['Thunderstorm', 'in', 'the', 'vicinity'], answer: ['Thunderstorm', 'in', 'the', 'vicinity'] },
    { id: 'w6', type: 'tf', prompt: 'Por radio, un QNH de 1013 se dice “one zero one three”.', answer: true },
    { id: 'w7', type: 'mcq', prompt: 'Querés avisar que se reportó cortante de viento en final.', say: 'Windshear reported on final',
      options: ['Wind cut on the end', 'Windshear reported on final', 'Final has wind change report', 'Shear of wind is final'], answer: 1 },
    { id: 'w8', type: 'tf', prompt: '“Visible is eight kilometres” es la forma correcta de informar la visibilidad.', answer: false,
      explain: 'La palabra es “visibility”.' },
  ],
};
```

- [ ] **Step 2: Leer lo que se va a recortar**

Run: `grep -n "<section\|<h2\|mount" src/pages/ingles/tiempo.astro`
Anotar las secciones: El METAR, Nubes, Fenómenos, El TAF, En la radio, Ponete a prueba, y las llamadas `mount*` del `<script>` final.

- [ ] **Step 3: Editar `tiempo.astro`**

- Borrar las secciones "El METAR" y "El TAF", y la sección "Ponete a prueba" completa (con su `noscript`).
- Importar `ExerciseSet` y `weatherSet`, y poner `<ExerciseSet set={weatherSet} />` en el lugar de la sección "Ponete a prueba".
- En el `<script>` final, importar `mountExerciseSets` desde `'../../scripts/exercises/engine.js'`, llamarlo, y quitar las llamadas a `mountReader`, `mountTaf` y `mountQuiz` (y sus imports).
- Ajustar el `h1`/`en-deck` para que hablen de cómo se dice el tiempo (ej. deck: `Las nubes, los fenómenos y el viento por radio: qué palabras usar y cómo se dicen.`).

- [ ] **Step 4: Borrar el código y los datos que quedaron sin uso**

En `src/scripts/weather.js`: eliminar `mountReader`, `mountTaf`, `mountQuiz` y los helpers que solo ellos usaban.
En `src/data/weather.js`: eliminar `metars`, `taf` y `weatherPool` **solo si** `grep -rn "metars\|weatherPool\|\btaf\b" src/ --include=*.js --include=*.astro` ya no los encuentra fuera de su definición; conservar `wxCommon`, `wxPhenomena`, `weatherRadio`, `heightSay` y lo que usen Nubes y Fenómenos.
En `src/styles/english-weather.css`: borrar las reglas de las clases que ya no aparecen en el HTML. Verificación: `npm run build` y luego, para cada prefijo candidato (`wt-`, `wq-`, y las clases del lector de METAR), `grep -c "<prefijo>" dist/ingles/tiempo/index.html` debe dar 0 antes de borrarlas.

- [ ] **Step 5: Actualizar el blurb del tema**

Run: `grep -n "slug: 'tiempo'" src/data/english.js`
Cambiar el `blurb` a: `Cómo se dicen las nubes, los fenómenos y el viento por radio.`

- [ ] **Step 6: Verificar build y tests**

Run: `npm test 2>&1 | tail -6 && npm run build 2>&1 | tail -5`
Expected: tests `pass 12`, build sin errores. `grep -c "data-exercise-set" dist/ingles/tiempo/index.html` → `1`.

- [ ] **Step 7: Verificar en el navegador a 390 px**

Run: `npm run dev` y abrir `http://localhost:4321/ingles/tiempo` en un viewport de 390×844.
Comprobar: (a) desaparecieron METAR, TAF y la prueba vieja; (b) el set muestra un ítem por vez, los botones se pueden tocar sin zoom y no hay scroll horizontal; (c) con 6 aciertos o más el pie de página muestra "Tema visto"; (d) cada tipo (mcq, gap, order, tf) corrige y muestra "Se dice: …"; (e) “Escuchar” habla en inglés. Sin errores en la consola.

- [ ] **Step 8: Privacidad**

El set no guarda datos nuevos (reutiliza `aerodot:english-status`), así que `privacidad.astro` no cambia. Confirmar: `grep -n "inglés\|ingles" src/pages/privacidad.astro | head`.

- [ ] **Step 9: Commit**

```bash
git add src/data/english-sets.js src/pages/ingles/tiempo.astro src/scripts/weather.js src/data/weather.js src/styles/english-weather.css src/data/english.js
git commit -m "feat: Tiempo pasa a cómo se dice, con set de ejercicios del motor"
```

---

### Task 7: Audio offline y rangos en el service worker

**Files:**
- Create: `public/sw-range.js`
- Test: `test/sw-range.test.mjs`
- Modify: `public/sw.js`, `astro.config.mjs`

**Interfaces:**
- Produces: en el scope del SW, `self.rangeResponse(request, cached): Promise<Response>`: devuelve `cached` si no hay cabecera `Range` válida; 206 con el tramo pedido; 416 si el rango no cabe.

- [ ] **Step 1: Escribir los tests que fallan**

`test/sw-range.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const scope = {};
vm.runInNewContext(readFileSync(new URL('../public/sw-range.js', import.meta.url), 'utf8'), { self: scope, Response });
const { rangeResponse } = scope;

const cached = () => new Response(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), { headers: { 'Content-Type': 'audio/mpeg' } });
const req = (range) => ({ headers: new Headers(range ? { Range: range } : {}) });
const bytes = async (res) => [...new Uint8Array(await res.arrayBuffer())];

test('sin Range devuelve el cuerpo completo', async () => {
  const res = await rangeResponse(req(), cached());
  assert.equal(res.status, 200);
  assert.equal((await bytes(res)).length, 10);
});

test('bytes=2-5 devuelve 206 con ese tramo', async () => {
  const res = await rangeResponse(req('bytes=2-5'), cached());
  assert.equal(res.status, 206);
  assert.deepEqual(await bytes(res), [2, 3, 4, 5]);
  assert.equal(res.headers.get('Content-Range'), 'bytes 2-5/10');
  assert.equal(res.headers.get('Content-Length'), '4');
});

test('bytes=4- llega hasta el final y bytes=0-1 es el comienzo', async () => {
  assert.deepEqual(await bytes(await rangeResponse(req('bytes=4-'), cached())), [4, 5, 6, 7, 8, 9]);
  assert.deepEqual(await bytes(await rangeResponse(req('bytes=0-1'), cached())), [0, 1]);
});

test('sufijo bytes=-3 devuelve los últimos 3 y uno mayor al total devuelve todo', async () => {
  assert.deepEqual(await bytes(await rangeResponse(req('bytes=-3'), cached())), [7, 8, 9]);
  assert.equal((await bytes(await rangeResponse(req('bytes=-500'), cached()))).length, 10);
});

test('un fin mayor al tamaño se recorta y un inicio fuera de rango da 416', async () => {
  assert.deepEqual(await bytes(await rangeResponse(req('bytes=8-99'), cached())), [8, 9]);
  const res = await rangeResponse(req('bytes=50-60'), cached());
  assert.equal(res.status, 416);
  assert.equal(res.headers.get('Content-Range'), 'bytes */10');
});

test('una cabecera ilegible se ignora', async () => {
  assert.equal((await rangeResponse(req('items=1-2'), cached())).status, 200);
});
```

- [ ] **Step 2: Correrlos y ver que fallan**

Run: `npm test 2>&1 | tail -10`
Expected: FAIL (`ENOENT ... sw-range.js`).

- [ ] **Step 3: Implementar**

`public/sw-range.js`:

```js
/* Sirve una respuesta guardada completa como 206 cuando el navegador pide un rango (iOS lo hace con el audio). */
self.rangeResponse = async (request, cached) => {
  const match = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get('range') || '');
  if (!match || (match[1] === '' && match[2] === '')) return cached;
  const buffer = await cached.arrayBuffer();
  const size = buffer.byteLength;
  const start = match[1] === '' ? Math.max(0, size - Number(match[2])) : Number(match[1]);
  const end = match[1] === '' || match[2] === '' ? size - 1 : Math.min(Number(match[2]), size - 1);
  if (start >= size || start > end) {
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  }
  return new Response(buffer.slice(start, end + 1), {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': cached.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Length': String(end - start + 1),
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
    },
  });
};
```

- [ ] **Step 4: Correrlos y ver que pasan**

Run: `npm test 2>&1 | tail -10`
Expected: `fail 0`.

- [ ] **Step 5: Usarlo en `public/sw.js`**

Después de la línea `const BUILD_ID = '__BUILD_ID__';` agregar:

```js
importScripts('/sw-range.js');
```

Cambiar la línea del precache para que también guarde `/audio/` con su ruta exacta:

```js
if (response.ok) await cache.put(/^\/(_assets|audio)\//.test(path) ? path : pageKey(path), response);
```

Agregar el manejador (antes de `self.addEventListener('fetch'`):

```js
const handleAudio = async (event) => {
  const cached = await caches.match(new URL(event.request.url).pathname);
  if (cached) return self.rangeResponse(event.request, cached);
  const response = await fetch(event.request);
  if (response.status === 200) {
    const copy = response.clone();
    event.waitUntil(caches.open(ASSETS_NAME).then((cache) => cache.put(new URL(event.request.url).pathname, copy)));
  }
  return response;
};
```

Y en el `fetch` listener, antes del `else if (/^\/(_assets|fonts)\//...`:

```js
} else if (/^\/audio\//.test(url.pathname)) {
  event.respondWith(handleAudio(event));
```

- [ ] **Step 6: Precargar los mp3 desde `astro.config.mjs`**

Agregar `readdir` al import de `node:fs/promises` y, dentro del hook, después de armar `assets`:

```js
const audioDir = `${outDir}/audio/atis`;
const audio = (await readdir(audioDir).catch(() => [])).filter((name) => name.endsWith('.mp3')).map((name) => `/audio/atis/${name}`);
```

y cambiar `const precache = [...precachePages, ...[...assets].sort()];` por `const precache = [...precachePages, ...[...assets].sort(), ...audio.sort()];`.

- [ ] **Step 7: Verificar**

Run: `npm run build 2>&1 | tail -4 && grep -o '/audio/atis/atis-[0-9].mp3' dist/sw.js | sort -u | wc -l`
Expected: build sin errores y `8`.
Manual (sin automatizar): en `npm run preview`, abrir `/ingles/atis`, en DevTools → Application → Service Workers marcar Offline, recargar y reproducir un ATIS grabado: debe sonar.

- [ ] **Step 8: Commit**

```bash
git add public/sw-range.js public/sw.js astro.config.mjs test/sw-range.test.mjs
git commit -m "fix: audio ATIS offline y soporte de Range en el service worker"
```

---

## Self-review

**Cobertura del spec (sección 7, etapa 1):** motor de ejercicios (Tasks 3–5) ✔; esquema (Task 4) ✔; limpieza del clima (Task 6) ✔; correcciones de paso — Whiskey, texto de audio, `.playwright-mcp/`, `cursor-agent`, precache de mp3 y Range (Tasks 1, 2, 7) ✔. `metres/kilometer` queda para la etapa 2 junto con los textos nuevos de ATIS. "Inicial" para downwind se mantiene por decisión de la dueña (no se toca). Migración de números/ATIS/aeródromo/aeronave: diferida, justificada en "Alcance".

**Placeholders:** ninguno; los pasos de recorte de Tiempo (Task 6, steps 2–4) dependen de leer el archivo, por eso incluyen los comandos `grep` exactos y el criterio para borrar.

**Consistencia de tipos:** `gradeChoice/Tf/Gap/Order` devuelven `{correct, expected}` y `engine.js` los usa tal cual; el esquema del Task 4 coincide con los campos que leen `buildChoice/Tf/Gap/Order` y con `weatherSet`; `markEnglishReady(slug)` se importa de `src/scripts/english.js`, que ya lo exporta.
