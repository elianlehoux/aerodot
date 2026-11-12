# Rediseño de UI "carta de navegación": plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Llevar todo Aerodot al estilo de carta de navegación aprobado, con navegación de teléfono por menú desplegable y animaciones que respondan al uso.

**Architecture:** Se cambian los valores de los tokens existentes en `global.css`, así la mayor parte del sitio hereda la paleta sin tocar reglas. El encabezado, el menú del teléfono y la portada se reescriben como piezas propias (componente + hoja de estilo). El resto de las pantallas se ajusta sobre `visual-system.css` y los `english*.css`.

**Tech Stack:** Astro 6, CSS con tokens, SVG en línea, JS propio sin dependencias nuevas, `node --test`.

**Spec:** `docs/superpowers/specs/2026-11-11-rediseno-ui-design.md`. Maquetas: `docs/superpowers/specs/2026-11-11-rediseno-ui/portada.html` y `telefono-menu.html`. Leer las tres antes de empezar; las maquetas mandan en lo visual.

## Global Constraints

- Node 22.12 o superior. Antes de cualquier comando: `source ~/.nvm/nvm.sh && nvm use 24`.
- Solo pnpm. Sin dependencias nuevas.
- No hacer commit ni push. Al final de cada tarea los cambios quedan en el árbol de trabajo. Donde una skill de ejecución pida "commit", se reemplaza por correr `pnpm build && pnpm test`.
- Un solo acento: `--accent` (`#b3196f` claro, `#ff6fb5` oscuro). Nada de naranja. Verde y rojo solo para corrección de respuestas.
- Sin barra de navegación inferior. Sin navegación duplicada en una misma pantalla.
- Textos de interfaz: voseo, sin emojis, sin rayas largas, mayúscula solo al inicio. Textos nuevos permitidos: "Abrir el menú de secciones", "Cerrar el menú", "Modo oscuro".
- No se toca contenido, datos, lógica de ejercicios o exámenes, ni el interior de los diagramas de `StudyDiagram.astro`.
- Solo se animan `transform`, `opacity`, `clip-path`, `translate`, `scale`, `rotate` y trazos de SVG. Con `prefers-reduced-motion: reduce` nada se mueve y todo queda en su estado final.
- Todo control táctil mide 44 px o más. Sin desplazamiento horizontal desde 320 px de ancho.
- Cortes de pantalla: teléfono hasta 680 px, tablet 681 a 1180 px, escritorio desde 1181 px.
- Familias tipográficas sin cambios (Newsreader, Source Sans 3).

## Review Focus

1. Navegador sin JavaScript en teléfono: el menú de secciones igual se abre y los enlaces funcionan. Cubierto en Tarea 3, paso 6.
2. Movimiento reducido con el avioncito: `animateMotion` no obedece la regla CSS global; el avión no debe moverse. Cubierto en Tarea 4, paso 6.
3. Teléfono apaisado o pantalla baja (por ejemplo 740x360) en la portada: los tres botones siguen alcanzables con scroll y nada se superpone. Cubierto en Tarea 4, paso 5.
4. Etiquetas largas o letra agrandada por el usuario (zoom de texto al 200 %): los botones "tecla" crecen en alto y no cortan el texto. Cubierto en Tarea 2, paso 5.
5. Tema oscuro guardado de una visita anterior: la primera pintura sale oscura, sin destello claro, y `theme-color` coincide. Cubierto en Tarea 1, paso 5.

---

## Estructura de archivos

| Archivo | Responsabilidad |
|---|---|
| `src/styles/global.css` (modificar) | Tokens de color claro y oscuro, transición entre páginas |
| `src/styles/visual-system.css` (modificar) | Botones, pie, índices, lectura, exámenes, diálogos |
| `src/styles/site-header.css` (crear) | Encabezado, enlaces, interruptor de tema, menú del teléfono |
| `src/styles/chart-home.css` (crear) | Portada |
| `src/components/SiteNav.astro` (modificar) | Enlaces de escritorio y menú del teléfono |
| `src/components/ThemeToggle.astro` (modificar) | Tres variantes del interruptor |
| `src/components/HomeChart.astro` (crear) | Los dos SVG de la portada |
| `src/scripts/site-menu.js` (crear) | Comportamiento del menú del teléfono |
| `src/pages/index.astro` (modificar) | Marcado de la portada |
| `src/styles/english*.css` (modificar) | Colores fijos que desentonen |
| `test/theme-contrast.test.mjs` (crear) | Contraste AA de los tokens |
| `src/layouts/BaseLayout.astro`, `public/manifest.webmanifest` (modificar) | `theme-color` |

`site-header.css` y `chart-home.css` se importan desde `BaseLayout.astro` e `index.astro` respectivamente. Las reglas de encabezado y de portada que hoy viven en `visual-system.css` se mueven a esos archivos y se borran del original.

Para toda revisión visual: `pnpm dev --port 4399` y capturas con Playwright guardadas en `.playwright-mcp/` (ya está en `.gitignore`). Borrar las capturas al cerrar cada tarea.

---

### Task 1: Tokens de color y contraste

**Files:**
- Create: `test/theme-contrast.test.mjs`
- Modify: `src/styles/global.css` (bloques `:root` y `html[data-theme="light"]`)
- Modify: `src/layouts/BaseLayout.astro` (meta `theme-color` y función `update`)
- Modify: `public/manifest.webmanifest`

**Interfaces:**
- Produces: tokens nuevos `--relief` y `--chart-blue`, disponibles en los dos temas. Todos los tokens existentes conservan su nombre.

- [ ] **Step 1: Escribir la prueba de contraste**

`test/theme-contrast.test.mjs` lee `src/styles/global.css`, extrae los tokens hexadecimales del bloque `:root` (oscuro) y del bloque `html[data-theme="light"]`, y calcula el contraste WCAG. Dos pruebas, `tema claro: contraste AA` y `tema oscuro: contraste AA`, que exigen `>= 4.5` para estos pares (texto, fondo):

```
ink/paper, graphite/paper, muted/paper, ash/paper, accent/paper,
ink/card, muted/taupe, ink/quiet, action-text/action, accent-ink/accent
```

Una tercera prueba, `los dos temas definen los mismos tokens de color`, compara los nombres de tokens hexadecimales de ambos bloques.

- [ ] **Step 2: Correr y ver que falla**

Run: `pnpm test`
Expected: FAIL en la tercera prueba (faltan `--relief` y `--chart-blue`) o en algún par.

- [ ] **Step 3: Cargar los valores de la sección 4 del spec en `global.css`**

Claro en `html[data-theme="light"]`, oscuro en `:root`. `--blue` sigue igual a `--ink` en cada tema. `--ember` pasa a `#b0413a` en claro y `#ff8f84` en oscuro (se usa para errores; deja de ser naranja).

- [ ] **Step 4: Ajustar hasta que pase**

Run: `pnpm test`
Expected: PASS. El valor del spec para `--ash` en claro (`#6d7d87`) no llega a 4,5:1 sobre `--paper`; oscurecerlo lo mínimo necesario. Si otro par falla, corregir el token menos visible del par.

- [ ] **Step 5: Actualizar `theme-color` y verificar la primera pintura**

En `BaseLayout.astro`: meta inicial `#f4f7f6`, y en `update` los valores `#0e1a23` (oscuro) y `#f4f7f6` (claro). En el manifest, `background_color` y `theme_color` a `#f4f7f6`.

Verificar en el navegador: con `localStorage['aerodot:theme']='dark'`, recargar `/` y confirmar que `document.documentElement.dataset.theme === 'dark'` antes de `DOMContentLoaded` y que el meta `theme-color` vale `#0e1a23` tras cargar.

- [ ] **Step 6: Cierre**

Run: `pnpm build && pnpm test`
Expected: ambos pasan. Recorrer `/`, `/temas` y un `/estudiar/...` en los dos temas: ya se ven con la paleta nueva, sin texto ilegible.

---

### Task 2: Botones "tecla" y marcador de ruta

**Files:**
- Modify: `src/styles/visual-system.css` (bloque de `.button-primary` y siguientes, `.back-to-top`, `.sidebar-open`)

**Interfaces:**
- Produces:
  - `.key-button`: clase utilitaria con la forma tecla completa. La usan la portada y el menú.
  - `.key-button-go`: el círculo con flecha dentro de un `.key-button`.
  - `.route-mark`: marcador de ruta de 11 px. `.route-mark[data-state="done"]` lleno, `[data-state="half"]` a medio llenar.
  - `--key-lift: 4px` en `:root`.

- [ ] **Step 1: Definir `.key-button`, `.key-button-go` y `.route-mark`**

Valores de la sección "Botones" del spec y de `portada.html` (clase `.wp`): borde `1.5px solid var(--ink)`, radio 999 px, fondo `--paper`, `box-shadow: 0 var(--key-lift) 0 var(--ink)`; hover `translate: 0 2px` con relieve de 2 px; `:active` `translate: 0 var(--key-lift)` sin relieve. El hover va dentro de `@media (hover:hover)`.

- [ ] **Step 2: Aplicar la forma a los botones existentes**

`.button-primary` y `.home-cta-primary`: forma tecla con fondo `--action` y texto `--action-text`. `.button-light`, `.button-quiet`, `.library-copy-page`, `.sidebar-open`: píldora sin relieve, fondo `--quiet`. Conservar `min-height` actuales (46 px).

- [ ] **Step 3: Opciones de respuesta**

`.answer-option`: radio 16 px, borde `1.5px`, `:active` con `scale: .99`. Sin relieve permanente.

- [ ] **Step 4: Colores de corrección**

Ajustar los verdes y rojos fijos de `.answer-option.is-correct/.is-wrong`, `.feedback-*` y `.report-dialog` para papel frío. Claro: verde `#2f6b4f` sobre `#e6f1eb`, rojo `#a2433a` sobre `#f6e9e7`. Oscuro: verde `#6fb894` sobre `#16302a`, rojo `#e08a80` sobre `#35201f`.

- [ ] **Step 5: Verificar con texto agrandado**

En `/examenes/<cualquiera>` y en un capítulo, con zoom de texto del navegador al 200 % en 390 px de ancho: ningún botón corta su texto, los que no entran pasan a dos líneas y crecen en alto.

- [ ] **Step 6: Cierre**

Run: `pnpm build && pnpm test`
Expected: pasan.

---

### Task 3: Encabezado y menú del teléfono

**Files:**
- Create: `src/styles/site-header.css`, `src/scripts/site-menu.js`
- Modify: `src/components/SiteNav.astro`, `src/components/ThemeToggle.astro`, `src/layouts/BaseLayout.astro` (importar el CSS), `src/pages/index.astro` (pasar `home`), `src/styles/visual-system.css` (quitar reglas de `.site-header`, `.ld-dn`, `.theme-*` y sus variantes en los `@media`)

**Interfaces:**
- Consumes: `.key-button`, `.route-mark` (Tarea 2).
- Produces:
  - `SiteNav` props: `current?: 'biblioteca' | 'examenes' | 'ingles' | null`, `home?: boolean` (por defecto `false`).
  - `ThemeToggle` prop: `variant?: 'switch' | 'round' | 'row'` (por defecto `'switch'`). Las tres llevan la clase `.ld-dn`, que es la que engancha el script de tema de `BaseLayout.astro`.
  - `mountSiteMenu(details: HTMLDetailsElement): void` en `site-menu.js`.
  - Clase `menu-lock` en `<html>` mientras el menú está abierto.

- [ ] **Step 1: Marcado de `SiteNav.astro`**

```
<nav class="site-links" aria-label="Navegación principal">   ← visible desde 681 px
  3 enlaces + <ThemeToggle variant="switch" />
</nav>
{home
  ? <ThemeToggle variant="round" />                           ← solo hasta 680 px
  : <details class="site-menu" data-site-menu>                ← solo hasta 680 px
      <summary aria-label="Abrir el menú de secciones"><span class="site-menu-icon"></span></summary>
      <div class="site-menu-scrim" data-site-menu-close></div>
      <nav class="site-menu-panel" aria-label="Secciones">
        3 enlaces con <span class="route-mark">; el actual con aria-current="page"
        <hr> <ThemeToggle variant="row" />
      </nav>
    </details>}
```

Textos de los enlaces del panel: "Biblioteca de teoría", "Exámenes de ANAC", "Inglés OACI". Destinos sin cambios.

- [ ] **Step 2: Variantes de `ThemeToggle.astro`**

`switch`: el marcado actual. `round`: botón redondo con el ícono `moon`/`sun`. `row`: fila de ancho completo con el texto "Modo oscuro" y un interruptor chico. Las tres conservan `role="switch"` y `aria-checked`.

- [ ] **Step 3: Estilos en `site-header.css`**

Tomar medidas de `telefono-menu.html`: encabezado de 54 a 58 px, botón redondo de 34 px con área táctil de 44 px, panel con borde de tinta, radio 20 px y relieve de 5 px, filas de 48 px, velo `rgba(18,34,46,.28)`. Enlaces de escritorio: subrayado magenta de 2 px que crece (`background-size`), completo en `aria-current="page"`. El panel entra con `opacity`, `translate: 0 -10px` y `scale: .97` usando `@starting-style` y `transition-behavior: allow-discrete`. Ícono: dos rayas que forman una cruz con `details[open]`.

- [ ] **Step 4: `mountSiteMenu` en `site-menu.js`**

Al abrir: `aria-label` del summary pasa a "Cerrar el menú", se agrega `menu-lock` a `<html>` y el foco va al primer enlace. Cierra con Escape, clic en `[data-site-menu-close]` o clic en un enlace; al cerrar devuelve el foco al summary. Se monta desde un `<script>` en `SiteNav.astro` sobre cada `[data-site-menu]`. `html.menu-lock{overflow:hidden}` vive en `site-header.css`.

- [ ] **Step 5: Verificar en el navegador**

En 390 px: `/` muestra logo y botón redondo de tema, sin enlaces. `/temas` muestra logo y botón de menú; el panel abre y cierra por las cuatro vías, la sección actual está marcada y el interruptor de tema funciona desde el panel. Con teclado: Tab llega al botón, Enter abre, Tab recorre los tres enlaces y el interruptor, Escape cierra y el foco vuelve al botón. En 1024 px: enlaces a la vista con subrayado, sin botón de menú.

- [ ] **Step 6: Verificar sin JavaScript**

Con JavaScript deshabilitado en 390 px, en `/temas`: tocar el botón abre el panel y los tres enlaces navegan.

- [ ] **Step 7: Cierre**

Run: `pnpm build && pnpm test`
Expected: pasan. Comparar una captura de `/temas` a 390 px con `telefono-menu.html`.

---

### Task 4: Portada

**Files:**
- Create: `src/components/HomeChart.astro`, `src/styles/chart-home.css`
- Modify: `src/pages/index.astro`, `src/styles/visual-system.css` (quitar el bloque "Home" y sus variantes en los `@media`)

**Interfaces:**
- Consumes: `.key-button`, `.key-button-go` (Tarea 2); `SiteNav home` (Tarea 3).
- Produces: `HomeChart` prop `variant: 'wide' | 'tall'`. Clases `.home-chart`, `.home-stage`, `.home-door` (se conserva el nombre para los tres enlaces).

- [ ] **Step 1: `HomeChart.astro`**

Dos SVG decorativos (`aria-hidden="true"`), copiando la geometría de `portada.html`: `wide` con `viewBox="0 0 800 500"` (curvas, anillos, rosa, ruta `M30 468L190 400L430 360L660 250L800 100`, puntos en (190,400), (430,360), (660,250), avioncito) y `tall` con `viewBox="0 0 250 506"`. Colores por `currentColor` o `var(--relief)`, `var(--accent)`, `var(--chart-blue)`, `var(--ink)`, para que respeten el tema. El avioncito va en un `<g class="home-plane">`.

- [ ] **Step 2: Marcado en `index.astro`**

`<section class="home-stage">` con los dos `HomeChart`, el `h1` actual (texto sin cambios), la bajada actual y los tres `<a class="home-door key-button">` con su `.key-button-go`. Textos de los botones: "Biblioteca de teoría", "Exámenes de ANAC", "Inglés OACI".

- [ ] **Step 3: Estilos de escritorio y tablet (desde 681 px)**

`.home-stage` con `container-type: inline-size`, `aspect-ratio: 16/10` y `width: min(1120px, 100%, (100dvh - 170px) * 1.6)`; todo lo de adentro en unidades `cqw` tomadas de `portada.html`, así los botones quedan anclados a sus puntos a cualquier ancho. Se muestra el SVG `wide`.

- [ ] **Step 4: Estilos de teléfono (hasta 680 px)**

Flujo normal: título, bajada, franja de 150 px con el SVG `tall` recortado (`preserveAspectRatio="xMidYMid slice"`), y los tres botones a todo el ancho, de 52 px de alto, apilados con 14 px de separación.

- [ ] **Step 5: Verificar tamaños**

Capturas en 360, 390, 768, 1024 y 1440 px de ancho, y en 740x360 (teléfono apaisado). En todas: sin superposición entre título, ruta y botones; cada botón de escritorio toca su punto; en 740x360 los tres botones se alcanzan con scroll.

- [ ] **Step 6: Animación de entrada y movimiento reducido**

Ruta que se traza en 2,6 s, botones que aparecen escalonados (0,9 s, 1,5 s, 2,1 s), rosa girando en 80 s, avioncito con `animateMotion`. Todo dentro de `@media (prefers-reduced-motion: no-preference)`; fuera de esa media query el estado base es el final. Para el avioncito: `.home-plane{display:none}` por defecto y visible solo dentro de la media query, porque `animateMotion` no se puede pausar con CSS.

Verificar emulando `prefers-reduced-motion: reduce`: ruta completa, botones visibles, sin avión, y `document.getAnimations().length === 0`.

- [ ] **Step 7: Cierre**

Run: `pnpm build && pnpm test`
Expected: pasan. Comparar capturas de 1440 y 390 px con `portada.html`, en los dos temas.

---

### Task 5: Índices como ruta

**Files:**
- Modify: `src/styles/visual-system.css` (`.library-intro`, `.library-search`, `.topic-*`, `.exam-*`), `src/styles/english.css` (lista del índice de Inglés), `src/pages/temas.astro`, `src/pages/examenes/index.astro`, `src/pages/ingles/index.astro` (solo si hace falta un elemento para el marcador)

**Interfaces:**
- Consumes: `.route-mark` (Tarea 2); atributo `data-study-current="listo" | "curso"` que ya escribe `src/scripts/study-progress.js`.

- [ ] **Step 1: Franja de título y buscador**

Franja con curvas de nivel como fondo (SVG en `background-image` por `mask` para tomar `--relief`). Buscador en píldora de 46 px con borde `--stone`, que pasa a `--ink` con foco.

- [ ] **Step 2: Lista como ruta**

Cada lista (`.topic-list`, `.exam-license-list` y la del índice de Inglés) lleva una línea vertical de 2 px en `--accent` a la izquierda y un marcador por fila, hechos con pseudo-elementos. En `/temas`: `data-study-current="listo"` llena el marcador y `"curso"` lo llena a la mitad. Quitar las reglas `::after` que hoy agregan " ✓" y " ·".

- [ ] **Step 3: Filas**

Fila entera clicable, 56 px de alto mínimo hasta 680 px, fondo `--taupe` en hover y foco, flecha que se desplaza 2 px. Al cargar, la línea de ruta crece de arriba abajo una vez (`scale` en Y, 600 ms) y el relleno de los marcadores cambia con una transición de 200 ms; las dos cosas solo con `prefers-reduced-motion: no-preference`.

- [ ] **Step 4: Avance en Inglés y exámenes**

Leer `src/pages/ingles/index.astro` y `src/scripts/english.js`: si el índice ya marca módulos completos con una clase o atributo, usarlo para llenar el marcador. Si no existe, dejar los marcadores vacíos y no agregar lógica.

- [ ] **Step 5: Verificar**

En `/temas`, marcar un tema como listo desde un capítulo y confirmar que su marcador se llena al volver. Buscar un término: los grupos vacíos se ocultan y la línea de ruta no queda colgando. Capturas en 390 y 1440 px de los tres índices, en los dos temas.

- [ ] **Step 6: Cierre**

Run: `pnpm build && pnpm test`
Expected: pasan.

---

### Task 6: Lectura y práctica de exámenes

**Files:**
- Modify: `src/styles/visual-system.css` (bloques "Library navigation", "Chapter pages", "Exam setup", y sus `@media`)

**Interfaces:**
- Consumes: `.key-button`, `.route-mark`, estilos del panel del menú (Tarea 3) como referencia visual.

- [ ] **Step 1: Barra lateral e índice del capítulo**

Tema actual de la barra lateral con marcador de ruta lleno. Sección actual del índice del capítulo con barra de 2 px en `--accent`. En teléfono, el panel del índice (`.library-sidebar` abierto) y su velo toman el mismo borde, radio, relieve y color de velo que `.site-menu-panel`.

- [ ] **Step 2: Cuerpo del capítulo**

Tarjeta de introducción con curvas de nivel muy tenues (opacidad máxima 0,5 sobre `--relief`). Notas, ecuaciones, tablas y fuentes: bordes `--line`, rellenos `--taupe`, radios actuales. Ninguna animación nueva.

- [ ] **Step 3: Práctica de exámenes**

Barra de progreso (`.quiz-progress i`) en `--accent`. Selects y campos con el borde nuevo. Resultados con los botones tecla. La opción elegida y el recuadro de corrección entran con cambio de color y `scale` de .98 a 1 en 200 ms, solo con `prefers-reduced-motion: no-preference`.

- [ ] **Step 4: Verificar**

Un capítulo largo y un examen en curso, en 390, 768 y 1440 px, en los dos temas. En 390 px: abrir el índice del capítulo y el panel "Índice"; el encabezado fijo no tapa los títulos al saltar a un ancla.

- [ ] **Step 5: Cierre**

Run: `pnpm build && pnpm test`
Expected: pasan.

---

### Task 7: Inglés y páginas restantes

**Files:**
- Modify: `src/styles/english.css`, `english-aircraft.css`, `english-clearance.css`, `english-comms.css`, `english-emergency.css`, `english-exercises.css`, `english-radio.css`, `english-story.css`, `english-survival.css`, `english-weather.css`; `src/styles/visual-system.css` (pie, `.not-found`, diálogo de reporte, aviso de instalación)

- [ ] **Step 1: Colores fijos de Inglés**

Run: `grep -nE "#[0-9a-fA-F]{3,8}\b" src/styles/english*.css`
Hay unos 53. Para cada uno: si es un color de señal con significado (luces de torre, estados correcto o incorrecto), se queda o toma los verdes y rojos de la Tarea 2; si es un neutro cálido heredado, se reemplaza por el token que corresponda.

- [ ] **Step 2: Controles de Inglés**

Botones de acción con la forma tecla o píldora según su peso. Tarjetas y opciones con el borde y radio de `.answer-option`.

- [ ] **Step 3: Resto**

Pie, `/camino`, términos, privacidad, 404, offline, `ReportDialog` e `InstallPrompt`: revisar que no quede ningún color cálido fijo (`rgba(17,16,15,…)` del fondo del diálogo pasa a `rgba(18,34,46,.45)`).

- [ ] **Step 4: Verificar**

Recorrer los trece módulos de `/ingles/*` en 390 px y 1440 px, tema claro y oscuro, usando cada tipo de ejercicio una vez. Capturas de `/camino`, `/privacidad`, una URL inexistente y el diálogo de reporte abierto.

- [ ] **Step 5: Cierre**

Run: `pnpm build && pnpm test`
Expected: pasan.

---

### Task 8: Transición entre páginas y repaso final

**Files:**
- Modify: `src/styles/global.css`, `src/styles/site-header.css`

- [ ] **Step 1: Transición entre documentos**

En `global.css`, dentro de `@media (prefers-reduced-motion: no-preference)`: `@view-transition { navigation: auto; }`, con el contenido en un fundido cruzado de 200 ms y `view-transition-name: site-header` en `.site-header` para que el encabezado no parpadee.

- [ ] **Step 2: Repaso de movimiento reducido**

Emulando `prefers-reduced-motion: reduce`, recorrer portada, `/temas`, un capítulo, un examen y un módulo de Inglés. En cada una `document.getAnimations().length === 0` tras cargar y tras abrir el menú.

- [ ] **Step 3: Repaso de ancho mínimo**

En 320 px de ancho, en las mismas cinco páginas: `document.documentElement.scrollWidth <= 320`.

- [ ] **Step 4: Repaso de teclado**

Recorrer con Tab la portada y `/temas` en 1440 px y en 390 px: el foco siempre se ve y sigue el orden visual.

- [ ] **Step 5: Lista de cierre del spec (sección 10)**

Capturas finales en 360, 390, 768, 1024 y 1440 px, claro y oscuro, de: portada, `/temas`, un capítulo, `/examenes`, un examen en curso, `/ingles`, un módulo de Inglés, 404. Revisarlas contra las maquetas y contra la lista de "lo que haría fracasar el trabajo" del spec. Borrar las capturas.

- [ ] **Step 6: Cierre**

Run: `pnpm build && pnpm test`
Expected: pasan. Informar al usuario qué quedó verificado y qué no, sin hacer commit.
