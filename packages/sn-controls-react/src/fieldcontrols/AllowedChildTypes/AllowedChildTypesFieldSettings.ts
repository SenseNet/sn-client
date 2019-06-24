/**
 * @module FieldControls
 */
import { GenericContent } from '@sensenet/default-content-types'
import { ReactClientFieldSetting } from '../ClientFieldSetting'

/**
 * Interface for ReactAllowedChildTypesFieldSetting properties
 */
export interface ReactAllowedChildTypesFieldSetting extends ReactClientFieldSetting {
  /**
   * Current content
   */
  content: GenericContent
}
