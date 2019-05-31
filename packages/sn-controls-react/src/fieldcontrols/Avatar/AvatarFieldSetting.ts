/**
 * @module FieldControls
 */
import { User } from '@sensenet/default-content-types'
import { ReactReferenceGridFieldSetting } from '../ReferenceGrid/ReferenceGridFieldSettings'

/**
 * Interface for ReactAvatarFieldSetting
 */
export interface ReactAvatarFieldSetting<T extends User, K extends keyof T>
  extends ReactReferenceGridFieldSetting<T, K> {
  /**
   * Component that will displayed as an item in the list
   */
  content: User
  /**
   * Path of the folder where the file will be uploaded.
   */
  'data-uploadFolderPath'?: string
  /**
   * Path of the folder where the file should be uploaded
   */
  'data-onChange'?: () => void
}
