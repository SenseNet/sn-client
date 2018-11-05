import { SchemaStore } from '@sensenet/client-core/dist/Schemas/SchemaStore'
import { GenericContent, SchemaStore as defaultSchemas } from '@sensenet/default-content-types'
import { Query } from '@sensenet/query'
import { expect } from 'chai'
import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { AdvancedSearch } from '../src/'

/**
 * Tests for the Advanced Search component
 */
export const advancedSearchTests = describe('AdvancedSearch component', () => {
    const schemaStore = new SchemaStore()
    schemaStore.setSchemas(defaultSchemas)
    const exampleSchema = schemaStore.getSchema(GenericContent)

    it('Should be constructed with minimal parameters', () => {
        renderer.create(<AdvancedSearch
            fields={() => <div></div>}
            schema={exampleSchema}
        />)
    })

    it('updateQuery() should trigger the onQueryChanged callback with the updated query', (done: MochaDone) => {
        let hasChanged: boolean = false
        renderer.create(<AdvancedSearch
            fields={(options) => {
                if (!hasChanged) {
                    hasChanged = true
                    options.updateQuery('DisplayName', new Query((q) => q.equals('DisplayName', 'Alma')))
                }
                return <div></div>
            }}
            onQueryChanged={(q) => {
                expect(q.toString()).to.be.eq('(DisplayName:\'Alma\')')
                done()
            }}
            schema={exampleSchema}
        />)
    })

    it('updateQuery() should trigger the debounced onQueryChanged callback with an aggregated query', (done: MochaDone) => {
        let hasChanged: boolean = false
        renderer.create(<AdvancedSearch
            fields={(options) => {
                if (!hasChanged) {
                    hasChanged = true
                    options.updateQuery('DisplayName', new Query((q) => q.equals('DisplayName', 'Alma')))
                    options.updateQuery('Name', new Query((q) => q.equals('Name', 'Körte')))
                }
                return <div></div>
            }}
            onQueryChanged={(q) => {
                expect(q.toString()).to.be.eq('(DisplayName:\'Alma\') AND (Name:\'Körte\')')
                done()
            }}
            schema={exampleSchema}
        />)
    })
})
