import { Button, ListItemIcon, makeStyles, Theme } from '@material-ui/core'
import { ActionModel, GenericContent, isActionModel } from '@sensenet/default-content-types'
import { CurrentContentContext, useLogger, useWopi } from '@sensenet/hooks-react'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useLoadContent, useLocalization, useSelectionService } from '../../hooks'
import { addFullscreenEditAction, supportsFullscreenEdit } from '../../services'
import { contextMenuODataOptions } from '../context-menu/context-menu-odata-options'
import { getIcon } from '../context-menu/icons'
import { useContextMenuActions } from '../context-menu/use-context-menu-actions'
import { FavoriteButton } from '../favorites/FavoriteButton'
import { Icon } from '../Icon'
import { useImageGallery } from '../image-gallery'

export function ContentInfo() {
  const DISABLED_ACTIONS = ['Share', 'Preview', 'Delete']
  const logger = useLogger('context-menu')
  const [actions, setActions] = useState<ActionModel[]>()
  const parentContent = useContext(CurrentContentContext)
  const selectionService = useSelectionService()
  const [activeContent, setActiveContent] = useState(selectionService.activeContent.getValue())
  const { content } = useLoadContent<GenericContent>({
    idOrPath: parentContent.Path,
    oDataOptions: contextMenuODataOptions,
    isOpened: true,
  })
  const { isWriteAvailable } = useWopi()
  const fullscreenEditTitle = useLocalization().settings.fullscreenEdit
  const oDataActionsTitle = useLocalization().customActions.oDataActionsDialog.menuTitle
  const imageGalleryLocalization = useLocalization().imageGallery
  const { images, openImageGallery } = useImageGallery()

  useEffect(() => {
    const subscription = selectionService.activeContent.subscribe(setActiveContent)
    return () => subscription.dispose()
  }, [selectionService.activeContent])

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

  useEffect(() => {
    if (content) {
      setActionsWopi(content)
    }
  }, [content, setActionsWopi])
  const { runAction } = useContextMenuActions(parentContent, setActionsWopi)
  const { runAction: runActiveContentAction } = useContextMenuActions(activeContent || parentContent, () => undefined)
  const showActiveContentEdit =
    activeContent?.Path !== parentContent.Path && activeContent && supportsFullscreenEdit(activeContent)

  return (
    <>
      <div className="gridTopPanel">
        <div>
          <div className="iconArea" title={parentContent.Type}>
            <Icon item={parentContent} />
          </div>
          <h1 title="DisplayName" style={{ paddingTop: '3px' }}>
            {parentContent?.DisplayName || 'Loading...'}
          </h1>
          <label>Type:</label>
          <a
            style={{ textDecoration: 'underline' }}
            href={`/content-types/explorer/edit-binary?content=%2FGenericContent%2FFolder%2F${parentContent.Type}`}
            target="_blank"
            rel="noreferrer">
            {parentContent.Type}
          </a>
          <label>Path:</label>
          <span> {parentContent.Path}</span>
        </div>
        <div className="buttonPanel">
          <FavoriteButton content={parentContent} />
          {images.length ? (
            <Button
              key="Gallery"
              title={imageGalleryLocalization.openGallery}
              disableRipple={true}
              data-test="content-gallery-action"
              onClick={() => openImageGallery(images[0], images)}>
              <ListItemIcon>{getIcon('gallery')}</ListItemIcon>
              <div style={{ flexGrow: 1 }}>{imageGalleryLocalization.openGallery}</div>
            </Button>
          ) : null}
          <Button
            key="ODataActions"
            title={oDataActionsTitle}
            disableRipple={true}
            onClick={() => {
              runAction('ODataActions')
            }}>
            <ListItemIcon>{getIcon('odataactions')}</ListItemIcon>
            <div style={{ flexGrow: 1 }}>{oDataActionsTitle}</div>
          </Button>
          {showActiveContentEdit ? (
            <Button
              key="EditBinary"
              title={`${fullscreenEditTitle}: ${activeContent.DisplayName || activeContent.Name}`}
              disableRipple={true}
              data-test="content-fullscreen-edit-action"
              onClick={() => runActiveContentAction('EditBinary')}>
              <ListItemIcon>{getIcon('editbinary')}</ListItemIcon>
              <div style={{ flexGrow: 1 }}>{fullscreenEditTitle}</div>
            </Button>
          ) : null}
          {actions
            ?.filter((a: ActionModel) => {
              return a.Name !== 'Share' && a.Name !== 'Delete' && a.Name !== 'Browse'
            })
            .map((action) => {
              return (
                <Button
                  key={action.Name}
                  title={action.DisplayName || action.Name}
                  disableRipple={true}
                  disabled={DISABLED_ACTIONS.includes(action.Name)}
                  onClick={() => {
                    runAction(action.Name)
                  }}>
                  <ListItemIcon>{getIcon(action.Name.toLowerCase())}</ListItemIcon>
                  <div style={{ flexGrow: 1 }}>{action.DisplayName || action.Name}</div>
                </Button>
              )
            })}
        </div>
      </div>
    </>
  )
}
