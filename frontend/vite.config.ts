import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Necessário para expor a porta 5173 para fora do Docker
    port: 5173,
    watch: {
      usePolling: true, // Essencial para o hot-reload funcionar perfeitamente no WSL/Docker
    }
  }
})
