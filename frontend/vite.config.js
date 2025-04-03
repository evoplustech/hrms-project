import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    historyApiFallback: true,
    proxy:{      
      "/api":{
        target:"http://localhost:6500",
        changeOrigin: true,
        secure: true,
      }
    },
    // port: 8080,
    host: '0.0.0.0',
    // strictPort: true
  }
})
