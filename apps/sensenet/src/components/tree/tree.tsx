import { ListItem, ListItemIcon, ListItemText, List as MuiList } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { AutoSizer, Index, List, ListRowProps } from 'react-virtualized'
import { ContentContextMenu } from '../context-menu/content-context-menu'
import { Icon } from '../Icon'

export type ItemType = GenericContent & {
  children?: ItemType[]
  expanded?: boolean
  hasNextPage?: boolean
}

type TreeProps = {
  activeItemPath: string
  itemCount: number
  isLoading: boolean
  loadMore: (startIndex: number, path?: string) => Promise<void>
  onItemClick: (item: GenericContent) => void
  treeData: ItemType
}

const ROW_HEIGHT = 47.93
const LOAD_MORE_CLASS = 'loadMore'
const MAXIMUM_AVAILABLE_SPACE = 268
const FONT_HEIGHT = 23.98
const SUM_VERTICAL_PADDING = 24

const calculateRowUsage = (text: string, availableSpace: number, fontWidth = 7.5) => {
  let rowCount = 1
  const words = text.split(' ')
  const whitespaceLength = 10
  let currentWidth = words[0].length * fontWidth + whitespaceLength

  for (let i = 0; i < words.length; i++) {
    //check if the next word will fit, the first will always fit
    const nextWord = words[i + 1]
    const isLastWord = i === words.length - 1

    if (nextWord) {
      const nextWordLength = nextWord.length

      if (currentWidth + nextWordLength * fontWidth <= availableSpace) {
        currentWidth += nextWordLength * fontWidth + (isLastWord ? 0 : whitespaceLength)

        continue
      }

      rowCount++
      currentWidth = nextWordLength * fontWidth + (isLastWord ? 0 : whitespaceLength)
    }
  }

  return rowCount
}

export function Tree({ treeData, itemCount, onItemClick, loadMore, isLoading, activeItemPath }: TreeProps) {
  const listRef = useRef<List>(null)
  const loader = useRef(loadMore)
  const [activeContent, setActiveContent] = useState<GenericContent>()
  const [contextMenuAnchor, setContextMenuAnchor] = useState<HTMLElement | null>(null)
  const [elements, setElements] = useState<Element[]>()
  const [rowHeight, setRowHeight] = useState(ROW_HEIGHT)

  const listItemRef = useCallback((node) => {
    if (node) {
      node.offsetHeight && setRowHeight(node.offsetHeight)
      listRef.current?.recomputeRowHeights()
      listRef.current?.forceUpdate()
    }
  }, [])

  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        if (entries.length && entries.some((entry) => entry.isIntersecting)) {
          const { path, startindex } = (entries[0].target as HTMLElement).dataset

          loader.current(parseInt(startindex ?? '0', 10), path)
        }
      },
      { threshold: 0 },
    ),
  )

  useEffect(() => {
    const currentObserver = observer.current
    elements?.forEach((element) => currentObserver.observe(element))

    return () => {
      elements?.forEach((element) => currentObserver.unobserve(element))
    }
  }, [elements])

  useEffect(() => {
    listRef.current?.recomputeRowHeights()
    listRef.current?.forceUpdate()
  }, [treeData])

  useEffect(() => {
    loader.current = loadMore
  }, [loadMore])

  const rowHeightFunc = ({ index }: Index) => {
    if (!treeData.children?.[index]) {
      return rowHeight
    }

    return getRowHeight(treeData.children[index])
  }

  const getRowHeight = (item: ItemType) => {
    //get the current depth of the item

    let itemHeight = 0

    const currentDepth = item.Path.split('/').length - 4

    const currentAvailableSpace = MAXIMUM_AVAILABLE_SPACE - currentDepth * 20

    const calculateRow = calculateRowUsage(item.DisplayName ?? '', currentAvailableSpace)

    itemHeight += calculateRow * FONT_HEIGHT + SUM_VERTICAL_PADDING

    //calculate how many rows the item will take up

    if (item.expanded && item.children?.length) {
      item.children.forEach((child) => {
        itemHeight += getRowHeight(child)
      })
    }

    return itemHeight
  }

  function renderItem(item: ItemType, keyPrefix: string, paddingLeft: number) {
    const onClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation()
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
        ref={listItemRef}
        data-test={`menu-item-${item.DisplayName?.replace(/\s+/g, '-').toLowerCase()}`}
        onClick={onClick}
        onContextMenu={(ev) => {
          ev.preventDefault()
          setContextMenuAnchor(ev.currentTarget)
          setActiveContent(item)
        }}
        selected={activeItemPath === item.Path}
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

    console.log(style)
    return (
      <MuiList
        style={{
          paddingBottom: '0px',
          paddingTop: '0px',
        }}
        key={key}>
        {renderItem(treeData.children?.[index], index.toString(), 10)}
      </MuiList>
    )
  }

  return (
    <div
      style={{
        minWidth: '350px',
        maxWidth: '400px',
        flexGrow: 2,
        flexShrink: 0,
        borderRight: '1px solid rgba(128,128,128,.2)',
        overflow: 'scroll',
      }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            autoHeight
            width={width}
            overscanRowCount={10}
            ref={listRef}
            rowHeight={rowHeightFunc}
            onRowsRendered={() => {
              const loadMoreElements = document.getElementsByClassName(LOAD_MORE_CLASS)
              if (!loadMoreElements.length && !elements) {
                return
              }
              setElements([...loadMoreElements])
            }}
            rowRenderer={rowRenderer}
            rowCount={itemCount}
            style={{ outline: 'none' }}
          />
        )}
      </AutoSizer>
      {activeContent ? (
        <ContentContextMenu
          isOpened={!!contextMenuAnchor}
          content={activeContent}
          menuProps={{
            anchorEl: contextMenuAnchor,
            BackdropProps: {
              onClick: () => setContextMenuAnchor(null),
              onContextMenu: (ev) => ev.preventDefault(),
            },
          }}
          onClose={() => setContextMenuAnchor(null)}
        />
      ) : null}
    </div>
  )
}
