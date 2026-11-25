# Flowdot: flujos de cabina sobre tu propia cabina

Fecha: 2026-11-16. Estado: borrador para revisión. Rama: `elianlehoux/rediseno-UI`.

## 1. Objetivo

Flowdot es una app dentro de Aerodot para armar y repasar flujos de cabina. Cada persona sube la foto de su cabina, marca sobre ella los controles en orden (un punto numerado por paso, unidos por una ruta) y después los repasa de memoria tocando la cabina. Todo queda guardado en el dispositivo y se comparte con un archivo.

El pedido del usuario: que la gente pueda "armar versiones locales de la cabina para entrenar", que los flujos se puedan compartir y que sea "muy rápida".

La idea viene de flowdeck.es, un editor de flujos para el type rating. Se toma la mecánica (tocar un control, ponerle nombre, repasar de memoria). No se copian textos, nombres, marca ni diseño.

Flowdot es el primer paso de un ecosistema de herramientas conectadas a Aerodot: vive en `aerodot.app/flowdot`, con nombre e ícono propios, pero comparte la cuenta visual, el sitio y la forma de trabajo de Aerodot.

## 2. Qué se decidió en la conversación

1. El nombre es Flowdot, y la ruta es `/flowdot`.
2. Es una sección completamente nueva. No reutiliza los dibujos de Inglés (`aircraft-views.js`) ni los datos de maniobras.
3. La cabina la pone cada persona: una foto o un PDF de su avión. Aerodot no trae cabinas dibujadas.
4. Los flujos se comparten por archivo.
5. La sesión en vivo (uno abre y el otro mira) queda para después. No entra en esta etapa.
6. Tiene que ser muy rápida. Se logra con poco código y sin framework, no con Rust o WebAssembly (se explicó por qué: la app no hace cálculo pesado, y WebAssembly suma descarga y demora en cada toque).
7. El sitio se publica en Vercel junto con Aerodot.
8. Es "como una app conectada": se siente como una herramienta propia, no como una página más de lectura.
9. Se instala como parte de Aerodot, no como app aparte.
10. Flowdot es el cuarto botón de la portada y la cuarta entrada del menú.

## 3. Alcance

Entra:

- Página `/flowdot` con la lista de cabinas y flujos guardados.
- Cargar una cabina desde una imagen o desde una página de un PDF.
- Editor: tocar para agregar pasos numerados, nombrarlos, moverlos, reordenarlos y borrarlos, con deshacer y rehacer.
- Modo Mirar: la ruta se dibuja sola, paso por paso.
- Modo Repasar: la ruta se oculta y hay que tocar los controles en orden, con ✓ o ✗ en cada toque y ayudas.
- Guardado automático en el dispositivo (IndexedDB).
- Archivo `.flowdot`: exportar, importar y compartir una cabina con sus flujos, o todo junto como copia de seguridad.
- Hoja para imprimir o guardar como PDF: la cabina con la ruta y la lista de pasos.
- Imagen PNG de la cabina con la ruta.
- Funciona sin conexión una vez cargada.

No entra:

- Sesión en vivo o colaboración en tiempo real.
- Cuentas, inicio de sesión, sincronización en la nube.
- Pagos, marcas de agua, planes.
- Video MP4.
- Registro de errores de simulador (el "debrief" de Flowdeck).
- Dos pilotos con colores distintos (PF y PM). Un flujo es una sola secuencia.
- Cabinas de ejemplo dibujadas por Aerodot.
- Un índice de "apps de Aerodot". Con una sola app no hace falta.

Lo que haría fracasar el trabajo aunque funcione:

- Que perder datos sea fácil: un flujo que desaparece sin aviso, o un archivo importado que pisa otro sin preguntar.
- Que en el teléfono o la tablet sea incómodo tocar un control chico o que el zoom pelee con el toque.
- Que tarde en abrir o que se trabe con una foto grande.
- Que parezca generado o copiado de Flowdeck.
- Que la foto o los nombres de los pasos salgan del dispositivo (analítica, Sentry, servidores).

## 4. Cómo se ve y se usa

### 4.1 Lugar en el sitio

- La ruta es `/flowdot`. Todo pasa en esa sola página. El estado de la pantalla (lista, editor, repaso) se guarda en el `#` de la dirección (`#c/<id>/f/<id>/repasar`) para que el botón Atrás funcione y se pueda volver a donde estabas.
- El encabezado del sitio se reemplaza por una barra de app más baja: a la izquierda, la marca de Aerodot chica que lleva a la portada, una barra fina y "Flowdot"; a la derecha, los botones de la pantalla actual. Sin pie de página. El editor ocupa el resto de la pantalla.
- Flowdot es el cuarto destino del sitio: cuarto botón de la portada y cuarta entrada del menú (`SiteNav.astro`), con su propio ícono. Lo decidió el usuario y modifica el diseño del 2026-11-11, que tenía tres secciones.
- Se instala como parte de Aerodot: no tiene manifest, ícono de inicio ni service worker propios. Lo decidió el usuario.
- Mismo papel, tinta y acento magenta del rediseño "carta de navegación". La ruta y los puntos del flujo van en magenta, el único acento. El ✓ y el ✗ del repaso usan verde y rojo porque son señales, como permite la guía del sitio.

### 4.2 Lista (pantalla de inicio de Flowdot)

```
 [◇ Aerodot | Flowdot]                         [Importar] [+ Cabina]
 ----------------------------------------------------------------
 Cessna 152 LV-ABC                                       [⋯]
   Antes de arrancar · 9 pasos       Antes de despegar · 12 pasos
   [+ flujo]
 Piper PA-11                                             [⋯]
   Arranque · 6 pasos
   [+ flujo]
 ----------------------------------------------------------------
 Todo se guarda en este dispositivo.  [Descargar copia de todo]
```

- Una cabina es una imagen con un nombre. Una cabina tiene varios flujos.
- El menú `⋯` de una cabina: Renombrar, Cambiar imagen, Compartir, Borrar.
- Sin cabinas, la pantalla muestra un solo botón grande: "Subí la foto de tu cabina", y abajo "o importá un archivo .flowdot".
- Tocar un flujo abre el editor de ese flujo.

### 4.3 Editor

```
 [<]  Antes de despegar · Cessna 152        [Editar|Mirar|Repasar] [⋯]
 ┌──────────────────────────────────────────────┬──────────────────┐
 │                                              │ 1  Mezcla, rica  │
 │        (foto de la cabina)                   │ 2  Magnetos, 1700│
 │     ①──────②                                 │ 3  Flaps, 10°    │
 │              ╲                               │ 4  [nombre...]   │
 │               ③───④                          │                  │
 │                                              │                  │
 │   [-] [+] [ajustar]   [deshacer] [rehacer]   │                  │
 └──────────────────────────────────────────────┴──────────────────┘
```

- En pantallas anchas la lista de pasos va a la derecha. En el teléfono va abajo, en un panel que se arrastra hacia arriba y que, cerrado, muestra solo el paso actual.
- Tocar la cabina (sin arrastrar) agrega un paso al final, con el foco en su nombre para escribirlo enseguida. El nombre empieza vacío y muestra "Paso N" como sugerencia gris.
- Arrastrar un punto lo mueve. Tocar un punto lo selecciona y lleva la lista a ese paso.
- En la lista: tocar el nombre para editarlo, arrastrar para reordenar, botón para borrar. Al reordenar, los números se recalculan.
- Mientras se escribe un nombre, tocar la cabina no agrega pasos: primero cierra la edición.
- Zoom con dos dedos, rueda del mouse o los botones. Arrastrar con un dedo sobre la imagen la mueve si hay zoom. Un toque corto (menos de 10 px de movimiento y menos de 300 ms) es un toque; lo demás es arrastre.
- Deshacer y rehacer cubren agregar, mover, renombrar, reordenar y borrar pasos.
- La ruta une los pasos en orden con una curva suave y una punta de flecha chica. Los números van dentro de círculos que mantienen su tamaño en pantalla al hacer zoom.

### 4.4 Mirar

- La ruta y los puntos se ocultan y aparecen uno por uno, cada 0,8 s, con el nombre del paso destacado en la lista.
- Botones: reproducir o pausar, anterior, siguiente, velocidad (lenta, normal, rápida).
- Si la persona prefiere movimiento reducido (`prefers-reduced-motion`), cada paso aparece de golpe, sin animar el trazo.

### 4.5 Repasar

- Se ocultan la ruta, los puntos y los nombres. Arriba se ve "Paso 3 de 12".
- La persona toca la cabina donde cree que está el control del paso que sigue.
  - Si el toque cae dentro del radio del paso correcto: ✓, aparece el punto con su número y nombre, y se pasa al siguiente.
  - Si no: ✗ breve en el lugar del toque y se cuenta un error. El paso no avanza.
- El radio de acierto es de 28 px en pantalla, medidos con el zoom actual, y nunca menos que el punto dibujado. Si dos pasos están más cerca que eso, se usa el más cercano al toque.
- Ayudas, en orden: la primera marca la zona aproximada (un círculo grande y tenue); la segunda muestra el punto. Usar ayuda se registra en el resultado.
- Al terminar: aciertos al primer intento, errores, ayudas usadas, y la lista de pasos donde hubo errores. Botones: Repetir, Repetir solo los pasos con error (en el orden original), Volver al editor.
- Variante "Dónde está": muestra el nombre de un paso al azar y hay que tocarlo, sin importar el orden. Sirve para aprender la cabina antes del orden.
- Los resultados no se guardan entre sesiones en esta etapa.

### 4.6 Hoja para imprimir y PNG

- "Imprimir o guardar PDF" arma una vista de impresión (CSS `@media print`) con: nombre del flujo y de la cabina arriba, la cabina con la ruta y los números, y la lista de pasos en columnas abajo. Se abre el diálogo de impresión del navegador. No hay librería de PDF.
- "Descargar imagen" dibuja lo mismo en un `canvas` y baja un PNG del tamaño de la imagen guardada.

## 5. Datos

### 5.1 Modelo

```js
// Cabina
{ id, name, image: { blob, type, width, height }, createdAt, updatedAt }

// Flujo
{ id, cabinId, name, steps: [ { id, x, y, label } ], createdAt, updatedAt }
// x, y: posición del paso como fracción del ancho y el alto de la imagen (0 a 1).
```

- Los ids son `crypto.randomUUID()`.
- Las posiciones en fracciones hacen que los pasos sigan en su lugar con cualquier zoom, pantalla o tamaño de imagen.
- Cambiar la imagen de una cabina conserva los pasos. Se avisa que, si la foto nueva tiene otro encuadre, los puntos pueden quedar corridos.

### 5.2 Guardado en el dispositivo

- IndexedDB, base `flowdot`, almacenes `cabins` y `flows` (con índice por `cabinId`). Envoltorio propio de unas 60 líneas, sin librería.
- Se guarda solo, 400 ms después del último cambio, y al salir de la página (`visibilitychange`).
- Al abrir Flowdot por primera vez con una cabina guardada, se pide almacenamiento persistente (`navigator.storage.persist()`) para que el navegador no lo borre por falta de espacio.
- En la lista se recuerda que todo vive en este dispositivo y se ofrece la copia de todo. Si pasaron más de 30 días desde la última copia descargada y hay flujos, se muestra un aviso discreto.

### 5.3 Al subir una imagen

- Se aceptan JPEG, PNG y WebP. En iPhone, la galería entrega JPEG aunque la foto sea HEIC.
- Se decodifica con `createImageBitmap`, se achica para que el lado mayor no pase de 2560 px y se guarda como WebP con calidad 0,85 (JPEG si el navegador no codifica WebP). Una foto de 12 megapíxeles queda en unos 300 a 600 KB.
- El trabajo pesado corre en un `OffscreenCanvas` dentro de un worker cuando el navegador lo permite, para no trabar la pantalla.
- PDF: se carga pdf.js solo en ese momento, se muestran miniaturas de las páginas, se elige una y se convierte en imagen a 2560 px por el lado mayor. Quien nunca sube un PDF no descarga pdf.js.

### 5.4 Archivo `.flowdot`

```json
{
  "format": "flowdot",
  "version": 1,
  "exportedAt": "2026-11-16T18:00:00Z",
  "cabins": [
    {
      "id": "…", "name": "Cessna 152 LV-ABC",
      "image": { "type": "image/webp", "width": 2560, "height": 1707, "data": "<base64>" },
      "flows": [ { "id": "…", "name": "Antes de despegar", "steps": [ { "id": "…", "x": 0.41, "y": 0.62, "label": "Mezcla, rica" } ] } ]
    }
  ]
}
```

- Un archivo puede traer una o varias cabinas. "Compartir" de una cabina exporta esa sola con todos sus flujos. "Descargar copia de todo" exporta todas. No hace falta ZIP.
- Nombre del archivo: el de la cabina, sin caracteres raros, más `.flowdot` (por ejemplo `cessna-152-lv-abc.flowdot`). La copia completa: `flowdot-copia-2026-11-16.flowdot`.
- Compartir: en el teléfono, si `navigator.canShare({ files })` lo permite, se abre el menú de compartir del sistema (WhatsApp, Mail, AirDrop). Si no, se descarga el archivo.
- Importar: botón Importar, o arrastrar el archivo sobre la página. Se valida todo antes de guardar nada:
  - `format` y `version` correctos, tipos y rangos (x e y entre 0 y 1, nombres de hasta 120 caracteres, hasta 200 pasos por flujo), imagen que se pueda decodificar.
  - Si algo falla, no se guarda nada y se dice qué parte del archivo está mal.
  - Si una cabina del archivo tiene el mismo id que una guardada, se pregunta qué hacer con esa cabina, con una casilla "Hacer lo mismo con las demás":
    - Actualizar: el nombre y la imagen de la cabina pasan a ser los del archivo. Los flujos del archivo reemplazan a los guardados con el mismo id y los nuevos se agregan. Los flujos guardados que no están en el archivo se quedan. Importar nunca borra un flujo.
    - Guardar como copia: la cabina y sus flujos entran con ids nuevos y " (copia)" en el nombre.
    - Saltear: esa cabina no se importa.
  - Un flujo cuyo id ya existe en otra cabina recibe un id nuevo al importarse.
- Abrir Flowdot con un archivo desde otra app (Web Share Target) no entra en esta etapa.

## 6. Rendimiento

Metas que se miden antes de dar el trabajo por terminado:

| Qué | Meta |
|---|---|
| JS propio de Flowdot al abrir (comprimido) | menos de 30 KB, sin contar pdf.js ni lo que ya carga todo el sitio (PostHog, Sentry) |
| Pantalla usable en un teléfono medio | menos de 1 s desde la caché |
| Respuesta a un toque | menos de 16 ms |
| Procesar una foto de 12 MP | menos de 300 ms en una computadora, menos de 1 s en un teléfono medio |
| Abrir un flujo guardado | menos de 100 ms |

Cómo:

- Sin framework. Módulos de JS propios en `src/flowdot/`, cargados solo en `/flowdot`.
- La imagen va en un `<img>` y la ruta en un `<svg>` encima, los dos dentro de un contenedor que se mueve y escala con `transform` (zoom y desplazamiento sin recalcular el diseño de la página).
- Los números y círculos se dibujan en el SVG con un tamaño compensado por el zoom, así se ven siempre igual.
- Mientras se arrastra, solo se actualiza el punto y los dos tramos de ruta que lo tocan.
- Los cálculos puros (fracciones, acierto, orden, validación del archivo) están separados del DOM.

## 7. Sin conexión, privacidad y medición

- `/flowdot` se suma a `precachePages` en `astro.config.mjs`. pdf.js queda en la caché de assets la primera vez que se usa.
- La foto, los nombres y los pasos nunca salen del dispositivo, salvo en el archivo que la persona elige compartir.
- El área de la app lleva la clase `ph-no-capture`, así el autocapture y la grabación de sesiones de PostHog no registran nombres ni la cabina. PostHog y Sentry se cargan en `/flowdot` igual que en el resto del sitio.
- PostHog: solo eventos sin contenido (`flowdot_cabin_created`, `flowdot_flow_created`, `flowdot_review_finished` con número de pasos y aciertos, `flowdot_exported`, `flowdot_imported`). Nunca nombres, posiciones ni imágenes.
- Sentry: los errores no llevan el contenido de los flujos. Revisar que los breadcrumbs no capturen el texto de los campos de nombre.
- `privacidad.astro`: se agrega un párrafo que dice que lo de Flowdot queda en el dispositivo.

## 8. Accesibilidad e idioma

- Todo el texto en español rioplatense con voseo, oraciones en minúscula después de la primera palabra, sin rayas largas ni emojis.
- La lista de pasos es la vía por teclado: cada paso es un elemento con foco; Enter edita, Supr borra, Alt+flechas reordena.
- Agregar un paso por teclado no entra en esta etapa (hace falta señalar un lugar en la foto).
- Botones de al menos 44 × 44 px. El ✓ y el ✗ tienen además texto para lectores de pantalla.

## 9. Decisiones del constructor (propuestas, a confirmar)

1. **Cabina con varios flujos**, en vez de una imagen por flujo como Flowdeck. Evita repetir la foto en cada flujo y en cada archivo.
2. **pdf.js como dependencia nueva** (`pdfjs-dist`), cargada solo al subir un PDF. Sin él, solo se aceptan imágenes.
3. **Formato del archivo:** JSON con la imagen en base64 y extensión `.flowdot`. Pesa un tercio más que la imagen sola, a cambio de ser un solo archivo legible.
4. **Ícono de Flowdot:** un punto con una ruta curva saliendo de él, en tinta y magenta. Se presenta en maqueta antes de usarlo.

## 10. Pruebas

- `node --test` para los módulos puros: conversión entre pantalla y fracciones con zoom y desplazamiento, acierto y paso más cercano, avance y conteo del repaso, reordenar y deshacer, validación e importación del archivo (archivos buenos, rotos, de otra versión, con ids repetidos).
- Prueba manual en Safari de iPhone, Safari de iPad y Chrome de Android y de escritorio: subir foto, armar un flujo de 10 pasos, repasar, exportar, borrar los datos del sitio, importar y comprobar que todo vuelve igual.
- Medir las metas de la sección 6 con las herramientas del navegador, con red lenta y CPU frenada 4×.

## 11. Para después

- Sesión en vivo: uno abre la cabina y el otro mira, con un relay propio (Cloudflare Worker con Durable Objects u otra opción que funcione con Vercel).
- Practicar en pareja, con un flujo por piloto.
- Guardar el historial de repasos.
- Abrir archivos `.flowdot` desde otras apps (Web Share Target).
- Un índice de apps cuando haya más de una.
