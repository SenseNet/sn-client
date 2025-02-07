import { Button } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon'
import TreeView from '@material-ui/lab/TreeView'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { useCallback, useState } from 'react'
import { SimpleTreeProps } from './Props/SimpleTreeProps'
import { StyledTreeItem } from './StyledTreeItem'

function MinusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  )
}

function PlusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  )
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      minWidth: 360,
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
  const classes = useStyles()
  const repo = useRepository()
  const [rootElement, setRootElement] = useState<GenericContent>()
  const [elementsLoaded, setElemetnsLoaded] = useState<boolean>()
  const [expandItems, setExpandItems] = useState<string[]>([])
  const addItemToExpanded = useCallback(
    async (content: GenericContent) => {
      if (props.activeItemPath.startsWith(content.Path)) {
        console.log('#tree: additemtoxpand =>', props.activeItemPath, content.Path)
        const expitems: string[] = expandItems
        expitems.push(content.Id.toString())
        console.log('#tree: ExpItems-=>', expandItems)
        setExpandItems(expitems)
      }
    },
    [expandItems, props.activeItemPath],
  )
  const loadRoot = useCallback(async () => {
    if (!elementsLoaded) {
      setElemetnsLoaded(true)
      let rootElementPath = '/Root/Content'
      if (window.location.pathname === '/custom/explorer/root/') {
        rootElementPath = '/Root'
      }
      const result = await repo.load<GenericContent>({
        idOrPath: rootElementPath,
        oDataOptions: { select: ['Path', 'DisplayName', 'Name', 'Actions'] },
      })
      setRootElement(result.d)
      addItemToExpanded(result.d)
    }
  }, [addItemToExpanded, elementsLoaded, repo])
  loadRoot()
  if (rootElement !== undefined) {
    return (
      <>
        <TreeView
          className={`${classes.root}`}
          defaultExpanded={expandItems}
          defaultCollapseIcon={<MinusSquare />}
          defaultExpandIcon={<PlusSquare />}>
          <StyledTreeItem
            addItemToExpanded={addItemToExpanded}
            onNavigate={props.onNavigate}
            nodeId={`${rootElement.Id.toString()}`}
            id="0"
            // itemID={rootElement.Id.toString()}
            label={props.activeItemPath}
            aria-expanded={true}
            isOpen={false}
            parentIsOpen={true}
            contentValue={rootElement}
          />
        </TreeView>
      </>
    )
  } else {
    return <></>
  }
}
