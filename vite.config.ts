// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/30-day-vb-journal/',
  plugins: [react()],
});
