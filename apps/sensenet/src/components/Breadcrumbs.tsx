import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { CurrentContentProvider } from '@sensenet/hooks-react'
import { ContentContextMenu, CONTEXT_MENU_SCENARIO } from './context-menu/content-context-menu'
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
  onItemClick: (event: React.MouseEvent, item: BreadcrumbItem<T>) => void
}

/**
 * Represents a breadcrumb component
 */
function BreadcrumbsComponent<T extends GenericContent>(props: BreadcrumbProps<T> & RouteComponentProps) {
  const [contextMenuItem, setContextMenuItem] = useState<GenericContent | null>(null)
  const [contextMenuAnchor, setContextMenuAnchor] = useState<HTMLElement | null>(null)
  const [isContextMenuOpened, setIsContextMenuOpened] = useState(false)

  return (
    <>
      <Breadcrumbs maxItems={5} aria-label="breadcrumb">
        {props.items.map(item => (
          <DropFileArea key={item.content.Id} parentContent={item.content} style={{ display: 'inline-block' }}>
            <Tooltip title={item.title}>
              <Button
                onClick={ev => props.onItemClick(ev, item)}
                onContextMenu={ev => {
                  setContextMenuItem(item.content)
                  setContextMenuAnchor(ev.currentTarget)
                  setIsContextMenuOpened(true)
                  ev.preventDefault()
                }}>
                <Icon item={item.content} style={{ marginRight: '0.3em' }} />
                {item.displayName}
              </Button>
            </Tooltip>
          </DropFileArea>
        ))}
      </Breadcrumbs>
      {contextMenuItem ? (
        <CurrentContentProvider
          idOrPath={contextMenuItem.Id}
          oDataOptions={{
            select: ['Actions'],
            metadata: 'full',
            expand: ['Actions'],
            scenario: CONTEXT_MENU_SCENARIO,
          }}>
          <ContentContextMenu
            isOpened={isContextMenuOpened}
            menuProps={{
              anchorEl: contextMenuAnchor,
              BackdropProps: {
                onClick: () => setIsContextMenuOpened(false),
                onContextMenu: ev => ev.preventDefault(),
              },
            }}
            onClose={() => setIsContextMenuOpened(false)}
          />
        </CurrentContentProvider>
      ) : null}
    </>
  )
}

const routed = withRouter(BreadcrumbsComponent)

export default routed
