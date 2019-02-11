/**
 * @module FieldControls
 *
 */ /** */
import { GenericContent } from '@sensenet/default-content-types'
import { ReactReferenceFieldSetting } from '../ReferenceFieldSetting'

/**
 * Interface for NameFieldSetting properties
 */
export interface ReactImageFieldSetting<T extends GenericContent = GenericContent, K extends keyof T = 'Name'>
  extends ReactReferenceFieldSetting<T, K> {
  /**
   * Url of the repository
   * @default '''
   */
  repositoryUrl?: string
}
