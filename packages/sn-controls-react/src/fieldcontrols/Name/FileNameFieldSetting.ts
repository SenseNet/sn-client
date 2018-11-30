/**
 * @module FieldControls
 *
 */ /** */
import { GenericContent } from '@sensenet/default-content-types'
import { ReactNameFieldSetting } from './NameFieldSetting'

/**
 * Interface for NameFieldSetting properties
 */
export interface ReactFileNameFieldSetting<T extends GenericContent = GenericContent, K extends keyof T = 'Name'>
  extends ReactNameFieldSetting<T, K> {
  'data-extension'?: string
}
