import {
  createStyles,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  List as MuiList,
  Tooltip,
} from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { AutoSizer, Index, List, ListRowProps } from 'react-virtualized'
import { usePersonalSettings } from '../../hooks'
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

const CHARACHTER_SPLIT = 10
export const getStringParts = (str: string, characterSplit = 10) => {
  return [str.slice(0, characterSplit * -1), str.slice(characterSplit * -1)]
}

const useStyles = makeStyles(() => {
  return createStyles({
    listItem: {
      '& .text-container': {
        display: 'flex',
        flexWrap: 'no-wrap',
        maxWidth: 'calc(100% - 56px)',
        flex: 1,
        '& .second span': {
          width: `${CHARACHTER_SPLIT}ch`,
          textWrap: 'nowrap',
        },
        '& .first': {
          maxWidth: 'calc(100% - 56px - 5ch)',
          '& span': {
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          },
        },
        '& > *': {
          display: 'inline-block',
          flex: 'unset',
        },
        '& .MuiTypography-root': {
          display: 'inherit',
        },
      },
    },
  })
})

const ROW_HEIGHT = 48
const LOAD_MORE_CLASS = 'loadMore'

export function Tree({ treeData, itemCount, onItemClick, loadMore, isLoading, activeItemPath }: TreeProps) {
  const listRef = useRef<List>(null)
  const loader = useRef(loadMore)
  const [activeContent, setActiveContent] = useState<GenericContent>()
  const [contextMenuAnchor, setContextMenuAnchor] = useState<HTMLElement | null>(null)
  const [elements, setElements] = useState<Element[]>()
  const [rowHeight, setRowHeight] = useState(ROW_HEIGHT)
  const classes = useStyles()
  const personalSettings = usePersonalSettings()

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
    return getExpandedItemCount(treeData.children[index]) * rowHeight
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
      onItemClick(item)
      listRef.current?.recomputeRowHeights()
      listRef.current?.forceUpdate()
    }

    let children: ReactNode[] = []

    if (item.expanded && item.children) {
      children = item.children.map((child, index) => {
        return renderItem(child, `${keyPrefix}-${index}`, paddingLeft + 12)
      })
    }

    //Convert the name to two parts in order to display ... in the middle
    const [firstPart, SecondPart] = getStringParts(
      personalSettings.preferDisplayName && item.DisplayName ? item.DisplayName : item.Name,
    )

    const nodeItem = (
      <Tooltip title={item.Name} key={keyPrefix} placement="bottom">
        <ListItem
          ref={listItemRef}
          className={classes.listItem}
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
          data-item-name={item.Name}
          button>
          <ListItemIcon style={{ minWidth: '32px' }}>
            <Icon item={item} />
          </ListItemIcon>
          <div className="text-container">
            <ListItemText primary={firstPart} className="first" />
            <ListItemText primary={SecondPart} className="second" />
          </div>
        </ListItem>
      </Tooltip>
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
      <MuiList key={key} style={{ ...style, padding: '0' }}>
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
      }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            width={width}
            overscanRowCount={11000}
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
