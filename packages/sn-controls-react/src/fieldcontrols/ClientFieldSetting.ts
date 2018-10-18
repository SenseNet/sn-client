/**
 * @module FieldControls
 *
 */ /** */
/**
 * Interface for ReactClientFieldSetting properties
 */
export interface ReactClientFieldSettingProps {
    /**
     * Unique name of the field control
     */
    name?: string
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
    className?: string,
    /**
     * Called when the icon is clicked
     */
    onChange
}

/**
 * Interface for ClientFieldSetting properties
 */
export interface ReactClientFieldSetting extends ReactClientFieldSettingProps {
    /**
     * Display mode of the field control
     * @default browse
     */
    'data-actionName'?: 'new' | 'edit' | 'browse'
    /**
     * Text of the hint that could be displayed after the field control
     */
    'data-hintText'?: string
    /**
     * Text of the placeholder
     */
    'data-placeHolderText'?: string
    /**
     * Default value of the empty field control
     */
    'data-defaultValue'?
    /**
     * Text of the label
     */
    'data-labelText'?: string,
    /**
     * Text of the error message
     */
    'data-errorText'?: string,
    /**
     * Name of the fildcontrol type
     */
    'data-typeName'?: string
}
