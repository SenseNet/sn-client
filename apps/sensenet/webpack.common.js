const path = require('path')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const webpack = require('webpack')
const gitRevisionPlugin = new GitRevisionPlugin()

module.exports = {
  entry: ['./src/index.tsx'],
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.PNG$/, /\.svg$/, /\.eot$/, /\.woff$/, /\.woff2$/, /\.ttf$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /.tsx?$/,
        use: [{ loader: 'ts-loader', options: { transpileOnly: true } }],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      GIT_VERSION: gitRevisionPlugin.version(),
      APP_VERSION: require('./package.json').version,
      GIT_COMMITHASH: gitRevisionPlugin.commithash(),
      GIT_BRANCH: gitRevisionPlugin.branch(),
    }),
    new MonacoWebpackPlugin({
      languages: ['javascript', 'json'],
    }),
  ],
}
