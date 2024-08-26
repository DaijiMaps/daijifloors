import { defineConfig, loadEnv } from 'vite'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: mode === 'production' ? env.BASE_URL : `/`,
    build: {
      rollupOptions: {
        input: {
          main: `index.html`,
        },
      },
    },
    plugins: [mkcert()],
  }
})
