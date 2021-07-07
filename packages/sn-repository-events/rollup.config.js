import { babel } from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

const extensions = ['.ts']

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/bundle.esm.min.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/bundle.min.js',
      format: 'umd',
      name: 'SnRepositoryEvents',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({ extensions }),
    babel({
      babelHelpers: 'bundled',
      include: ['src/**/*.ts'],
      extensions,
      exclude: /node_modules/,
    }),
    terser(),
  ],
}
