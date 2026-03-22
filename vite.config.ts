import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'product.laravel-api-for-microfrontend.test',
    port: 5175,
    strictPort: true,
    allowedHosts: ['product.laravel-api-for-microfrontend.test', 'auth.laravel-api-for-microfrontend.test', 'user.laravel-api-for-microfrontend.test'],
  }
})
