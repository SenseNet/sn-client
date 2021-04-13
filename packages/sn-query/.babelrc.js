const { BABEL_ENV } = process.env
const isBundling = BABEL_ENV === 'bundle'

const sharedPresets = ['@babel/typescript']

const shared = {
  presets: sharedPresets,
  plugins: [['@babel/plugin-proposal-class-properties', { loose: true }]],
}

!isBundling && shared.plugins.push('@babel/plugin-transform-runtime')

module.exports = {
  env: {
    esm: {
      ...shared,
      presets: [
        [
          '@babel/env',
          {
            targets: 'chrome 79, last 1 edge version, last 1 safari version, last 1 firefox version, node 14',
            modules: false,
          },
        ],
        ...sharedPresets,
      ],
      plugins: [...shared.plugins, 'babel-plugin-add-import-extension'],
    },
    bundle: {
      ...shared,
      presets: [
        [
          '@babel/env',
          {
            targets: '> 0.5%, last 2 versions, not dead, not IE 11',
          },
        ],
        ...sharedPresets,
      ],
    },
    cjs: {
      ...shared,
      presets: [
        [
          '@babel/env',
          {
            modules: 'commonjs',
            targets: {
              node: '10.0',
            },
          },
        ],
        ...sharedPresets,
      ],
    },
  },
}
