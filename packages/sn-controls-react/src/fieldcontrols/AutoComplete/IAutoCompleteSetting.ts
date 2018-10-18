/**
 * @module FieldControls
 *
 */ /** */
import { ReactClientFieldSetting } from '../ClientFieldSetting'
/**
 * Interface for TagsInputFieldSetting properties
 */
export interface ReactAutoCompleteFieldSetting<T> extends ReactClientFieldSetting {
    /**
     * Datasource of a reference field with the optional items that can be chosen
     */
    dataSource?: any[],
}
