/**
 * @module FieldControls
 *
 */ /** */
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
    max?: number,
    /**
     * Defines the allowed minimum value of the input data
     */
    min?: number,
    /**
     * Sets wether the number will be a decimal or a simple integer
     * @default false
     */
    'data-decimal'?: boolean,
    /**
     * Specifies the number of the displayed decimals
     * @default 2
     */
    'data-digits'?: number,
    /**
     * Specifies the value used to increment or decrement fieldcontrol's value
     */
    'data-step'?: number,
    /**
     * Specifies wether the control displays a percentage
     * @default false
     */
    'data-isPercentage'?: boolean,
    /**
     * Specifies wether the control displays a currency
     * @default false
     */
    'data-isCurrency'?: boolean,
    /**
     * Specifies currency
     * @default USD
     */
    'data-currency'?: currencies
}
