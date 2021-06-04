import { defaultRepositoryConfiguration, ODataUrlBuilder } from '@sensenet/client-core'
import { SourceNodesArgs } from 'gatsby'
import fetch from 'node-fetch'
import { PluginConfig } from './gatsby-node'

export const snPrefix = 'sensenet'

export const createTreeNode = async (
  parentNode: any,
  content: any,
  sourceNodesArgs: Pick<SourceNodesArgs, 'createNodeId' | 'createContentDigest' | 'actions'>,
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
    if (options.level === undefined || options.level > 0) {
      const params = ODataUrlBuilder.buildUrlParamString(defaultRepositoryConfiguration, options.oDataOptions)
      const request = `${options.host}/${defaultRepositoryConfiguration.oDataToken}${content.Path}?${params}`
      console.info('REQUEST SENT TO SENSENET:', request)
      const res = await fetch(request, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'GET',
      })

      const data = await res.json()

      data.d.results.length > 0 &&
        data.d.results.forEach((childContent: any) => {
          createTreeNode(
            newNode,
            childContent,
            sourceNodesArgs,
            { ...options, level: options.level ? options.level - 1 : undefined },
            token,
          )
        })
    } else {
      return
    }
  } catch (error) {
    console.log(error)
  }
}
