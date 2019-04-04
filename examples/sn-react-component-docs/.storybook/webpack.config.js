const path = require('path')

// tslint:disable-next-line: variable-name
const TsConfigWebpackPlugin = require('ts-config-webpack-plugin')
const DocgenPlugin = require('./docgen-plugin')

module.exports = ({ config }) => ({
  ...config,
  plugins: [new TsConfigWebpackPlugin(), new DocgenPlugin(), ...config.plugins],
  resolve: {
    ...config.resolve,
    symlinks: true,
    extensions: [...config.resolve.extensions, '.ts', '.tsx'],
  },
})
