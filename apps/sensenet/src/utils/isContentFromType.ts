import { SchemaStore } from '@sensenet/client-core/dist/Schemas/SchemaStore'
import { GenericContent } from '@sensenet/default-content-types'

export const isContentFromType = <T extends typeof GenericContent>(
  content: GenericContent,
  contentType: T,
  schemaStore?: SchemaStore,
): content is InstanceType<T> => {
  if (content.Type === contentType.name) {
    return true
  }

  if (schemaStore) {
    let currentSchema = schemaStore.getSchemaByName(content.Type)
    do {
      if (currentSchema.ContentTypeName === contentType.name) {
        return true
      }
      currentSchema = schemaStore.getSchemaByName(currentSchema.ParentTypeName || '')
    } while (currentSchema.ContentTypeName && currentSchema.ContentTypeName !== 'GenericContent')
  }
  return false
}

export const schemaIsDescendantOf = (child: string, parent: string, schemaStore: SchemaStore) => {
  let currentSchema = schemaStore.getSchemaByName(child)
  do {
    if (currentSchema.ContentTypeName === parent) {
      return true
    }
    currentSchema = schemaStore.getSchemaByName(currentSchema.ParentTypeName || '')
  } while (currentSchema.ContentTypeName && currentSchema.ContentTypeName !== 'GenericContent')
}
