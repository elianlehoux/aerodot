# Flowdot: de la checklist al simulador (escalera de práctica)

Fecha: 2026-11-18. Estado: aprobado por el usuario ("Dale, sí, anda. Hacelo vos con las recomendaciones que creas que son las mejores"). Rama: `elianlehoux/rediseno-UI`.

## Por qué

Flowdot lo usa sobre todo quien prepara una **habilitación de tipo en simulador**. En pocas semanas tiene que llegar sabiendo los flujos de su avión y de su empresa: de memoria, en orden, con la acción correcta, y después correr la checklist de verificación.

Lo que se encontró al investigar:
- Primero se lee y se hace con la checklist en la mano. Después el flujo se hace de memoria y la checklist solo verifica.
- En el simulador se evalúa el orden, que no falte nada, el ritmo y la terminología. Una falla típica es invertir el orden.
- Hoy se estudia con el póster de cabina. Las apps parecidas tienen un modo guiado y uno de prueba, y dejan cargar flujos propios porque cada empresa tiene los suyos.

El usuario pidió dos cosas: armar un flujo **pegando la checklist**, y practicar **con la checklist a la vista** tocando dónde va cada paso ("lo más difícil no es saberse todo de memoria, también es saber dónde tocar"). También pidió una **guía corta al abrir la app**, porque saber usarla es lo esencial. Esto último reemplaza el "sin tutorial" de la opción B: ahora hay una guía, pero corta.

Debe servir también para una avioneta, que se usa leyendo y haciendo: cada escalón funciona solo.

## Qué es

```
Armar          pegás el flujo y tocás dónde va cada ítem
1 Mirar        la ruta se dibuja con nombre y acción              (ya existe)
2 Con la lista ves el flujo y tocás dónde está cada ítem
3 De memoria   sin lista, en orden; al acertar elegís la acción
4 Simulador    el flujo de memoria, sin ayudas, con tiempo, y la checklist de verificación
Progreso       por flujo: mejor resultado de cada escalón y cuál conviene repasar hoy
Guía           4 tarjetas al abrir por primera vez; se vuelve a ver desde "Cómo se usa"
```

**Un flujo por asiento** (decisión del usuario): "Antes del arranque, copiloto" y "Antes del arranque, capitán" son flujos distintos. No hay roles por paso.

## Partes

Se hace en tres partes, en este orden. Cada una se puede usar sola.

### Parte 1: Armar pegando

**Pegar.** En Editar, el menú ⋮ y el panel (botón "Pegar lista") abren un diálogo con:
- un área de texto;
- el destino: "Pasos del flujo" (por defecto) o "Checklist de verificación";
- una vista previa con lo que se entendió, renglón por renglón (nombre ..... acción) y la cantidad.

Botón "Agregar N".

**Cómo se lee cada renglón** (`parseChecklist`, pura):
- Se ignoran los renglones vacíos y los que terminan en ":" (títulos como "BEFORE START:").
- Se saca la numeración o viñeta del principio: "1.", "1)", "-", "•", "□", "☐", "[ ]".
- Nombre y acción se separan por el primer separador que aparezca: tabulación, 2 o más puntos o "…", " - ", " – ", " — ", o 3 o más espacios. Si no hay separador, todo es nombre.
- Los textos se recortan a 120 caracteres. Hasta 200 ítems.

**Pasos sin ubicar.** Lo pegado como pasos va a `flow.pending`: una lista de `{ id, label, action? }`. Todavía no tiene lugar en la foto.
- Los pasos ubicados no cambian: la ruta, el repaso y la geometría no ven `pending`.
- La checklist del panel muestra los pendientes abajo, en gris, con "Sin ubicar". Arriba de ellos está el botón "Ubicar los N que faltan".

**Ubicar.** Después de pegar, y desde ese botón, empieza la ubicación:
- La barra muestra "Ubicá 3 de 12 · Parking brake · SET", con "Borrar este" y "Terminar después".
- Cada toque en la foto pasa el primer pendiente a `steps` en ese lugar. Así el orden pegado se conserva.
- Esc o "Terminar después" sale; lo que falta queda pendiente.
- Deshacer devuelve el ítem a pendiente.
- Mientras se ubica, la tarjeta del paso no se abre.

**Checklist de verificación.** Lo pegado con ese destino va a `flow.checklist`: `[{ id, challenge, response }]`, con nombre y acción del parser. Va en el panel, en su propia sección debajo de la checklist del flujo, con filas "pregunta ..... respuesta". Tocar una fila abre un diálogo de dos campos para editarla, y × la borra. Hasta 60 ítems.

**Archivo.** `.flowdot` sigue en versión 1. `pending` y `checklist` son opcionales y solo se escriben si tienen algo. Al leer se validan con mensajes que nombran el flujo y el número.

### Parte 2: Escalones de práctica y progreso

Repasar pasa a tener tres escalones en su barra: **Con la lista · De memoria · Simulador**. Se recuerda el último usado por flujo. "Dónde está" deja de ser un modo aparte: es la opción "Mezclar el orden" de Con la lista y de De memoria.

**Con la lista (2).**
- El panel muestra todos los pasos con nombre y acción. El que toca ahora va resaltado y los hechos llevan tilde.
- La barra muestra "Paso 3 de 8 · Flaps · 1+F" y Ayuda.
- Errores y ayudas, igual que hoy.

**De memoria (3).**
- Como el "En orden" de hoy: los pasos se ven a medida que se aciertan.
- Al acertar un paso con acción, la barra pregunta "¿Qué acción?" con hasta 4 opciones: la correcta y otras distintas del mismo flujo, mezcladas.
- Una opción mal elegida cuenta como error de ese paso. Si el flujo tiene menos de 2 acciones distintas, no se pregunta.

**Simulador (4).** Es un examen.
- Arranca con "Empezar", que pone en marcha el reloj.
- Cada toque se toma como el paso más cercano, cualquiera sea, y se marca con un número chico en el orden en que tocaste. No se dice si está bien o mal. Un toque que no cae en ningún paso deja una marca gris.
- "Terminé" (o tocar todos los pasos) cierra el flujo.
- Si hay checklist de verificación, sigue esa parte. Por cada ítem se ve la pregunta y se elige la respuesta entre hasta 4 opciones de la misma checklist.
- **Resultado:** tiempo; pasos en orden sobre el total; lista de **salteados**, **fuera de orden** (los que no entran en la secuencia creciente más larga) y **toques sin control**; respuestas de la checklist bien sobre el total. Botones: Repetir, Ver el flujo (Mirar) y Volver.
- La nota es `round(100 × en orden / total)`.

**Progreso** (`meta` con clave `progress:<flowId>`, fuera del flujo para no tocar su `updatedAt` ni el archivo):
- Por escalón: la mejor marca (porcentaje al primer intento; en Simulador, nota y tiempo) y la fecha de la última práctica.
- Un escalón está **logrado** con 90 % o más.
- En la barra de escalones, el logrado lleva tilde.
- En la lista de cabinas, cada flujo muestra el escalón más alto logrado ("De memoria ✓") o "Sin practicar".
- **"Repasar hoy"** marca los flujos con pasos que no se practican hace 2 días o más, o cuyo último resultado quedó por debajo de 90 %.

### Parte 3: Guía de uso

- Al abrir Flowdot por primera vez (meta `guideSeen`) aparece un diálogo con 4 tarjetas, cada una con un dibujo simple (SVG en línea, colores de la app) y dos renglones:
  1. **Tu cabina:** subí una foto de la cabina o abrí la de ejemplo.
  2. **Tu flujo:** pegá la checklist de tu empresa y tocá dónde va cada ítem. Hacé un flujo por asiento.
  3. **Practicá en escalones:** Mirar, Con la lista, De memoria y Simulador.
  4. **Tu avance:** cada flujo guarda tu mejor marca y te avisa cuál repasar hoy.
- Botones Saltar, Anterior, Siguiente y "Empezar" en la última. Teclado: ← →, Esc.
- Se vuelve a ver desde "Cómo se usa", en el pie de la lista y en el menú ⋮ del editor.
- Textos propios: no se copian textos ni diseño de Flowdeck.

## Restricciones

- JS sin framework, como el resto de Flowdot. Datos solo en el dispositivo (IndexedDB).
- Un solo acento (magenta) más el naranja de crítico. Español rioplatense, sin rayas largas. Sin commits sin pedido.
- Teléfono (≤ 819 px): los diálogos ocupan el ancho y la barra de escalones entra en una fila.

## Decisiones del que construye (marcadas como propias)

- Los pendientes no se ven en Mirar, Repasar, la hoja ni el PNG. Repasar y el Simulador solo usan los pasos ubicados.
- Si el flujo ya tiene 200 pasos, ubicar avisa y no agrega.
- El último escalón usado se guarda en el mismo registro de progreso (`lastLevel`).
- El progreso no se borra si el flujo cambia. Las marcas viejas siguen como referencia.
- Pegar en un flujo que ya tiene pasos suma los nuevos al final de los pendientes.

## No entra

- Roles por paso o compañero virtual (queda para después; `seat` por paso se podría sumar sin romper el archivo).
- Voz (leer la checklist en voz alta o responder hablando).
- Leer checklists desde PDF o foto.
- Repaso espaciado con calendario; "Repasar hoy" es la versión simple.
- La checklist de verificación en la hoja impresa y en el PNG (queda para después).

## Enfoques considerados

- **Escalones dentro de Repasar** (elegido): no suma botones a la barra de arriba, que ya está llena en el teléfono, y reusa el motor de repaso.
- **Un modo por escalón en la barra de arriba:** cinco botones no entran en 390 px.
- **Pantalla de inicio por flujo con la escalera:** más clara, pero suma una pantalla y un paso antes de practicar. Se puede sumar después mostrando el progreso que ya se guarda.
- **Pendientes como pasos sin posición dentro de `steps`:** obliga a filtrar en toda la geometría, el repaso y la exportación. `flow.pending` aparte no toca nada de eso.

## Pruebas

- Unidad:
  - `parseChecklist`: separadores, numeración, títulos, vacíos y recorte.
  - Ediciones de `pending` y `checklist`: pegar, ubicar el primero, borrar y deshacer.
  - Archivo: ida y vuelta y rechazos.
  - `gradeRun`: salteados, fuera de orden con secuencia creciente más larga, toques sin control y nota.
  - Opciones de acción: incluye la correcta, sin repetidas, como máximo 4.
  - Progreso: mejor marca, logrado y "repasar hoy".
- A mano: pegar y ubicar en escritorio y teléfono; los tres escalones; resultado del Simulador; la guía la primera vez y desde "Cómo se usa".
