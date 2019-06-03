import TextField from '@material-ui/core/TextField'
import { shallow } from 'enzyme'
import React from 'react'
import { ShortText } from '../src/fieldcontrols/ShortText/ShortText'

describe('ShortText component', () => {
  it('should be rendered in edit mode', () => {
    shallow(
      <ShortText
        name="DisplayName"
        onChange={() => {
          /** */
        }}
        data-actionName="edit"
      />,
    )
  })
  it('should be rendered with default value in edit mode', () => {
    shallow(
      <ShortText
        name="DisplayName"
        onChange={() => {
          /** */
        }}
        data-defaultValue="Lorem ipsum"
        data-actionName="edit"
      />,
    )
  })
  it('should be rendered with value in edit mode', () => {
    shallow(
      <ShortText
        name="DisplayName"
        onChange={() => {
          /** */
        }}
        data-fieldValue="Lorem ipsum"
        data-actionName="edit"
      />,
    )
  })
  it('should be rendered with error message in edit mode', () => {
    shallow(
      <ShortText
        name="DisplayName"
        onChange={() => {
          /** */
        }}
        data-errorText="Please provide a valid value"
        data-actionName="edit"
      />,
    )
  })
  it('should be rendered in new mode', () => {
    shallow(
      <ShortText
        name="DisplayName"
        onChange={() => {
          /** */
        }}
        data-actionName="new"
      />,
    )
  })
  it('should be rendered with default value in new mode', () => {
    shallow(
      <ShortText
        name="DisplayName"
        onChange={() => {
          /** */
        }}
        data-defaultValue="Lorem ipsum"
        data-actionName="new"
      />,
    )
  })
  it('should be rendered with value in new mode', () => {
    shallow(
      <ShortText
        name="DisplayName"
        onChange={() => {
          /** */
        }}
        data-fieldValue="Lorem ipsum"
        data-actionName="new"
      />,
    )
  })
  it('should be rendered with error message in new mode', () => {
    shallow(
      <ShortText
        name="DisplayName"
        onChange={() => {
          /** */
        }}
        data-errorText="Please provide a valid value"
        data-actionName="new"
      />,
    )
  })
  it('handleChange() should be executed on input change in edit mode', done => {
    const instance = shallow(
      <ShortText
        name="DisplayName"
        onChange={(field, value) => {
          expect(field).toBe('DisplayName')
          expect(value).toBe('Lorem ipsum')
          done()
        }}
        data-actionName="edit"
      />,
    )
    const input = instance.find(TextField)
    input.props().onChange!({ target: { value: 'Lorem ipsum' } } as any)
  })
  it('handleChange() should be executed on input change in new mode', done => {
    const instance = shallow(
      <ShortText
        name="DisplayName"
        onChange={(field, value) => {
          expect(field).toBe('DisplayName')
          expect(value).toBe('Lorem ipsum')
          done()
        }}
        data-actionName="new"
      />,
    )
    const input = instance.find(TextField)
    input.props().onChange!({ target: { value: 'Lorem ipsum' } } as any)
  })
  it('should be rendered with value in browse mode', () => {
    shallow(
      <ShortText
        name="DisplayName"
        onChange={() => {
          /** */
        }}
        value="Lorem ipsum"
        data-actionName="browse"
      />,
    )
  })
  it('should be rendered with value with no mode', () => {
    shallow(
      <ShortText
        name="DisplayName"
        onChange={() => {
          /** */
        }}
        value="Lorem ipsum"
      />,
    )
  })
  it('should return empty component with no value in browse mode', () => {
    const instance = shallow(
      <ShortText
        name="DisplayName"
        onChange={() => {
          /** */
        }}
        data-actionName="browse"
      />,
    )
    expect(instance).toEqual({})
  })
  it('should return empty component with no value and no mode', () => {
    const instance = shallow(
      <ShortText
        name="DisplayName"
        onChange={() => {
          /** */
        }}
      />,
    )
    expect(instance).toEqual({})
  })
})
