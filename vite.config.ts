import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/journal-app/', // ✅ must match the folder on your WordPress site
  plugins: [react()],
});
