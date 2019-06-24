/**
 * @module FieldControls
 */
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Interface for LongTextFieldSetting properties
 */
export interface ReactLongTextFieldSetting extends ReactClientFieldSetting {
  /**
   * Defines the maximum length of the inserted text: 0 to infinite.
   */
  maxLength?: number
  /**
   * Defines the minimum length of the inserted text: 0 to infinite.
   */
  minLength?: number
  /**
   * defines the rendering mode of the input box.
   * @default LongText
   */
  textType: 'LongText' | 'RichText' | 'AdvancedRichText'
}
