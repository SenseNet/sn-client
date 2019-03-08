/**
 * @module FieldControls
 *
 */ /** */
import { GenericContent } from '@sensenet/default-content-types'
import { ReactReferenceGridFieldSetting } from '../ReferenceGrid/ReferenceGridFieldSettings'

/**
 * Interface for NameFieldSetting properties
 */
export interface ReactImageFieldSetting<T extends GenericContent = GenericContent, K extends keyof T = 'Name'>
  extends ReactReferenceGridFieldSetting<T, K> {}
