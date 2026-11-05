import { UserManager } from 'oidc-client'
import { handleOidcSilentCallback } from '../src/services/oidc-silent-callback'

const mockRender = jest.fn()
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  render: (...args: any[]) => mockRender(...args),
}))
jest.mock('../src/components/app', () => ({ App: () => null }))

describe('OIDC silent callback bootstrap', () => {
  const parentDescriptor = Object.getOwnPropertyDescriptor(window, 'parent')!
  const postMessage = jest.fn()
  const callbackUrl = '/authentication/silent-callback?code=synthetic-code&state=synthetic-state'

  const insideFrame = () => Object.defineProperty(window, 'parent', { configurable: true, value: { postMessage } })
  const atTopLevel = () => Object.defineProperty(window, 'parent', { configurable: true, value: window })
  const bootstrap = () => {
    jest.isolateModules(() => {
      // Keep the real relay and its UserManager prototype shared with the spies.
      jest.doMock('../src/services/oidc-silent-callback', () => ({ handleOidcSilentCallback }))
      require('../src/index')
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    sessionStorage.clear()
    atTopLevel()
    window.history.replaceState(null, '', '/')
  })

  afterEach(() => {
    jest.restoreAllMocks()
    Object.defineProperty(window, 'parent', parentDescriptor)
    localStorage.clear()
    sessionStorage.clear()
  })

  it.each(['IdentityServer', 'SNAuth', 'Local'])(
    'relays the real callback without bootstrapping the remembered %s provider',
    async (authType) => {
      localStorage.setItem('authType', authType)
      localStorage.setItem('sn-auth-config', JSON.stringify({ unrelated: 'remembered-repository' }))
      localStorage.setItem('unrelated-token', 'preserve-local-session')
      sessionStorage.setItem('unrelated-tab-session', 'preserve-tab-session')
      const savedLocal = JSON.stringify(localStorage)
      const savedSession = JSON.stringify(sessionStorage)
      window.history.replaceState(null, '', callbackUrl)
      insideFrame()
      const getUser = jest.spyOn(UserManager.prototype, 'getUser')
      const signinRedirect = jest.spyOn(UserManager.prototype, 'signinRedirect')
      const signinSilent = jest.spyOn(UserManager.prototype, 'signinSilent')
      const storeUser = jest.spyOn(UserManager.prototype, 'storeUser')
      const storageRead = jest.spyOn(Storage.prototype, 'getItem')
      const storageWrite = jest.spyOn(Storage.prototype, 'setItem')
      const storageRemove = jest.spyOn(Storage.prototype, 'removeItem')
      const fetch = jest.spyOn(window, 'fetch')
      const xhr = jest.spyOn(XMLHttpRequest.prototype, 'open')
      const interval = jest.spyOn(window, 'setInterval')
      const timeout = jest.spyOn(window, 'setTimeout')

      bootstrap()
      await Promise.resolve()

      expect(postMessage).toHaveBeenCalledTimes(1)
      expect(postMessage).toHaveBeenCalledWith(window.location.href, window.location.origin)
      expect(mockRender).not.toHaveBeenCalled()
      expect(getUser).not.toHaveBeenCalled()
      expect(signinRedirect).not.toHaveBeenCalled()
      expect(signinSilent).not.toHaveBeenCalled()
      expect(storeUser).not.toHaveBeenCalled()
      expect(storageRead).not.toHaveBeenCalled()
      expect(storageWrite).not.toHaveBeenCalled()
      expect(storageRemove).not.toHaveBeenCalled()
      expect(fetch).not.toHaveBeenCalled()
      expect(xhr).not.toHaveBeenCalled()
      expect(interval).not.toHaveBeenCalled()
      expect(timeout).not.toHaveBeenCalled()
      expect(JSON.stringify(localStorage)).toBe(savedLocal)
      expect(JSON.stringify(sessionStorage)).toBe(savedSession)
    },
  )

  it.each([
    '/authentication/login-callback?code=synthetic-code&state=synthetic-state',
    '/authentication/callback?auth_code=synthetic-code&state=synthetic-state',
    '/authentication/silent-callback-extra',
    '/',
  ])('keeps the application bootstrap for the unrelated route %s', (path) => {
    window.history.replaceState(null, '', path)
    insideFrame()

    bootstrap()

    expect(mockRender).toHaveBeenCalledTimes(1)
    expect(postMessage).not.toHaveBeenCalled()
  })

  it('keeps the application bootstrap for a top-level silent callback navigation', () => {
    window.history.replaceState(null, '', callbackUrl)
    atTopLevel()

    bootstrap()

    expect(mockRender).toHaveBeenCalledTimes(1)
    expect(postMessage).not.toHaveBeenCalled()
  })
})
