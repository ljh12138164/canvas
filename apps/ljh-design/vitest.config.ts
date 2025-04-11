import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['**/public/**', '**/node_modules/**', '**/app/_components/ui/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/public/**',
        '**/node_modules/**',
        '**/app/_components/ui/**',
        '**/*.d.ts',
        '**/test/**',
        '**/vitest.config.ts',
        '**/next.config.ts',
        '**/tailwind.config.ts',
        'next-sitemap.config.js',
        '**/.next/**',
        '**/.env',
        '**/.env.local',
        '**/app/_store/editor.ts',
        '**/.env.development',
        '**/.env.production',
        '**/.env.test',
        '**/app/(pages)/**',
        '**/postcss.config.mjs',
        '**/app/error.tsx',
        '**/app/layout.tsx',
        '**/app/page.tsx',
        '**/app/not-found.tsx',
        '**/app/providers.tsx',
        '**/app/globals.css',
        '**/app/favicon.ico',
        '**/app/loading.tsx',
        '**/app/_components/EditComponents/**',
        '**/app/_database/**',
        '**/app/_hook/**',
        '**/app/_types/**',
        'test/setup.ts',
        '**/app/_components/Board/**',
        '**/app/_provide/',
        '**/app/_lib/font/**',
        '**/app/_lib/utils.ts',
        '**/app/_components/template/TemplateMain.tsx',
        '**/app/_lib/editor/**',
        '**/app/_components/Comand/**',
        '**/app/_components/Material/**',
        '**/app/_components/admin/**',
        '**/app/_components/Ai/**',
        '**/app/_components/Formue/**',
        '**/app/_components/Echarts/**',
        '**/app/_components/AdminEchart/**',
        '**/app/_components/Friend/**',
        '**/app/_components/Sign/SignIn.tsx',
        '**/app/_components/UserData/DataShow.tsx',
        '**/app/_components/UserData/UseCard.tsx',
        '**/app/_components/UserData/DesignCard.tsx',
      ],
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
