import {
  CircularProgress,
  debounce,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
  useTheme,
} from '@material-ui/core'
import { ViewColumnOutlined } from '@material-ui/icons'
import { GenericContent } from '@sensenet/default-content-types'
import {
  CurrentChildrenContext,
  CurrentChildrenIsLoadingContext,
  CurrentContentContext,
  useRepository,
} from '@sensenet/hooks-react'
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
import { ResponsiveContext } from '../../context'
import { useLocalization, usePersonalSettings, useSelectionService } from '../../hooks'
import { isImageContent } from '../../services'
import { ContentContextMenu } from '../context-menu/content-context-menu'
import { useDialog } from '../dialogs'
import { DropFileArea } from '../DropFileArea'
import { useImageGallery } from '../image-gallery'
import { compareTreeItems } from '../tree/tree-helpers'
import { applyLegacyColumnSettings, getAvailableColumnSettings } from './column-settings'
import { GridProps } from './Props/GridProps'
import { useGridLoading } from './Providers/GridLoadingProvider'

const SMALL_SCREEN_COL_FILTER = ['Id']
const MOBILE_SCREEN_COL_FIELDS = ['0', 'Icon', 'DisplayName', 'Name', 'Actions']

const ColumnSettingsHeader = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
    }}>
    <Tooltip title={label}>
      <IconButton
        aria-label={label}
        data-test="column-settings"
        onClick={onClick}
        size="small"
        style={{ pointerEvents: 'auto' }}>
        <ViewColumnOutlined fontSize="small" />
      </IconButton>
    </Tooltip>
  </div>
)

export function Grid<T extends GenericContent = GenericContent>(props: GridProps<T>) {
  const { isGridLoading, setIsGridLoading } = useGridLoading()
  const repository = useRepository()
  const selectionService = useSelectionService()
  const localizationValues = useLocalization()
  const localization = localizationValues.common
  const personalSettings = usePersonalSettings()
  const device = useContext(ResponsiveContext)
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
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { openImageGallery } = useImageGallery()
  const { openDialog } = useDialog()
  const contentFieldColumns = useMemo(() => {
    const fieldsByName = new Map<string, { field: string; title: string }>()
    const contentTypes = Array.from(new Set(children.map((child) => child.Type).filter(Boolean))).sort()

    contentTypes.forEach((contentType) => {
      repository.schemas.getSchemaByName(contentType).FieldSettings.forEach((fieldSetting) => {
        const field = fieldSetting.Name
        const title = fieldSetting.DisplayName || field
        const current = fieldsByName.get(field)
        if (!current || (current.title === field && title !== field)) {
          fieldsByName.set(field, { field, title })
        }
      })
    })

    return Array.from(fieldsByName.values()).sort(
      (left, right) => left.title.localeCompare(right.title) || left.field.localeCompare(right.field),
    )
  }, [children, repository.schemas])
  const availableColumns = useMemo(
    () => getAvailableColumnSettings(props.colDef, contentFieldColumns, props.fieldsToDisplay),
    [contentFieldColumns, props.colDef, props.fieldsToDisplay],
  )
  const openColumnSettings = useCallback(() => {
    if (!props.onColumnSettingsChange) return
    openDialog({
      name: 'column-settings',
      props: {
        columnSettings: props.fieldsToDisplay || [],
        availableColumns,
        defaultColumns: getAvailableColumnSettings(props.colDef),
        settingsSource: props.columnSettingsSource,
        setColumnSettings: props.onColumnSettingsChange,
      },
      dialogProps: { maxWidth: 'sm', fullWidth: true },
    })
  }, [
    availableColumns,
    openDialog,
    props.colDef,
    props.columnSettingsSource,
    props.fieldsToDisplay,
    props.onColumnSettingsChange,
  ])
  const configuredColumns = useMemo(
    () =>
      applyLegacyColumnSettings(props.colDef, props.fieldsToDisplay).map((column) =>
        column.field === 'Actions' && !props.disableColumnSettings && props.onColumnSettingsChange
          ? {
              ...column,
              headerComponent: ColumnSettingsHeader,
              headerComponentParams: {
                onClick: openColumnSettings,
                label: localizationValues.columnSettingsDialog.title,
              },
            }
          : column,
      ),
    [
      localizationValues.columnSettingsDialog.title,
      openColumnSettings,
      props.colDef,
      props.disableColumnSettings,
      props.fieldsToDisplay,
      props.onColumnSettingsChange,
    ],
  )
  const [columnDefs, setColumnDefs] = useState<ColDef[]>(configuredColumns)

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
      if (isImageContent(item.data)) {
        openImageGallery(item.data, children)
        return
      }
      setLoadingWithMinDuration(true)
      props.onParentChange(item.data)
    }
  }

  const onRowClicked = (item: RowClickedEvent) => {
    if (item.data) {
      props.onActiveItemChange?.(item.data)

      const target = item.event?.target as HTMLElement | null
      const isInteractiveTarget = Boolean(target?.closest('button, a, [role="button"], .simpleContextMenu'))

      if (device === 'mobile' && !isInteractiveTarget) {
        if (isImageContent(item.data)) {
          openImageGallery(item.data, children)
          return
        }
        setLoadingWithMinDuration(true)
        props.onParentChange(item.data)
      }
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
    if (width < 600) {
      const mobileCols = configuredColumns.filter((col) => MOBILE_SCREEN_COL_FIELDS.includes(col.field || ''))
      setColumnDefs(mobileCols.length ? mobileCols : configuredColumns.slice(0, 3))
    } else if (width < 1536) {
      const filteredCols = props.fieldsToDisplay?.length
        ? configuredColumns
        : configuredColumns.filter((col) => !SMALL_SCREEN_COL_FILTER.includes(col.field || ''))
      setColumnDefs(filteredCols)
    } else {
      setColumnDefs(configuredColumns)
    }
  }, [configuredColumns, props.fieldsToDisplay])

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
      updateColumnDefsBasedOnWindowSize()
    }
  }, [configuredColumns, updateColumnDefsBasedOnWindowSize])

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

  const showGridLoading = isGridLoading || isCurrentChildrenLoading || props.isColumnSettingsLoading

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
