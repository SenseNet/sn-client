import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act, Simulate } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '../src/components/login/login-page'
import DefaultLocalization from '../src/localization/default'
import HungarianLocalization from '../src/localization/hungarian'
import {
  getRepositoryConnections,
  rememberRepositoryConnection,
  renameRepositoryConnection,
  setRepositoryConnectionPinned,
} from '../src/services/repository-connections'

let mockLocalization = DefaultLocalization
jest.mock('../src/hooks', () => ({ useLocalization: () => mockLocalization }))

let element: HTMLDivElement
const onSubmit = jest.fn()

beforeEach(() => {
  jest.useFakeTimers()
  localStorage.clear()
  mockLocalization = DefaultLocalization
  onSubmit.mockClear()
  element = document.createElement('div')
  document.body.appendChild(element)
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    top: 0,
    right: 100,
    bottom: 36,
    left: 0,
    width: 100,
    height: 36,
    toJSON: () => ({}),
  })
})

afterEach(() => {
  act(() => {
    unmountComponentAtNode(element)
  })
  element.remove()
  jest.clearAllTimers()
  jest.useRealTimers()
  jest.restoreAllMocks()
})

const mount = (props: Partial<React.ComponentProps<typeof LoginPage>> = {}) => {
  act(() => {
    render(
      <MemoryRouter>
        <LoginPage handleSubmit={onSubmit} isLoginInProgress={false} {...props} />
      </MemoryRouter>,
      element,
    )
  })
}
const click = (target: Element) => act(() => Simulate.click(target))
const fill = (value: string, selector = '#repository') => {
  const input = document.querySelector<HTMLInputElement>(selector)!
  act(() => Simulate.change(input, { target: { value } } as any))
}
const submit = (form = element.querySelector('form')!) => act(() => Simulate.submit(form))
const action = (name: string, url?: string) =>
  Array.from(document.querySelectorAll<HTMLButtonElement>(`[data-repository-action="${name}"]`)).find(
    (button) => !url || button.dataset.repositoryUrl === url,
  )!
const menuItem = (text: string) =>
  Array.from(document.querySelectorAll('[role="menuitem"]')).find((item) => item.textContent === text)!
const rows = (group: string) => element.querySelectorAll(`[aria-labelledby="${group}-repositories"] li`)
const seed = (pinned: number, recent: number) => {
  for (let i = 0; i < pinned + recent; i++) {
    const url = `https://repo-${i}.example`
    rememberRepositoryConnection(url)
    if (i < pinned) setRepositoryConnectionPinned(url, true)
  }
}

it('shows the compact URL form without the obsolete welcome, demo or connection helper copy', () => {
  mount()
  expect(element.querySelector('h1')?.textContent).toBe('Repositories')
  expect(element.querySelector('label[for="repository"]')?.textContent).toBe('Repository URL')
  expect(element.textContent).toContain('Continue')
  expect(element.textContent).not.toMatch(/welcome|demo|new connection|provided by|otherwise/i)
  expect(element.querySelector('section')).toBeNull()
})

it('shows every pin, only six unpinned recent entries, and expands without losing the typed address or focus', () => {
  seed(8, 14)
  mount()
  expect(rows('pinned')).toHaveLength(8)
  expect(rows('recent')).toHaveLength(6)
  expect(element.querySelector('#recent-repositories')?.textContent).toContain('6 of 14')
  fill('https://new.example')
  click(action('show-all'))
  expect(rows('recent')).toHaveLength(14)
  expect(action('show-all').getAttribute('aria-expanded')).toBe('true')
  expect(document.activeElement).toBe(action('show-all'))
  expect((element.querySelector('#repository') as HTMLInputElement).value).toBe('https://new.example')
  click(action('show-all'))
  expect(rows('recent')).toHaveLength(6)
  expect(action('show-all').textContent).toContain('Show all 14')
  expect(document.activeElement).toBe(action('show-all'))
})

it('moves a connection between groups without duplication and keeps a useful keyboard focus below the recent cutoff', () => {
  seed(1, 8)
  mount()
  click(action('show-all'))
  const oldestRecent = rows('recent')[rows('recent').length - 1]
  const url = oldestRecent.querySelector<HTMLButtonElement>('[data-repository-action="pin"]')!.dataset.repositoryUrl!
  click(action('pin', url))
  expect(rows('pinned')).toHaveLength(2)
  expect(getRepositoryConnections().filter((connection) => connection.repoUrl === url)).toHaveLength(1)
  expect(document.activeElement).toBe(action('pin', url))
  click(action('show-all'))
  click(action('pin', url))
  expect(rows('pinned')).toHaveLength(1)
  expect(rows('recent')).toHaveLength(6)
  expect(document.activeElement).toBe(action('show-all'))
  expect(getRepositoryConnections().find((connection) => connection.repoUrl === url)?.pinned).toBe(false)
})

it('renames with safe text, preserves the exact URL, and accepts an empty name to restore its address', () => {
  seed(0, 1)
  const url = 'https://repo-0.example'
  mount()
  click(action('more', url))
  click(menuItem('Rename repository'))
  fill('<b>Personal name</b>', '[name="repositoryDisplayName"]')
  submit(document.querySelector('[role="dialog"] form')!)
  act(() => jest.advanceTimersByTime(300))
  expect(element.textContent).toContain('<b>Personal name</b>')
  expect(element.querySelector('b')).toBeNull()
  expect(action('open', url).textContent).toContain(url)
  expect(getRepositoryConnections()[0].name).toBe('<b>Personal name</b>')
  click(action('more', url))
  click(menuItem('Rename repository'))
  fill('', '[name="repositoryDisplayName"]')
  submit(document.querySelector('[role="dialog"] form')!)
  act(() => jest.advanceTimersByTime(300))
  expect(getRepositoryConnections()[0].name).toBeUndefined()
  expect(action('open', url).textContent).toContain('repo-0.example')
})

it('removes only the remembered row and restores its name and pin with Undo', () => {
  seed(1, 1)
  const url = 'https://repo-0.example'
  renameRepositoryConnection(url, 'My repository')
  localStorage.setItem('auth-token-canary', 'unchanged')
  mount()
  click(action('more', url))
  click(menuItem('Remove from this list'))
  act(() => jest.advanceTimersByTime(300))
  expect(action('open', url)).toBeUndefined()
  expect(document.activeElement).toBe(action('undo'))
  expect(document.body.textContent).toContain('My repository removed from this list.')
  expect(localStorage.getItem('auth-token-canary')).toBe('unchanged')
  click(action('undo'))
  expect(action('open', url).textContent).toContain('My repository')
  expect(action('pin', url).getAttribute('aria-pressed')).toBe('true')
  expect(document.activeElement).toBe(action('open', url))
})

it('validates URLs inline and submits a normalized address without storing failed or unconfirmed connections', () => {
  mount()
  for (const value of ['', 'ftp://repo.example', 'https://name:password@repo.example', 'not a url']) {
    fill(value)
    submit()
    expect(element.querySelector('[role="alert"]')?.textContent).toBe('Enter a valid repository URL.')
    expect(element.querySelector('#repository')?.getAttribute('aria-invalid')).toBe('true')
    expect(document.activeElement).toBe(element.querySelector('#repository'))
  }
  expect(onSubmit).not.toHaveBeenCalled()
  fill('repo.example/folder/?test=1#fragment')
  submit()
  expect(onSubmit).toHaveBeenCalledWith('https://repo.example/folder')
  expect(getRepositoryConnections()).toEqual([])
})

it('retains a failed repository address and dismisses the old connection error when the user edits it', () => {
  mount({ initialRepositoryUrl: 'https://failed.example', connectionFailed: true })
  expect((element.querySelector('#repository') as HTMLInputElement).value).toBe('https://failed.example')
  expect(element.querySelector('[role="alert"]')?.textContent).toContain('Could not connect')
  fill('https://fixed.example')
  expect(element.querySelector('[role="alert"]')).toBeNull()
  mount({ initialRepositoryUrl: 'https://another-failure.example', connectionFailed: true })
  expect((element.querySelector('#repository') as HTMLInputElement).value).toBe('https://another-failure.example')
  expect(element.querySelector('[role="alert"]')?.textContent).toContain('Could not connect')
})

it('disables mutations and shows one progress indicator on the selected connection while connecting', () => {
  seed(1, 8)
  const url = 'https://repo-0.example'
  mount()
  click(action('open', url))
  expect(onSubmit).toHaveBeenCalledWith(url)
  mount({ isLoginInProgress: true })
  expect((element.querySelector('#repository') as HTMLInputElement).disabled).toBe(true)
  expect(Array.from(element.querySelectorAll('button')).every((button) => button.disabled)).toBe(true)
  expect(element.querySelectorAll('[role="progressbar"]')).toHaveLength(1)
  expect(action('open', url).querySelector('[role="progressbar"]')).not.toBeNull()
})

it('localizes the new interactions in Hungarian', () => {
  mockLocalization = {
    ...DefaultLocalization,
    login: { ...DefaultLocalization.login, ...HungarianLocalization.login },
  }
  seed(1, 8)
  mount()
  expect(element.querySelector('h1')?.textContent).toBe('Repository-k')
  expect(element.textContent).toContain('Tovább')
  expect(element.textContent).toContain('Rögzített')
  expect(action('show-all').textContent).toContain('Összes megjelenítése (8)')
  expect(action('pin', 'https://repo-0.example').getAttribute('aria-label')).toContain('Rögzítés feloldása')
})
