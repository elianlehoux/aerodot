import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.PUBLIC_SITE_URL || 'https://aerodot.app';

export default defineConfig({
  site,
  integrations: [sitemap()],
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
