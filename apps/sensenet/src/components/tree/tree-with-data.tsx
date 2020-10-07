import { Content, ODataParams, ODataResponse } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { useLogger, useRepository, useRepositoryEvents } from '@sensenet/hooks-react'
import { Created } from '@sensenet/repository-events'
import React, { useCallback, useEffect, useState } from 'react'
import Semaphore from 'semaphore-async-await'
import { usePreviousValue, useSelectionService } from '../../hooks'
import { ItemType, Tree } from './tree'

type TreeWithDataProps = {
  onItemClick: (item: GenericContent) => void
  parentPath: string
  activeItemPath: string
  loadSettings?: ODataParams<GenericContent>
  onTreeLoadingChange?: (isLoading: boolean) => void
}

let lastRequest: { path: string; lastIndex: number } | undefined

const ITEM_THRESHOLD = 50

const walkTree = (node: ItemType, callBack: (node: ItemType) => void) => {
  if (node.children?.length) {
    node.children.forEach((child) => {
      callBack(child)
      walkTree(child, callBack)
    })
  }
}
const lock = new Semaphore(1)

export default function TreeWithData(props: TreeWithDataProps) {
  const repo = useRepository()
  const [itemCount, setItemCount] = useState(0)
  const [treeData, setTreeData] = useState<ItemType>()
  const [isLoading, setIsLoading] = useState(false)
  const selectionService = useSelectionService()
  const eventHub = useRepositoryEvents()
  const logger = useLogger('tree-with-data')

  const prevActiveItemPath = usePreviousValue(props.activeItemPath)
  const { onTreeLoadingChange } = props

  const loadCollection = useCallback(
    async (path: string, top: number, skip: number) => {
      const ac = new AbortController()
      onTreeLoadingChange?.(true)
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
            filter: 'IsFolder eq true',
            orderby: [
              ['DisplayName', 'asc'],
              ['Name', 'asc'],
            ],
          },
        })
        return result
      } catch (error) {
        if (!ac.signal.aborted) {
          logger.warning({ message: `Couldn't load content for ${path}`, data: error })
        }
      } finally {
        onTreeLoadingChange?.(false)
        setIsLoading(false)
      }
    },
    [logger, repo, onTreeLoadingChange],
  )

  useEffect(() => {
    if (prevActiveItemPath && prevActiveItemPath !== props.activeItemPath) {
      walkTree(treeData!, async (node: ItemType) => {
        if (node.Path === props.activeItemPath || PathHelper.isAncestorOf(node.Path, props.activeItemPath)) {
          if (!node.expanded && !node.children?.length && node.Type !== 'SmartFolder') {
            const children = await loadCollection(node.Path, ITEM_THRESHOLD, 0)
            if (children) {
              node.children = children.d.results
              node.hasNextPage = children.d.__count > node.children.length
            }
          }
          node.expanded = true
          setTreeData({ ...treeData! })
        }
      })
    }
  }, [props.activeItemPath, loadCollection, treeData, prevActiveItemPath])

  const openTree = useCallback(
    async (forced = false) => {
      if (!forced && treeData && treeData.Path === props.parentPath) return

      const buildTree = (items: GenericContent[], id?: number): any => {
        if (!id) {
          return { ...items[0], children: buildTree(items, items[0].Id), hasNextPage: false, expanded: true }
        }

        return items
          .filter((item) => item.ParentId === id)
          .map((item) => ({
            ...item,
            children: buildTree(items, item.Id),
            hasNextPage: false,
            expanded: items.some((treeNode) => treeNode.ParentId === item.Id) || props.activeItemPath === item.Path,
          }))
      }

      const treeResponse = await repo.executeAction<any, ODataResponse<{ results: GenericContent[] }>>({
        idOrPath: props.activeItemPath,
        name: 'OpenTree',
        method: 'GET',
        oDataOptions: props.loadSettings,
        body: {
          rootPath: props.parentPath,
          withSystem: true,
        },
      })

      const tree = buildTree(treeResponse.d.results)
      setItemCount(tree.children.length)
      setTreeData(tree)
    },
    [props.activeItemPath, props.parentPath, repo, treeData, props.loadSettings],
  )

  const loadMoreItems = useCallback(
    async (startIndex: number, path = props.parentPath) => {
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
        setTreeData((prevItem) => {
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
        walkTree(treeData!, (node) => {
          if (node.Path === path && node.children) {
            node.children = [...node.children, ...result.d.results]
            node.hasNextPage = result.d.__count > node.children.length
          }
        })
        setTreeData({ ...treeData! })
      }
    },
    [loadCollection, logger, props.parentPath, treeData],
  )

  const onDeleteContent = useCallback(
    async (content: Content) => {
      await lock.acquire()
      walkTree(treeData!, (node) => {
        if (node.Id === content.Id && treeData?.children?.length) {
          treeData.children = treeData.children.filter((n) => n.Id !== content.Id)
          setItemCount((itemCountTemp) => (itemCountTemp > 0 ? itemCountTemp - 1 : 0))
        } else if (PathHelper.trimSlashes(node.Path) === PathHelper.getParentPath(content.Path)) {
          node.children = node.children?.filter((n) => n.Id !== content.Id)
        }
      })
      setTreeData({ ...treeData! })
      lock.release()
    },
    [treeData],
  )

  useEffect(() => {
    const handleCreate = (c: Created) => {
      // we need to reset the lastRequest object so we can make the same request again to get updated data
      lastRequest = undefined
      if (
        treeData &&
        ((c.content as GenericContent).ParentId === treeData?.Id ||
          PathHelper.getParentPath(c.content.Path) === PathHelper.trimSlashes(treeData.Path))
      ) {
        openTree(true)
      } else {
        walkTree(treeData!, async (node) => {
          if (
            (c.content as GenericContent).ParentId === node.Id ||
            PathHelper.getParentPath(c.content.Path) === PathHelper.trimSlashes(node.Path)
          ) {
            const result = await loadCollection(node.Path, ITEM_THRESHOLD, 0)
            if (!result) {
              logger.debug({ message: `loadCollection failed to load from ${node.Path}` })
              return
            }
            node.children = result.d.results
            node.hasNextPage = result.d.__count > node.children.length
            setTreeData({ ...treeData! })
          }
        })
      }
    }

    const subscriptions = [
      eventHub.onContentCreated.subscribe(handleCreate),
      eventHub.onContentCopied.subscribe(handleCreate),
      eventHub.onContentMoved.subscribe(handleCreate),
      eventHub.onContentModified.subscribe(handleCreate),
      eventHub.onCustomActionExecuted.subscribe(async (event) => {
        if (event.actionOptions.name === 'Restore') {
          await lock.acquire()
          walkTree(treeData!, (node) => {
            if (node.Path === event.actionOptions.idOrPath && treeData?.children?.length) {
              treeData.children = treeData.children.filter((n) => n.Path !== event.actionOptions.idOrPath)
              setItemCount((itemCountTemp) => (itemCountTemp > 0 ? itemCountTemp - 1 : 0))
            } else if (PathHelper.trimSlashes(node.Path) === PathHelper.getParentPath(event.actionOptions.idOrPath)) {
              node.children = node.children?.filter((n) => n.Path !== event.actionOptions.idOrPath)
            }
          })
          setTreeData({ ...treeData! })
          lock.release()
        }
      }),
      eventHub.onContentDeleted.subscribe(async (d) => {
        onDeleteContent(d.contentData)
      }),
      eventHub.onBatchDelete.subscribe((deletedDatas) => {
        deletedDatas.contentDatas.forEach(async (d) => {
          onDeleteContent(d)
        })
      }),
    ]

    return () => subscriptions.forEach((s) => s.dispose())
  }, [
    treeData,
    eventHub.onBatchDelete,
    eventHub.onContentDeleted,
    eventHub.onContentCreated,
    eventHub.onContentCopied,
    eventHub.onContentMoved,
    eventHub.onContentModified,
    eventHub.onCustomActionExecuted,
    openTree,
    loadCollection,
    logger,
    onDeleteContent,
  ])

  useEffect(() => {
    openTree()
  }, [openTree])

  const onItemClick = async (item: ItemType) => {
    if (!treeData) {
      return
    }

    walkTree(treeData, async (node: ItemType) => {
      if (node.Id === item.Id) {
        if (!node.expanded && !node.children?.length && node.Type !== 'SmartFolder') {
          const children = await loadCollection(node.Path, ITEM_THRESHOLD, 0)
          if (children) {
            node.children = children.d.results
            node.hasNextPage = children.d.__count > node.children.length
          }
        }
        node.expanded = !node.expanded
        selectionService.activeContent.setValue(item)
        props.onItemClick(item)
        setTreeData({ ...treeData })
      }
    })
  }

  if (!itemCount || !treeData) {
    return null
  }

  return (
    <Tree
      activeItemPath={props.activeItemPath}
      itemCount={itemCount}
      treeData={treeData}
      loadMore={loadMoreItems}
      onItemClick={onItemClick}
      isLoading={isLoading}
    />
  )
}
