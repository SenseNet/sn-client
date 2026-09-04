import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { FolderOpenOutlined, MoreHoriz } from '@material-ui/icons'
import { GenericContent } from '@sensenet/default-content-types'
import { CurrentChildrenContext, CurrentChildrenIsLoadingContext, CurrentContentContext } from '@sensenet/hooks-react'
import { clsx } from 'clsx'
import React, { KeyboardEvent, MouseEvent, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ResponsiveContext } from '../../context'
import { useLocalization, usePersonalSettings, useSelectionService } from '../../hooks'
import { isImageContent } from '../../services'
import { ContentContextMenu } from '../context-menu/content-context-menu'
import { DropFileArea } from '../DropFileArea'
import { GridProps } from '../grid/Props/GridProps'
import { useImageGallery } from '../image-gallery'
import { compareTreeItems, getTreeItemLabel } from '../tree/tree-helpers'
import { getContentViewSelection } from './content-view-selection'
import { ContentItemPreview } from './ContentItemPreview'

const sizes = {
  small: { icon: 32, tile: 104, preview: 64, thumbnail: 132 },
  medium: { icon: 48, tile: 132, preview: 104, thumbnail: 172 },
  large: { icon: 72, tile: 164, preview: 152, thumbnail: 224 },
  extraLarge: { icon: 112, tile: 204, preview: 208, thumbnail: 280 },
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
      fontFamily: 'inherit',
      fontSize: 14,
      lineHeight: 1.4,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
      minHeight: 38,
      padding: '0 12px',
      gap: 12,
      borderBottom: `1px solid ${theme.palette.divider}`,
      fontSize: 12,
    },
    selectAll: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      minHeight: 38,
      cursor: 'pointer',
    },
    selectionInput: {
      width: 16,
      height: 16,
      margin: 0,
      accentColor: theme.palette.primary.main,
      cursor: 'pointer',
      '&:focus-visible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: 3 },
      '&:disabled': { cursor: 'default' },
    },
    count: {
      color: theme.palette.text.secondary,
      textAlign: 'right',
    },
    items: {
      flex: 1,
      minHeight: 0,
      overflow: 'auto',
      display: 'grid',
      alignContent: 'start',
      gap: 8,
      padding: 12,
    },
    list: { gap: 2, padding: 6 },
    item: {
      position: 'relative',
      borderRadius: 4,
      border: '1px solid transparent',
      minWidth: 0,
      outline: 'none',
      userSelect: 'none',
      cursor: 'default',
      '&:hover': { backgroundColor: theme.palette.action.hover },
      '&:focus': { borderColor: theme.palette.primary.main },
    },
    selected: {
      backgroundColor: theme.palette.action.selected,
      borderColor: theme.palette.primary.main,
      '&:hover': { backgroundColor: theme.palette.action.selected },
    },
    cell: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: 0,
      padding: '32px 10px 12px',
      gap: 10,
    },
    listCell: { flexDirection: 'row', padding: '3px 6px', gap: 12, minHeight: 38 },
    preview: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      '& svg': { width: '100%', height: '100%' },
      '& span': { display: 'block' },
    },
    name: {
      minWidth: 0,
      width: '100%',
      textAlign: 'center',
    },
    itemName: {
      overflow: 'hidden',
      display: '-webkit-box',
      '-webkit-line-clamp': 2,
      '-webkit-box-orient': 'vertical',
      overflowWrap: 'anywhere',
    },
    itemType: {
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      color: theme.palette.text.secondary,
      fontSize: 12,
      marginTop: 2,
    },
    listName: {
      flex: 1,
      textAlign: 'left',
      '& $itemName': { display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis' },
    },
    checkbox: {
      position: 'absolute',
      top: 0,
      left: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      cursor: 'pointer',
    },
    actions: {
      position: 'absolute',
      top: 2,
      right: 2,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 30,
      height: 30,
      padding: 4,
      border: '1px solid transparent',
      borderRadius: 2,
      background: 'transparent',
      color: 'inherit',
      cursor: 'pointer',
      '&:hover': { backgroundColor: theme.palette.action.hover, borderColor: theme.palette.divider },
      '&:focus-visible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: 1 },
    },
    listControl: { position: 'relative', top: 'auto', left: 'auto', right: 'auto', flexShrink: 0 },
    empty: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 12,
      color: theme.palette.text.secondary,
    },
    loading: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 12,
      zIndex: 2,
      backgroundColor: theme.palette.type === 'light' ? 'rgba(255,255,255,.65)' : 'rgba(18,18,18,.65)',
    },
    loadingBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 2,
      zIndex: 3,
      backgroundColor: theme.palette.primary.main,
    },
    spinner: {
      width: 30,
      height: 30,
      borderRadius: '50%',
      border: `2px solid ${theme.palette.divider}`,
      borderTopColor: theme.palette.primary.main,
      animation: '$spin 800ms linear infinite',
      '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
    },
    '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
  }),
)

export type ContentItemsViewProps = GridProps<GenericContent> & { viewMode: 'list' | 'icons' | 'thumbnails' }

export const ContentItemsView = (props: ContentItemsViewProps) => {
  const classes = useStyles()
  const localization = useLocalization().contentViews
  const personalSettings = usePersonalSettings()
  const selectionService = useSelectionService()
  const device = useContext(ResponsiveContext)
  const parentContent = useContext(CurrentContentContext)
  const currentChildren = useContext(CurrentChildrenContext) as GenericContent[]
  const isLoading = useContext(CurrentChildrenIsLoadingContext) || Boolean(props.isColumnSettingsLoading)
  const { openImageGallery } = useImageGallery()
  const children = useMemo(
    () =>
      [...currentChildren].sort(
        compareTreeItems(personalSettings.contentPreferDisplayName, personalSettings.sortFoldersFirst),
      ),
    [currentChildren, personalSettings.contentPreferDisplayName, personalSettings.sortFoldersFirst],
  )
  const [selection, setSelection] = useState(selectionService.selection.getValue())
  const [focusedId, setFocusedId] = useState(selectionService.activeContent.getValue()?.Id)
  const anchorId = useRef<number | undefined>(focusedId)
  const itemElements = useRef(new Map<number, HTMLDivElement>())
  const [contextMenu, setContextMenu] = useState<{ content: GenericContent; top: number; left: number }>()
  const isList = props.viewMode === 'list'
  const isThumbnails = props.viewMode === 'thumbnails'
  const size = sizes[personalSettings.contentIconSize] || sizes.medium
  const selectedIds = useMemo(() => new Set(selection.map((item) => item.Id)), [selection])
  const selectedCount = children.filter((item) => selectedIds.has(item.Id)).length
  const allSelected = children.length > 0 && selectedCount === children.length
  const tabStopId = children.some((item) => item.Id === focusedId) ? focusedId : children[0]?.Id

  useEffect(() => {
    const subscription = selectionService.selection.subscribe(setSelection)
    return () => subscription.dispose()
  }, [selectionService])

  useEffect(() => {
    const subscription = selectionService.activeContent.subscribe((content) => setFocusedId(content?.Id))
    return () => subscription.dispose()
  }, [selectionService])

  const changeSelection = (items: GenericContent[]) => {
    if (props.disableSelection) return
    selectionService.selection.setValue(items)
    props.onSelectionChange?.(items)
  }

  const activate = (item: GenericContent) => {
    setFocusedId(item.Id)
    selectionService.activeContent.setValue(item)
    props.onActiveItemChange?.(item)
  }

  const selectItem = (item: GenericContent, additive = false, range = false) => {
    const selectionAnchor = anchorId.current ?? tabStopId
    changeSelection(
      getContentViewSelection(
        children,
        selectionService.selection.getValue(),
        item.Id,
        selectionAnchor,
        additive,
        range,
      ),
    )
    if (!range) anchorId.current = item.Id
    activate(item)
  }

  const openItem = (item: GenericContent) => {
    activate(item)
    if (isImageContent(item)) openImageGallery(item, children)
    else props.onParentChange(item)
  }

  const openContextMenu = (event: MouseEvent<HTMLElement>, item: GenericContent) => {
    event.preventDefault()
    event.stopPropagation()
    if (!selectedIds.has(item.Id)) selectItem(item)
    else activate(item)
    const bounds = event.currentTarget.getBoundingClientRect()
    setContextMenu({ content: item, top: event.clientY || bounds.bottom, left: event.clientX || bounds.left })
  }

  const getColumnCount = () => {
    if (isList || !children.length) return 1
    const firstTop = itemElements.current.get(children[0].Id)?.offsetTop
    const nextRow = children.findIndex((item) => itemElements.current.get(item.Id)?.offsetTop !== firstTop)
    return nextRow > 0 ? nextRow : children.length
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>, item: GenericContent) => {
    if (event.target !== event.currentTarget || isLoading) return
    const additive = event.ctrlKey || event.metaKey
    if (additive && event.key.toLowerCase() === 'a') {
      event.preventDefault()
      changeSelection(children)
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      openItem(item)
      return
    }
    if (event.key === ' ') {
      event.preventDefault()
      selectItem(item, true, event.shiftKey)
      return
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      changeSelection([])
      return
    }
    if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
      event.preventDefault()
      if (!selectedIds.has(item.Id)) selectItem(item)
      const bounds = event.currentTarget.getBoundingClientRect()
      setContextMenu({ content: item, top: bounds.bottom, left: bounds.left })
      return
    }
    const index = children.findIndex((child) => child.Id === item.Id)
    const columnCount = getColumnCount()
    const targetIndices: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      ArrowDown: index + columnCount,
      ArrowUp: index - columnCount,
      Home: 0,
      End: children.length - 1,
    }
    const targetIndex = targetIndices[event.key]
    if (targetIndex === undefined) return
    event.preventDefault()
    const target = children[Math.max(0, Math.min(children.length - 1, targetIndex))]
    if (additive && !event.shiftKey) activate(target)
    else selectItem(target, additive, event.shiftKey)
    itemElements.current.get(target.Id)?.focus()
  }

  return (
    <DropFileArea parentContent={parentContent} style={{ height: '100%', overflow: 'hidden', ...props.style }}>
      <div
        {...props.containerProps}
        ref={props.containerRef}
        className={clsx(classes.root, props.containerProps?.className)}
        onFocus={props.onFocus}
        aria-busy={isLoading}
        data-test={`content-items-${props.viewMode}`}>
        <div className={classes.header}>
          {!props.disableSelection && (
            <label className={classes.selectAll} data-test="content-view-select-all">
              <input
                type="checkbox"
                className={classes.selectionInput}
                checked={allSelected}
                ref={(element) => {
                  if (element) element.indeterminate = selectedCount > 0 && !allSelected
                }}
                disabled={!children.length || isLoading}
                onChange={() => changeSelection(allSelected ? [] : children)}
                aria-label={localization.selectAll}
              />
              <span>{localization.selectAll}</span>
            </label>
          )}
          <span className={classes.count} role="status">
            {localization.itemCount.replace('{0}', String(children.length))}
            {selectedCount > 0 && ` · ${localization.selectedCount.replace('{0}', String(selectedCount))}`}
          </span>
        </div>
        {children.length ? (
          <div
            role="grid"
            aria-label={localization[props.viewMode]}
            aria-multiselectable={!props.disableSelection}
            className={clsx(classes.items, { [classes.list]: isList })}
            style={{
              gridTemplateColumns: isList
                ? '1fr'
                : `repeat(auto-fill, minmax(min(100%, ${isThumbnails ? size.thumbnail : size.tile}px), 1fr))`,
            }}>
            {children.map((item) => {
              const name = getTreeItemLabel(item, personalSettings.contentPreferDisplayName)
              const selected = selectedIds.has(item.Id)
              return (
                <div
                  key={item.Id}
                  ref={(element) => {
                    if (element) itemElements.current.set(item.Id, element)
                    else itemElements.current.delete(item.Id)
                  }}
                  role="row"
                  tabIndex={item.Id === tabStopId ? 0 : -1}
                  aria-selected={selected}
                  aria-label={name}
                  data-test="content-view-item"
                  data-content-id={item.Id}
                  className={clsx(classes.item, { [classes.selected]: selected })}
                  onFocus={(event) => {
                    if (event.target === event.currentTarget) activate(item)
                  }}
                  onClick={(event) => {
                    if (isLoading) return
                    event.currentTarget.focus()
                    selectItem(item, event.ctrlKey || event.metaKey, event.shiftKey)
                    if (device === 'mobile' && !event.ctrlKey && !event.metaKey && !event.shiftKey) openItem(item)
                  }}
                  onDoubleClick={() => !isLoading && device !== 'mobile' && openItem(item)}
                  onContextMenu={(event) => openContextMenu(event, item)}
                  onKeyDown={(event) => onKeyDown(event, item)}>
                  <div role="gridcell" className={clsx(classes.cell, { [classes.listCell]: isList })}>
                    {!props.disableSelection && (
                      <label
                        className={clsx(classes.checkbox, { [classes.listControl]: isList })}
                        onClick={(event) => event.stopPropagation()}
                        onDoubleClick={(event) => event.stopPropagation()}>
                        <input
                          type="checkbox"
                          className={classes.selectionInput}
                          checked={selected}
                          tabIndex={-1}
                          aria-label={localization.selectItem.replace('{0}', name)}
                          onChange={(event) =>
                            selectItem(item, true, (event.nativeEvent as globalThis.MouseEvent).shiftKey)
                          }
                        />
                      </label>
                    )}
                    <div className={classes.preview}>
                      <ContentItemPreview
                        content={item}
                        size={isList ? 24 : isThumbnails ? size.preview : size.icon}
                        thumbnails={isThumbnails}
                      />
                    </div>
                    <div
                      className={clsx(classes.name, { [classes.listName]: isList })}
                      title={
                        item.DisplayName && item.DisplayName !== item.Name ? `${item.DisplayName}\n${item.Name}` : name
                      }>
                      <span className={classes.itemName}>{name}</span>
                      {personalSettings.contentShowType && <span className={classes.itemType}>{item.Type}</span>}
                    </div>
                    <button
                      type="button"
                      className={clsx(classes.actions, { [classes.listControl]: isList })}
                      aria-label={localization.actions.replace('{0}', name)}
                      title={localization.actions.replace('{0}', name)}
                      tabIndex={item.Id === tabStopId ? 0 : -1}
                      onClick={(event) => openContextMenu(event, item)}
                      onDoubleClick={(event) => event.stopPropagation()}
                      data-test="content-view-item-actions">
                      <MoreHoriz fontSize="small" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : !isLoading ? (
          <div className={classes.empty} role="status">
            <FolderOpenOutlined style={{ fontSize: 48 }} />
            <span>{localization.empty}</span>
          </div>
        ) : null}
        {isLoading && (
          <>
            <div className={classes.loadingBar} aria-hidden="true" />
            <div className={classes.loading} role="status">
              <div className={classes.spinner} aria-hidden="true" />
              <span>{localization.loading}</span>
            </div>
          </>
        )}
        {contextMenu && (
          <ContentContextMenu
            content={contextMenu.content}
            isOpened={true}
            onClose={() => setContextMenu(undefined)}
            menuProps={{
              anchorReference: 'anchorPosition',
              anchorPosition: { top: contextMenu.top, left: contextMenu.left },
              onClose: () => setContextMenu(undefined),
              BackdropProps: { onContextMenu: (event) => event.preventDefault() },
            }}
          />
        )}
      </div>
    </DropFileArea>
  )
}
