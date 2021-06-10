import { ODataParams } from '@sensenet/client-core'
import { GatsbyNode, PluginOptions, SourceNodesArgs } from 'gatsby'

import { createTreeNode } from './utils'

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
  const token = options.accessToken instanceof Function ? await options.accessToken() : options.accessToken

  await createTreeNode({
    sourceNodesArgs: { createNodeId, actions, createContentDigest },
    options,
    token,
    currentLevel: 0,
    parentNode: undefined,
    content: undefined,
  })
}
