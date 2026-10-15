# Inglés etapa 2b — Emergencias y radio por fase de vuelo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sumar al recorrido de `/ingles` los módulos "Mayday y Pan Pan" (paso 3, Emergencias) y "Radio por fase de vuelo" (paso 2, Comunicaciones), con el mismo nivel de revisión que la etapa 2a.

**Architecture:** Igual que la etapa 2a: una página por módulo en `src/pages/ingles/<slug>.astro` con datos en `src/data/english-<modulo>.js`, un set del motor de ejercicios en `src/data/english-sets.js`, estilos con prefijo propio y arte de tarjeta en el índice. Se reutilizan `mountPageToc()`, `mixed()` (convención `*inglés*`), `EnglishSay`, `EnglishFinish`, `ExerciseSet` y las clases de `supervivencia`/`autorizacion`.

**Tech Stack:** Astro 6 estático, JS puro (ESM), `node:test`, sin dependencias nuevas.

**Spec:** `docs/superpowers/specs/2026-10-15-ingles-redesign-design.md` (§3 módulos 2 y 3). Planes anteriores: etapa 1 y etapa 2a en `docs/superpowers/plans/`.

## Global Constraints

- Las de la etapa 2a, que siguen vigentes: voseo rioplatense; sin emojis; `lang="en"` en todo el inglés (en prosa en español, el inglés va entre `*…*` y sale con `lang`; nunca un asterisco visible); contenido 100 % original; celular primero (objetivos de 48 px, nada solo-hover, sin desborde a 360 px); CSS con tokens `var(--*)` y prefijo por módulo; contraste de texto ≥ 4,5:1 e indicadores ≥ 3:1 en oscuro y claro; reutilizar clases existentes; página nueva en `precachePages`; sin dependencias nuevas; `npm test` y `npm run build` pasan; commits en español con prefijo convencional y trailer `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`; sin `git stash`, `git reset --hard` ni `git push`.
- Fraseología: cifras una por una; en `say` los dígitos van en palabras (`three four five nine` escritos, se dicen tree/fower/fife/niner); aeródromo Laguna y matrícula LV-DEM ficticios; "inicial" es el término en español para downwind.
- Convención del distintivo (CAP 413 2.49 / OACI): tierra-aire, distintivo primero; piloto, información nueva o pedidos, distintivo primero; respuestas, colaciones y acuses, mensaje primero y distintivo al final.
- Ningún número de práctica (frecuencias, códigos transpondedor de ejemplo, QNH, rumbos) se presenta como norma. Los códigos 7700, 7600 y 7500 sí son normas y se verifican en la fuente oficial.
- Ninguna regla se presenta como oficial si ningún texto oficial la dice; lo que sale de una regla mnemotécnica (aviar-navegar-comunicar) o de la práctica común se rotula como tal.
- Cada afirmación de fraseología se contrasta con fuente oficial o cuasi oficial (OACI Anexo 10 Vol. II cap. 5 y Doc 4444 vía EU SERA Table S14-4 y SERA.14050/14055; UK CAA CAP 413; FAA AIM cap. 6-3 y 4-2 y Glosario P/C; SKYbrary) y el informe del implementador deja la tabla afirmación / texto oficial / URL abierta. Lo que no se pueda verificar queda fuera de la página.
- Etiquetas de audio únicas ("Escuchar a la torre, mensaje 1"), diálogos como lista semántica con el hablante visible, `prefers-reduced-motion` respetado.

## Review Focus

1. Confundir Mayday con Pan Pan o invertir el orden del mensaje de socorro: el error más dañino del módulo de emergencias. Contrastar con la definición oficial de socorro y de urgencia y con el orden oficial de los elementos del mensaje.
2. Presentar como norma un orden o un contenido que solo es práctica recomendada (por ejemplo, "personas a bordo" y "combustible" después de la posición): rotular como "se suele agregar".
3. Un diálogo de fase de vuelo con una frase que un controlador real no diría (sale de la fraseología del CAP 413 cap. 4 o del AIM 4-3) o con el distintivo mal ubicado.
4. Un ejercicio con dos respuestas defendibles o cuya clave contradice el diálogo del mismo módulo.
5. Un módulo que solo se entiende con audio, o un `*` visible en pantalla, o texto en inglés sin `lang`.

---

### Task 1: Mayday y Pan Pan

**Files:**
- Create: `src/pages/ingles/emergencias.astro`
- Create: `src/data/english-emergency.js`
- Create: `src/scripts/emergency.js` (el armador del mensaje: lógica pura exportada + `mountEmergency()` del DOM)
- Create: `src/styles/english-emergency.css` (prefijo `em-`)
- Modify: `src/data/english-sets.js` (agregar `emergencySet`)
- Modify: `src/data/english.js` (`slug: 'emergencias'`, `href: '/ingles/emergencias'` en la sección "Mayday y Pan Pan" de la fase `emergencias`)
- Modify: `src/pages/ingles/index.astro` (arte de la tarjeta)
- Modify: `astro.config.mjs` (`precachePages`)
- Create: `test/emergency.test.mjs`; modify `test/exercises/validate.test.mjs`

**Interfaces:**
- Consumes: `EnglishShell`, `EnglishFinish`, `EnglishSay`, `ExerciseSet`, `mountListen`, `mountEnglishProgress`, `mountReveals`, `mountExerciseSets`, `mountPageToc`, `mixed`, `validateSet`.
- Produces: `emergencyLevels` (Mayday, Pan Pan: `{ id, en, es, say, body, when, example }`), `emergencyOrder` (los elementos del mensaje en el orden oficial: `{ id, es, hint, official }` donde `official` indica si el orden lo fija la norma o es práctica), `emergencyNatures` y `emergencyIntentions` (opciones del armador: `{ id, en, es }`), `squawkCodes` (7700/7600/7500), `emergencySet` (`id: 'emergency-say'`, `slug: 'emergencias'`), y en `emergency.js`: `buildMessage({ level, station, callsign, nature, intention, position, extra })` que devuelve `{ text, say, parts }` y no depende del DOM.

**Contenido que la página enseña** (en este orden): eyebrow "Emergencias"; `h1` "Mayday y Pan Pan."; bajada "Qué decir cuando algo sale mal y en qué orden."
1. **Primero volás** — el esquema "Aviar, navegar, comunicar" (*aviate, navigate, communicate*): tres peldaños dibujados, con una línea por cada uno. Se rotula como regla práctica de instrucción, no como norma.
2. **Mayday o Pan Pan** — dos tarjetas comparadas (socorro: peligro grave e inminente que exige ayuda inmediata; urgencia: preocupa la seguridad de la aeronave o de una persona pero no exige ayuda inmediata). Se dicen tres veces. Con definición verificada en la fuente oficial. Una línea sobre `Pan-Pan medical` solo si se verifica.
3. **El mensaje, pieza por pieza** — una cinta de piezas en el orden oficial con la pieza resaltada y su audio, y un **armador**: el aprendiz elige nivel (Mayday / Pan Pan), naturaleza (falla de motor, fuego a bordo, emergencia médica, poco combustible, pérdida de comunicaciones se descarta), intención (aterrizar en Laguna, aterrizaje forzoso, volver al aeródromo) y posición (una de tres de práctica); el armador compone el mensaje completo, lo muestra en inglés con las piezas coloreadas y lo reproduce. Las piezas que son práctica y no norma (personas a bordo, combustible) se rotulan "se suele agregar".
4. **Los códigos del transpondedor** — 7700, 7600 y 7500 con su significado oficial, en tarjetas dadas vuelta.
5. **Práctica** — `emergencySet`, 10 ítems: `order` para ordenar un mensaje de socorro (6–7 fichas), `mcq` para elegir entre Mayday y Pan Pan por situación (al menos tres situaciones distintas, sin ambigüedad), `gap` para completar la pieza que falta, `tf` sobre las tres repeticiones y sobre los códigos, y al menos un ítem de "elegí la mejor frase de naturaleza".

**Reglas de exactitud.** El mensaje de socorro oficial lleva, en este orden: MAYDAY tres veces; nombre de la estación a la que se llama; distintivo de la aeronave; naturaleza del socorro; intención del piloto al mando; posición, nivel y rumbo. Verificar el orden y los nombres en la fuente oficial antes de escribir. En una emergencia no hay colación obligatoria de cada dato: no inventar reglas de colación. El armador usa solo opciones de práctica.

- [ ] **Step 1: Tests primero.** `test/emergency.test.mjs`: `buildMessage` arma las piezas en el orden de `emergencyOrder`, repite "mayday" o "pan-pan" tres veces, usa el distintivo `LV-DEM` en su lugar, omite las piezas vacías (`extra`), nunca devuelve dígitos 0–9 en `say`, y lanza un error claro si falta nivel o naturaleza. `validate.test.mjs`: `emergencySet` es válido, ids únicos, ningún `say` con dígitos, cada situación de Mayday/Pan Pan declara cuál es la respuesta correcta y por qué. Run: `npm test` — FAIL.
- [ ] **Step 2: Datos, `buildMessage` y `emergencySet`.** Run: `npm test` — PASS.
- [ ] **Step 3: Página, armador (`mountEmergency`), arte, estilos, precarga y `href` en `english.js`.** El armador funciona con teclado y toque, anuncia el mensaje compuesto en una región `aria-live="polite"`, y funciona sin audio.
- [ ] **Step 4: Verificar** a 360 px y 1180 px, oscuro y claro: sin desborde, el armador compone y reproduce, el set se completa y marca el tema como listo; `npm test` y `npm run build`.
- [ ] **Step 5: Commit.**

```bash
git add src/pages/ingles/emergencias.astro src/data/english-emergency.js src/scripts/emergency.js src/styles/english-emergency.css src/data/english-sets.js src/data/english.js src/pages/ingles/index.astro astro.config.mjs test
git commit -m "feat: módulo Mayday y Pan Pan con armador de mensaje"
```

---

### Task 2: Radio por fase de vuelo

**Files:**
- Create: `src/pages/ingles/radio-fases.astro`
- Create: `src/data/english-phases.js` (nombre del archivo de datos; no confundir con `englishPhases` del índice)
- Create: `src/styles/english-radio.css` (prefijo `rf-`)
- Modify: `src/data/english-sets.js` (agregar `radioPhasesSet`)
- Modify: `src/data/english.js` (`slug: 'radio-fases'`, `href: '/ingles/radio-fases'` en la sección "Radio por fase de vuelo")
- Modify: `src/pages/ingles/index.astro` (arte), `astro.config.mjs` (`precachePages`)
- Modify: `test/exercises/validate.test.mjs`; create `test/radio-phases.test.mjs`

**Interfaces:**
- Consumes: igual que la Tarea 1.
- Produces: `radioPhases` (arreglo de fases `{ id, es, en, summary, lines: [{ who: 'pilot'|'tower', say, note?, key? }], phrases: [{ id, en, es, say, body }] }`) y `radioPhasesSet` (`id: 'radio-say'`, `slug: 'radio-fases'`).

**Contenido que la página enseña.** Un vuelo de circuito de tránsito VFR en el aeródromo ficticio Laguna, una fase por vez, en este orden: **puesta en marcha**, **rodaje**, **punto de espera y prueba de motor**, **despegue**, **salida del circuito** (o ascenso), **circuito (inicial, base y final)**, **aterrizaje y pista libre** y **estacionamiento**. Para cada fase: un diálogo de 4 a 6 líneas piloto/torre (lista semántica, hablante visible, audio por línea, la frase clave resaltada con `<mark>`), 3 a 4 tarjetas de frases clave dadas vuelta (patrón de `supervivencia`) y una línea de "qué escuchás y qué respondés". Un selector de fases (botones tipo `seg`, 48 px, `aria-pressed`) muestra una fase por vez y recuerda la última elegida solo en la sesión (sin guardar nada). Un esquema horizontal de las ocho fases (SVG o HTML+CSS) funciona como selector y como mapa. Todo el inglés se verifica contra el CAP 413 cap. 4 (fraseología de aeródromo) y/o el AIM 4-3; las diferencias OACI/FAA se rotulan ("en EE. UU. se dice…") solo si se verifican.

**Reglas de exactitud.** Cada línea del diálogo respeta la convención del distintivo. `hold short`, `line up and wait`, `cleared for take-off`, `cleared to land`, `continue approach`, `report downwind`, `report final`, `vacate`, `taxi` se usan según su definición oficial; las instrucciones de mantener corto y de pista se colacionan completas (CAP 413 cap. 4 dice que `Roger`/`Wilco` no alcanzan para `hold short`). Frecuencias, QNH, pistas y rumbos son de práctica y el pie de la página lo dice. No se usa ninguna frase que no se haya podido verificar.

**Práctica.** Un solo `radioPhasesSet` de 12 ítems al final de la página (`passMark` por defecto): `order` de 2 mensajes del piloto, `mcq` para elegir la frase correcta en tres fases distintas, `gap` para completar la palabra clave, `tf` sobre qué se colaciona y qué no, y un ítem de "¿en qué fase se dice esto?". Cada ítem declara la fase a la que pertenece (campo de datos, validado en los tests).

- [ ] **Step 1: Tests primero.** `test/radio-phases.test.mjs`: las ocho fases existen en orden y con ids únicos; cada una tiene entre 4 y 6 líneas y entre 3 y 4 frases; el hablante alterna (sin dos turnos seguidos del mismo salvo que `note` lo justifique); ningún `say` tiene dígitos; toda línea de la torre empieza con el distintivo `LV-DEM` o con el nombre de la dependencia, y toda colación del piloto termina con el distintivo (se marca `kind: 'readback'` en el dato y el test lo comprueba). `validate.test.mjs`: `radioPhasesSet` válido. Run: `npm test` — FAIL.
- [ ] **Step 2: Datos y set.** Run: `npm test` — PASS.
- [ ] **Step 3: Página, selector de fases, arte, estilos, precarga y `href`.**
- [ ] **Step 4: Verificar** a 360 px y 1180 px, oscuro y claro: el selector cambia de fase con teclado y toque, sin desborde, el audio por línea tiene nombre único, el set marca el tema como listo; `npm test` y `npm run build`.
- [ ] **Step 5: Commit.**

```bash
git add src/pages/ingles/radio-fases.astro src/data/english-phases.js src/styles/english-radio.css src/data/english-sets.js src/data/english.js src/pages/ingles/index.astro astro.config.mjs test
git commit -m "feat: módulo Radio por fase de vuelo con diálogos del circuito"
```

---

## Fuera de esta etapa (2c y siguientes)

Migrar los quices de números, ATIS, aeródromo y aeronave al motor y reformular aeródromo/aeronave como "cómo se dice"; comparación EE. UU./OACI y "encontrá el cambio" en el ATIS; etapas 3 a 6 del spec.
