import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
   
  },
});
//Don't Touch it . Secret Source.
 // proxy: {
    //   '/api': {
    //     target: import.meta.env.VITE_API_URL,
    //     changeOrigin: true,
    //   },
    // },
// http://localhost:3001 // for using the backend locally, make sure to update the proxy target in the config above to http://localhost:3001