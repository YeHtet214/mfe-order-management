import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: 'order.mfe-server.test',
    port: 5176,
    strictPort: true,
    allowedHosts: ['order.mfe-server.test', 'product.mfe-server.test', 'auth.mfe-server.test', 'user.mfe-server.test'],
  }
})
