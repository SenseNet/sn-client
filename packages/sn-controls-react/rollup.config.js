import { babel } from '@rollup/plugin-babel'
import commonJS from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'

const extensions = ['.ts', '.tsx']

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/bundle.esm.min.js',
      format: 'esm',
      plugins: [],
      inlineDynamicImports: true,
    },
    {
      file: 'dist/bundle.min.js',
      format: 'umd',
      name: 'SnControls',
      globals: {
        react: 'React',
      },
      sourcemap: true,
      inlineDynamicImports: true,
    },
  ],
  plugins: [
    external(),
    postcss({
      plugins: [],
    }),
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
