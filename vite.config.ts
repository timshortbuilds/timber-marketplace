
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// Fix: Import cwd and env from node:process to resolve type errors in Vite config
import { cwd, env as processEnv } from 'node:process';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // Fix: Use imported cwd() instead of process.cwd() to satisfy TypeScript
  const env = loadEnv(mode, cwd(), '');

  return {
    plugins: [react()],
    // If you are deploying to https://<USERNAME>.github.io/<REPO>/, 
    // set base to '/<REPO>/'. If using a custom domain or Vercel, use '/'.
    // Fix: Use processEnv.NODE_ENV from direct import
    base: processEnv.NODE_ENV === 'production' ? './' : '/',
  };
});
