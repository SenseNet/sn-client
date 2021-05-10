/* eslint-disable @typescript-eslint/no-var-requires */
const { defaultRepositoryConfiguration, ODataUrlBuilder } = require('@sensenet/client-core')
const fetch = require('node-fetch')
const { createTreeNode } = require('./utils')

const DEFAULT_PATH = '/Root/Content'
const snPrefix = 'sensenet'

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }, options) => {
  const path = options.path || DEFAULT_PATH
  console.log('PATH', path)

  try {
    const params = ODataUrlBuilder.buildUrlParamString(defaultRepositoryConfiguration, options.oDataOptions)
    console.log('REQUEST:', `${options.host}/${defaultRepositoryConfiguration.oDataToken}${path}?${params}`)

    const res = await fetch(`${options.host}/${defaultRepositoryConfiguration.oDataToken}${path}?${params}`, {
      headers: {
        Authorization: `Bearer ${options.accessToken}`,
      },
      method: 'GET',
    })

    const data = await res.json()

    const rootNode = {
      id: createNodeId('root'),
      internal: {
        content: '{{ Name: "root" }}',
        type: `${snPrefix}root`,
        contentDigest: createContentDigest('root'),
        description: `root node`,
      },
    }

    actions.createNode(rootNode)
    console.log('root:', rootNode.id)

    data.d.results.forEach((content) => {
      createTreeNode(rootNode, content, options.level, createNodeId, actions, createContentDigest, options, snPrefix)
    })
  } catch (error) {
    console.log(error)
  }
}
