import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu, { MenuProps } from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { ActionModel, GenericContent, isActionModel } from '@sensenet/default-content-types'
import { useLogger, useWopi } from '@sensenet/hooks-react'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ResponsiveContext } from '../../context'
import { useLoadContent } from '../../hooks'
import { ActionNameType } from '../react-control-mapper'
import { contextMenuODataOptions } from './context-menu-odata-options'
import { getIcon } from './icons'
import { useContextMenuActions } from './use-context-menu-actions'

const DISABLED_ACTIONS = ['SetPermissions', 'Share', 'Restore', 'Preview']

type ContentContextMenuProps = {
  isOpened: boolean
  onOpen?: () => void
  onClose?: () => void
  menuProps?: Partial<MenuProps>
  content: GenericContent
  halfPage?: boolean
  setFormOpen?: (actionname: ActionNameType) => void
}

export const ContentContextMenu: React.FunctionComponent<ContentContextMenuProps> = (props) => {
  const [actions, setActions] = useState<ActionModel[]>()
  const logger = useLogger('context-menu')
  const { content } = useLoadContent<GenericContent>({
    idOrPath: props.content.Id,
    oDataOptions: contextMenuODataOptions,
    isOpened: props.isOpened,
  })
  const { isWriteAvailable } = useWopi()

  const setActionsWopi = useCallback(
    (contentFromCallback: GenericContent) => {
      if (!isActionModel(contentFromCallback.Actions)) {
        logger.verbose({ message: 'There are no actions in content', data: contentFromCallback })
        return
      }
      const contentActions = contentFromCallback.Actions.filter((action) => !action.Forbidden).filter(
        (item, i, arr) => arr.findIndex((t) => t.Name === item.Name) === i,
      )

      if (contentActions.some((action) => action.Name === 'Browse') && contentFromCallback.IsFile) {
        contentActions.push({
          Name: 'Download',
          DisplayName: 'Download',
        } as ActionModel)
      }

      if (isWriteAvailable(contentFromCallback)) {
        // If write is available it means that we have two actions. We want to show only the open edit for the user.
        const actionsWithoutWopiRead = contentActions.filter((action) => action.Name !== 'WopiOpenView')
        setActions(actionsWithoutWopiRead)
      } else {
        setActions(contentActions)
      }
    },
    [isWriteAvailable, logger],
  )

  const setFormOpen = (actionName: ActionNameType) => {
    props.setFormOpen && props.setFormOpen(actionName)
  }

  const getAction = (actionName: string) => {
    return (actionName.toLowerCase() as ActionNameType) || undefined
  }

  const { runAction } = useContextMenuActions(props.content, props.isOpened, setActionsWopi)
  const device = useContext(ResponsiveContext)

  useEffect(() => {
    if (content) {
      setActionsWopi(content)
    }
  }, [content, setActionsWopi])
  return !actions?.length ? null : (
    <div onKeyDown={(ev) => ev.stopPropagation()} onKeyPress={(ev) => ev.stopPropagation()}>
      {device === 'mobile' ? (
        <Drawer
          anchor="bottom"
          onClose={() => props.onClose?.()}
          disablePortal={true}
          open={props.isOpened}
          PaperProps={{ style: { paddingBottom: '2em' } }}>
          <List>
            {actions?.map((action) => {
              return (
                <ListItem
                  key={action.Name}
                  disabled={DISABLED_ACTIONS.includes(action.Name)}
                  onClick={() => {
                    props.onClose?.()
                    runAction(action.Name, props.halfPage, () => setFormOpen(getAction(action.Name)))
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
          {actions?.map((action) => {
            return (
              <MenuItem
                key={action.Name}
                disableRipple={true}
                disabled={DISABLED_ACTIONS.includes(action.Name)}
                onClick={() => {
                  props.onClose?.()
                  runAction(action.Name, props.halfPage, () => setFormOpen(getAction(action.Name)))
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
