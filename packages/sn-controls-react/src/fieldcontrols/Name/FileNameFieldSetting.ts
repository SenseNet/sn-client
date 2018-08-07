/**
 * @module FieldControls
 *
 */ /** */
import { ReactNameFieldSetting } from './NameFieldSetting'

/**
 * Interface for NameFieldSetting properties
 */
export interface ReactFileNameFieldSetting extends ReactNameFieldSetting {
    'data-extension'?: string,
}
