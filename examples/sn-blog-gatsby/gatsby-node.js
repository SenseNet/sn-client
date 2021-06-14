/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const spawn = require('cross-spawn')
const { createRemoteFileNode } = require('gatsby-source-filesystem')
const { repositoryUrl } = require('./configuration')

const BLOGPOST_NODE_TYPE = 'sensenetBlogPost'

exports.onPreInit = () => {
  spawn.sync('gatsby', ['clean'], { stdio: 'inherit' })
}

exports.onCreateNode = async ({
  node,
  actions: { createNode, createNodeField },
  createNodeId,
  getCache,
  createContentDigest,
}) => {
  if (node.internal.type === BLOGPOST_NODE_TYPE) {
    //create slug node field
    createNodeField({
      node,
      name: 'slug',
      value: node.Name || '',
    })

    //create node for LeadImage field
    const leadImageNode = await createRemoteFileNode({
      url: `${repositoryUrl}${node.LeadImage.Path}`,
      parentNodeId: node.Id.toString(),
      createNode,
      createNodeId,
      getCache,
    })

    node.leadImage___NODE = leadImageNode.id

    //create node for Body field
    const bodyMdxNode = {
      id: `${node.Id.toString()}-MarkdownBody`,
      parent: node.Id.toString(),
      internal: {
        type: `${node.internal.type}MarkdownBody`,
        mediaType: 'text/markdown',
        content: node.Body,
        contentDigest: createContentDigest(node.Body),
      },
    }

    createNode(bodyMdxNode)

    node.markdownBody___NODE = bodyMdxNode.id

    //create node for Lead field
    const leadMdxNode = {
      id: `${node.Id.toString()}-MarkdownLead`,
      parent: node.Id.toString(),
      internal: {
        type: `${node.internal.type}MarkdownLead`,
        mediaType: 'text/markdown',
        content: node.Lead,
        contentDigest: createContentDigest(node.Lead),
      },
    }

    createNode(leadMdxNode)

    node.markdownLead___NODE = leadMdxNode.id
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
