var path = require('path')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/example.tsx',
  output: {
    filename: 'bundle.js',
    publicPath: '/assets/',
    path: path.resolve(__dirname + '/bundle/assets'),
  },
  devServer: {
    publicPath: '/assets/',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          idHint: 'vendors',
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
    // new BundleAnalyzerPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'index.html',
          to: './../',
        },
        // {
        //     from: "assets",
        //     to: "./assets"
        // }
      ],
    }),
  ],
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: 'ts-loader' },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
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
              postcssOptions: {
                plugins: ['postcss-flexbugs-fixes'],
              },
            },
          },
        ],
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/, /\.eot$/, /\.woff$/, /\.woff2$/, /\.ttf$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[contenthash:8].[ext]',
        },
      },
    ],
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  // externals: {
  //    "react": "React",
  //    "react-dom": "ReactDOM"
  // },
}
