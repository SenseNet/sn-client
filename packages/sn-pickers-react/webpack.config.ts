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
  entry: './src/example.tsx',
  devtool: 'eval-source-map',
  devServer: {
    hot: true,
    historyApiFallback: true,
    open: true,
  },
  plugins: [
    new TsConfigWebpackPlugin(),
    new ScssConfigWebpackPlugin(),
    new AssetConfigWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(eot|ttf)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
}

export default config
