const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { customizeArray, mergeWithCustomize } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = (env) => {
  return mergeWithCustomize({
    customizeArray: customizeArray({
      entry: 'replace',
    }),
  })(common, {
    entry: env.coverage ? ['./instrumented/index.tsx'] : ['./src/index.tsx'],
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
      historyApiFallback: true,
      open: true,
    },
    output: {
      filename: 'static/js/bundle.js',
      chunkFilename: 'static/js/[name].chunk.js',
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        eslint: { enabled: true, files: './src/**/*.{ts,tsx,js,jsx}' },
      }),
      new HtmlWebpackPlugin({
        template: './index.html',
        favicon: './src/assets/favicon.ico',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
              },
            },
          ],
        },
      ],
    },
  })
}
