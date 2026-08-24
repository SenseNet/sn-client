import { ColDef, ValueGetterParams } from 'ag-grid-community'
import { LegacyColumnSetting } from '../../services'

const getNestedValue = (source: unknown, fieldPath: string): unknown =>
  fieldPath
    .split(/[/.]/)
    .filter(Boolean)
    .reduce<unknown>((value, segment) => {
      if (Array.isArray(value)) {
        return value.map((item) => getNestedValue(item, segment))
      }
      return value && typeof value === 'object' ? (value as Record<string, unknown>)[segment] : undefined
    }, source)

const formatColumnValue = (value: unknown): string | number | boolean => {
  if (value === null || typeof value === 'undefined') return ''
  if (Array.isArray(value)) return value.map(formatColumnValue).filter(Boolean).join(', ')
  if (typeof value === 'object') {
    const objectValue = value as Record<string, unknown>
    return String(objectValue.DisplayName || objectValue.Name || objectValue.Path || '')
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value
  return String(value)
}

const createCustomColumnDefinition = (setting: LegacyColumnSetting): ColDef => ({
  colId: setting.field,
  headerName: setting.title || setting.field.split('/').pop() || setting.field,
  headerTooltip: setting.title || setting.field,
  valueGetter: (params: ValueGetterParams) => formatColumnValue(getNestedValue(params.data, setting.field)),
  tooltipValueGetter: (params) => String(params.value ?? ''),
  flex: 1.5,
  filter: true,
  sortable: true,
  resizable: true,
})

/** Converts the legacy ColumnSettings.settings contract into AG Grid column definitions. */
export const applyLegacyColumnSettings = (defaultColumnDefs: ColDef[], settings?: LegacyColumnSetting[]): ColDef[] => {
  if (!settings?.length) {
    return defaultColumnDefs.map((column) =>
      column.field === 'Actions' ? { ...column, headerName: '', headerTooltip: undefined } : column,
    )
  }

  const selectionColumns = defaultColumnDefs.filter((column) => !column.field)
  const iconColumn = defaultColumnDefs.find((column) => column.field === 'Icon')
  const actionColumn = defaultColumnDefs.find((column) => column.field === 'Actions')
  const defaultColumnsByField = new Map(
    defaultColumnDefs.filter((column) => column.field).map((column) => [column.field!, column]),
  )
  const configuredColumns = settings
    .filter(({ field }, index, columns) => field && columns.findIndex((column) => column.field === field) === index)
    .filter(({ field }) => field !== 'Icon')
    .map((setting) => {
      const defaultColumn = defaultColumnsByField.get(setting.field)
      if (!defaultColumn) return createCustomColumnDefinition(setting)
      if (setting.field === 'Actions') return { ...defaultColumn, headerName: '', headerTooltip: undefined }
      return {
        ...defaultColumn,
        headerName: setting.title || defaultColumn.headerName || setting.field,
        headerTooltip: setting.title || defaultColumn.headerTooltip || setting.field,
      }
    })

  if (actionColumn && !configuredColumns.some((column) => column.field === 'Actions')) {
    configuredColumns.push({ ...actionColumn, headerName: '', headerTooltip: undefined })
  }

  return [...selectionColumns, ...(iconColumn ? [iconColumn] : []), ...configuredColumns]
}

export const getAvailableColumnSettings = (
  defaultColumnDefs: ColDef[],
  ...settingGroups: Array<LegacyColumnSetting[] | undefined>
): LegacyColumnSetting[] => {
  const columns = [
    ...settingGroups.reduce<LegacyColumnSetting[]>(
      (allSettings, settings) => [...allSettings, ...(settings || [])],
      [],
    ),
    ...defaultColumnDefs
      .filter((column) => column.field && column.field !== 'Icon')
      .map((column) => ({ field: column.field!, title: column.headerName || column.field! })),
  ]
  return columns.filter((column, index) => columns.findIndex((candidate) => candidate.field === column.field) === index)
}
