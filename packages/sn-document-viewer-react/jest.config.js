const pack = require('./package')
const base = require('../../jest.base.config')

module.exports = {
  ...base,
  displayName: pack.name,
  setupFilesAfterEnv: ['<rootDir>../../jest/setup.js'],
  transform: {
    '\\.gif$': '<rootDir>../../jest/fileTransform.js',
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
}
