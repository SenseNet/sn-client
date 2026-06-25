import { ListItemIcon, ListItemText } from '@material-ui/core'
import TreeItem from '@material-ui/lab/TreeItem'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { MouseEventHandler, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router'
import { ResponsivePersonalSettings } from '../../context'
import { usePersonalSettings, useQuery, useSelectionService, useSnRoute } from '../../hooks'
import { getPrimaryActionUrl, navigateToAction } from '../../services'
import { ContentContextMenu } from '../context-menu/content-context-menu'
import { Icon } from '../Icon'
import { ExpandItemsContext } from './Contexts/ExpandedItemsProvider'
import { useTreeLoading } from './Contexts/TreeLoadingProvider'
import StyledTreeItemProps from './Props/StyledTreeItemProps'
import { compareTreeItems, getTreeItemLabel } from './tree-helpers'

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
    <>
      <ListItemIcon>
        <Icon item={contentvalue} style={{ height: 20, width: 20, fontSize: 15 }} />
      </ListItemIcon>
      <ListItemText
        style={{ fontSize: '11px', color: isDisabled ? 'grey' : undefined }}
        primary={getTreeItemLabel(contentvalue, personalSettings.preferDisplayName)}
      />
    </>
  )

  const onIconClick: MouseEventHandler = (event) => {
    if (isDisabled) return
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

  const onLabelClick: MouseEventHandler = (event) => {
    if (isDisabled) return
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
        label={getLabel()}
        id={itemId}
        data-path={path}
        onIconClick={onIconClick}
        onLabelClick={onLabelClick}
        onContextMenu={onContextMenu}
        expandIcon={isDisabled ? <></> : undefined}
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
