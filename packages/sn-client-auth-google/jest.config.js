const pack = require('./package')
const base = require('../../jest.base.config')

module.exports = {
  ...base,
  displayName: pack.name,
}
