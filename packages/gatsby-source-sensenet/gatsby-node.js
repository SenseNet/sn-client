const fetch = require('node-fetch')
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

const BLOG_NODE_TYPE = `Blog`
let global_path = ''

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }, options) => {
  console.log(options)

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
    console.log('--------------------------------------------------')

    const data = await res.json()

    data.d.results.forEach((blog) => {
      const node = {
        ...blog,
        id: createNodeId(`Blog-${blog.Id}`),
        internal: {
          type: BLOG_NODE_TYPE,
          contentDigest: createContentDigest(blog),
        },
      }

      actions.createNode(node)
    })
  } catch (error) {
    console.log(error)
  }
}

exports.onCreateNode = async ({
  node, // the node that was just created
  actions: { createNode },
  createNodeId,
  getCache,
}) => {
  if (node.internal.type === BLOG_NODE_TYPE) {
    const fileNode = await createRemoteFileNode({
      // the url of the remote image to generate a node for
      url: 'https://images.unsplash.com/photo-1534432586043-ead5b99229fb',
      parentNodeId: node.Id.toString(),
      createNode,
      createNodeId,
      getCache,
    })
    if (fileNode) {
      node.remoteImage___NODE = fileNode.id
    }
  }
}
