import { Repository } from '@sensenet/client-core'
import { RepositoryContext } from '@sensenet/hooks-react'
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { RepositoryDocumentTitle } from '../src/components/repository-document-title'
import {
  rememberRepositoryConnection,
  removeRepositoryConnection,
  renameRepositoryConnection,
  repositoryConnectionsStorageKey,
} from '../src/services/repository-connections'

const first = 'https://first.example:8443/tenant'
const second = 'https://second.example'
let element: HTMLDivElement
let originalTitle: string

beforeEach(() => {
  originalTitle = document.title
  document.title = 'sensenet'
  localStorage.clear()
  element = document.createElement('div')
  document.body.appendChild(element)
})

afterEach(() => {
  act(() => {
    unmountComponentAtNode(element)
  })
  element.remove()
  localStorage.clear()
  document.title = originalTitle
})

const mount = (repoUrl = first) => {
  const repository = new Repository({ repositoryUrl: repoUrl })
  act(() => {
    render(
      <RepositoryContext.Provider value={repository}>
        <RepositoryDocumentTitle />
      </RepositoryContext.Provider>,
      element,
    )
  })
}

it('uses the same URL-derived host, port and path as Recent for an unsaved repository', () => {
  mount(`${first}/?ignored=value#fragment`)
  expect(document.title).toBe('first.example:8443/tenant')
})

it('uses the custom name of the active repository, independently of global selections in other tabs', () => {
  rememberRepositoryConnection(first)
  renameRepositoryConnection(first, 'Customer documents')
  rememberRepositoryConnection(second)
  renameRepositoryConnection(second, 'Another repository')
  localStorage.setItem('sn-auth-selected-repository', second)
  localStorage.setItem(
    'sn-oidc-config',
    JSON.stringify({ userManagerSettings: { extraQueryParams: { snrepo: second } } }),
  )

  mount()
  expect(document.title).toBe('Customer documents')
})

it('updates after same-tab rename and falls back when the custom name is cleared or the entry removed', () => {
  rememberRepositoryConnection(first)
  mount()
  act(() => renameRepositoryConnection(first, 'Daily repository'))
  expect(document.title).toBe('Daily repository')
  act(() => renameRepositoryConnection(first, ''))
  expect(document.title).toBe('first.example:8443/tenant')
  act(() => renameRepositoryConnection(first, 'Temporary name'))
  expect(document.title).toBe('Temporary name')
  act(() => {
    removeRepositoryConnection(first)
  })
  expect(document.title).toBe('first.example:8443/tenant')
})

it('updates only the active repository name when another tab changes connection metadata', () => {
  rememberRepositoryConnection(first)
  mount()
  const connections = [
    { repoUrl: first, name: 'Renamed in another tab', pinned: false },
    { repoUrl: second, name: 'Other tab repository', pinned: false },
  ]
  localStorage.setItem(repositoryConnectionsStorageKey, JSON.stringify({ version: 1, connections }))
  act(() => {
    window.dispatchEvent(new StorageEvent('storage', { key: repositoryConnectionsStorageKey }))
  })
  expect(document.title).toBe('Renamed in another tab')

  connections[1].name = 'Unrelated rename'
  localStorage.setItem(repositoryConnectionsStorageKey, JSON.stringify({ version: 1, connections }))
  act(() => {
    window.dispatchEvent(new StorageEvent('storage', { key: repositoryConnectionsStorageKey }))
  })
  expect(document.title).toBe('Renamed in another tab')
})

it('changes with the active repository context and restores the base title on leaving the repository', () => {
  rememberRepositoryConnection(first)
  renameRepositoryConnection(first, 'First repository')
  rememberRepositoryConnection(second)
  renameRepositoryConnection(second, 'Second repository')
  mount()
  expect(document.title).toBe('First repository')
  mount(second)
  expect(document.title).toBe('Second repository')
  act(() => {
    unmountComponentAtNode(element)
  })
  expect(document.title).toBe('sensenet')
})

it('keeps display names as literal title text', () => {
  rememberRepositoryConnection(first)
  renameRepositoryConnection(first, '<b>Customer & documents</b>')
  mount()
  expect(document.title).toBe('<b>Customer & documents</b>')
  expect(document.head.querySelector('b')).toBeNull()
})
