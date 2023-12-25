import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteEslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteEslint(), svgr()],
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/hw-api': {
        target: 'https://iam.cn-north-4.myhuaweicloud.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hw-api/, '')
      },
      '/hw-tts-api': {
        target: 'https://sis-ext.cn-east-3.myhuaweicloud.com/v1/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hw-tts-api/, '')
      }
    }
  }
});
