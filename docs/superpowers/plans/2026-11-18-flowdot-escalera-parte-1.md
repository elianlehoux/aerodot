# Flowdot escalera, parte 1: Armar pegando. Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pegar una lista de texto y obtener pasos pendientes para ubicar con un toque cada uno, o la checklist de verificación del flujo.

**Architecture:** Un módulo puro nuevo, `src/flowdot/checklist.js`, lee el texto y hace las ediciones de `flow.pending` y `flow.checklist`. `file.js` los guarda en el archivo. Otro módulo nuevo, `screens/paste.js`, arma el diálogo de pegar. `editor.js` suma Ubicar (una colocación como la de Anotar), los pendientes en el panel y la sección de checklist.

**Tech Stack:** JS sin framework, `node --test`.

**Spec:** `docs/superpowers/specs/2026-11-18-flowdot-escalera-design.md` (Parte 1)

## Global Constraints

- Textos hasta 120 caracteres (`MAX_LABEL`). Pasos más pendientes hasta 200 (`MAX_STEPS`). Checklist hasta 60.
- `pending: [{ id, label, action? }]`, `checklist: [{ id, challenge, response }]`, opcionales en el flujo y en el archivo (versión 1).
- Los pendientes no se ven en Mirar, Repasar, la hoja ni el PNG.
- Español rioplatense, sin rayas largas, sin commits.

## Review Focus

- Una lista pegada desde un PDF trae renglones partidos y espacios raros (no separables, tabulaciones): el parser no debe crear ítems vacíos ni cortar en el primer espacio. Test en Task 1.
- Deshacer después de ubicar devuelve el ítem a pendientes, primero en la fila. Test en Task 1, por historial.
- Pegar 250 renglones: se toman los que entran hasta 200 entre pasos y pendientes, y se avisa. Test en Task 1.
- Archivo viejo sin `pending` ni `checklist` se abre igual. Test en Task 2.
- Tocar fuera de la foto mientras se ubica no agrega nada. A mano en Task 4.

---

### Task 1: Leer la lista y editar pendientes y checklist

**Files:** crear `src/flowdot/checklist.js` y `test/flowdot-checklist.test.mjs`.

**Interfaces:**
- Produces:
  - `MAX_CHECKLIST = 60`
  - `parseChecklist(text) -> [{ label, action }]` (`action` es `''` si no hay)
  - `addPending(flow, items, { newId, now }) -> flow`: suma al final de `pending` hasta completar 200 entre `steps` y `pending`.
  - `placePending(flow, x, y, { now }) -> flow`: pasa el primer pendiente a `steps` en (x, y), recortados a [0, 1]. Sin pendientes o con 200 pasos, devuelve el mismo flujo.
  - `removePending(flow, id, { now }) -> flow`
  - `addChecklist(flow, items, { newId, now }) -> flow`: `{ challenge: label, response: action }`, hasta 60.
  - `editChecklistItem(flow, id, { challenge, response }, { now }) -> flow` y `removeChecklistItem(flow, id, { now }) -> flow`
  - Cuando una lista queda vacía, la clave se saca del flujo.

- [x] Tests de `parseChecklist`:
  - `'PARKING BRAKE ........ SET'` da `{ label: 'PARKING BRAKE', action: 'SET' }`.
  - `'1. Flaps\t5'`, `'• Beacon - ON'`, `'☐ Fuel pumps … ON'` y `'APU   START'` separan bien.
  - `'BEFORE START:'` y los renglones vacíos se ignoran.
  - `'Seatbelts'` da acción vacía.
  - `'A   B'` (espacios no separables) separa en A y B.
  - Un renglón de 200 caracteres se recorta a 120.
- [x] Tests de ediciones:
  - `addPending` con 3 ítems da ids de `newId` y no toca `steps`.
  - Con 199 pasos, de 3 ítems solo entra 1.
  - `placePending` pasa el primero con su acción y deja 2 pendientes.
  - Al ubicar el último, `pending` desaparece.
  - `removePending` saca uno.
  - `addChecklist` corta en 60.
  - `editChecklistItem` cambia la respuesta.
  - `removeChecklistItem` del último saca la clave.
  - El flujo original queda igual.
- [x] Correr `node --test test/flowdot-checklist.test.mjs`: fallan. Implementar. Correr: pasan.

### Task 2: Archivo

**Files:** `src/flowdot/file.js` y `test/flowdot-file.test.mjs`.

- [x] Tests:
  - Ida y vuelta con `pending` (uno con acción, otro sin ella) y `checklist`.
  - Un flujo sin ellos no escribe las claves.
  - Se rechaza un pendiente sin id (`/pendiente 1 del flujo «Flujo f1»/`).
  - Se rechaza una checklist con respuesta de 121 caracteres (`/ítem 1 de la checklist del flujo «Flujo f1»/`).
  - Se rechazan más de 60 ítems de checklist y más de 200 entre pasos y pendientes.
- [x] Correr: fallan. Implementar. Correr: pasan.

### Task 3: Diálogo de pegar

**Files:** crear `src/flowdot/screens/paste.js`; modificar `src/styles/flowdot.css`.

**Interfaces:**
- Consumes: `parseChecklist`.
- Produces: `askPaste({ hasChecklist }) -> Promise<{ target: 'steps' | 'checklist', items } | null>`.

- [x] Diálogo (`dialog.fd-dialog.fd-paste`):
  - Título "Pegar una lista" y un área de texto de 10 renglones con el ejemplo como placeholder ("PARKING BRAKE ........ SET").
  - Destino con dos opciones: "Pasos del flujo" y "Checklist de verificación".
  - Vista previa en vivo, hasta 8 filas "nombre ..... acción" y "y N más".
  - "Cancelar" y "Agregar N" (deshabilitado con 0).
  - En el teléfono ocupa todo el ancho.

### Task 4: Editor: pegar, ubicar, pendientes y checklist

**Files:** `src/flowdot/screens/editor.js` y `src/styles/flowdot.css`.

**Interfaces:**
- Consumes: Tasks 1 y 3.

- [x] "Pegar lista" en el menú ⋮ y como botón chico en la cabecera de la checklist (solo en Editar).
  - Destino pasos: `commit(addPending(...))`. Si entraron menos de los pegados, avisa "Entraron N de M: un flujo tiene hasta 200 pasos." Después arranca Ubicar.
  - Destino checklist: `commit(addChecklist(...))`.
- [x] Ubicar (estado `locating`, exclusivo con la colocación de Anotar):
  - La barra muestra "Ubicá 3 de 12" (3 = pasos ubicados en esta tanda + 1), el nombre y la acción del primer pendiente, "Borrar este" y "Terminar después".
  - Tocar dentro de la foto hace `commit(placePending(...))`. Tocar fuera no hace nada. Esc sale.
  - Se termina sola cuando no quedan pendientes, con el aviso "Listo: todos los pasos están ubicados."
  - Mientras dura no se abre la tarjeta del paso y no se arrastran pasos (la foto sí se mueve).
- [x] Panel:
  - Debajo de la checklist van las filas de pendientes, grises, con "Sin ubicar" y ×.
  - Arriba de ellas, el botón "Ubicar los N que faltan".
  - Después va la sección "Checklist de verificación" con filas "pregunta ..... respuesta". Tocar una fila abre un diálogo de dos campos; × borra. Se muestra solo si hay ítems.
  - En Mirar y Repasar no se ven pendientes ni la sección.
- [x] `node --test` pasa. A mano en escritorio y 390 px: pegar 10 renglones de un 737, ubicar 3, terminar después, volver a ubicar, deshacer, pegar checklist y editar un ítem.
