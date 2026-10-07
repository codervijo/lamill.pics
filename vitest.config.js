// vitest.config.js
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    // genai/ is the read-only pre-port source; its tests target TanStack.
    exclude: [...configDefaults.exclude, 'genai/**'],
  },
});
