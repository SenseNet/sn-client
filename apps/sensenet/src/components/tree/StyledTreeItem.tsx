import { ListItemIcon, ListItemText } from '@material-ui/core'
import TreeItem from '@material-ui/lab/TreeItem'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { MouseEventHandler, useCallback, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { ResponsivePersonalSettings } from '../../context'
import { useQuery, useSnRoute } from '../../hooks'
import { getPrimaryActionUrl, navigateToAction } from '../../services'
import { ContentContextMenu } from '../context-menu/content-context-menu'
import { Icon } from '../Icon'
import { ExpandItemsContext } from './Contexts/ExpandedItemsProvider'
import { useTreeLoading } from './Contexts/TreeLoadingProvider'
import StyledTreeItemProps from './Props/StyledTreeItemProps'

export const StyledTreeItem = (props: StyledTreeItemProps) => {
  const { setIsTreeLoading, enabledPath } = useTreeLoading()
  const [hasChildren, setHasChildren] = useState<boolean>(true)
  const [innerElements, setInnerElements] = useState<React.JSX.Element[]>()
  const expContext = useContext(ExpandItemsContext)
  const currentPath = useQuery().get('path')
  if (!expContext) {
    throw new Error('MyComponent must be used within a ExpandItemsProvider')
  }
  const [expandItems, setExpandItems, _expandOriginalItems, _setExpandOriginalItems, loadChildren] = expContext
  const [contextMenuItem, setContextMenuItem] = useState<GenericContent | null>(null)
  const [isContextMenuOpened, setIsContextMenuOpened] = useState(false)
  const [contextMenuAnchorPos, setContextMenuAnchorPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  })
  const path = props.contentvalue.Path
  const isDisabled = !path.includes(enabledPath)
  const history = useHistory()
  const repository = useRepository()
  const { location } = history
  const snRoute = useSnRoute()
  const uiSettings = useContext(ResponsivePersonalSettings)

  const loadCollectionCB = useCallback(
    async (contentPath: string): Promise<void> => {
      try {
        const children = await loadChildren(contentPath)
        children?.sort((a, b) => {
          const isAFolder = a.Type.toLowerCase().includes('folder') ? 0 : 1
          const isBFolder = b.Type.toLowerCase().includes('folder') ? 0 : 1
          if (isAFolder !== isBFolder) {
            return isAFolder - isBFolder
          }
          return a.Name.localeCompare(b.Name)
        })

        const elements = children?.map((innerChild: GenericContent) => (
          <StyledTreeItem
            id={String(innerChild.Id)}
            key={innerChild.Id}
            data-id={innerChild.Id}
            activeitempath={props.activeitempath}
            nodeId={innerChild.Id.toString()}
            contentvalue={innerChild}
            navigate={props.navigate}
            editMode={props.editMode}
            onContextMenu={(event) => {
              event.preventDefault()
              event.stopPropagation()
            }}
          />
        ))

        if (elements) {
          setHasChildren(elements.length > 0)
          setInnerElements(elements)
        }
      } finally {
        //
      }
    },
    [loadChildren, props.activeitempath, props.navigate, props.editMode],
  )

  const { navigate, ...restProps } = props
  useEffect(() => {
    const itemId = String(props.contentvalue.Id)
    if (expandItems.has(itemId)) {
      loadCollectionCB(props.contentvalue.Path)
    }
  }, [props, expandItems, loadCollectionCB, currentPath])

  useEffect(() => {
    const itemId = String(props.contentvalue.Id)
    const itemPath = props.contentvalue.Path

    if (!enabledPath.startsWith(itemPath) && !itemPath.startsWith(enabledPath) && expandItems.has(itemId)) {
      setExpandItems((prev) => {
        const updated = new Set(prev)
        updated.delete(itemId)
        return updated
      })
    }
  }, [enabledPath, expandItems, props.contentvalue.Id, props.contentvalue.Path, setExpandItems])

  const getLabel = () => {
    return (
      <>
        <ListItemIcon key={props.contentvalue.Id}>
          <Icon item={props.contentvalue} />
        </ListItemIcon>
        <ListItemText
          style={{ fontSize: '11px!important', color: isDisabled ? 'grey' : '' }}
          primary={`${props.contentvalue.Name}`}
        />
      </>
    )
  }

  const onIconClick: MouseEventHandler = (event) => {
    if (isDisabled) return
    event.preventDefault()
    event.stopPropagation()
    setExpandItems((eItems) => {
      const updatedItems = new Set(eItems)
      const itemId = props.contentvalue.Id.toString()
      if (updatedItems.has(itemId)) {
        if (document.activeElement) {
          ;(document.activeElement as HTMLElement).blur()
        }
        updatedItems.delete(itemId)
      } else {
        setIsTreeLoading(true)
        updatedItems.add(itemId)
        loadCollectionCB(props.contentvalue.Path).finally(() => setIsTreeLoading(false))
      }
      return updatedItems
    })
  }

  const onLabelClick: MouseEventHandler = (event) => {
    if (isDisabled) return
    const displayName = props.contentvalue.DisplayName
    if (displayName?.endsWith('.settings') || displayName?.endsWith('.xml')) {
      history.push(getPrimaryActionUrl({ content: props.contentvalue, repository, uiSettings, location, snRoute }))
      return
    }
    if (props.editMode) {
      navigateToAction({
        history,
        routeMatch: snRoute.match!,
        action: 'edit',
        queryParams: { content: props.contentvalue.Path.replace(snRoute.path, '') },
      })
    } else {
      const itemPath = (event.target as HTMLElement).closest('[data-path]')?.getAttribute('data-path')
      const itemId = props.contentvalue.Id.toString()
      setExpandItems((prevItems) => {
        const updatedItems = new Set(prevItems)
        if (!expandItems.has(itemId)) {
          setIsTreeLoading(true)
          updatedItems.add(itemId)
          loadCollectionCB(props.contentvalue.Path).finally(() => setIsTreeLoading(false))
        } else {
          if (itemPath === props.activeitempath) {
            updatedItems.delete(itemId)
          }
        }
        return updatedItems
      })
      props.navigate(props.contentvalue)
    }
  }

  const onContextMenu = (event: React.MouseEvent, data: GenericContent) => {
    if (isDisabled) return
    event.preventDefault()
    event.stopPropagation()
    setContextMenuItem(data)
    setContextMenuAnchorPos({ top: event.clientY, left: event.clientX })
    setIsContextMenuOpened(true)
  }

  return (
    <>
      <TreeItem
        {...restProps}
        label={getLabel()}
        id={props.contentvalue.Id.toString()}
        data-path={props.contentvalue.Path}
        onIconClick={onIconClick}
        onLabelClick={onLabelClick}
        onContextMenu={(event) => onContextMenu(event, props.contentvalue)}
        expandIcon={isDisabled ? <></> : undefined}
        collapseIcon={(!hasChildren || isDisabled) && <></>}>
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
