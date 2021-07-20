const path = require('path')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const webpack = require('webpack')

module.exports = {
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
          name: 'static/media/[name].[contenthash:8].[ext]',
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
      APP_VERSION: require('./package.json').version,
    }),
    new MonacoWebpackPlugin({
      languages: ['json', 'xml'],
      features: [
        '!accessibilityHelp',
        '!anchorSelect',
        '!bracketMatching',
        '!caretOperations',
        '!clipboard',
        '!codeAction',
        '!codelens',
        '!colorPicker',
        '!comment',
        '!contextmenu',
        '!coreCommands',
        '!cursorUndo',
        '!dnd',
        '!documentSymbols',
        '!folding',
        '!fontZoom',
        '!format',
        '!gotoError',
        '!gotoLine',
        '!gotoSymbol',
        '!iPadShowKeyboard',
        '!inPlaceReplace',
        '!indentation',
        '!inlayHints',
        '!inlineCompletions',
        '!inspectTokens',
        '!linesOperations',
        '!linkedEditing',
        '!links',
        '!multicursor',
        '!parameterHints',
        '!quickCommand',
        '!quickHelp',
        '!quickOutline',
        '!referenceSearch',
        '!rename',
        '!smartSelect',
        '!snippets',
        '!toggleHighContrast',
        '!toggleTabFocusMode',
        '!transpose',
        '!unusualLineTerminators',
        '!viewportSemanticTokens',
        '!wordHighlighter',
        '!wordOperations',
        '!wordPartOperations',
      ],
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
}
