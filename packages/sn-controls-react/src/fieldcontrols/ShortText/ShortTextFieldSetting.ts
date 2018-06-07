/**
 * @module FieldControls
 *
 */ /** */
import { ReactClientFieldSetting } from '../ClientFieldSetting'

/**
 * Interface for ShortTextFieldSetting properties
 */
export interface ReactShortTextFieldSetting extends ReactClientFieldSetting {
    'data-maxLength'?: number,
    'data-minLength'?: number,
    'data-regex'?: string
}
