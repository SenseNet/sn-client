import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { AuthenticationProvider, useOidcAuthentication } from '../src'
import { authenticationService } from '../src/authentication-service'

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
})
