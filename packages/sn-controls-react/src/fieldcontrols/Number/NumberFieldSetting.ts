/**
 * @module FieldControls
 */
import { GenericContent } from '@sensenet/default-content-types'
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
export interface ReactNumberFieldSetting<T extends GenericContent = GenericContent, K extends keyof T = 'Name'>
  extends ReactClientFieldSetting<T, K> {
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
  'data-decimal'?: boolean
  /**
   * Specifies the number of the displayed decimals
   * @default 2
   */
  'data-digits'?: number
  /**
   * Specifies the value used to increment or decrement fieldcontrol's value
   */
  'data-step'?: number
  /**
   * Specifies wether the control displays a percentage
   * @default false
   */
  'data-isPercentage'?: boolean
  /**
   * Specifies wether the control displays a currency
   * @default false
   */
  'data-isCurrency'?: boolean
  /**
   * Specifies currency
   * @default USD
   */
  'data-currency'?: currencies
}
