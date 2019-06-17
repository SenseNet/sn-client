/**
 * @module FieldControls
 */
import { GenericContent } from '@sensenet/default-content-types'
import { ReactClientFieldSetting } from './ClientFieldSetting'

//TODO?? These fields are not wired in! Not used anywhere.
/**
 * Interface for DateTimeFieldSetting properties
 */
export interface ReactDateTimeFieldSetting<T extends GenericContent = GenericContent, K extends keyof T = 'Name'>
  extends ReactClientFieldSetting<T, K> {
  /**
   * Defines the presentation mode of the stored value: None, Date and DateAndTime. This only controls the behavior of the DatePicker Field Control.
   * @default none
   */
  dateTimeMode?: 'none' | 'date' | 'dateAndTime'
  /**
   * Defines the precision of the indexed value: Millisecond, Second, Minute, Hour, Day (Default is Minute). This does not affect the stored value, only the value stored in the index, making it possible to use different precision levels depending on the nature of the application. Chosing a finer or coarser precision than the optimal may cause slower query running and larger index files than what would be reasonable.
   * @default minute
   */
  precision?: 'millisecond' | 'second' | 'minute' | 'hour' | 'day'
  /**
   * Defines how the date value should be displayed (e.g. relative: '11 hours ago', calendar: 'Tuesday, March 26th 2013, 3:55:00 am', raw: '2013-03-26T03:55:00')
   */
  displayMode?: 'relative' | 'calendar' | 'raw'
}
