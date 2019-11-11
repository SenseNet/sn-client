const pack = require('./package')
const base = require('../../jest.base.config')

module.exports = {
  ...base,
  displayName: pack.name,
  coveragePathIgnorePatterns: ['index.ts', '[eE]xample.*'],
  setupFilesAfterEnv: ['<rootDir>../../jest/setup.js'],
  moduleNameMapper: {
    '\\.css$': '<rootDir>../../jest/cssTransform.js',
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
}
