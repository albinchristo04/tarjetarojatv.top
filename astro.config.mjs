import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tarjetarojatv.top',
  output: 'static',
  build: {
    format: 'directory',
  },
  trailingSlash: 'always',
});

