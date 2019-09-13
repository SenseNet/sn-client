import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { CreateComment, CreateCommentProps } from '../src/components'
import { CommentStateContext, CommentStateProvider } from '../src/context/comment-states'

describe('Create comment component', () => {
  const defaultProps: CreateCommentProps = {
    createComment: jest.fn(),
    localization: {
      addComment: 'addComment',
      commentInputPlaceholder: 'commentInputPlaceholder',
      submit: 'submit',
      inputRequiredError: 'inputRequiredError',
      markerRequiredError: 'markerRequiredError',
      markerTooltip: 'markerTooltip',
      cancelButton: 'cancel',
    },
    isActive: true,
    handleIsActive: jest.fn(),
    handleInputValueChange: jest.fn(),
    inputValue: '',
  }

  it('should show add comment button when not active', () => {
    const wrapper = shallow(<CreateComment {...defaultProps} isActive={false} />)
    expect(wrapper.find(Button).exists()).toBeTruthy()
    expect(wrapper.find(Button).length).toBe(1)
  })

  it('should handle isActive when add comment button is clicked', () => {
    const wrapper = shallow(<CreateComment {...defaultProps} isActive={false} />)
    wrapper.find(Button).simulate('click')
    expect(defaultProps.handleIsActive).toBeCalled()
  })

  it('should add comment when submit button is clicked', () => {
    const wrapper = mount(<CreateComment {...defaultProps} inputValue="Hello" />)
    wrapper
      .find(Button)
      .first()
      .simulate('submit')
    expect(defaultProps.createComment).toBeCalled()
  })

  it('should add comment when form is submitted', () => {
    const wrapper = mount(<CreateComment {...defaultProps} inputValue="Hello" />)
    wrapper.find('form').simulate('submit')
    expect(defaultProps.createComment).toBeCalled()
  })

  it('should handle cancel button click', () => {
    const wrapper = mount(<CreateComment {...defaultProps} />)
    wrapper
      .find(Button)
      .last()
      .simulate('click')
    expect(defaultProps.handleIsActive).toBeCalled()
  })

  it('should clear input value after submitted', () => {
    const wrapper = mount(<CreateComment {...defaultProps} inputValue="Hello" />)
    wrapper
      .find(Button)
      .first()
      .simulate('submit')
    expect(defaultProps.handleIsActive).toBeCalled()
    expect(defaultProps.handleInputValueChange).toBeCalledWith('')
  })

  it('should clear input value when cancel clicked', () => {
    const wrapper = mount(<CreateComment {...defaultProps} inputValue="Hello" />)
    wrapper
      .find(Button)
      .last()
      .simulate('click')
    expect(defaultProps.handleIsActive).toBeCalled()
    expect(defaultProps.handleInputValueChange).toBeCalledWith('')
    expect(wrapper.prop('isPlacingMarker')).toBeFalsy()
  })

  it('should handle input change', () => {
    const wrapper = mount(<CreateComment {...defaultProps} />)
    wrapper
      .find('textarea')
      .first()
      .simulate('change', { target: { value: 'Hello' } })
    wrapper.find('form').simulate('submit')
    expect(defaultProps.handleInputValueChange).toBeCalledWith('Hello')
  })

  it('should give an error message when input is empty', () => {
    const wrapper = mount(
      <CommentStateProvider>
        <CreateComment {...defaultProps} />
      </CommentStateProvider>,
    )
    wrapper.find('form').simulate('submit')
    expect(wrapper.find(FormHelperText).text()).toEqual(defaultProps.localization!.inputRequiredError)
  })

  it('should give an error message when input is filled but draftCommentMarker is undefined', () => {
    const wrapper = mount(
      <CommentStateContext.Provider value={{ setActiveComment: () => undefined, setDraft: () => undefined }}>
        <CreateComment {...defaultProps} />
      </CommentStateContext.Provider>,
    )
    wrapper.find('input').simulate('change', { target: { value: 'Hello There' } })
    wrapper.find('form').simulate('submit')
    expect(wrapper.find(FormHelperText).text()).toEqual(defaultProps.localization!.markerRequiredError)
  })

  it('should give an error message when draftCommentMarker is set but input is empty', () => {
    const wrapper = mount(<CreateComment {...defaultProps} />)
    wrapper.find('form').simulate('submit')
    expect(wrapper.find(FormHelperText).text()).toEqual(defaultProps.localization!.inputRequiredError)
  })
})
