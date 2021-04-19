const fetch = require('node-fetch')

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }, options) => {
  console.log(options)

  try {
    const res = await fetch(`${options.host}/odata.svc${options.path}?query=Type%3ABlogPost`, {
      headers: {
        Authorization: `Bearer ${options.accessToken}`,
      },
      method: 'GET',
    })
    console.log('--------------------------------------------------')

    const data = await res.json()

    data.d.results.forEach((blog) => {
      console.log(blog.Name)
      const node = {
        ...blog,
        id: createNodeId(`Blog-${blog.Id}`),
        internal: {
          type: 'Blog',
          contentDigest: createContentDigest(blog),
        },
      }

      actions.createNode(node)
    })
  } catch (error) {
    console.log(error)
  }
}
