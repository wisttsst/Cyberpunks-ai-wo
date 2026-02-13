import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'virtual-tailwind-shim',
      resolveId(id) {
        // Create virtual modules for tailwind and native bindings
        if (id === '@tailwindcss/oxide' || 
            id === '@tailwindcss/vite' || 
            id === '@tailwindcss/node' ||
            id === 'lightningcss' ||
            id.includes('lightningcss') ||
            id.includes('@tailwindcss/oxide') ||
            id.endsWith('.node')) {
          return '\0virtual:' + id
        }
      },
      load(id) {
        // Return empty/stub implementations
        if (id.startsWith('\0virtual:')) {
          return 'export default {}; export const version = "0.0.0";'
        }
      }
    }
  ],
  optimizeDeps: {
    exclude: ['@tailwindcss/oxide', '@tailwindcss/vite', '@tailwindcss/node', 'lightningcss', '@tailwindcss/oxide-win32-x64-msvc', 'rollup']
  },
  build: {
    rollupOptions: {
      external: (id) => {
        return id.includes('@tailwindcss') || id.includes('lightningcss') || id.endsWith('.node')
      },
      output: {
        manualChunks: undefined
      }
    },
    minify: false
  }
})
