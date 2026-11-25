# Flowdot escalera, partes 2 y 3: escalones, progreso y guía. Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repasar con tres escalones (Con la lista, De memoria con acción, Simulador con nota), progreso por flujo visible en la lista, y una guía de cuatro tarjetas al abrir.

**Architecture:**
- La lógica pura va en `review.js` (opciones de respuesta y corrección del Simulador) y en `progress.js` (mejores marcas, logrado, repasar hoy).
- `editor.js` reescribe el modo Repasar sobre esas piezas. `overlay.js` suma marcas numeradas neutras.
- `list.js` muestra el progreso.
- `screens/guide.js` arma la guía.

**Tech Stack:** JS sin framework, `node --test`.

**Spec:** `docs/superpowers/specs/2026-11-18-flowdot-escalera-design.md` (Partes 2 y 3)

## Global Constraints

- Logrado: 90 % o más (`PASS = 0.9`). "Repasar hoy": 2 días o más sin practicar, o último resultado menor a 90 %.
- Progreso en `meta`, clave `progress:<flowId>`, fuera del flujo.
- Nota del Simulador: `round(100 × en orden / total)`.
- Hasta 4 opciones por pregunta.
- Español rioplatense, sin rayas largas, sin commits. No copiar textos ni diseño de Flowdeck.

## Review Focus

- Flujo de 1 paso o sin acciones: De memoria no pregunta acción y el Simulador corrige igual. Tests en Task 1.
- Tocar dos veces el mismo paso en el Simulador: cuenta una vez. Test en Task 1.
- Salir de Repasar con el reloj del Simulador andando: el intervalo se limpia (a mano, Task 3).
- Progreso de un flujo borrado o sin pasos: la lista no marca "Repasar hoy". Test en Task 2.
- Teléfono: los tres escalones entran en la barra de 390 px (a mano, Task 3).

---

### Task 1: Opciones y corrección

**Files:** `src/flowdot/review.js`, `test/flowdot-review.test.mjs`

**Interfaces:**
- Produces:
  - `choicesFor(values, correct, random = Math.random) -> string[]`: la correcta y hasta 3 distintas de `values` (sin vacías ni repetidas), mezcladas. Si hay menos de 2 distintas, devuelve `[]`.
  - `gradeRun(total, taps) -> { order, inOrder, skipped, outOfOrder, stray, score }`:
    - `taps` son índices de paso o -1.
    - `order` son los índices sin repetir, en el orden tocado.
    - `inOrder` es el largo de la secuencia creciente más larga de `order`.
    - `outOfOrder` son los de `order` que no están en esa secuencia.
    - `skipped` son los índices de 0 a total−1 que no se tocaron.
    - `stray` es la cantidad de -1.
    - `score` es `round(100 × inOrder / total)`, o 0 si `total` es 0.

- [x] Tests:
  - `choicesFor(['ON','OFF','SET','ON','', '1+F','AUTO'], 'ON', () => 0)` tiene 4 elementos, incluye 'ON' y no repite.
  - `choicesFor(['ON','ON'], 'ON')` da `[]`.
  - `gradeRun(5, [0,1,3,2,4])` da `inOrder` 4 y `outOfOrder` `[3]` o `[2]` (uno solo).
  - `gradeRun(4, [0,-1,0,2,3])` da `skipped` `[1]`, `stray` 1, `order` `[0,2,3]` y `score` 75.
  - `gradeRun(0, [])` da `score` 0.
- [x] Correr: fallan. Implementar. Correr: pasan.

### Task 2: Progreso

**Files:** crear `src/flowdot/progress.js` y `test/flowdot-progress.test.mjs`.

**Interfaces:**
- Produces:
  - `LEVELS = ['lista', 'memoria', 'simulador']`
  - `LEVEL_LABELS = { lista: 'Con la lista', memoria: 'De memoria', simulador: 'Simulador' }`
  - `PASS = 0.9`
  - `recordResult(progress, level, result, now) -> progress`. `result` es `{ ratio }` para lista y memoria, y `{ ratio, score, time }` para simulador (`ratio = score / 100`). Guarda `levels[level] = { best, last, at }` y `lastLevel = level`. `best` es el de mayor `ratio`; si empata, el de menor `time`.
  - `passedLevel(progress) -> level | null`: el más alto con `best.ratio >= PASS`.
  - `needsReview(progress, now, stepCount) -> boolean`.

- [x] Tests:
  - Grabar 0,8 y después 0,95 deja `best` 0,95 y `last` 0,95.
  - Grabar 0,95 y después 0,5 deja `best` 0,95 y `last` 0,5.
  - En simulador, con el mismo `ratio`, gana el menor tiempo.
  - `passedLevel` con lista 0,95 y memoria 0,7 da 'lista'.
  - `needsReview`:
    - sin progreso y con pasos da true;
    - con 0 pasos da false;
    - práctica de hace 1 día con 0,95 da false;
    - de hace 3 días da true;
    - último de 0,5 hace 1 hora da true.
- [x] Correr: fallan. Implementar. Correr: pasan.

### Task 3: Repasar con escalones

**Files:** `src/flowdot/screens/editor.js`, `src/flowdot/overlay.js`, `src/styles/flowdot.css`

**Interfaces:**
- Consumes:
  - `createReview`, `reviewTap`, `reviewHint`, `reviewSummary`, `criticalStepIds`, `choicesFor` y `gradeRun` (de `review.js`).
  - `recordResult`, `passedLevel`, `LEVEL_LABELS` y `PASS` (de `progress.js`).
- Produces: marcas de overlay `{ x, y, label }` (número neutro) y `{ x, y, stray: true }` (punto gris).

- [x] Barra de escalones:
  - "Con la lista · De memoria · Simulador", con ✓ en los logrados.
  - El interruptor "Mezclar" solo se ve en Con la lista y De memoria.
  - Arranca en `progress.lastLevel ?? 'lista'`.
- [x] Con la lista:
  - El panel muestra todos los pasos y el actual con `is-current`.
  - La barra dice "Paso 3 de 8 · Flaps · 1+F" (mezclado: "Dónde está Flaps") y tiene Ayuda.
- [x] De memoria:
  - Como el "En orden" de hoy (o mezclado).
  - Al acertar un paso con acción y `choicesFor` no vacío, la barra muestra "¿Qué acción? Flaps" con botones. Los toques en la foto no cuentan hasta responder.
  - Una respuesta mal elegida marca el paso con error: suma a errores y a "pasos con error". La correcta se resalta 600 ms.
- [x] Simulador:
  - Empezar, reloj, toques con número neutro, toques sin control en gris y "Terminé".
  - Se cierra solo al tocar todos los pasos.
  - Sigue la checklist con `choicesFor` de las respuestas.
  - Resultado: tiempo, nota, en orden, salteados, fuera de orden, toques sin control y checklist. Botones Repetir, Ver el flujo y Volver al editor.
  - Lista oculta durante el examen.
- [x] Al terminar cualquier escalón sin `only`, `recordResult` y `store.setMeta('progress:<id>')`. Los resultados dicen "Logrado" si `ratio >= PASS`.
- [x] `node --test` pasa; a mano los tres escalones en escritorio y 390 px.

### Task 4: Progreso en la lista de cabinas

**Files:** `src/flowdot/screens/list.js`, `src/styles/flowdot.css`

- [x] Cada flujo con pasos muestra, debajo de la cantidad de pasos, el escalón logrado ("De memoria ✓") o "Sin practicar".
- [x] Una etiqueta "Repasar hoy" si `needsReview`.
- [x] El progreso se lee con `store.getMeta` en paralelo al renderizar.

### Task 5: Guía de uso

**Files:** crear `src/flowdot/screens/guide.js`; modificar `src/flowdot/screens/list.js`, `src/flowdot/screens/editor.js` y `src/styles/flowdot.css`.

**Interfaces:**
- Produces: `showGuide() -> Promise<void>` y `maybeShowGuide(store)`. Esta última la muestra si `guideSeen` no está y después lo guarda.

- [x] Diálogo `fd-guide` con 4 tarjetas, cada una con su dibujo SVG en línea y los textos del spec.
  - Indicador de 4 puntos.
  - Botones Saltar, Anterior, Siguiente y Empezar (la última).
  - ← → cambian de tarjeta y Esc cierra.
- [x] La lista llama `maybeShowGuide` al montar.
- [x] "Cómo se usa" va en el pie de la lista y en el ⋮ del editor.
- [x] A mano: primera visita, Saltar, volver a abrir desde los dos lugares, teléfono.
