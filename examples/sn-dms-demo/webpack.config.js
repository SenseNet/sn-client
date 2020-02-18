var path = require('path')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const autoprefixer = require('autoprefixer')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = {
  context: __dirname,
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: '/',
    path: path.resolve(__dirname + '/build'),
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true, // optional
        uglifyOptions: {
          keep_fnames: true, // don't minify names
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        commons: {
          minChunks: 2,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    runtimeChunk: true,
  },
  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  plugins: [
    new CheckerPlugin(),
    new CopyWebpackPlugin([
      {
        from: './public/*.*',
        to: './../',
      },
    ]),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG: true,
      REACT_APP_SERVICE_URL: 'https://dev.demo.sensenet.com',
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale/, /en-us/), // Bundle only english locale for moment
    // new BundleAnalyzerPlugin(),
  ],
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        options: {
          useTranspileModule: true,
          forceIsolatedModules: true,
          useCache: true,
        },
        loader: 'awesome-typescript-loader',
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: /reflect-metadata/,
      },

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
          {
            loader: require.resolve('postcss-loader'),
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebookincubator/create-react-app/issues/2677
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  // browsers: [
                  //   '>1%',
                  //   'last 4 versions',
                  //   'Firefox ESR',
                  //   'not ie < 9', // React doesn't support IE8 anyway
                  // ],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
        ],
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/images/[name].[hash:8].[ext]',
        },
      },
      {
        test: [/\.eot$/, /\.woff$/, /\.woff2$/, /\.ttf$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/fonts/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(ico)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
      {
        test: [/\.svg$/],
        loader: 'svg-url-loader',
        options: {
          // Images larger than 10 KB won’t be inlined
          limit: 10 * 1024,
          name: 'static/media/images/[name].[hash:8].[ext]',
          // Remove quotes around the encoded URL –
          // they’re rarely useful
          noquotes: true,
        },
      },
      {
        test: [/\.md$/],
        use: 'raw-loader',
      },
    ],
  },
}
