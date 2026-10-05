# Aerodot

Biblioteca abierta de aviación y práctica de exámenes por licencia, para quien se está formando en Argentina. Sin cuenta.

El sitio explica los temas y deja practicar con bancos de preguntas. No reemplaza la instrucción en un centro habilitado, el manual del avión ni la normativa vigente. No está afiliado ni avalado por ANAC ni por la FAA.

## Desarrollo

Hace falta Node 22.

```bash
npm install
cp .env.example .env
npm run dev
```

`.env` no se sube. Los valores de ejemplo alcanzan para levantar el sitio en local. PostHog solo recibe eventos si ponés un token real.

```bash
npm run build
```

Ese build es la verificación. No hay suite de tests.

## Dónde está cada cosa

| Qué | Dónde |
| --- | --- |
| Páginas | `src/pages/` |
| Lecciones de estudio | `src/data/ppa-course.js`, `src/data/handbook-lessons.js` |
| Catálogo de licencias | `src/data/licenses.js` |
| Bancos de preguntas | `src/data/exam-banks/` |
| Voz y formato de las lecciones | `docs/content-style-guide.md` |

## Colaborar

Las reglas están en [CONTRIBUTING.md](CONTRIBUTING.md). La conducta de la comunidad está en [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

Un dato normativo nuevo entra con la fuente al lado. Si la fuente no está, el dato no entra.

## Licencia

Código y textos originales: [MIT](LICENSE).

Cuestionarios y figuras de ANAC, handbooks de la FAA y la fuente Inter quedan fuera de esa licencia. El detalle está en [NOTICE](NOTICE).
