import { defineConfig } from 'vite';

// base relativa: la app funciona en https://<usuario>.github.io/<repositorio>/ y en cualquier subcarpeta
export default defineConfig({
    base: './',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        chunkSizeWarningLimit: 1000,
    },
});
