const base = require('../../jest.base.config')
const pack = require('./package')

module.exports = {
  ...base,
  displayName: pack.name,
  coveragePathIgnorePatterns: ['index.ts', '[eE]xample.*'],
  setupFilesAfterEnv: ['<rootDir>../../jest/setup.js'],
  moduleNameMapper: {
    ...base.moduleNameMapper,
    '\\.css$': '<rootDir>../../jest/cssTransform.js',
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
}
