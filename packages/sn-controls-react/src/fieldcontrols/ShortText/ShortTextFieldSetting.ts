/**
 * @module FieldControls
 *
 */ /** */
import { GenericContent } from '@sensenet/default-content-types'
import { ReactClientFieldSetting } from '../ClientFieldSetting'

/**
 * Interface for ShortTextFieldSetting properties
 */
export interface ReactShortTextFieldSetting<T extends GenericContent = GenericContent, K extends keyof T = 'Name'> extends ReactClientFieldSetting<T, K> {
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
