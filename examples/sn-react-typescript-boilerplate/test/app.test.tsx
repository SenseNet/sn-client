import { mount } from 'enzyme'
import React from 'react'
import { Button } from '@material-ui/core'
import { RepositoryContext } from '@sensenet/hooks-react'
import { ObservableValue } from '@sensenet/client-utils'
import { act } from 'react-dom/test-utils'
import { App } from '../src/app'

describe('The App component', () => {
  it('should trigger logout on logout button click', () => {
    const repo = {
      authentication: {
        logout: jest.fn(),
        currentUser: new ObservableValue({ Name: '' }),
      },
    }

    const wrapper = mount(
      <RepositoryContext.Provider value={repo as any}>
        <App />
      </RepositoryContext.Provider>,
    )

    wrapper.find(Button).simulate('click')

    expect(repo.authentication.logout).toBeCalled()
  })

  it('should show the userName when it is changed', () => {
    const currentUser = new ObservableValue({ Name: '' })
    const repo = {
      authentication: {
        logout: jest.fn(),
        currentUser,
      },
    }

    const wrapper = mount(
      <RepositoryContext.Provider value={repo as any}>
        <App />
      </RepositoryContext.Provider>,
    )

    act(() => {
      currentUser.setValue({ Name: 'John Doe' })
    })
    expect(wrapper.find('h3').text()).toBe('Hello, John Doe 😎')
    wrapper.unmount()
  })
})
