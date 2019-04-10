const TsConfigWebpackPlugin = require('ts-config-webpack-plugin')
const DocgenPlugin = require('./docgen-plugin')

module.exports = async ({ config }) => ({
  ...config,
  devtool: 'eval-source-map',
  plugins: [...config.plugins, new TsConfigWebpackPlugin(), new DocgenPlugin()],
  resolve: {
    ...config.resolve,
    extensions: [...(config.resolve.extensions || []), '.ts', '.tsx'],
  },
})
