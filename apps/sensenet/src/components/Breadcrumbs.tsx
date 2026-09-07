import { Menu, useTheme } from '@material-ui/core'
import MUIBreadcrumbs from '@material-ui/core/Breadcrumbs'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import ChevronRightOutlined from '@material-ui/icons/ChevronRightOutlined'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { CSSProperties, MouseEvent, useEffect, useState } from 'react'
import { useLocalization } from '../hooks'
import { contentDragAttributes } from './content/content-drag-drop'
import { ContentContextMenu } from './context-menu/content-context-menu'
import { DropFileArea } from './DropFileArea'
import { Icon } from './Icon'

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
  const theme = useTheme()
  const localization = useLocalization()
  const workspace = anchorEl?.closest('.sn-explorer')
  const colors = workspace ? getComputedStyle(workspace) : undefined
  const menuColors = {
    '--sn-menu-surface': colors?.getPropertyValue('--sn-explorer-surface') || theme.palette.background.paper,
    '--sn-menu-border': colors?.getPropertyValue('--sn-explorer-border') || theme.palette.divider,
    '--sn-menu-text': colors?.getPropertyValue('--sn-explorer-text') || theme.palette.text.primary,
    '--sn-menu-muted': colors?.getPropertyValue('--sn-explorer-muted') || theme.palette.text.secondary,
    '--sn-menu-hover': colors?.getPropertyValue('--sn-explorer-hover') || theme.palette.action.hover,
    colorScheme: theme.palette.type,
  } as CSSProperties

  useEffect(() => {
    let isMounted = true
    const fetchSiblings = async () => {
      if (!itemPath) return
      try {
        const siblingsResult = await repo.loadCollection<GenericContent>({
          path: itemPath,
          oDataOptions: {
            select: ['Id', 'Path', 'Name', 'DisplayName', 'Type', 'Icon'],
            orderby: 'Name',
            metadata: 'no',
          },
        })
        if (isMounted) {
          setSiblings(
            siblingsResult.d.results.map((s) => {
              return { content: s, DisplayName: s.DisplayName || s.Name, Id: s.Id }
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
      <button
        type="button"
        onClick={handleOpen}
        className="sn-breadcrumb-separator"
        aria-label={localization.contentViews.folders}
        aria-haspopup="menu"
        aria-expanded={Boolean(anchorEl)}>
        <ChevronRightOutlined aria-hidden="true" />
      </button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        marginThreshold={8}
        PaperProps={{ className: 'sn-content-menu', elevation: 0, style: menuColors }}
        MenuListProps={{ className: 'sn-content-menu__list' }}
        data-test="breadcrumb-sibling-menu">
        {siblings.map((sibling) => (
          <button
            type="button"
            role="menuitem"
            tabIndex={-1}
            key={sibling.Id}
            className="sn-content-menu__item"
            data-test={`breadcrumb-sibling-${sibling.Id}`}
            onClick={(ev) => {
              onItemClick(ev, sibling)
              handleClose()
            }}>
            <span className="sn-content-menu__icon" aria-hidden="true">
              <Icon item={sibling.content} />
            </span>
            <span>{sibling.DisplayName}</span>
          </button>
        ))}
        {!siblings.length && (
          <div className="sn-content-menu__loading" role="status">
            {localization.contentViews.empty}
          </div>
        )}
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
                {...contentDragAttributes(item.content, false)}
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
