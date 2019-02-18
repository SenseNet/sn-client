const path = require('path')

// tslint:disable-next-line: variable-name
const TsConfigWebpackPlugin = require('ts-config-webpack-plugin')

const config = {
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['react-app', { flow: false, typescript: true }]],
            },
          },
          {
            loader: require.resolve('react-docgen-typescript-loader'),
          },
        ],
        include: [path.resolve(__dirname, '../stories')],
      },
      {
        test: /\.stories\.tsx?$/,
        loaders: [
          { loader: require.resolve('@storybook/addon-storysource/loader'), options: { parser: 'typescript' } },
        ],
        enforce: 'pre',
      },
    ],
  },
  plugins: [new TsConfigWebpackPlugin()],
  resolve: {
    symlinks: true,
    extensions: ['.ts', '.tsx'],
  },
}

module.exports = config
