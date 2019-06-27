/**
 * @module FieldControls
 */
import { Repository } from '@sensenet/client-core'
import { FieldSetting, GenericContent } from '@sensenet/default-content-types'

/**
 * Interface for ClientFieldSetting properties
 */
export interface ReactClientFieldSetting<T = FieldSetting, S = GenericContent> {
  settings: T
  content: S
  /**
   * Display mode of the field control
   * @default browse
   */
  actionName?: 'new' | 'edit' | 'browse'
  /**
   * Function for rendering an icon by an iconname given as an input prop
   */
  renderIcon?: (name: string) => JSX.Element
  /**
   * Connected repository
   */
  repository?: Repository
  fieldOnChange?: (field: string, value: any) => void
}
