/* eslint-disable import/named */
import { ListItem, ListItemIcon, ListItemText, List as MuiList } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { AutoSizer, Index, IndexRange, InfiniteLoader, List, ListRowProps } from 'react-virtualized'
import { Icon } from '../Icon'
import { ContentContextMenu } from '../context-menu/content-context-menu'
import { useSelectionService } from '../../hooks'

type ItemType = GenericContent & {
  Children: ItemType[]
  expanded: boolean
}

type TreeProps = {
  parentPath: string
  onItemClick: (item: GenericContent) => void
}

const ROW_HEIGHT = 48

export function Tree(props: TreeProps) {
  const listRef = useRef<List>()
  const selectionService = useSelectionService()
  const [contextMenuAnchor, setContextMenuAnchor] = useState<HTMLElement | null>(null)
  const repo = useRepository()
  const [items, setItems] = useState<GenericContent[]>()
  const [itemCount, setItemCount] = useState<number>()

  const rowHeight = ({ index }: Index) => {
    if (!items || !items[index]) {
      return ROW_HEIGHT
    }
    return getExpandedItemCount(items[index] as any) * ROW_HEIGHT
  }

  const isRowLoaded = ({ index }: Index) => {
    return !!items?.[index]
  }

  const loadMoreRows = async ({ startIndex, stopIndex }: IndexRange) => {
    const ac = new AbortController()
    const result = await getContent(ac, props.parentPath, stopIndex, startIndex)
    setItems(prevItems => {
      if (prevItems) {
        return [...prevItems, ...result.d.results]
      }
      return result.d.results
    })
  }

  function renderItem(item: ItemType, keyPrefix: string, paddingLeft: number) {
    const onClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation()
      props.onItemClick(item)
      if (!item.expanded && !item.Children) {
        const ac = new AbortController()
        // TODO: figure out how to load this lazily
        const result = await getContent(ac, item.Path, 100, 0)
        item.Children = result.d.results as any
      }
      item.expanded = !item.expanded
      listRef.current?.recomputeRowHeights()
      listRef.current?.forceUpdate()
    }

    let children: ReactNode[] = []

    if (item.expanded) {
      children = item.Children.map((child, index) => {
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
        button
        className="item">
        <ListItemIcon>
          <Icon item={item} />
        </ListItemIcon>
        <ListItemText primary={item.DisplayName} />
      </ListItem>
    )
    children.unshift(nodeItem)

    return children
  }

  const rowRenderer = ({ key, style, index }: ListRowProps) => {
    if (!items) {
      return (
        <p style={style} key={key}>
          Loading
        </p>
      )
    }
    const node = renderItem(items[index] as any, index.toString(), 0)
    return (
      <MuiList key={key} style={style}>
        {node}
      </MuiList>
    )
  }

  const getExpandedItemCount = (item: ItemType) => {
    let totalCount = 1

    if (item.expanded) {
      totalCount += item.Children.map(getExpandedItemCount).reduce((total, count) => {
        return total + count
      }, 0)
    }

    return totalCount
  }

  const getContent = useCallback(
    async (ac: AbortController, path: string, top: number, skip: number) => {
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
        overflow: 'auto',
      }}>
      <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={itemCount}>
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                onRowsRendered={onRowsRendered}
                overscanRowCount={10}
                ref={ref => {
                  registerChild(ref)
                  // ref type is List | null but listref.Current is List | undefined
                  listRef.current = ref as any
                }}
                rowHeight={rowHeight}
                rowRenderer={rowRenderer}
                rowCount={itemCount}
                width={width}
              />
            )}
          </AutoSizer>
        )}
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
