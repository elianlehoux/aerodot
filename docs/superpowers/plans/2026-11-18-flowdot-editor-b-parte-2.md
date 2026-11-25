# Flowdot B, parte 2: Anotar. Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Flechas sueltas y etiquetas de zona en la foto, que se colocan una vez desde "Anotar" y se ven en Editar, Mirar, PDF y PNG.

**Architecture:** Un módulo puro nuevo `src/flowdot/notes.js` con las ediciones (`addNote`, `updateNote`, `removeNote`) y la geometría de las marcas (`arrowSegment`, `arrowTip`, `noteAt`, `arrowPartAt`). `file.js` lee y escribe `flow.notes`. `overlay.js` y `export.js` dibujan. `editor.js` suma el menú Anotar, la colocación, el arrastre y una tarjeta chica (`createNoteCard` en `step-card.js`).

**Tech Stack:** JS sin framework, SVG, canvas, `node --test`.

**Spec:** `docs/superpowers/specs/2026-11-18-flowdot-editor-b-design.md` (Parte 2)

## Global Constraints

- `flow.notes`: hasta 50. Flecha `{ id, type: 'arrow', x1, y1, x2, y2, bend? }`; etiqueta `{ id, type: 'label', x, y, text }` con texto de 1 a 40 caracteres. Posiciones en fracciones de la foto.
- `.flowdot` sigue en `version: 1`; `notes` es opcional y solo se escribe si hay alguna.
- Flechas de ayuda en blanco con halo oscuro; nunca magenta.
- Prioridad al tocar: paso, puntito de curva, punta de flecha, marca, foto vacía.
- En Repasar no se ven.
- Sin commits. Español rioplatense, sin rayas largas.

## Review Focus

- Flujos sin `notes` se ven, se exportan y se importan igual que antes.
- Deshacer una marca recién puesta cierra su tarjeta.
- Colocar una flecha: dos toques; Esc o tocar fuera de la foto cancela.
- Duplicar un flujo copia las marcas con ids nuevos.

---

### Task 1: Datos y geometría de las marcas

**Files:** crear `src/flowdot/notes.js`, `test/flowdot-notes.test.mjs`; exportar `bentSegment` de `geometry.js`.

- [x] Tests: `addNote` recorta posiciones a [0, 1] y texto a 40, no pasa de 50; `updateNote` cambia y recorta, `bend: null` saca la curva, id desconocido devuelve el mismo flujo; `removeNote`; `noteAt` encuentra etiqueta y flecha y da -1 lejos; `arrowPartAt` da `start`, `end`, `mid` (solo con `mid: true`) o null; `arrowTip` apunta en la dirección del final.
- [x] Correr: fallan. Implementar. Correr: pasan.

### Task 2: Archivo

**Files:** `src/flowdot/file.js`, `test/flowdot-file.test.mjs`

- [x] Tests: ida y vuelta con una flecha arqueada y una etiqueta; flujo sin marcas no escribe `notes`; rechaza más de 50, tipo desconocido, posición fuera y texto vacío o de 41 (`/marca 1 del flujo/`).
- [x] Correr: fallan. Implementar. Correr: pasan.

### Task 3: Dibujo, impresión y PNG

**Files:** `src/flowdot/overlay.js`, `src/flowdot/export.js`, `src/styles/flowdot.css`

- [x] Overlay: capa de marcas debajo de la ruta; marca elegida en acento; puntitos en las puntas y el medio de la flecha elegida; inicio pendiente de una flecha.
- [x] Hoja y PNG: marcas debajo de la ruta, blancas con halo oscuro.

### Task 4: Editor

**Files:** `src/flowdot/screens/editor.js`, `src/flowdot/screens/step-card.js`, `src/flowdot/ui.js`, `src/styles/flowdot.css`

- [x] Botón Anotar en la barra de abajo (solo Editar), menú hacia arriba con una línea de ayuda por opción.
- [x] Colocación única con aviso arriba y Cancelar; etiqueta pide el texto.
- [x] Tocar una marca la elige y abre la tarjeta chica (texto solo en etiquetas, Borrar, Listo). Supr borra, Esc cierra.
- [x] Arrastrar etiquetas, puntas de flecha y el puntito del medio.
- [x] Mirar las muestra; Repasar no. Duplicar las copia.
- [x] `node --test` pasa; a mano en escritorio y 390 px.
