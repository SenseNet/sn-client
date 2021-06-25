import { defaultRepositoryConfiguration, ODataUrlBuilder } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { SourceNodesArgs } from 'gatsby'
import fetch from 'node-fetch'
import { PluginConfig } from './gatsby-node'

export const snPrefix = 'sensenet'
const DEFAULT_PATH = '/Root/Content'

export interface createTreeNodeParams {
  sourceNodesArgs: Pick<SourceNodesArgs, 'createNodeId' | 'createContentDigest' | 'actions'>
  options: PluginConfig
  token: string
  currentLevel: number
  parentNode?: any
  content?: any
}

export const createTreeNode = async ({
  sourceNodesArgs,
  options,
  token,
  currentLevel,
  parentNode,
  content,
}: createTreeNodeParams) => {
  let parent: any
  const originalPath = options.path || DEFAULT_PATH
  if (currentLevel === 0) {
    try {
      const params = ODataUrlBuilder.buildUrlParamString(defaultRepositoryConfiguration, options.oDataOptions)

      const rootPath = PathHelper.getContentUrlByPath(originalPath)
      const request = `${options.host}/${defaultRepositoryConfiguration.oDataToken}/${rootPath}?${params}`
      console.info('REQUEST SENT TO SENSENET:', request)
      const res = await fetch(request, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'GET',
      })

      const data = await res.json()
      const rootContent = data.d

      const rootNode = {
        ...rootContent,
        id: sourceNodesArgs.createNodeId(`${rootContent.Type}-${rootContent.Id}`),
        internal: {
          type: `${snPrefix}${rootContent.Type}`,
          contentDigest: sourceNodesArgs.createContentDigest(rootContent),
          description: `${rootContent.Type} node`,
        },
      }

      sourceNodesArgs.actions.createNode(rootNode)
      parent = rootNode
    } catch (error) {
      console.log(error)
    }
  } else {
    const newNode = {
      ...content,
      id: sourceNodesArgs.createNodeId!(`${content.Type}-${content.Id}`),
      internal: {
        type: `${snPrefix}${content.Type}`,
        contentDigest: sourceNodesArgs.createContentDigest!(content),
        description: `${content.Type} node`,
      },
      parent: parentNode.id,
    }

    sourceNodesArgs.actions.createNode(newNode)
    sourceNodesArgs.actions.createParentChildLink({ parent: parentNode, child: newNode })
    parent = newNode
  }

  try {
    if (options.level === undefined || currentLevel < options.level) {
      const params = ODataUrlBuilder.buildUrlParamString(defaultRepositoryConfiguration, options.oDataOptions)

      const request = `${options.host}/${defaultRepositoryConfiguration.oDataToken}${
        content ? content.Path : originalPath
      }?${params}`
      console.info('REQUEST SENT TO SENSENET:', request)
      const res = await fetch(request, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'GET',
      })

      const data = await res.json()

      data.d.results.length > 0 &&
        (await Promise.all(
          data.d.results.map(async (childContent: any) => {
            await createTreeNode({
              sourceNodesArgs,
              options,
              token,
              currentLevel: currentLevel + 1,
              parentNode: parent,
              content: childContent,
            })
          }),
        ))
    } else {
      return
    }
  } catch (error) {
    console.log(error)
  }
}
