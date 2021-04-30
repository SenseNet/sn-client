const path = require('path')

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions

  switch (node.internal.type) {
    case 'BlogPost':
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

  const allBlogPost = await graphql(`
    {
      allBlogPost(limit: 1000) {
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

  if (allBlogPost.errors) {
    console.error(allBlogPost.errors)
    throw new Error(allBlogPost.errors)
  }

  const blogPostTemplate = path.resolve(`./src/templates/page.tsx`)

  allBlogPost.data.allBlogPost.edges.forEach(({ node }) => {
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
