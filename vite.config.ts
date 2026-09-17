import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Keep prerender and hydration identical across calendar-year boundaries.
  define: { 'import.meta.env.VITE_BUILD_YEAR': JSON.stringify(new Date().getFullYear()) },
})
