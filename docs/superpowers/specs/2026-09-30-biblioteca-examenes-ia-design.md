# Biblioteca + Exámenes — reorganización de IA

**Fecha:** 2026-09-30  
**Estado:** aprobado en conversación; pendiente revisión del archivo  
**Producto:** Altura (Astro)

## Problema

Hoy el acceso a práctica de examen está enterrado detrás de “Licencias → PPA”. La biblioteca y las rutas de estudio por licencia se mezclan. Quien quiere practicar el examen o consultar contenido de estudio no tiene un camino corto desde el landing.

## Objetivo

Separar claramente dos pilares:

1. **Biblioteca** — conocimiento aeronáutico por temas (sin “camino de estudio” PPA/PCA).
2. **Exámenes** — práctica por licencia argentina, con acceso directo desde el landing.

Inspirar la navegación de biblioteca en el concepto de shadcn `sidebar-03` (grupos + submenús), **sin instalar React ni shadcn**.

## Decisiones acordadas

| Tema | Decisión |
|---|---|
| Stack del sidebar | Astro + CSS + JS; concepto sidebar-03, no el componente |
| Landing CTAs | Dos al mismo nivel: Biblioteca y Practicar exámenes |
| Nav global | `Biblioteca` \| `Exámenes` (eliminar “Licencias”) |
| Rutas de estudio PPA/PCA | Eliminar como producto |
| Licencias en exámenes | Las 8 de la referencia (ver lista) |
| Bancos no PPA | Visible “Próximamente”; sin inventar cantidad de preguntas |
| Timer | Solo en simulacro de 100; cuenta **hacia arriba** (tiempo usado) |
| Contadores Correctas/Errores | En práctica en orden **y** en simulacro |
| Anti-slop | Reducir badges, eyebrows y microcopy ornamental |

## Arquitectura de rutas

### Nuevas / canónicas

| Ruta | Rol |
|---|---|
| `/` | Landing con dos CTAs |
| `/temas` | Hub de biblioteca + sidebar |
| `/estudiar/[slug]` | Tema de estudio + mismo sidebar |
| `/examenes` | Lista de 8 licencias |
| `/examenes/[slug]` | Una ruta dinámica: `ppa` = quiz; el resto = placeholder |

### Redirects / deprecación

| Antes | Después |
|---|---|
| `/practicar` | redirect → `/examenes/ppa` |
| `/licencias` | redirect → `/examenes` |
| `/licencias/ppa` | redirect → `/examenes/ppa` |

Las páginas de “ruta de estudio” dejan de ser destino de producto. El contenido de temas permanece en biblioteca.

## Licencias de examen (Argentina)

Orden de la lista en `/examenes`:

1. Piloto Privado de Avión (PPA) — **disponible** (banco actual)
2. Piloto Comercial de Avión (PCA) — próximamente
3. Piloto de Transporte de Línea Aérea (TLA) — próximamente
4. Instructor de Vuelo de Avión (IVA) — próximamente
5. Rehabilitación de Instructor de Vuelo de Avión (RIVA) — próximamente
6. Piloto de Planeador (PPL) — próximamente
7. Instructor de Vuelo de Helicóptero (IVH) — próximamente
8. Despachante de Aeronaves (DDA) — próximamente

PPA es un enlace activo a `/examenes/ppa`. El resto son filas no accionables (o enlace al placeholder) con texto simple “Próximamente”, sin pills ni cifras inventadas.

## Biblioteca — sidebar

### Dónde aparece

Layout compartido en `/temas` y `/estudiar/[slug]`.

### Estructura del menú

```
Biblioteca
├─ Vuelo y aeronave
│  ├─ Aerodinámica básica
│  ├─ Grupo motopropulsor
│  └─ Instrumentos de vuelo
├─ El entorno de vuelo
│  ├─ Meteorología
│  └─ Performance
└─ Operación y navegación
   ├─ Regulaciones
   ├─ Generalidades
   └─ Navegación
```

Los grupos usan los capítulos actuales de `ppa-course.js` (ids existentes), reencuadrados como biblioteca general, no como “ruta PPA”.

### Comportamiento

- Grupos expandibles / colapsables.
- Tema activo resaltado en `/estudiar/[slug]`.
- Separación clara hacia Exámenes (link a `/examenes`), sin mezclar estudiar y practicar en el mismo árbol de temas.
- Mobile: panel / drawer abierto desde control “Índice” (o equivalente corto).

### Implementación

Componente Astro reutilizable (p. ej. `LibrarySidebar.astro`) + estilos en CSS existente + JS mínimo para open/collapse y drawer. Sin dependencias nuevas de UI.

## Exámenes — flujo PPA

### Entrada `/examenes/ppa`

Dos modos explícitos:

1. **Practicar** — preguntas en orden (banco completo o por tema, según el selector actual si se mantiene útil).
2. **Examen de prueba** — 100 preguntas aleatorias con clave verificada (lógica actual de simulacro).

### UX del quiz

| Elemento | Práctica en orden | Examen 100 |
|---|---|---|
| Progreso “Pregunta X de N” | Sí | Sí |
| Barra de progreso | Sí | Sí |
| Correctas / Errores (en vivo) | Sí | Sí |
| Timer (mm:ss hacia arriba) | No | Sí |
| Feedback al responder | Sí (comportamiento actual) | Sí |

Al terminar el simulacro: resumen con puntuación, correctas, errores y tiempo total usado.

Reutilizar `practice.js` / banco `ppa-questions.json`; extender UI y estado del timer/contadores en lugar de reescribir el motor desde cero.

## Landing y copy

### Hero

- Título orientado a biblioteca abierta de aviación (sin empujar “ruta de licencia”).
- Dos CTAs iguales: Biblioteca / Practicar exámenes.
- Sin eyebrow/badge de relleno si no aporta.

### Principios / secciones secundarias

Simplificar o acortar: biblioteca vs práctica. Eliminar el mensaje de “seguí una ruta por licencia” como pilar.

### Anti-slop (aplicado en las pantallas tocadas)

- Reducir eyebrows, badges numerados, puntos decorativos y tiras de metadata no accionables.
- “Próximamente” como texto, no pill.
- Jerarquía: marca → título → una frase → CTA / lista.

No es un rediseño visual completo: se conserva la dirección estética del sitio y se recorta ruido.

## Datos y archivos tocados (orientativo)

- `src/pages/index.astro` — CTAs y copy
- `src/pages/temas.astro` — layout con sidebar; quitar CTA a rutas de licencia
- `src/pages/estudiar/[slug].astro` — sidebar; desacoplar framing “PPA ruta”
- `src/pages/examenes/index.astro` — lista de 8 licencias (nueva)
- `src/pages/examenes/[slug].astro` — quiz PPA + placeholders (nueva)
- `src/pages/practicar.astro` — redirect a `/examenes/ppa`
- `src/pages/licencias/*` — redirects a `/examenes` / `/examenes/ppa`
- `src/components/LibrarySidebar.astro` — nuevo
- `src/data/licenses.js` — catálogo de las 8 licencias (nuevo)
- `src/data/library-nav.js` — grupos del sidebar (nuevo o derivado de course data)
- `src/scripts/practice.js` — timer + contadores
- `src/styles/global.css` — sidebar, lista exámenes, quiz chrome

Fuera de alcance de este cambio: cargar bancos reales de PCA/TLA/etc.; autenticación; cuenta de usuario.

## Criterios de éxito

1. Desde el landing se llega a biblioteca y a exámenes en un clic.
2. No hace falta pasar por “ruta PPA” para practicar.
3. En biblioteca, el índice por áreas/temas es usable en desktop y mobile.
4. Solo PPA ofrece quiz; el resto comunica “Próximamente” sin cifras falsas.
5. Simulacro 100 muestra timer hacia arriba; ambos modos muestran Correctas/Errores.
6. Nav y copy ya no empujan “licencias / rutas de estudio” como producto principal.
7. Menos elementos tipo badge/slop en las pantallas modificadas.

## Testing manual

- Landing: ambos CTAs y nav.
- Biblioteca: expandir grupos, navegar a un tema, activo correcto, drawer mobile.
- Exámenes: lista de 8; PPA entra; otra licencia muestra placeholder.
- PPA práctica: contadores; sin timer.
- PPA simulacro: 100 preguntas, timer corre, contadores, resultado con tiempo.
- Redirects: `/practicar`, `/licencias`, `/licencias/ppa`.
- `npm run build` sin errores.
