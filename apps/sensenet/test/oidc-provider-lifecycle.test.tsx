import { User, UserManager } from 'oidc-client'
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { AuthenticationProvider, useOidcAuthentication } from '../../../packages/sn-authentication-oidc-react/src'

let mockManager: UserManager
jest.mock('../../../packages/sn-authentication-oidc-react/src/authentication-service', () => ({
  authenticationService: () => mockManager,
  getUserManager: () => mockManager,
}))

const settings = {
  authority: 'https://identity.example.invalid',
  client_id: 'provider-lifecycle-test',
  redirect_uri: 'http://localhost/callback',
  automaticSilentRenew: false,
  monitorSession: false,
}
const Probe = () => {
  const auth = useOidcAuthentication()
  return <div>{auth.isLoading ? 'Loading' : auth.oidcUser ? 'Signed in' : auth.error || 'Signed out'}</div>
}

describe('OIDC provider initialization lifecycle', () => {
  let element: HTMLDivElement

  beforeEach(() => {
    window.history.replaceState(null, '', '/')
    mockManager = new UserManager(settings)
    element = document.createElement('div')
    document.body.appendChild(element)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(element)
    })
    mockManager.events.unload()
    mockManager.stopSilentRenew()
    element.remove()
    sessionStorage.clear()
  })

  const mount = () =>
    act(async () => {
      render(
        <AuthenticationProvider configuration={settings} history={{ location: window.location } as any}>
          <Probe />
        </AuthenticationProvider>,
        element,
      )
    })

  it('finishes initialization when no stored user exists', async () => {
    await mount()
    expect(element.textContent).toBe('Signed out')
  })

  it('shows a failed user-store read instead of loading forever', async () => {
    jest.spyOn(mockManager, 'getUser').mockRejectedValueOnce(new Error('User store unavailable'))
    await mount()
    expect(element.textContent).toBe('User store unavailable')
  })

  it('cannot restore an initial user result after the session has been unloaded', async () => {
    let resolveUser!: (user: User) => void
    jest.spyOn(mockManager, 'getUser').mockReturnValueOnce(
      new Promise<User>((resolve) => {
        resolveUser = resolve
      }),
    )
    await mount()
    expect(element.textContent).toBe('Loading')

    await act(async () => {
      mockManager.events.unload()
    })
    expect(element.textContent).toBe('Signed out')
    await act(async () => {
      resolveUser({ profile: { sub: 'old-user' } } as User)
    })
    expect(element.textContent).toBe('Signed out')
  })
})
