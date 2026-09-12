import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Everything is bundled: there is no backend and no external request at runtime.
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // The sandbox preview reaches the dev server through a proxied host name.
    allowedHosts: true,
    hmr: { overlay: false },
  },
  preview: { host: '0.0.0.0', port: 4173, strictPort: true, allowedHosts: true },
  build: { outDir: 'dist', sourcemap: false },
});
