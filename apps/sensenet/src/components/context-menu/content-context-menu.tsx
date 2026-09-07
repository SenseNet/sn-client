import Menu, { MenuProps } from '@material-ui/core/Menu'
import { useTheme } from '@material-ui/core/styles'
import ArrowBack from '@material-ui/icons/ArrowBack'
import Star from '@material-ui/icons/Star'
import StarBorder from '@material-ui/icons/StarBorder'
import { ActionModel, GenericContent, isActionModel, Schema } from '@sensenet/default-content-types'
import { useLogger, useRepository, useWopi } from '@sensenet/hooks-react'
import React, { CSSProperties, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLoadContent, useLocalization } from '../../hooks'
import { useFavoriteState } from '../../hooks/use-favorite-state'
import { addFullscreenEditAction, isImageContent } from '../../services'
import { Icon } from '../Icon'
import { useImageGallery } from '../image-gallery'
import { contextMenuODataOptions } from './context-menu-odata-options'
import { getIcon } from './icons'
import { useContextMenuActions } from './use-context-menu-actions'
import './content-context-menu.css'

const DISABLED_ACTIONS = ['Share', 'Preview']

type ContentContextMenuProps = {
  isOpened: boolean
  onOpen?: () => void
  onClose?: () => void
  menuProps?: Partial<MenuProps>
  content: GenericContent
}

export const ContentContextMenu: React.FunctionComponent<ContentContextMenuProps> = (props) => {
  const [actions, setActions] = useState<{ contentId: number; items: ActionModel[] }>()
  const [menuColors, setMenuColors] = useState<CSSProperties>({})
  const [showTypes, setShowTypes] = useState(false)
  const [childTypes, setChildTypes] = useState<Schema[]>()
  const [typesError, setTypesError] = useState(false)
  const menuHost = useRef<HTMLDivElement>(null)
  const menuList = useRef<HTMLUListElement>(null)
  const positionActions = useRef<{ updatePosition: () => void }>(null)
  const theme = useTheme()
  const logger = useLogger('context-menu')
  const repository = useRepository()
  const { content, error } = useLoadContent<GenericContent>({
    idOrPath: props.content.Id,
    oDataOptions: contextMenuODataOptions,
    isOpened: props.isOpened,
  })
  const { isWriteAvailable } = useWopi()
  const localization = useLocalization()
  const fullscreenEditTitle = localization.settings.fullscreenEdit
  const favorite = useFavoriteState(props.content, props.isOpened)
  const currentMenu = useRef({ contentId: props.content.Id, isOpened: props.isOpened })
  currentMenu.current = { contentId: props.content.Id, isOpened: props.isOpened }
  useEffect(
    () => () => {
      currentMenu.current.isOpened = false
    },
    [],
  )

  const toggleContextFavorite = async () => {
    const targetId = props.content.Id
    const result = await favorite.toggle()
    if (typeof result === 'boolean' && currentMenu.current.isOpened && currentMenu.current.contentId === targetId) {
      props.onClose?.()
    }
  }

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
        setActions({ contentId: contentFromCallback.Id, items: actionsWithoutWopiRead })
      } else {
        setActions({ contentId: contentFromCallback.Id, items: contentActions })
      }
    },
    [fullscreenEditTitle, isWriteAvailable, logger],
  )

  const { runAction } = useContextMenuActions(props.content, setActionsWopi)
  const { openImageGallery } = useImageGallery()
  const oDataActionsTitle = localization.customActions.oDataActionsDialog.menuTitle
  const imageGalleryLocalization = localization.imageGallery
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

  useEffect(() => {
    setShowTypes(false)
    setChildTypes(undefined)
    setTypesError(false)
  }, [props.isOpened, props.content.Id])

  useEffect(() => {
    if (!showTypes || !props.isOpened) return
    let current = true
    repository.allowedChildTypes
      .get({ idOrPath: props.content.Path })
      .then((response) => {
        const types = response.d.results
          .map((type) => ({ name: type.Name, schema: repository.schemas.getSchemaByName(type.Name) }))
          .filter(({ name, schema }) => schema.ContentTypeName === name)
          .map(({ schema }) => schema)
          .sort((left, right) =>
            (left.DisplayName || left.ContentTypeName).localeCompare(right.DisplayName || right.ContentTypeName),
          )
        if (current) setChildTypes(types)
      })
      .catch((loadError) => {
        if (!current) return
        setTypesError(true)
        logger.error({ message: localization.addButton.errorGettingAllowedContentTypes, data: { error: loadError } })
      })
    return () => {
      current = false
    }
  }, [
    localization.addButton.errorGettingAllowedContentTypes,
    logger,
    props.content.Path,
    props.isOpened,
    repository,
    showTypes,
  ])

  useLayoutEffect(() => {
    if (!props.isOpened) return
    const workspace = menuHost.current?.closest('.sn-explorer')
    const colors = workspace ? getComputedStyle(workspace) : undefined
    setMenuColors({
      '--sn-menu-surface': colors?.getPropertyValue('--sn-explorer-surface') || theme.palette.background.paper,
      '--sn-menu-border': colors?.getPropertyValue('--sn-explorer-border') || theme.palette.divider,
      '--sn-menu-text': colors?.getPropertyValue('--sn-explorer-text') || theme.palette.text.primary,
      '--sn-menu-muted': colors?.getPropertyValue('--sn-explorer-muted') || theme.palette.text.secondary,
      '--sn-menu-hover': colors?.getPropertyValue('--sn-explorer-hover') || theme.palette.action.hover,
      '--sn-menu-danger': theme.palette.type === 'dark' ? '#ffaaa5' : '#b42318',
      colorScheme: theme.palette.type,
    } as CSSProperties)
  }, [props.isOpened, theme])

  const visibleActions = actions && actions.contentId === props.content.Id ? actions.items : []
  const isLoading = props.isOpened && content?.Id !== props.content.Id && !error

  useLayoutEffect(() => {
    if (props.isOpened) positionActions.current?.updatePosition()
  }, [actions, childTypes, isLoading, props.isOpened, showTypes, typesError])

  useLayoutEffect(() => {
    if (props.isOpened && (!props.menuProps?.disableAutoFocusItem || showTypes)) {
      menuList.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus()
    }
  }, [props.isOpened, props.menuProps?.disableAutoFocusItem, showTypes])

  return (
    <div ref={menuHost} onKeyDown={(ev) => ev.stopPropagation()} onKeyPress={(ev) => ev.stopPropagation()}>
      <Menu
        {...props.menuProps}
        open={props.isOpened}
        action={positionActions}
        marginThreshold={8}
        onClose={(event, reason) => {
          props.menuProps?.onClose?.(event, reason)
          props.onClose?.()
        }}
        PaperProps={{
          ...props.menuProps?.PaperProps,
          className: `sn-content-menu ${props.menuProps?.PaperProps?.className || ''}`,
          elevation: 0,
          style: { ...menuColors, ...props.menuProps?.PaperProps?.style },
        }}
        MenuListProps={{
          ...props.menuProps?.MenuListProps,
          ref: menuList,
          className: `sn-content-menu__list ${props.menuProps?.MenuListProps?.className || ''}`,
        }}
        data-test="content-context-menu-root">
        {showTypes && (
          <button
            type="button"
            role="menuitem"
            tabIndex={-1}
            className="sn-content-menu__item"
            data-test="content-context-menu-new-back"
            onClick={() => setShowTypes(false)}>
            <span className="sn-content-menu__icon" aria-hidden="true">
              <ArrowBack />
            </span>
            <span>{localization.contentViews.goBack}</span>
          </button>
        )}
        {showTypes && <li role="separator" className="sn-content-menu__separator" />}
        {showTypes &&
          childTypes?.map((schema) => (
            <button
              type="button"
              role="menuitem"
              tabIndex={-1}
              key={schema.ContentTypeName}
              className="sn-content-menu__item"
              data-test={`content-context-menu-new-type-${schema.ContentTypeName.toLowerCase()}`}
              onClick={() => {
                props.onClose?.()
                runAction('Add', schema.ContentTypeName)
              }}>
              <span className="sn-content-menu__icon" aria-hidden="true">
                <Icon item={schema} />
              </span>
              <span>{schema.DisplayName || schema.ContentTypeName}</span>
            </button>
          ))}
        {showTypes && (typesError || !childTypes?.length) && (
          <div className="sn-content-menu__loading" role="status">
            {typesError
              ? localization.addButton.errorGettingAllowedContentTypes
              : childTypes
              ? localization.addButton.noItems
              : localization.common.loadingContent}
          </div>
        )}
        {!showTypes && canViewImage && (
          <button
            type="button"
            role="menuitem"
            tabIndex={-1}
            className="sn-content-menu__item"
            data-test="content-context-menu-view-image"
            onClick={() => {
              props.onClose?.()
              openImageGallery(props.content)
            }}>
            <span className="sn-content-menu__icon" aria-hidden="true">
              {getIcon('viewimage')}
            </span>
            <span>{imageGalleryLocalization.openImage}</span>
          </button>
        )}
        {!showTypes && (
          <button
            type="button"
            role="menuitem"
            tabIndex={-1}
            className="sn-content-menu__item"
            data-test="content-context-menu-odata-actions"
            onClick={runODataActions}>
            <span className="sn-content-menu__icon" aria-hidden="true">
              {getIcon('odataactions')}
            </span>
            <span>{oDataActionsTitle}</span>
          </button>
        )}
        {!showTypes && favorite.available && (
          <button
            type="button"
            role="menuitem"
            tabIndex={-1}
            className="sn-content-menu__item"
            data-test="content-context-menu-favorites"
            disabled={favorite.isBusy}
            onClick={toggleContextFavorite}>
            <span className="sn-content-menu__icon" aria-hidden="true">
              {favorite.isFavorite ? <Star /> : <StarBorder />}
            </span>
            <span>
              {favorite.isFavorite
                ? localization.contentViews.removeFromFavorites
                : localization.contentViews.addToFavorites}
            </span>
          </button>
        )}
        {!showTypes && isLoading && (
          <div className="sn-content-menu__loading" role="status" data-test="content-context-menu-loading">
            {localization.common.loadingContent}
          </div>
        )}
        {!showTypes &&
          visibleActions.map((action) => (
            <button
              type="button"
              role="menuitem"
              tabIndex={-1}
              key={action.Name}
              className={`sn-content-menu__item ${
                ['Delete', 'Purge'].includes(action.Name) ? 'sn-content-menu__item--danger' : ''
              }`}
              disabled={DISABLED_ACTIONS.includes(action.Name)}
              data-test={`content-context-menu-${action.Name.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => {
                if (action.Name === 'Add') {
                  setShowTypes(true)
                  return
                }
                props.onClose?.()
                runAction(action.Name)
              }}>
              <span className="sn-content-menu__icon" aria-hidden="true">
                {getIcon(action.Name.toLowerCase())}
              </span>
              <span>{action.DisplayName || action.Name}</span>
            </button>
          ))}
      </Menu>
    </div>
  )
}
