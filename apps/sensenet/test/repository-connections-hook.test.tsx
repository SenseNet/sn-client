import React from 'react'
import { act, create, ReactTestRenderer } from 'react-test-renderer'
import { useRepositoryConnections } from '../src/hooks/use-repository-connections'
import {
  rememberRepositoryConnection,
  renameRepositoryConnection,
  repositoryConnectionsStorageKey,
} from '../src/services/repository-connections'

describe('remembered repository connection subscriptions', () => {
  let renderers: ReactTestRenderer[]
  let observed: Array<ReturnType<typeof useRepositoryConnections>>
  const Probe = ({ index }: { index: number }) => {
    observed[index] = useRepositoryConnections()
    return null
  }

  beforeEach(() => {
    localStorage.clear()
    renderers = []
    observed = []
  })

  afterEach(() => {
    act(() => renderers.forEach((renderer) => renderer.unmount()))
  })

  it('keeps mounted choosers synchronized after same-tab connection edits', () => {
    act(() => {
      renderers.push(create(<Probe index={0} />), create(<Probe index={1} />))
    })
    expect(observed.map((value) => value.connections)).toEqual([[], []])
    act(() => rememberRepositoryConnection('https://repository.example'))
    expect(observed[0].connections[0].repoUrl).toBe('https://repository.example')
    expect(observed[1].connections).toEqual(observed[0].connections)
    act(() => renameRepositoryConnection('https://repository.example', 'Documents'))
    expect(observed.map((value) => value.connections[0].name)).toEqual(['Documents', 'Documents'])
  })

  it('reloads changes made in another tab, ignores unrelated keys, and handles a storage clear', () => {
    act(() => {
      renderers.push(create(<Probe index={0} />))
    })
    const initialConnections = observed[0].connections
    const connections = [{ repoUrl: 'https://other-tab.example', pinned: true, name: 'Other tab' }]
    localStorage.setItem(repositoryConnectionsStorageKey, JSON.stringify({ version: 1, connections }))
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'unrelated-setting' }))
    })
    expect(observed[0].connections).toBe(initialConnections)
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: repositoryConnectionsStorageKey }))
    })
    expect(observed[0].connections).toEqual(connections)
    localStorage.clear()
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: null }))
    })
    expect(observed[0].connections).toEqual([])
  })
})
