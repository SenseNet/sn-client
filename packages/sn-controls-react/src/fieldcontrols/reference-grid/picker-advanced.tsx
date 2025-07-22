/* eslint-disable require-jsdoc */
import { Avatar, createStyles, debounce, makeStyles, SvgIconProps, TextField, useTheme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import SvgIcon from '@material-ui/core/SvgIcon'
import TreeItem from '@material-ui/lab/TreeItem'
import TreeView from '@material-ui/lab/TreeView'
import { ConstantContent, Repository } from '@sensenet/client-core'
import { deepMerge } from '@sensenet/client-utils'
import { GenericContent, ReferenceFieldSetting, User } from '@sensenet/default-content-types'
import { LoadSettingsContext } from '@sensenet/hooks-react'
import { GenericContentWithIsParent } from '@sensenet/pickers-react'
import { Query, QueryExpression, QueryOperators } from '@sensenet/query'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { renderIconDefault } from '../icon'

// Icons
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

// Columns
const baseColumns: ColDef[] = [
  {
    headerName: 'Display Name',
    field: 'DisplayName',
    headerTooltip: 'Display Name',
    flex: 5,
    filter: true,
    sortable: true,
    comparator: (a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()),
    resizable: true,
  },
  {
    headerName: 'Name',
    field: 'Name',
    headerTooltip: 'Name',
    flex: 1.5,
    filter: true,
    sortable: true,
    comparator: (a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()),
    resizable: true,
  },
  {
    headerName: 'Type',
    field: 'Type',
    headerTooltip: 'Type',
    flex: 1,
    filter: true,
    sortable: true,
    resizable: true,
  },
]

// Styles
const useStyles = makeStyles(() =>
  createStyles({
    addWrapper: { position: 'relative', margin: 0 },
    mainCont: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '950px',
      height: '100%',
      overflow: 'auto',
    },
    pickingCont: {
      flex: '5',
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      maxWidth: '950px',
      overflow: 'auto',
    },
    pickedCont: {
      flex: '2',
      display: 'flex',
      width: '100%',
      maxWidth: '950px',
    },
    buttonsCont: {
      display: 'flex',
      justifyContent: 'end',
      gap: '12px',
      padding: '4px',
    },
    treeCont: {
      flex: '1',
      display: 'flex',
      overflow: 'auto',
    },
    gridCont: {
      flex: '2',
      display: 'flex',
    },
    grid: {
      width: '100%',
      height: '100%',
    },
    tree: {
      width: '100%',
      height: '100%',
    },
    treeNode: {
      '& .MuiSvgIcon-root': {
        fontSize: '16px',
      },
      '& .MuiTreeItem-content': {
        padding: '0 4px',
      },
    },
    treeLabel: {
      fontSize: '11px',
    },
    treeIcon: {
      '& svg': {
        height: '18px',
      },
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid grey',
    },
    path: {
      flex: '1',
      fontSize: '12px',
      padding: '4px 12px',
    },
    search: {
      flex: '1',
      width: '100%',
      marginBottom: '4px',
    },
    actionButton: {
      minHeight: '0',
      minWidth: '0',
      padding: '0 12px',
      marginBottom: '4px',
    },
  }),
)

// TreeNode
type TreeNodeProps = {
  node: GenericContent
  repository: Repository
  renderIconLocal: (item: GenericContentWithIsParent | User) => JSX.Element
  path: string
  expanded: string[]
  setExpanded: React.Dispatch<React.SetStateAction<string[]>>
  onSetCurrentPath: (path: string) => void
}
const TreeNode = ({
  node,
  repository,
  renderIconLocal,
  path,
  expanded,
  setExpanded,
  onSetCurrentPath,
}: TreeNodeProps) => {
  const classes = useStyles()
  const [childNodes, setChildNodes] = useState<GenericContent[]>([])
  const loadSettings = useContext(LoadSettingsContext)

  const handleNodeClick = async () => {
    const abortController = new AbortController()
    const childrenResult = await repository.loadCollection<GenericContent>({
      path: node.Path,
      requestInit: { signal: abortController.signal },
      oDataOptions: deepMerge(loadSettings.loadChildrenSettings, {}),
    })

    onSetCurrentPath(node.Path)
    setChildNodes(childrenResult.d.results)

    setExpanded((prevExpanded) =>
      prevExpanded.includes(node.Id.toString()) ? prevExpanded : [...prevExpanded, node.Id.toString()],
    )
  }

  useEffect(() => {
    if (expanded.includes(node.Id.toString()) && childNodes.length === 0) {
      handleNodeClick()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded])

  return (
    <TreeItem
      className={classes.treeNode}
      key={node.Id}
      nodeId={node.Id.toString()}
      label={
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={handleNodeClick}>
          <div className={classes.treeIcon}>{renderIconLocal(node)}</div>
          <div className={classes.treeLabel}>{node.DisplayName}</div>
        </div>
      }
      collapseIcon={<MinusSquare />}
      expandIcon={<PlusSquare />}
      endIcon={<PlusSquare />}>
      {childNodes.map((childNode) => (
        <TreeNode
          key={childNode.Id}
          node={childNode}
          repository={repository}
          renderIconLocal={renderIconLocal}
          path={path}
          expanded={expanded}
          setExpanded={setExpanded}
          onSetCurrentPath={onSetCurrentPath}
        />
      ))}
    </TreeItem>
  )
}

//Picker
interface PickerAdvancedProps<T> {
  defaultValue?: GenericContent[]
  repository: Repository
  path: string
  renderIcon?: (name: T) => JSX.Element
  onCancel?: () => void
  onSubmit?: (selectedItems: GenericContent[]) => void | undefined
  fieldSettings: ReferenceFieldSetting
  selectionRoots?: string[]
}
export const PickerAdvanced: React.FC<PickerAdvancedProps<GenericContentWithIsParent>> = ({
  defaultValue,
  repository,
  path,
  renderIcon,
  onCancel,
  onSubmit,
  fieldSettings,
  selectionRoots,
}) => {
  const classes = useStyles()
  const theme = useTheme()

  const [children, setChildren] = useState<GenericContent[]>([])
  const [currentPath, setCurrentPath] = useState(path)
  const [isInitPath, setIsInitPath] = useState(false)
  const [expanded, setExpanded] = useState<string[]>([])
  const [selectedItems, setSelectedItems] = useState<GenericContent[]>(defaultValue ?? [])
  const [rootElement, setRootElement] = useState<GenericContent>()
  const [searchTerm, setSearchTerm] = useState<string>('')

  const searchFieldRef = useRef<HTMLInputElement | null>(null)

  //Icons
  const iconName = (isFolder?: boolean) => {
    if (isFolder == null) {
      return 'arrow_upward'
    }
    return isFolder ? 'folder' : 'insert_drive_file'
  }
  const renderIconLocal = (item: GenericContentWithIsParent | User) =>
    repository.schemas.isContentFromType<User>(item, 'User') ? (
      (item as User).Avatar?.Url ? (
        <Avatar alt={item.DisplayName} src={`${repository.configuration.repositoryUrl}${(item as User).Avatar!.Url}`} />
      ) : (
        <Avatar alt={item.DisplayName}>
          {item.DisplayName?.split(' ')
            .map((namePart) => namePart[0])
            .join('.')}
        </Avatar>
      )
    ) : renderIcon ? (
      renderIcon(item)
    ) : (
      renderIconDefault(iconName(item.IsFolder))
    )

  //Grid Columns
  const addCol: ColDef = {
    headerName: '',
    field: '',
    width: 66,
    cellRenderer: (props: { data: GenericContent }) => {
      const isDisabled =
        selectedItems.some((item) => item.Id === props.data.Id) ||
        (!fieldSettings.AllowMultiple && selectedItems.length > 0)
      if (isDisabled) return <></>
      return (
        <Button className={classes.actionButton} onClick={() => handleAdd(props.data)}>
          &#10009;
        </Button>
      )
    },
  }
  const removeCol: ColDef = {
    headerName: '',
    field: '',
    width: 66,
    cellRenderer: (props: { data: GenericContent }) => {
      return (
        <Button className={classes.actionButton} onClick={() => handleRemove(props.data)}>
          &#10006;
        </Button>
      )
    },
  }
  const iconCol: ColDef = {
    headerName: '',
    field: 'Icon',
    width: 24,
    minWidth: 24,
    cellRenderer: (props: { data: GenericContent }) => renderIconLocal(props.data),
    cellStyle: { padding: 0 },
  }
  const handleAdd = (item: GenericContent) => {
    setSelectedItems((prev) => [...prev, item])
  }
  const handleRemove = (item: GenericContent) => {
    setSelectedItems((prev) => prev.filter((i) => i.Id !== item.Id))
  }
  const availableCols = [iconCol, ...baseColumns, addCol]
  const selectedCols = [iconCol, ...baseColumns, removeCol]

  //Load Data
  const loadRoot = useCallback(async () => {
    const rootElementPath = '/Root'
    const result = await repository.load<GenericContent>({
      idOrPath: rootElementPath,
      oDataOptions: { select: ['Path', 'DisplayName', 'Name', 'Actions'] },
    })

    setRootElement(result.d)

    const segments = path.split('/').filter(Boolean)
    const expandedIds: string[] = []
    let currentP = ''
    for (const segment of segments) {
      currentP += `/${segment}`
      try {
        const content = await repository.load<GenericContent>({
          idOrPath: currentP,
          oDataOptions: { select: ['Id', 'Path', 'DisplayName'] },
        })
        expandedIds.push(String(content.d.Id))
      } catch (e) {
        console.warn(`Could not load segment at ${currentP}:`, e)
      }
    }

    setExpanded(expandedIds)
  }, [path, repository])

  //Search
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSearchFieldChange = useCallback(
    debounce((term: string) => {
      setSearchTerm(term)
    }, 250),
    [],
  )
  const onSetCurrentPath = (currPath: string) => {
    setCurrentPath(currPath)
    if (currPath === path) {
      setIsInitPath(true)
    }
    setSearchTerm('')
  }

  //Use Effects
  useEffect(() => {
    const fetchChildren = async () => {
      if (!currentPath || !isInitPath) return
      try {
        const y = await repository.loadCollection<GenericContent>({
          path: currentPath,
          oDataOptions: {
            select: ['Id', 'Path', 'Name', 'Type'],
            orderby: 'Name',
            metadata: 'no',
          },
        })
        setChildren(
          y.d.results.sort((a, b) => {
            const aIsFolder = a.Type?.toLowerCase().includes('folder') ?? false
            const bIsFolder = b.Type?.toLowerCase().includes('folder') ?? false
            if (aIsFolder && !bIsFolder) return -1
            if (!aIsFolder && bIsFolder) return 1
            return (a.DisplayName ?? '').localeCompare(b.DisplayName ?? '')
          }),
        )
      } catch (error) {
        console.error(error)
      }
    }
    fetchChildren()
  }, [currentPath, repository, fieldSettings, isInitPath, path])

  useEffect(() => {
    loadRoot()
  }, [loadRoot])

  useEffect(() => {
    const ac = new AbortController()
    const fetchResult = async () => {
      if (!searchTerm) {
        setChildren([])
        return
      }

      try {
        const getQueryFromTerm = () => {
          const query = new Query((q) =>
            q.query((q2) =>
              q2.equals('Name', `*${searchTerm}*`).or.equals('DisplayName', `*${searchTerm}*`).autofilters('OFF'),
            ),
          )

          if (selectionRoots) {
            new QueryOperators(query).and.query((q2) => {
              selectionRoots?.forEach((root, index, array) => {
                new QueryExpression(q2.queryRef).inTree(root)
                if (index < array.length - 1) {
                  return new QueryOperators(q2.queryRef).or
                }
              })
              return q2
            })
          }
          return query
        }

        const response = await repository.loadCollection({
          path: ConstantContent.PORTAL_ROOT.Path,
          oDataOptions: {
            query: getQueryFromTerm().toString(),
          },
          requestInit: { signal: ac.signal },
        })
        setChildren(response.d.results)
      } catch (e) {
        if (!ac.signal.aborted) {
          setChildren([])
        }
      }
    }

    fetchResult()
    return () => ac.abort()
  }, [searchTerm, repository, selectionRoots])

  return (
    <div className={classes.mainCont}>
      <div className={classes.header}>
        <div className={classes.path}>{currentPath}</div>
        <div className={classes.search}>
          <TextField
            ref={searchFieldRef}
            fullWidth={true}
            placeholder={'Search'}
            onChange={(ev) => {
              onSearchFieldChange(ev.target.value)
            }}
          />
        </div>
      </div>
      <div className={classes.pickingCont}>
        <div className={classes.treeCont}>
          <TreeView
            expanded={expanded}
            onNodeToggle={(_, nodeIds) => setExpanded(nodeIds)}
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            className={classes.tree}>
            {rootElement && (
              <TreeNode
                repository={repository}
                node={rootElement}
                renderIconLocal={renderIconLocal}
                path={path}
                expanded={expanded}
                setExpanded={setExpanded}
                onSetCurrentPath={onSetCurrentPath}
              />
            )}
          </TreeView>
        </div>
        <div className={classes.gridCont}>
          <AgGridReact
            rowData={children}
            columnDefs={availableCols}
            className={`${classes.grid} ${theme.palette.type === 'light' ? 'ag-theme-balham' : 'ag-theme-balham-dark'}`}
            tooltipShowDelay={100}
            suppressNoRowsOverlay={true}
          />
        </div>
      </div>
      <div className={classes.pickedCont}>
        <AgGridReact
          rowData={selectedItems}
          columnDefs={selectedCols}
          className={`${classes.grid} ${theme.palette.type === 'light' ? 'ag-theme-balham' : 'ag-theme-balham-dark'}`}
          tooltipShowDelay={100}
          suppressNoRowsOverlay={true}
        />
      </div>
      <div className={classes.buttonsCont}>
        <Button type="button" onClick={() => onCancel?.()}>
          Cancel
        </Button>
        <Button type="button" onClick={() => onSubmit?.(selectedItems)}>
          Submit
        </Button>
      </div>
    </div>
  )
}
