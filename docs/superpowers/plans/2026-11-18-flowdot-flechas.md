# Flowdot: flechas que se arquean y se destacan. Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cada flecha del flujo se puede arquear con un puntito y se destaca al pasar por arriba.

**Architecture:** La curvatura vive en el paso al que llega la flecha (`step.bend`, -1 a 1). `routeSegments` ya devuelve tramos cúbicos; un tramo con `bend` se arma como cuadrática que pasa por el puntito, en el mismo formato, así pantalla, impresión y PNG la dibujan sin código aparte. El editor detecta la flecha bajo el puntero y arrastra su puntito.

**Tech Stack:** JS sin framework, SVG, `node --test`.

**Spec:** `docs/superpowers/specs/2026-11-18-flowdot-flechas-design.md`

## Global Constraints

- `bend` en [-1, 1]. Sin `bend`: curva automática (Catmull-Rom actual). `0`: recta.
- `bend` = distancia perpendicular del puntito al medio del tramo / largo del tramo; positivo hacia la normal `(-dy, dx)`.
- El archivo sigue en `version: 1`; `bend` es opcional por paso.
- Sin commits: el usuario no quiere commits sin pedirlos.
- Textos en español rioplatense, sin rayas largas.

## Review Focus

- Dos pasos en el mismo lugar (largo 0): `bend` no debe dar NaN; el tramo sale recto. Test en Task 1.
- Tramos no consecutivos (Repasar con ayuda nivel 2 agrega un paso suelto): no aplicar el `bend` de otro tramo. Test en Task 1.
- Puntito cerca del borde de la foto: los puntos de control no salen de la imagen. Test en Task 1.
- Flujos viejos sin `bend` se ven igual que hoy. Test en Task 1.
- Duplicar un flujo conserva las curvas (copia los pasos con `...step`, ya lo hace). Sin test nuevo.

---

### Task 1: Geometría de las flechas

**Files:**
- Modify: `src/flowdot/geometry.js`
- Test: `test/flowdot-geometry.test.mjs`

**Interfaces:**
- Produces:
  - `routePoints(steps, width, height, shown?) -> [{ index, px, py, bend? }]`: `bend` solo si el punto sigue al anterior (`index === prev.index + 1`) y el paso lo tiene.
  - `routeSegments(points, bounds)`: si `points[i+1].bend` es número, ese tramo es la cuadrática por el puntito (pasada a cúbica); si no, Catmull-Rom como hoy.
  - `bendFrom(p1, p2, point) -> number`: el `bend` que pone el puntito en `point`, recortado a [-1, 1]; 0 si el largo es 0.
  - `segmentAt(segments, px, py, radius) -> number`: índice del tramo más cercano dentro del radio, o -1 (muestrea 24 puntos por tramo).

- [ ] Tests: con `bend` 0,3 de (0,0) a (100,0), `segmentMiddle` da px 50, py 30; con `bend` -0,3 da py -30; `bendFrom` de (50, 30) da 0,3 y de (50, 500) da 1; largo 0 da 0 y tramo sin NaN; `routePoints` no pone `bend` en un punto no consecutivo; sin `bend` `routePath` es igual que antes; con `bounds` los controles quedan dentro; `segmentAt` encuentra el tramo arqueado en su mitad y da -1 lejos.
- [ ] Correr `node --test test/flowdot-geometry.test.mjs`: fallan.
- [ ] Implementar. Cuadrática: `C = mid + 2·bend·(-dy, dx)`; cúbica `c1 = p1 + ⅔(C − p1)`, `c2 = p2 + ⅔(C − p2)`. `bendFrom`: `((point − mid) · (-dy, dx)) / len²`.
- [ ] Correr: pasan.

### Task 2: Ediciones de curvas

**Files:**
- Modify: `src/flowdot/flow.js`
- Test: `test/flowdot-flow.test.mjs`

**Interfaces:**
- Produces:
  - `bendStep(flow, stepId, bend, { now })`: pone `bend` recortado a [-1, 1]; con `bend === null` lo saca (vuelve a automática).
  - `reorderStep` y `removeStep`: sacan `bend` de cada paso cuyo paso anterior cambió.

- [ ] Tests: `bendStep(…, 'b', 2)` deja 1; `bendStep(…, 'b', null)` saca la clave; reordenar a,b,c con `bend` en b y c a b,c,a: ninguno conserva `bend` salvo el que sigue teniendo el mismo anterior; borrar b saca el `bend` de c y conserva el resto; el original no cambia.
- [ ] Correr `node --test test/flowdot-flow.test.mjs`: fallan.
- [ ] Implementar con un helper `keepBends(before, after)` que compara el id anterior de cada paso.
- [ ] Correr: pasan.

### Task 3: Archivo `.flowdot`

**Files:**
- Modify: `src/flowdot/file.js`
- Test: `test/flowdot-file.test.mjs`

- [ ] Tests: ida y vuelta con `bend: -0.25` lo conserva; paso sin `bend` vuelve sin la clave; rechaza `bend: 1.5` y `bend: 'x'` con mensaje `/paso 1 del flujo «Flujo f1».*curva/`.
- [ ] Correr: fallan.
- [ ] Implementar: exportar `bend` solo si es número; al leer, si viene y no es número finito en [-1, 1], `${where} tiene una curva no válida.`
- [ ] Correr: pasan.

### Task 4: Pantalla, impresión y PNG

**Files:**
- Modify: `src/flowdot/overlay.js`, `src/flowdot/screens/editor.js`, `src/flowdot/export.js`, `src/styles/flowdot.css`

**Interfaces:**
- Consumes: todo lo de las Tasks 1 y 2.
- Produces: `overlay.draw(..., { ..., hover, handles })`: `hover` índice del tramo destacado; `handles` índices de tramos que muestran su puntito (en lugar de la punta).

- [ ] `export.js`: `routeSvg` y el PNG arman los puntos con `routePoints`.
- [ ] `overlay.js`: puntos con `routePoints`; capa `fd-hover` con el tramo destacado (`segmentPath`, `pathLength=1`) y capa `fd-handles` con círculos en `segmentMiddle`; la punta de flecha no se dibuja en tramos con puntito. Los dos pasos del tramo destacado llevan `is-linked`.
- [ ] `editor.js`, Editar y Mirar: `pointermove` en el escenario (solo `pointerType === 'mouse'`, sin botón apretado) calcula `segmentAt` en px de imagen con radio `HIT_RADIUS / scale`, salvo si hay un paso bajo el puntero; repinta solo si cambia. `pointerleave` lo limpia. En la lista, `pointerenter` de la fila i destaca el tramo i−1.
- [ ] `editor.js`, Editar: estado `bending` (índice de tramo seleccionado). Puntitos visibles: tramo bajo el mouse, `bending`, y los que tocan al paso seleccionado. `dragStart`: si cae en un puntito visible (radio `HIT_RADIUS`), arrastra la curva (`bendFrom` con el punto en px de imagen) en `dragFlow` con `bendStep`; si no, lo de hoy. `tap`: paso gana; si cae en un tramo, `bending = i`; doble toque en un puntito antes de 350 ms vuelve a automática con `bendStep(…, null)`.
- [ ] `flowdot.css`: `.fd-handle-dot` círculo blanco con borde de acento, `cursor: grab`; `.fd-hover` trazo más grueso con `stroke-dasharray: .18 .82` corriendo con `@keyframes fd-flow` 1,1 s en bucle; `.fd-dot.is-linked` con anillo. Con `prefers-reduced-motion: reduce`, sin animación. Fila de la lista `is-linked` con fondo `--quiet`.
- [ ] `node --test`: todo pasa.
- [ ] A mano en el navegador: arquear y soltar, deshacer, doble clic, mover un paso conserva la forma, hover en Editar y Mirar, hover en la lista, teléfono (toque en flecha y arrastre), PNG respeta la curva.
