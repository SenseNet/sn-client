import { TextField as MaterialTextField } from '@material-ui/core'
import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { TextField } from '../src/Components/Fields/TextField'

describe('TextField Component', () => {
  it('Should be constructed', () => {
    renderer.create(
      <TextField
        fieldName="DisplayName"
        fieldSetting={{}}
        onQueryChange={() => {
          /**  */
        }}
      />,
    )
  })

  it('onQueryChanged() should be executed on input change', done => {
    const instance = renderer.create(
      <TextField
        fieldName="DisplayName"
        fieldSetting={{}}
        onQueryChange={(key, q, text) => {
          expect(key).toBe('DisplayName')
          expect(q.toString()).toBe("DisplayName:'*Alma*'")
          expect(text).toBe('Alma')
          done()
        }}
      />,
    )
    const input = instance.root.findByType(MaterialTextField)
    input.props.onChange({ currentTarget: { value: 'Alma' } })
  })

  it('onQueryChanged() should be executed on input change with an empty query if no value provided', done => {
    const instance = renderer.create(
      <TextField
        fieldName="DisplayName"
        fieldSetting={{}}
        onQueryChange={(key, q) => {
          expect(key).toBe('DisplayName')
          expect(q.toString()).toBe('')
          done()
        }}
      />,
    )
    const input = instance.root.findByType(MaterialTextField)
    input.props.onChange({ currentTarget: {} })
  })
})
