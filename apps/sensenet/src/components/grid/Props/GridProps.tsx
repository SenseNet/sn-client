import { GenericContent } from '@sensenet/default-content-types'
import { ColumnSetting } from '@sensenet/list-controls-react/src/ContentList/content-list-base-props'
import { CSSProperties, DetailedHTMLProps, HTMLAttributes } from 'react'

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
  fieldsToDisplay?: Array<ColumnSetting<GenericContent>>
  schema?: string
  onSelectionChange?: (sel: T[]) => void
  onFocus?: () => void
  containerProps?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  disableColumnSettings?: boolean
}
