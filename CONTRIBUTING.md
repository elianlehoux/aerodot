# Cómo colaborar

Aerodot es un sitio de estudio. Un error acá se puede memorizar para un examen, o peor, llevarse a un avión. Por eso las reglas de contenido son más estrictas que las de código.

Abrí un issue antes de un cambio grande. Para una corrección chica, un pull request alcanza.

## Reglas de contenido

1. No inventes normativa, procedimientos, velocidades, limitaciones ni números de una lista de emergencia. Si no podés citar la fuente, no lo agregues.
2. Una corrección de un dato que ya está tiene que decir qué fuente lo contradice: RAAC, resolución, AIP o la página de ANAC. Pegá el enlace en el pull request.
3. No cambies una fórmula para que “se entienda mejor” si el resultado deja de ser cierto.
4. Los bancos en `src/data/exam-banks/` y las figuras en `public/exam-figures/` reproducen cuestionarios públicos. No parafrasees el enunciado ni la opción. Solo se corrige un error de transcripción, contra el original, o se completa una clave cuando la fuente la muestra.
5. Las preguntas marcadas como material propio de estudio sí se pueden redactar. Tienen que seguir siendo material de estudio, no un examen oficial.
6. Las lecciones siguen [docs/content-style-guide.md](docs/content-style-guide.md): voseo, oraciones cortas, y sin tocar ids, slugs, orden de lecciones ni ids de diagramas.
7. No presentes el proyecto como parte de ANAC, de la FAA o de un centro de instrucción.
8. El texto que lee el alumno va en español rioplatense. El código nuevo sigue el estilo del archivo que estás tocando.

## Reglas de código

1. Un pull request, un tema. Sin refactors al pasar.
2. No subas `.env`, tokens, claves ni dumps de alumnos.
3. No agregues una cuenta, un pago ni una dependencia grande sin abrir antes un issue.
4. `npm run build` tiene que pasar.

## Cómo proponer el cambio

1. Forkeá el repositorio y creá una rama desde `main`.
2. Hacé el cambio.
3. Corré `npm run build`.
4. Abrí el pull request con qué cambió, por qué, y la fuente si tocaste un dato.

El maintainer revisa y mergea. Un pull request puede quedar esperando si falta la fuente o si el texto inventa un procedimiento.

## Qué no va en un pull request

- Reescribir un capítulo entero “de paso”.
- Traducir la interfaz al inglés.
- Cambiar la licencia o el aviso de material de terceros.
- Subir bancos que no sean cuestionarios ya publicados por ANAC, o preguntas propias sin marcarlo.

## Reportar

- Un dato mal o desactualizado: issue con la plantilla de contenido.
- El sitio se rompe: issue con la plantilla de error.
- Una vulnerabilidad: no abras un issue público. Escribí a elian.developer@gmail.com. Ver [SECURITY.md](SECURITY.md).
- Una duda de estudio que no es un error del sitio: una discusión.

## Conducta

[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
