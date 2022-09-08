import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
	plugins: [vue()],

  base: './',
  root: './src',

  resolve: {
    alias: {
      '@': __dirname,
    },
  },

  build: {
    outDir: '../docs',
    assetsDir: '.',
    emptyOutDir: true,
    manifest: true,

    rollupOptions: {
      output: {
        // dir: './docs/assets/',
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,

        manualChunks(file) {
          return 'index';
        },
      }
    },
  },

  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@import "/scss/mixin";\n`
  //     }
  //   }
  // },
  
  server: {
    port: 5000,
    host: '0.0.0.0',
  }
})
