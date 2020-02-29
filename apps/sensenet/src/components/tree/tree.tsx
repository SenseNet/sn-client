/* eslint-disable import/named */
import { ListItem, ListItemIcon, ListItemText, List as MuiList } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { AutoSizer, Index, IndexRange, InfiniteLoader, List, ListRowProps } from 'react-virtualized'
import { useSelectionService } from '../../hooks'
import { ContentContextMenu } from '../context-menu/content-context-menu'
import { Icon } from '../Icon'

type ItemType = GenericContent & {
  children: ItemType[]
  expanded?: boolean
  hasNextPage?: boolean
}

type TreeProps = {
  parentPath: string
  onItemClick: (item: GenericContent) => void
}

const ROW_HEIGHT = 48

export function Tree(props: TreeProps) {
  const listRef = useRef<List>(null)
  const selectionService = useSelectionService()
  const [contextMenuAnchor, setContextMenuAnchor] = useState<HTMLElement | null>(null)
  const repo = useRepository()
  const [items, setItems] = useState<ItemType[]>()
  const [itemCount, setItemCount] = useState<number>()

  const rowHeight = ({ index }: Index) => {
    if (!items || !items[index]) {
      return ROW_HEIGHT
    }
    return getExpandedItemCount(items[index]) * ROW_HEIGHT
  }

  const getExpandedItemCount = (item: ItemType) => {
    let totalCount = 1

    if (item.expanded) {
      totalCount += item.children.map(getExpandedItemCount).reduce((total, count) => {
        return total + count
      }, 0)
      if (item.hasNextPage) {
        totalCount++
      }
    }

    return totalCount
  }

  const isRowLoaded = ({ index }: Index) => {
    return !!items?.[index]
  }

  const loadMoreRows = async ({ startIndex, stopIndex }: IndexRange) => {
    const result = await getContent(props.parentPath, stopIndex, startIndex)
    setItems(prevItems => {
      if (prevItems) {
        return [...prevItems, ...result.d.results.map(mapContentToItemType)]
      }
      return result.d.results.map(mapContentToItemType)
    })
  }

  const mapContentToItemType = (content: GenericContent) => ({ children: [], ...content })

  function renderItem(item: ItemType, keyPrefix: string, paddingLeft: number) {
    const onClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation()
      props.onItemClick(item)
      if (item.Type === 'File') {
        return
      }
      if (!item.expanded && !item.children.length) {
        const result = await getContent(item.Path, 10, 0)
        item.children = result.d.results.map(mapContentToItemType)
        item.hasNextPage = result.d.__count > result.d.results.length
      }
      item.expanded = !item.expanded
      listRef.current?.recomputeRowHeights()
      listRef.current?.forceUpdate()
    }

    let children: ReactNode[] = []

    if (item.expanded) {
      children = item.children.map((child, index) => {
        return renderItem(child, `${keyPrefix}-${index}`, paddingLeft + 20)
      })
    }

    const nodeItem = (
      <ListItem
        onClick={onClick}
        onContextMenu={ev => {
          ev.preventDefault()
          selectionService.activeContent.setValue(item)
          setContextMenuAnchor(ev.currentTarget)
        }}
        selected={selectionService.activeContent.getValue()?.Id === item.Id}
        key={keyPrefix}
        style={{ paddingLeft }}
        button>
        <ListItemIcon>
          <Icon item={item} />
        </ListItemIcon>
        <ListItemText primary={item.DisplayName} />
      </ListItem>
    )

    if (item.hasNextPage && item.expanded) {
      const loadMore = (
        <ListItem
          button
          style={{ paddingLeft: paddingLeft + 20 }}
          onClick={async e => {
            e.stopPropagation()
            const result = await getContent(item.Path, 10, item.children.length)
            item.children = [...item.children, ...result.d.results.map(mapContentToItemType)]
            item.hasNextPage = result.d.results.length >= 10
            listRef.current?.recomputeRowHeights()
            listRef.current?.forceUpdate()
          }}>
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText primary="Load more" />
        </ListItem>
      )
      children.push(loadMore)
    }
    children.unshift(nodeItem)

    return children
  }

  const rowRenderer = ({ key, style, index }: ListRowProps) => {
    if (!items || !items[index]) {
      return (
        <p style={style} key={key}>
          Loading
        </p>
      )
    }

    return (
      <MuiList key={key} style={style}>
        {renderItem(items[index], index.toString(), 10)}
      </MuiList>
    )
  }

  const getContent = useCallback(
    async (path: string, top: number, skip: number) => {
      const ac = new AbortController()
      return await repo.loadCollection<GenericContent>({
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
    },
    [repo],
  )

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

  if (!itemCount) {
    return <p>Loading...</p>
  }

  return (
    <div
      style={{
        flexGrow: 2,
        flexShrink: 0,
        borderRight: '1px solid rgba(128,128,128,.2)',
      }}>
      <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={itemCount}>
        {({ onRowsRendered, registerChild }) => {
          registerChild(listRef.current)
          return (
            <AutoSizer>
              {({ width, height }) => (
                <List
                  height={height}
                  onRowsRendered={onRowsRendered}
                  overscanRowCount={10}
                  ref={listRef}
                  rowHeight={rowHeight}
                  rowRenderer={rowRenderer}
                  rowCount={itemCount}
                  width={width}
                />
              )}
            </AutoSizer>
          )
        }}
      </InfiniteLoader>
      {selectionService.activeContent.getValue() ? (
        <ContentContextMenu
          isOpened={!!contextMenuAnchor}
          content={selectionService.activeContent.getValue()!}
          menuProps={{
            anchorEl: contextMenuAnchor,
            BackdropProps: {
              onClick: () => setContextMenuAnchor(null),
              onContextMenu: ev => ev.preventDefault(),
            },
          }}
          onClose={() => setContextMenuAnchor(null)}
        />
      ) : null}
    </div>
  )
}
