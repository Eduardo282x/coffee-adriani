// Workaround: the native Rollup binding (@rollup/rollup-win32-x64-msvc) crashes
// with an access violation (0xC0000005) when processing large react-icons barrel
// files (e.g. react-icons/md/index.mjs) under pnpm's junctioned node_modules.
// Setting this before Rollup loads forces the WASM/JS fallback.
process.env.ROLLUP_SKIP_NATIVE_BINDING = '1'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  server: {
    proxy: {
      // El gateway de WebSocket del backend vive en /ws, no en /socket.io.
      // (En desarrollo el socket apunta a VITE_BASE_URL_API, esto cubre el caso relativo.)
      '/ws': {
        target: 'http://localhost:3002',
        ws: true
      }
    }
  }
})

