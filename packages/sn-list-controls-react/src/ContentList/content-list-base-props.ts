import { GenericContent, Schema } from '@sensenet/default-content-types'
import { CheckboxProps } from '@material-ui/core/Checkbox'

export interface ContentListBaseProps<T extends GenericContent = GenericContent> {
  /**
   * Array of content items
   */
  items: T[]
  /**
   * Schema object
   */
  schema: Schema
  /**
   * Active content item
   */
  active?: T
  /**
   * Array of selected content items
   * @default []
   */
  selected?: T[]
  /**
   * Array of fields that descibe how the list items should be sorted
   * @default 'DisplayName'
   */
  orderBy?: keyof T
  /**
   * Direction of ordering
   * @default asc
   */
  orderDirection?: 'asc' | 'desc'
  /**
   * Object that contains icon names
   * @default null
   */
  icons?: any
  /**
   * Defines wheter a checkbox per row should be displayed or not
   */
  displayRowCheckbox?: boolean
  /**
   * Called when actionmenu is requested
   */
  onRequestActionsMenu?: (ev: React.MouseEvent, content: T) => void
  /**
   * Called when the order params are changed
   */
  onRequestOrderChange?: (field: keyof T, direction: 'asc' | 'desc') => void
  /**
   * Called when a content item is selected
   */
  onRequestSelectionChange?: (newSelection: T[]) => void
  /**
   * Props for the selection checkbox
   */
  checkboxProps?: CheckboxProps
  /**
   * Optional custom selection component
   */
  getSelectionControl?: (selected: boolean, content: T, callBack: () => void) => JSX.Element
}
