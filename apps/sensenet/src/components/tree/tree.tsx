/* eslint-disable import/named */
import { ListItem, ListItemIcon, ListItemText, List as MuiList } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { AutoSizer, Index, List, ListRowProps } from 'react-virtualized'
import { useSelectionService } from '../../hooks'
import { ContentContextMenu } from '../context-menu/content-context-menu'
import { Icon } from '../Icon'

export type ItemType = GenericContent & {
  children?: ItemType[]
  expanded?: boolean
  hasNextPage?: boolean
}

type TreeProps = {
  itemCount: number
  isLoading: boolean
  loadMore: (startIndex: number, path?: string) => Promise<void>
  onItemClick: (item: GenericContent) => void
  treeData: ItemType
  setFormOpen?: () => void
}

const ROW_HEIGHT = 48
const LOAD_MORE_CLASS = 'loadMore'

export function Tree({ treeData, itemCount, onItemClick, loadMore, isLoading, setFormOpen }: TreeProps) {
  const listRef = useRef<List>(null)
  const loader = useRef(loadMore)
  const selectionService = useSelectionService()
  const [contextMenuAnchor, setContextMenuAnchor] = useState<HTMLElement | null>(null)
  const [elements, setElements] = useState<Element[]>()

  const observer = useRef(
    new IntersectionObserver(
      entries => {
        if (entries.length && entries.some(entry => entry.isIntersecting)) {
          const { path, startindex } = (entries[0].target as HTMLElement).dataset

          loader.current(parseInt(startindex ?? '0', 10), path)
        }
      },
      { threshold: 0 },
    ),
  )

  useEffect(() => {
    const currentObserver = observer.current
    elements?.forEach(element => currentObserver.observe(element))

    return () => {
      elements?.forEach(element => currentObserver.unobserve(element))
    }
  }, [elements])

  useEffect(() => {
    listRef.current?.recomputeRowHeights()
    listRef.current?.forceUpdate()
  }, [treeData])

  useEffect(() => {
    loader.current = loadMore
  }, [loadMore])

  const rowHeight = ({ index }: Index) => {
    if (!treeData.children?.[index]) {
      return ROW_HEIGHT
    }
    return getExpandedItemCount(treeData.children[index]) * ROW_HEIGHT
  }

  const getExpandedItemCount = (item: ItemType) => {
    let totalCount = 1

    if (item.expanded && item.children?.length) {
      totalCount += item.children.map(getExpandedItemCount).reduce((total, count) => {
        return total + count
      }, 0)
      if (item.hasNextPage) {
        totalCount++
      }
    }

    return totalCount
  }

  function renderItem(item: ItemType, keyPrefix: string, paddingLeft: number) {
    const onClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation()
      selectionService.activeContent.setValue(item)
      onItemClick(item)
      listRef.current?.recomputeRowHeights()
      listRef.current?.forceUpdate()
    }

    let children: ReactNode[] = []

    if (item.expanded && item.children) {
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

    if (item.hasNextPage && item.children && !isLoading) {
      const loadMoreEl = (
        <div
          className={LOAD_MORE_CLASS}
          key={LOAD_MORE_CLASS}
          data-startindex={item.children.length}
          data-path={item.Path}
        />
      )
      children.push(loadMoreEl)
    }
    children.unshift(nodeItem)

    return children
  }

  const rowRenderer = ({ key, style, index }: ListRowProps) => {
    if (!treeData.children?.[index]) {
      return (
        <ListItem
          style={style}
          key={index}
          className={LOAD_MORE_CLASS}
          data-startindex={treeData.children?.length}
          data-path={treeData.Path}>
          <ListItemText primary="Loading" />
        </ListItem>
      )
    }
    return (
      <MuiList key={key} style={style}>
        {renderItem(treeData.children?.[index], index.toString(), 10)}
      </MuiList>
    )
  }

  const setFormOpenFunc = () => {
    setFormOpen && setFormOpen()
  }

  return (
    <div
      style={{
        minWidth: '243px',
        flexGrow: 2,
        flexShrink: 0,
        borderRight: '1px solid rgba(128,128,128,.2)',
      }}>
      <AutoSizer>
        {({ width, height }) => (
          <List
            height={height}
            overscanRowCount={10}
            ref={listRef}
            rowHeight={rowHeight}
            onRowsRendered={() => {
              const loadMoreElements = document.getElementsByClassName(LOAD_MORE_CLASS)
              if (!loadMoreElements.length && !elements) {
                return
              }
              setElements([...loadMoreElements])
            }}
            rowRenderer={rowRenderer}
            rowCount={itemCount}
            width={width}
            style={{ outline: 'none' }}
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
          halfPage={true}
          setFormOpen={setFormOpenFunc}
        />
      ) : null}
    </div>
  )
}
