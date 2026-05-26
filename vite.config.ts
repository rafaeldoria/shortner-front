import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || 'http://localhost:3100'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/auth': {
          target: apiUrl,
          changeOrigin: true,
        },
        '/url': {
          target: apiUrl,
          changeOrigin: true,
        },
      },
    },
  }
})
