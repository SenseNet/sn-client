import { mount } from 'enzyme'
import React from 'react'
import { ObservableValue, sleepAsync } from '@sensenet/client-utils'
import { LoginState, Repository } from '@sensenet/client-core'
import { act } from 'react-dom/test-utils'
import Typography from '@material-ui/core/Typography'
import { lastRepositoryKey, RepositoryProvider } from '../src/context/repository-provider'
import { FullScreenLoader } from '../src/components/full-screen-loader'
import { LoginForm } from '../src/components/login-form'

jest.mock('@sensenet/client-core')

describe('Repository Provider', () => {
  it('should show loader while login is in progress', () => {
    ;(Repository as any).mockImplementation(() => {
      return {
        authentication: {
          state: new ObservableValue<LoginState>(LoginState.Pending),
        },
      }
    })
    const wrapper = mount(
      <RepositoryProvider>
        <p>test</p>
      </RepositoryProvider>,
    )
    expect(wrapper.find(FullScreenLoader).exists()).toBe(true)
    expect(wrapper.find('p').exists()).toBe(false)
  })
  it('should show the children when authenticated', () => {
    ;(Repository as any).mockImplementation(() => {
      return {
        authentication: {
          state: new ObservableValue<LoginState>(LoginState.Authenticated),
        },
      }
    })
    const wrapper = mount(
      <RepositoryProvider>
        <p>test</p>
      </RepositoryProvider>,
    )
    expect(wrapper.find('p').exists()).toBe(true)
  })
  describe('when not authenticated', () => {
    it('should show a login form', () => {
      ;(Repository as any).mockImplementation(() => {
        return {
          authentication: {
            state: new ObservableValue<LoginState>(LoginState.Unauthenticated),
          },
        }
      })
      const wrapper = mount(
        <RepositoryProvider>
          <p>test</p>
        </RepositoryProvider>,
      )
      expect(wrapper.find(LoginForm).exists()).toBe(true)
    })
  })
  describe('onLogin', () => {
    it('should set localstorage with repourl', async () => {
      const login = jest.fn(() => true)
      ;(Repository as any).mockImplementation(() => {
        return {
          authentication: {
            state: new ObservableValue<LoginState>(LoginState.Unauthenticated),
            login,
          },
        }
      })
      const wrapper = mount(
        <RepositoryProvider>
          <p>test</p>
        </RepositoryProvider>,
      )
      const repoUrl = 'repoUrl'
      await act(async () => {
        wrapper.find(LoginForm).prop('onLogin')('testLogin', 'testPassword', repoUrl)
      })

      expect(localStorage.getItem(lastRepositoryKey)).toBe(repoUrl)
      expect(login).toBeCalledWith('testLogin', 'testPassword')
    })

    it('should set error when login fails', async () => {
      const login = jest.fn()
      ;(Repository as any).mockImplementation(() => {
        return {
          authentication: {
            state: new ObservableValue<LoginState>(LoginState.Unauthenticated),
            login,
          },
        }
      })
      const wrapper = mount(
        <RepositoryProvider>
          <p>test</p>
        </RepositoryProvider>,
      )

      await act(async () => {
        wrapper.find(LoginForm).prop('onLogin')('testLogin', 'testPassword', 'repo')
      })
      expect(
        wrapper
          .update()
          .find(Typography)
          .at(1)
          .text(),
      ).toBe('Failed to log in.')
    })

    it('should set error when login function throws', async () => {
      const login = jest.fn(() => {
        throw new Error('error')
      })
      ;(Repository as any).mockImplementation(() => {
        return {
          authentication: {
            state: new ObservableValue<LoginState>(LoginState.Unauthenticated),
            login,
          },
        }
      })
      const wrapper = mount(
        <RepositoryProvider>
          <p>test</p>
        </RepositoryProvider>,
      )

      await act(async () => {
        wrapper.find(LoginForm).prop('onLogin')('testLogin', 'testPassword', 'repo')
      })
      expect(
        wrapper
          .update()
          .find(Typography)
          .at(1)
          .text(),
      ).toBe('error')
    })
  })
})
