import Button from '@material-ui/core/Button'
import CardContent from '@material-ui/core/CardContent'
import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import ConnectedComment, { Comment } from '../src/components/Comment'
import { rootReducer } from '../src/store'

const veryLongText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`

describe('Comment component', () => {
  it('should show text', () => {
    const wrapper = mount(<Comment commentBody="some text" />)
    expect(wrapper.find(CardContent).exists()).toBeTruthy()
    expect(wrapper.find(CardContent).text()).toBe('some text')
  })

  it('should show show more button when text is long', () => {
    const wrapper = mount(<Comment commentBody={veryLongText} />)
    expect(wrapper.find(Button).exists()).toBeTruthy()
    expect(wrapper.find(Button).text()).toBe('Show more')
  })

  it('should show show less button when too long text is opened', () => {
    const wrapper = mount(<Comment commentBody={veryLongText} />)
    const btn = wrapper.find(Button)
    btn.simulate('click')
    expect(wrapper.find(Button).text()).toBe('Show less')
  })

  it('should show show more button with localized text when connected', () => {
    const wrapper = mount(
      <Provider store={createStore(rootReducer)}>
        <ConnectedComment commentBody={veryLongText} />
      </Provider>,
    )
    expect(wrapper.find(Button).text()).toBe('+ Show more')
  })

  it('should show show less button with localized text when connected', () => {
    const wrapper = mount(
      <Provider store={createStore(rootReducer)}>
        <ConnectedComment commentBody={veryLongText} />
      </Provider>,
    )
    const btn = wrapper.find(Button)
    btn.simulate('click')
    expect(wrapper.find(Button).text()).toBe('+ Show less')
  })
})
