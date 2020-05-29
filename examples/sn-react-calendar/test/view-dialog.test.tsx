import Button from '@material-ui/core/Button'
import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import { DialogComponent, DialogProps } from '../src/components/view-dialog'
import { CalendarTestEvent } from './mocks/test-objects'

describe('DialogComponent', () => {
  const testprops: DialogProps = {
    open: true,
    content: CalendarTestEvent as any,
    onClose: jest.fn(),
  }
  let wrapper: ShallowWrapper

  beforeEach(() => {
    wrapper = shallow(<DialogComponent {...testprops} />)
  })

  it('Close dialog', () => {
    wrapper.find(Button).last().simulate('click')
    expect(testprops.onClose).toBeCalledWith(false)
  })
})
