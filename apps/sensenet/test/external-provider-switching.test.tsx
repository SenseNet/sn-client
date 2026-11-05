import React, { useCallback, useState } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act, Simulate } from 'react-dom/test-utils'
import { BrowserRouter } from 'react-router-dom'
import { prepareExternalLogin } from '../../../packages/sn-auth-react/src/external-login'
import { RepositoryProvider } from '../src/context/repository-provider'
import { SnAuthRepositoryProvider } from '../src/context/sn-auth-repository-provider'
import { getAuthConfig } from '../src/services/auth-config'
import {
  clearActiveRepositorySelection,
  getSelectedSnAuthRepository,
  oidcAuthConfigKey,
  snAuthConfigKey,
  startSnAuthRepositoryLogin,
} from '../src/services/repository-session'

const mockLogger = { error: jest.fn(), warning: jest.fn() }
const mockOidcLogin = jest.fn().mockResolvedValue(undefined)
const mockOidcAuthentication = { login: mockOidcLogin, logout: jest.fn(), oidcUser: undefined }
const mockHandoff = jest.fn()
const mockPrepareAuthentication = jest.fn().mockResolvedValue(true)
jest.mock('@sensenet/authentication-oidc-react', () => ({
  AuthenticationProvider: ({ children }: any) => children,
  useOidcAuthentication: () => mockOidcAuthentication,
}))
jest.mock('../../../packages/sn-auth-react/src/external-login', () => ({
  ...jest.requireActual('../../../packages/sn-auth-react/src/external-login'),
  prepareExternalLogin: jest.fn(),
}))
jest.mock('../src/services/auth-config', () => ({ getAuthConfig: jest.fn() }))
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
jest.mock('../src/hooks', () => ({ useQuery: () => new URLSearchParams(window.location.search) }))
jest.mock('../src/components/full-screen-loader', () => ({ FullScreenLoader: () => <div>Loading</div> }))
jest.mock('../src/components/NotificationComponent', () => ({ NotificationComponent: () => null }))
jest.mock('../src/components/login/not-authenticated-override', () => ({ NotAuthenticatedOverride: () => null }))
jest.mock('../src/components/login/session-lost-override', () => ({ SessionLostOverride: () => null }))
jest.mock(
  '../src/components/login/login-page',
  () =>
    function LoginPage({ handleSubmit }: any) {
      return <button onClick={() => handleSubmit('https://chosen.example.invalid')}>Select repository</button>
    },
)

type Mode = 'IdentityServer' | 'SNAuth'
const chosenRepository = 'https://chosen.example.invalid'
const oldRepository = 'https://old.example.invalid'
const currentRepository = 'https://current.example.invalid'
const settingsFor = (repoUrl: string, mode: Mode) => ({
  authServerSettings: { type: mode },
  userManagerSettings: {
    authority: `https://${mode === 'SNAuth' ? 'snauth' : 'identity'}.example.invalid`,
    client_id: 'provider-handoff-test',
    redirect_uri: 'http://localhost/authentication/login-callback',
    extraQueryParams: { snrepo: repoUrl },
  },
})
const opposite = (mode: Mode): Mode => (mode === 'IdentityServer' ? 'SNAuth' : 'IdentityServer')

// This mirrors the parent provider handoff while retaining the real repository
// wrappers, pending-login storage and SNAuth initialization/no-session behavior.
const Harness = ({ initialMode, initialUrl = '' }: { initialMode: Mode; initialUrl?: string }) => {
  const [mode, setMode] = useState(initialMode)
  const [url, setUrl] = useState(initialUrl)
  const changeAuthType = useCallback((repositoryUrl: string) => {
    mockHandoff(repositoryUrl)
    setUrl(repositoryUrl)
    setMode((previous) => {
      const next = opposite(previous)
      if (next === 'SNAuth') startSnAuthRepositoryLogin(repositoryUrl)
      localStorage.setItem('authType', next)
      return next
    })
  }, [])
  const Provider = mode === 'IdentityServer' ? RepositoryProvider : SnAuthRepositoryProvider
  return (
    <BrowserRouter>
      <div data-testid="active-mode">{mode}</div>
      <button onClick={() => setUrl(currentRepository)}>Select current repository</button>
      <Provider url={url} changeAuthType={changeAuthType} prepareAuthentication={mockPrepareAuthentication}>
        <div>Authenticated content</div>
      </Provider>
    </BrowserRouter>
  )
}

describe('external authentication provider switching', () => {
  let element: HTMLDivElement
  const originalLocation = window.location
  const replace = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    sessionStorage.clear()
    window.history.replaceState(null, '', '/')
    delete (window as any).location
    window.location = { ...originalLocation, replace } as Location
    ;(prepareExternalLogin as jest.Mock).mockResolvedValue('https://snauth.example.invalid/Login')
    element = document.createElement('div')
    document.body.appendChild(element)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(element)
    })
    element.remove()
    window.location = originalLocation
    localStorage.clear()
    sessionStorage.clear()
  })

  const mount = (initialMode: Mode, initialUrl = '') =>
    act(async () => {
      localStorage.setItem('authType', initialMode)
      render(<Harness initialMode={initialMode} initialUrl={initialUrl} />, element)
    })
  const click = (label: string) =>
    act(async () => {
      Simulate.click(Array.from(element.querySelectorAll('button')).find((button) => button.textContent === label)!)
    })

  it('starts SNAuth sign-in on the first selection after an IdentityServer logout', async () => {
    clearActiveRepositorySelection()
    ;(getAuthConfig as jest.Mock).mockImplementation((repositoryUrl: string) =>
      Promise.resolve(settingsFor(repositoryUrl, 'SNAuth')),
    )
    await mount('IdentityServer')
    await click('Select repository')

    expect(element.querySelector('[data-testid="active-mode"]')?.textContent).toBe('SNAuth')
    expect(prepareExternalLogin).toHaveBeenCalledTimes(1)
    expect(prepareExternalLogin).toHaveBeenCalledWith(
      expect.objectContaining({ repoUrl: chosenRepository, authServerUrl: 'https://snauth.example.invalid' }),
      expect.any(Function),
    )
    expect(replace).toHaveBeenCalledWith('https://snauth.example.invalid/Login')
    expect(getSelectedSnAuthRepository()).toBe(chosenRepository)
    expect(mockLogger.error).not.toHaveBeenCalled()
  })

  it('hands a selected IdentityServer repository over from SNAuth without a compatibility error', async () => {
    ;(getAuthConfig as jest.Mock).mockImplementation((repositoryUrl: string) =>
      Promise.resolve(settingsFor(repositoryUrl, 'IdentityServer')),
    )
    await mount('SNAuth')
    await click('Select repository')

    expect(element.querySelector('[data-testid="active-mode"]')?.textContent).toBe('IdentityServer')
    expect(mockOidcLogin).toHaveBeenCalledTimes(1)
    expect(JSON.parse(localStorage.getItem(oidcAuthConfigKey)!).userManagerSettings.extraQueryParams.snrepo).toBe(
      chosenRepository,
    )
    expect(mockLogger.error).not.toHaveBeenCalled()
    expect(prepareExternalLogin).not.toHaveBeenCalled()
  })

  it.each([
    ['IdentityServer', false],
    ['SNAuth', false],
    ['IdentityServer', true],
    ['SNAuth', true],
  ] as const)(
    'ignores late %s settings after a newer repository selection (failure: %s)',
    async (initialMode, failure) => {
      let resolveOld!: (settings: ReturnType<typeof settingsFor>) => void
      let rejectOld!: (error: Error) => void
      const oldSettings = new Promise<ReturnType<typeof settingsFor>>((resolve, reject) => {
        resolveOld = resolve
        rejectOld = reject
      })
      ;(getAuthConfig as jest.Mock).mockImplementation((repositoryUrl: string) =>
        repositoryUrl === oldRepository ? oldSettings : Promise.resolve(settingsFor(repositoryUrl, initialMode)),
      )
      if (initialMode === 'SNAuth') startSnAuthRepositoryLogin(currentRepository)
      await mount(initialMode, oldRepository)
      await click('Select current repository')
      const configKey = initialMode === 'IdentityServer' ? oidcAuthConfigKey : snAuthConfigKey
      const activeConfig = localStorage.getItem(configKey)
      expect(JSON.parse(activeConfig!).userManagerSettings.extraQueryParams.snrepo).toBe(currentRepository)

      await act(async () => {
        if (failure) rejectOld(new Error('The superseded repository is unavailable'))
        else resolveOld(settingsFor(oldRepository, opposite(initialMode)))
        await oldSettings.catch(() => {})
      })

      expect(mockHandoff).not.toHaveBeenCalled()
      expect(element.querySelector('[data-testid="active-mode"]')?.textContent).toBe(initialMode)
      expect(localStorage.getItem(configKey)).toBe(activeConfig)
      expect(mockLogger.error).not.toHaveBeenCalled()
      expect(mockLogger.warning).not.toHaveBeenCalled()
    },
  )
})
