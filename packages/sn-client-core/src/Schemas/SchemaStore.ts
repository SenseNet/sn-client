import { FieldSetting, GenericContent, Schema } from '@sensenet/default-content-types'

/**
 * Class that stores schema information
 */
export class SchemaStore {
  private schemas: Schema[] = []
  private byNameSchemaCache: Map<string, Schema> = new Map()

  /**
   * Updates the schema information in the store and inv
   */
  public setSchemas(newSchemas: Schema[]) {
    this.schemas = newSchemas
    this.byNameSchemaCache = new Map<string, Schema>()
  }

  /**
   * Returns the Content Type Schema for the provided Content Type;
   * @param type {string} The name of the Content Type;
   * @returns {Schemas.Schema}
   * ```ts
   * const genericContentSchema = SenseNet.Content.getSchema(Content);
   * ```
   */
  public getSchema<TType>(currentType: new (...args: any[]) => TType): Schema {
    return this.getSchemaByName(currentType.name)
  }

  private mergeFieldSettings(
    currentFieldSettings: FieldSetting[],
    parentFieldSettings: FieldSetting[],
  ): FieldSetting[] {
    const currentFieldSettingsMap = new Map<string, FieldSetting>()
    currentFieldSettings.forEach(s => currentFieldSettingsMap.set(s.Name, s))

    const parentFieldSettingsMap = new Map<string, FieldSetting>()
    parentFieldSettings.forEach(s => parentFieldSettingsMap.set(s.Name, s))

    const keys = new Set([...currentFieldSettingsMap.keys(), ...parentFieldSettingsMap.keys()])

    return Array.from(keys).map(key => {
      return {
        ...parentFieldSettingsMap.get(key),
        ...currentFieldSettingsMap.get(key),
      } as FieldSetting
    })
  }

  /**
   * Returns the Content Type Schema for the provided content type name
   * @param {string} contentTypeName The name of the content type
   */
  public getSchemaByName(contentTypeName: string) {
    if (this.byNameSchemaCache.has(contentTypeName)) {
      return Object.assign({}, this.byNameSchemaCache.get(contentTypeName)) as Schema
    }
    let schema = this.schemas.find(s => s.ContentTypeName === contentTypeName) as Schema
    if (!schema) {
      return this.getSchema(GenericContent)
    }
    schema = Object.assign({}, schema)
    const parentSchema = schema.ParentTypeName && this.getSchemaByName(schema.ParentTypeName)

    if (parentSchema) {
      schema.FieldSettings = this.mergeFieldSettings(schema.FieldSettings, parentSchema.FieldSettings)
    }
    this.byNameSchemaCache.set(contentTypeName, schema)
    return Object.assign({}, schema)
  }
}
