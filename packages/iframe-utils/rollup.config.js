import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default [
  // UMD build
  {
    input: 'src/index.js',
    output: {
      name: 'IframeUtils',
      file: 'dist/index.js',
      format: 'umd',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      terser()
    ]
  },
  // ESM build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs()
    ]
  },
  // Standalone iframe-resizer build
  {
    input: 'src/iframe-resizer.js',
    output: {
      name: 'IframeResizer',
      file: 'dist/iframe-resizer.js',
      format: 'umd',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      terser()
    ]
  }
]; 