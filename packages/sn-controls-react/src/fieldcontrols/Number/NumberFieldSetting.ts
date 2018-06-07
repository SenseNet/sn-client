/**
 * @module FieldControls
 *
 */ /** */
import { ReactClientFieldSetting } from '../ClientFieldSetting'

/**
 * Interface for NumberFieldSetting properties
 */
export interface ReactNumberFieldSetting extends ReactClientFieldSetting {
    max?: number,
    min?: number,
    'data-decimal'?: boolean,
    'data-digits'?: number,
    'data-step'?: number,
    'data-isPercentage'?: boolean,
    'data-isCurrency'?: boolean
}
