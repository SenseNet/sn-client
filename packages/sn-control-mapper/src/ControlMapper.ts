import { Repository } from '@sensenet/client-core'
import { FieldSetting, FieldVisibility, Schema } from '@sensenet/default-content-types'
import { ControlSchema } from './ControlSchema'

/**
 * Type that defines an action name for control schema generation
 */
export type ActionName = 'new' | 'edit' | 'browse'

/**
 * Class that handles control mappings between a sensenet Repository schemas and a generic control set
 */
export class ControlMapper<TControlBaseType, TFieldControlBaseType> {
  constructor(
    private readonly repository: Repository,
    private readonly defaultControlType: TControlBaseType,
    private readonly defaultFieldSettingControlType: TFieldControlBaseType,
  ) {}

  /**
   * Method for getting a specified Schema object for a content type.
   * The FieldSettings will be filtered based on the provided actionName.
   * @param contentType The type of the content (e.g. ContentTypes.Task)
   * @param actionName The name of the action. Can be 'new' / 'browse' / 'edit'
   */
  private getTypeSchema(contentTypeName: string, actionName: ActionName): Schema {
    const schema = this.repository.schemas.getSchemaByName(contentTypeName)

    // eslint-disable-next-line array-callback-return
    schema.FieldSettings = schema.FieldSettings.filter(s => {
      if (
        (contentTypeName === 'Folder' && s.Name === 'AllowedChildTypes') ||
        (contentTypeName === 'SystemFolder' && s.Name === 'AllowedChildTypes')
      ) {
        return null
      }
      switch (actionName) {
        case 'new':
          return s.VisibleNew !== FieldVisibility.Hide
        case 'edit':
          return s.VisibleEdit !== FieldVisibility.Hide
        case 'browse':
          return s.VisibleBrowse !== FieldVisibility.Hide
        // no default
      }
    }).sort((fs1, fs2) => (fs1.FieldIndex || 0) - (fs2.FieldIndex || 0))
    return schema
  }

  private contentTypeControlMaps: Map<string, TControlBaseType> = new Map()

  /**
   * Maps a specified Control to a Content type
   * @param contentTypeName The Content type to be mapped
   * @param control The Control for the content
   * @returns {ControlMapper}
   */
  public mapContentTypeToControl(contentTypeName: string, control: TControlBaseType) {
    this.contentTypeControlMaps.set(contentTypeName, control)
    return this
  }

  /**
   * Gets the mapped control for a specified content type.
   * @param content The content to get the control for.
   * @returns {TControlBaseType} The mapped control, Default if nothing is mapped.
   */
  public getControlForContentType(contentTypeName: string) {
    return this.contentTypeControlMaps.get(contentTypeName) || this.defaultControlType
  }

  private fieldSettingDefaults: Map<string, (fieldSetting: FieldSetting) => TFieldControlBaseType> = new Map()

  /**
   * Sets up default field settings object
   * @param fieldSettingName The FieldSettings' name to get the control for.
   * @param setupControl Callback method that returns a Control Type based on the provided FieldSetting
   * @returns the Mapper instance (can be used fluently)
   */
  public setupFieldSettingDefault<TFieldSettingType extends FieldSetting>(
    fieldSettingName: string,
    setupControl: (fieldSetting: TFieldSettingType) => TFieldControlBaseType,
  ) {
    this.fieldSettingDefaults.set(fieldSettingName, setupControl)
    return this
  }

  /**
   * Gets an associated control for a specific field setting object
   * @returns {TControlBaseType} The specified FieldSetting control
   * @param fieldSetting The FieldSetting to get the control class.
   */
  public getControlForFieldSetting<TFieldSettingType extends FieldSetting>(
    fieldSetting: TFieldSettingType,
  ): TFieldControlBaseType {
    const fieldSettingSetup = this.fieldSettingDefaults.get(fieldSetting.Type)
    return (fieldSettingSetup && fieldSettingSetup(fieldSetting)) || this.defaultFieldSettingControlType
  }

  private contentTypeBoundfieldSettings: Map<string, (fieldSetting: FieldSetting) => TControlBaseType> = new Map()

  /**
   * Sets up a specified control for a field setting
   * @param contentType The Content Type
   * @param fieldName The name of the field on the Content Type
   * @param setupControl The callback function that will setup the Control
   */

  public setupFieldSettingForControl<
    TFieldSettingType extends FieldSetting,
    TContentType,
    TField extends keyof TContentType
  >(
    contentType: new (...args: any[]) => TContentType,
    fieldName: TField,
    setupControl: (fieldSetting: TFieldSettingType) => TControlBaseType,
  ) {
    this.contentTypeBoundfieldSettings.set(`${contentType.name}-${fieldName}`, setupControl as any)
    return this
  }

  /**
   * Retrieves an assigned Control constructor for a specified content's specified field
   * @param contentType The type of the content (e.g. ContentTypes.Task)
   * @param fieldName The name of the field (must be one of the ContentType's fields), e.g. 'DisplayName'
   * @param actionName The name of the Action (can be 'new' / 'edit' / 'browse')
   * @returns The assigned Control constructor or the default Field control
   */
  public getControlForContentField(
    contentTypeName: string,
    fieldName: string,
    actionName: ActionName,
  ): TFieldControlBaseType {
    const fieldSetting = this.getTypeSchema(contentTypeName, actionName).FieldSettings.filter(
      s => s.Name === fieldName,
    )[0]

    if (this.contentTypeBoundfieldSettings.has(`${contentTypeName}-${fieldName}`)) {
      return (this.contentTypeBoundfieldSettings.get(`${contentTypeName}-${fieldName}`) as any)(fieldSetting)
    } else {
      return this.getControlForFieldSetting(fieldSetting)
    }
  }

  /**
   * Gets the full ControlSchema object for a specific ContentType
   * @param contentType The type of the Content (e.g. ContentTypes.Task)
   * @param actionName The name of the Action (can be 'new' / 'edit' / 'browse')
   * @returns the fully created ControlSchema
   */
  public getFullSchemaForContentType(
    contentTypeName: string,
    actionName: ActionName,
  ): ControlSchema<TControlBaseType, TFieldControlBaseType> {
    const schema = this.getTypeSchema(contentTypeName, actionName)
    const mappings = schema.FieldSettings.map(f => {
      const control = this.getControlForContentField(contentTypeName, f.Name, actionName)
      return {
        fieldSettings: f,
        controlType: control,
        actionName,
      }
    })
    return {
      schema,
      contentTypeControl: this.getControlForContentType(contentTypeName),
      fieldMappings: mappings,
    }
  }
}
