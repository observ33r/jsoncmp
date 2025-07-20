import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

import { defineConfig } from 'rollup';

export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.mjs',
        format: 'esm'
      },
      {
        file: 'dist/index.cjs',
        format: 'cjs'
      }
    ],
    plugins: [
      terser(),
      resolve(),
      typescript({ tsconfig: './tsconfig.json', declaration: false })
    ],
    treeshake: true
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es'
    },
    plugins: [dts()],
    treeshake: false
  }
]);