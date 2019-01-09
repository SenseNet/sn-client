/**
 * @module FieldControls
 *
 */ /** */
import { GenericContent } from '@sensenet/default-content-types'
import { ReactShortTextFieldSetting } from '../ShortText/ShortTextFieldSetting'

/**
 * Interface for DisplayNameFieldSetting properties
 */
export interface ReactDisplayNameFieldSetting<T extends GenericContent = GenericContent, K extends keyof T = 'Name'>
  extends ReactShortTextFieldSetting<T, K> {
  /**
   * Sets whether the Name should be updated according to input text regardless of using the control in a rename scenario or not
   * @default false
   */
  alwaysUpdateName?: boolean
}
