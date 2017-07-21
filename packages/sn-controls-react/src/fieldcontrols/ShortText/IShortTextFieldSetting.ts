/**
 * @module FieldControls
 * 
 */ /** */
import { IClientFieldSetting } from '../IClientFieldSetting'

/**
 * Interface for ShortTextFieldSetting properties
 */
export interface IShortTextFieldSetting extends IClientFieldSetting {
    'data-maxLength'?: number,
    'data-minLength'?: number,
    'data-regex'?: string
}