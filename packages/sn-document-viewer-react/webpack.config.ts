import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import webpack from 'webpack'

// tslint:disable: variable-name
// tslint:disable: no-var-requires
const TsConfigWebpackPlugin = require('ts-config-webpack-plugin')
const ScssConfigWebpackPlugin = require('scss-config-webpack-plugin')
const AssetConfigWebpackPlugin = require('asset-config-webpack-plugin')

const config: webpack.Configuration = {
  mode: 'development',
  name: 'Dev config',
  entry: './example/example.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  devtool: 'eval-source-map',
  devServer: {
    historyApiFallback: true,
    open: true,
    contentBase: ['./example', './assets'],
  },
  plugins: [
    new TsConfigWebpackPlugin(),
    new ScssConfigWebpackPlugin(),
    new AssetConfigWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'example/index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],
  },
}

export default config
