import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  const apiKey = process.env.API_KEY || env.API_KEY;

  console.log(`[Build] API_KEY Status: ${apiKey ? 'Present (Hidden)' : 'Missing'}`);

  return {
    plugins: [react()],
    define: {
      // Safely inject the API key. Default to empty string if missing to avoid undefined errors.
      'process.env.API_KEY': JSON.stringify(apiKey || "")
    }
  };
});