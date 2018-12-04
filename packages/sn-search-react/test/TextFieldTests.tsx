import { TextField as MaterialTextField } from '@material-ui/core'
import { expect } from 'chai'
import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { TextField } from '../src/Components/Fields/TextField'

/**
 * Tests for the TextField Component
 */
export const textFieldTests = describe('TextField Component', () => {
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
          expect(key).to.be.eq('DisplayName')
          expect(q.toString()).to.be.eq("DisplayName:'*Alma*'")
          expect(text).to.be.eq('Alma')
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
          expect(key).to.be.eq('DisplayName')
          expect(q.toString()).to.be.eq('')
          done()
        }}
      />,
    )
    const input = instance.root.findByType(MaterialTextField)
    input.props.onChange({ currentTarget: {} })
  })
})
