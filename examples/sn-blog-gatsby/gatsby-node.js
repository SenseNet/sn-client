const path = require('path')

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions

  switch (node.internal.type) {
    case 'Blog':
      createNodeField({
        node,
        name: 'slug',
        value: node.Name || '',
      })

      break
    default: //do nothing
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const allBlog = await graphql(`
    {
      allBlog(limit: 1000) {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `)

  if (allBlog.errors) {
    console.error(allBlog.errors)
    throw new Error(allBlog.errors)
  }

  const blogTemplate = path.resolve(`./src/templates/page.tsx`)

  allBlog.data.allBlog.edges.forEach(({ node }) => {
    const { slug } = node.fields

    createPage({
      path: `/${slug}/`,
      component: blogTemplate,
      context: {
        slug,
      },
    })
  })
}
