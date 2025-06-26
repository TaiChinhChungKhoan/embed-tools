import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
  // ESM build (main)
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs()
    ]
  },
  // ESM build (alternative)
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
  }
]; 