import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.e2e-test.ts'],
    globals: true,
    setupFiles: ['./test/setup-e2e.ts'],
    teardownTimeout: 30000,
    hookTimeout: 30000,
    alias: {
      '@': './src',
      '@src': './src',
      '@test': './test',
    },
    root: './',
    environmentOptions: {
      processEnv: {
        NODE_ENV: 'test',
      },
    },
  },
  resolve: {
    alias: {
      '@': './src',
      '@src': './src',
      '@test': './test',
    },
  },
  plugins: [swc.vite()],
})
