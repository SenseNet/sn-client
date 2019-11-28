var enzyme = require('enzyme')
var Adapter = require('enzyme-adapter-react-16')

require('./polyfills/MutationObserver.js')(global)
require('./polyfills/getSelection.js')(global)

enzyme.configure({ adapter: new Adapter() })
