const path = require('path')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const webpack = require('webpack')

const packageSourceAliases = {
  '@sensenet/authentication-oidc-react$': path.resolve(
    __dirname,
    '../../packages/sn-authentication-oidc-react/src/index.ts',
  ),
  '@sensenet/client-core$': path.resolve(__dirname, '../../packages/sn-client-core/src/index.ts'),
  '@sensenet/client-utils$': path.resolve(__dirname, '../../packages/sn-client-utils/src/index.ts'),
  '@sensenet/control-mapper$': path.resolve(__dirname, '../../packages/sn-control-mapper/src/index.ts'),
  '@sensenet/controls-react$': path.resolve(__dirname, '../../packages/sn-controls-react/src/index.ts'),
  '@sensenet/default-content-types$': path.resolve(__dirname, '../../packages/sn-default-content-types/src/index.ts'),
  '@sensenet/document-viewer-react$': path.resolve(__dirname, '../../packages/sn-document-viewer-react/src/index.ts'),
  '@sensenet/editor-react$': path.resolve(__dirname, '../../packages/sn-editor-react/src/index.ts'),
  '@sensenet/hooks-react$': path.resolve(__dirname, '../../packages/sn-hooks-react/src/index.ts'),
  '@sensenet/icons-react$': path.resolve(__dirname, '../../packages/sn-icons-react/src/index.ts'),
  '@sensenet/list-controls-react$': path.resolve(
    __dirname,
    '../../packages/sn-list-controls-react/src/ContentList/index.ts',
  ),
  '@sensenet/pickers-react$': path.resolve(__dirname, '../../packages/sn-pickers-react/src/index.ts'),
  '@sensenet/query$': path.resolve(__dirname, '../../packages/sn-query/src/index.ts'),
  '@sensenet/repository-events$': path.resolve(__dirname, '../../packages/sn-repository-events/src/index.ts'),
  '@sensenet/search-react$': path.resolve(__dirname, '../../packages/sn-search-react/src/index.ts'),
  '@sensenet/sn-auth-react$': path.resolve(__dirname, '../../packages/sn-auth-react/src/index.ts'),
}

module.exports = {
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
  resolve: {
    alias: packageSourceAliases,
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.PNG$/, /\.svg$/, /\.eot$/, /\.woff$/, /\.woff2$/, /\.ttf$/],
        type: 'javascript/auto',
        loader: require.resolve('url-loader'),
        options: {
          esModule: false,
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
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new webpack.EnvironmentPlugin({
      APP_VERSION: require('./package.json').version,
      AUTH_TYPE: process.env.AUTH_TYPE || 'SNAuth', // Default to SNAuth if not specified
    }),
    new MonacoWebpackPlugin({
      languages: ['json', 'xml', 'html', 'javascript', 'markdown'],
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
