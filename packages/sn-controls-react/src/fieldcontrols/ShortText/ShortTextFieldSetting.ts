/**
 * @module FieldControls
 */
import { GenericContent } from '@sensenet/default-content-types'
import { ReactClientFieldSetting } from '../ClientFieldSetting'

/**
 * Interface for ShortTextFieldSetting properties
 */
export interface ReactShortTextFieldSetting<T extends GenericContent = GenericContent, K extends keyof T = 'Name'>
  extends ReactClientFieldSetting<T, K> {
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
