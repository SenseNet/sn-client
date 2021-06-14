import { babel } from '@rollup/plugin-babel'
import commonJS from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import external from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'

const extensions = ['.ts', '.tsx']

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
      name: 'SnEditor',
      globals: {
        react: 'React',
      },
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    resolve({ extensions }),
    babel({
      babelHelpers: 'bundled',
      include: ['src/**/*.ts(x)?'],
      extensions,
      exclude: /node_modules/,
    }),
    commonJS(),
    terser(),
  ],
}
