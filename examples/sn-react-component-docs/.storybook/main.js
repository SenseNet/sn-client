const DocgenPlugin = require('./docgen-plugin')

module.exports = {
  addons: ['@storybook/addon-a11y'],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
        },
      ],
    })
    config.resolve.extensions.push('.ts', '.tsx')
    config.plugins.push(new DocgenPlugin())
    return config
  },
}
