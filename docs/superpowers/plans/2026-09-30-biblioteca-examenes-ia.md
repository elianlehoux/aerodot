# Biblioteca + Exámenes IA — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Separar biblioteca de estudio y práctica de exámenes, con sidebar de submenús, acceso directo desde el landing, y timer/contadores en el quiz PPA.

**Architecture:** Astro estático. Datos de navegación (`library-nav.js`) y licencias (`licenses.js`) alimentan páginas y un `LibrarySidebar.astro` (HTML/CSS/JS, sin React/shadcn). `/examenes/[slug]` sirve quiz PPA o placeholder. Redirects en `astro.config.mjs`. Se extiende `practice.js` (timer hacia arriba en mock; Correctas/Errores en ambos modos; práctica en orden completo).

**Tech Stack:** Astro 6, CSS en `global.css`, JS de página en `practice.js`, JSON existente `ppa-questions.json`, chapters en `ppa-course.js`.

**Spec:** `docs/superpowers/specs/2026-09-30-biblioteca-examenes-ia-design.md`

## Global Constraints

- No instalar React ni shadcn; sidebar = concepto sidebar-03 en Astro/CSS/JS.
- Nav global: `Biblioteca` | `Exámenes` (nada de “Licencias” / rutas de estudio).
- Landing: dos CTAs al mismo nivel.
- 8 licencias en `/examenes`; solo PPA con banco; resto “Próximamente” sin cifras inventadas.
- Timer solo en simulacro 100, cuenta hacia arriba (`mm:ss`).
- Correctas/Errores en práctica y simulacro.
- Anti-slop: menos eyebrows, badges y microcopy ornamental en pantallas tocadas.
- Commits frecuentes por tarea; no push salvo pedido explícito.

---

## File map

| File | Responsibility |
|---|---|
| `src/data/licenses.js` | Catálogo de 8 licencias (slug, code, title, available) |
| `src/data/library-nav.js` | Grupos del sidebar + resolución de capítulos desde `ppa-course.js` |
| `src/components/LibrarySidebar.astro` | Menú colapsable + link a Exámenes + drawer mobile |
| `src/components/SiteNav.astro` | Nav compartida Biblioteca \| Exámenes + ThemeToggle |
| `src/pages/index.astro` | Landing dual-CTA, anti-slop |
| `src/pages/temas.astro` | Hub biblioteca con sidebar |
| `src/pages/estudiar/[slug].astro` | Tema + sidebar; framing biblioteca (no ruta PPA) |
| `src/pages/examenes/index.astro` | Lista de licencias |
| `src/pages/examenes/[slug].astro` | Quiz PPA o placeholder |
| `src/pages/practicar.astro` | Eliminar contenido → redirect vía config |
| `src/pages/licencias/index.astro` | Redirect vía config (archivo puede quedar mínimo o borrarse) |
| `src/pages/licencias/ppa.astro` | Redirect vía config |
| `astro.config.mjs` | `redirects` estáticos |
| `src/scripts/practice.js` | Timer, contadores, práctica en orden |
| `src/styles/global.css` | Sidebar, lista exámenes, quiz chrome |

---

### Task 1: Datos — licencias y navegación de biblioteca

**Files:**
- Create: `src/data/licenses.js`
- Create: `src/data/library-nav.js`
- Test: verificación Node inline (no hay test runner en el repo)

**Interfaces:**
- Consumes: `chapters` from `src/data/ppa-course.js` (`{ id, slug, title, ... }`)
- Produces:
  - `licenses`: `Array<{ slug: string, code: string, title: string, available: boolean }>`
  - `libraryGroups`: `Array<{ id: string, title: string, chapterIds: number[] }>`
  - `getLibraryNav()`: returns `Array<{ id, title, chapters: Array<{ id, slug, title }> }>`

- [ ] **Step 1: Crear `src/data/licenses.js`**

```js
/** @typedef {{ slug: string, code: string, title: string, available: boolean }} License */

/** @type {License[]} */
export const licenses = [
  { slug: 'ppa', code: 'PPA', title: 'Piloto Privado de Avión', available: true },
  { slug: 'pca', code: 'PCA', title: 'Piloto Comercial de Avión', available: false },
  { slug: 'tla', code: 'TLA', title: 'Piloto de Transporte de Línea Aérea', available: false },
  { slug: 'iva', code: 'IVA', title: 'Instructor de Vuelo de Avión', available: false },
  { slug: 'riva', code: 'RIVA', title: 'Rehabilitación de Instructor de Vuelo de Avión', available: false },
  { slug: 'ppl', code: 'PPL', title: 'Piloto de Planeador', available: false },
  { slug: 'ivh', code: 'IVH', title: 'Instructor de Vuelo de Helicóptero', available: false },
  { slug: 'dda', code: 'DDA', title: 'Despachante de Aeronaves', available: false },
];

export function getLicense(slug) {
  return licenses.find((license) => license.slug === slug) ?? null;
}
```

- [ ] **Step 2: Crear `src/data/library-nav.js`**

```js
import { chapters } from './ppa-course.js';

export const libraryGroups = [
  { id: 'vuelo-y-aeronave', title: 'Vuelo y aeronave', chapterIds: [1, 2, 3] },
  { id: 'entorno-de-vuelo', title: 'El entorno de vuelo', chapterIds: [6, 7] },
  { id: 'operacion-y-navegacion', title: 'Operación y navegación', chapterIds: [4, 5, 8] },
];

export function getLibraryNav() {
  const byId = Object.fromEntries(chapters.map((chapter) => [chapter.id, chapter]));
  return libraryGroups.map((group) => ({
    id: group.id,
    title: group.title,
    chapters: group.chapterIds.map((id) => {
      const chapter = byId[id];
      if (!chapter) throw new Error(`Missing chapter ${id} in library group ${group.id}`);
      return { id: chapter.id, slug: chapter.slug, title: chapter.title };
    }),
  }));
}
```

- [ ] **Step 3: Verificar datos con Node**

Run:

```bash
node --input-type=module -e "
import { licenses, getLicense } from './src/data/licenses.js';
import { getLibraryNav } from './src/data/library-nav.js';
if (licenses.length !== 8) throw new Error('expected 8 licenses');
if (!getLicense('ppa')?.available) throw new Error('ppa must be available');
if (licenses.filter((l) => l.available).length !== 1) throw new Error('only ppa available');
const nav = getLibraryNav();
if (nav.length !== 3) throw new Error('expected 3 groups');
if (nav.flatMap((g) => g.chapters).length !== 8) throw new Error('expected 8 chapters');
console.log('ok');
"
```

Expected: `ok`

- [ ] **Step 4: Commit**

```bash
git add src/data/licenses.js src/data/library-nav.js
git commit -m "$(cat <<'EOF'
Add license catalog and library nav data.

EOF
)"
```

---

### Task 2: Nav compartida + landing dual-CTA

**Files:**
- Create: `src/components/SiteNav.astro`
- Modify: `src/pages/index.astro`
- Modify: other pages’ headers in later tasks (este task deja el patrón en landing)

**Interfaces:**
- Consumes: none
- Produces: `SiteNav.astro` props `{ current?: 'biblioteca' | 'examenes' | null }`

- [ ] **Step 1: Crear `src/components/SiteNav.astro`**

```astro
---
import ThemeToggle from './ThemeToggle.astro';
const { current = null } = Astro.props;
---
<nav aria-label="Navegación principal">
  <a href="/temas" aria-current={current === 'biblioteca' ? 'page' : undefined}>Biblioteca</a>
  <a href="/examenes" aria-current={current === 'examenes' ? 'page' : undefined}>Exámenes</a>
  <ThemeToggle />
</nav>
```

- [ ] **Step 2: Actualizar `src/pages/index.astro`**

Reemplazar hero/nav/footer según spec:

- Header: wordmark + `<SiteNav />` (sin Licencias).
- Hero sin eyebrow/badge. Título + una frase + dos CTAs iguales:
  - `href="/temas"` → Biblioteca
  - `href="/examenes"` → Practicar exámenes
- Sección secundaria: **dos** bloques (Biblioteca / Exámenes), sin numeración `01/` ni pilar de rutas.
- Footer: links a `/temas` y `/examenes` (no “Rutas por licencia”).
- Meta description sin “rutas de estudio para cada licencia”.

Ejemplo de CTAs:

```astro
<div class="hero-actions">
  <a class="button-primary" href="/temas">Biblioteca <span>→</span></a>
  <a class="button-quiet" href="/examenes">Practicar exámenes <span>→</span></a>
</div>
```

Si `button-quiet` no existe en home, reutilizar el estilo secundario ya presente o el mismo `button-primary` en ambos (mismo nivel visual). Preferir dos botones con peso visual similar.

- [ ] **Step 3: Verificar visualmente / build parcial**

Run: `npm run build`  
Expected: build OK; `/` en `dist/index.html` contiene `/temas`, `/examenes`, y no contiene `/licencias`.

Check rápido:

```bash
rg -n "licencias|Rutas|eyebrow" dist/index.html || true
rg -n "/temas|/examenes" dist/index.html
```

- [ ] **Step 4: Commit**

```bash
git add src/components/SiteNav.astro src/pages/index.astro
git commit -m "$(cat <<'EOF'
Point landing at biblioteca and examenes equally.

EOF
)"
```

---

### Task 3: `LibrarySidebar` + estilos

**Files:**
- Create: `src/components/LibrarySidebar.astro`
- Modify: `src/styles/global.css` (bloquear estilos nuevos al final del archivo, sección clara)

**Interfaces:**
- Consumes: `getLibraryNav()` from `library-nav.js`
- Produces: props `{ activeSlug?: string | null }`
- Markup ids/attrs usados por JS: `[data-library-sidebar]`, `[data-nav-group]`, `[data-sidebar-open]`, `[data-sidebar-close]`, `[data-sidebar-backdrop]`

- [ ] **Step 1: Crear el componente**

```astro
---
import { getLibraryNav } from '../data/library-nav.js';
const { activeSlug = null } = Astro.props;
const groups = getLibraryNav();
const openGroupIds = new Set(
  groups.filter((group) => group.chapters.some((chapter) => chapter.slug === activeSlug)).map((group) => group.id)
);
---
<button type="button" class="sidebar-open" data-sidebar-open>Índice</button>
<div class="sidebar-backdrop" data-sidebar-backdrop hidden></div>
<aside class="library-sidebar" data-library-sidebar aria-label="Índice de la biblioteca">
  <div class="sidebar-top">
    <a class="sidebar-brand" href="/temas">Biblioteca</a>
    <button type="button" class="sidebar-close" data-sidebar-close aria-label="Cerrar índice">×</button>
  </div>
  <nav class="sidebar-nav">
    {groups.map((group) => (
      <details class="sidebar-group" data-nav-group open={openGroupIds.has(group.id) || !activeSlug}>
        <summary>{group.title}</summary>
        <ul>
          {group.chapters.map((chapter) => (
            <li>
              <a
                href={`/estudiar/${chapter.slug}`}
                aria-current={chapter.slug === activeSlug ? 'page' : undefined}
              >{chapter.title}</a>
            </li>
          ))}
        </ul>
      </details>
    ))}
  </nav>
  <div class="sidebar-footer">
    <a href="/examenes">Exámenes</a>
  </div>
</aside>
<script is:inline>
  (() => {
    const sidebar = document.querySelector('[data-library-sidebar]');
    const openBtn = document.querySelector('[data-sidebar-open]');
    const closeBtn = document.querySelector('[data-sidebar-close]');
    const backdrop = document.querySelector('[data-sidebar-backdrop]');
    if (!sidebar || !openBtn || !closeBtn || !backdrop) return;
    const setOpen = (open) => {
      sidebar.classList.toggle('is-open', open);
      backdrop.hidden = !open;
      document.body.classList.toggle('sidebar-lock', open);
    };
    openBtn.addEventListener('click', () => setOpen(true));
    closeBtn.addEventListener('click', () => setOpen(false));
    backdrop.addEventListener('click', () => setOpen(false));
  })();
</script>
```

En hub `/temas` (`activeSlug` null): todos los `<details>` abiertos (`!activeSlug`). En tema: solo el grupo del tema activo abierto por defecto.

- [ ] **Step 2: Añadir CSS** (append a `global.css`)

Incluir al menos:

```css
.library-shell{display:grid;grid-template-columns:260px minmax(0,1fr);gap:clamp(24px,4vw,48px);max-width:1200px;margin:0 auto;padding:24px clamp(18px,4vw,48px) 80px}
.library-sidebar{position:sticky;top:80px;align-self:start;border-right:1px solid var(--line);padding-right:18px}
.sidebar-top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}
.sidebar-brand{color:var(--ink);text-decoration:none;font:500 15px var(--display);letter-spacing:-.02em}
.sidebar-group{border-bottom:1px solid var(--line)}
.sidebar-group>summary{cursor:pointer;list-style:none;padding:12px 0;font:500 13px var(--sans)}
.sidebar-group>summary::-webkit-details-marker{display:none}
.sidebar-group ul{list-style:none;margin:0 0 12px;padding:0 0 0 10px}
.sidebar-group a{display:block;padding:7px 0;color:var(--muted);text-decoration:none;font-size:14px;line-height:1.35}
.sidebar-group a[aria-current="page"]{color:var(--ink);font-weight:500}
.sidebar-footer{margin-top:22px;padding-top:16px;border-top:1px solid var(--line)}
.sidebar-footer a{color:var(--ink);font-size:14px}
.sidebar-open,.sidebar-close{display:none}
.sidebar-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:40}
@media (max-width:860px){
  .library-shell{grid-template-columns:1fr}
  .sidebar-open{display:inline-flex;margin:8px 0 16px;min-height:40px;padding:0 14px;border:1px solid var(--line);border-radius:8px;background:var(--paper);font-size:14px}
  .sidebar-close{display:inline-flex;border:0;background:transparent;font-size:24px;line-height:1}
  .library-sidebar{position:fixed;inset:0 auto 0 0;width:min(320px,88vw);z-index:50;background:var(--paper);padding:18px;border-right:1px solid var(--line);transform:translateX(-105%);transition:transform .2s ease}
  .library-sidebar.is-open{transform:translateX(0)}
  body.sidebar-lock{overflow:hidden}
}
```

Ajustar variables si el proyecto usa nombres distintos (`--ink`, `--line`, `--paper`, `--muted` ya existen en el CSS actual).

- [ ] **Step 3: Commit**

```bash
git add src/components/LibrarySidebar.astro src/styles/global.css
git commit -m "$(cat <<'EOF'
Add collapsible library sidebar without React.

EOF
)"
```

---

### Task 4: Integrar sidebar en `/temas` y `/estudiar/[slug]`

**Files:**
- Modify: `src/pages/temas.astro`
- Modify: `src/pages/estudiar/[slug].astro`

**Interfaces:**
- Consumes: `LibrarySidebar`, `SiteNav`, `getLibraryNav` / `chapters`

- [ ] **Step 1: Reescribir layout de `temas.astro`**

- Header con `<SiteNav current="biblioteca" />`.
- Quitar aside `library-route-note` y links a `/licencias`.
- Envolver contenido en `.library-shell`: sidebar + main.
- Mantener búsqueda de temas si ya existe; índices desde `getLibraryNav()` (o groups de `library-nav.js`) en lugar de groups locales duplicados.
- Copy más limpio: título + frase; sin eyebrow con punto si se puede.

- [ ] **Step 2: Actualizar `estudiar/[slug].astro`**

- Header: `<SiteNav current="biblioteca" />` (quitar `study-counter` tipo `PPA · TEMA…`).
- Layout `.library-shell` con `<LibrarySidebar activeSlug={chapter.slug} />`.
- Back link a `/temas`.
- En cierre del tema: link a practicar → `/examenes/ppa?chapter=${chapter.id}` (no `/practicar`).
- Pagination final: si no hay next chapter, link a `/examenes` o `/examenes/ppa`, no “ruta PPA”.
- Quitar framing “Manual PPA · págs…” del meta si suena a ruta de licencia; se puede dejar fuente corta (“Manual ANAC”) o solo lecciones.

- [ ] **Step 3: Build + grep**

```bash
npm run build
rg -n "licencias|/practicar" dist/temas/index.html dist/estudiar -g '*.html' || true
```

Expected: sin links de producto a `/licencias`; práctica apunta a `/examenes/ppa`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/temas.astro src/pages/estudiar/\[slug\].astro
git commit -m "$(cat <<'EOF'
Wire library pages to shared sidebar navigation.

EOF
)"
```

---

### Task 5: Páginas `/examenes` + `/examenes/[slug]`

**Files:**
- Create: `src/pages/examenes/index.astro`
- Create: `src/pages/examenes/[slug].astro`
- Modify: `src/styles/global.css` (lista de exámenes)

**Interfaces:**
- Consumes: `licenses`, `getLicense` from `licenses.js`; bank + chapters for PPA branch
- Produces: static paths for every license slug

- [ ] **Step 1: Crear `src/pages/examenes/index.astro`**

Lista vertical limpia (inspirada en la captura del usuario, sin badges):

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import SiteNav from '../../components/SiteNav.astro';
import { licenses } from '../../data/licenses.js';
---
<BaseLayout title="Exámenes — Altura" description="Practicá exámenes teóricos por licencia aeronáutica en Argentina.">
  <header class="site-header study-header">
    <a class="wordmark" href="/">altura<span class="wordmark-dot">.</span></a>
    <SiteNav current="examenes" />
  </header>
  <main class="exam-hub">
    <h1>Exámenes</h1>
    <p>Elegí la licencia. Por ahora solo PPA tiene banco de preguntas.</p>
    <ul class="exam-license-list">
      {licenses.map((license) => (
        <li>
          {license.available ? (
            <a class="exam-license-row" href={`/examenes/${license.slug}`}>
              <span class="exam-license-code">{license.code}</span>
              <span class="exam-license-title">{license.title}</span>
              <span class="exam-license-meta">Disponible</span>
            </a>
          ) : (
            <div class="exam-license-row is-soon">
              <span class="exam-license-code">{license.code}</span>
              <span class="exam-license-title">{license.title}</span>
              <span class="exam-license-meta">Próximamente</span>
            </div>
          )}
        </li>
      ))}
    </ul>
  </main>
</BaseLayout>
```

CSS sugerido (append):

```css
.exam-hub{max-width:720px;margin:0 auto;padding:48px clamp(18px,4vw,48px) 90px}
.exam-hub h1{margin:0 0 10px;font:300 clamp(40px,6vw,64px)/1 var(--display);letter-spacing:-.05em}
.exam-hub>p{margin:0 0 28px;color:var(--muted);font-size:16px;line-height:1.6}
.exam-license-list{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
.exam-license-row{display:grid;grid-template-columns:72px minmax(0,1fr) auto;gap:12px;align-items:center;padding:16px 4px;border-bottom:1px solid var(--line);color:var(--ink);text-decoration:none}
.exam-license-row.is-soon{color:var(--muted)}
.exam-license-code{font:500 13px var(--mono)}
.exam-license-title{font-size:16px}
.exam-license-meta{font-size:13px;color:var(--muted)}
```

PPA disponible = link. Resto = `div` no clickeable con “Próximamente” (también aceptable link al placeholder; preferir no clickeable en el hub para claridad).

- [ ] **Step 2: Crear `src/pages/examenes/[slug].astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import SiteNav from '../../components/SiteNav.astro';
import { licenses, getLicense } from '../../data/licenses.js';
import { chapters } from '../../data/ppa-course.js';
import bank from '../../data/ppa-questions.json';

export function getStaticPaths() {
  return licenses.map((license) => ({ params: { slug: license.slug }, props: { license } }));
}

const { license } = Astro.props;
const isPpa = license.slug === 'ppa' && license.available;
const allQuestions = isPpa ? bank.chapters.flatMap((chapter) => chapter.questions) : [];
const verifiedQuestions = allQuestions.filter((question) => Number.isInteger(question.answerIndex)).length;
---
```

- Si **no** PPA: página corta con `h1` = título, párrafo “El banco de preguntas de esta licencia está en preparación.”, link “← Todas las licencias” a `/examenes`.
- Si **PPA**: migrar el markup útil de `src/pages/practicar.astro` (start panel, quiz, results), con estos cambios de UI:
  - Header `SiteNav current="examenes"`.
  - Título/copy limpios: “Piloto Privado de Avión” + dos acciones claras.
  - Botones: `Practicar` (orden) y `Examen de prueba` (100 aleatorias). Renombrar ids si hace falta pero mantener compatibilidad con `practice.js` (`#startStudy`, `#startMock`, etc.) **o** actualizar el script en Task 6.
  - En `#quiz` añadir:
    - `<span id="quizTimer" hidden>00:00</span>`
    - `<div class="quiz-score"><span>Correctas: <b id="scoreCorrect">0</b></span><span>Errores: <b id="scoreWrong">0</b></span></div>`
  - En results: elemento `<p id="resultTime" hidden></p>` para tiempo total del mock.
  - Script: `<script src="../../scripts/practice.js"></script>`

- [ ] **Step 3: Build**

```bash
npm run build
test -f dist/examenes/index.html
test -f dist/examenes/ppa/index.html
test -f dist/examenes/pca/index.html
```

Expected: archivos existen.

- [ ] **Step 4: Commit**

```bash
git add src/pages/examenes src/styles/global.css
git commit -m "$(cat <<'EOF'
Add examenes hub and per-license pages.

EOF
)"
```

---

### Task 6: Quiz — práctica en orden, timer, contadores

**Files:**
- Modify: `src/scripts/practice.js`
- Modify: `src/pages/examenes/[slug].astro` (si faltan nodos DOM)
- Modify: `src/styles/global.css` (`.quiz-score`, `#quizTimer`)

**Interfaces:**
- DOM ids: `#quizTimer`, `#scoreCorrect`, `#scoreWrong`, `#resultTime`
- Modes: `practice` | `mock` (existentes)
- Practice pool: **todas** las preguntas del filtro, **en orden del banco** (no `shuffle().slice(0, 20)`)
- Mock: igual que ahora — shuffle + slice 100 verificadas; timer on

- [ ] **Step 1: Extender estado y helpers en `practice.js`**

Añadir cerca del top (después de `answered`):

```js
let timerId = null;
let timerStartedAt = 0;

const pad = (n) => String(n).padStart(2, '0');
const formatElapsed = (ms) => {
  const totalSec = Math.floor(ms / 1000);
  const mm = Math.floor(totalSec / 60);
  const ss = totalSec % 60;
  return `${pad(mm)}:${pad(ss)}`;
};

const stopTimer = () => {
  if (timerId) clearInterval(timerId);
  timerId = null;
};

const startTimer = () => {
  stopTimer();
  timerStartedAt = Date.now();
  const el = document.querySelector('#quizTimer');
  if (!el) return;
  el.hidden = false;
  el.textContent = '00:00';
  timerId = setInterval(() => {
    el.textContent = formatElapsed(Date.now() - timerStartedAt);
  }, 250);
};

const hideTimer = () => {
  stopTimer();
  const el = document.querySelector('#quizTimer');
  if (el) {
    el.hidden = true;
    el.textContent = '00:00';
  }
};

const liveScore = () => {
  const scored = answers.filter(Boolean);
  const correct = scored.filter((a) => a.known && a.correct).length;
  const wrong = scored.filter((a) => a.known && !a.correct).length;
  const c = document.querySelector('#scoreCorrect');
  const w = document.querySelector('#scoreWrong');
  if (c) c.textContent = String(correct);
  if (w) w.textContent = String(wrong);
};
```

- [ ] **Step 2: Llamar `liveScore()` al final de `choose()`** (después de registrar `answers[index]`).

- [ ] **Step 3: Cambiar `begin()`**

```js
const begin = (selected, selectedMode) => {
  mode = selectedMode;
  let pool = selected === 'all' ? allQuestions : allQuestions.filter((q) => q.chapter === Number(selected));
  if (mode === 'mock') {
    pool = shuffle(pool.filter((q) => Number.isInteger(q.answerIndex))).slice(0, 100);
  }
  // practice: keep bank order, full filtered pool (no shuffle/slice)
  if (!pool.length) return;
  queue = pool;
  answers = [];
  index = 0;
  liveScore();
  startPanel.hidden = true;
  results.hidden = true;
  quiz.hidden = false;
  document.querySelector('#quizMode').textContent = mode === 'mock' ? 'Examen de prueba · 100 preguntas' : 'Práctica';
  if (mode === 'mock') startTimer();
  else hideTimer();
  setQuestion();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
```

- [ ] **Step 4: En `showResults()`**

```js
const elapsed = timerStartedAt ? formatElapsed(Date.now() - timerStartedAt) : null;
hideTimer();
const resultTime = document.querySelector('#resultTime');
if (resultTime) {
  if (mode === 'mock' && elapsed) {
    resultTime.hidden = false;
    resultTime.textContent = `Tiempo: ${elapsed}`;
  } else {
    resultTime.hidden = true;
    resultTime.textContent = '';
  }
}
```

- [ ] **Step 5: Al salir / volver / repaso**

- `#exitQuiz` y `#finishQuiz`: llamar `hideTimer()` y `liveScore()` reset (answers vacío → scores 0).
- `#retryWrong` / `#startReview`: `hideTimer()` (son práctica), `liveScore()` tras reiniciar answers.

- [ ] **Step 6: CSS mínimo para score/timer**

```css
.quiz-top{display:flex;flex-wrap:wrap;align-items:center;gap:10px 16px}
#quizTimer{margin-left:auto;font:500 14px var(--mono);color:var(--ink)}
.quiz-score{display:flex;gap:16px;margin:8px 0 0;font-size:14px}
.quiz-score b{font-weight:600}
```

Ajustar si `.quiz-top` ya existe: no romper layout; integrar timer a la derecha.

- [ ] **Step 7: Verificación manual checklist**

1. `/examenes/ppa` → Practicar: sin timer; Correctas/Errores suben; preguntas en orden del banco (o del capítulo).
2. Examen de prueba: timer corre; 100 preguntas; scores vivos; al final muestra Tiempo.
3. Salir del quiz: timer se detiene/oculta.

- [ ] **Step 8: Commit**

```bash
git add src/scripts/practice.js src/pages/examenes/\[slug\].astro src/styles/global.css
git commit -m "$(cat <<'EOF'
Add exam timer and live score to PPA practice.

EOF
)"
```

---

### Task 7: Redirects de rutas viejas

**Files:**
- Modify: `astro.config.mjs`
- Modify or replace: `src/pages/practicar.astro`, `src/pages/licencias/index.astro`, `src/pages/licencias/ppa.astro`

**Interfaces:**
- Astro static redirects map

- [ ] **Step 1: Añadir redirects en `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  build: {
    assets: '_assets',
  },
  redirects: {
    '/practicar': '/examenes/ppa',
    '/licencias': '/examenes',
    '/licencias/ppa': '/examenes/ppa',
  },
});
```

- [ ] **Step 2: Evitar páginas viejas como destinos de contenido**

Opciones válidas (elegir una y ser consistente):

**A (preferida):** Borrar el contenido de producto de `practicar.astro` / `licencias/*` y dejar solo páginas mínimas que no compitan, **o** eliminar los archivos si los redirects de config bastan en el build.

Si Astro exige que no haya page + redirect conflictivo, eliminar:

- `src/pages/practicar.astro`
- `src/pages/licencias/index.astro`
- `src/pages/licencias/ppa.astro`

y confiar en `redirects`.

- [ ] **Step 3: Build y comprobar redirects**

```bash
npm run build
rg -n "examenes/ppa|redirect" dist -g '*.html' | head
# Según versión de Astro, puede generar HTML de redirect o entradas en _routes / meta refresh.
ls dist/practicar 2>/dev/null || ls dist/practicar.html 2>/dev/null || echo "check redirect artifacts in dist"
```

Expected: build OK; visitar `/practicar` en `astro preview` termina en `/examenes/ppa`.

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs src/pages/practicar.astro src/pages/licencias
git commit -m "$(cat <<'EOF'
Redirect legacy license and practice routes.

EOF
)"
```

---

### Task 8: Pass anti-slop + verificación final

**Files:**
- Modify: pantallas tocadas (`index`, `temas`, `estudiar`, `examenes`) y CSS si sobran badges
- Test: build + checklist del spec

- [ ] **Step 1: Barrido de copy/UI**

En archivos modificados, eliminar o reducir:

- Eyebrows con `eyebrow-dot`
- Badges tipo `01 /`, `DISPONIBLE · ARGENTINA`, `PRÁCTICA · PPA` en header
- Tiras de metadata no accionables
- Texto que empuje “ruta de estudio / licencias” como producto

Mantener tipografía y colores del sitio.

- [ ] **Step 2: Grep de regresión**

```bash
rg -n "href=\"/licencias\"|href=\"/practicar\"|Rutas de estudio|library-route-note" src || true
npm run build
```

Expected: sin links de producto a rutas viejas (salvo comentarios/redirects); build OK.

- [ ] **Step 3: Checklist manual del spec**

- [ ] Landing: dos CTAs + nav Biblioteca | Exámenes
- [ ] Biblioteca: sidebar grupos/temas; mobile Índice
- [ ] Tema activo resaltado
- [ ] `/examenes`: 8 filas; solo PPA clickeable/disponible
- [ ] Placeholder no-PPA
- [ ] PPA práctica: orden, scores, sin timer
- [ ] PPA mock: timer ↑, scores, tiempo en resultado
- [ ] Redirects `/practicar`, `/licencias`, `/licencias/ppa`

- [ ] **Step 4: Commit final**

```bash
git add -u src astro.config.mjs
git commit -m "$(cat <<'EOF'
Polish copy and verify biblioteca/examenes split.

EOF
)"
```

---

## Spec coverage self-review

| Spec requirement | Task |
|---|---|
| Landing dual CTA | Task 2 |
| Nav Biblioteca \| Exámenes | Task 2 (+ 4, 5) |
| Quitar rutas de estudio como producto | Tasks 2, 4, 7 |
| Sidebar concepto sidebar-03 sin React | Tasks 3–4 |
| Grupos de biblioteca acordados | Task 1 + 3 |
| `/examenes` con 8 licencias | Task 5 |
| Solo PPA disponible; resto Próximamente sin cifras | Task 5 |
| `/examenes/[slug]` dinámico | Task 5 |
| Practicar en orden + examen 100 | Task 6 |
| Timer hacia arriba solo mock | Task 6 |
| Correctas/Errores ambos modos | Task 6 |
| Redirects legacy | Task 7 |
| Anti-slop | Tasks 2, 5, 8 |
| Build / testing manual | Tasks 5–8 |

## Placeholder / consistency notes

- IDs de botones del quiz se mantienen (`#startStudy`, `#startMock`) para no romper listeners; labels visibles sí cambian a “Practicar” / “Examen de prueba”.
- Practice mode **deja de** usar `shuffle().slice(0, 20)` — alineado al spec (“todas en orden”).
- `SiteNav` se adopta en landing primero; biblioteca y exámenes lo usan en tasks 4–5.
