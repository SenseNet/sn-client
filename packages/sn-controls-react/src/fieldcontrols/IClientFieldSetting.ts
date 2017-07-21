/**
 * @module FieldControls
 * 
 */ /** */
 
/**
 * Interface for ReactClientFieldSetting properties
 */
export interface IReactClientFieldSetting {
    name?: string
    key?: string
    style?: object
    value?: number
    readOnly?: boolean
    required?: boolean
    className?: string
}

/**
 * Interface for ClientFieldSetting properties
 */
export interface IClientFieldSetting extends IReactClientFieldSetting {
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
    'data-errorText'?: string
}