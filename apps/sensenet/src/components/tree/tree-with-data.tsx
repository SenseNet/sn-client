import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRepository } from '@sensenet/hooks-react'
import { GenericContent } from '@sensenet/default-content-types'
import Semaphore from 'semaphore-async-await'
import { ItemType, Tree } from './tree'

const mapContentToItemType = (content: GenericContent) => ({ children: [], ...content })

type TreeWithDataProps = {
  onItemClick: (item: GenericContent) => void
  parentPath: string
}

export default function TreeWithData(props: TreeWithDataProps) {
  const repo = useRepository()
  const [itemCount, setItemCount] = useState<number>()
  const [treeData, setTreeData] = useState<ItemType>()
  const [isLoading, setIsLoading] = useState(false)
  const lock = useRef(new Semaphore(1))

  const getContent = useCallback(
    async (path: string, top: number, skip: number) => {
      const ac = new AbortController()
      setIsLoading(true)
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
    },
    [repo],
  )

  useEffect(() => {
    async function getData() {
      const root = await repo.load({ idOrPath: props.parentPath })
      const result = await getContent(props.parentPath, 10, 0)

      setTreeData({
        ...root.d,
        children: result.d.results,
        hasNextPage: result.d.__count > result.d.results.length,
        expanded: true,
      })
    }
    getData()
  }, [getContent, props.parentPath, repo])

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
      } catch (err) {
        if (!ac.signal.aborted) {
          console.log(err)
          // setError(err)
        }
      }
    }
    getItemCount()
    return () => ac.abort()
  }, [props.parentPath, repo])

  const loadMoreItems = async (startIndex: number, path = props.parentPath) => {
    await lock.current.wait()
    const result = await getContent(path, 20, startIndex)
    lock.current.signal()
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
    if (item.Type === 'File' || !treeData) {
      return
    }

    walkTree(treeData, async (node: ItemType) => {
      if (node.Id === item.Id) {
        if (!node.expanded && !node.children?.length) {
          const children = await getContent(node.Path, 10, 0)
          node.children = children.d.results.map(mapContentToItemType)
          node.hasNextPage = children.d.__count > node.children.length
        }
        node.expanded = !node.expanded
        props.onItemClick(item)
        setTreeData({ ...treeData })
      }
    })
  }

  if (!itemCount || !treeData) {
    return <p>Loading...</p>
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
