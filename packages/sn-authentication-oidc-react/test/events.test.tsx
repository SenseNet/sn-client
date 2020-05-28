import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { AuthenticationProvider, CustomEvents, useOidcAuthentication } from '../src'
import { authenticationService } from '../src/authentication-service'
import {
  addOidcEvents,
  oidcReducer,
  onAccessTokenExpired,
  onUserLoaded,
  onUserUnloaded,
  removeOidcEvents,
} from '../src/oidc-events'

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
      onUserLoaded(dispatch, userMock as any)
      expect(dispatch).toHaveBeenCalledWith({
        type: 'ON_LOAD_USER',
        user: userMock,
      })
    })

    it('should set state and redirect to location when call onUserUnload', () => {
      onUserUnloaded(dispatch)
      expect(dispatch).toHaveBeenCalledWith({ type: 'ON_UNLOAD_USER' })
    })

    it('should set state and call silentSignin to location when call onAccessTokenExpired', () => {
      onAccessTokenExpired(dispatch, userManagerMock as any)
      expect(dispatch).toHaveBeenCalledWith({ type: 'ON_UNLOAD_USER' })
      expect(userManagerMock.signinSilent).toHaveBeenCalled()
    })

    it('should subscribe to remove all events when call removeOidcEvents', () => {
      const eventsMock = {
        removeUserLoaded: (cb: (user: any) => void) => {
          cb({ name: 'Jon' })
        },
        removeSilentRenewError: (cb: (error: any) => void) => {
          cb({ message: 'error' })
        },
        removeUserUnloaded: (cb: () => void) => cb(),
        removeUserSignedOut: (cb: () => void) => cb(),
        removeAccessTokenExpired: (cb: () => void) => cb(),
        removeAccessTokenExpiring: (cb: () => void) => cb(),
        removeUserSessionChanged: (cb: () => void) => cb(),
      }
      const customEvents: CustomEvents = {
        onUserLoaded: jest.fn(),
        onAccessTokenExpired: jest.fn(),
        onAccessTokenExpiring: jest.fn(),
        onSilentRenewError: jest.fn(),
        onUserSessionChanged: jest.fn(),
        onUserSignedOut: jest.fn(),
        onUserUnloaded: jest.fn(),
      }
      removeOidcEvents({
        userManager: { events: eventsMock, signinSilent: jest.fn() } as any,
        dispatch: jest.fn(),
        customEvents,
      })
      expect(customEvents.onUserLoaded).toHaveBeenCalledWith({ name: 'Jon' })
      expect(customEvents.onAccessTokenExpired).toHaveBeenCalledTimes(1)
      expect(customEvents.onAccessTokenExpiring).toHaveBeenCalledTimes(1)
      expect(customEvents.onSilentRenewError).toHaveBeenCalledWith({ message: 'error' })
      expect(customEvents.onUserSessionChanged).toHaveBeenCalledTimes(1)
      expect(customEvents.onUserSignedOut).toHaveBeenCalledTimes(1)
      expect(customEvents.onUserUnloaded).toHaveBeenCalledTimes(1)
    })

    it('should subscribe to add all events when call addOidcEvents', () => {
      const eventsMock = {
        addUserLoaded: (cb: (user: any) => void) => {
          cb({ name: 'Jon' })
        },
        addSilentRenewError: (cb: (error: any) => void) => {
          cb({ message: 'error' })
        },
        addUserUnloaded: (cb: () => void) => cb(),
        addUserSignedOut: (cb: () => void) => cb(),
        addAccessTokenExpired: (cb: () => void) => cb(),
        addAccessTokenExpiring: (cb: () => void) => cb(),
        addUserSessionChanged: (cb: () => void) => cb(),
      }
      const customEvents: CustomEvents = {
        onUserLoaded: jest.fn(),
        onAccessTokenExpired: jest.fn(),
        onAccessTokenExpiring: jest.fn(),
        onSilentRenewError: jest.fn(),
        onUserSessionChanged: jest.fn(),
        onUserSignedOut: jest.fn(),
        onUserUnloaded: jest.fn(),
      }
      addOidcEvents({
        userManager: { events: eventsMock, signinSilent: jest.fn() } as any,
        dispatch: jest.fn(),
        customEvents,
      })
      expect(customEvents.onUserLoaded).toHaveBeenCalledWith({ name: 'Jon' })
      expect(customEvents.onAccessTokenExpired).toHaveBeenCalledTimes(1)
      expect(customEvents.onAccessTokenExpiring).toHaveBeenCalledTimes(1)
      expect(customEvents.onSilentRenewError).toHaveBeenCalledWith({ message: 'error' })
      expect(customEvents.onUserSessionChanged).toHaveBeenCalledTimes(1)
      expect(customEvents.onUserSignedOut).toHaveBeenCalledTimes(1)
      expect(customEvents.onUserUnloaded).toHaveBeenCalledTimes(1)
    })
  })
})
