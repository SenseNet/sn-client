import { LinearProgress } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon'
import TreeView from '@material-ui/lab/TreeView'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLoadContent } from '../../hooks'
import { ContentContextMenu } from '../context-menu/content-context-menu'
import { ExpandItemsContext } from './Contexts/ExpandedItemsProvider'
import { useTreeLoading } from './Contexts/TreeLoadingProvider'
import { SimpleTreeProps } from './Props/SimpleTreeProps'
import { StyledTreeItem } from './StyledTreeItem'

function MinusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14, opacity: 0.3 }} {...props}>
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  )
}

function PlusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  )
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    '& .MuiListItemText-primary.MuiTypography-body1': {
      fontSize: '10px!important',
    },
  }),
)

export function SimpleTree(props: SimpleTreeProps) {
  const { isTreeLoading, setIsTreeLoading } = useTreeLoading()
  const classes = useStyles()
  const repo = useRepository()
  const { content } = useLoadContent({ idOrPath: props.activeItemPath })
  const [rootElement, setRootElement] = useState<GenericContent>()
  const expContext = useContext(ExpandItemsContext)
  if (!expContext) {
    throw new Error('SimpleTree must be used within a ExpandItemsProvider')
  }
  const [expandItems, setExpandItems] = expContext
  const [contextMenuItem, setContextMenuItem] = useState<GenericContent | null>(null)
  const [isContextMenuOpened, setIsContextMenuOpened] = useState(false)
  const [contextMenuAnchorPos, setContextMenuAnchorPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  })
  const [selected, setSelected] = useState<string>('')

  const loadRoot = useCallback(async () => {
    setIsTreeLoading(true)
    const rootElementPath = '/Root'
    const result = await repo.load<GenericContent>({
      idOrPath: rootElementPath,
      oDataOptions: { select: ['Path', 'DisplayName', 'Name', 'Actions'] },
    })
    setRootElement(result.d)
    if (!content) return
    const p = content.Path ?? ''
    const segments = p.split('/').filter(Boolean)
    setExpandItems((prevExpandItems) => {
      const updatedExpandItems = new Set(prevExpandItems)
      const parentContentPromises = segments.map((_, index) => {
        const currentPath = `/${segments.slice(0, index + 1).join('/')}`
        return repo.load<GenericContent>({ idOrPath: currentPath })
      })
      Promise.all(parentContentPromises).then((parentContents) => {
        setSelected(String(parentContents[parentContents.length - 1].d.Id))
        parentContents.forEach((parent) => {
          if (parent?.d?.Id) updatedExpandItems.add(String(parent.d.Id))
        })
        if (prevExpandItems.size !== updatedExpandItems.size) {
          setExpandItems(updatedExpandItems)
        }
      })
      return prevExpandItems
    })
  }, [repo, content, setExpandItems, setIsTreeLoading])

  useEffect(() => {
    loadRoot().finally(() => {
      setIsTreeLoading(false)
    })
  }, [loadRoot, setIsTreeLoading])

  const onContextMenu = (event: React.MouseEvent, data: GenericContent) => {
    event.preventDefault()
    event.stopPropagation()
    setContextMenuItem(data)
    setContextMenuAnchorPos({ top: event.clientY, left: event.clientX })
    setIsContextMenuOpened(true)
  }

  return (
    <>
      {isTreeLoading && (
        <LinearProgress
          style={{ position: 'sticky', top: '0', left: '0', width: '100%', zIndex: '100', marginBottom: '-4px' }}
        />
      )}
      <TreeView
        selected={selected}
        expanded={[...expandItems]}
        className={classes.root}
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}>
        {rootElement && (
          <StyledTreeItem
            navigate={props.onNavigate}
            nodeId={rootElement?.Id.toString()}
            activeitempath={props.activeItemPath}
            data-id={rootElement?.Id}
            contentvalue={rootElement}
            onContextMenu={(event) => onContextMenu(event, rootElement)}
          />
        )}
      </TreeView>
      {contextMenuItem && (
        <ContentContextMenu
          isOpened={isContextMenuOpened}
          content={contextMenuItem}
          menuProps={{
            anchorReference: 'anchorPosition',
            anchorPosition: contextMenuAnchorPos,
            BackdropProps: {
              onClick: () => setIsContextMenuOpened(false),
              onContextMenu: (ev) => ev.preventDefault(),
            },
          }}
          onClose={() => setIsContextMenuOpened(false)}
        />
      )}
    </>
  )
}
