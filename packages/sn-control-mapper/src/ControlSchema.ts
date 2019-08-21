import { FieldSetting, Schema } from '@sensenet/default-content-types'
import { ActionName } from './ControlMapper'

/**
 * Defines a control schema association
 */
export class ControlSchema<TControlBaseType, TFieldControlBaseType> {
  /**
   * The type of the content type control
   */
  public contentTypeControl!: TControlBaseType
  /**
   * The assicoated Schema object from sensenet
   */
  public schema!: Schema
  /**
   * An array of the associated fieldSettings, controlType and clientSettings
   */
  public fieldMappings!: Array<{
    fieldSettings: FieldSetting
    actionName: ActionName
    controlType: TFieldControlBaseType
  }>
}
