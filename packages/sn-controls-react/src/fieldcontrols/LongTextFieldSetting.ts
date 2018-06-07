/**
 * @module FieldControls
 *
 */ /** */
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Interface for LongTextFieldSetting properties
 */
export interface ReactLongTextFieldSetting extends ReactClientFieldSetting {
    'data-maxLength'?: number,
    'data-minLength'?: number,
    'data-textType': 'LongText' | 'RichText' | 'AdvancedRichText'
}
