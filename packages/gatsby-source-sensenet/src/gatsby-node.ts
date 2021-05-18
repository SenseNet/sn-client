import { defaultRepositoryConfiguration, ODataParams, ODataUrlBuilder } from '@sensenet/client-core'
import { GatsbyNode, PluginOptions, SourceNodesArgs } from 'gatsby'
import fetch from 'node-fetch'
import { createTreeNode, snPrefix } from './utils'

const DEFAULT_PATH = '/Root/Content'

export interface PluginConfig extends PluginOptions {
  host: string
  path?: string
  oDataOptions?: ODataParams<any>
  accessToken: Function | string
  level?: number
}

export const sourceNodes: GatsbyNode['sourceNodes'] = async (
  { actions, createNodeId, createContentDigest }: SourceNodesArgs,
  options: PluginConfig,
) => {
  const path = options.path || DEFAULT_PATH
  const token = options.accessToken instanceof Function ? await options.accessToken() : options.accessToken

  try {
    const params = ODataUrlBuilder.buildUrlParamString(defaultRepositoryConfiguration, options.oDataOptions)
    console.log(
      'REQUEST SENT TO SENENET:',
      `${options.host}/${defaultRepositoryConfiguration.oDataToken}${path}?${params}`,
    )

    const res = await fetch(`${options.host}/${defaultRepositoryConfiguration.oDataToken}${path}?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    })

    const data = await res.json()

    const rootNode = {
      id: createNodeId('root'),
      internal: {
        content: '{{ Name: "root" }}',
        type: `${snPrefix}root`,
        contentDigest: createContentDigest('root'),
        description: `root node`,
      },
    }

    actions.createNode(rootNode)

    data.d.results.forEach((content: any) => {
      createTreeNode(rootNode, content, { createNodeId, actions, createContentDigest }, options, token)
    })
  } catch (error) {
    console.log(error)
  }
}
