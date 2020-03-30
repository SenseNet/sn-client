import React from 'react'
import { UserManager } from 'oidc-client'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { AuthenticationContext } from '../src/components/authentication-provider'
import { OidcSecure } from '../src/components/oidc-secure'
import { Authenticating } from '../src/components/authenticating'
import { getUserManager } from '../src/authentication-service'

jest.mock('../src/authentication-service', () => {
  return {
    authenticationService: () => new UserManager({}),
    getUserManager: jest.fn(),
  }
})

describe('OidcSecure component', () => {
  it('should show Authenticating component when user is not logged in and call signinRedirect', async () => {
    const signinRedirect = jest.fn()
    ;(getUserManager as any).mockImplementationOnce(() => {
      return { signinRedirect, getUser: () => null }
    })
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <AuthenticationContext.Provider value={{} as any}>
          <OidcSecure history={{ location: new URL('https://localhost:3000') } as any}>
            <p id="a">a</p>
          </OidcSecure>
        </AuthenticationContext.Provider>,
      )
    })

    expect(wrapper.find('#a')).toHaveLength(0)
    expect(wrapper.find(Authenticating)).toHaveLength(1)
    expect(signinRedirect).toBeCalled()
  })

  it('should show overrided Authenticating component when user is not logged in', async () => {
    ;(getUserManager as any).mockImplementationOnce(() => {
      return { signinRedirect: jest.fn(), getUser: () => null }
    })
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <AuthenticationContext.Provider value={{ authenticating: <p id="b">b</p> } as any}>
          <OidcSecure history={{ location: new URL('https://localhost:3000') } as any}>
            <p id="a">a</p>
          </OidcSecure>
        </AuthenticationContext.Provider>,
      )
    })

    expect(wrapper.find('#b')).toHaveLength(1)
  })

  it('should show its children when user is logged in and not call signinRedirect', async () => {
    const signinRedirect = jest.fn()
    ;(getUserManager as any).mockImplementationOnce(() => {
      return { signinRedirect, getUser: () => ({ expired: false }) }
    })
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <AuthenticationContext.Provider value={{ oidcUser: { expired: false } } as any}>
          <OidcSecure history={{ location: new URL('https://localhost:3000') } as any}>
            <p id="a">a</p>
          </OidcSecure>
        </AuthenticationContext.Provider>,
      )
    })

    expect(wrapper.find('#a')).toHaveLength(1)
    expect(wrapper.find(Authenticating)).toHaveLength(0)
    expect(signinRedirect).not.toBeCalled()
  })
})
