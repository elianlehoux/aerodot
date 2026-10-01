import { defineConfig } from 'astro/config';

export default defineConfig({
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
