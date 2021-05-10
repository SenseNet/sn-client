/* eslint-disable @typescript-eslint/no-var-requires */
const { defaultRepositoryConfiguration } = require('@sensenet/client-core')
const fetch = require('node-fetch')

const createTreeNode = async (
  parentNode,
  content,
  level,
  createNodeId,
  actions,
  createContentDigest,
  options,
  snPrefix,
) => {
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
  actions.createParentChildLink({ parent: parentNode, child: newNode })

  try {
    if ((level && level > 0) || !level) {
      const res = await fetch(`${options.host}/${defaultRepositoryConfiguration.oDataToken}${content.Path}`, {
        headers: {
          Authorization: `Bearer ${options.accessToken}`,
        },
        method: 'GET',
      })

      const data = await res.json()

      data.d.results.length > 0 &&
        data.d.results.forEach((childContent) => {
          createTreeNode(
            newNode,
            childContent,
            level - 1,
            createNodeId,
            actions,
            createContentDigest,
            options,
            snPrefix,
          )
        })
    }
  } catch (error) {
    console.log(error)
  }
}

exports.createTreeNode = createTreeNode
