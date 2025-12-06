import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Only inject the specific API key string, not the whole process.env object
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});