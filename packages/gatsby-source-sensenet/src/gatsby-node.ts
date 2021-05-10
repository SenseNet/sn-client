import { defaultRepositoryConfiguration, ODataParams, ODataUrlBuilder } from '@sensenet/client-core'
import { GatsbyNode, PluginOptions, SourceNodesArgs } from 'gatsby'
import fetch from 'node-fetch'
import { createTreeNode, snPrefix } from './utils'

const DEFAULT_PATH = '/Root/Content'

export interface PluginConfig extends PluginOptions {
  host: string
  path: string
  oDataOptions: ODataParams<any>
  accessToken: string
  level: number
}

export const sourceNodes: GatsbyNode['sourceNodes'] = async (
  { actions, createNodeId, createContentDigest }: SourceNodesArgs,
  options: PluginConfig,
) => {
  const path = options.path || DEFAULT_PATH
  console.log('PATH', path)

  try {
    const params = ODataUrlBuilder.buildUrlParamString(defaultRepositoryConfiguration, options.oDataOptions)
    console.log('REQUEST:', `${options.host}/${defaultRepositoryConfiguration.oDataToken}${path}?${params}`)

    const res = await fetch(`${options.host}/${defaultRepositoryConfiguration.oDataToken}${path}?${params}`, {
      headers: {
        Authorization: `Bearer ${options.accessToken}`,
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
    console.log('root:', rootNode.id)

    data.d.results.forEach((content: any) => {
      createTreeNode(rootNode, content, options.level, createNodeId, actions, createContentDigest, options)
    })
  } catch (error) {
    console.log(error)
  }
}
