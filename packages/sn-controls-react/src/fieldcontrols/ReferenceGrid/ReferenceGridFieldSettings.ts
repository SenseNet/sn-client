/**
 * @module FieldControls
 *
 */ /** */
import { GenericContent } from '@sensenet/default-content-types'
import { ReactReferenceFieldSetting } from '../ReferenceFieldSetting'

/**
 * Interface for TextareaFieldSetting properties
 */
// tslint:disable-next-line:no-empty-interface
export interface ReactReferenceGridFieldSetting<T extends GenericContent, K extends keyof T>
  extends ReactReferenceFieldSetting<T, K> {
  /**
   * Component that will displayed as an item in the list
   */
  itemTemplate?: (item: GenericContent) => React.Component
}
