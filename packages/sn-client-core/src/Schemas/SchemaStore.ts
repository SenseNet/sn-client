import { ObservableValue, ValueChangeCallback } from '@sensenet/client-utils'
import { FieldSetting, Schema } from '@sensenet/default-content-types'

/**
 * Class that stores schema information
 */
export class SchemaStore {
  public schemas: ObservableValue<Schema[]> = new ObservableValue([])
  private byNameSchemaCache: Map<string, Schema> = new Map()

  public subscribeToSchemas(callback: ValueChangeCallback<Schema[]>) {
    return this.schemas.subscribe(callback)
  }

  /**
   * Updates the schema information in the store and inv
   */
  public setSchemas(newSchemas: Schema[]) {
    this.byNameSchemaCache.clear()
    this.schemas.setValue(newSchemas)
  }

  private mergeFieldSettings(
    currentFieldSettings: FieldSetting[],
    parentFieldSettings: FieldSetting[],
  ): FieldSetting[] {
    const currentFieldSettingsMap = new Map<string, FieldSetting>()
    currentFieldSettings.forEach((s) => currentFieldSettingsMap.set(s.Name, s))

    const parentFieldSettingsMap = new Map<string, FieldSetting>()
    parentFieldSettings.forEach((s) => parentFieldSettingsMap.set(s.Name, s))

    const keys = new Set([...currentFieldSettingsMap.keys(), ...parentFieldSettingsMap.keys()])

    return Array.from(keys).map((key) => {
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
    const schema = this.schemas.getValue().find((s) => s.ContentTypeName === contentTypeName) as Schema

    if (!schema) {
      return this.getSchemaByName('GenericContent')
    }
    const parentSchema = schema.ParentTypeName && this.getSchemaByName(schema.ParentTypeName)

    if (parentSchema) {
      schema.FieldSettings = this.mergeFieldSettings(schema.FieldSettings, parentSchema.FieldSettings)
    }
    this.byNameSchemaCache.set(contentTypeName, schema)
    return schema
  }

  /**
   * Returns a boolean value that indicates if the specified content is an instance or descendant of a given content type
   * @param content The given content to check
   * @param contentTypeName The name of content type
   */
  public isContentFromType<T>(content: any, contentTypeName: string): content is T {
    if (content.Type === contentTypeName) {
      return true
    }

    let currentSchema = this.getSchemaByName(content.Type)

    if (currentSchema.HandlerName === this.getSchemaByName(contentTypeName).HandlerName) {
      return true
    }

    do {
      if (currentSchema.ContentTypeName === contentTypeName) {
        return true
      }
      currentSchema = this.getSchemaByName(currentSchema.ParentTypeName || '')
    } while (currentSchema.ContentTypeName && currentSchema.ContentTypeName !== 'GenericContent')
    return contentTypeName === 'GenericContent'
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
    } while (currentSchema.ContentTypeName && currentSchema.ContentTypeName !== 'GenericContent')

    return parent === 'GenericContent'
  }
}
