const path = require('path')

// tslint:disable-next-line: variable-name
const TsConfigWebpackPlugin = require('ts-config-webpack-plugin')
const DocgenPlugin = require('./docgen-plugin')

const config = {
  plugins: [new TsConfigWebpackPlugin(), new DocgenPlugin()],
  resolve: {
    symlinks: true,
    extensions: ['.ts', '.tsx'],
  },
}

module.exports = config
