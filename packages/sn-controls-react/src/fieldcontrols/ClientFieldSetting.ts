/**
 * @module FieldControls
 */
import { GenericContent } from '@sensenet/default-content-types'
import { Repository } from '@sensenet/client-core'

/**
 * Interface for ReactClientFieldSetting properties
 */
export interface ReactClientFieldSettingProps<T extends GenericContent = GenericContent> {
  /**
   * Unique name of the field control
   */
  fieldName: keyof T
  /**
   * Called when the icon is clicked
   */
  fieldOnChange: (field: keyof T, value: any) => void
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
export interface ReactClientFieldSetting<T extends GenericContent = GenericContent, K extends keyof T = 'Name'>
  extends ReactClientFieldSettingProps<T> {
  /**
   * Default value of the empty field control
   */
  defaultValue?: T[K] & { toString: () => string }
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
