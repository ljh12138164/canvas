import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, './src/hono/index.ts'),
      name: 'api',
      fileName: 'api',
    },
  },
});
