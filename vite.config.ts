import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  base: '/solidjs-test/',
  server: {
    port: 5000,
  },
  build: {
    target: 'esnext',
  },
});
