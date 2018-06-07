/**
 * @module FieldControls
 *
 */ /** */
import { ReactShortTextFieldSetting } from '../ShortText/ShortTextFieldSetting'

/**
 * Interface for NameFieldSetting properties
 */
export interface ReactNameFieldSetting extends ReactShortTextFieldSetting {
    neverOverrideDisplayName?: boolean
    alwaysEditable?: boolean
}
