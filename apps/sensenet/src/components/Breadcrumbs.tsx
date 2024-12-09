import MUIBreadcrumbs from '@material-ui/core/Breadcrumbs'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import { GenericContent } from '@sensenet/default-content-types'
import React, { MouseEvent, useState } from 'react'
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
  onItemClick: (event: MouseEvent, item: BreadcrumbItem<T>) => void
}

export function Breadcrumbs<T extends GenericContent>(props: BreadcrumbProps<T>) {
  const [contextMenuItem, setContextMenuItem] = useState<GenericContent | null>(null)
  const [contextMenuAnchor, setContextMenuAnchor] = useState<HTMLElement | null>(null)
  const [isContextMenuOpened, setIsContextMenuOpened] = useState(false)

  return (
    <>
      <MUIBreadcrumbs
        maxItems={15}
        aria-label="breadcrumb"
        style={{ marginLeft: '8.5px' }}
        classes={{ separator: 'bread-crumbs-separator' }}>
        {props.items.map((item) => (
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
                <span style={{ textTransform: 'none', fontSize: '16px' }}>{item.displayName}</span>
              </Button>
            </Tooltip>
          </DropFileArea>
        ))}
        <CopyPath copyText={props.items[props.items.length - 1].title} />
      </MUIBreadcrumbs>
      <>
        <b className="ContentExtraInfo">
          <span title="DisplayName">{props.items[props.items.length - 1].content.DisplayName}</span>
          <span title="ContentType" className="ContentTypeSpan">
            (
            <a
              href={`/content-types/explorer/edit-binary?content=%2FGenericContent%2FFolder%2F${
                props.items[props.items.length - 1].content.Type
              }`}
              target="_blank"
              rel="noreferrer">
              {props.items[props.items.length - 1].content.Type}
            </a>
            )
          </span>
        </b>
      </>

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
