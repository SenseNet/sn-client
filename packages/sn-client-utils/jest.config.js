const pack = require('./package')

module.exports = {
  preset: 'ts-jest',
  displayName: pack.name,
  coveragePathIgnorePatterns: ['<rootDir>/test/*'],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.test.json',
      diagnostics: {
        warnOnly: !process.env.CI,
      },
    },
  },
}
