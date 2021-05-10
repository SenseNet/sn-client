'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

exports.__esModule = true
exports.sourceNodes = void 0

var _clientCore = require('@sensenet/client-core')

var _nodeFetch = _interopRequireDefault(require('node-fetch'))

var _utils = require('./utils')

const DEFAULT_PATH = '/Root/Content'

const sourceNodes = async ({ actions, createNodeId, createContentDigest }, options) => {
  const path = options.path || DEFAULT_PATH
  console.log('PATH', path)

  try {
    const params = _clientCore.ODataUrlBuilder.buildUrlParamString(
      _clientCore.defaultRepositoryConfiguration,
      options.oDataOptions,
    )

    console.log('REQUEST:', `${options.host}/${_clientCore.defaultRepositoryConfiguration.oDataToken}${path}?${params}`)
    const res = await (0, _nodeFetch.default)(
      `${options.host}/${_clientCore.defaultRepositoryConfiguration.oDataToken}${path}?${params}`,
      {
        headers: {
          Authorization: `Bearer ${options.accessToken}`,
        },
        method: 'GET',
      },
    )
    const data = await res.json()
    const rootNode = {
      id: createNodeId('root'),
      internal: {
        content: '{{ Name: "root" }}',
        type: `${_utils.snPrefix}root`,
        contentDigest: createContentDigest('root'),
        description: `root node`,
      },
    }
    actions.createNode(rootNode)
    console.log('root:', rootNode.id)
    data.d.results.forEach((content) => {
      ;(0, _utils.createTreeNode)(rootNode, content, options.level, createNodeId, actions, createContentDigest, options)
    })
  } catch (error) {
    console.log(error)
  }
}

exports.sourceNodes = sourceNodes
//# sourceMappingURL=gatsby-node.js.map
