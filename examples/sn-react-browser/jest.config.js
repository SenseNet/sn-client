const base = require('../../jest.base.config')
const pack = require('./package')

module.exports = {
  ...base,
  displayName: pack.name,
  setupFilesAfterEnv: ['<rootDir>../../jest/setup.js'],
  moduleNameMapper: {
    ...base.moduleNameMapper,
    '\\.css$': '<rootDir>../../jest/cssTransform.js',
    '\\.(png|gif)$': '<rootDir>../../jest/fileTransform.js',
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
}
