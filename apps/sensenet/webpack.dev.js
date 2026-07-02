const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { customizeArray, mergeWithCustomize } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = (env) => {
  const disableDevReload = process.env.DISABLE_DEV_RELOAD === 'true'
  const clientWebSocketURL = process.env.WEBPACK_DEV_SERVER_CLIENT_WEB_SOCKET_URL || 'auto://0.0.0.0:0/ws'

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
      hot: disableDevReload ? false : 'only',
      liveReload: !disableDevReload,
      open: true,
      allowedHosts: process.env.ALLOWED_HOSTS || 'auto',
      client: {
        webSocketURL: clientWebSocketURL,
      },
    },
    output: {
      filename: 'static/js/[name].js',
      chunkFilename: 'static/js/[name].chunk.js',
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        eslint: { enabled: true, files: './src/**/*.{ts,tsx,js,jsx}' },
        issue: {
          include: [{ file: 'src/**/*' }],
        },
        typescript: {
          configOverwrite: {
            compilerOptions: {
              rootDir: '../..',
            },
            references: [],
          },
        },
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
