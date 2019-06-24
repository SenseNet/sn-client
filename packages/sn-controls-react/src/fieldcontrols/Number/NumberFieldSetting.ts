/**
 * @module FieldControls
 */
import { ReactClientFieldSetting } from '../ClientFieldSetting'

enum currencies {
  USD = '$',
  EUR = '€',
  BTC = '฿',
  JPY = '¥',
}

/**
 * Interface for NumberFieldSetting properties
 */
export interface ReactNumberFieldSetting extends ReactClientFieldSetting {
  /**
   * Defines the allowed maximum value of the input data
   */
  max?: number
  /**
   * Defines the allowed minimum value of the input data
   */
  min?: number
  /**
   * Sets wether the number will be a decimal or a simple integer
   * @default false
   */
  decimal?: boolean
  // Digits is not wired in the number control. Remove?
  /**
   * Specifies the number of the displayed decimals
   * @default 2
   */
  digits?: number
  /**
   * Specifies the value used to increment or decrement fieldcontrol's value
   */
  step?: number
  /**
   * Specifies wether the control displays a percentage
   * @default false
   */
  isPercentage?: boolean
  /**
   * Specifies wether the control displays a currency
   * @default false
   */
  isCurrency?: boolean
  /**
   * Specifies currency
   * @default USD
   */
  currency?: currencies
}
