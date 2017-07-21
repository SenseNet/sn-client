/**
 * @module FieldControls
 * 
 */ /** */
import { IShortTextFieldSetting } from '../ShortText/IShortTextFieldSetting'

/**
 * Interface for DisplayNameFieldSetting properties
 */
export interface IDisplayNameFieldSetting extends IShortTextFieldSetting {
    alwaysUpdateName?: boolean
}