import { Select } from '@material-ui/core'
import { SchemaStore } from '@sensenet/client-core/dist/Schemas/SchemaStore'
import { SchemaStore as defaultSchemas, Task, User } from '@sensenet/default-content-types'
import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { TypeField } from '../src/Components/Fields/TypeField'

describe('TypeField component', () => {
  const schemaStore = new SchemaStore()
  schemaStore.setSchemas(defaultSchemas)
  it('Should be constructed', () => {
    const instance = renderer.create(
      <TypeField
        types={[]}
        schemaStore={schemaStore}
        onQueryChange={() => {
          /** */
        }}
      />,
    )
    expect(instance)
  })

  it('Should be constructed with custom menu items', () => {
    const instance = renderer.create(
      <TypeField
        types={[]}
        schemaStore={schemaStore}
        onQueryChange={() => {
          /** */
        }}
        getMenuItem={() => <div />}
      />,
    )
    expect(instance)
  })

  it('Select change should update the query', done => {
    const instance = renderer.create(
      <TypeField
        types={[User, Task]}
        schemaStore={schemaStore}
        onQueryChange={q => {
          expect(q.toString()).toBe('TypeIs:User')
          done()
        }}
      />,
    )
    const select = instance.root.findByType(Select)
    select.props.onChange({ target: { value: 'User' } })
  })

  it('Selecting multiple values should update the query', done => {
    const instance = renderer.create(
      <TypeField
        types={[User, Task]}
        schemaStore={schemaStore}
        onQueryChange={q => {
          expect(q.toString()).toBe('TypeIs:User OR TypeIs:Task')
          done()
        }}
      />,
    )
    const select = instance.root.findByType(Select)
    select.props.onChange({ target: { value: ['User', 'Task'] } })
  })
})
