import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// vitest config — separate from defineConfig to avoid type conflict with tsc -b
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 框架核心单独一个 chunk（长期缓存）
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // 数据层单独一个 chunk（数据更新时才变）
          'vendor-data': [
            './src/data/generated/competitionResults.generated.ts',
            './src/data/manual/athletes.manual.ts',
            './src/data/manual/events.manual.ts',
          ],
        },
      },
    },
    // 生产构建移除 debugger 和 console
    target: 'es2020',
    minify: 'esbuild',
  },
  // @ts-ignore vitest test config
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
