import { SchemaStore } from '@sensenet/client-core/dist/Schemas/SchemaStore'
import { GenericContent, ReferenceFieldSetting, SchemaStore as defaultSchemas } from '@sensenet/default-content-types'
import { shallow } from 'enzyme'
import * as React from 'react'
import Autosuggest from 'react-autosuggest'
import { ReferenceField } from '../src/Components/Fields/ReferenceField'

describe('ReferenceField Component', () => {
  const schemaStore = new SchemaStore()
  schemaStore.setSchemas(defaultSchemas)
  const exampleSchema = schemaStore.getSchema(GenericContent)
  const exampleFieldSetting = exampleSchema.FieldSettings.find(f => f.Name === 'CreatedBy') as ReferenceFieldSetting

  it('Should be constructed', () => {
    shallow(
      <ReferenceField<GenericContent>
        fieldName="CreatedBy"
        fieldSetting={exampleFieldSetting}
        fetchItems={async () => []}
        onQueryChange={() => {
          /** */
        }}
      />,
    ).unmount()
  })

  it('Should be constructed with default Id', done => {
    shallow(
      <ReferenceField<GenericContent>
        fieldName="CreatedBy"
        fieldSetting={exampleFieldSetting}
        defaultValueIdOrPath={1}
        fetchItems={async fetchQuery => {
          expect(fetchQuery.toString()).toBe("Id:'1'")
          done()
          return [{ Id: 1, Name: 'a', Path: '', Type: 'Document' }]
        }}
        onQueryChange={() => {
          /** */
        }}
      />,
    )
  })

  it('Should be constructed with default Path', done => {
    shallow(
      <ReferenceField<GenericContent>
        fieldName="CreatedBy"
        fieldSetting={exampleFieldSetting}
        defaultValueIdOrPath="Root/Example/A"
        fetchItems={async fetchQuery => {
          expect(fetchQuery.toString()).toBe("Path:'Root/Example/A'")
          done()
          return [{ Id: 1, Name: 'a', Path: '', Type: 'Document' }]
        }}
        onQueryChange={() => {
          /** */
        }}
      />,
    )
  })

  it('Text change should trigger the fetchItems method', done => {
    const instance = shallow(
      <ReferenceField<GenericContent>
        fieldName="CreatedBy"
        fieldSetting={exampleFieldSetting}
        fetchItems={async fetchQuery => {
          expect(fetchQuery.toString()).toBe("(Name:'*a*' OR DisplayName:'*a*' OR Path:'*a*')")
          done()
          return [{ Id: 123, Name: 'alba', Type: 'User', Path: 'Root/Users/Alba' }]
        }}
        onQueryChange={() => {
          /** */
        }}
      />,
    )
    instance
      .find(Autosuggest)
      .props()
      .inputProps.onChange({
        target: { value: 'a' },
      })
  })

  describe('Queries', () => {
    it('Text change query should include the allowed types', () => {
      const fieldSetting = { ...exampleFieldSetting }
      fieldSetting.AllowedTypes = ['User', 'Task']

      const mockComponent = new ReferenceField<GenericContent>({
        fieldName: 'CreatedBy',
        fieldSetting,
        fetchItems: async () => [],
        onQueryChange: () => undefined,
      })

      expect(mockComponent.getQueryFromTerm('*a*').toString()).toBe(
        "(Name:'*a*' OR DisplayName:'*a*' OR Path:'*a*') AND (TypeIs:User OR TypeIs:Task)",
      )
    })

    it('Text change query should include the selection roots', () => {
      const fieldSetting = { ...exampleFieldSetting }
      fieldSetting.SelectionRoots = ['Root/A', 'Root/B']
      const mockComponent = new ReferenceField<GenericContent>({
        fieldName: 'CreatedBy',
        fieldSetting,
        fetchItems: async () => {
          return []
        },
        onQueryChange: () => {
          /** */
        },
      })
      expect(mockComponent.getQueryFromTerm('*a*').toString()).toBe(
        "(Name:'*a*' OR DisplayName:'*a*' OR Path:'*a*') AND (InTree:\"Root/A\" OR InTree:\"Root/B\")",
      )
    })
  })
})
