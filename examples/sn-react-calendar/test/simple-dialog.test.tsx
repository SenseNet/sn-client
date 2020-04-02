import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import Button from '@material-ui/core/Button'
import { DialogComponent, DialogProps } from '../src/components/simple-dialog'

describe('DialogComponent', () => {
  const testprops: DialogProps = {
    open: true,
    title: 'Test title',
    onClose: jest.fn(),
  }
  let wrapper: ShallowWrapper

  beforeEach(() => {
    wrapper = shallow(<DialogComponent {...testprops} />)
  })

  it('Open dialog', () => {
    wrapper
      .find(Button)
      .first()
      .simulate('click')
    expect(testprops.onClose).toBeCalledWith(true)
  })

  it('Close dialog', () => {
    wrapper
      .find(Button)
      .last()
      .simulate('click')
    expect(testprops.onClose).toBeCalledWith(false)
  })
})
