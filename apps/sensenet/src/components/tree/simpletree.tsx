import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import TreeView from '@material-ui/lab/TreeView'
import { ODataParams } from '@sensenet/client-core'
import { GenericContent, isActionModel } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router'

import { ResponsivePersonalSettings } from '../../context'
import { useLoadContent, useLocalization, useSnRoute } from '../../hooks'
import { getUrlForContent } from '../../services'
import { ContentContextMenu } from '../context-menu/content-context-menu'
import { ExpandItemsContext } from './Contexts/ExpandedItemsProvider'
import { useTreeLoading } from './Contexts/TreeLoadingProvider'
import { FavoritesTree } from './FavoritesTree'
import { SimpleTreeProps } from './Props/SimpleTreeProps'
import { StyledTreeItem } from './StyledTreeItem'
import { getTreeModeAction, getTreeModeTargetPath, isTreeEditAction } from './tree-mode-navigation'

const modeContentOptions: ODataParams<GenericContent> = {
  select: ['Id', 'Path', 'Name', 'DisplayName', 'Type', 'IsFolder', 'Actions', 'Icon', 'ParentId'],
  expand: ['Actions'],
  scenario: 'ContextMenu',
}

const TreeChevron = ({ expanded = false }: { expanded?: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transform: expanded ? 'rotate(90deg)' : undefined }}
    aria-hidden="true">
    <path d="m5 3 4 4-4 4" />
  </svg>
)

/** --- STYLES --- */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      minWidth: 0,
      boxSizing: 'border-box',
      padding: '8px 10px 18px',
      backgroundColor: `var(--sn-explorer-sidebar, ${theme.palette.background.paper})`,
      color: `var(--sn-explorer-text, ${theme.palette.text.primary})`,
    },
    btnCont: {
      position: 'sticky',
      top: 0,
      zIndex: 110,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 56,
      padding: '10px 14px',
      boxSizing: 'border-box',
      backgroundColor: `var(--sn-explorer-sidebar, ${theme.palette.background.paper})`,
      borderBottom: `1px solid var(--sn-explorer-border, ${theme.palette.divider})`,
    },
    modeControl: {
      display: 'grid',
      boxSizing: 'border-box',
      gridTemplateColumns: '1fr 1fr',
      gap: 2,
      padding: 3,
      width: '100%',
      maxWidth: 220,
      border: `1px solid var(--sn-explorer-border, ${theme.palette.divider})`,
      borderRadius: 9,
      backgroundColor: `var(--sn-explorer-bg, ${theme.palette.background.default})`,
    },
    modeButton: {
      minWidth: 0,
      height: 28,
      padding: '0 10px',
      border: 0,
      borderRadius: 6,
      background: 'transparent',
      color: `var(--sn-explorer-muted, ${theme.palette.text.secondary})`,
      font: 'inherit',
      fontSize: 13,
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'background-color 120ms ease, color 120ms ease',
      '&:hover': { backgroundColor: `var(--sn-explorer-hover, ${theme.palette.action.hover})` },
      '&:disabled': { opacity: 0.45, cursor: 'default' },
      '&[aria-pressed="true"]': {
        backgroundColor: `var(--sn-explorer-surface, ${theme.palette.background.paper})`,
        color: `var(--sn-explorer-text, ${theme.palette.text.primary})`,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
      },
      '&:focus-visible': {
        outline: `2px solid var(--sn-explorer-accent, ${theme.palette.primary.main})`,
        outlineOffset: 1,
      },
    },
    progress: {
      position: 'sticky',
      top: 56,
      left: 0,
      width: '100%',
      height: 2,
      zIndex: 111,
      marginBottom: -2,
      backgroundColor: `var(--sn-explorer-accent, ${theme.palette.primary.main})`,
    },
  }),
)

/** --- COMPONENT --- */
const normalizePath = (path: string) => (path.startsWith('/') ? path : `/${path}`)

const getPathChain = (rootPath: string, activePath?: string) => {
  const root = normalizePath(rootPath || '/Root')
  const active = normalizePath(activePath || root)

  if (active !== root && !active.startsWith(`${root}/`)) {
    return [root]
  }

  const rootSegments = root.split('/').filter(Boolean)
  const activeSegments = active.split('/').filter(Boolean)

  return [
    root,
    ...activeSegments
      .slice(rootSegments.length)
      .map((_, index) => `/${activeSegments.slice(0, rootSegments.length + index + 1).join('/')}`),
  ]
}

export function SimpleTree({ activeItemPath, parentPath, rootPath: explorerRoot, onNavigate }: SimpleTreeProps) {
  const { isTreeLoading, setIsTreeLoading } = useTreeLoading()
  const classes = useStyles()
  const localization = useLocalization()
  const repo = useRepository()
  const history = useHistory()
  const location = useLocation()
  const snRoute = useSnRoute()
  const uiSettings = useContext(ResponsivePersonalSettings)
  const rootPath = explorerRoot || snRoute.path || parentPath
  const action = snRoute.match?.params.action
  const editMode = isTreeEditAction(action)
  const targetPath = getTreeModeTargetPath({ rootPath, currentPath: activeItemPath, action, search: location.search })
  const { content: loadedContent } = useLoadContent({ idOrPath: targetPath, oDataOptions: modeContentOptions })
  const content = loadedContent?.Path.toLowerCase() === targetPath.toLowerCase() ? loadedContent : undefined
  const contentActions = content?.Actions
  const editForbidden =
    isActionModel(contentActions) && contentActions.some((item) => item.Name === 'Edit' && item.Forbidden)

  const changeMode = (edit: boolean) => {
    if (!content || edit === editMode || (edit && editForbidden)) return
    // Use normal history navigation: editor blockers can reject the transition,
    // and the pressed mode changes only when the route actually changes.
    history.push(
      getUrlForContent({
        content,
        uiSettings,
        location: history.location,
        snRoute: { ...snRoute, path: rootPath },
        action: getTreeModeAction(content, edit),
      }),
    )
  }

  const [rootElement, setRootElement] = useState<GenericContent>()
  const expContext = useContext(ExpandItemsContext)
  if (!expContext) {
    throw new Error('SimpleTree must be used within an ExpandItemsProvider')
  }
  const [expandItems, setExpandItems] = expContext
  const [selected, setSelected] = useState('')

  // context menu
  const [contextMenuItem, setContextMenuItem] = useState<GenericContent | null>(null)
  const [isContextMenuOpened, setIsContextMenuOpened] = useState(false)
  const [contextMenuAnchorPos, setContextMenuAnchorPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

  /** load root + expand parents */
  const loadRoot = useCallback(async () => {
    setIsTreeLoading(true)
    try {
      const result = await repo.load<GenericContent>({
        idOrPath: parentPath || '/Root',
        oDataOptions: {
          select: ['Id', 'Path', 'DisplayName', 'Name', 'Type', 'Actions', 'Icon', 'ParentId', 'IsFolder'],
        },
      })
      setRootElement(result.d)

      const activePath = content?.Path || result.d.Path
      const pathsToExpand = getPathChain(result.d.Path, activePath)

      const parentContents = await Promise.all(
        pathsToExpand.map((path) =>
          path === result.d.Path ? Promise.resolve(result) : repo.load<GenericContent>({ idOrPath: path }),
        ),
      )

      setSelected(String(parentContents.at(-1)?.d.Id ?? ''))

      setExpandItems((prev) => {
        const updated = new Set(prev)
        parentContents.forEach((p) => p?.d?.Id && updated.add(String(p.d.Id)))
        return updated
      })
    } finally {
      setIsTreeLoading(false)
    }
  }, [repo, parentPath, content, setExpandItems, setIsTreeLoading])

  useEffect(() => {
    loadRoot()
  }, [loadRoot])

  /** context menu handler */
  const onContextMenu = (event: React.MouseEvent, data: GenericContent) => {
    event.preventDefault()
    setContextMenuItem(data)
    setContextMenuAnchorPos({ top: event.clientY, left: event.clientX })
    setIsContextMenuOpened(true)
  }

  return (
    <>
      {/* Toolbar */}
      <div className={classes.btnCont} data-test="tree-mode-toolbar">
        <div
          className={classes.modeControl}
          role="group"
          aria-label={`${localization.contentViews.view} / ${localization.settings.edit}`}>
          <button
            type="button"
            className={classes.modeButton}
            aria-pressed={!editMode}
            onClick={() => changeMode(false)}
            disabled={!content}
            data-test="tree-mode-view">
            {localization.contentViews.view}
          </button>
          <button
            type="button"
            className={classes.modeButton}
            aria-pressed={editMode}
            onClick={() => changeMode(true)}
            disabled={!content || editForbidden}
            data-test="tree-mode-edit">
            {localization.settings.edit}
          </button>
        </div>
      </div>

      {/* Loader */}
      {isTreeLoading && (
        <div className={classes.progress} role="progressbar" aria-label={localization.common.loadingContent} />
      )}

      <FavoritesTree activeItemPath={targetPath} editMode={editMode} onNavigate={onNavigate} />

      {/* Tree */}
      <TreeView
        selected={selected}
        expanded={[...expandItems]}
        className={classes.root}
        aria-busy={isTreeLoading}
        defaultCollapseIcon={<TreeChevron expanded />}
        defaultExpandIcon={<TreeChevron />}>
        {rootElement && (
          <StyledTreeItem
            navigate={onNavigate}
            nodeId={String(rootElement.Id)}
            activeitempath={targetPath}
            data-id={rootElement.Id}
            contentvalue={rootElement}
            onContextMenu={(e) => onContextMenu(e, rootElement)}
            editMode={editMode}
          />
        )}
      </TreeView>

      {/* Context menu */}
      {contextMenuItem && (
        <ContentContextMenu
          isOpened={isContextMenuOpened}
          content={contextMenuItem}
          menuProps={{
            anchorReference: 'anchorPosition',
            anchorPosition: contextMenuAnchorPos,
            BackdropProps: {
              onClick: () => setIsContextMenuOpened(false),
              onContextMenu: (e) => e.preventDefault(),
            },
          }}
          onClose={() => setIsContextMenuOpened(false)}
        />
      )}
    </>
  )
}
