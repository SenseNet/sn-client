/* eslint-disable @typescript-eslint/camelcase */
import React from 'react'
import { Button } from '@material-ui/core'
import { mount } from 'enzyme'
import { UserManager } from 'oidc-client'
import { act } from 'react-dom/test-utils'
import { getUserManager } from '../src/authentication-service'
import { AuthenticationProvider } from '../src/components/authentication-provider'
import { Callback } from '../src/components/callback'
import { NotAuthenticated } from '../src/components/not-authenticated'
import { NotAuthorized } from '../src/components/not-authorized'
import { SessionLost } from '../src/components/session-lost'
import { SilentCallback } from '../src/components/silent-callback'

jest.mock('../src/authentication-service', () => {
  return {
    authenticationService: () => new UserManager({}),
    getUserManager: jest.fn(),
  }
})

describe('AuthenticationProvider component', () => {
  it('should show its children if the path is not one of the reserved', () => {
    const wrapper = mount(
      <AuthenticationProvider configuration={{}} history={{} as any}>
        <p id="a">a</p>
      </AuthenticationProvider>,
    )

    expect(wrapper.find('#a')).toHaveLength(1)
  })

  it('should show callback component when path equals to redirect_uri', async () => {
    const signinRedirectCallback = jest.fn(() => ({ state: { url: 'url' } }))
    ;(getUserManager as any).mockImplementationOnce(() => {
      return { signinRedirectCallback }
    })
    delete window.location
    window.location = new URL('https://localhost:3000/auth/callback') as any
    const history: any = { push: jest.fn() }

    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <AuthenticationProvider
          history={history}
          configuration={{ redirect_uri: 'https://localhost:3000/auth/callback' }}>
          <p id="a">a</p>
        </AuthenticationProvider>,
      )
    })

    expect(wrapper.find('#a')).toHaveLength(0)
    expect(wrapper.find(Callback)).toHaveLength(1)
    expect(signinRedirectCallback).toBeCalled()
    expect(history.push).toBeCalledWith('url')
  })

  it('should show overrided callback component when path equals to redirect_uri', () => {
    delete window.location
    window.location = new URL('https://localhost:3000/auth/callback') as any
    const history: any = { push: jest.fn() }

    const wrapper = mount(
      <AuthenticationProvider
        history={history}
        callbackComponentOverride={<p id="b">b</p>}
        configuration={{ redirect_uri: 'https://localhost:3000/auth/callback' }}>
        <p id="a">a</p>
      </AuthenticationProvider>,
    )

    expect(wrapper.find('#b')).toHaveLength(1)
  })

  it('should navigate to /authentication/not-authenticated when callback component fails with error', async () => {
    delete window.location
    window.location = new URL('https://localhost:3000/auth/callback') as any
    const history: any = { push: jest.fn() }
    const signinRedirectCallback = jest.fn(() => {
      throw new Error('error')
    })
    ;(getUserManager as any).mockImplementationOnce(() => {
      return { signinRedirectCallback }
    })

    await act(async () => {
      mount(
        <AuthenticationProvider
          history={history}
          configuration={{ redirect_uri: 'https://localhost:3000/auth/callback' }}>
          <p id="a">a</p>
        </AuthenticationProvider>,
      )
    })

    expect(history.push).toBeCalledWith('/authentication/not-authenticated?message=error')
  })

  it('should show SilentCallback component when path equals to silent_redirect_uri', () => {
    delete window.location
    window.location = new URL('https://localhost:3000/auth/silentcallback') as any

    const wrapper = mount(
      <AuthenticationProvider
        history={{} as any}
        configuration={{ silent_redirect_uri: 'https://localhost:3000/auth/silentcallback' }}>
        <p id="a">a</p>
      </AuthenticationProvider>,
    )

    expect(wrapper.find('#a')).toHaveLength(0)
    expect(wrapper.find(SilentCallback)).toHaveLength(1)
  })

  it('should show NotAuthorized component when path is /authentication/not-authorized', () => {
    delete window.location
    window.location = new URL('https://localhost:3000/authentication/not-authorized') as any

    const wrapper = mount(
      <AuthenticationProvider configuration={{}} history={{} as any}>
        <p id="a">a</p>
      </AuthenticationProvider>,
    )

    expect(wrapper.find(NotAuthorized)).toHaveLength(1)
  })

  it('should show NotAuthorized component when path is /authentication/not-authorized', () => {
    delete window.location
    window.location = new URL('https://localhost:3000/authentication/not-authorized') as any

    const wrapper = mount(
      <AuthenticationProvider configuration={{}} history={{} as any}>
        <p id="a">a</p>
      </AuthenticationProvider>,
    )

    expect(wrapper.find(NotAuthorized)).toHaveLength(1)
  })

  it('should show NotAuthenticated component when path is /authentication/not-authenticated', () => {
    delete window.location
    window.location = new URL('https://localhost:3000/authentication/not-authenticated') as any

    const wrapper = mount(
      <AuthenticationProvider configuration={{}} history={{} as any}>
        <p id="a">a</p>
      </AuthenticationProvider>,
    )

    expect(wrapper.find(NotAuthenticated)).toHaveLength(1)
  })

  it('should show SessionLost component when path is /authentication/session-lost', () => {
    delete window.location
    window.location = new URL('https://localhost:3000/authentication/session-lost') as any

    const wrapper = mount(
      <AuthenticationProvider configuration={{}} history={{ location: window.location } as any}>
        <p id="a">a</p>
      </AuthenticationProvider>,
    )

    expect(wrapper.find(SessionLost)).toHaveLength(1)
  })

  it('should call authenticateUser when SessionLost re-authenticate button is clicked', async () => {
    delete window.location
    window.location = new URL('https://localhost:3000/authentication/session-lost') as any
    const signinRedirect = jest.fn()
    ;(getUserManager as any).mockImplementationOnce(() => {
      return { signinRedirect, getUser: () => null }
    })
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <AuthenticationProvider configuration={{}} history={{ location: window.location } as any}>
          <p id="a">a</p>
        </AuthenticationProvider>,
      )
    })

    await act(async () => {
      wrapper.find(SessionLost).find(Button).simulate('click')
    })

    expect(signinRedirect).toBeCalled()
  })

  it('should show overrided SessionLost component when path is /authentication/session-lost and sessionLost props passed', () => {
    delete window.location
    window.location = new URL('https://localhost:3000/authentication/session-lost') as any

    const wrapper = mount(
      <AuthenticationProvider
        configuration={{}}
        sessionLost={(s) => (
          <p onClick={s.onAuthenticate} id="b">
            b
          </p>
        )}
        history={{ location: window.location } as any}>
        <p id="a">a</p>
      </AuthenticationProvider>,
    )

    expect(wrapper.find('#b')).toHaveLength(1)
  })
})
