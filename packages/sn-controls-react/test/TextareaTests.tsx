import { Typography } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import { shallow } from 'enzyme'
import React from 'react'
import { Textarea } from '../src/fieldcontrols/Textarea/Textarea'

describe('Textarea component', () => {
  it('should be rendered in edit mode', () => {
    shallow(
      <Textarea
        name="Description"
        onChange={() => {
          /** */
        }}
        data-actionName="edit"
        data-textType="LongText"
      />,
    )
  })
  it('should be rendered in edit mode with default value', () => {
    shallow(
      <Textarea
        name="Description"
        onChange={() => {
          /** */
        }}
        data-textType="LongText"
        data-actionName="edit"
        data-defaultValue="Lorem ipsum dolor sit amet!"
      />,
    )
  })
  it('should be rendered in edit mode with value', () => {
    shallow(
      <Textarea
        name="Description"
        onChange={() => {
          /** */
        }}
        data-textType="LongText"
        data-actionName="edit"
        data-fieldValue="Lorem ipsum dolor sit amet!"
      />,
    )
  })
  it('should handle errors and display error message in edit mode', () => {
    shallow(
      <Textarea
        name="Description"
        onChange={() => {
          /** */
        }}
        data-textType="LongText"
        data-actionName="edit"
        data-errorText="Please provide a valid value!"
      />,
    )
  })
  it('should be rendered in new mode', () => {
    shallow(
      <Textarea
        name="Description"
        onChange={() => {
          /** */
        }}
        data-actionName="new"
        data-textType="LongText"
      />,
    )
  })
  it('should be rendered in new mode with default value', () => {
    shallow(
      <Textarea
        name="Description"
        onChange={() => {
          /** */
        }}
        data-textType="LongText"
        data-actionName="new"
        data-defaultValue="Lorem ipsum dolor sit amet!"
      />,
    )
  })
  it('should be rendered in new mode with value', () => {
    shallow(
      <Textarea
        name="Description"
        onChange={() => {
          /** */
        }}
        data-textType="LongText"
        data-actionName="new"
        data-fieldValue="Lorem ipsum dolor sit amet!"
      />,
    )
  })
  it('should handle errors and display error message in new mode', () => {
    shallow(
      <Textarea
        name="Description"
        onChange={() => {
          /** */
        }}
        data-textType="LongText"
        data-actionName="new"
        data-errorText="Please provide a valid value!"
      />,
    )
  })
  it('should be rendered in browse mode', () => {
    shallow(
      <Textarea
        name="Description"
        onChange={() => {
          /** */
        }}
        data-actionName="browse"
        data-textType="LongText"
        value="Lorem ipsum dolor sit amet!"
      />,
    )
  })
  it('should be display value as text in browse mode', () => {
    const control = shallow(
      <Textarea
        name="Description"
        onChange={() => {
          /** */
        }}
        data-actionName="browse"
        data-textType="LongText"
        value="Lorem ipsum dolor sit amet!"
      />,
    )
    const wrapper = control.find(Typography)
    expect(wrapper.contains('Lorem ipsum dolor sit amet!')).toBe(true)
  })
  it('should be rendered without setting the action mode', () => {
    shallow(
      <Textarea
        name="Description"
        onChange={() => {
          /** */
        }}
        data-textType="LongText"
        value="Lorem ipsum dolor sit amet!"
      />,
    )
  })
  it('should be display value as text without setting the action mode', () => {
    const control = shallow(
      <Textarea
        name="Description"
        onChange={() => {
          /** */
        }}
        data-textType="LongText"
        value="Lorem ipsum dolor sit amet!"
      />,
    )
    const wrapper = control.find(Typography)
    expect(wrapper.contains('Lorem ipsum dolor sit amet!')).toBe(true)
  })
  it('should return empty component with no value in browse mode', () => {
    const instance = shallow(
      <Textarea
        name="Description"
        data-textType="LongText"
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
      <Textarea
        name="Description"
        data-textType="LongText"
        onChange={() => {
          /** */
        }}
      />,
    )
    expect(instance).toEqual({})
  })
  it('handleChange() should be executed on input change in edit mode', done => {
    const instance = shallow(
      <Textarea
        name="Description"
        onChange={(field, value) => {
          expect(field).toBe('Description')
          expect(value).toBe('Lorem ipsum dolor sit amet!')
          done()
        }}
        data-textType="LongText"
        data-actionName="edit"
      />,
    )
    const input = instance.find(TextField)
    input.props().onChange!({ target: { value: 'Lorem ipsum dolor sit amet!' } } as any)
  })
  it('handleChange() should be executed on input change in new mode', done => {
    const instance = shallow(
      <Textarea
        name="Description"
        onChange={(field, value) => {
          expect(field).toBe('Description')
          expect(value).toBe('Lorem ipsum dolor sit amet!')
          done()
        }}
        data-textType="LongText"
        data-actionName="new"
      />,
    )
    const input = instance.find(TextField)
    input.props().onChange!({ target: { value: 'Lorem ipsum dolor sit amet!' } } as any)
  })
})
