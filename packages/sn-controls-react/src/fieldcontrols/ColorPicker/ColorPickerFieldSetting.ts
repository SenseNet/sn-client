/**
 * @module FieldControls
 */
import { GenericContent } from '@sensenet/default-content-types'
import { ReactShortTextFieldSetting } from '../ShortText/ShortTextFieldSetting'

/**
 * Interface for ColorPickerFieldSetting properties
 */
export interface ReactColorPickerFieldSetting<T extends GenericContent = GenericContent, K extends keyof T = 'Name'>
  extends ReactShortTextFieldSetting<T, K> {
  /**
   * Sets the display type of the color picker in Edit mode. Can Contain a list of color codes in hex. The color codes must be separated by comma. (e.g. #f0d0c9;#e2a293;#d4735e;#65281a). The default display mode of the Color Field (without adding this property) is the color picker mode.
   * @default false
   */
  palette?: string
}
