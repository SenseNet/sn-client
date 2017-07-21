/**
 * @module FieldControls
 * 
 */ /** */
import { IClientFieldSetting } from './IClientFieldSetting'

/**
 * Interface for LongTextFieldSetting properties
 */
export interface ILongTextFieldSetting extends IClientFieldSetting {
    'data-maxLength'?: number,
    'data-minLength'?: number,
    'data-textType': 'LongText' | 'RichText' | 'AdvancedRichText'
}