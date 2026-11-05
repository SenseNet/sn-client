import { webcrypto } from 'crypto'
import { TextEncoder } from 'util'
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act, Simulate } from 'react-dom/test-utils'
import { getPendingExternalLoginTarget, prepareExternalLogin } from '../../../packages/sn-auth-react/src/external-login'
import {
  convertAuthTokenApiCall,
  getUserDetailsApiCall,
  refreshTokenApiCall,
} from '../../../packages/sn-auth-react/src/server-actions'
import { getAccessToken, setAccessToken, setRefreshToken } from '../../../packages/sn-auth-react/src/storage-helpers'
import { SnAuthRepositoryProvider } from '../src/context/sn-auth-repository-provider'
import {
  getSelectedSnAuthRepository,
  getSnAuthStorageKeyPrefix,
  setSelectedSnAuthRepository,
  setSnAuthRepositoryConfig,
  startSnAuthRepositoryLogin,
} from '../src/services/repository-session'

const mockLogger = { error: jest.fn(), warning: jest.fn() }
jest.mock('../../../packages/sn-auth-react/src/server-actions')
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
      <button onClick={buttonOnClick}>{buttonText}</button>
    </>
  ),
}))
const repository = 'https://repo.example.invalid'
const server = 'https://auth.example.invalid'
const configuration = {
  authServerSettings: { type: 'SNAuth' },
  userManagerSettings: { authority: server, extraQueryParams: { snrepo: repository } },
}
jest.mock('../src/services/auth-config', () => ({ getAuthConfig: () => Promise.resolve(configuration) }))

describe('SNAuth repository failure recovery', () => {
  let element: HTMLDivElement
  const changeAuthType = jest.fn()
  const prepareAuthentication = jest.fn().mockResolvedValue(true)
  const originalCrypto = window.crypto
  const originalEncoder = global.TextEncoder

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    sessionStorage.clear()
    window.history.replaceState(null, '', '/')
    setSnAuthRepositoryConfig(repository, configuration)
    localStorage.setItem('unrelated-repository-token', 'keep-this-session')
    element = document.createElement('div')
    document.body.appendChild(element)
    Object.defineProperty(window, 'crypto', { configurable: true, value: webcrypto })
    global.TextEncoder = TextEncoder as any
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(element)
    })
    element.remove()
    Object.defineProperty(window, 'crypto', { configurable: true, value: originalCrypto })
    global.TextEncoder = originalEncoder
    localStorage.clear()
    sessionStorage.clear()
  })

  const mount = (url = repository) =>
    act(async () => {
      render(
        <SnAuthRepositoryProvider
          url={url}
          changeAuthType={changeAuthType}
          prepareAuthentication={prepareAuthentication}>
          <div>Authenticated content</div>
        </SnAuthRepositoryProvider>,
        element,
      )
    })

  const expectRecovery = async (message: string) => {
    expect(element.querySelector('[role="alert"]')?.textContent).toContain(message)
    expect(element.textContent).not.toContain('Loading')
    expect(element.textContent).not.toContain('Authenticated content')
    expect(changeAuthType).not.toHaveBeenCalled()
    await act(async () => {
      Simulate.click(element.querySelector('button')!)
    })
    expect(element.textContent).toContain('Repository picker')
    expect(element.textContent).not.toContain('Loading')
    expect(localStorage.getItem('unrelated-repository-token')).toBe('keep-this-session')
  }

  it('shows failed startup refresh and returns to the repository picker without a stale loader', async () => {
    const prefix = getSnAuthStorageKeyPrefix(repository)
    const expired = `header.${btoa(JSON.stringify({ exp: 1 }))}.signature`
    setAccessToken(expired, prefix)
    setRefreshToken('expired-refresh', prefix)
    ;(refreshTokenApiCall as jest.Mock).mockRejectedValue(new Error('Refresh expired'))
    await mount()
    expect(getAccessToken(prefix)).toBeNull()
    await expectRecovery('Failed to validate or refresh token')
  })

  it.each(['Local', 'IdentityServer'])(
    'preserves the global %s mode and prior repository for an unknown-state callback',
    async (previousMode) => {
      localStorage.setItem('authType', previousMode)
      window.history.replaceState(null, '', '/authentication/callback?auth_code=unsolicited-code&state=unknown-state')
      const globalConfig = localStorage.getItem('sn-auth-config')
      setSelectedSnAuthRepository('https://second.example.invalid')
      await mount()
      expect(getSelectedSnAuthRepository()).toBe('https://second.example.invalid')
      expect(localStorage.getItem('sn-auth-config')).toBe(globalConfig)
      expect(localStorage.getItem('authType')).toBe(previousMode)
      expect(convertAuthTokenApiCall).not.toHaveBeenCalled()
      await expectRecovery('does not match an active login')
    },
  )

  it('shows secure-login initialization failures without silently changing authentication type', async () => {
    Object.defineProperty(window, 'crypto', { configurable: true, value: {} })
    startSnAuthRepositoryLogin(repository)
    await mount()
    await expectRecovery('Could not start secure sign-in')
  })

  it.each(['Local', 'IdentityServer'])(
    'restores the tab-bound callback repository after another tab changes the global mode to %s',
    async (previousMode) => {
      localStorage.setItem('authType', previousMode)
      const callbackUri = '/authentication/callback'
      const pending = new URL(await prepareExternalLogin({ repoUrl: repository, authServerUrl: server, callbackUri }))
      const otherRepository = 'https://second.example.invalid'
      const otherConfiguration = {
        ...configuration,
        userManagerSettings: {
          authority: 'https://second-auth.example.invalid',
          extraQueryParams: { snrepo: otherRepository },
        },
      }
      setSnAuthRepositoryConfig(otherRepository, otherConfiguration)
      setSelectedSnAuthRepository(otherRepository)
      const otherPrefix = getSnAuthStorageKeyPrefix(otherRepository)
      setAccessToken('other-access', otherPrefix)
      setRefreshToken('other-refresh', otherPrefix)
      const state = pending.searchParams.get('state')!
      window.history.replaceState(null, '', `${callbackUri}?${new URLSearchParams({ auth_code: 'bound-code', state })}`)
      ;(convertAuthTokenApiCall as jest.Mock).mockResolvedValue({ accessToken: 'a-access', refreshToken: 'a-refresh' })
      ;(getUserDetailsApiCall as jest.Mock).mockResolvedValue({ Id: 42 })
      await mount('')
      expect(prepareAuthentication).not.toHaveBeenCalled()
      expect(convertAuthTokenApiCall).toHaveBeenCalledWith(server, 'bound-code', expect.any(String))
      expect(getUserDetailsApiCall).toHaveBeenCalledWith(repository, 'a-access')
      expect(getAccessToken(getSnAuthStorageKeyPrefix(repository))).toBe('a-access')
      expect(getAccessToken(otherPrefix)).toBe('other-access')
      expect(getSelectedSnAuthRepository()).toBe(repository)
      expect(localStorage.getItem('authType')).toBe('SNAuth')
      expect(element.textContent).toContain('Authenticated content')
      expect(getPendingExternalLoginTarget(callbackUri, state)).toBeUndefined()
    },
  )

  it('refuses a cached config whose authority differs from the tab-bound callback', async () => {
    const callbackUri = '/authentication/callback'
    const pending = new URL(await prepareExternalLogin({ repoUrl: repository, authServerUrl: server, callbackUri }))
    setSnAuthRepositoryConfig(repository, {
      ...configuration,
      userManagerSettings: { ...configuration.userManagerSettings, authority: 'https://wrong-auth.example.invalid' },
    })
    setSelectedSnAuthRepository('https://second.example.invalid')
    const state = pending.searchParams.get('state')!
    window.history.replaceState(null, '', `${callbackUri}?${new URLSearchParams({ auth_code: 'bound-code', state })}`)
    const globalConfig = localStorage.getItem('sn-auth-config')
    await mount('')
    expect(convertAuthTokenApiCall).not.toHaveBeenCalled()
    expect(getSelectedSnAuthRepository()).toBe('https://second.example.invalid')
    expect(localStorage.getItem('sn-auth-config')).toBe(globalConfig)
    expect(getPendingExternalLoginTarget(callbackUri, state)?.repoUrl).toBe(repository)
    await expectRecovery('does not match an active login')
  })
})
