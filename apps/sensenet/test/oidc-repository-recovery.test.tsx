import { User, UserManager } from 'oidc-client'
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act, Simulate } from 'react-dom/test-utils'
import { BrowserRouter } from 'react-router-dom'
import { useOidcAuthentication } from '../../../packages/sn-authentication-oidc-react/src'
import { RepositoryProvider } from '../src/context/repository-provider'
import { clearActiveRepositorySelection, oidcAuthConfigKey } from '../src/services/repository-session'

let mockManager: UserManager
const mockLogger = { error: jest.fn(), warning: jest.fn() }
jest.mock('../../../packages/sn-authentication-oidc-react/src/authentication-service', () => ({
  authenticationService: () => mockManager,
  getUserManager: () => mockManager,
  removeUserManager: jest.fn(),
}))
jest.mock('@sensenet/hooks-react', () => ({
  RepositoryContext: jest.requireActual('react').createContext(null),
  useLogger: () => mockLogger,
}))
jest.mock('@sensenet/client-core', () => ({
  Repository: class {
    configuration: any
    constructor(configuration: any) {
      this.configuration = configuration
    }
    reloadSchema() {
      return Promise.resolve()
    }
  },
}))
jest.mock('../src/globalStyles', () => ({ useGlobalStyles: () => ({ full: 'full' }) }))
jest.mock('../src/hooks', () => ({}))
jest.mock('../src/components/full-screen-loader', () => ({
  FullScreenLoader: function FullScreenLoader() {
    return <div>Loading</div>
  },
}))
jest.mock('../src/components/NotificationComponent', () => ({ NotificationComponent: () => null }))
jest.mock('../src/components/login/not-authenticated-override', () => ({ NotAuthenticatedOverride: () => null }))
jest.mock('../src/components/login/session-lost-override', () => ({ SessionLostOverride: () => null }))
jest.mock(
  '../src/components/login/login-page',
  () =>
    function LoginPage() {
      return <div>Repository picker</div>
    },
)
jest.mock('../src/components/login/auth-override-skeleton', () => ({
  AuthOverrideSkeleton: ({ primaryText, secondaryText, buttonText, buttonOnClick }: any) => (
    <>
      <h1>{primaryText}</h1>
      <p>{secondaryText}</p>
      {buttonOnClick && <button onClick={buttonOnClick}>{buttonText}</button>}
    </>
  ),
}))
const repository = 'https://repo.example.invalid'
const settings = {
  authority: 'https://identity.example.invalid',
  client_id: 'repository-recovery-test',
  redirect_uri: 'http://localhost/callback',
  extraQueryParams: { snrepo: repository },
  automaticSilentRenew: false,
  monitorSession: false,
}
jest.mock('../src/services/auth-config', () => ({
  getAuthConfig: () =>
    Promise.resolve({ authServerSettings: { type: 'IdentityServer' }, userManagerSettings: settings }),
}))
const Probe = () => {
  const auth = useOidcAuthentication()
  return (
    <>
      <div>Authenticated content</div>
      <button
        onClick={() => {
          clearActiveRepositorySelection()
          auth.logout()
        }}>
        Logout
      </button>
    </>
  )
}

describe('IdentityServer repository logout recovery', () => {
  const originalLocation = window.location
  const assign = jest.fn()
  let element: HTMLDivElement
  const changeAuthType = jest.fn()
  const prepareAuthentication = jest.fn().mockResolvedValue(true)

  beforeEach(async () => {
    jest.clearAllMocks()
    localStorage.clear()
    sessionStorage.clear()
    window.history.replaceState(null, '', '/')
    delete (window as any).location
    window.location = { ...originalLocation, assign } as Location
    mockManager = new UserManager(settings)
    await mockManager.storeUser(
      new User({
        profile: { sub: '42' },
        access_token: 'synthetic-access',
        id_token: 'synthetic-id-token',
        token_type: 'Bearer',
        scope: 'openid',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
      }),
    )
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
    localStorage.clear()
    sessionStorage.clear()
    window.location = originalLocation
  })

  it('shows a recovery action when end-session discovery fails after the local user is removed', async () => {
    jest
      .spyOn(mockManager.metadataService, 'getEndSessionEndpoint')
      .mockRejectedValueOnce(new Error('Identity provider is unavailable'))
    localStorage.setItem('unrelated-repository-token', 'keep-this-session')
    await act(async () => {
      render(
        <BrowserRouter>
          <RepositoryProvider
            url={repository}
            changeAuthType={changeAuthType}
            prepareAuthentication={prepareAuthentication}>
            <Probe />
          </RepositoryProvider>
        </BrowserRouter>,
        element,
      )
    })
    expect(element.textContent).toContain('Authenticated content')

    await act(async () => {
      Simulate.click(Array.from(element.querySelectorAll('button')).find((button) => button.textContent === 'Logout')!)
    })

    expect(await mockManager.getUser()).toBeNull()
    expect(localStorage.getItem(oidcAuthConfigKey)).toBeNull()
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('Sign-out could not be confirmed')
    expect(element.textContent).not.toContain('Authenticated content')
    expect(changeAuthType).not.toHaveBeenCalled()
    expect(localStorage.getItem('unrelated-repository-token')).toBe('keep-this-session')

    await act(async () => {
      Simulate.click(
        Array.from(element.querySelectorAll('button')).find(
          (button) => button.textContent === 'Choose another repository',
        )!,
      )
    })
    expect(assign).toHaveBeenCalledWith('/')
    expect(localStorage.getItem('unrelated-repository-token')).toBe('keep-this-session')
  })

  it('shows an IdentityServer login error without switching the repository to SNAuth', async () => {
    await mockManager.removeUser()
    const signinRedirect = jest
      .spyOn(mockManager, 'signinRedirect')
      .mockRejectedValue(new Error('Identity provider is unavailable'))
    await act(async () => {
      render(
        <BrowserRouter>
          <RepositoryProvider
            url={repository}
            changeAuthType={changeAuthType}
            prepareAuthentication={prepareAuthentication}>
            <Probe />
          </RepositoryProvider>
        </BrowserRouter>,
        element,
      )
    })

    expect(signinRedirect).toHaveBeenCalledTimes(1)
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('Authentication failed')
    expect(element.textContent).not.toContain('Authenticated content')
    expect(changeAuthType).not.toHaveBeenCalled()
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ message: 'Identity provider is unavailable' }) }),
    )
  })
})
