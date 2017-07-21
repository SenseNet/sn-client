/**
 * @module FieldControls
 * 
 */ /** */
import { IClientFieldSetting } from '../IClientFieldSetting'

/**
 * Interface for NumberFieldSetting properties
 */
export interface INumberFieldSetting extends IClientFieldSetting {
    max?: number,
    min?: number,
    'data-decimal'?: boolean,
    'data-digits'?: number,
    'data-step'?: number,
    'data-isPercentage'?: boolean,
    'data-isCurrency'?: boolean
}