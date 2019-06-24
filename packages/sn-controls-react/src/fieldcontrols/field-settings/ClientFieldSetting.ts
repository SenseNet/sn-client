/**
 * @module FieldControls
 */
import { Repository } from '@sensenet/client-core'

/**
 * Interface for ReactClientFieldSetting properties
 */
export interface ReactClientFieldSettingProps {
  /**
   * Unique name of the field control
   */
  fieldName: string
  /**
   * Called when the icon is clicked
   */
  fieldOnChange: (field: string, value: any) => void
  /**
   * Unique key of the field control
   */
  key?: string
  /**
   * React style object
   */
  style?: object
  /**
   * Value of the field control
   */
  value?: any
  /**
   * Defining whether the field's data can be edited
   */
  readOnly?: boolean
  /**
   * Defining whether the field has to contain any data
   * @default false
   */
  required?: boolean
  /**
   * Additional class name
   * @default false
   */
  className?: string
}

/**
 * Interface for ClientFieldSetting properties
 */
export interface ReactClientFieldSetting extends ReactClientFieldSettingProps {
  /**
   * Default value of the empty field control
   */
  defaultValue?: any
  /**
   * Display mode of the field control
   * @default browse
   */
  actionName?: 'new' | 'edit' | 'browse'
  /**
   * Text of the hint that could be displayed after the field control
   */
  hintText?: string
  /**
   * Text of the placeholder
   */
  placeHolderText?: string
  /**
   * Text of the label
   */
  labelText?: string
  /**
   * Text of the error message
   */
  errorText?: string
  /**
   * Name of the fieldcontrol type
   */
  typeName?: string
  /**
   * Function for rendering an icon by an iconname given as an input prop
   */
  renderIcon?: (name: string) => JSX.Element
  /**
   * Connected repository
   */
  repository: Repository
}
