import Button from '@material-ui/core/Button'
import CardContent from '@material-ui/core/CardContent'
import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import ConnectedComment, { Comment, CreatedByUser } from '../src/components/Comment'
import { rootReducer } from '../src/store'

const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`

const localization = {
  showMore: undefined,
  showLess: undefined,
}

const createdBy: CreatedByUser = {
  avatarUrl: 'uri',
  displayName: 'Lightos Lóci',
  id: 1,
  path: 'some/path',
  userName: 'some/name',
}

describe('Comment component', () => {
  it('should show text', () => {
    const wrapper = mount(<Comment createdBy={createdBy} id="a" localization={localization as any} text="some text" />)
    expect(wrapper.find(CardContent).exists()).toBeTruthy()
    expect(wrapper.find(CardContent).text()).toBe('some text')
  })

  it('should show show more button when text is long', () => {
    const wrapper = mount(<Comment createdBy={createdBy} id="a" localization={localization as any} text={longText} />)
    expect(wrapper.find(Button).exists()).toBeTruthy()
    expect(wrapper.find(Button).text()).toBe('Show more')
  })

  it('should show show less button when too long text is opened', () => {
    const wrapper = mount(<Comment createdBy={createdBy} id="a" localization={localization as any} text={longText} />)
    const btn = wrapper.find(Button)
    btn.simulate('click')
    expect(wrapper.find(Button).text()).toBe('Show less')
  })

  it('should show show more button with localized text when connected', () => {
    const wrapper = mount(
      <Provider store={createStore(rootReducer)}>
        <ConnectedComment createdBy={createdBy} id="a" text={longText} />
      </Provider>,
    )
    expect(wrapper.find(Button).text()).toBe('+ Show more')
  })

  it('should show show less button with localized text when connected', () => {
    const wrapper = mount(
      <Provider store={createStore(rootReducer)}>
        <ConnectedComment createdBy={createdBy} id="a" text={longText} />
      </Provider>,
    )
    const btn = wrapper.find(Button)
    btn.simulate('click')
    expect(wrapper.find(Button).text()).toBe('+ Show less')
  })
})
