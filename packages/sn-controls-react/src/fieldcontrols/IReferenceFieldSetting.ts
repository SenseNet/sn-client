/**
 * @module FieldControls
 * 
 */ /** */
import { IClientFieldSetting } from './IClientFieldSetting'

/**
 * Interface for ReferenceFieldSetting properties
 */
export interface IReferenceFieldSetting extends IClientFieldSetting {
    'data-allowMultiple'?: boolean,
    'data-allowedTypes'?,
    'data-selectionRoot'?
    dataSource: any[]
}