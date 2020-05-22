import React from 'react'
import Button from '@material-ui/core/Button'
import { shallow } from 'enzyme'
import { ConfirmationDialog, ConfirmationDialogProps } from '../src/components'

describe('Confirmation dialog component', () => {
  const defaultProps: ConfirmationDialogProps = {
    cancelButtonText: 'Cancel',
    dialogTitle: 'Some dialog title',
    isOpen: true,
    okButtonText: 'OK',
    onClose: jest.fn(),
  }

  it('should render with default props', () => {
    const wrapper = shallow(
      <ConfirmationDialog {...defaultProps}>
        <p>Are you sure?</p>
      </ConfirmationDialog>,
    )
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper).toMatchSnapshot()
  })

  it('should render without button texts', () => {
    const { isOpen, onClose, dialogTitle } = defaultProps
    const wrapper = shallow(
      <ConfirmationDialog isOpen={isOpen} onClose={onClose} dialogTitle={dialogTitle}>
        <p>Are you sure?</p>
      </ConfirmationDialog>,
    )
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper).toMatchSnapshot()
  })

  it('should give back true when ok is clicked', () => {
    const onClose = jest.fn()
    const wrapper = shallow(<ConfirmationDialog {...defaultProps} onClose={onClose} />)
    wrapper.find(Button).last().simulate('click')
    expect(onClose).toBeCalledWith(true)
  })

  it('should give back false when cancel is clicked', () => {
    const onClose = jest.fn()
    const wrapper = shallow(<ConfirmationDialog {...defaultProps} onClose={onClose} />)
    wrapper.find(Button).first().simulate('click')
    expect(onClose).toBeCalledWith(false)
  })
})
