const fetch = require('node-fetch')
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

const BLOG_NODE_TYPE = `Blog`

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }, options) => {
  try {
    const res = await fetch(
      `${options.host}/odata.svc${options.path}?query=Type%3ABlogPost&$expand=LeadImage&metadata=no`,
      {
        headers: {
          Authorization: `Bearer ${options.accessToken}`,
        },
        method: 'GET',
      },
    )

    const data = await res.json()

    data.d.results.forEach((blog) => {
      const node = {
        ...blog,
        id: createNodeId(`Blog-${blog.Id}`),
        internal: {
          type: BLOG_NODE_TYPE,
          contentDigest: createContentDigest(blog),
          description: `Blog node`,
        },
      }

      actions.createNode(node)
    })
  } catch (error) {
    console.log(error)
  }
}

exports.onCreateNode = async ({ node, actions: { createNode }, createNodeId, getCache }, options) => {
  if (node.internal.type === BLOG_NODE_TYPE) {
    const imageNode = await createRemoteFileNode({
      url: `${options.host}${node.LeadImage.Path}`,
      httpHeaders: { Authorization: `Bearer ${options.accessToken}` },
      parentNodeId: node.Id.toString(),
      createNode,
      createNodeId,
      getCache,
    })
    if (imageNode) {
      node.remoteImage___NODE = imageNode.id
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
