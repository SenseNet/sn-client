import { CloudUploadOutlined, Star, StarBorder } from '@material-ui/icons'
import { ActionModel, GenericContent, isActionModel, Schema } from '@sensenet/default-content-types'
import { CurrentContentContext, useLogger, useRepository, useWopi } from '@sensenet/hooks-react'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useLoadContent, useLocalization, useSnRoute } from '../../hooks'
import { useFavoriteState } from '../../hooks/use-favorite-state'
import { addFullscreenEditAction, navigateToAction } from '../../services'
import { FAVORITES_ROOT_PATH } from '../../services/favorites-constants'
import { contextMenuODataOptions } from '../context-menu/context-menu-odata-options'
import { getIcon } from '../context-menu/icons'
import { useContextMenuActions } from '../context-menu/use-context-menu-actions'
import { useDialog } from '../dialogs'
import { ExplorerMenuAction } from '../ExplorerActionMenu'
import { Icon } from '../Icon'
import { useImageGallery } from '../image-gallery'
import { ExpandItemsContext } from '../tree/Contexts/ExpandedItemsProvider'

/** Supplies existing folder commands to the Explorer command bar. */
export const useExplorerFolderActions = (): {
  creationActions: ExplorerMenuAction[]
  otherActions: ExplorerMenuAction[]
} => {
  const logger = useLogger('explorer-folder-actions')
  const repository = useRepository()
  const history = useHistory()
  const snRoute = useSnRoute()
  const { openDialog } = useDialog()
  const parentContent = useContext(CurrentContentContext)
  const expandedItems = useContext(ExpandItemsContext)
  const deleteTreeCache = expandedItems?.[6]
  const [actions, setActions] = useState<{ contentId: number; items: ActionModel[] }>()
  const { available: canFavorite, isFavorite, isBusy: isFavoriteBusy, toggle } = useFavoriteState(parentContent)
  const [creationOptions, setCreationOptions] = useState<{
    contentId: number
    contentPath: string
    types: Schema[]
    canUpload: boolean
  }>()
  const { content } = useLoadContent<GenericContent>({
    idOrPath: parentContent.Path,
    oDataOptions: contextMenuODataOptions,
    isOpened: true,
  })
  const { isWriteAvailable } = useWopi()
  const localization = useLocalization()
  const fullscreenEditTitle = localization.settings.fullscreenEdit
  const { images, openImageGallery } = useImageGallery()

  const setActionsWopi = useCallback(
    (loadedContent: GenericContent) => {
      const serverActions = isActionModel(loadedContent.Actions) ? loadedContent.Actions : []
      let contentActions = serverActions
        .filter((action) => !action.Forbidden)
        .filter((action, index, all) => all.findIndex((candidate) => candidate.Name === action.Name) === index)

      if (contentActions.some((action) => action.Name === 'Browse') && loadedContent.IsFile) {
        contentActions.push({ Name: 'Download', DisplayName: 'Download' } as ActionModel)
      }
      contentActions = addFullscreenEditAction(loadedContent, contentActions, fullscreenEditTitle)
      if (isWriteAvailable(loadedContent)) {
        contentActions = contentActions.filter((action) => action.Name !== 'WopiOpenView')
      }
      setActions({ contentId: loadedContent.Id, items: contentActions })
    },
    [fullscreenEditTitle, isWriteAvailable],
  )

  useEffect(() => {
    if (content) setActionsWopi(content)
  }, [content, setActionsWopi])

  useEffect(() => {
    let current = true
    if (!parentContent.Path) return

    const loadCreationOptions = async () => {
      try {
        const response = await repository.getActions({ idOrPath: parentContent.Path })
        const permittedActions = response.d.results.filter((action) => !action.Forbidden)
        const canAdd = permittedActions.some((action) => action.Name === 'Add')
        const canUpload = permittedActions.some((action) => action.Name === 'Upload')
        const options = {
          contentId: parentContent.Id,
          contentPath: parentContent.Path,
          types: [] as Schema[],
          canUpload,
        }
        if (!current) return
        setCreationOptions(options)
        if (!canAdd) return

        const allowedTypes = await repository.allowedChildTypes.get({ idOrPath: parentContent.Path })
        const types = allowedTypes.d.results
          .map((type) => ({ name: type.Name, schema: repository.schemas.getSchemaByName(type.Name) }))
          .filter(({ name, schema }) => schema.ContentTypeName === name)
          .map(({ schema }) => schema)
          .sort((left, right) =>
            (left.DisplayName || left.ContentTypeName).localeCompare(right.DisplayName || right.ContentTypeName),
          )
        if (current) setCreationOptions({ ...options, types })
      } catch (error) {
        if (current) {
          logger.error({ message: localization.addButton.errorGettingAllowedContentTypes, data: { error } })
        }
      }
    }

    loadCreationOptions()
    return () => {
      current = false
    }
  }, [localization.addButton.errorGettingAllowedContentTypes, logger, parentContent.Id, parentContent.Path, repository])

  const toggleFavorite = async () => {
    const result = await toggle()
    if (result !== undefined) {
      deleteTreeCache?.(FAVORITES_ROOT_PATH)
    }
  }

  const { runAction } = useContextMenuActions(parentContent, setActionsWopi)
  const serverCommands: ExplorerMenuAction[] =
    actions?.contentId === parentContent.Id
      ? actions.items
          .filter((action) => !['Share', 'Delete', 'Browse', 'Add', 'Upload'].includes(action.Name))
          .map((action) => ({
            id: `content-header-action-${action.Name.toLowerCase()}`,
            label: action.DisplayName || action.Name,
            icon: getIcon(action.Name.toLowerCase()),
            disabled: action.Name === 'Preview',
            onClick: () => runAction(action.Name),
          }))
      : []
  const currentCreationOptions =
    creationOptions?.contentId === parentContent.Id && creationOptions?.contentPath === parentContent.Path
      ? creationOptions
      : undefined

  return {
    creationActions: [
      ...(currentCreationOptions?.canUpload
        ? [
            {
              id: 'content-header-action-upload',
              label: localization.addButton.upload,
              icon: <CloudUploadOutlined />,
              onClick: () =>
                openDialog({
                  name: 'upload',
                  props: { uploadPath: parentContent.Path },
                  dialogProps: { open: true, fullScreen: false },
                }),
            },
          ]
        : []),
      ...(currentCreationOptions?.types || []).map((schema) => ({
        id: `content-new-type-${schema.ContentTypeName.toLowerCase()}`,
        label: schema.DisplayName || schema.ContentTypeName,
        icon: <Icon item={schema} />,
        onClick: () =>
          navigateToAction({
            history,
            routeMatch: snRoute.match,
            action: 'new',
            queryParams: { 'content-type': schema.ContentTypeName },
          }),
      })),
    ],
    otherActions: [
      ...(canFavorite
        ? [
            {
              id: 'content-header-action-favorites',
              label: localization.drawer.titles.Favorites,
              icon: isFavorite ? <Star /> : <StarBorder />,
              disabled: isFavoriteBusy,
              onClick: toggleFavorite,
            },
          ]
        : []),
      ...(images.length
        ? [
            {
              id: 'content-gallery-action',
              label: localization.imageGallery.openGallery,
              icon: getIcon('gallery'),
              onClick: () => openImageGallery(images[0], images),
            },
          ]
        : []),
      {
        id: 'content-header-action-odataactions',
        label: localization.customActions.oDataActionsDialog.menuTitle,
        icon: getIcon('odataactions'),
        onClick: () => runAction('ODataActions'),
      },
      ...serverCommands,
    ],
  }
}
