import React, { useCallback, useEffect, useState } from 'react'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { GenericContent } from '@sensenet/default-content-types'
import { FullScreenLoader } from '../FullScreenLoader'
import { ItemType, Tree } from './tree'

type TreeWithDataProps = {
  onItemClick: (item: GenericContent) => void
  parentPath: string
}

let lastRequest: { path: string; lastIndex: number } | undefined

const ITEM_THRESHOLD = 50

export default function TreeWithData(props: TreeWithDataProps) {
  const repo = useRepository()
  const [itemCount, setItemCount] = useState<number>()
  const [treeData, setTreeData] = useState<ItemType>()
  const [isLoading, setIsLoading] = useState(false)
  const logger = useLogger('tree-with-data')

  const loadCollection = useCallback(
    async (path: string, top: number, skip: number) => {
      const ac = new AbortController()
      setIsLoading(true)
      try {
        const result = await repo.loadCollection<GenericContent>({
          path,
          requestInit: {
            signal: ac.signal,
          },
          oDataOptions: {
            top,
            skip,
            orderby: [
              ['DisplayName', 'asc'],
              ['Name', 'asc'],
            ],
          },
        })
        setIsLoading(false)
        return result
      } catch (error) {
        if (!ac.signal.aborted) {
          logger.warning({ message: `Couldn't load content for ${path}`, data: error })
        }
        setIsLoading(false)
      }
    },
    [logger, repo],
  )

  useEffect(() => {
    async function getData() {
      const root = await repo.load({ idOrPath: props.parentPath })
      const result = await loadCollection(props.parentPath, ITEM_THRESHOLD, 0)

      if (!result) {
        logger.debug({ message: `loadCollection failed to load from ${props.parentPath}` })
        return
      }

      setTreeData({
        ...root.d,
        children: result.d.results,
        hasNextPage: result.d.__count > result.d.results.length,
        expanded: true,
      })
    }
    getData()
  }, [loadCollection, logger, props.parentPath, repo])

  /**
   * First thing we want to do is get the count for the collection
   * to let virtual list know about the height of its container
   */
  useEffect(() => {
    const ac = new AbortController()
    async function getItemCount() {
      try {
        const count = await repo.count({
          requestInit: {
            signal: ac.signal,
          },
          path: props.parentPath,
        })
        setItemCount(count)
      } catch (error) {
        if (!ac.signal.aborted) {
          logger.warning({ message: `Couldn't get the count for ${props.parentPath}`, data: error })
        }
      }
    }
    getItemCount()
    return () => ac.abort()
  }, [logger, props.parentPath, repo])

  const loadMoreItems = async (startIndex: number, path = props.parentPath) => {
    // Do not load duplicate request
    if (lastRequest?.lastIndex === startIndex && lastRequest.path === path) {
      return
    }
    lastRequest = { lastIndex: startIndex, path }
    const result = await loadCollection(path, ITEM_THRESHOLD, startIndex)

    if (!result) {
      logger.debug({ message: `loadCollection failed to load from ${props.parentPath}` })
      return
    }

    // load more items under root
    if (path === props.parentPath) {
      setTreeData(prevItem => {
        if (prevItem && prevItem.children) {
          return {
            ...prevItem,
            children: [...prevItem.children, ...result.d.results],
            hasNextPage: result.d.__count > result.d.results.length,
          }
        }
      })
    } else {
      // load more items under tree node
      walkTree(treeData!, node => {
        if (node.Path === path && node.children) {
          node.children = [...node.children, ...result.d.results]
          node.hasNextPage = result.d.__count > node.children.length
        }
      })
      setTreeData({ ...treeData! })
    }
  }

  const walkTree = (node: ItemType, callBack: (node: ItemType) => void) => {
    if (node.children?.length) {
      node.children.forEach(child => {
        callBack(child)
        walkTree(child, callBack)
      })
    }
  }

  const onItemClick = async (item: ItemType) => {
    // Do not expand File types, we don't want to show the Previews folder under it
    if (item.Type === 'File' || !treeData) {
      return
    }

    walkTree(treeData, async (node: ItemType) => {
      if (node.Id === item.Id) {
        if (!node.expanded && !node.children?.length) {
          const children = await loadCollection(node.Path, ITEM_THRESHOLD, 0)
          if (children) {
            node.children = children.d.results
            node.hasNextPage = children.d.__count > node.children.length
          }
        }
        node.expanded = !node.expanded
        props.onItemClick(item)
        setTreeData({ ...treeData })
      }
    })
  }

  if (!itemCount || !treeData) {
    return <FullScreenLoader />
  }

  return (
    <Tree
      itemCount={itemCount}
      treeData={treeData}
      loadMore={loadMoreItems}
      onItemClick={onItemClick}
      isLoading={isLoading}
    />
  )
}
