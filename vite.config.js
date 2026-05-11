import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Base path:
 *   - For local dev and root deploys: leave VITE_BASE unset (defaults to "/").
 *   - For GitHub Pages project pages (https://<org>.github.io/<repo>/),
 *     the deploy workflow sets VITE_BASE to "/<repo>/" so all asset URLs
 *     resolve correctly under that subpath.
 *
 *   HashRouter is used app-side, so route paths don't need to change.
 */
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
  server: { port: 5173, open: true },
});
