/**
 * @module sn-controls-react
 * 
 * 
 */
import { FieldSettings } from 'sn-client-js';

/**
 * @description Base class for React client field config
 */
export class ReactClientFieldConfig<TFieldSettings extends FieldSettings.FieldSetting> {
    constructor(public readonly FieldSettings: TFieldSettings) {
        
    }
}