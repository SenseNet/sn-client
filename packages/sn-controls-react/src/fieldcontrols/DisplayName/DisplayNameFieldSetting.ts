/**
 * @module FieldControls
 */
import { ReactShortTextFieldSetting } from '../ShortText/ShortTextFieldSetting'

/**
 * Interface for DisplayNameFieldSetting properties
 */
export interface ReactDisplayNameFieldSetting extends ReactShortTextFieldSetting {
  /**
   * Sets whether the Name should be updated according to input text regardless of using the control in a rename scenario or not
   * @default false
   */
  alwaysUpdateName?: boolean
}
