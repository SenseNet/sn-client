/**
 * @module FieldControls
 *
 */ /** */
import { ReactClientFieldSetting } from '../ClientFieldSetting'

/**
 * Interface for ShortTextFieldSetting properties
 */
export interface ReactShortTextFieldSetting extends ReactClientFieldSetting {
    /**
     * Maximum length of the text
     */
    'data-maxLength'?: number,
    /**
     * Minimum length of the text
     */
    'data-minLength'?: number,
    /**
     * Contains common regular expression against which the Field is validated
     */
    'data-regex'?: string
}
