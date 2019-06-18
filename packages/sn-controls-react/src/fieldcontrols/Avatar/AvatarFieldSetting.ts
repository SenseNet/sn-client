/**
 * @module FieldControls
 */
import { User } from '@sensenet/default-content-types'
import { ReactReferenceGridFieldSetting } from '../ReferenceGrid/ReferenceGridFieldSettings'

/**
 * Interface for ReactAvatarFieldSetting
 */
export interface ReactAvatarFieldSetting<T extends User = User, K extends keyof T = 'Avatar'>
  extends ReactReferenceGridFieldSetting<T, K> {
  /**
   * Component that will displayed as an item in the list
   */
  content: User
}
