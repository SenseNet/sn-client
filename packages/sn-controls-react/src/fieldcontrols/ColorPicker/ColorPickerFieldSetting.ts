/**
 * @module FieldControls
 */
import { ReactShortTextFieldSetting } from '../ShortText/ShortTextFieldSetting'

/**
 * Interface for ColorPickerFieldSetting properties
 */
export interface ReactColorPickerFieldSetting extends ReactShortTextFieldSetting {
  /**
   * Array of Strings or Objects, Hex strings for default colors at bottom of picker.
   */
  palette?: string[]
}
