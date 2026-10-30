# Inglés etapa 2a — Recorrido, frases de supervivencia y autorización Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que `/ingles` muestre el recorrido nuevo (Base → Comunicaciones → Emergencias → Situación anormal → Comunicarla → Contá tu historia) y sumar los dos primeros módulos de contenido nuevo: "Frases de supervivencia" y "Autorización y colación".

**Architecture:** Los datos del recorrido viven en `src/data/english.js` (fases y secciones). Cada módulo nuevo es una página `src/pages/ingles/<slug>.astro` con el mismo patrón que `tiempo.astro`: tarjetas que se dan vuelta con audio (`EnglishSay` + `data-reveal`), un esquema visual propio, un set del motor de ejercicios (`ExerciseSet`) y `EnglishFinish`. Los datos de cada módulo están en `src/data/english-<modulo>.js` y su set en `src/data/english-sets.js`.

**Tech Stack:** Astro 6 estático, JS puro (ESM), `node:test`, sin dependencias nuevas. CSS con tokens `var(--*)`.

**Spec:** `docs/superpowers/specs/2026-10-15-ingles-redesign-design.md` (§3 Bloque 1, §7 etapa 2). Etapa 1 ya hecha: `docs/superpowers/plans/2026-10-15-ingles-etapa-1-motor-y-limpieza.md`.

## Global Constraints

- Voseo rioplatense en todo el español; sin emojis; `lang="en"` en todo el inglés (atributo en el elemento que lo contiene).
- Contenido 100 % original: oraciones de ejemplo, explicaciones en español y ejercicios se escriben desde cero. Los hechos de fraseología salen de documentos oficiales (OACI Anexo 10 Vol. II cap. 5, Doc 4444 cap. 12, Doc 9432; FAA AIM y Pilot/Controller Glossary; Skybrary). No se copian ni se parafrasean textos de PeakTalk, test-english.com, VocabularyPage, el manual del curso ni videos de terceros.
- Fraseología de la OACI: cifras una por una, `three`/`four`/`five`/`nine` se escriben así y se dicen `tree`/`fower`/`fife`/`niner` (el campo `say` lleva la forma escrita; el audio del navegador usa ese texto). "inicial" es el término en español para downwind.
- Aeródromo ficticio Laguna y matrícula LV-DEM: no son reales (ya están declarados en la página).
- Celular primero: sin tablas anchas, objetivos táctiles de 48 px, nada que dependa de hover, sin desborde horizontal a 360 px.
- CSS: un selector por regla donde el archivo ya lo haga así, tokens `var(--*)`, prefijo propio por módulo, contraste de texto ≥ 4,5:1 y de indicadores ≥ 3:1 en tema oscuro y claro. Reutilizar clases existentes (`en-block`, `flip-grid`, `flip`, `radio-block`, `seg`, `ex-*`) antes de crear nuevas.
- Páginas nuevas se agregan a `precachePages` en `astro.config.mjs`.
- No se guarda nada nuevo en el navegador (el progreso usa la clave existente `aerodot:english-status` vía `EnglishFinish` y el motor): `privacidad.astro` no cambia.
- Sin dependencias nuevas. `npm test` y `npm run build` deben pasar al final de cada tarea.
- Commits en español con el prefijo convencional (`feat:`, `fix:`, `test:`), terminados con `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- No usar `git stash`, `git reset --hard` ni `git push`. Solo se commitea lo que la tarea toca.

## Review Focus

Cosas que el spec implica y que ningún test de las tareas ejercita solo:

1. Una frase de fraseología con el significado equivocado (p. ej. decir que "Roger" significa "sí", o que "Wilco" se usa para responder una pregunta): el error más dañino para quien aprende. Cada frase se contrasta con la definición oficial.
2. Dato inventado presentado como norma (frecuencias, códigos, límites): todo número de ejemplo debe ser de práctica y estar marcado así; la regla general debe tener fuente oficial.
3. Cifras mal escritas para la voz: `say` con `5` o `9` en vez de `five`/`nine` hace que la voz del navegador lea "cinco" o suene distinto al estándar.
4. Un set con una respuesta correcta ambigua (dos opciones que se pueden defender): el aprendiz queda penalizado por acertar.
5. Una tarjeta o ejercicio que solo se entiende con audio: sin audio (silencio del celular, sin voz instalada) tiene que seguir siendo usable y legible.

---

### Task 1: Recorrido nuevo en el índice

**Files:**
- Modify: `src/data/english.js` (fases, secciones, quitar roles y la fase del oral)
- Modify: `src/pages/ingles/index.astro` (estructura del recorrido, título y descripción, quitar el filtro por rol y los enlaces del oral)
- Modify: `src/styles/english.css` (solo lo que el índice nuevo necesite)
- Create: `test/english-data.test.mjs`

**Interfaces:**
- Consumes: `englishSections`, `englishPhases`, `englishTopics`, `englishNeighbors`, `englishReadySlugs` (hoy exportados). `EnglishFinish.astro` usa `englishNeighbors(slug)` y `mountEnglishProgress` usa `englishReadySlugs`/`data-english-slug`; no se rompen.
- Produces: `englishPhases` con exactamente estas fases y este orden: `base` ("Base"), `comunicaciones` ("Comunicaciones"), `emergencias` ("Emergencias"), `anormal` ("Situación anormal"), `comunicarla` ("Comunicarla"), `historia` ("Contá tu historia"). Cada fase tiene `{ id, title, lede, step }` (`step` es el número 1–6 que se muestra). `englishSections` con `{ slug?, phase, title, blurb, href? }`; las que tienen `href` son páginas hechas; las demás son "Próximamente". Ya no existen `englishRoles`, `roles`, `raac61Href`, la fase `oral` ni ninguna fase `antes`, `tierra`, `vuelo`, `cabina`, `control`.

Secciones, en este orden:

| fase | slug | título | blurb | href |
|---|---|---|---|---|
| base | supervivencia | Frases de supervivencia | Say again, speak slower, unable: qué decir cuando no entendiste. | /ingles/supervivencia |
| base | numeros | Números y alfabeto | Cifras y letras como se dicen por radio. | /ingles/numeros |
| base | aerodromo | El aeródromo | Pista, rodaje, plataforma y circuito. | /ingles/aerodromo |
| base | aeronave | La aeronave | Partes, instrumentos y fallas. | /ingles/aeronave |
| base | tiempo | El tiempo | Cómo se dicen las nubes y los fenómenos por radio. | /ingles/tiempo |
| comunicaciones | atis | El ATIS | El parte grabado antes de llamar a la torre. | /ingles/atis |
| comunicaciones | autorizacion | Autorización y colación | Qué te autorizan, cómo lo repetís y cómo se detecta un error. | /ingles/autorizacion |
| comunicaciones | (sin slug) | Radio por fase de vuelo | De la puesta en marcha a la final: qué se dice en cada tramo. | — |
| emergencias | (sin slug) | Mayday y Pan Pan | Aviar, navegar, comunicar: el mensaje de emergencia paso a paso. | — |
| anormal | (sin slug) | Vocabulario de accidentes | Las palabras para nombrar qué pasó. | — |
| anormal | (sin slug) | Contalo en pasado | Relatar un incidente con los tiempos verbales correctos. | — |
| anormal | (sin slug) | Describí la foto | Qué ves, dónde y qué está pasando. | — |
| anormal | (sin slug) | Línea de tiempo | Ordenar un incidente real, paso por paso. | — |
| comunicarla | (sin slug) | Un evento, tres públicos | El mismo hecho contado a ATC, a Operaciones y a los pasajeros. | — |
| historia | (sin slug) | Preguntas de entrevista | Contá quién sos y qué hacés, en inglés. Opcional. | — |

Lede de las fases (una frase cada una, en español, que diga para qué sirve el paso): base — "Las palabras y los números que usás en cada llamada."; comunicaciones — "Escuchar, entender y responder en la frecuencia."; emergencias — "Qué decir cuando algo sale mal, y en qué orden."; anormal — "Nombrar y contar lo que pasó cuando no fue una operación normal."; comunicarla — "El mismo hecho se dice distinto según quién escucha."; historia — "Tu propia historia, en inglés. Es opcional."

- [ ] **Step 1: Test de datos (falla primero)**

Crear `test/english-data.test.mjs` con `node:test`. Debe importar `englishPhases`, `englishSections`, `englishTopics`, `englishReadySlugs`, `englishNeighbors` de `../src/data/english.js` y comprobar:
  1. Los ids de fase son exactamente `['base','comunicaciones','emergencias','anormal','comunicarla','historia']` en ese orden y los `step` son 1…6.
  2. Toda sección tiene `phase` existente, `title` y `blurb` no vacíos; ninguna tiene `roles`.
  3. Toda sección con `href` tiene `slug` y `href === '/ingles/' + slug`; los slugs son únicos.
  4. Para cada `href`, existe el archivo `src/pages/ingles/<slug>.astro` (`fs.existsSync`). (Con la Tarea 2 y 3 todavía sin hacer, este test falla para `supervivencia` y `autorizacion`: es lo esperado hasta que existan. Para que la Tarea 1 cierre en verde, las secciones `supervivencia` y `autorizacion` se declaran en la Tarea 1 **sin** `href` y las Tareas 2 y 3 les agregan `slug` y `href`.)
  5. Cada `href` está en `precachePages` de `astro.config.mjs` (leer el archivo como texto y buscar `'<href>'`).
  6. `englishNeighbors` sigue el orden de `englishTopics`: el anterior del primero es `null`, el siguiente del último es `null`.
  7. `englishReadySlugs` es igual a los slugs de `englishTopics`.

  Run: `npm test` — esperado: FAIL (fases viejas).

- [ ] **Step 2: Reescribir `englishPhases` y `englishSections`** en `src/data/english.js` según la tabla. Quitar `englishRoles`, `roles`, `PA`, `raac61Href` y los textos que solo el oral usaba. Actualizar el comentario de cabecera del archivo si menciona el nivel 4 o el oral. `supervivencia` y `autorizacion` quedan **sin** `slug`/`href` hasta sus tareas. Run: `npm test` — esperado: PASS.

- [ ] **Step 3: Reescribir el índice**

`src/pages/ingles/index.astro`:
  - `title`: "Inglés aeronáutico — Cómo se dice por radio | Aerodot". `description`: "Aprendé a decirlo en inglés: los números y el alfabeto de la radio, el aeródromo, el ATIS, las autorizaciones y las emergencias. Práctica independiente, en español, con audio." (ajustar a ≤ 160 caracteres).
  - Hero: `h1` "Inglés aeronáutico" y una bajada (`p.en-deck`) "Seis pasos para aprender cómo se dice, no la teoría. Cada módulo se escucha, se toca y se practica." Mantener el medidor de progreso (`en-meter`) y el aviso de práctica independiente.
  - Quitar el filtro por rol (botones, script) y los enlaces a la RAAC.
  - Cada fase se muestra con su número de paso: `<span class="en-step" aria-hidden="true">1</span>` junto al `h2` (`Paso 1 · Base` para lectores de pantalla vía texto visualmente oculto o `aria-label`). Debajo, `lede`.
  - Módulos hechos: la tarjeta actual (`topic-card` con arte). Para `supervivencia` y `autorizacion` todavía no hay `href`, así que se muestran como próximos hasta sus tareas.
  - Módulos próximos: dentro de la misma fase, después de las tarjetas, una lista compacta `ul.en-soon` (título + blurb, sin flecha ni botón, texto atenuado con contraste ≥ 4,5:1) con un encabezado pequeño "Próximamente". Si la fase no tiene próximos, no se muestra. Nunca una tarjeta grande vacía.
  - El script de la página queda en `mountListen()` + `mountEnglishProgress()`; se elimina el código del filtro.
  - Tarjetas con arte nuevo: no hacen falta todavía (las de Tarea 2 y 3 traen su arte).

- [ ] **Step 4: CSS** en `src/styles/english.css`: `.en-step` (círculo de 28 px con el número, borde `var(--line)`, tipografía de la marca), `.en-soon` (lista sin viñetas, 2 columnas desde 640 px, 1 en celular), ajustar `.en-phase` si hace falta. Probar a 360 px y 1180 px en tema oscuro y claro.

- [ ] **Step 5: Verificar**

Run: `npm test` (todo verde) y `npm run build` (sale 0, `/ingles/index.html` no contiene "RAAC 61.165" en el cuerpo de las fases ni el texto "Próximamente" dentro de una `topic-card`). Abrir `/ingles` en 360 px: sin desborde horizontal, los 6 pasos con su número, los hechos como tarjetas y los próximos como lista.

- [ ] **Step 6: Commit**

```bash
git add src/data/english.js src/pages/ingles/index.astro src/styles/english.css test/english-data.test.mjs
git commit -m "feat: el índice de Inglés muestra el recorrido en seis pasos"
```

---

### Task 2: Frases de supervivencia

**Files:**
- Create: `src/pages/ingles/supervivencia.astro`
- Create: `src/data/english-survival.js`
- Modify: `src/data/english-sets.js` (agregar `survivalSet`)
- Modify: `src/data/english.js` (agregar `slug: 'supervivencia'` y `href: '/ingles/supervivencia'` a la sección)
- Modify: `src/pages/ingles/index.astro` (arte de la tarjeta de `supervivencia`)
- Modify: `astro.config.mjs` (`precachePages`)
- Modify: `src/styles/english.css` o crear `src/styles/english-survival.css` (prefijo `sv-`)
- Modify: `test/exercises/validate.test.mjs` (validar `survivalSet`)

**Interfaces:**
- Consumes: `EnglishShell`, `EnglishFinish`, `EnglishSay`, `ExerciseSet`, `mountListen`, `mountEnglishProgress`, `mountReveals`, `mountExerciseSets`, `validateSet`.
- Produces: `survivalGroups` (en `english-survival.js`) y `survivalSet` (en `english-sets.js`, `id: 'survival-say'`, `slug: 'supervivencia'`).

**Contenido que la página enseña.** Cuatro grupos de frases de fraseología estándar. Cada frase lleva `{ id, en, es, say, body, use }`: `en` la frase tal como se dice, `es` su nombre en español, `say` lo que lee la voz (cifras en palabras), `body` el significado y cuándo se usa (2 oraciones máximo, escritas desde cero), `use` una línea con un ejemplo corto en contexto. Las definiciones deben coincidir con OACI Anexo 10 Vol. II §5.2.1.7 / Doc 4444 cap. 12 (el implementador las verifica por web contra una fuente oficial y deja la cita en el informe; el texto de la página es propio).

1. **No entendí** — `say again`, `say again all after [word]`, `speak slower`, `spell`, `words twice`, `how do you read`.
2. **Confirmar y responder** — `roger`, `wilco`, `affirm`, `negative`, `confirm`, `correct`.
3. **No puedo / esperá** — `unable`, `stand by`, `say intentions` o `request` (solo si se verifica en una fuente oficial; si no, `request`).
4. **Corregir** — `correction`, `I say again`, `read back`, `disregard`.

Notas de exactitud que el implementador debe respetar y verificar: `roger` = recibí tu último mensaje completo (no es "sí" y no se usa para responder una pregunta que pide sí/no ni para una colación); `wilco` = entendí y voy a cumplir (no se dice junto con `roger`); `affirm` es "sí" (la palabra `yes` no es fraseología); `negative` es "no" o "no se concede" o "no es correcto"; `unable` = no puedo cumplir; `stand by` = esperá, yo te llamo; `correction` = me equivoqué, la versión correcta es…; `I say again` = repito para dar claridad o énfasis; `read back` = repetime exactamente lo que te dije. Una tarjeta aparte, en el grupo 2, explica que en EE. UU. se usa `verify` donde la OACI usa `confirm` (verificar en el AIM / Glosario). No se incluyen frases coloquiales como "no comprendo" en inglés estándar sin una fuente: si se quiere una frase de lenguaje claro, se marca con la etiqueta "lenguaje claro" y se justifica en el informe.

**Secciones de la página** (en este orden): eyebrow "Base"; `h1` "Frases de supervivencia."; bajada "Las palabras que más vas a usar cuando algo no sale bien: no entendiste, no podés o te equivocaste."; índice de la página (`library-toc`) con las secciones; (a) cuatro bloques `radio-block` con `flip-grid` de tarjetas dadas vuelta (patrón de `tiempo.astro`: `h3 lang="en"` + `EnglishSay quiet` + frase entre comillas + "Qué significa" que revela `es` y `body`); (b) un esquema "Una llamada con problemas": 4 a 6 burbujas alternadas piloto/torre (HTML + CSS, no imagen) donde cada burbuja tiene su `EnglishSay` y la frase de supervivencia usada está resaltada; es un ejemplo escrito desde cero con aeródromo Laguna; (c) `ExerciseSet` con `survivalSet` (10 ítems, mezcla de `mcq`, `gap`, `order`, `tf`; incluir al menos: elegir la frase para cada situación, completar una frase con la palabra faltante, ordenar `say again all after wind`, verdadero/falso sobre `roger` vs `wilco`, y uno sobre "affirm" vs "yes"); (d) `p.en-sources` con la fuente (OACI Anexo 10 Vol. II cap. 5; Doc 4444 cap. 12) y la aclaración de práctica; (e) `EnglishFinish slug="supervivencia" where="Frases de supervivencia"`.

**Arte de la tarjeta** del índice (viewBox 240 × 120, mismo estilo que las otras): dos burbujas de diálogo con `say again` y `roger` en `lang="en"`, con una pequeña animación coherente con `prefers-reduced-motion`.

- [ ] **Step 1: Datos y set (test primero).** Agregar a `test/exercises/validate.test.mjs` un test "el set de supervivencia que se publica es válido" (`validateSet(survivalSet)` devuelve `[]`) y otro que compruebe que ninguna cadena `say` de los grupos ni del set contiene dígitos 0–9 sueltos (las cifras van en palabras) y que cada grupo tiene entre 3 y 6 frases con `id` únicos. Run: `npm test` — FAIL (no existen).
- [ ] **Step 2: Escribir `english-survival.js` y `survivalSet`.** Contenido original (ver arriba). Ítems del set con `id` `s1`…`s10`; las opciones incorrectas deben ser plausibles (errores típicos de hispanohablantes: `yes` por `affirm`, `repeat` por `say again`, `roger` por `wilco`) y la respuesta correcta inequívoca; cada ítem `tf`/`mcq` con `explain` corta cuando el error es el típico. Run: `npm test` — PASS.
- [ ] **Step 3: Página, arte, estilos y precarga.** Crear la página siguiendo `tiempo.astro`; agregar `slug` y `href` en `english.js`; agregar `'/ingles/supervivencia'` a `precachePages`; el arte en el índice. CSS con prefijo `sv-`.
- [ ] **Step 4: Verificar.** `npm test`, `npm run build` (sale 0; la página aparece en el precache). Abrir `/ingles/supervivencia` a 360 px y 1180 px, oscuro y claro: sin desborde, las tarjetas se dan vuelta, el audio suena (o el botón queda usable sin voz), el set se puede completar y, con 8 de 10 o más (`passMark` por defecto 0,75), marca el tema como listo en el índice.
- [ ] **Step 5: Commit.**

```bash
git add src/pages/ingles/supervivencia.astro src/data/english-survival.js src/data/english-sets.js src/data/english.js src/pages/ingles/index.astro astro.config.mjs src/styles test/exercises/validate.test.mjs
git commit -m "feat: módulo Frases de supervivencia con audio y práctica"
```

---

### Task 3: Autorización y colación

**Files:**
- Create: `src/pages/ingles/autorizacion.astro`
- Create: `src/data/english-clearance.js`
- Modify: `src/data/english-sets.js` (agregar `clearanceSet`)
- Modify: `src/data/english.js` (agregar `slug: 'autorizacion'` y `href: '/ingles/autorizacion'`)
- Modify: `src/pages/ingles/index.astro` (arte de la tarjeta)
- Modify: `astro.config.mjs` (`precachePages`)
- Create: `src/styles/english-clearance.css` (prefijo `cl-`)
- Modify: `test/exercises/validate.test.mjs`

**Interfaces:**
- Consumes: lo mismo que la Tarea 2.
- Produces: `clearanceParts`, `readbackItems`, `clearanceExamples` (en `english-clearance.js`) y `clearanceSet` (`id: 'clearance-say'`, `slug: 'autorizacion'`).

**Contenido que la página enseña.**

1. **Qué es una autorización** (una frase) y **la diferencia entre instrucción y autorización** (`cleared to…` vs `hold short`, `line up`). Verificar con Doc 4444 / AIM.
2. **Las partes de una autorización de ruta IFR (CRAFT)**: *Clearance limit, Route, Altitude, Frequency, Transponder*, como cinco casillas coloreadas que se tocan (cada una muestra su pieza en el ejemplo y se puede escuchar). CRAFT es una regla mnemotécnica de uso difundido; la página la presenta como tal y no como norma OACI. Un ejemplo completo, escrito desde cero, con Laguna y LV-DEM, todas las cifras de práctica y marcadas como tal.
3. **Una autorización VFR en el circuito**, más cercana al piloto privado: `cleared to land`, `cleared for take-off`, `continue approach`, `line up and wait`, `hold short`, `report downwind` (se dice *downwind*; en español, "inicial"). Tarjetas dadas vuelta con audio (patrón de `tiempo.astro`).
4. **Qué se colaciona siempre** (lista corta, con la fuente oficial: OACI Anexo 10 Vol. II §5.2.1.7.2.2 y Doc 4444 §12.3.1.2): autorizaciones y instrucciones de ruta, pista en uso, ajuste de altímetro, códigos SSR, instrucciones de nivel, rumbo y velocidad, nivel de transición. Y un recordatorio: se termina con el distintivo de llamada.
5. **Hearback**: el controlador también escucha. Tres casos cortos de colación **con un error** que el aprendiz tiene que encontrar (esto es el ejercicio principal del módulo).

**Secciones de la página** (en este orden): eyebrow "Comunicaciones"; `h1` "Autorización y colación."; bajada "Escuchar bien, repetir lo importante y terminar con tu matrícula."; índice de la página; (a) "Qué te autorizan" (puntos 1 y 3); (b) esquema CRAFT interactivo (punto 2); (c) "Qué se repite siempre" (punto 4, lista); (d) "Encontrá el error" — tres tarjetas de caso con dos burbujas (controlador / piloto) y `EnglishSay` en cada una, y un `mcq` por caso resuelto con el `ExerciseSet`; (e) `ExerciseSet` con `clearanceSet` (10 ítems: `order` para armar una colación correcta de 5–7 fichas, `mcq` para detectar el dato mal colacionado en tres casos distintos, `gap` para completar la pieza que falta, `tf` sobre qué se colaciona y qué no, y al menos un ítem sobre el distintivo al final); (f) `p.en-sources`; (g) `EnglishFinish slug="autorizacion" where="Autorización y colación"`.

**Reglas de exactitud.** Colación = repetir al controlador el contenido que exige la norma, no "hacer eco" de todo. `Roger` no es una colación válida de una autorización. Las cifras van en palabras en `say`. Los ejemplos con errores se escriben para que **un solo dato** esté mal (sin ambigüedad). Se evita inventar frecuencias o códigos reales: son de práctica y la página lo dice.

**Arte de la tarjeta** del índice: cinco casillas C-R-A-F-T en fila con la A destacada, estilo de las otras tarjetas, `prefers-reduced-motion` respetado.

- [ ] **Step 1: Tests primero.** En `test/exercises/validate.test.mjs`, `clearanceSet` es válido; ninguna cadena `say` del módulo ni del set contiene dígitos 0–9; cada caso de hearback declara en los datos qué campo está mal y el test comprueba que el texto del piloto difiere del del controlador **solo** en ese campo (comparando palabra por palabra tras normalizar). Run: `npm test` — FAIL.
- [ ] **Step 2: Escribir `english-clearance.js` y `clearanceSet`.** Run: `npm test` — PASS.
- [ ] **Step 3: Página, arte, estilos, precarga y `href` en `english.js`.**
- [ ] **Step 4: Verificar** como en la Tarea 2 (360 px y 1180 px, oscuro y claro, build, sin desborde, set completable, pase marca el tema como listo).
- [ ] **Step 5: Commit.**

```bash
git add src/pages/ingles/autorizacion.astro src/data/english-clearance.js src/data/english-sets.js src/data/english.js src/pages/ingles/index.astro astro.config.mjs src/styles test/exercises/validate.test.mjs
git commit -m "feat: módulo Autorización y colación con CRAFT y detección de errores"
```

---

## Fuera de esta etapa (2b y siguientes)

Radio por fase de vuelo, Mayday y Pan Pan, migrar los quices de números/ATIS/aeródromo/aeronave al motor y reformular aeródromo/aeronave, comparación EE. UU./OACI en el ATIS, etapas 3 a 6 del spec.
