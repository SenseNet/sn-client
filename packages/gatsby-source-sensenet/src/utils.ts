import { defaultRepositoryConfiguration } from '@sensenet/client-core'
import { Actions } from 'gatsby'
import fetch from 'node-fetch'
import { PluginConfig } from './gatsby-node'
export const snPrefix = 'sensenet'

export const createTreeNode = async (
  parentNode: any,
  content: any,
  level: number,
  createNodeId: { (input: string): string; (arg0: string): any },
  actions: Actions,
  createContentDigest: { (input: string | object): string; (arg0: any): any },
  options: PluginConfig,
  token: string,
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
          Authorization: `Bearer ${token}`,
        },
        method: 'GET',
      })

      const data = await res.json()

      data.d.results.length > 0 &&
        data.d.results.forEach((childContent: any) => {
          createTreeNode(newNode, childContent, level - 1, createNodeId, actions, createContentDigest, options, token)
        })
    }
  } catch (error) {
    console.log(error)
  }
}
