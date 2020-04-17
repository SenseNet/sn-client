import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { AuthenticationProvider, useOidcAuthentication } from '../src'
import { authenticationService } from '../src/authentication-service'
import { oidcReducer, onAccessTokenExpired, onUserLoaded, onUserUnloaded, removeOidcEvents } from '../src/oidc-events'

const LoginTest = () => {
  const { login } = useOidcAuthentication()
  return <button onClick={login}>login</button>
}

const LogoutTest = () => {
  const { logout, error } = useOidcAuthentication()
  if (error) {
    return <p>{error}</p>
  }
  return <button onClick={logout}>logout</button>
}

const events = {
  addUserLoaded: jest.fn(),
  addSilentRenewError: jest.fn(),
  addUserUnloaded: jest.fn(),
  addUserSignedOut: jest.fn(),
  addAccessTokenExpired: jest.fn(),
}

jest.mock('../src/authentication-service', () => {
  return {
    authenticationService: jest.fn(),
  }
})

describe('useOidcAuthentication', () => {
  it('should throw error when used outside of AuthenticationProvider', () => {
    try {
      shallow(<LoginTest />)
    } catch (error) {
      expect(error.message).toBe('useOidcAuthentication must be used within a AuthenticationProvider')
    }
  })
})

describe('Authentication provider', () => {
  it('should call authenticateUser on login', async () => {
    const signinRedirect = jest.fn()
    ;(authenticationService as any).mockImplementationOnce(() => {
      return {
        signinRedirect,
        getUser: () => Promise.resolve(null),
        events,
      }
    })
    let wrapper: any

    await act(async () => {
      wrapper = mount(
        <AuthenticationProvider configuration={{}} history={{ location: window.location } as any}>
          <LoginTest />
        </AuthenticationProvider>,
      )
    })

    await act(async () => {
      wrapper.find('button').simulate('click')
    })

    expect(signinRedirect).toBeCalledTimes(1)
  })

  it('should call signoutRedirect on logout', async () => {
    const signoutRedirect = jest.fn()
    ;(authenticationService as any).mockImplementationOnce(() => {
      return {
        signoutRedirect,
        getUser: () => Promise.resolve({}),
        events,
      }
    })
    let wrapper: any

    await act(async () => {
      wrapper = mount(
        <AuthenticationProvider configuration={{}} history={{ location: window.location } as any}>
          <LogoutTest />
        </AuthenticationProvider>,
      )
    })

    await act(async () => {
      wrapper.find('button').simulate('click')
    })

    expect(signoutRedirect).toBeCalledTimes(1)
  })

  it('should show error message when logout fails', async () => {
    const signoutRedirect = jest.fn(() => {
      throw new Error('error')
    })
    ;(authenticationService as any).mockImplementationOnce(() => {
      return {
        signoutRedirect,
        getUser: () => Promise.resolve({}),
        events,
      }
    })
    let wrapper: any

    await act(async () => {
      wrapper = mount(
        <AuthenticationProvider configuration={{}} history={{ location: window.location } as any}>
          <LogoutTest />
        </AuthenticationProvider>,
      )
    })

    await act(async () => {
      wrapper.find('button').simulate('click')
    })

    expect(wrapper.update().find('button')).toHaveLength(0)
    expect(wrapper.find('p').text()).toBe('error')
  })

  describe('oidc events', () => {
    const dispatch = jest.fn()
    const userManagerMock = {
      signinSilent: jest.fn(),
    }
    const state: any = {
      isLoading: false,
      userManager: {},
    }

    it('should Reducer return correct state with ON_UNLOAD_USER', () => {
      const action = {
        type: 'ON_UNLOAD_USER',
      } as const
      const result = oidcReducer(state, action)
      expect(result).toEqual({
        isLoading: false,
        userManager: {},
        oidcUser: undefined,
      })
    })

    it('should Reducer return correct state with OTHER_THING', () => {
      const action = {
        type: 'OTHER_THING',
      }
      const result = oidcReducer(state, action as any)
      expect(result).toEqual(state)
    })

    it('should set state with user when call onUserLoaded', async () => {
      const userMock = { name: 'Joe' }
      onUserLoaded(dispatch)(userMock as any)
      expect(dispatch).toHaveBeenCalledWith({
        type: 'ON_LOAD_USER',
        user: userMock,
      })
    })

    it('should set state and redirect to location when call onUserUnload', () => {
      onUserUnloaded(dispatch)()
      expect(dispatch).toHaveBeenCalledWith({ type: 'ON_UNLOAD_USER' })
    })

    it('should set state and call silentSignin to location when call onAccessTokenExpired', () => {
      onAccessTokenExpired(dispatch, userManagerMock as any)()
      expect(dispatch).toHaveBeenCalledWith({ type: 'ON_UNLOAD_USER' })
      expect(userManagerMock.signinSilent).toHaveBeenCalled()
    })

    it('should remove all events when call removeOidcEvents', () => {
      const eventsMock = {
        removeUserLoaded: jest.fn(),
        removeSilentRenewError: jest.fn(),
        removeUserUnloaded: jest.fn(),
        removeUserSignedOut: jest.fn(),
        removeAccessTokenExpired: jest.fn(),
      }
      removeOidcEvents(eventsMock as any, jest.fn(), {} as any)
      expect(eventsMock.removeUserLoaded).toHaveBeenCalledWith(expect.any(Function))
      expect(eventsMock.removeSilentRenewError).toHaveBeenCalledWith(expect.any(Function))
      expect(eventsMock.removeUserUnloaded).toHaveBeenCalledWith(expect.any(Function))
      expect(eventsMock.removeUserSignedOut).toHaveBeenCalledWith(expect.any(Function))
      expect(eventsMock.removeAccessTokenExpired).toHaveBeenCalledWith(expect.any(Function))
    })
  })
})
