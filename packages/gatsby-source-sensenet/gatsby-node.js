/* eslint-disable @typescript-eslint/no-var-requires */
const { createRemoteFileNode } = require('gatsby-source-filesystem')
const { defaultRepositoryConfiguration, ODataUrlBuilder } = require('@sensenet/client-core')
const fetch = require('node-fetch')

const BLOGPOST_NODE_TYPE = 'BlogPost'
const DEFAULT_PATH = '/Root/Content'

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }, options) => {
  const createTreeNode = async (parentNode, content) => {
    const newNode = {
      ...content,
      id: createNodeId(`${content.Type}-${content.Id}`),
      internal: {
        type: content.Type,
        contentDigest: createContentDigest(content),
        description: `${content.Type} node`,
      },
    }

    actions.createNode(newNode)
    actions.createParentChildLink({ parent: parentNode, child: newNode })

    try {
      const res = await fetch(`${options.host}/${defaultRepositoryConfiguration.oDataToken}${content.Path}`, {
        headers: {
          Authorization: `Bearer ${options.accessToken}`,
        },
        method: 'GET',
      })

      const data = await res.json()

      data.d.results.length > 0 &&
        data.d.results.forEach((childContent) => {
          createTreeNode(newNode, childContent)
        })
    } catch (error) {
      console.log(error)
    }
  }

  const path = options.path || DEFAULT_PATH

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
        type: 'root',
        contentDigest: createContentDigest('root'),
        description: `root node`,
      },
    }

    actions.createNode(rootNode)
    console.log('root:', rootNode.id)

    data.d.results.forEach((content) => {
      createTreeNode(rootNode, content)
    })
  } catch (error) {
    console.log(error)
  }
}

exports.onCreateNode = async ({ node, actions: { createNode }, createNodeId, getCache }, options) => {
  if (node.internal.type === BLOGPOST_NODE_TYPE) {
    const leadImageNode = await createRemoteFileNode({
      url: `${options.host}${node.LeadImage.Path}`,
      httpHeaders: { Authorization: `Bearer ${options.accessToken}` },
      parentNodeId: node.Id.toString(),
      createNode,
      createNodeId,
      getCache,
    })
    if (leadImageNode) {
      node.leadImage___NODE = leadImageNode.id
    }

    //create node for Body field
    const bodyMdxNode = {
      id: `${node.Id.toString()}-MarkdownBody`,
      parent: node.Id.toString(),
      internal: {
        type: `${node.internal.type}MarkdownBody`,
        mediaType: 'text/markdown',
        content: node.Body,
        contentDigest: node.Body,
      },
    }

    createNode(bodyMdxNode)

    if (bodyMdxNode) {
      node.markdownBody___NODE = bodyMdxNode.id
    }

    //create node for Lead field
    const leadMdxNode = {
      id: `${node.Id.toString()}-MarkdownLead`,
      parent: node.Id.toString(),
      internal: {
        type: `${node.internal.type}MarkdownLead`,
        mediaType: 'text/markdown',
        content: node.Lead,
        contentDigest: node.Lead,
      },
    }

    createNode(leadMdxNode)

    if (leadMdxNode) {
      node.markdownLead___NODE = leadMdxNode.id
    }
  }
}
