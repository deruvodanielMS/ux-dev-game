import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,
    // Exclude E2E tests from Vitest (they use Playwright)
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**', '**/playwright-report/**', '**/test-results/**'],
    coverage: {
      provider: 'v8',
      reports: ['text', 'html'],
      exclude: ['src/types/**', 'src/**/*.d.ts', '**/e2e/**'],
    },
  },
});
