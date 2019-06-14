import { Schema, SchemaStore as DefaultSchemaStore, User } from '@sensenet/default-content-types'
import 'jest'
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
    expect(store['schemas']).toBe(newSchemaArray)
  })

  it('Schemas can be retrieved by Content Type', () => {
    const store = new SchemaStore()
    store.setSchemas(DefaultSchemaStore)
    const schema = store.getSchema(User)
    expect(schema.ContentTypeName).toBe('User')
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
})
