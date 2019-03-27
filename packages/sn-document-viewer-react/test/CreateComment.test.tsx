import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import SvgIcon from '@material-ui/core/SvgIcon'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { CreateComment, CreateCommentProps } from '../src/components'

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
    },
    handlePlaceMarkerClick: jest.fn(),
    isPlacingMarker: false,
    draftCommentMarker: { x: 10, y: 10, id: 'id' },
  }

  it('should show add comment button', () => {
    const wrapper = shallow(<CreateComment {...defaultProps} />)
    expect(wrapper.find(Button).exists()).toBeTruthy()
    expect(wrapper.find(Button).length).toBe(1)
  })

  it('should show a form when add comment button is clicked', () => {
    const wrapper = mount(<CreateComment {...defaultProps} />)
    wrapper.find(Button).simulate('click')
    expect(wrapper.find(FormControl).exists()).toBeTruthy()
  })

  it('should add comment when submit button is clicked', () => {
    const createComment = jest.fn()
    const wrapper = mount(<CreateComment {...defaultProps} createComment={createComment} />)
    wrapper.find(Button).simulate('click')
    wrapper.find('input').simulate('change', { target: { value: 'Hello' } })
    wrapper.find(Button).simulate('submit')
    expect(createComment).toBeCalled()
  })

  it('should add comment when form is submitted', () => {
    const createComment = jest.fn()
    const wrapper = mount(<CreateComment {...defaultProps} createComment={createComment} />)
    wrapper.find(Button).simulate('click')
    wrapper.find('input').simulate('change', { target: { value: 'Hello' } })
    wrapper.find('form').simulate('submit')
    expect(createComment).toBeCalled()
  })

  it('should clear input value after submitted', () => {
    const createComment = jest.fn()
    const wrapper = mount(<CreateComment {...defaultProps} createComment={createComment} />)
    // toggle isActive state to true
    wrapper.find(Button).simulate('click')
    wrapper.find('input').simulate('change', { target: { value: 'Hello' } })
    wrapper.find(Button).simulate('submit')
    wrapper.find(Button).simulate('click')
    expect(wrapper.find(Input).prop('value')).toBe('')
  })

  it('should handle marker placement', () => {
    const handlePlaceMarkerClick = jest.fn()
    const wrapper = mount(<CreateComment {...defaultProps} handlePlaceMarkerClick={handlePlaceMarkerClick} />)
    wrapper.find(Button).simulate('click')
    wrapper.find(IconButton).simulate('click')
    expect(handlePlaceMarkerClick).toBeCalled()
  })

  it("'s comment marker should look different when placing is happening", () => {
    const wrapper = mount(<CreateComment {...defaultProps} isPlacingMarker={true} />)
    wrapper.find(Button).simulate('click')
    const iconStyle = wrapper.find(SvgIcon).prop('style')
    expect(iconStyle).toEqual({ transform: 'rotate(90deg)', color: 'blue' })
  })

  it('should give an error message when input is empty', () => {
    const wrapper = mount(<CreateComment {...defaultProps} draftCommentMarker={undefined} />)
    wrapper.find(Button).simulate('click')
    wrapper.find('form').simulate('submit')
    expect(wrapper.find(FormHelperText).text()).toEqual(defaultProps.localization!.inputRequiredError)
  })

  it('should give an error message when input is filled but draftCommentMarker is undefined', () => {
    const wrapper = mount(<CreateComment {...defaultProps} draftCommentMarker={undefined} />)
    wrapper.find(Button).simulate('click')
    wrapper.find('input').simulate('change', { target: { value: 'Hello' } })
    wrapper.find('form').simulate('submit')
    expect(wrapper.find(FormHelperText).text()).toEqual(defaultProps.localization!.markerRequiredError)
  })

  it('should give an error message when draftCommentMarker is set but input is empty', () => {
    const wrapper = mount(<CreateComment {...defaultProps} />)
    wrapper.find(Button).simulate('click')
    wrapper.find('form').simulate('submit')
    expect(wrapper.find(FormHelperText).text()).toEqual(defaultProps.localization!.inputRequiredError)
  })
})
