import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// `base` must match the GitHub Pages project path (/<repo>/) for production,
// but stay at '/' for local dev.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/sydney-gig-finder/' : '/',
  server: {
    open: true,
  },
}))
