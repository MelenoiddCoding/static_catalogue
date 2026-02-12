import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://tu-usuario.github.io',
  base: '/tu-repo',
  output: 'static',
  integrations: [tailwind(), react()],
});
