import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Allows import from "@/components/..."
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  publicDir: 'public', // Ensure public directory is served correctly
});

