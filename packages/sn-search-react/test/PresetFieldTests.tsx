import { Select } from '@material-ui/core'
import { Query } from '@sensenet/query'
import { expect } from 'chai'
import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { PresetField } from '../src/Components/Fields/PresetField'

/**
 * Test for the Preset Field component
 */
export const presetFieldTests = describe('Preset Fields', () => {
  it('Should be constructed', () => {
    renderer.create(
      <PresetField
        fieldName="DisplayName"
        presets={[{ text: 'value1', value: new Query(q => q) }]}
        onQueryChange={(key, q) => {
          /** */
        }}
      />,
    )
  })

  it('Should be constructed with default value', () => {
    renderer.create(
      <PresetField
        fieldName="DisplayName"
        presets={[{ text: 'value1', value: new Query(q => q) }]}
        defaultValue="value1"
        onQueryChange={(key, q) => {
          /** */
        }}
      />,
    )
  })

  it('onQueryChange should be executed on change', done => {
    const instance = renderer.create(
      <PresetField
        fieldName="DisplayName"
        presets={[{ text: 'value1', value: new Query(q => q.equals('DisplayName', 'Alma')) }]}
        onQueryChange={(key, q, name) => {
          expect(key).to.be.eq('DisplayName')
          expect(q.toString()).to.be.eq("DisplayName:'Alma'")
          expect(name).to.be.eq('value1')
          done()
        }}
      />,
    )
    const select = instance.root.findByType(Select)
    select.props.onChange({ target: { value: 'value1' } })
    expect(select)
  })

  it('onQueryChange should not be executed when there is no hit in presets', done => {
    const instance = renderer.create(
      <PresetField
        fieldName="DisplayName"
        presets={[{ text: 'value1', value: new Query(q => q) }]}
        onQueryChange={(key, q) => {
          throw Error("Shouldn't be triggered")
        }}
      />,
    )
    const select = instance.root.findByType(Select)
    select.props.onChange({ target: { value: 'value2' } })

    setTimeout(() => {
      done()
    }, 150)
  })
})
