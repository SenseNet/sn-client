import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { mount } from 'enzyme'
import React from 'react'
import { RepositoryContext } from '@sensenet/hooks-react'
import { Repository } from '@sensenet/client-core'
import { Comment, CommentProps } from '../src/components/comment'
import { CommentStateProvider } from '../src/context/comment-states'
import { examplePreviewComment } from './__Mocks__/viewercontext'

const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`

const defaultProps: CommentProps = {
  ...examplePreviewComment,
  comment: examplePreviewComment,
}

describe('Comment component', () => {
  it('should show text', () => {
    const wrapper = mount(<Comment {...defaultProps} />)
    expect(wrapper.find(CardContent).exists()).toBeTruthy()
    expect(wrapper.find(CardContent).text()).toBe(defaultProps.comment.text)
  })

  it('should show show more button when text is long', () => {
    const wrapper = mount(<Comment {...defaultProps} comment={{ ...examplePreviewComment, text: longText }} />)
    const button = wrapper.find(Button)
    expect(button.exists()).toBeTruthy()
    expect(button.length).toBe(1) // Should not show delete button
    expect(button.text()).toBe('+ Show more')
  })

  it('should show show less button when too long text is opened', () => {
    const wrapper = mount(<Comment {...defaultProps} comment={{ ...examplePreviewComment, text: longText }} />)
    const button = wrapper.find(Button).first()
    button.simulate('click')
    expect(wrapper.find(Button).length).toBe(2) // Should show delete button as well
    expect(button.text()).toBe('+ Show less')
  })
  it('should show delete button when text is short', () => {
    const wrapper = mount(<Comment {...defaultProps} />)
    expect(wrapper.find(Button).text()).toBe('Delete')
  })

  it('should be in selected state when clicked', () => {
    const wrapper = mount(
      <CommentStateProvider>
        <Comment {...defaultProps} />
      </CommentStateProvider>,
    )
    wrapper.find(Card).simulate('click')
    expect(wrapper.find(Card).prop('raised')).toBe(true)
  })

  it('should display an avatar without src when host is the same', () => {
    const wrapper = mount(
      <RepositoryContext.Provider value={new Repository({ repositoryUrl: 'https://cdn.images.express.co.uk' })}>
        <Comment
          {...defaultProps}
          comment={{
            ...defaultProps.comment,
            createdBy: { ...defaultProps.comment.createdBy, avatarUrl: 'https://cdn.images.express.co.uk' },
          }}
        />
      </RepositoryContext.Provider>,
    )
    expect(wrapper.find(Avatar).prop('src')).toBeUndefined()
  })
})
