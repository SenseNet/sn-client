const base = require('../../jest.base.config')
const pack = require('./package')

module.exports = {
  ...base,
  displayName: pack.name,
}
