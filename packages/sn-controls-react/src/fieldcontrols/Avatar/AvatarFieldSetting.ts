/**
 * @module FieldControls
 *
 */
import { User } from '@sensenet/default-content-types'
import { ReactReferenceGridFieldSetting } from '../ReferenceGrid/ReferenceGridFieldSettings'

/**
 * Interface for ReactReferenceGridFieldSetting properties
 */
// tslint:disable-next-line:no-empty-interface
export interface ReactAvatarFieldSetting<T extends User, K extends keyof T>
  extends ReactReferenceGridFieldSetting<T, K> {
  /**
   * Component that will displayed as an item in the list
   */
  content: User
}
