import { FieldSetting, GenericContent } from '@sensenet/default-content-types'
import { ContentListProps } from '../ContentList'

export interface CellProps<T extends GenericContent = GenericContent, K extends keyof T = keyof GenericContent>
  extends ContentListProps<T> {
  content: T
  field: K
  isSelected: boolean
  fieldSetting?: FieldSetting
}
