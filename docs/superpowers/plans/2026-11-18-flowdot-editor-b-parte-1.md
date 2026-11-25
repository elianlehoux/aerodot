# Flowdot B, parte 1: el paso completo. Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cada paso tiene acción y crítico, se edita en una tarjeta junto al paso, el panel es una checklist y exportar va a Compartir.

**Architecture:** Datos en `flow.js` y `file.js` (puros, con tests). Un módulo nuevo `screens/step-card.js` arma y ubica la tarjeta; `editor.js` la usa en Editar. `overlay.js` dibuja la marca de crítico. `export.js` suma acción y crítico a la hoja y al PNG.

**Tech Stack:** JS sin framework, SVG, `node --test`.

**Spec:** `docs/superpowers/specs/2026-11-18-flowdot-editor-b-design.md` (Parte 1)

## Global Constraints

- `step.action`: texto de hasta 120 caracteres (`MAX_LABEL`). `step.critical`: `true` o ausente.
- `.flowdot` sigue en `version: 1`.
- Tarjeta como hoja abajo en pantallas de hasta 819 px (el corte que ya usa `flowdot.css`).
- Crítico: `#ffb454` en pantalla, `#b45309` en papel.
- Sin commits. Español rioplatense, sin rayas largas.

## Review Focus

- Escribir en la tarjeta y deshacer: cada campo entra al historial al salir del campo, no por letra. Lo cubre el uso de `commit` en `change`, como hoy en la lista.
- Paso borrado con la tarjeta abierta (Supr, deshacer): la tarjeta se cierra si el paso ya no existe.
- Acción larga en la checklist: se corta con … y no empuja el número.
- Flujos viejos sin acción: la checklist muestra solo el nombre, sin puntos.
- Teléfono: la hoja no tapa el paso marcado (la foto se corre si queda debajo).

---

### Task 1: Datos del paso

**Files:** `src/flowdot/flow.js`, `src/flowdot/file.js`, `test/flowdot-flow.test.mjs`, `test/flowdot-file.test.mjs`

**Interfaces:**
- Produces: `editStep(flow, stepId, changes, { now })` con `changes` de `{ label?, action?, critical? }`. Recorta textos a 120; `critical: false` saca la clave. Devuelve el mismo flujo si nada cambia.

- [x] Tests de `editStep`: recorta acción a 120; `critical: true` y después `false` deja el paso sin la clave; sin cambios devuelve el mismo objeto; no toca otros pasos.
- [x] Tests de archivo: ida y vuelta con `action: '1+F', critical: true`; un paso sin esos campos vuelve sin ellos; rechaza acción de 121 caracteres (`/paso 1 .*acción/`) y `critical: 'si'` (`/paso 1 .*crítico/`).
- [x] Correr y ver que fallan; implementar; correr y ver que pasan.

### Task 2: Lista impresa y PNG

**Files:** `src/flowdot/export.js`, `test/flowdot-export.test.mjs`, `src/styles/flowdot.css`

**Interfaces:**
- Produces: `stepLine(step, index) -> { name, action, critical }` (nombre o "Paso N").

- [x] Test de `stepLine`.
- [x] Hoja: cada `li` lleva nombre, puntos y acción; crítico con "!" naranja. PNG: acción a la derecha de la columna en negrita; "!" junto al número. Ruta impresa y PNG: punto naranja en el círculo de los críticos.

### Task 3: Tarjeta, checklist y Compartir

**Files:** crear `src/flowdot/screens/step-card.js`; modificar `src/flowdot/screens/editor.js`, `src/flowdot/overlay.js`, `src/styles/flowdot.css`

**Interfaces:**
- Produces: `placeCard(anchor, card, stage) -> { left, top, side }`, pura, en `step-card.js`: lado con más lugar, recortado al escenario con 12 px de margen. Con test en `test/flowdot-step-card.test.mjs`.
- `createStepCard({ onChange, onDelete, onClose, onPrev, onNext })` devuelve `{ el, show(step, index, total), hide(), focusName() }`.

- [x] Test de `placeCard`: paso a la izquierda abre a la derecha; paso a la derecha abre a la izquierda; nunca sale del escenario.
- [x] Tarjeta: se abre al agregar, al tocar un paso o su fila; ‹ ›; Esc, ×, Listo; se oculta al arrastrar; se cierra si el paso desaparece. Cambios con `commit(editStep(...))` en `change` y del interruptor.
- [x] Hoja abajo en ≤ 819 px; la foto se corre si el paso queda tapado o fuera de vista.
- [x] Checklist: filas `nombre ..... ACCIÓN` con "!"; Enter abre la tarjeta; se conservan reordenar, borrar y Alt+↑↓.
- [x] Panel: sin nombre, cabina ni exportar; ⋮ suma "Renombrar flujo" y "Cambiar foto de la cabina".
- [x] Barra de arriba: botón Compartir con .flowdot, PNG, PDF e interruptor de lista.
- [x] Overlay: punto naranja en los críticos.
- [x] Mirar: "3 de 6 · Flaps · 1+F". Repasar: acción en el aviso de acierto; "Repetir solo los críticos".
- [x] `node --test` pasa; revisión a mano en el navegador (escritorio y 390 px).
