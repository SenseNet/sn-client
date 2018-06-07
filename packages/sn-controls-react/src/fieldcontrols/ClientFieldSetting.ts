/**
 * @module FieldControls
 *
 */ /** */
/**
 * Interface for ReactClientFieldSetting properties
 */
export interface ReactClientFieldSettingProps {
    name?: string
    key?: string
    style?: object
    value?: number
    readOnly?: boolean
    required?: boolean
    className?: string,
    onChange
}

/**
 * Interface for ClientFieldSetting properties
 */
export interface ReactClientFieldSetting extends ReactClientFieldSettingProps {
    'data-actionName'?: 'new' | 'edit' | 'browse'
    'data-hintText'?: string
    'data-hintStyle'?: object
    'data-placeHolderText'?: string
    'data-placeHolderStyle'?: object
    'data-defaultValue'?
    'data-outPutMethod'?: 'default' | 'raw' | 'text' | 'html',
    'data-labelStyle'?: object,
    'data-labelText'?: string,
    'data-errorStyle'?: object,
    'data-errorText'?: string,
    'data-typeName'?: string
}
