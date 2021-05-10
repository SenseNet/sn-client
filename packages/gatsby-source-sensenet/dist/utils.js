'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

exports.__esModule = true
exports.createTreeNode = exports.snPrefix = void 0

var _clientCore = require('@sensenet/client-core')

var _nodeFetch = _interopRequireDefault(require('node-fetch'))

const snPrefix = 'sensenet'
exports.snPrefix = snPrefix

const createTreeNode = async (parentNode, content, level, createNodeId, actions, createContentDigest, options) => {
  const newNode = {
    ...content,
    id: createNodeId(`${content.Type}-${content.Id}`),
    internal: {
      type: `${snPrefix}${content.Type}`,
      contentDigest: createContentDigest(content),
      description: `${content.Type} node`,
    },
  }
  actions.createNode(newNode)
  actions.createParentChildLink({
    parent: parentNode,
    child: newNode,
  })

  try {
    if ((level && level > 0) || !level) {
      const res = await (0, _nodeFetch.default)(
        `${options.host}/${_clientCore.defaultRepositoryConfiguration.oDataToken}${content.Path}`,
        {
          headers: {
            Authorization: `Bearer ${options.accessToken}`,
          },
          method: 'GET',
        },
      )
      const data = await res.json()
      data.d.results.length > 0 &&
        data.d.results.forEach((childContent) => {
          createTreeNode(newNode, childContent, level - 1, createNodeId, actions, createContentDigest, options)
        })
    }
  } catch (error) {
    console.log(error)
  }
}

exports.createTreeNode = createTreeNode
//# sourceMappingURL=utils.js.map
