/**
 * @module FieldControls
 * 
 */ /** */
import { IClientFieldSetting } from './IClientFieldSetting'

/**
 * Interface for DateTimeFieldSetting properties
 */
export interface IDateTimeFieldSetting extends IClientFieldSetting {
    'data-dateTimeMode'?: 'none'  | 'date' | 'dateAndTime',
    'data-precision'?: 'millisecond' | 'second' | 'minute' | 'hour' | 'day'
}