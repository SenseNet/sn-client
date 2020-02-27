/* eslint-disable import/named */
import { ListItem, ListItemIcon, ListItemText, List as MuiList } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { AutoSizer, Index, List, ListRowProps } from 'react-virtualized'
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

export function Tree(props: TreeProps) {
  const listRef = useRef<List>(null)
  const selectionService = useSelectionService()
  const [contextMenuAnchor, setContextMenuAnchor] = useState<HTMLElement | null>(null)
  const repo = useRepository()
  const [items, setItems] = useState<GenericContent[]>()

  const rowHeight = ({ index }: Index) => {
    if (!items) {
      return 48
    }
    return getExpandedItemCount(items[index] as any) * 48
  }

  function renderItem(item: ItemType, keyPrefix: string, paddingLeft: number) {
    const onClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation()
      props.onItemClick(item)
      if (!item.expanded && !item.Children) {
        const ac = new AbortController()
        const result = await getContent(ac, item.Path)
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
      return <p>No items</p>
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
    async (ac: AbortController, path: string) => {
      return await repo.loadCollection<GenericContent>({
        path,
        requestInit: {
          signal: ac.signal,
        },
        oDataOptions: {
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
    async function getItems() {
      try {
        const children = await getContent(ac, props.parentPath)
        setItems(children.d.results)
      } catch (err) {
        if (!ac.signal.aborted) {
          console.log(err)
          // setError(err)
        }
      }
    }
    getItems()
    return () => ac.abort()
  }, [getContent, props.parentPath, repo])

  if (!items) {
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
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            overscanRowCount={10}
            ref={listRef}
            rowHeight={rowHeight}
            rowRenderer={rowRenderer}
            rowCount={items.length}
            width={width}
          />
        )}
      </AutoSizer>
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
