import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      "/api":{
        // target:"http://localhost:6500",
        target: 'https://hrms-project-backend.onrender.com', 
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      }
    },
    // port: 8080,
    host: '0.0.0.0', 
    // strictPort: true
  }
})
