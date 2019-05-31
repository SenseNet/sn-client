/**
 * @module FieldControls
 */
import { GenericContent } from '@sensenet/default-content-types'
import { ReactNameFieldSetting } from './NameFieldSetting'

/**
 * Interface for FileNameFieldSetting properties
 */
export interface ReactFileNameFieldSetting<T extends GenericContent = GenericContent, K extends keyof T = 'Name'>
  extends ReactNameFieldSetting<T, K> {
  /**
   * Extension of the content
   */
  'data-extension'?: string
  /**
   * Current content
   */
  content?: GenericContent
}
