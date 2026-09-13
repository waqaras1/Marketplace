import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        register: resolve(import.meta.dirname, 'register.html'),
        workspace: resolve(import.meta.dirname, 'workspace.html'),
      },
    },
  },
});

