/**
 * @module FieldControls
 * 
 */ /** */
import { IClientFieldSetting } from './IClientFieldSetting'

/**
 * Interface for ChoiceFieldSetting properties
 */
export interface IChoiceFieldSetting extends IClientFieldSetting {
    'data-allowMultiple'?: boolean,
    'data-allowExtraValue'?: boolean,
    'data-displayChoices'?: 'dropDown' | 'radioButtons' | 'checkBoxes',
    options: any[]
}