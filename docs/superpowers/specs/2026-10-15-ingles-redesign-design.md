# Rediseño de la sección de Inglés — Spec

Fecha: 2026-10-15 · Estado: borrador para revisión

## 1. Objetivo
Que quien entra a Inglés aprenda **cómo se dicen las cosas en inglés** (frases, fraseología, vocabulario, escucha, relato), no que reaprenda teoría aeronáutica en español. Uso principal: **celular**.

Tres bloques, construidos por etapas con un motor de ejercicios compartido:

1. **Inglés aeronáutico** (módulos por situación).
2. **Entrenador de vocabulario por rol/tema** (flashcards + completar frase + repaso).
3. **Inglés general** (gramática y vocabulario por niveles A1–C1).

## 2. Principios
- Mobile-first: pulgar, tarjetas grandes, sin tablas anchas, teoría en tarjetas colapsables.
- Cada pantalla pide **producir o reconocer inglés** (escuchar, completar, ordenar, decir). La explicación en español es apoyo, no protagonista.
- **Contenido 100 % original.** Se escribe desde cero; las fuentes externas (curso, videos, PeakTalk, test-english.com) sirven solo de inspiración de estructura, temario y formatos. No se copian ni se parafrasean sus ejercicios, textos, listas o audios. Fuentes de hechos permitidas: documentos oficiales (OACI Doc 9432/4444, AIM/FAA, Skybrary) citados o reescritos con palabras propias.
- Audio: TTS propio (pipeline `say` + ffmpeg ya existente). Audios reales solo por **incrustación oficial de YouTube** con inicio/fin, o grabaciones de dominio público (p. ej. NTSB). Toda respuesta clave sobre audio real la verifica una persona de oído.
- Convenciones del repo: voseo, sin emojis, `lang="en"` en el inglés, hooks `data-*` con funciones `mount*`, CSS con tokens `var(--*)` y prefijo por módulo, sin dependencias nuevas, páginas nuevas en `precachePages`, actualizar `privacidad.astro` si se guarda algo nuevo.

## 3. Bloque 1 — Inglés aeronáutico
Orden de aprendizaje (cada módulo = una página `/ingles/<slug>`):

1. **Base**: survival kit (say again, spell, speak slower, what does X mean), números y alfabeto (se conserva y amplía), aeródromo (plano + frases), aeronave (se conserva), clima hablado (octas y combinador de fenómenos, simplificados, movidos acá).
2. **Comunicaciones**: ATIS (se conserva el dictado; suma comparación USA/ICAO, "spot the change", lectura en voz alta), clearance y readback (CRAFT por casillas, dictado, detección de errores de hearback), radio por fase de vuelo (las 22 tarjetas "Próximamente" actuales).
3. **Emergencias**: Aviate-Navigate-Communicate, constructor de Mayday/Pan Pan.
4. **Situación anormal**: vocabulario de accidentes e incidentes, relato en pasado, describí la foto, línea de tiempo de un incidente histórico.
5. **Comunicarla**: el mismo evento contado a ATC, a Operations y a pasajeros (PA), con pestañas y ejercicio de elegir la frase por público.
6. **Contá tu historia**: preguntas de entrevista como práctica final (opcional).

**Se elimina**: METAR, TAF, quiz código→significado, "Ponete a prueba" actual, "NOTAM y documentos" (los NOTAM sobreviven como frases dentro del ATIS). Sin simulador de examen.

Correcciones de paso: "Whisky/Whiskey", "inicial" para downwind (se mantiene "inicial"), `metres/kilometer`, `cursor-agent` fuera de dependencias de producción, `.playwright-mcp/` al `.gitignore`, precache de mp3 y soporte Range/206 en el service worker.

## 4. Bloque 2 — Entrenador de vocabulario
- Entrada por **rol** (piloto, tripulante de cabina, controlador, mantenimiento, operaciones de aeropuerto) y por **tema** (seguridad, navegación, emergencias, clima, comunicaciones, médico, servicio al pasajero, carga, operaciones en tierra, sistemas, regulaciones).
- Unidad = **término**: palabra/frase, audio, traducción, oración de ejemplo propia, nivel.
- Actividades: flashcard (tap para traducir; "aprendiendo" / "ya la sé"), completar la frase (hueco + audio), repaso espaciado simple (cajas de Leitner) y meta diaria.
- Progreso "aprendidos X/N" por curso, en `localStorage`.
- Empieza con **piloto**; los demás roles se suman en etapas posteriores.

## 5. Bloque 3 — Inglés general
- Niveles **A1, A2, B1, B2, C1**; dentro de cada uno, **módulos temáticos** (no lista plana de 40 títulos), con progreso visible por módulo.
- Cada lección: teoría en tarjetas colapsables (regla + ejemplos contrastados + diagrama SVG propio) y 3–4 series de ~10 ítems.
- Formatos: opción múltiple, hueco libre, desplegable en la oración, ordenar palabras, unir pares, verdadero/falso. Optimizados para toque.
- "Shorts" de pares confusos y errores típicos de hispanohablantes (say/tell, raise/rise…).
- Puentes a aviación: ejemplos y mini-práctica con contexto aeronáutico cuando encaje.
- Temario guiado por CEFR (ver informe de estructura en el scratchpad de la investigación); extensión orientativa: ~24 lecciones A1, ~28 A2, ~32 B1, ~30 B2, 12–15 C1.

## 6. Arquitectura
- **Motor de ejercicios genérico** (`src/scripts/exercises/`): un renderizador por tipo (`mcq`, `gap`, `dropdown`, `order`, `match`, `tf`, `dictation`, `say`) que consume un esquema JSON. Reemplaza los tres quices actuales y unifica `shuffle` y flip-cards.
- **Esquema de datos** en `src/data/`: lección → series → ítems tipados; términos con `{id, en, es, example, audio?, level, role[], topic}`; diálogos/clearances con turnos `{speaker, text, audio}`.
- **Progreso**: `localStorage` con clave versionada; migrar `aerodot:english-status`.
- **Audio**: `scripts/build-atis-audio.mjs` se generaliza a un script de build que lee los datos y genera mp3 con efecto de radio cuando corresponda.
- **Voz (por etapas)**: (1) grabar y comparar con el modelo, local, sin subir nada; (2) autoevaluación por checklist; (3) reconocimiento del navegador como mejora progresiva, avisado en `privacidad.astro`.
- `scripts/english.js` (1085 líneas) se parte por módulo a medida que se migra.

## 7. Etapas de construcción
1. Motor de ejercicios + esquema + migración de lo existente (números, ATIS, aeródromo, aeronave) y limpieza del clima.
2. Módulos aeronáuticos 1–3 (base, comunicaciones, emergencias) con contenido nuevo.
3. Módulos 4–6 (situación anormal, comunicarla, historia).
4. Entrenador de vocabulario (piloto).
5. Inglés general A1–A2, luego B1–C1.
6. Voz niveles 1–3 y demás roles de vocabulario.

Cada etapa tiene su propio plan de implementación.

## 8. Fuera de alcance
- Copiar o parafrasear contenido de PeakTalk, test-english.com, VocabularyPage, el manual del curso o videos de terceros.
- Simulador de examen ICAO.
- Cuentas de usuario o sincronización en servidor.

## 9. Pendientes abiertos
- Qué significa "label" en la lista de vocabulario de accidentes (preguntar a la profesora).
- Verificación de oído de cualquier audio real usado como clave de corrección.
- Páginas de vocabulario/gramática que el usuario va a compartir como inspiración.
