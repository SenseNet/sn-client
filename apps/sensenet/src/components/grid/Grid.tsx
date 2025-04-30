import { LinearProgress, useTheme } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { CurrentChildrenContext, CurrentContentContext } from '@sensenet/hooks-react'
import {
  CellContextMenuEvent,
  ColDef,
  ColumnApi,
  GridApi,
  GridReadyEvent,
  RowDoubleClickedEvent,
  SelectionChangedEvent,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSelectionService } from '../../hooks'
import { ContentContextMenu } from '../context-menu/content-context-menu'
import { DropFileArea } from '../DropFileArea'
import { contentColumnDefs } from './Cols/ColumnDefs.'
import { GridProps } from './Props/GridProps'
import { useGridLoading } from './Providers/GridLoadingProvider'

export function Grid<T extends GenericContent = GenericContent>(this: any, props: GridProps<T>) {
  const { isGridLoading, setIsGridLoading } = useGridLoading()
  const selectionService = useSelectionService()
  const parentContent = useContext(CurrentContentContext)
  const children = (useContext(CurrentChildrenContext) as GenericContent[]).sort((a, b) => {
    const aIsFolder = a.Type?.toLowerCase().includes('folder') ?? false
    const bIsFolder = b.Type?.toLowerCase().includes('folder') ?? false

    if (aIsFolder && !bIsFolder) return -1
    if (!aIsFolder && bIsFolder) return 1

    return (a.DisplayName ?? '').localeCompare(b.DisplayName ?? '')
  })

  const theme = useTheme()
  const [contextMenuItem, setContextMenuItem] = useState<GenericContent | null>(null)
  const [isContextMenuOpened, setIsContextMenuOpened] = useState(false)
  const [contextMenuAnchorPos, setContextMenuAnchorPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  })
  const gridApi = useRef<GridApi | null>(null)
  const columnApi = useRef<ColumnApi | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const fixedColumns: string[] = ['0', 'Icon', 'Actions']

  const [columnDefs, setColumnDefs] = useState<ColDef[]>(props.colDef ?? contentColumnDefs)

  useEffect(() => {
    setIsGridLoading(false)
  }, [children, setIsGridLoading])

  useEffect(() => {
    setIsGridLoading(true)
  }, [parentContent, setIsGridLoading])

  const onRowDoubleClicked = (item: RowDoubleClickedEvent) => {
    setIsGridLoading(true)
    item.data.isFolder ? props.onParentChange(item.data) : props.onActivateItem(item.data)
  }

  const onSelectionChanged = (params: SelectionChangedEvent) => {
    const selectedIds = params.api.getSelectedRows().map((c) => c.Id)
    const x: GenericContent[] = []
    for (const id of selectedIds) {
      if (children.length) {
        const item = children.find((c) => c.Id === id)
        if (item) {
          x.push(item)
        }
      }
    }
    selectionService.selection.setValue(x)
  }

  const onContextMenu = (event: CellContextMenuEvent) => {
    event.event?.preventDefault()
    event.event?.stopPropagation()
    if (!event.node || !event.event) return
    const mouseEvent = event.event as MouseEvent
    setContextMenuItem(event.data)
    setContextMenuAnchorPos({ top: mouseEvent.clientY, left: mouseEvent.clientX })
    setIsContextMenuOpened(true)
  }

  const onColumnResized = (event: any) => {
    if (event.finished) {
      saveColumnFlexRatios()
    }
  }

  const restoreColumnFlexRatios = () => {
    if (columnApi.current) {
      const savedRatios = localStorage.getItem('gridColumnFlexRatios')
      if (savedRatios) {
        const flexRatios = JSON.parse(savedRatios)
        const updatedDefs = columnDefs.map((col) => {
          const savedRatio = flexRatios.find((r: { colId: string; flex: number }) => r.colId === col.field)
          return savedRatio ? { ...col, flex: savedRatio.flex } : col
        })
        setColumnDefs(updatedDefs)
      }
    }
  }

  const saveColumnFlexRatios = () => {
    if (columnApi.current && gridRef.current) {
      const totalWidth = gridRef.current.clientWidth
      const columnState = columnApi.current.getColumnState()
      const flexRatios = columnState
        .filter((col) => !fixedColumns.includes(col.colId))
        .map((col) => ({
          colId: col.colId,
          flex: col.width
            ? (col.width / totalWidth) * 10
            : columnDefs.find((d: { field: string }) => d.field === col.colId)?.flex || 1,
        }))
      localStorage.setItem('gridColumnFlexRatios', JSON.stringify(flexRatios))
    }
  }

  const onGridReady = (params: GridReadyEvent) => {
    setIsGridLoading(false)
    gridApi.current = params.api
    columnApi.current = params.columnApi
    restoreColumnFlexRatios()
  }

  useEffect(() => {
    if (gridApi.current) {
      gridApi.current.setColumnDefs([...props.colDef])
    }
  }, [props.colDef])

  return (
    <DropFileArea parentContent={parentContent} style={{ height: '100%', overflow: 'hidden' }}>
      {isGridLoading && (
        <LinearProgress
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 10,
          }}
        />
      )}
      <div ref={gridRef} style={{ height: '100%', width: '100%' }}>
        <AgGridReact
          rowData={children}
          columnDefs={columnDefs}
          className={theme.palette.type === 'light' ? 'ag-theme-balham' : 'ag-theme-balham-dark'}
          rowSelection={'multiple'}
          tooltipShowDelay={100}
          onRowDoubleClicked={onRowDoubleClicked}
          preventDefaultOnContextMenu={true}
          onGridReady={onGridReady}
          onSelectionChanged={onSelectionChanged}
          onCellContextMenu={(event) => onContextMenu(event)}
          onColumnResized={onColumnResized}
        />
      </div>
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
    </DropFileArea>
  )
}
