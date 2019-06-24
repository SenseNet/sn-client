/**
 * @module FieldControls
 */
import { GenericContent } from '@sensenet/default-content-types'
import { ReactReferenceFieldSetting } from './ReferenceFieldSetting'

/**
 * Interface for ReactReferenceGridFieldSetting properties
 */
export interface ReactReferenceGridFieldSetting extends ReactReferenceFieldSetting {
  /**
   * Component that will displayed as an item in the list
   */
  itemTemplate?: (item: GenericContent) => React.Component
}
