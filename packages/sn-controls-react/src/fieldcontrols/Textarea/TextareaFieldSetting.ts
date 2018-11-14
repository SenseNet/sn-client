/**
 * @module FieldControls
 *
 */ /** */
import { GenericContent } from '@sensenet/default-content-types'
import { ReactClientFieldSetting } from '../ClientFieldSetting'

/**
 * Interface for TextareaFieldSetting properties
 */
// tslint:disable-next-line:no-empty-interface
export interface ReactTextareaFieldSetting<T extends GenericContent, K extends keyof T> extends ReactClientFieldSetting<T, K> {

}
