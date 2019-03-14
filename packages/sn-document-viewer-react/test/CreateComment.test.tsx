import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
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
    },
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

  it('should add comment when a form is submitted', () => {
    const createComment = jest.fn()
    const wrapper = mount(<CreateComment {...defaultProps} createComment={createComment} />)
    wrapper.find(Button).simulate('click')
    wrapper.find(FormControl).simulate('submit')
    expect(createComment).toBeCalled()
    expect(wrapper.find(Button).length).toBe(1)
  })
})
