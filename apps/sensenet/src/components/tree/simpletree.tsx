import { Button, LinearProgress, Switch } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon'
import TreeView from '@material-ui/lab/TreeView'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { memo, useCallback, useContext, useEffect, useState } from 'react'

import { useLoadContent } from '../../hooks'
import { ContentContextMenu } from '../context-menu/content-context-menu'
import { ExpandItemsContext } from './Contexts/ExpandedItemsProvider'
import { useTreeLoading } from './Contexts/TreeLoadingProvider'
import { SimpleTreeProps } from './Props/SimpleTreeProps'
import { StyledTreeItem } from './StyledTreeItem'

/** --- ICONS --- */
const MinusSquare = memo((props: SvgIconProps) => (
  <SvgIcon fontSize="inherit" style={{ width: 14, height: 14, opacity: 0.3 }} {...props}>
    <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
  </SvgIcon>
))
MinusSquare.displayName = 'MinusSquare'

const PlusSquare = memo((props: SvgIconProps) => (
  <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
    <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
  </SvgIcon>
))
PlusSquare.displayName = 'PlusSquare'

/** --- STYLES --- */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      borderTop: theme.palette.type === 'light' ? '1px solid #DBDBDB' : '1px solid rgba(255, 255, 255, 0.11)',
    },
    btnCont: {
      position: 'sticky',
      top: 0,
      zIndex: 110,
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '48px',
      boxSizing: 'border-box',
      backgroundColor: theme.palette.background.paper,
      borderBottom: theme.palette.type === 'light' ? '1px solid #DBDBDB' : '1px solid rgba(255, 255, 255, 0.11)',
    },
    progress: {
      position: 'sticky',
      top: 48,
      left: 0,
      width: '100%',
      zIndex: 111,
      marginBottom: -4,
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

export function SimpleTree({ activeItemPath, parentPath, onNavigate }: SimpleTreeProps) {
  const { isTreeLoading, setIsTreeLoading } = useTreeLoading()
  const classes = useStyles()
  const repo = useRepository()
  const { content } = useLoadContent({ idOrPath: activeItemPath })

  const [rootElement, setRootElement] = useState<GenericContent>()
  const expContext = useContext(ExpandItemsContext)
  if (!expContext) {
    throw new Error('SimpleTree must be used within an ExpandItemsProvider')
  }
  const [expandItems, setExpandItems] = expContext
  const [selected, setSelected] = useState('')
  const [editMode, setEditMode] = useState(false)

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
      <div className={classes.btnCont}>
        <Button onClick={() => setEditMode(false)}>View</Button>
        <Switch checked={editMode} onChange={() => setEditMode((prev) => !prev)} />
        <Button
          color={editMode ? 'primary' : 'default'}
          variant={editMode ? 'contained' : 'text'}
          onClick={() => setEditMode(true)}>
          Edit
        </Button>
      </div>

      {/* Loader */}
      {isTreeLoading && <LinearProgress className={classes.progress} />}

      {/* Tree */}
      <TreeView
        selected={selected}
        expanded={[...expandItems]}
        className={classes.root}
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}>
        {rootElement && (
          <StyledTreeItem
            navigate={onNavigate}
            nodeId={String(rootElement.Id)}
            activeitempath={activeItemPath}
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
