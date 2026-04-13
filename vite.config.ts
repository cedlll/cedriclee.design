import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const disbRoot = path.resolve(__dirname, 'src/prototypes/disb')
const ENTRY_CSS_RE = /<link rel="stylesheet"([^>]*href="\/assets\/index-[^"]+\.css"[^>]*)>/i

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'async-entry-stylesheet',
      transformIndexHtml(html) {
        return html.replace(
          ENTRY_CSS_RE,
          (_match, attrs) =>
            `<link rel="preload" as="style"${attrs} onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet"${attrs}></noscript>`,
        )
      },
    },
  ],
  resolve: {
    alias: [{ find: /^@disb\/(.+)$/, replacement: `${disbRoot}/$1` }],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
