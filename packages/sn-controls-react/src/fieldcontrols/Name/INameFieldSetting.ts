/**
 * @module FieldControls
 * 
 */ /** */
import { IShortTextFieldSetting } from '../ShortText/IShortTextFieldSetting'

/**
 * Interface for NameFieldSetting properties
 */
export interface INameFieldSetting extends IShortTextFieldSetting {
    neverOverrideDisplayName?: boolean
    alwaysEditable?: boolean
}