import { SchemaStore as DefaultSchemaStore, GenericContent, Schema } from '@sensenet/default-content-types'
import { SchemaStore } from '../src/Schemas/SchemaStore'

/**
 * Unit tests for SchemaStore
 */
describe('SchemaStore', () => {
  it('Should be constructed', () => {
    expect(new SchemaStore()).toBeInstanceOf(SchemaStore)
  })

  it('Schemas can be set', () => {
    const store = new SchemaStore()
    const newSchemaArray: Schema[] = []
    store.setSchemas(newSchemaArray)
    expect(store['schemas'].getValue()).toBe(newSchemaArray)
  })

  it('Schemas can be retrieved by name', () => {
    const store = new SchemaStore()
    store.setSchemas(DefaultSchemaStore)
    const schema = store.getSchemaByName('User')
    expect(schema.ContentTypeName).toBe('User')
  })

  it('Schemas can be retrieved by name from cache', () => {
    const store = new SchemaStore()
    store.setSchemas(DefaultSchemaStore)
    const schema = store.getSchemaByName('User')
    const schema2 = store.getSchemaByName('GenericContent')
    expect(schema.ContentTypeName).toBe('User')
    expect(schema2.ContentTypeName).toBe('GenericContent')
  })

  it('Should fall back to GenericContent Schema if not found', () => {
    const store = new SchemaStore()
    store.setSchemas(DefaultSchemaStore)
    const schema = store.getSchemaByName('NotFound')
    expect(schema.ContentTypeName).toBe('GenericContent')
  })

  it('Should be able to merge field settings', () => {
    const mergeAction = new SchemaStore()['mergeFieldSettings']

    const result = mergeAction(
      [
        { Name: 'Field', Type: 'Example', FieldClassName: 'ExampleOverriddenValue' },
        { Name: 'Field2', Type: 'Example', FieldClassName: 'Example' },
      ],
      [
        { Name: 'Field', Type: 'Example', FieldClassName: 'Example' },
        { Name: 'ParentField', Type: 'Example', FieldClassName: 'Example' },
      ],
    )
    expect(result).toEqual([
      { Name: 'Field', Type: 'Example', FieldClassName: 'ExampleOverriddenValue' },
      { Name: 'Field2', Type: 'Example', FieldClassName: 'Example' },
      { Name: 'ParentField', Type: 'Example', FieldClassName: 'Example' },
    ])
  })

  describe('schemaIsDescendantOf', () => {
    it('Should be return true for descendants', () => {
      const store = new SchemaStore()
      store.setSchemas(DefaultSchemaStore)
      expect(store.schemaIsDescendantOf('File', 'GenericContent')).toBeTruthy()
      expect(store.schemaIsDescendantOf('File', 'File')).toBeTruthy()
      expect(store.schemaIsDescendantOf('Image', 'File')).toBeTruthy()
      expect(store.schemaIsDescendantOf('Image', 'GenericContent')).toBeTruthy()
      expect(store.schemaIsDescendantOf('UserProfile', 'GenericContent')).toBeTruthy()
    })

    it('Should return false for non-descendants values', () => {
      const store = new SchemaStore()
      store.setSchemas(DefaultSchemaStore)
      expect(store.schemaIsDescendantOf('File', 'Image')).toBeFalsy()
      expect(store.schemaIsDescendantOf('GenericContent', 'ContentType')).toBeFalsy()
      expect(store.schemaIsDescendantOf('UserProfile', 'Group')).toBeFalsy()
    })
  })

  describe('isContentFromType', () => {
    it('Should be return true for descendants', () => {
      const store = new SchemaStore()
      store.setSchemas(DefaultSchemaStore)
      expect(store.isContentFromType({ Type: 'SnFile' } as GenericContent, 'SnFile')).toBeTruthy()
      expect(store.isContentFromType({ Type: 'SnFile' } as GenericContent, 'GenericContent')).toBeTruthy()
      expect(store.isContentFromType({ Type: 'Image' } as GenericContent, 'File')).toBeTruthy()
      expect(store.isContentFromType({ Type: 'Image' } as GenericContent, 'GenericContent')).toBeTruthy()
      expect(store.isContentFromType({ Type: 'UserProfile' } as GenericContent, 'GenericContent')).toBeTruthy()
    })

    it('Should return false for non-descendants values', () => {
      const store = new SchemaStore()
      store.setSchemas(DefaultSchemaStore)
      expect(store.isContentFromType({ Type: 'File' } as GenericContent, 'Image')).toBeFalsy()
      expect(store.isContentFromType({ Type: 'GenericContent' } as GenericContent, 'ContentType')).toBeFalsy()
      expect(store.isContentFromType({ Type: 'UserProfile' } as GenericContent, 'Group')).toBeFalsy()
    })
  })
})
