import { webcrypto } from 'crypto'
import { TextEncoder } from 'util'
import React, { useContext } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import {
  AuthenticationContext,
  AuthenticationContextState,
  AuthenticationProvider,
} from '../src/components/authentication-provider'
import { prepareExternalLogin } from '../src/external-login'
import {
  convertAuthTokenApiCall,
  getUserDetailsApiCall,
  loginApiCall,
  logoutApiCall,
  multiFactorApiCall,
  refreshTokenApiCall,
  validateTokenApiCall,
} from '../src/server-actions'
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from '../src/storage-helpers'

jest.mock('../src/server-actions')
jest.mock('../src/components/auth-routes', () => ({ AuthRoutes: ({ children }: any) => children }))
const target = {
  repoUrl: 'https://repo.example.invalid',
  authServerUrl: 'https://auth.example.invalid',
  callbackUri: '/callback',
}
const prefix = 'repository-a'
const token = (seconds: number) =>
  `header.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + seconds }))}.signature`
const deferred = <T,>() => {
  let resolve!: (value: T) => void
  let reject!: (error: Error) => void
  const promise = new Promise<T>((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}
let state: AuthenticationContextState
let container: HTMLDivElement
const Probe = () => {
  state = useContext(AuthenticationContext)!
  return null
}
const initialize = async (callbacks: any = {}) => {
  await act(async () => {
    render(
      <AuthenticationProvider
        repoUrl={target.repoUrl}
        authServerUrl={target.authServerUrl}
        storageKeyPrefix={prefix}
        eventCallbacks={callbacks}
        snAuthConfiguration={{ callbackUri: target.callbackUri }}>
        <Probe />
      </AuthenticationProvider>,
      container,
    )
  })
}
const originalCrypto = window.crypto
const originalEncoder = global.TextEncoder
beforeEach(() => {
  jest.resetAllMocks()
  localStorage.clear()
  sessionStorage.clear()
  window.history.replaceState(null, '', '/')
  container = document.createElement('div')
  document.body.appendChild(container)
  ;(validateTokenApiCall as jest.Mock).mockResolvedValue(true)
  ;(getUserDetailsApiCall as jest.Mock).mockResolvedValue({ Id: 1 })
  ;(refreshTokenApiCall as jest.Mock).mockResolvedValue({ accessToken: token(3600), refreshToken: 'rotated-refresh' })
  ;(logoutApiCall as jest.Mock).mockResolvedValue(true)
  Object.defineProperty(window, 'crypto', { configurable: true, value: webcrypto })
  global.TextEncoder = TextEncoder as any
})
afterEach(() => {
  act(() => {
    unmountComponentAtNode(container)
  })
  container.remove()
  jest.useRealTimers()
  jest.restoreAllMocks()
  Object.defineProperty(window, 'crypto', { configurable: true, value: originalCrypto })
  global.TextEncoder = originalEncoder
})
const seed = (seconds = 3600) => {
  setAccessToken(token(seconds), prefix)
  setRefreshToken('stored-refresh', prefix)
}

it('finishes failed startup refresh in a recoverable signed-out state', async () => {
  seed(-60)
  ;(refreshTokenApiCall as jest.Mock).mockRejectedValue(new Error('expired refresh token'))
  await initialize()
  expect(state.isLoading).toBe(false)
  expect(state.user).toBeUndefined()
  expect(state.error).toContain('Failed to validate or refresh token')
  expect(getAccessToken(prefix)).toBeNull()
  expect(getRefreshToken(prefix)).toBeNull()
})

it('clears only the current local session immediately even while server logout is pending', async () => {
  seed()
  setAccessToken('other-access', 'repository-b')
  setRefreshToken('other-refresh', 'repository-b')
  const pending = deferred<boolean>()
  ;(logoutApiCall as jest.Mock).mockReturnValue(pending.promise)
  const onLogout = jest.fn()
  await initialize({ onLogout })
  act(() => state.logout())
  expect(state.user).toBeUndefined()
  expect(state.isLoading).toBe(false)
  expect(getAccessToken(prefix)).toBeNull()
  expect(getRefreshToken(prefix)).toBeNull()
  expect(getAccessToken('repository-b')).toBe('other-access')
  expect(getRefreshToken('repository-b')).toBe('other-refresh')
  expect(onLogout).toHaveBeenCalledTimes(1)
  await act(async () => pending.resolve(true))
})

it('reports a late revocation failure without clearing a subsequent login', async () => {
  seed()
  const pending = deferred<boolean>()
  ;(logoutApiCall as jest.Mock).mockReturnValue(pending.promise)
  const onLogoutError = jest.fn()
  await initialize({ onLogoutError })
  act(() => state.logout())
  const fresh = { accessToken: token(7200), refreshToken: 'fresh-refresh' }
  ;(loginApiCall as jest.Mock).mockResolvedValue(fresh)
  ;(getUserDetailsApiCall as jest.Mock).mockResolvedValue({ Id: 2 })
  await act(async () => {
    await state.login({ loginName: 'user', password: 'not-stored' })
  })
  jest.spyOn(console, 'error').mockImplementation(() => {})
  await act(async () => pending.reject(new Error('server unavailable')))
  expect(onLogoutError).toHaveBeenCalledTimes(1)
  expect(state.user).toEqual({ Id: 2 })
  expect(getRefreshToken(prefix)).toBe('fresh-refresh')
  expect(loginApiCall).toHaveBeenCalledWith(target.authServerUrl, {
    loginName: 'user',
    password: 'not-stored',
    siteUrl: target.repoUrl,
  })
})

it('does not initialize an obsolete session after logout while validation is pending', async () => {
  seed()
  const pending = deferred<boolean>()
  ;(validateTokenApiCall as jest.Mock).mockReturnValue(pending.promise)
  const onInitialized = jest.fn()
  const storedToken = getAccessToken(prefix)
  await initialize({ onInitialized })
  act(() => state.logout())
  expect(logoutApiCall).toHaveBeenCalledWith(target.authServerUrl, storedToken)
  await act(async () => pending.resolve(true))
  expect(getUserDetailsApiCall).not.toHaveBeenCalled()
  expect(onInitialized).not.toHaveBeenCalled()
  expect(state.user).toBeUndefined()
  expect(getAccessToken(prefix)).toBeNull()
})

it.each(['logout', 'unmount'])('does not persist late refresh results after %s', async (finish) => {
  jest.useFakeTimers()
  seed(15)
  await initialize()
  const pendingUser = deferred<any>()
  ;(getUserDetailsApiCall as jest.Mock).mockReturnValue(pendingUser.promise)
  await act(async () => jest.advanceTimersByTime(10000))
  expect(refreshTokenApiCall).toHaveBeenCalledTimes(1)
  const before = getAccessToken(prefix)
  act(() => {
    if (finish === 'logout') state.logout()
    else unmountComponentAtNode(container)
  })
  await act(async () => pendingUser.resolve({ Id: 1 }))
  expect(getAccessToken(prefix)).toBe(finish === 'logout' ? null : before)
  expect(getRefreshToken(prefix)).toBe(finish === 'logout' ? null : 'stored-refresh')
})

it('does not commit a login response that arrives after logout', async () => {
  await initialize()
  const pending = deferred<any>()
  ;(loginApiCall as jest.Mock).mockReturnValue(pending.promise)
  let loginResult!: Promise<any>
  act(() => {
    loginResult = state.login({ loginName: 'user', password: 'not-stored' }).catch((error) => error)
  })
  act(() => state.logout())
  await act(async () => pending.resolve({ accessToken: token(3600), refreshToken: 'too-late' }))
  expect((await loginResult).message).toBe('Sign-in was cancelled.')
  expect(getUserDetailsApiCall).not.toHaveBeenCalled()
  expect(getAccessToken(prefix)).toBeNull()
})

it('ignores the first repository initialization after an A-to-B-to-A scope switch', async () => {
  seed()
  const pendingUser = deferred<any>()
  ;(getUserDetailsApiCall as jest.Mock).mockReturnValueOnce(pendingUser.promise).mockResolvedValue({ Id: 2 })
  await initialize()
  const renderScope = async (repoUrl: string, storageKeyPrefix: string) => {
    await act(async () => {
      render(
        <AuthenticationProvider
          repoUrl={repoUrl}
          authServerUrl={target.authServerUrl}
          storageKeyPrefix={storageKeyPrefix}
          snAuthConfiguration={{ callbackUri: target.callbackUri }}>
          <Probe />
        </AuthenticationProvider>,
        container,
      )
    })
  }
  await renderScope('https://second.example.invalid', 'repository-b')
  await renderScope(target.repoUrl, prefix)
  expect(state.user).toEqual({ Id: 2 })
  await act(async () => pendingUser.resolve({ Id: 1 }))
  expect(state.user).toEqual({ Id: 2 })
  expect(getRefreshToken(prefix)).toBe('stored-refresh')
})

it('binds direct MFA to the repository and ignores its response after logout', async () => {
  await initialize()
  const pending = deferred<any>()
  ;(multiFactorApiCall as jest.Mock).mockReturnValue(pending.promise)
  let loginResult!: Promise<any>
  act(() => {
    loginResult = state
      .multiFactorLogin({ multiFactorAuthToken: 'mfa-challenge', multiFactorCode: '123456' })
      .catch((error) => error)
  })
  expect(multiFactorApiCall).toHaveBeenCalledWith(target.authServerUrl, {
    multiFactorAuthToken: 'mfa-challenge',
    multiFactorCode: '123456',
    siteUrl: target.repoUrl,
  })
  act(() => state.logout())
  await act(async () => pending.resolve({ accessToken: token(3600), refreshToken: 'too-late' }))
  expect((await loginResult).message).toBe('Sign-in was cancelled.')
  expect(getUserDetailsApiCall).not.toHaveBeenCalled()
  expect(getAccessToken(prefix)).toBeNull()
})

it.each(['exchange', 'current-user'])('ignores a late callback %s response after logout', async (step) => {
  const url = new URL(await prepareExternalLogin(target))
  const query = new URLSearchParams({ auth_code: 'bound-code', state: url.searchParams.get('state')! })
  window.history.replaceState(null, '', `/callback?${query}`)
  const pending = deferred<any>()
  const tokens = { accessToken: token(3600), refreshToken: 'too-late' }
  ;(convertAuthTokenApiCall as jest.Mock).mockResolvedValue(tokens)
  if (step === 'exchange') (convertAuthTokenApiCall as jest.Mock).mockReturnValue(pending.promise)
  else (getUserDetailsApiCall as jest.Mock).mockReturnValue(pending.promise)
  await initialize()
  act(() => state.logout())
  await act(async () => pending.resolve(step === 'exchange' ? tokens : { Id: 1 }))
  expect(state.user).toBeUndefined()
  expect(getAccessToken(prefix)).toBeNull()
  expect(getRefreshToken(prefix)).toBeNull()
  if (step === 'exchange') expect(getUserDetailsApiCall).not.toHaveBeenCalled()
})

it.each(['missing', 'wrong'])('rejects an unsolicited %s-state callback before exchanging the code', async (kind) => {
  const query = new URLSearchParams({ auth_code: 'unsolicited-code' })
  if (kind === 'wrong') query.set('state', 'unknown-state')
  window.history.replaceState(null, '', `/callback?${query}`)
  await initialize()
  expect(convertAuthTokenApiCall).not.toHaveBeenCalled()
  expect(state.isLoading).toBe(false)
  expect(state.error).toContain('does not match an active login')
  expect(getAccessToken(prefix)).toBeNull()
})

it('exchanges a matching callback once using the browser-held verifier', async () => {
  const url = new URL(await prepareExternalLogin(target))
  const query = new URLSearchParams({ auth_code: 'bound-code', state: url.searchParams.get('state')! })
  window.history.replaceState(null, '', `/callback?${query}`)
  ;(convertAuthTokenApiCall as jest.Mock).mockResolvedValue({ accessToken: token(3600), refreshToken: 'bound-refresh' })
  await initialize()
  expect(convertAuthTokenApiCall).toHaveBeenCalledWith(
    target.authServerUrl,
    'bound-code',
    expect.stringMatching(/^[A-Za-z0-9_-]{43}$/),
  )
  expect(state.user).toEqual({ Id: 1 })
  expect(getRefreshToken(prefix)).toBe('bound-refresh')
  expect(sessionStorage.length).toBe(0)
  expect(window.location.pathname + window.location.search).toBe('/')
  await act(async () => {
    window.history.replaceState(null, '', `/callback?${query}`)
    window.dispatchEvent(new PopStateEvent('popstate'))
  })
  expect(convertAuthTokenApiCall).toHaveBeenCalledTimes(1)
  expect(state.error).toContain('does not match an active login')
})
