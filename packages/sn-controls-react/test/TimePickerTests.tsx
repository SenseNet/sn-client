import { shallow } from 'enzyme'
import React from 'react'
import { TimePicker } from '../src/fieldcontrols/TimePicker/TimePicker'

describe('TimePicker', () => {
  it('should be rendered in edit mode', () => {
    shallow(
      <TimePicker
        name="CreationDate"
        data-actionName="edit"
        onChange={() => {
          /** */
        }}
      />,
    )
  })
  it('should be rendered in edit mode with fieldvalue', () => {
    shallow(
      <TimePicker
        name="CreationDate"
        data-actionName="edit"
        onChange={() => {
          /** */
        }}
        data-fieldValue={'03:50:00'}
      />,
    )
  })
  it('should be rendered in new mode', () => {
    shallow(
      <TimePicker
        name="CreationDate"
        data-actionName="new"
        onChange={() => {
          /** */
        }}
      />,
    )
  })
  it('should be rendered in new mode with fieldvalue', () => {
    shallow(
      <TimePicker
        name="CreationDate"
        data-actionName="new"
        onChange={() => {
          /** */
        }}
        data-fieldValue={'03:50:00'}
      />,
    )
  })
  it('should be rendered in browse mode', () => {
    shallow(
      <TimePicker
        name="CreationDate"
        data-actionName="browse"
        onChange={() => {
          /** */
        }}
      />,
    )
  })
  it('should be rendered in browse mode with fieldvalue', () => {
    shallow(
      <TimePicker
        name="CreationDate"
        data-actionName="browse"
        onChange={() => {
          /** */
        }}
        data-fieldValue={'03:50:00'}
      />,
    )
  })
  it('should be rendered without actionname', () => {
    shallow(
      <TimePicker
        name="CreationDate"
        onChange={() => {
          /** */
        }}
        data-fieldValue={'03:50:00'}
      />,
    )
  })
})
