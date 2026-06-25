import { CircularProgress, debounce, LinearProgress, Typography, useTheme } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { CurrentChildrenContext, CurrentChildrenIsLoadingContext, CurrentContentContext } from '@sensenet/hooks-react'
import {
  CellContextMenuEvent,
  ColDef,
  ColumnApi,
  GridApi,
  GridReadyEvent,
  RowClickedEvent,
  RowDoubleClickedEvent,
  SelectionChangedEvent,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useLocalization, usePersonalSettings, useSelectionService } from '../../hooks'
import { ContentContextMenu } from '../context-menu/content-context-menu'
import { DropFileArea } from '../DropFileArea'
import { compareTreeItems } from '../tree/tree-helpers'
import { GridProps } from './Props/GridProps'
import { useGridLoading } from './Providers/GridLoadingProvider'

const SMALL_SCREEN_COL_FILTER = ['Id', 'Actions']

export function Grid<T extends GenericContent = GenericContent>(props: GridProps<T>) {
  const { isGridLoading, setIsGridLoading } = useGridLoading()
  const selectionService = useSelectionService()
  const localization = useLocalization().common
  const personalSettings = usePersonalSettings()
  const parentContent = useContext(CurrentContentContext)
  const currentChildren = useContext(CurrentChildrenContext) as GenericContent[]
  const isCurrentChildrenLoading = useContext(CurrentChildrenIsLoadingContext)
  const children = useMemo(() => {
    return [...currentChildren].sort(compareTreeItems(true, personalSettings.sortFoldersFirst))
  }, [currentChildren, personalSettings.sortFoldersFirst])

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
  const [columnDefs, setColumnDefs] = useState<ColDef[]>(props.colDef)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const setLoadingWithMinDuration = useCallback(
    (isLoading: boolean) => {
      if (isLoading) {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current)
        }
        setIsGridLoading(true)
      } else {
        loadingTimeoutRef.current = setTimeout(() => {
          setIsGridLoading(false)
          loadingTimeoutRef.current = null
        }, 300)
      }
    },
    [setIsGridLoading],
  )

  useEffect(() => {
    setLoadingWithMinDuration(true)
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [parentContent, setLoadingWithMinDuration])

  useEffect(() => {
    if (isGridLoading) {
      setLoadingWithMinDuration(false)
    }
  }, [children, isGridLoading, setLoadingWithMinDuration])

  const onRowDoubleClicked = (item: RowDoubleClickedEvent) => {
    if (item.data) {
      props.onActiveItemChange?.(item.data)
    }
    setLoadingWithMinDuration(true)
    item.data.isFolder ? props.onParentChange(item.data) : props.onActivateItem(item.data)
  }

  const onRowClicked = (item: RowClickedEvent) => {
    if (item.data) {
      props.onActiveItemChange?.(item.data)
    }
  }

  const onSelectionChanged = (params: SelectionChangedEvent) => {
    const selectedIds = params.api.getSelectedRows().map((c) => c.Id)
    const selectedItems: GenericContent[] = children.filter((item) => selectedIds.includes(item.Id))
    selectionService.selection.setValue(selectedItems)
  }

  const onContextMenu = (event: CellContextMenuEvent) => {
    event.event?.preventDefault()
    event.event?.stopPropagation()
    if (!event.node || !event.event) return
    const mouseEvent = event.event as MouseEvent
    setContextMenuItem(event.data)
    event.data && props.onActiveItemChange?.(event.data)
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

  const restoreSortModel = () => {
    if (columnApi.current) {
      const sortModelString = localStorage.getItem(`sortModel-${props.gridKey}`)
      if (sortModelString) {
        const sortModel = JSON.parse(sortModelString)
        sortModel.forEach((s: { colId: string; sort: 'asc' | 'desc' }) => {
          const col = columnApi.current!.getColumnState().find((c) => c.colId === s.colId)
          if (col) {
            columnApi.current!.applyColumnState({
              state: [{ colId: s.colId, sort: s.sort }],
              applyOrder: false,
            })
          }
        })
      }
    }
  }

  const updateColumnDefsBasedOnWindowSize = useCallback(() => {
    const width = window.innerWidth
    if (width < 1536) {
      const filteredCols = props.colDef.filter((col) => !SMALL_SCREEN_COL_FILTER.includes(col.field || ''))
      setColumnDefs(filteredCols)
    } else {
      setColumnDefs(props.colDef)
    }
  }, [props.colDef])

  useEffect(() => {
    const debouncedResize = debounce(updateColumnDefsBasedOnWindowSize, 300)
    debouncedResize()
    window.addEventListener('resize', debouncedResize)

    return () => {
      window.removeEventListener('resize', debouncedResize)
      debouncedResize.clear()
    }
  }, [updateColumnDefsBasedOnWindowSize])

  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api
    columnApi.current = params.columnApi
    restoreColumnFlexRatios()
    restoreSortModel()
    setLoadingWithMinDuration(false)
  }

  useEffect(() => {
    if (gridApi.current) {
      gridApi.current.setColumnDefs([...props.colDef])
    }
  }, [props.colDef])

  const onSortChanged = useCallback(() => {
    if (columnApi.current) {
      const sortModel = columnApi.current
        .getColumnState()
        .filter((c) => c.sort)
        .map((c) => ({
          colId: c.colId,
          sort: c.sort,
        }))
      localStorage.setItem(`sortModel-${props.gridKey}`, JSON.stringify(sortModel))
    }
  }, [props.gridKey])

  const showGridLoading = isGridLoading || isCurrentChildrenLoading

  return (
    <DropFileArea parentContent={parentContent} style={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
      {showGridLoading && (
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
      <div ref={gridRef} style={{ height: '100%', width: '100%' }} aria-busy={showGridLoading}>
        <AgGridReact
          rowData={children}
          columnDefs={columnDefs}
          className={theme.palette.type === 'light' ? 'ag-theme-balham' : 'ag-theme-balham-dark'}
          rowSelection={'multiple'}
          suppressReactUi={true}
          tooltipShowDelay={100}
          onRowClicked={onRowClicked}
          onRowDoubleClicked={onRowDoubleClicked}
          preventDefaultOnContextMenu={true}
          onGridReady={onGridReady}
          onSelectionChanged={onSelectionChanged}
          onCellContextMenu={(event) => onContextMenu(event)}
          onColumnResized={onColumnResized}
          onSortChanged={onSortChanged}
          suppressNoRowsOverlay={true}
        />
      </div>
      {showGridLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 9,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            backgroundColor: theme.palette.type === 'light' ? 'rgba(255, 255, 255, 0.55)' : 'rgba(18, 18, 18, 0.35)',
          }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              color: theme.palette.text.primary,
            }}>
            <CircularProgress size={34} />
            <Typography variant="body2">{localization.loadingContent}</Typography>
          </div>
        </div>
      )}
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
