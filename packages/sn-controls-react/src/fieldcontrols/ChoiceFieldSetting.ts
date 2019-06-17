/**
 * @module FieldControls
 */
import { GenericContent } from '@sensenet/default-content-types'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Interface for ChoiceFieldSetting properties
 */
export interface ReactChoiceFieldSetting<T extends GenericContent = GenericContent, K extends keyof T = 'Name'>
  extends ReactClientFieldSetting<T, K> {
  /**
   * Allows multiple selection
   * @default false
   */
  allowMultiple?: boolean
  /**
   * Allows to add an extra value to the field
   * @default false
   */
  allowExtraValue?: boolean
  //TODO?? This is not used.
  /**
   * Specifies the type of the field control which will handle the current field ('DropDown','RadioButtons','CheckBoxes').
   * @default dropDown
   */
  displayChoices?: 'dropDown' | 'radioButtons' | 'checkBoxes'
  /**
   * List of the optional options
   */
  options: any[]
}
