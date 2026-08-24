import { GenericContent } from '@sensenet/default-content-types'
import { ColDef } from 'ag-grid-community'
import { CSSProperties, DetailedHTMLProps, HTMLAttributes } from 'react'
import { ColumnSettingsSource, LegacyColumnSetting, LegacyColumnSettings } from '../../../services'

export interface GridProps<T extends GenericContent> {
  enableBreadcrumbs?: boolean
  hideHeader?: boolean
  disableSelection?: boolean
  parentIdOrPath: number | string
  onParentChange: (newParent: T) => void
  onTabRequest?: () => void
  onActiveItemChange?: (item: T) => void
  onActivateItem: (item: T) => void
  style?: CSSProperties
  containerRef?: (r: HTMLDivElement | null) => void
  fieldsToDisplay?: LegacyColumnSetting[]
  schema?: string
  onSelectionChange?: (sel: T[]) => void
  onFocus?: () => void
  containerProps?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  disableColumnSettings?: boolean
  colDef: ColDef[]
  gridKey: string
  onColumnSettingsChange?: (settings: LegacyColumnSettings, targetIdOrPath?: string | number) => void | Promise<void>
  columnSettingsSource?: ColumnSettingsSource
  isColumnSettingsLoading?: boolean
}
