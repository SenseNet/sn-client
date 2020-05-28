import MaterialTextField from '@material-ui/core/TextField'
import { shallow } from 'enzyme'
import React from 'react'
import { NestedTextField } from '../src/Components/Fields/NestedTextField'

describe('NestedTextField Component', () => {
  it('Should be constructed', () => {
    shallow(
      <NestedTextField
        fieldName="Owner"
        nestedFieldName="DisplayName"
        fieldSetting={{}}
        onQueryChange={() => {
          /**  */
        }}
      />,
    )
  })

  it('onQueryChanged() should be executed on input change', (done) => {
    const instance = shallow(
      <NestedTextField
        fieldName="Owner"
        nestedFieldName="DisplayName"
        fieldSetting={{}}
        onQueryChange={(key, q, text) => {
          expect(key).toBe('Owner')
          expect(q.toString()).toBe('Owner:{{DisplayName:Alma}}')
          expect(text).toBe('Alma')
          done()
        }}
      />,
    )
    const input = instance.find(MaterialTextField)
    input.props().onChange!({ currentTarget: { value: 'Alma' } } as any)
  })

  it('onQueryChanged() should be executed on input change with an empty query if no value provided', (done) => {
    const instance = shallow(
      <NestedTextField
        fieldName="Owner"
        nestedFieldName="DisplayName"
        fieldSetting={{}}
        onQueryChange={(key, q) => {
          expect(key).toBe('Owner')
          expect(q.toString()).toBe('')
          done()
        }}
      />,
    )
    const input = instance.find(MaterialTextField)
    input.props().onChange!({ currentTarget: {} } as any)
  })
})
