import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const site = process.env.PUBLIC_SITE_URL || 'https://aerodot.app';

/** Páginas que quedan disponibles sin conexión desde la primera visita. */
const precachePages = ['/', '/examenes', '/camino', '/temas', '/offline'];

/**
 * Completa dist/sw.js después del build: un BUILD_ID nuevo (para que el navegador instale la
 * versión nueva) y la lista de precarga con las páginas base y los assets que esas páginas usan.
 */
const pwa = () => ({
  name: 'aerodot-pwa',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const outDir = fileURLToPath(dir);
      const assets = new Set();
      const hash = createHash('sha256');
      for (const page of precachePages) {
        const file = page === '/' ? 'index.html' : `${page.slice(1)}/index.html`;
        const html = await readFile(`${outDir}/${file}`, 'utf8');
        hash.update(html);
        for (const [, ref] of html.matchAll(/(?:href|src)="(\/(?:_assets|fonts)\/[^"#?]+)"/g)) assets.add(ref);
      }
      const precache = [...precachePages, ...[...assets].sort()];
      const swPath = `${outDir}/sw.js`;
      const source = await readFile(swPath, 'utf8');
      const buildId = hash.update(String(Date.now())).digest('hex').slice(0, 12);
      await writeFile(swPath, `self.__PRECACHE__ = ${JSON.stringify(precache)};\n${source.replace('__BUILD_ID__', buildId)}`);
      logger.info(`sw.js ${buildId}: ${precache.length} archivos de precarga`);
    },
  },
});

export default defineConfig({
  site,
  integrations: [
    sitemap({ filter: (page) => !page.includes('/offline') }),
    pwa(),
  ],
  output: 'static',
  build: {
    assets: '_assets',
  },
  redirects: {
    '/practicar': '/examenes/ppa',
    '/licencias': '/examenes',
    '/licencias/ppa': '/examenes/ppa',
    '/examenes/vfr-controlado': '/examenes/ppa',
    '/examenes/control-bienal-iva': '/examenes/iva',
    '/examenes/instructor-aerostato': '/examenes',
  },
});
