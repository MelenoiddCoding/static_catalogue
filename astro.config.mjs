import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://melenoiddcoding.github.io',
  base: '/static_catalogue',
  output: 'static',
  integrations: [tailwind(), react()],
});
