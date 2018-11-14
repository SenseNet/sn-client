import { TextField } from '@material-ui/core'
import { SchemaStore } from '@sensenet/client-core/dist/Schemas/SchemaStore'
import { GenericContent, ReferenceFieldSetting, SchemaStore as defaultSchemas } from '@sensenet/default-content-types'
import { expect } from 'chai'
import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { ReferenceField } from '../src/Components/Fields/ReferenceField'

/**
 * Reference field component tests
 */
export const referenceFieldTests = describe('ReferenceField Component', () => {

    const schemaStore = new SchemaStore()
    schemaStore.setSchemas(defaultSchemas)
    const exampleSchema = schemaStore.getSchema(GenericContent)
    const exampleFieldSetting = exampleSchema.FieldSettings.find((f) => f.Name === 'CreatedBy') as ReferenceFieldSetting

    it('Should be constructed', () => {
        renderer.create(<ReferenceField<GenericContent>
            fieldName="CreatedBy"
            fieldSetting={exampleFieldSetting}
            fetchItems={async () => []}
            onQueryChange={() => { /** */ }}
        />).unmount()
    })

    it('Should be constructed with default Id', (done) => {
        renderer.create(<ReferenceField<GenericContent>
            fieldName="CreatedBy"
            fieldSetting={exampleFieldSetting}
            defaultValueIdOrPath={1}
            fetchItems={async (fetchQuery) => {
                expect(fetchQuery.toString()).to.be.eq('Id:\'1\'')
                done()
                return [{ Id: 1, Name: 'a', Path: '', Type: 'Document' }]
            }}
            onQueryChange={() => { /** */ }}
        />)
    })

    it('Should be constructed with default Path', (done) => {
        renderer.create(<ReferenceField<GenericContent>
            fieldName="CreatedBy"
            fieldSetting={exampleFieldSetting}
            defaultValueIdOrPath="Root/Example/A"
            fetchItems={async (fetchQuery) => {
                expect(fetchQuery.toString()).to.be.eq('Path:\'Root/Example/A\'')
                done()
                return [{ Id: 1, Name: 'a', Path: '', Type: 'Document' }]
            }}
            onQueryChange={() => { /** */ }}
        />)
    })

    it('Text change should trigger the fetchItems method', (done) => {
        const instance = renderer.create(<ReferenceField<GenericContent>
            fieldName="CreatedBy"
            fieldSetting={exampleFieldSetting}
            fetchItems={async (fetchQuery) => {
                expect(fetchQuery.toString()).to.be.eq('(Name:\'*a*\' OR DisplayName:\'*a*\')')
                done()
                instance.unmount()
                return []
            }}
            onQueryChange={() => { /** */ }}
        />)
        instance.root.findByType(TextField).props.onChange({ target: { value: 'a' }, persist: () => {/** */ } })
    })

    it('Text change query should include the allowed types', (done) => {
        const fieldSetting = { ...exampleFieldSetting }
        fieldSetting.AllowedTypes = ['User', 'Task']
        const instance = renderer.create(<ReferenceField<GenericContent>
            fieldName="CreatedBy"
            fieldSetting={fieldSetting}
            fetchItems={async (fetchQuery) => {
                expect(fetchQuery.toString()).to.be.eq('(Name:\'*a*\' OR DisplayName:\'*a*\') AND (TypeIs:User OR TypeIs:Task)')
                done()
                instance.unmount()
                return []
            }}
            onQueryChange={() => { /** */ }}
        />)
        instance.root.findByType(TextField).props.onChange({ target: { value: 'a' }, persist: () => {/** */ } })
    })

    it('Text change query should include the selection roots', (done) => {
        const fieldSetting = { ...exampleFieldSetting }
        fieldSetting.SelectionRoots = ['Root/A', 'Root/B']
        const instance = renderer.create(<ReferenceField<GenericContent>
            fieldName="CreatedBy"
            fieldSetting={fieldSetting}
            fetchItems={async (fetchQuery) => {
                expect(fetchQuery.toString()).to.be.eq('(Name:\'*a*\' OR DisplayName:\'*a*\') AND (InTree:"Root/A" OR InTree:"Root/B")')
                done()
                instance.unmount()
                return []
            }}
            onQueryChange={() => { /** */ }}
        />)
        instance.root.findByType(TextField).props.onChange({ target: { value: 'a' }, persist: () => {/** */ } })
    })
})
