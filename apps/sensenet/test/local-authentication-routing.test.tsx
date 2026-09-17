import React, { useEffect } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import AppProviders from '../src/components/app-providers'
import { discoverAuthentication } from '../src/services/local-authentication'

const mockPass = ({ children }: any) => <>{children}</>
const mockExternal = jest.fn()
const mockLocal = jest.fn()
const MockExternalProvider = ({ children, url, prepareAuthentication }: any) => {
  useEffect(() => {
    if (url)
      prepareAuthentication(url)
        .then((allowed: boolean) => {
          if (allowed) mockExternal(url)
        })
        .catch(() => {})
  }, [url, prepareAuthentication])
  return <>{children}</>
}
jest.mock('@sensenet/hooks-react', () => ({
  InjectorContext: jest.requireActual('react').createContext(null),
  LoggerContextProvider: (props: any) => mockPass(props),
}))
jest.mock('../src/auth-config', () => ({ defaultAuthConfig: { authType: 'SNAuth' } }))
jest.mock('../src/context', () => ({
  LocalizationProvider: (props: any) => mockPass(props),
  PersonalSettingsContextProvider: (props: any) => mockPass(props),
  ResponsiveContextProvider: (props: any) => mockPass(props),
  ThemeProvider: (props: any) => mockPass(props),
  RepositorySwitchContext: jest.requireActual('react').createContext(null),
  RepositoryProvider: (props: any) => MockExternalProvider(props),
}))
jest.mock('../src/context/sn-auth-repository-provider', () => ({
  SnAuthRepositoryProvider: (props: any) => MockExternalProvider(props),
}))
jest.mock('../src/context/local-repository-provider', () => ({
  LocalRepositoryProvider: ({ url }: any) => {
    mockLocal(url)
    return <div>Internal login</div>
  },
}))
jest.mock('../src/context/auth-provider', () => ({
  ISAuthProvider: (props: any) => mockPass(props),
  SNAuthProvider: (props: any) => mockPass(props),
}))
jest.mock('../src/context/PathSaver', () => () => null)
jest.mock('../src/context/ShareProvider', () => ({ ShareProvider: (props: any) => mockPass(props) }))
jest.mock('../src/components/dialogs/dialog-provider', () => ({ DialogProvider: (props: any) => mockPass(props) }))
jest.mock('../src/components/grid/Providers/GridLoadingProvider', () => ({
  GridLoadingProvider: (props: any) => mockPass(props),
}))
jest.mock('../src/components/tree/Contexts/TreeLoadingProvider', () => ({
  TreeLoadingProvider: (props: any) => mockPass(props),
}))
jest.mock('../src/components/tree/Contexts/ExpandedItemsProvider', () => (props: any) => mockPass(props))
jest.mock('../src/components/sn-injector', () => ({
  snInjector: { getInstance: () => ({ RegisterProviders: () => {} }) },
}))
jest.mock('../src/services', () => ({}))
jest.mock('../src/services/local-authentication', () => ({
  discoverAuthentication: jest.fn(),
  getLocalRepositories: () => [],
  localSelectedRepository: 'selected-local',
}))
jest.mock('../src/services/repository-session', () => ({
  clearActiveRepositorySelection: jest.fn(),
  hasSnAuthRepositoryTokens: () => false,
  normalizeRepositoryUrl: (url: string) => url.replace(/\/$/, ''),
  startSnAuthRepositoryLogin: jest.fn(),
}))

let element: HTMLDivElement
beforeEach(() => {
  jest.clearAllMocks()
  localStorage.clear()
  sessionStorage.clear()
  window.history.replaceState(null, '', '/content/deep-link?repoUrl=https%3A%2F%2Frepo.example')
  element = document.createElement('div')
  document.body.appendChild(element)
})
afterEach(() => {
  act(() => {
    unmountComponentAtNode(element)
  })
  element.remove()
})
const mount = () =>
  act(async () => {
    render(
      <AppProviders>
        <div>Content</div>
      </AppProviders>,
      element,
    )
  })
const choose = (label: string) =>
  act(async () => {
    Array.from(element.querySelectorAll('button'))
      .find((b) => b.textContent === label)!
      .click()
  })

it('requires an explicit choice for Secondary and retains the deep link', async () => {
  ;(discoverAuthentication as jest.Mock).mockResolvedValue({ mode: 'Secondary', local: {} })
  await mount()
  expect(element.textContent).toContain('Choose how to sign in')
  expect(mockExternal).not.toHaveBeenCalled()
  expect(mockLocal).not.toHaveBeenCalled()
  await choose('Use internal authentication')
  expect(mockLocal).toHaveBeenCalledWith('https://repo.example')
  expect(mockExternal).not.toHaveBeenCalled()
  expect(window.location.pathname).toBe('/content/deep-link')
})

it('opens only the external provider after an explicit external choice', async () => {
  ;(discoverAuthentication as jest.Mock).mockResolvedValue({ mode: 'Secondary', local: {} })
  await mount()
  await choose('Use external authentication')
  expect(mockExternal).toHaveBeenCalledWith('https://repo.example')
  expect(mockLocal).not.toHaveBeenCalled()
})

it('opens InternalOnly directly without external discovery or authentication', async () => {
  ;(discoverAuthentication as jest.Mock).mockResolvedValue({ mode: 'InternalOnly', local: {} })
  await mount()
  expect(element.textContent).toContain('Internal login')
  expect(mockExternal).not.toHaveBeenCalled()
})

it('does not switch to local authentication when discovery fails', async () => {
  ;(discoverAuthentication as jest.Mock).mockRejectedValue(new Error('network unavailable'))
  await mount()
  expect(mockLocal).not.toHaveBeenCalled()
  expect(mockExternal).not.toHaveBeenCalled()
})

it.each(['/login', '/login/'])('selects the same-origin repository at %s without a query parameter', async (path) => {
  window.history.replaceState(null, '', path)
  localStorage.setItem('authType', 'Local')
  sessionStorage.setItem('selected-local', 'https://previous.example')
  ;(discoverAuthentication as jest.Mock).mockResolvedValue({ mode: 'InternalOnly', local: {} })
  await mount()
  expect(discoverAuthentication).toHaveBeenCalledWith(window.location.origin)
  expect(mockLocal).toHaveBeenLastCalledWith(window.location.origin)
  expect(mockExternal).not.toHaveBeenCalled()
  expect(window.location.search).toBe('')
})

it('keeps an explicit repository override at /login', async () => {
  window.history.replaceState(null, '', '/login?repoUrl=https%3A%2F%2Fother.example')
  ;(discoverAuthentication as jest.Mock).mockResolvedValue({ mode: 'InternalOnly', local: {} })
  await mount()
  expect(discoverAuthentication).toHaveBeenCalledWith('https://other.example')
  expect(mockLocal).toHaveBeenLastCalledWith('https://other.example')
})

it.each(['/', '/login-help'])('does not infer a same-origin repository at %s', async (path) => {
  window.history.replaceState(null, '', path)
  await mount()
  expect(discoverAuthentication).not.toHaveBeenCalled()
  expect(mockLocal).not.toHaveBeenCalled()
  expect(mockExternal).not.toHaveBeenCalled()
})
