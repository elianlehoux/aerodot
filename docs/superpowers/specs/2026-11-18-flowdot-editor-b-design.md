# Flowdot: editor sin modos (opción B)

Fecha: 2026-11-18. Estado: elegido por el usuario ("usemos B"). Rama: `elianlehoux/rediseno-UI`.
Prototipos: `flowdot-editor-prototipos-a1.html` (en la conversación).

## Por qué

El usuario quería sumar la barra de herramientas de Flowdeck (paso, línea, círculo, "!", texto) y un tutorial.
Al repensarlo salieron cinco problemas: una paleta crea modos y en tablet se pone la marca equivocada; las marcas
sueltas son decoración, lo que sirve para memorizar está en el paso (qué control y qué se hace); el paso se escribe
lejos de la foto; el panel hace tres trabajos; un tutorial de nueve pantallas no se lee. Se compararon tres opciones
(A paleta, B sin modos, C checklist primero) y el usuario eligió B.

## Qué es B

- Tocar la foto siempre agrega un paso, como hoy. No hay herramientas que elegir.
- Cada paso tiene, además del nombre, una **acción** ("1+F", "ON", "SET") y puede ser **crítico**.
- Al marcar un paso aparece una **tarjeta junto al paso** con nombre, acción, crítico, Borrar y Listo.
- El panel de la derecha pasa a ser una **checklist**: número, nombre, puntos y acción, con "!" en los críticos.
- Exportar sale del panel y va a un botón **Compartir** en la barra de arriba.
- Las marcas de ayuda (flecha y etiqueta de zona) salen de **Anotar**: se colocan una vez y el toque vuelve a agregar pasos.
- En el teléfono la tarjeta es una **hoja abajo**, con ‹ › para pasar de paso sin cerrarla.
- No hay tutorial aparte: cada opción de Anotar explica en una línea para qué sirve.

## Partes

El trabajo se hace en dos partes, en este orden. Cada una se puede usar sola.

### Parte 1: el paso completo

**Datos.** `step.action` (texto, hasta 120 caracteres, vacío si no hay) y `step.critical` (`true` o ausente).
El archivo `.flowdot` sigue en versión 1: los dos campos son opcionales; un Flowdot viejo los ignora.
Al importar, una acción que no sea texto o pase de 120 caracteres, o un `critical` que no sea booleano, da error con el paso.

**Tarjeta del paso (Editar).**
- Se abre al agregar un paso (con el nombre listo para escribir) y al tocar un paso o su fila.
- Campos: nombre, acción, interruptor "Paso crítico". Abajo: Borrar y Listo. Arriba: ‹ › paso anterior y siguiente.
- Se ubica al lado del paso, del lado con más lugar, sin salir del escenario. Si el paso queda fuera de la vista, la foto se corre para mostrarlo.
- Se cierra con Listo, Esc o el botón ×. Tocar la foto vacía con la tarjeta abierta agrega otro paso y la tarjeta pasa a ese.
- Mientras se arrastra un paso o una curva, la tarjeta se oculta y vuelve al soltar.
- Cada cambio entra en deshacer y rehacer, igual que hoy.
- En pantallas de hasta 819 px la tarjeta es una hoja fija abajo del escenario, encima del panel.

**Checklist (panel).**
- Filas: número, nombre, puntos, acción en mayúscula tal como se escribió, "!" si es crítico.
- Tocar una fila marca el paso y abre la tarjeta. Se conservan: arrastrar para reordenar, borrar con ×, y el teclado (Enter abre la tarjeta, Supr borra, Alt+↑↓ reordena).
- Arriba del panel: título del flujo y cabina como texto; renombrar flujo y cambiar la foto pasan al menú ⋮ ("Renombrar flujo", "Cambiar foto de la cabina").
- Abajo del panel: solo el botón principal (Repasar o Volver a editar).

**Compartir.** Botón en la barra de arriba que abre un menú: "Archivo .flowdot", "Imagen PNG", "PDF para imprimir" y el interruptor "Incluir la lista de pasos" (el que hoy está en el panel).

**Mirar.** La barra muestra "3 de 6 · Flaps · 1+F". Las curvas y el destacado siguen igual.

**Repasar.**
- Al acertar, la barra muestra la acción del paso durante el destello ("Correcto: Flaps, 1+F").
- Si el flujo tiene pasos críticos, el resultado ofrece "Repetir solo los críticos".
- "Dónde está" pregunta por el nombre, como hoy.

**Impresión y PNG.** La lista lleva "nombre ..... ACCIÓN" y un "!" en los críticos. En la foto, los críticos llevan un punto naranja chico arriba a la derecha del círculo, igual que en pantalla.

### Parte 2: Anotar

**Datos.** `flow.notes`: lista de hasta 50 marcas, cada una con `id` y:
- Flecha: `{ type: 'arrow', x1, y1, x2, y2, bend? }` en fracciones de la foto.
- Etiqueta: `{ type: 'label', x, y, text }`, texto de hasta 40 caracteres.

**Anotar.** Botón en la barra de abajo que abre un menú con "Flecha" ("Señala algo sin sumar un paso. Tocá inicio y fin.") y "Etiqueta de zona" ("Nombra una parte: Overhead, Pedestal."). Elegir una arma una colocación única con un aviso arriba ("Tocá dónde empieza la flecha"). Esc o tocar fuera de la foto cancela. Al terminar, el toque vuelve a agregar pasos.

**Editar marcas.** Tocar una marca la marca y abre una tarjeta chica: texto (solo etiquetas) y Borrar. Las etiquetas se arrastran; la flecha se arrastra por sus puntas y se arquea con el puntito del medio, como las flechas de la ruta.

**Dónde se ven.** En Editar, Mirar, PDF y PNG. En Repasar se ocultan.

**Prioridad al tocar:** paso, puntito de curva, punta de flecha, marca, foto vacía.

## Estilo

Colores y piezas de Flowdot. Crítico en naranja (`#ffb454` en pantalla; en papel un naranja oscuro legible sobre blanco). Flechas de ayuda en blanco con halo oscuro, para no confundirse con la ruta magenta. Sin copiar textos ni diseño de Flowdeck.

## No entra

- Círculos numerados sueltos (se confunden con los pasos).
- Pegar una checklist (opción C): se puede sumar más adelante sin cambiar B.
- Tutorial de varias pantallas.
- Colores o grosores por marca.

## Pruebas

- Unidad: ediciones (`editStep` con acción y crítico, notas), archivo (ida y vuelta y rechazos), repaso solo de críticos, columnas y textos de la lista impresa.
- A mano en el navegador: tarjeta en escritorio y teléfono, ‹ ›, Esc, deshacer, checklist, Compartir, Mirar y Repasar con acción, PDF y PNG, Anotar flecha y etiqueta.
