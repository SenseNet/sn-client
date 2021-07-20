import { SchemaStore } from '@sensenet/client-core'
import { SchemaStore as defaultSchemas, GenericContent, ReferenceFieldSetting } from '@sensenet/default-content-types'
import TextField from '@material-ui/core/TextField'
import { setImmediate } from 'timers'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { ReferenceField } from '../src/Components/Fields/ReferenceField'
import { ReferenceFieldContainer } from '../src/Components/Fields/ReferenceFieldContainer'
import { ReferenceFieldInput } from '../src/Components/Fields/ReferenceFieldInput'
import { ReferenceFieldSuggestion } from '../src/Components/Fields/ReferenceFieldSuggestion'

describe('ReferenceField Component', () => {
  const schemaStore = new SchemaStore()
  schemaStore.setSchemas(defaultSchemas)
  const exampleSchema = schemaStore.getSchemaByName('GenericContent')
  const exampleFieldSetting = exampleSchema.FieldSettings.find((f) => f.Name === 'CreatedBy') as ReferenceFieldSetting
  const flushPromises = () => new Promise(setImmediate)

  it('Should be constructed', () => {
    shallow(
      <ReferenceField<GenericContent>
        fieldName="CreatedBy"
        fieldSetting={exampleFieldSetting}
        fetchItems={async () => []}
        onQueryChange={jest.fn()}
      />,
    ).unmount()
  })

  it('Should be constructed with additional autoSuggest parameters', async () => {
    shallow(
      <ReferenceField<GenericContent>
        autoSuggestProps={{
          alwaysRenderSuggestions: true,
          suggestions: [{ Id: 123, Path: 'Root/Content', Name: 'Content', Type: 'Content' }],
        }}
        fieldName="CreatedBy"
        fieldSetting={exampleFieldSetting}
        fetchItems={async () => []}
        onQueryChange={jest.fn()}
      />,
    ).unmount()
  })

  it('Should be constructed with default Id', async () => {
    mount(
      <ReferenceField<GenericContent>
        fieldName="CreatedBy"
        fieldSetting={exampleFieldSetting}
        defaultValueIdOrPath={1}
        fetchItems={async (fetchQuery) => {
          Promise.resolve()
          expect(fetchQuery.toString()).toBe("Id:'1'")
          return [{ Id: 1, Name: 'a', Path: '', Type: 'Document' }]
        }}
        onQueryChange={jest.fn()}
      />,
    )
    await act(flushPromises)
  })

  it('Should be constructed with default Path', async () => {
    mount(
      <ReferenceField<GenericContent>
        fieldName="CreatedBy"
        fieldSetting={exampleFieldSetting}
        defaultValueIdOrPath="Root/Example/A"
        fetchItems={async (fetchQuery) => {
          expect(fetchQuery.toString()).toBe("Path:'Root/Example/A'")
          return [{ Id: 1, Name: 'a', Path: '', Type: 'Document' }]
        }}
        onQueryChange={() => {
          /** */
        }}
      />,
    )
    await act(flushPromises)
  })

  it('Text change should trigger the fetchItems method', async () => {
    const instance = mount(
      <ReferenceField<GenericContent>
        fieldName="CreatedBy"
        fieldSetting={exampleFieldSetting}
        fetchItems={async (fetchQuery) => {
          expect(fetchQuery.toString()).toBe("(Name:'*a*' OR DisplayName:'*a*' OR Path:'*a*')")
          return [{ Id: 123, Name: 'alba', Type: 'User', Path: 'Root/Users/Alba' }]
        }}
        onQueryChange={jest.fn()}
      />,
    )

    await act(async () => {
      instance.find('input').simulate('change', { target: { value: 'a' } })
    })

    await act(flushPromises)
  })

  describe('Queries', () => {
    let wrapper: any

    it('Text change query should include the allowed types', async () => {
      const fieldOnChange = jest.fn(async (_) => [])
      const fieldSetting = { ...exampleFieldSetting }
      fieldSetting.AllowedTypes = ['User', 'Task']

      await act(async () => {
        wrapper = mount(<ReferenceField fieldName="CreatedBy" fieldSetting={fieldSetting} fetchItems={fieldOnChange} />)
      })

      await act(async () => {
        wrapper.find('input').simulate('change', { target: { value: 'a' } })
      })

      const call = fieldOnChange.mock.calls[0]
      expect(call[0].toString()).toBe(
        "(Name:'*a*' OR DisplayName:'*a*' OR Path:'*a*') AND (TypeIs:User OR TypeIs:Task)",
      )
    })

    it('Text change query should include the selection roots', async () => {
      const fieldOnChange = jest.fn(async (_) => [])
      const fieldSetting = { ...exampleFieldSetting }
      fieldSetting.SelectionRoots = ['Root/A', 'Root/B']

      await act(async () => {
        wrapper = mount(<ReferenceField fieldName="CreatedBy" fieldSetting={fieldSetting} fetchItems={fieldOnChange} />)
      })

      await act(async () => {
        wrapper.find('input').simulate('change', { target: { value: 'a' } })
      })

      const call = fieldOnChange.mock.calls[0]
      expect(call[0].toString()).toBe(
        "(Name:'*a*' OR DisplayName:'*a*' OR Path:'*a*') AND (InTree:\"Root/A\" OR InTree:\"Root/B\")",
      )
    })
  })

  describe('Container', () => {
    it('Should be rendered without error', () => {
      expect(
        shallow(
          <ReferenceFieldContainer
            query=""
            containerProps={{ id: '1', key: '1', ref: null as any, className: '', role: '' }}>
            <span>a</span>
          </ReferenceFieldContainer>,
        ),
      ).toMatchSnapshot()
    })
  })

  describe('InputField', () => {
    it('Should be rendered without error', () => {
      expect(shallow(<ReferenceFieldInput inputProps={{ onChange: jest.fn(), value: '' }} />)).toMatchSnapshot()
    })

    it('Should exec onChange when the value is changed', () => {
      const onChange = jest.fn()
      const ev = { currentTarget: { value: 'a' } }
      const component = shallow(<ReferenceFieldInput inputProps={{ onChange, value: '' }} />)
      component.find(TextField).first().simulate('change', ev)
      expect(onChange).toBeCalledWith(ev)
    })
  })

  describe('Suggestion', () => {
    it('Should be rendered without error', () => {
      expect(
        shallow(
          <ReferenceFieldSuggestion
            item={{ Id: 1, Name: 'Alma', Type: 'GenericContent', Path: 'Root/Sites/Alma' }}
            isHighlighted={true}
            query="Al"
          />,
        ),
      ).toMatchSnapshot()
    })
  })
})
