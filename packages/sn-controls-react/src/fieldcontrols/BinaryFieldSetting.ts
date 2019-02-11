/**
 * @module FieldControls
 *
 */ /** */
import { Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Interface for ShortTextFieldSetting properties
 */
export interface ReactBinaryFieldSetting<T extends GenericContent = GenericContent, K extends keyof T = 'Name'>
  extends ReactClientFieldSetting<T, K> {
  /**
   * Path of the folder where the file should be uploaded
   */
  'data-onChange'?: () => void
  /**
   * Path of the folder where the file will be uploaded.
   */
  'data-uploadFolderPath'?: string
  /**
   * Repository object.
   */
  'data-repository': Repository
}
