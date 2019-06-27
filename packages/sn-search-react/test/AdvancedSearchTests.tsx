import { SchemaStore } from '@sensenet/client-core/dist/Schemas/SchemaStore'
import { SchemaStore as defaultSchemas, GenericContent } from '@sensenet/default-content-types'
import { Query } from '@sensenet/query'
import { shallow } from 'enzyme'

import React from 'react'
import { AdvancedSearch } from '../src/Components/AdvancedSearch'

describe('AdvancedSearch component', () => {
  const schemaStore = new SchemaStore()
  schemaStore.setSchemas(defaultSchemas)
  const exampleSchema = schemaStore.getSchema(GenericContent)

  it('Should be constructed with minimal parameters', () => {
    shallow(<AdvancedSearch fields={() => <div />} schema={exampleSchema} />)
  })

  it('updateQuery() should trigger the onQueryChanged callback with the updated query', done => {
    let hasChanged = false
    shallow(
      <AdvancedSearch
        fields={options => {
          if (!hasChanged) {
            hasChanged = true
            options.updateQuery('DisplayName', new Query(q => q.equals('DisplayName', 'Alma')))
          }
          return <div />
        }}
        onQueryChanged={q => {
          expect(q.toString()).toBe("(DisplayName:'Alma')")
          done()
        }}
        schema={exampleSchema}
      />,
    )
  })

  it('updateQuery() should trigger the debounced onQueryChanged callback with an aggregated query', done => {
    let hasChanged = false
    shallow(
      <AdvancedSearch
        fields={options => {
          if (!hasChanged) {
            hasChanged = true
            options.updateQuery('DisplayName', new Query(q => q.equals('DisplayName', 'Alma')))
            options.updateQuery('Name', new Query(q => q.equals('Name', 'Körte')))
          }
          return <div />
        }}
        onQueryChanged={q => {
          expect(q.toString()).toBe("(DisplayName:'Alma') AND (Name:'Körte')")
          done()
        }}
        schema={exampleSchema}
      />,
    )
  })
})
