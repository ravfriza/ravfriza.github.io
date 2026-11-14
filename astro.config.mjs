// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig, fontProviders } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/** @type {import('astro').AstroIntegration} */
const mediaIdleDirective = {
  name: 'media-idle-directive',
  hooks: {
    'astro:config:setup': ({ addClientDirective }) => {
      addClientDirective({
        name: 'media-idle',
        entrypoint: fileURLToPath(new URL('./src/directives/media-idle.ts', import.meta.url)),
      });
    },
  },
};

// https://astro.build/config
export default defineConfig({
  site: 'https://ravfriza.github.io',

  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Schibsted Grotesk',
      cssVariable: '--font-schibsted',
      weights: ['400 900'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      weights: ['400'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['monospace'],
    },
  ],

  integrations: [react(), sitemap(), mediaIdleDirective],

  vite: {
    plugins: [tailwindcss()],
  },
});