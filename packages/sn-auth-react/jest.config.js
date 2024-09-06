const base = require('../../jest.base.config')
const pack = require('./package')

module.exports = {
  ...base,
  displayName: pack.name,
  setupFilesAfterEnv: ['<rootDir>../../jest/setup.js'],
  moduleNameMapper: {
    ...base.moduleNameMapper,
    '\\.css$': '<rootDir>../../jest/cssTransform.js',
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
  jest: {
    transformIgnorePatterns: [
      "node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"
    ]
  }
}
