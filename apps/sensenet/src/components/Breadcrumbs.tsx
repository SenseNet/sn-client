import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { CurrentContentContext } from '../context'
import { ContentContextMenu } from './ContentContextMenu'
import { DropFileArea } from './DropFileArea'
import { Icon } from './Icon'

export interface BreadcrumbItem {
  url: string
  displayName: string
  title: string
  content: GenericContent
}

export interface BreadcrumbProps {
  content: BreadcrumbItem[]
  currentContent: BreadcrumbItem
  onItemClick: (event: React.MouseEvent, item: BreadcrumbItem) => void
}

const Breadcrumbs: React.FunctionComponent<BreadcrumbProps & RouteComponentProps> = props => {
  const [contextMenuItem, setContextMenuItem] = useState<GenericContent | null>(null)
  const [contextMenuAnchor, setContextMenuAnchor] = useState<HTMLElement | null>(null)
  const [isContextMenuOpened, setIsContextMenuOpened] = useState(false)

  return (
    <>
      <Typography variant="h5" style={{ padding: '.5em' }}>
        {props.content.map((item, key) => (
          <DropFileArea key={key} parentContent={item.content} style={{ display: 'inline-block' }}>
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
            <KeyboardArrowRight style={{ verticalAlign: 'middle', height: '16px' }} />
          </DropFileArea>
        ))}
        <DropFileArea parentContent={props.currentContent.content} style={{ display: 'inline-block' }}>
          <Tooltip title={props.currentContent.content.Path || '/'}>
            <Button
              onClick={ev => props.onItemClick(ev, props.currentContent)}
              onContextMenu={ev => {
                setContextMenuItem(props.currentContent.content)
                setContextMenuAnchor(ev.currentTarget)
                setIsContextMenuOpened(true)
                ev.preventDefault()
              }}>
              <Icon item={props.currentContent.content} style={{ marginRight: '0.3em' }} />
              {props.currentContent.displayName}
            </Button>
          </Tooltip>
        </DropFileArea>
      </Typography>
      {contextMenuItem ? (
        <CurrentContentContext.Provider value={contextMenuItem}>
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
        </CurrentContentContext.Provider>
      ) : null}
    </>
  )
}

const routed = withRouter(Breadcrumbs)

export default routed
