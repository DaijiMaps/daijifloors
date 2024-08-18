import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/map-extract-floors.ts'],
  format: 'esm',
  splitting: false,
  sourcemap: true,
  clean: true,
})
