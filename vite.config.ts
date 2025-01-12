import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      parse: 'parse/dist/parse.min.js'
    }
  },
  optimizeDeps: {
    include: ['parse']
  }
});