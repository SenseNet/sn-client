import { Button, IconButton, ListItemIcon, Menu, MenuItem } from '@material-ui/core'
import { MoreHoriz } from '@material-ui/icons'
import { Content } from '@sensenet/client-core'
import { ActionModel, GenericContent, isActionModel } from '@sensenet/default-content-types'
import { useLogger, useWopi } from '@sensenet/hooks-react'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ResponsiveContext } from '../../../context'
import { useLoadContent, useLocalization } from '../../../hooks'
import { isImageContent } from '../../../services'
import { contextMenuODataOptions } from '../../context-menu/context-menu-odata-options'
import { getIcon } from '../../context-menu/icons'
import { useContextMenuActions } from '../../context-menu/use-context-menu-actions'
import { useImageGallery } from '../../image-gallery'
const DISABLED_ACTIONS = ['Share', 'Preview']

export function ActionFormatter(props: { data: Content }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [actions, setActions] = useState<ActionModel[]>()
  const logger = useLogger('context-menu')
  const { content } = useLoadContent<GenericContent>({
    idOrPath: props.data.Id,
    oDataOptions: contextMenuODataOptions,
    isOpened: anchorEl !== null,
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

  const { runAction } = useContextMenuActions(props.data, setActionsWopi)
  const device = useContext(ResponsiveContext)
  const oDataActionsTitle = useLocalization().customActions.oDataActionsDialog.menuTitle
  const imageGalleryLocalization = useLocalization().imageGallery
  const { openImageGallery } = useImageGallery()
  const canViewImage = isImageContent(props.data as GenericContent)

  useEffect(() => {
    if (content) {
      setActionsWopi(content)
    }
  }, [content, setActionsWopi])
  const handleClick = (event: any) => {
    event.preventDefault()
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const runODataActions = () => {
    setAnchorEl(null)
    runAction('ODataActions')
  }
  return (
    <>
      <IconButton aria-controls="simple-menu" className="simpleContextMenu" aria-haspopup="true" onClick={handleClick}>
        <MoreHoriz />
      </IconButton>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {canViewImage ? (
          <MenuItem
            key="ViewImage"
            disableRipple={true}
            data-test="content-context-menu-view-image"
            onClick={(ev) => {
              ev.stopPropagation()
              setAnchorEl(null)
              openImageGallery(props.data as GenericContent)
            }}>
            <ListItemIcon>{getIcon('viewimage')}</ListItemIcon>
            <div style={{ flexGrow: 1 }}>{imageGalleryLocalization.openImage}</div>
          </MenuItem>
        ) : null}
        <MenuItem
          key="ODataActions"
          disableRipple={true}
          data-test="content-context-menu-odata-actions"
          onClick={(ev) => {
            ev.stopPropagation()
            runODataActions()
          }}>
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
              onClick={(ev) => {
                ev.stopPropagation()
                setAnchorEl(null)
                runAction(action.Name)
              }}>
              <ListItemIcon>{getIcon(action.Name.toLowerCase())}</ListItemIcon>
              <div style={{ flexGrow: 1 }}>{action.DisplayName || action.Name}</div>
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}
