import { FieldSetting, GenericContent } from '@sensenet/default-content-types'
import { ContentListProps } from '../ContentList'

export interface CellProps<T extends GenericContent, K extends keyof T> extends ContentListProps<T> {
    content: T,
    field: K
    isSelected: boolean
    fieldSetting?: FieldSetting
}
