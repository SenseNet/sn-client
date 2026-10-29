import { Menu, useTheme } from '@material-ui/core'
import MUIBreadcrumbs from '@material-ui/core/Breadcrumbs'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import ChevronRightOutlined from '@material-ui/icons/ChevronRightOutlined'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { CSSProperties, MouseEvent, useEffect, useState } from 'react'
import { useLocalization } from '../hooks'
import { getExplorerPathCompletion } from '../services/explorer-path-service'
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
  const [menuPath, setMenuPath] = useState('')
  const [siblings, setSiblings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)
  const isOpen = Boolean(anchorEl) && menuPath === itemPath
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
    if (!isOpen || !itemPath) return
    const controller = new AbortController()
    const fetchSiblings = async () => {
      setIsLoading(true)
      setHasError(false)
      setSiblings([])
      try {
        const completion = getExplorerPathCompletion(`${itemPath}/`, '/Root')
        if (!completion) throw new Error('Invalid breadcrumb folder path')
        const siblingsResult = await repo.loadCollection<GenericContent>({
          path: '/Root',
          requestInit: { signal: controller.signal },
          oDataOptions: {
            query: completion.query,
            select: ['Id', 'Path', 'Name', 'DisplayName', 'Type', 'Icon', 'IsFolder', 'IsFile'],
            onlyselectList: true,
            inlinecount: 'none',
            orderby: 'Name',
            metadata: 'no',
          },
        })
        if (!controller.signal.aborted) {
          setSiblings(
            siblingsResult.d.results.map((s) => {
              return { content: s, DisplayName: s.DisplayName || s.Name, Id: s.Id }
            }),
          )
        }
      } catch (error) {
        if (!controller.signal.aborted) setHasError(true)
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }
    fetchSiblings()
    return () => {
      controller.abort()
    }
  }, [isOpen, itemPath, repo, reloadToken])

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuPath(itemPath)
    setSiblings([])
    setHasError(false)
    setIsLoading(true)
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
        aria-expanded={isOpen}
        data-test="breadcrumb-separator">
        <ChevronRightOutlined aria-hidden="true" />
      </button>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
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
            className="sn-content-menu__item sn-content-menu__item--content"
            data-test={`breadcrumb-sibling-${sibling.Id}`}
            onClick={(ev) => {
              onItemClick(ev, sibling)
              handleClose()
            }}>
            <span className="sn-content-menu__icon" aria-hidden="true">
              <Icon item={sibling.content} />
            </span>
            <span className="sn-content-menu__label">{sibling.DisplayName}</span>
          </button>
        ))}
        {hasError && (
          <>
            <div className="sn-content-menu__loading" role="alert" data-test="breadcrumb-sibling-error">
              {localization.contentViews.loadFailed}
            </div>
            <button
              type="button"
              role="menuitem"
              className="sn-content-menu__item"
              data-test="breadcrumb-sibling-retry"
              onClick={() => setReloadToken((value) => value + 1)}>
              {localization.contentViews.retry}
            </button>
          </>
        )}
        {!siblings.length && !hasError && (
          <div className="sn-content-menu__loading" role="status">
            {isLoading ? localization.contentViews.loading : localization.contentViews.empty}
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
