import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act, Simulate } from 'react-dom/test-utils'
import { BrowserRouter } from 'react-router-dom'
import { RepositoryProvider } from '../src/context/repository-provider'
import { SnAuthRepositoryProvider } from '../src/context/sn-auth-repository-provider'
import { getAuthConfig } from '../src/services/auth-config'
import {
  getRepositoryConnections,
  removeRepositoryConnection,
  renameRepositoryConnection,
  setRepositoryConnectionPinned,
} from '../src/services/repository-connections'
import { setSnAuthRepositoryConfig } from '../src/services/repository-session'

const mockLogger = { error: jest.fn(), warning: jest.fn() }
const mockSnAuth: any = {
  user: { Id: 42 },
  accessToken: 'access-one',
  externalLogin: jest.fn(),
  logout: jest.fn(),
  isLoading: false,
}
const mockOidc: any = {
  oidcUser: { access_token: 'access-one', expired: false },
  login: jest.fn(),
  logout: jest.fn(),
}
jest.mock('@sensenet/sn-auth-react', () => ({
  ...jest.requireActual('@sensenet/sn-auth-react'),
  AuthenticationProvider: ({ children }: any) => children,
  useSnAuth: () => mockSnAuth,
}))
jest.mock('@sensenet/authentication-oidc-react', () => ({
  AuthenticationProvider: ({ children }: any) => children,
  useOidcAuthentication: () => mockOidc,
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
jest.mock('@sensenet/hooks-react', () => ({
  RepositoryContext: jest.requireActual('react').createContext(null),
  useLogger: () => mockLogger,
}))
jest.mock('../src/hooks', () => ({ useQuery: () => new URLSearchParams() }))
jest.mock('../src/globalStyles', () => ({ useGlobalStyles: () => ({ full: 'full' }) }))
jest.mock('../src/components/full-screen-loader', () => ({ FullScreenLoader: () => <div>Loading</div> }))
jest.mock('../src/components/NotificationComponent', () => ({ NotificationComponent: () => null }))
jest.mock('../src/components/login/not-authenticated-override', () => ({ NotAuthenticatedOverride: () => null }))
jest.mock('../src/components/login/session-lost-override', () => ({ SessionLostOverride: () => null }))
jest.mock('../src/components/login/auth-override-skeleton', () => ({ AuthOverrideSkeleton: () => null }))
jest.mock('../src/services/auth-config', () => ({ getAuthConfig: jest.fn() }))
jest.mock(
  '../src/components/login/login-page',
  () =>
    function LoginPage({ initialRepositoryUrl, connectionFailed, handleSubmit }: any) {
      return (
        <div>
          Repository picker
          <input readOnly value={initialRepositoryUrl || ''} />
          {connectionFailed && <span role="alert">Connection failed</span>}
          <button onClick={() => handleSubmit(initialRepositoryUrl)}>Retry</button>
        </div>
      )
    },
)

type Mode = 'SNAuth' | 'IdentityServer'
const repository = 'https://repo.example.invalid'
const configuration = (mode: Mode) => ({
  authServerSettings: { type: mode },
  userManagerSettings: {
    authority: 'https://auth.example.invalid',
    extraQueryParams: { snrepo: repository },
  },
})

describe.each<Mode>(['SNAuth', 'IdentityServer'])('%s remembered repository integration', (mode) => {
  let element: HTMLDivElement
  const prepareAuthentication = jest.fn()
  const changeAuthType = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-11-06T16:00:00Z'))
    localStorage.clear()
    sessionStorage.clear()
    window.history.replaceState(null, '', '/')
    mockSnAuth.user = { Id: 42 }
    mockSnAuth.accessToken = 'access-one'
    mockOidc.oidcUser = { access_token: 'access-one', expired: false }
    prepareAuthentication.mockResolvedValue(true)
    ;(getAuthConfig as jest.Mock).mockResolvedValue(configuration(mode))
    element = document.createElement('div')
    document.body.appendChild(element)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(element)
    })
    element.remove()
    jest.useRealTimers()
    localStorage.clear()
    sessionStorage.clear()
  })

  const mount = () =>
    act(async () => {
      const Provider = mode === 'SNAuth' ? SnAuthRepositoryProvider : RepositoryProvider
      render(
        <BrowserRouter>
          <Provider url={repository} prepareAuthentication={prepareAuthentication} changeAuthType={changeAuthType}>
            <div>Authenticated content</div>
          </Provider>
        </BrowserRouter>,
        element,
      )
    })

  it('remembers a successful opening once and preserves metadata through token renewal', async () => {
    await mount()
    expect(element.textContent).toContain('Authenticated content')
    expect(getRepositoryConnections()).toEqual([
      expect.objectContaining({ repoUrl: repository, lastUsed: '2026-11-06T16:00:00.000Z' }),
    ])
    renameRepositoryConnection(repository, 'Daily repository')
    setRepositoryConnectionPinned(repository, true)
    jest.setSystemTime(new Date('2026-11-07T16:00:00Z'))
    mockSnAuth.accessToken = 'renewed-access'
    mockOidc.oidcUser = { access_token: 'renewed-access', expired: false }
    await mount()
    expect(getRepositoryConnections()).toEqual([
      expect.objectContaining({
        repoUrl: repository,
        name: 'Daily repository',
        pinned: true,
        lastUsed: '2026-11-06T16:00:00.000Z',
      }),
    ])
  })

  it('does not resurrect a removed connection when its existing token is renewed', async () => {
    await mount()
    removeRepositoryConnection(repository)
    jest.setSystemTime(new Date('2026-11-07T16:00:00Z'))
    mockSnAuth.accessToken = 'renewed-access'
    mockOidc.oidcUser = { access_token: 'renewed-access', expired: false }
    await mount()
    expect(getRepositoryConnections()).toEqual([])
    expect(element.textContent).toContain('Authenticated content')
  })

  it('keeps the failed URL in the chooser and remembers it only after a successful retry', async () => {
    ;(getAuthConfig as jest.Mock).mockRejectedValueOnce(new Error('Repository is unavailable'))
    await mount()
    expect(element.textContent).toContain('Repository picker')
    expect(element.querySelector('input')?.value).toBe(repository)
    expect(element.querySelector('[role="alert"]')?.textContent).toBe('Connection failed')
    expect(getRepositoryConnections()).toEqual([])
    await act(async () => Simulate.click(element.querySelector('button')!))
    expect(element.textContent).toContain('Authenticated content')
    expect(getRepositoryConnections()).toEqual([expect.objectContaining({ repoUrl: repository })])
  })

  it('returns to an editable chooser when discovery of a cached selection fails', async () => {
    if (mode === 'SNAuth') setSnAuthRepositoryConfig(repository, configuration(mode))
    else localStorage.setItem('sn-oidc-config', JSON.stringify(configuration(mode)))
    prepareAuthentication.mockRejectedValueOnce(new Error('Discovery is unavailable'))
    await mount()
    expect(element.textContent).toContain('Repository picker')
    expect(element.textContent).not.toContain('Loading')
    expect(element.querySelector('input')?.value).toBe(repository)
    expect(element.querySelector('[role="alert"]')).not.toBeNull()
    expect(getRepositoryConnections()).toEqual([])
  })
})
