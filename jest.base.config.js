module.exports = {
  coveragePathIgnorePatterns: ['<rootDir>/test/*'],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.test.json',
      diagnostics: {
        warnOnly: !process.env.CI,
      },
    },
  },
  preset: 'ts-jest',
  transformIgnorePatterns: ['^.+\\.js$'],
}
