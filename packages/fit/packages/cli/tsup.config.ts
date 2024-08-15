import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/daijifloors-fit-names.ts', 'src/daijifloors-fit-names-wide.ts'],
  format: 'esm',
  splitting: false,
  sourcemap: false,
  clean: true,
})
