/**
 * @module FieldControls
 *
 */ /** */
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * Interface for ReferenceFieldSetting properties
 */
export interface ReactReferenceFieldSetting extends ReactClientFieldSetting {
    'data-allowMultiple'?: boolean,
    'data-allowedTypes'?,
    'data-selectionRoot'?,
    'data-defaultDisplayName'?,
    dataSource: any[],
    repository
}
