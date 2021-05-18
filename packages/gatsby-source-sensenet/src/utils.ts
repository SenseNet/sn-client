import { defaultRepositoryConfiguration, ODataUrlBuilder } from '@sensenet/client-core'
import { SourceNodesArgs } from 'gatsby'
import fetch from 'node-fetch'
import { PluginConfig } from './gatsby-node'

export const snPrefix = 'sensenet'

export const createTreeNode = async (
  parentNode: any,
  content: any,
  sourceNodesArgs: Partial<SourceNodesArgs>,
  options: PluginConfig,
  token: string,
) => {
  const newNode = {
    ...content,
    id: sourceNodesArgs.createNodeId!(`${content.Type}-${content.Id}`),
    internal: {
      type: `${snPrefix}${content.Type}`,
      contentDigest: sourceNodesArgs.createContentDigest!(content),
      description: `${content.Type} node`,
    },
  }

  sourceNodesArgs.actions!.createNode(newNode)
  sourceNodesArgs.actions!.createParentChildLink({ parent: parentNode, child: newNode })

  try {
    if ((options.level && options.level > 0) || !options.level) {
      const params = ODataUrlBuilder.buildUrlParamString(defaultRepositoryConfiguration, options.oDataOptions)
      console.log(
        'REQUEST SENT TO SENENET:',
        `${options.host}/${defaultRepositoryConfiguration.oDataToken}${content.Path}?${params}`,
      )
      const res = await fetch(`${options.host}/${defaultRepositoryConfiguration.oDataToken}${content.Path}?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'GET',
      })

      const data = await res.json()

      data.d.results.length > 0 &&
        data.d.results.forEach((childContent: any) => {
          createTreeNode(newNode, childContent, sourceNodesArgs, options, token)
        })
    }
  } catch (error) {
    console.log(error)
  }
}
