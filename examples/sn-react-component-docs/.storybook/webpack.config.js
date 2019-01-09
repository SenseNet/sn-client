const path = require('path')

/**
 * To extend the default Storybook 3 config, it is necessary to import it from
 * the @storybook/react package. Storybook 4 provides the default config as the
 * third parameter to this module's exported function.
 */
// const genDefaultConfig = require("@storybook/react/dist/server/config/defaults/webpack.config.js");

module.exports = (baseConfig, env, config /* Storybook 4 default config */) => {
  // Storybook 3 default config
  // const config = genDefaultConfig(baseConfig);

  config.module.rules.push(
    {
      test: /\.tsx?$/,
      exclude: [/\/node_modules\/(?!@sensenet\/d)/],
      use: [require.resolve('ts-loader'), require.resolve('react-docgen-typescript-loader')],
    },
    {
      test: /\.stories\.tsx?$/,
      loaders: [{ loader: require.resolve('@storybook/addon-storysource/loader'), options: { parser: 'typescript' } }],
      enforce: 'pre',
    },
  )

  config.optimization.minimize = false

  config.resolve.extensions.push('.ts', '.tsx')

  return config
}
