const path = require('path')

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions

  switch (node.internal.type) {
    case 'sensenetBlogPost':
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

  const allSensenetBlogPost = await graphql(`
    {
      allSensenetBlogPost(limit: 1000) {
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

  if (allSensenetBlogPost.errors) {
    console.error(allSensenetBlogPost.errors)
    throw new Error(allSensenetBlogPost.errors)
  }

  const blogPostTemplate = path.resolve(`./src/templates/page.tsx`)

  allSensenetBlogPost.data.allSensenetBlogPost.edges.forEach(({ node }) => {
    const { slug } = node.fields

    createPage({
      path: `/${slug}/`,
      component: blogPostTemplate,
      context: {
        slug,
      },
    })
  })
}
