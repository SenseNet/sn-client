const pack = require('./package')

module.exports = {
  preset: 'ts-jest',
  displayName: pack.name,
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  coveragePathIgnorePatterns: ['<rootDir>/test/*'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.test.json',
      diagnostics: {
        warnOnly: !process.env.CI,
      },
    },
  },
}
