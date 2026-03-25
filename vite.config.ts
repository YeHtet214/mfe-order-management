import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
  server: {
    host: 'order.laravel-api-for-microfrontend.test',
    port: 5176,
    strictPort: true,
    allowedHosts: ['order.laravel-api-for-microfrontend.test', 'product.laravel-api-for-microfrontend.test', 'auth.laravel-api-for-microfrontend.test', 'user.laravel-api-for-microfrontend.test'],
  }
})
