import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        about: resolve(import.meta.dirname, 'about/index.html'),
        work: resolve(import.meta.dirname, 'work-with-naomi/index.html'),
        irreplaceable: resolve(import.meta.dirname, 'irreplaceable-advantage/index.html'),
        insights: resolve(import.meta.dirname, 'insights/index.html'),
        contact: resolve(import.meta.dirname, 'contact/index.html'),
        privacy: resolve(import.meta.dirname, 'privacy/index.html'),
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
