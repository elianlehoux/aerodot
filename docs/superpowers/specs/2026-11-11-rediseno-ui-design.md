# Rediseño de UI: carta de navegación

Fecha: 2026-11-11. Estado: borrador para revisión. Rama: `elianlehoux/rediseno-UI`.

Maquetas aprobadas, abrir en el navegador:

- `docs/superpowers/specs/2026-11-11-rediseno-ui/portada.html`: portada en escritorio y teléfono.
- `docs/superpowers/specs/2026-11-11-rediseno-ui/telefono-menu.html`: encabezado del teléfono y menú desplegable.

Las maquetas mandan en lo visual. Donde este documento y una maqueta difieran, vale la maqueta.

## 1. Objetivo

Que Aerodot se vea moderno y con identidad propia, con animaciones que se noten, y que navegar desde el teléfono sea cómodo y obvio. El pedido original: "un rediseño moderno, fachero, con efectos, animaciones", para escritorio, tablet y celular, "que funcione bien navegar en el teléfono, que sea intuitivo".

La identidad elegida es la de una carta de navegación visual: papel claro y frío, tinta azul oscura, curvas de nivel tenues y una ruta magenta que une puntos. Es una evolución del sitio actual, no un reemplazo: se conservan las dos tipografías y el tono editorial.

## 2. Qué se decidió en la conversación

Esto lo pidió o lo aprobó el usuario sobre las maquetas:

1. Estilo "carta de navegación". Se descartaron cabina oscura, cielo en degradé, tablero de partidas y túnel de viento.
2. Nada de naranja.
3. Sobre la ruta de la portada viaja un avioncito visto desde arriba, no una flecha.
4. Los botones de la portada son grandes y se nota que son botones: píldora con borde de tinta, relieve abajo y flecha dentro de un círculo. Se hunden al apretarlos.
5. El teléfono usa las mismas piezas que el escritorio. Sin barra de navegación inferior: se rechazó de forma explícita.
6. En el teléfono, la portada no repite los enlaces en el encabezado, porque los tres botones ya son la navegación.
7. En el teléfono, dentro de una sección, el encabezado lleva un ícono chico (círculo con dos rayitas) que despliega un menú con las tres secciones. El ícono es discreto, no un botón con texto.

## 3. Alcance

Entra todo lo que se ve: tokens de color, encabezado, pie, portada, los tres índices (`/temas`, `/examenes`, `/ingles`), páginas de lectura (`/estudiar/[slug]`), práctica de exámenes (`/examenes/[slug]`), módulos de Inglés, `/camino`, páginas legales, 404 y offline, el diálogo de reporte y el aviso de instalación.

No entra:

- Contenido, textos, títulos y metadatos de SEO.
- La lógica de ejercicios, exámenes, progreso y audio.
- El interior de los diagramas de `StudyDiagram.astro`. Sus colores son semánticos (fuerzas, luces) y se quedan. Solo se revisa que su marco y fondo combinen con el papel nuevo.
- URLs, datos, analítica, Sentry, service worker salvo lo que pide la sección 9.
- Dependencias nuevas. Todo se hace con CSS, SVG en línea y JS propio, como hoy.

Lo que haría fracasar el trabajo aunque funcione:

- Que el teléfono y el escritorio parezcan dos sitios distintos.
- Navegación duplicada en una misma pantalla.
- Una barra de navegación fija abajo.
- Animación decorativa en las páginas de lectura que distraiga de leer.
- Que parezca generado: varios acentos de color, rayas largas en textos visibles, Title Case, emojis, rótulos en mayúsculas encima de cada título.
- Saltos de diseño al cargar o que la portada tarde más en mostrarse que hoy.

## 4. Sistema visual

### Color

Se mantienen los nombres de tokens de `src/styles/global.css` para no tocar cada regla; cambian los valores. Un solo acento: magenta. Los verdes y rojos de respuesta correcta o incorrecta se quedan porque son semánticos.

Claro (los cinco primeros salen de la maqueta; el resto es decisión mía, a ajustar a ojo):

| Token | Valor | Uso |
|---|---|---|
| `--paper` | `#f4f7f6` | fondo |
| `--ink` | `#12222e` | texto, bordes de botón, relieve |
| `--muted` | `#5a6b76` | texto secundario |
| `--accent` | `#b3196f` | ruta, marcadores, subrayado activo |
| `--relief` (nuevo) | `#b9cbd3` | curvas de nivel, bordes suaves |
| `--card` | `#fbfcfc` | superficies elevadas |
| `--graphite` | `#2c3e4a` | texto de lectura |
| `--ash` | `#6d7d87` | texto terciario |
| `--line` | `#d5e0e4` | divisores |
| `--taupe`, `--note`, `--blue-soft` | `#e9efee` | rellenos suaves |
| `--stone` | `#c9d6db` | bordes de campos |
| `--quiet` / `--quiet-hover` | `#e4ebea` / `#d8e2e1` | botones secundarios |
| `--action` / `--action-text` / `--action-hover` | `#12222e` / `#f4f7f6` / `#1d3445` | botón lleno |
| `--accent-ink` | `#fff` | texto sobre magenta |
| `--chart-blue` (nuevo) | `#2a6f9c` | rosa de los vientos y anillos punteados, solo decoración |

Oscuro, como carta nocturna (decisión mía entera, el usuario no vio maqueta oscura): `--paper #0e1a23`, `--card #14232e`, `--ink #eef3f4`, `--graphite #d3dde1`, `--muted #9db0ba`, `--ash #8499a4`, `--line #253744`, `--relief #2f4654`, `--taupe #172832`, `--stone #2f4654`, `--quiet #1b2e3a`, `--quiet-hover #243b49`, `--action #eef3f4`, `--action-text #0e1a23`, `--accent #ff6fb5`, `--accent-ink #0e1a23`, `--chart-blue #6fb2dc`. El tema por defecto sigue siendo el claro.

Todo par texto/fondo debe pasar contraste AA (4,5:1 en texto normal).

Actualizar también: `theme-color` y el script de tema en `BaseLayout.astro` (hoy `#fdfcfc` y `#1b1a18`), y `background_color` y `theme_color` de `public/manifest.webmanifest`.

### Tipografía

Sin cambios de familias: Newsreader para títulos, con la segunda línea en itálica donde ya existe, y Source Sans 3 para lectura y controles. Los archivos de `public/fonts` no se tocan.

### Fondo de carta

Un motivo de curvas de nivel en SVG, color `--relief`, trazo de 1 px.

- Portada: completo, con anillos de espacio aéreo y rosa de los vientos, como en la maqueta.
- Índices: solo en la franja del título.
- Lectura, práctica y módulos de Inglés: sin motivo detrás del texto. Como mucho, curvas muy tenues en la tarjeta de introducción del capítulo.

### Botones

Un solo lenguaje para todo el sitio, tomado de la maqueta:

- Principal ("tecla"): píldora, borde de 1,5 px en `--ink`, fondo `--paper`, relieve `box-shadow: 0 4px 0 var(--ink)`. Al pasar el cursor baja 2 px y el relieve se acorta; al apretar baja 4 px y el relieve desaparece. Cuando lleva a otra página, termina en un círculo `--ink` con flecha, que pasa a `--accent` al pasar el cursor.
- Secundario: misma forma, sin relieve, fondo `--quiet`.
- Se aplican a `.button-primary`, `.home-cta-primary`, `.button-light`, `.button-quiet`, `.library-copy-page` y a los botones equivalentes de Inglés y exámenes.
- Alto mínimo táctil: 44 px en todo control.

Las opciones de respuesta de los exámenes y los ejercicios de Inglés adoptan el borde y el radio nuevos y la misma respuesta al toque, pero sin relieve permanente, para que una lista de cuatro opciones no pese.

### Marcador de ruta

Un círculo de 10 a 12 px con borde `--accent` y relleno `--paper`. Es el único adorno repetido del sitio y siempre significa "punto de la ruta": puerta en la portada, sección en el menú, tema en un índice. Relleno de `--accent` cuando es el actual o está completo.

## 5. Encabezado y navegación

### Escritorio y tablet (desde 681 px)

Logo a la izquierda. A la derecha, Biblioteca, Exámenes e Inglés como enlaces de texto, y el interruptor de tema. El enlace activo y el que tiene el cursor llevan un subrayado magenta de 2 px que crece de izquierda a derecha. El encabezado sigue siendo fijo arriba.

### Teléfono (hasta 680 px)

- Portada: logo y un botón redondo de 34 px visibles (44 px de área táctil) para el tema. Sin enlaces.
- Resto de las páginas: logo y un botón redondo del mismo tamaño con dos rayitas. Al tocarlo las rayitas forman una cruz, el botón se llena de tinta y baja un panel anclado bajo el encabezado, con borde de tinta y relieve, que contiene:
  1. Biblioteca de teoría, Exámenes de ANAC, Inglés OACI, cada uno de 48 px de alto, con su marcador de ruta. La sección actual va con el marcador lleno y fondo suave.
  2. Una línea divisoria y la fila "Modo oscuro" con su interruptor (decisión mía: en el teléfono el tema vive dentro del menú, salvo en la portada).
- Detrás del panel, un velo oscuro sobre la página.
- Se cierra con el mismo botón, tocando el velo, con Escape o al elegir un enlace. `aria-expanded` en el botón, foco al primer enlace al abrir y de vuelta al botón al cerrar. El fondo no se desplaza mientras está abierto.
- Debe poder usarse sin JavaScript (decisión mía; `details`/`summary` o equivalente).
- Volver a la portada: tocando el logo, como hoy.

Esto reemplaza `SiteNav.astro` y la parte de encabezado de `visual-system.css`. El orden y los destinos de los enlaces no cambian.

### Índice lateral de la biblioteca

En escritorio se conserva la columna izquierda, con los estilos nuevos y el marcador de ruta en el tema actual. En teléfono y tablet angosta se conserva el botón "Índice" y su panel actual (`LibrarySidebar.astro`), con la piel nueva: mismo borde, relieve y velo que el menú de secciones, para que los dos paneles se sientan iguales.

## 6. Pantallas

### Portada

Como la maqueta `portada.html`.

- Escritorio y tablet: título arriba a la izquierda, bajada debajo, y la ruta magenta que sube de abajo a la izquierda hacia arriba a la derecha pasando por tres puntos. De cada punto cuelga un botón: Biblioteca de teoría, Exámenes de ANAC, Inglés OACI. Rosa de los vientos abajo a la derecha, anillos de espacio aéreo de fondo.
- Teléfono: título, bajada, la ruta cruzando una franja a media pantalla, y los tres botones a todo el ancho, apilados abajo.
- La escena es un SVG en línea dentro de `index.astro`. Tiene que escalar sin deformarse entre 681 px y pantallas anchas; los botones deben quedar anclados a sus puntos en todo ese rango. Cómo lograrlo queda a quien construya.
- El pie actual se mantiene, con los colores nuevos.

### Índices (`/temas`, `/examenes`, `/ingles`)

- Franja de título con curvas de nivel.
- Buscador en píldora.
- Las listas de temas se dibujan como una ruta (decisión mía, no se mostró en maqueta): una línea vertical magenta a la izquierda y un marcador por fila. En `/temas`, el marcador se llena cuando el tema está "listo" y queda a medio llenar cuando está "en curso", usando los atributos `data-study-current` que ya escribe `study-progress.js`. Esto reemplaza el "✓" y el "·" actuales tras el título.
- En `/examenes` y `/ingles` los marcadores van vacíos, salvo que ya exista un dato de avance guardado que se pueda leer sin tocar lógica (Inglés guarda progreso en `localStorage`; usarlo si es directo).
- Fila completa clicable, de 56 px de alto mínimo en teléfono, con fondo suave al pasar el cursor y una flecha que se desplaza.

### Lectura (`/estudiar/[slug]`)

Calma. Cambian colores, botones, tarjeta de introducción, notas, tablas y paginación entre capítulos. El índice del capítulo marca la sección actual con una barra magenta. Ninguna animación que no responda a una acción del lector.

### Práctica de exámenes (`/examenes/[slug]`)

Colores y botones nuevos. La barra de progreso pasa a magenta. Las opciones responden al toque. Verde y rojo de corrección se conservan, ajustados para que combinen con el papel frío y pasen contraste en los dos temas.

### Inglés

Los `english*.css` ya usan los tokens, así que heredan la mayor parte. Hay que recorrer cada módulo y corregir lo que quede con colores fijos o desentone. No se cambia la estructura de `EnglishPart` (Explicación arriba, Práctica abajo).

### Resto

`/camino`, términos, privacidad, 404, offline, `ReportDialog` e `InstallPrompt`: colores, botones y radios nuevos. El 404 y el offline pueden llevar el motivo de carta con una ruta que se corta (opcional, a criterio de quien construya).

## 7. Animación

Reglas:

- Curva y duraciones: se mantienen los tokens actuales (`--ease`, 150, 200 y 300 ms) para respuestas a acciones. Las entradas de la portada usan una curva con salida larga, como en la maqueta.
- Solo se animan `transform`, `opacity`, `clip-path` y propiedades de trazo de SVG.
- Con `prefers-reduced-motion: reduce` no corre ninguna animación y todo aparece en su estado final: ruta completa, botones visibles, avioncito quieto al final de la ruta o ausente. Ojo: `animateMotion` de SVG no obedece a la regla CSS global actual; hay que apagarlo aparte.

Qué se anima:

1. Portada, al cargar, una sola vez: la ruta se traza en unos 2,5 s, los botones aparecen de a uno a medida que la ruta llega a su punto, la rosa gira muy lento y el avioncito recorre la ruta en bucle.
2. Botones: hundirse al apretar, en todo el sitio.
3. Enlaces del encabezado: subrayado que crece.
4. Menú del teléfono y panel del índice: bajan con un leve cambio de escala; el ícono se transforma en cruz.
5. Cambio de página: transición cruzada corta entre documentos (`@view-transition { navigation: auto; }`), con el encabezado estable. Los navegadores sin soporte navegan como hoy.
6. Índices: al cargar, la línea de la ruta crece de arriba abajo una vez. Los marcadores se llenan con una transición breve cuando cambia el avance.
7. Exámenes y ejercicios: la respuesta elegida y la corrección entran con un cambio de color y una escala mínima; la barra de progreso avanza con transición.

Qué no se anima: apariciones al hacer scroll sección por sección, fondos en movimiento fuera de la portada, y nada dentro del texto de lectura.

## 8. Tamaños de pantalla

- Hasta 680 px: diseño de teléfono. Probar en 360 y 390 px de ancho.
- 681 a 1180 px: tablet. Encabezado de escritorio, portada de escritorio escalada, lectura a una columna con el índice del capítulo plegado, como hoy.
- Desde 1181 px: escritorio completo.

Se conservan los cortes actuales de `visual-system.css` (1180, 860, 680 px) salvo que estorben. Sin desplazamiento horizontal en ningún ancho desde 320 px. Respetar `env(safe-area-inset-*)` como hoy.

## 9. Restricciones técnicas

- Astro 6 y pnpm. Requiere Node 22.12 o superior; en esta máquina el Node por defecto es 20, hay que usar una versión más nueva de nvm para `pnpm dev`, `pnpm build` y `pnpm test`.
- CSS en `src/styles`, con tokens y sin dependencias nuevas. Los íconos siguen saliendo de `@animateicons/vanilla` donde ya se usan; los del menú y las flechas pueden ser CSS o SVG en línea.
- El service worker versiona por `BUILD_ID`, así que no hace falta tocarlo, salvo que se agreguen archivos estáticos nuevos que deban ir a `precachePages`.
- No se guardan datos nuevos en el navegador. Si eso cambiara, hay que actualizar `privacidad.astro`.
- Las convenciones de `docs/content-style-guide.md` siguen valiendo para cualquier texto de interfaz nuevo: voseo, sin emojis, sin rayas largas, mayúscula solo al inicio. Los únicos textos nuevos previstos son etiquetas accesibles ("Abrir el menú de secciones", "Cerrar el menú") y "Modo oscuro".
- No se hace commit ni push sin que el usuario lo pida.

## 10. Cómo se da por terminado

- `pnpm build` y `pnpm test` pasan.
- Revisión visual con capturas en 360, 390, 768, 1024 y 1440 px, en claro y oscuro, de: portada, `/temas`, un capítulo de `/estudiar`, `/examenes`, un examen en curso, `/ingles`, un módulo de Inglés, 404.
- La portada y el menú del teléfono coinciden con las maquetas.
- Todo el sitio se puede recorrer con teclado, con foco visible, y el menú del teléfono se abre, se recorre y se cierra con teclado.
- Con movimiento reducido activado, nada se mueve y no falta contenido.
- Sin desplazamiento horizontal en 320 px.

## 11. Queda a criterio de quien construya

- Cómo se parte el trabajo y en qué orden. Sugerencia: tokens y botones, encabezado y menú, portada, índices, lectura, exámenes, Inglés, resto, transiciones.
- Si el CSS nuevo vive en `visual-system.css` o se separa en archivos por pantalla.
- La geometría exacta del SVG de la portada y la técnica para anclar los botones.
- Los valores finos de los colores marcados como decisión mía, mientras pasen contraste y se vean como la maqueta.
- Cómo lograr que el menú funcione sin JavaScript.
