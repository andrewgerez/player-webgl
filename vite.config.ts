import { defineConfig } from 'vite'
import blitsVitePlugins from '@lightningjs/blits/vite'
import path from 'path'

export default defineConfig({
  plugins: [...blitsVitePlugins],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      assets: '/src/assets',
      constants: '/src/constants',
      enums: '/src/enums',
      fonts: '/src/fonts',
      routes: '/src/routes',
      store: '/src/store',
      structure: '/src/structure',
      styles: '/src/styles',
      theme: '/src/theme',
      test: '/src/test',
      utils: '/src/utils',
      mocks: '/src/mocks',
    },
  },
})
