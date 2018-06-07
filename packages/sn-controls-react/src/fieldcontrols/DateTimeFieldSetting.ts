/**
 * @module FieldControls
 *
 */ /** */
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Interface for DateTimeFieldSetting properties
 */
export interface ReactDateTimeFieldSetting extends ReactClientFieldSetting {
    'data-dateTimeMode'?: 'none'  | 'date' | 'dateAndTime',
    'data-precision'?: 'millisecond' | 'second' | 'minute' | 'hour' | 'day'
}
