import Tabs from '@material-ui/core/Tabs'
import { shallow } from 'enzyme'
import React from 'react'
import ReactDOM from 'react-dom'
import { MemoryRouter } from 'react-router-dom'
import LoginTabsWithRouter, { LoginTabs } from '../LoginTabs'

describe('Login tabs component', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(
      <MemoryRouter>
        <LoginTabsWithRouter />
      </MemoryRouter>,
      div,
    )
  })

  const mock: any = jest.fn()

  it('should exsits', () => {
    const wrapper = shallow(<LoginTabs classes="" match={mock} location={mock} history={mock} />)
    expect(wrapper.find(Tabs).exists()).toBe(true)
  })

  it('should handle change', async () => {
    const historyPush = jest.fn()
    const wrapper = shallow(
      <LoginTabs classes="" match={mock} location={mock} history={{ push: historyPush } as any} />,
    )
    wrapper.find(Tabs).simulate('change', { event: '' }, 1)

    expect(historyPush).toBeCalled()
    expect(historyPush).toBeCalledWith('/registration')

    wrapper.find(Tabs).simulate('change', { event: '' }, 0)

    expect(historyPush).toBeCalledTimes(2)
    expect(historyPush).toBeCalledWith('/login')
  })
})
