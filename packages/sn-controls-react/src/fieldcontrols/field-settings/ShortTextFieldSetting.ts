/**
 * @module FieldControls
 */
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Interface for ShortTextFieldSetting properties
 */
export interface ReactShortTextFieldSetting extends ReactClientFieldSetting {
  // TODO: add these props to shorttext
  /**
   * Maximum length of the text
   */
  maxLength?: number
  /**
   * Minimum length of the text
   */
  minLength?: number
  /**
   * Contains common regular expression against which the Field is validated
   */
  regex?: string
}
