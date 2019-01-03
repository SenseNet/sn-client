import { FieldSetting, Schema } from '@sensenet/default-content-types'

/**
 * Defines a control schema association
 */
export class ControlSchema<TControlBaseType, TClientControlSettings> {
  /**
   * The type of the content type control
   */
  public contentTypeControl!: new (...args: any[]) => TControlBaseType
  /**
   * The assicoated Schema object from sensenet
   */
  public schema!: Schema
  /**
   * An array of the associated fieldSettings, controlType and clientSettings
   */
  public fieldMappings!: Array<{
    fieldSettings: FieldSetting
    controlType: new (...args: any[]) => TControlBaseType
    clientSettings: TClientControlSettings
  }>
}
