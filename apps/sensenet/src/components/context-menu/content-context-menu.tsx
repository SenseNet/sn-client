import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu, { MenuProps } from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import React, { useContext, useEffect, useState } from 'react'
import { ActionModel, GenericContent } from '@sensenet/default-content-types'
import { ResponsiveContext } from '../../context'
import { useLoadContent } from '../../hooks'
import { getIcon } from './icons'
import { contextMenuODataOptions } from './context-menu-odata-options'
import { useContextMenuActions } from './use-context-menu-actions'

const DISABLED_ACTIONS = ['SetPermissions']

type ContentContextMenuProps = {
  isOpened: boolean
  onOpen?: () => void
  onClose?: () => void
  menuProps?: Partial<MenuProps>
  content: GenericContent
}

export const ContentContextMenu: React.FunctionComponent<ContentContextMenuProps> = props => {
  const [actions, setActions] = useState<ActionModel[]>()
  const { content } = useLoadContent<GenericContent>({
    idOrPath: props.content.Id,
    oDataOptions: contextMenuODataOptions,
  })
  const { runAction } = useContextMenuActions(props.content, setActions)
  const device = useContext(ResponsiveContext)

  useEffect(() => {
    if (content) {
      setActions(content.Actions as ActionModel[])
    }
  }, [content])

  return (
    <div onKeyDown={ev => ev.stopPropagation()} onKeyPress={ev => ev.stopPropagation()}>
      {device === 'mobile' ? (
        <Drawer
          anchor="bottom"
          onClose={() => props.onClose?.()}
          disablePortal={true}
          open={props.isOpened}
          PaperProps={{ style: { paddingBottom: '2em' } }}>
          <List>
            {actions?.map(action => {
              return (
                <ListItem
                  key={action.Name}
                  disabled={DISABLED_ACTIONS.includes(action.Name)}
                  onClick={() => {
                    props.onClose?.()
                    runAction(action.Name)
                  }}>
                  <ListItemIcon>{getIcon(action.Name.toLowerCase())}</ListItemIcon>
                  <ListItemText primary={action.DisplayName || action.Name} />
                </ListItem>
              )
            })}
          </List>
        </Drawer>
      ) : (
        <Menu open={props.isOpened} {...props.menuProps}>
          {actions?.map(action => {
            return (
              <MenuItem
                key={action.Name}
                disableRipple={true}
                disabled={DISABLED_ACTIONS.includes(action.Name)}
                onClick={() => {
                  props.onClose?.()
                  runAction(action.Name)
                }}>
                <ListItemIcon>{getIcon(action.Name.toLowerCase())}</ListItemIcon>
                <div style={{ flexGrow: 1 }}>{action.DisplayName || action.Name}</div>
              </MenuItem>
            )
          })}
        </Menu>
      )}
    </div>
  )
}
