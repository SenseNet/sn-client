/**
 * @module FieldControls
 *
 */ /** */
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Interface for ChoiceFieldSetting properties
 */
export interface ReactChoiceFieldSetting extends ReactClientFieldSetting {
    'data-allowMultiple'?: boolean,
    'data-allowExtraValue'?: boolean,
    'data-displayChoices'?: 'dropDown' | 'radioButtons' | 'checkBoxes',
    options: any[]
}
