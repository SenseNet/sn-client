import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { InsertDriveFileOutlined } from '@material-ui/icons'
import TreeItem from '@material-ui/lab/TreeItem'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import { clsx } from 'clsx'
import React, { MouseEventHandler, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router'
import { ResponsivePersonalSettings } from '../../context'
import { usePersonalSettings, useQuery, useSelectionService, useSnRoute } from '../../hooks'
import { getPrimaryActionUrl, navigateToAction } from '../../services'
import { isContentLink, resolveContentLinkTarget } from '../../services/favorites'
import { contentDragAttributes } from '../content/content-drag-drop'
import { ContentContextMenu } from '../context-menu/content-context-menu'
import { Icon } from '../Icon'
import { ExpandItemsContext } from './Contexts/ExpandedItemsProvider'
import { useTreeLoading } from './Contexts/TreeLoadingProvider'
import StyledTreeItemProps from './Props/StyledTreeItemProps'
import { compareTreeItems, getTreeItemLabel, isFolderLikeTreeItem } from './tree-helpers'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    itemRoot: {
      minWidth: 0,
      fontFamily: 'inherit',
      fontSize: 13,
      lineHeight: '20px',
      color: ({ isDisabled }: { isDisabled: boolean }) =>
        isDisabled
          ? `var(--sn-explorer-muted, ${theme.palette.text.disabled})`
          : `var(--sn-explorer-text, ${theme.palette.text.primary})`,
      '& > .MuiTreeItem-content': {
        boxSizing: 'border-box',
        minWidth: 0,
        height: 34,
        padding: '0 8px 0 4px',
        margin: '2px 0',
        borderRadius: 7,
        transition: 'background-color 120ms ease',
      },
      '& > .MuiTreeItem-content:hover': {
        backgroundColor: `var(--sn-explorer-hover, ${theme.palette.action.hover})`,
      },
      '&.Mui-selected > .MuiTreeItem-content, &.Mui-selected > .MuiTreeItem-content:hover': {
        backgroundColor: `var(--sn-explorer-selected, ${theme.palette.action.selected})`,
      },
      '&:focus-visible > .MuiTreeItem-content': {
        outline: `2px solid var(--sn-explorer-accent, ${theme.palette.primary.main})`,
        outlineOffset: -2,
      },
      '&&& > .MuiTreeItem-content > .MuiTreeItem-label': {
        backgroundColor: 'transparent',
        minWidth: 0,
        paddingLeft: 0,
      },
      '& > .MuiTreeItem-content > .MuiTreeItem-iconContainer': {
        width: 18,
        height: 26,
        marginRight: 4,
        alignItems: 'center',
        color: `var(--sn-explorer-muted, ${theme.palette.text.secondary})`,
        '& svg': { width: 14, height: 14 },
      },
      '&& > .MuiCollapse-container.MuiTreeItem-group': {
        marginLeft: 18,
        paddingLeft: 0,
        borderLeft: 0,
      },
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      minWidth: 0,
      width: '100%',
      gap: 8,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
    labelIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '0 0 20px',
      width: 20,
      height: 20,
      '& span': { display: 'block' },
      '& svg, & img': { width: 20, height: 20, objectFit: 'contain' },
    },
    labelText: {
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontSize: 13,
      lineHeight: '20px',
    },
  }),
)

export const StyledTreeItem = ({
  contentvalue,
  activeitempath,
  navigate,
  editMode,
  ...restProps
}: StyledTreeItemProps) => {
  const { setIsTreeLoading, enabledPath } = useTreeLoading()
  const [innerElements, setInnerElements] = useState<React.JSX.Element[]>()
  const [contextMenuItem, setContextMenuItem] = useState<GenericContent | null>(null)
  const [isContextMenuOpened, setIsContextMenuOpened] = useState(false)
  const [contextMenuAnchorPos, setContextMenuAnchorPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  })

  const expContext = useContext(ExpandItemsContext)
  if (!expContext) throw new Error('StyledTreeItem must be used within ExpandItemsProvider')

  const [expandItems, setExpandItems, , , loadChildren] = expContext
  const history = useHistory()
  const repository = useRepository()
  const snRoute = useSnRoute()
  const uiSettings = useContext(ResponsivePersonalSettings)
  const selectionService = useSelectionService()
  const personalSettings = usePersonalSettings()

  const currentPath = useQuery().get('path')
  const mountedRef = useRef(true)

  const path = contentvalue.Path
  const isDisabled = !path.includes(enabledPath)
  const isFolderLike = isFolderLikeTreeItem(contentvalue)
  const classes = useStyles({ isDisabled })
  const itemId = String(contentvalue.Id)

  // Track mount state
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const loadCollectionCB = useCallback(
    async (contentPath: string) => {
      try {
        const children = await loadChildren(contentPath)
        if (!mountedRef.current) return

        const sorted = children
          ? [...children].sort(compareTreeItems(personalSettings.preferDisplayName, personalSettings.sortFoldersFirst))
          : undefined

        const elements = sorted?.map((child) => (
          <StyledTreeItem
            key={child.Id}
            id={String(child.Id)}
            data-id={child.Id}
            activeitempath={activeitempath}
            nodeId={child.Id.toString()}
            contentvalue={child}
            navigate={navigate}
            editMode={editMode}
            onContextMenu={(event) => {
              event.preventDefault()
              event.stopPropagation()
            }}
          />
        ))
        setInnerElements(elements)
      } finally {
        //
      }
    },
    [
      loadChildren,
      personalSettings.preferDisplayName,
      personalSettings.sortFoldersFirst,
      activeitempath,
      navigate,
      editMode,
    ],
  )

  // Load children if expanded
  useEffect(() => {
    if (expandItems.has(itemId)) {
      loadCollectionCB(contentvalue.Path)
    }
  }, [expandItems, itemId, contentvalue.Path, currentPath, loadCollectionCB])

  // Collapse if outside enabledPath
  useEffect(() => {
    const itemPath = contentvalue.Path
    if (!enabledPath.startsWith(itemPath) && !itemPath.startsWith(enabledPath) && expandItems.has(itemId)) {
      setExpandItems((prev) => {
        const updated = new Set(prev)
        updated.delete(itemId)
        return updated
      })
    }
  }, [enabledPath, expandItems, itemId, contentvalue.Path, setExpandItems])

  const getLabel = () => (
    <div className={classes.label}>
      <span className={classes.labelIcon} aria-hidden="true">
        {contentvalue.Icon?.toLowerCase() === 'file' ? (
          <InsertDriveFileOutlined style={{ height: 20, width: 20 }} />
        ) : (
          <Icon item={contentvalue} style={{ height: 20, width: 20, fontSize: 20 }} />
        )}
      </span>
      <span className={classes.labelText} title={getTreeItemLabel(contentvalue, personalSettings.preferDisplayName)}>
        {getTreeItemLabel(contentvalue, personalSettings.preferDisplayName)}
      </span>
    </div>
  )

  const onIconClick: MouseEventHandler = (event) => {
    if (isDisabled || !isFolderLike) return
    event.preventDefault()
    event.stopPropagation()

    setExpandItems((items) => {
      const updated = new Set(items)
      if (updated.has(itemId)) {
        ;(document.activeElement as HTMLElement | null)?.blur()
        updated.delete(itemId)
      } else {
        setIsTreeLoading(true)
        updated.add(itemId)
        loadCollectionCB(contentvalue.Path).finally(() => setIsTreeLoading(false))
      }
      return updated
    })
  }

  const onLabelClick: MouseEventHandler = async (event) => {
    if (isDisabled) return

    if (isContentLink(contentvalue)) {
      setIsTreeLoading(true)
      try {
        const targetContent = await resolveContentLinkTarget(repository, contentvalue)
        const expandedTarget = await repository.load<GenericContent>({
          idOrPath: targetContent.Id || targetContent.Path,
          oDataOptions: {
            select: Array.isArray(repository.configuration.requiredSelect)
              ? ([...repository.configuration.requiredSelect, 'Actions/Name'] as any)
              : repository.configuration.requiredSelect,
            expand: ['Actions'] as any,
          },
        })
        selectionService.activeContent.setValue(expandedTarget.d)
        history.push(
          getPrimaryActionUrl({
            content: expandedTarget.d,
            repository,
            uiSettings,
            location: history.location,
            snRoute,
          }),
        )
      } finally {
        setIsTreeLoading(false)
      }
      return
    }

    const displayName = contentvalue.DisplayName

    if (displayName?.endsWith('.settings') || displayName?.endsWith('.xml')) {
      selectionService.activeContent.setValue(contentvalue)
      history.push(
        getPrimaryActionUrl({ content: contentvalue, repository, uiSettings, location: history.location, snRoute }),
      )
      return
    }

    if (editMode) {
      selectionService.activeContent.setValue(contentvalue)
      navigateToAction({
        history,
        routeMatch: snRoute.match!,
        action: 'edit',
        queryParams: { content: contentvalue.Path.replace(snRoute.path, '') },
      })
    } else {
      selectionService.activeContent.setValue(contentvalue)
      if (!isFolderLike) {
        navigate(contentvalue)
        return
      }

      const itemPath = (event.target as HTMLElement).closest('[data-path]')?.getAttribute('data-path')
      setExpandItems((prev) => {
        const updated = new Set(prev)
        if (!expandItems.has(itemId)) {
          setIsTreeLoading(true)
          updated.add(itemId)
          loadCollectionCB(contentvalue.Path).finally(() => setIsTreeLoading(false))
        } else if (itemPath === activeitempath) {
          updated.delete(itemId)
        }
        return updated
      })
      navigate(contentvalue)
    }
  }

  const onContextMenu = useCallback(
    (event: React.MouseEvent) => {
      if (isDisabled) return
      event.preventDefault()
      event.stopPropagation()
      selectionService.activeContent.setValue(contentvalue)
      setContextMenuItem(contentvalue)
      setContextMenuAnchorPos({ top: event.clientY, left: event.clientX })
      setIsContextMenuOpened(true)
    },
    [contentvalue, isDisabled, selectionService.activeContent],
  )

  return (
    <>
      <TreeItem
        {...restProps}
        {...contentDragAttributes(contentvalue, !isDisabled)}
        className={clsx(classes.itemRoot, restProps.className)}
        label={getLabel()}
        id={itemId}
        data-path={path}
        onIconClick={onIconClick}
        onLabelClick={onLabelClick}
        onContextMenu={onContextMenu}
        expandIcon={(!isFolderLike || isDisabled) && <></>}
        collapseIcon={(!innerElements?.length || isDisabled) && <></>}>
        {innerElements}
        <></>
      </TreeItem>

      {contextMenuItem && (
        <ContentContextMenu
          isOpened={isContextMenuOpened}
          content={contextMenuItem}
          menuProps={{
            anchorReference: 'anchorPosition',
            anchorPosition: contextMenuAnchorPos,
            BackdropProps: {
              onClick: () => setIsContextMenuOpened(false),
              onContextMenu: (ev) => {
                ev.preventDefault()
                ev.stopPropagation()
              },
            },
          }}
          onClose={() => setIsContextMenuOpened(false)}
        />
      )}
    </>
  )
}
