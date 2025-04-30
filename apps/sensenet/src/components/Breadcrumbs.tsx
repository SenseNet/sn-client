import { Menu, MenuItem } from '@material-ui/core'
import MUIBreadcrumbs from '@material-ui/core/Breadcrumbs'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { MouseEvent, useEffect, useState } from 'react'
import { ContentContextMenu } from './context-menu/content-context-menu'
import CopyPath from './CopyPath'
import { DropFileArea } from './DropFileArea'

export interface BreadcrumbItem<T extends GenericContent> {
  url: string
  displayName: string
  title: string
  content: T
}

export interface BreadcrumbProps<T extends GenericContent> {
  items: Array<BreadcrumbItem<T>>
  onItemClick: (event: MouseEvent, item: any) => void
}

export interface BreadcrumbSeparatorProps {
  itemPath: string
  onItemClick: (event: MouseEvent, item: any) => void
}

export function BreadcrumbSeparator(props: BreadcrumbSeparatorProps) {
  const { itemPath, onItemClick } = props
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [siblings, setSiblings] = useState<any[]>([])
  const repo = useRepository()

  useEffect(() => {
    let isMounted = true
    const fetchSiblings = async () => {
      if (!itemPath) return
      try {
        const siblingsResult = await repo.loadCollection<GenericContent>({
          path: itemPath,
          oDataOptions: {
            select: ['Id', 'Path', 'Name'],
            orderby: 'Name',
            metadata: 'no',
          },
        })
        if (isMounted) {
          setSiblings(
            siblingsResult.d.results.map((s) => {
              return { content: s, DisplayName: s.DisplayName, Id: s.Id }
            }),
          )
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchSiblings()
    return () => {
      isMounted = false
    }
  }, [itemPath, repo])

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Button onClick={handleOpen} className="bread-crumb-button">
        /
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {siblings.map((sibling) => (
          <MenuItem
            key={sibling.Id}
            onClick={(ev) => {
              onItemClick(ev, sibling)
              handleClose()
            }}>
            {sibling.DisplayName}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export function Breadcrumbs<T extends GenericContent>(props: BreadcrumbProps<T>) {
  const [contextMenuItem, setContextMenuItem] = useState<GenericContent | null>(null)
  const [contextMenuAnchor, setContextMenuAnchor] = useState<HTMLElement | null>(null)
  const [isContextMenuOpened, setIsContextMenuOpened] = useState(false)

  return (
    <>
      <MUIBreadcrumbs maxItems={15} aria-label="breadcrumb" separator={null}>
        {props.items.map((item, index) => (
          <DropFileArea key={item.content.Id} parentContent={item.content} style={{ display: 'flex' }}>
            <Tooltip title={item.title}>
              <Button
                style={{ minWidth: '12px' }}
                data-test={`breadcrumb-item-${item.displayName.replace(/\s+/g, '-').toLowerCase()}`}
                aria-label={item.displayName}
                onClick={(ev) => props.onItemClick(ev, item)}
                onContextMenu={(ev) => {
                  setContextMenuItem(item.content)
                  setContextMenuAnchor(ev.currentTarget)
                  setIsContextMenuOpened(true)
                  ev.preventDefault()
                }}>
                <span style={{ textTransform: 'none', fontSize: '13px' }}>{item.displayName}</span>
              </Button>
            </Tooltip>
            {index < props.items.length - 1 && (
              <BreadcrumbSeparator itemPath={item.content.Path} onItemClick={props.onItemClick} />
            )}
          </DropFileArea>
        ))}
        <CopyPath copyText={props.items[props.items.length - 1].title} />
      </MUIBreadcrumbs>
      {contextMenuItem ? (
        <ContentContextMenu
          isOpened={isContextMenuOpened}
          content={contextMenuItem}
          menuProps={{
            anchorEl: contextMenuAnchor,
            BackdropProps: {
              onClick: () => setIsContextMenuOpened(false),
              onContextMenu: (ev) => ev.preventDefault(),
            },
          }}
          onClose={() => setIsContextMenuOpened(false)}
        />
      ) : null}
    </>
  )
}
