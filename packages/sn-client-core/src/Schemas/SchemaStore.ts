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
  public getSchemaByName(contentTypeName: string): Schema {
    if (this.byNameSchemaCache.has(contentTypeName)) {
      return Object.assign({}, this.byNameSchemaCache.get(contentTypeName)) as Schema
    }
    let schema = this.schemas.find(s => s.ContentTypeName === contentTypeName) as Schema
    if (!schema) {
      return this.getSchemaByName('GenericContent')
    }
    schema = Object.assign({}, schema)
    const parentSchema = schema.ParentTypeName && this.getSchemaByName(schema.ParentTypeName)

    if (parentSchema) {
      schema.FieldSettings = this.mergeFieldSettings(schema.FieldSettings, parentSchema.FieldSettings)
    }
    this.byNameSchemaCache.set(contentTypeName, schema)
    return Object.assign({}, schema)
  }

  /**
   * Returns a boolean value that indicates if the specified content is an instance or descendant of a given content constructor
   * @param content The given content to check
   * @param contentType The content type constructor
   */
  public isContentFromType<T extends typeof GenericContent>(
    content: GenericContent,
    contentType: T,
  ): content is InstanceType<T> {
    if (content.Type === contentType.name) {
      return true
    }

    let currentSchema = this.getSchemaByName(content.Type)
    do {
      if (currentSchema.ContentTypeName === contentType.name) {
        return true
      }
      currentSchema = this.getSchemaByName(currentSchema.ParentTypeName || '')
    } while (currentSchema.ContentTypeName && currentSchema.ContentTypeName !== GenericContent.name)
    return contentType.name === GenericContent.name
  }

  /**
   * Returns if a given content type is a descendant of an another content type
   * @param child The child content name
   * @param parent The parent content name
   */
  public schemaIsDescendantOf(child: string, parent: string) {
    let currentSchema = this.getSchemaByName(child)
    do {
      if (currentSchema.ContentTypeName === parent) {
        return true
      }
      currentSchema = this.getSchemaByName(currentSchema.ParentTypeName || '')
    } while (currentSchema.ContentTypeName && currentSchema.ContentTypeName !== GenericContent.name)

    return parent === GenericContent.name
  }
}
