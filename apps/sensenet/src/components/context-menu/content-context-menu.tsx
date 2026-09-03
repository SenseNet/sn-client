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
import { useLoadContent, useLocalization } from '../../hooks'
import { addFullscreenEditAction, isImageContent } from '../../services'
import { useImageGallery } from '../image-gallery'
import { contextMenuODataOptions } from './context-menu-odata-options'
import { getIcon } from './icons'
import { useContextMenuActions } from './use-context-menu-actions'

const DISABLED_ACTIONS = ['Share', 'Preview']

type ContentContextMenuProps = {
  isOpened: boolean
  onOpen?: () => void
  onClose?: () => void
  menuProps?: Partial<MenuProps>
  content: GenericContent
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
  const fullscreenEditTitle = useLocalization().settings.fullscreenEdit

  const setActionsWopi = useCallback(
    (contentFromCallback: GenericContent) => {
      if (!isActionModel(contentFromCallback.Actions)) {
        logger.verbose({ message: 'There are no actions in content', data: contentFromCallback })
      }
      const serverActions = isActionModel(contentFromCallback.Actions) ? contentFromCallback.Actions : []
      let contentActions = serverActions
        .filter((action) => !action.Forbidden)
        .filter((item, i, arr) => arr.findIndex((t) => t.Name === item.Name) === i)

      if (contentActions.some((action) => action.Name === 'Browse') && contentFromCallback.IsFile) {
        contentActions.push({
          Name: 'Download',
          DisplayName: 'Download',
        } as ActionModel)
      }

      contentActions = addFullscreenEditAction(contentFromCallback, contentActions, fullscreenEditTitle)

      if (isWriteAvailable(contentFromCallback)) {
        // If write is available it means that we have two actions. We want to show only the open edit for the user.
        const actionsWithoutWopiRead = contentActions.filter((action) => action.Name !== 'WopiOpenView')
        setActions(actionsWithoutWopiRead)
      } else {
        setActions(contentActions)
      }
    },
    [fullscreenEditTitle, isWriteAvailable, logger],
  )

  const { runAction } = useContextMenuActions(props.content, setActionsWopi)
  const { openImageGallery } = useImageGallery()
  const device = useContext(ResponsiveContext)
  const oDataActionsTitle = useLocalization().customActions.oDataActionsDialog.menuTitle
  const imageGalleryLocalization = useLocalization().imageGallery
  const canViewImage = isImageContent(props.content)
  const runODataActions = () => {
    props.onClose?.()
    runAction('ODataActions')
  }

  useEffect(() => {
    if (content) {
      setActionsWopi(content)
    }
  }, [content, setActionsWopi])
  return (
    <div onKeyDown={(ev) => ev.stopPropagation()} onKeyPress={(ev) => ev.stopPropagation()}>
      {device === 'mobile' ? (
        <Drawer
          anchor="bottom"
          onClose={() => props.onClose?.()}
          disablePortal={true}
          open={props.isOpened}
          PaperProps={{ style: { paddingBottom: '2em' } }}>
          <List>
            {canViewImage ? (
              <ListItem
                button
                onClick={() => {
                  props.onClose?.()
                  openImageGallery(props.content)
                }}>
                <ListItemIcon>{getIcon('viewimage')}</ListItemIcon>
                <ListItemText primary={imageGalleryLocalization.openImage} />
              </ListItem>
            ) : null}
            <ListItem onClick={runODataActions}>
              <ListItemIcon>{getIcon('odataactions')}</ListItemIcon>
              <ListItemText primary={oDataActionsTitle} />
            </ListItem>
            {actions?.map((action) => {
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
        <Menu open={props.isOpened} {...props.menuProps} data-test="content-context-menu-root">
          {canViewImage ? (
            <MenuItem
              key="ViewImage"
              disableRipple={true}
              data-test="content-context-menu-view-image"
              onClick={() => {
                props.onClose?.()
                openImageGallery(props.content)
              }}>
              <ListItemIcon>{getIcon('viewimage')}</ListItemIcon>
              <div style={{ flexGrow: 1 }}>{imageGalleryLocalization.openImage}</div>
            </MenuItem>
          ) : null}
          <MenuItem
            key="ODataActions"
            disableRipple={true}
            data-test="content-context-menu-odata-actions"
            onClick={runODataActions}>
            <ListItemIcon>{getIcon('odataactions')}</ListItemIcon>
            <div style={{ flexGrow: 1 }}>{oDataActionsTitle}</div>
          </MenuItem>
          {actions?.map((action) => {
            return (
              <MenuItem
                key={action.Name}
                disableRipple={true}
                disabled={DISABLED_ACTIONS.includes(action.Name)}
                data-test={`content-context-menu-${action.Name.replace(/\s+/g, '-').toLowerCase()}`}
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
