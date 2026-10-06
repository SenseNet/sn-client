import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { CurrentAncestorsContext, CurrentAncestorsProvider } from '../src/context/current-ancestors'
import {
  CurrentChildrenContext,
  CurrentChildrenIsLoadingContext,
  CurrentChildrenProvider,
} from '../src/context/current-children'
import { CurrentContentContext, CurrentContentProvider } from '../src/context/current-content'
import { ErrorBoundary } from './mocks/error-boundry'

const mockRepository = {
  load: jest.fn(),
  loadCollection: jest.fn(),
  executeAction: jest.fn(),
  configuration: { repositoryUrl: '' },
}
const mockLogger = { error: jest.fn(), warning: jest.fn() }
const mockDeleted = new Set<(event: any) => void>()
const subscribe = () => ({ dispose: jest.fn() })
const mockEvents = {
  onContentModified: { subscribe },
  onContentCreated: { subscribe },
  onContentCopied: { subscribe },
  onContentMoved: { subscribe },
  onUploadFinished: { subscribe },
  onCustomActionExecuted: { subscribe },
  onContentDeleted: {
    subscribe: (callback: (event: any) => void) => {
      mockDeleted.add(callback)
      return { dispose: () => mockDeleted.delete(callback) }
    },
  },
}
jest.mock('../src/hooks', () => ({
  useRepository: () => mockRepository,
  useRepositoryEvents: () => mockEvents,
  useLogger: () => mockLogger,
}))
jest.mock('../src/hooks/use-localization', () => ({ useLocalization: () => ({ currentContextError: 'Load failed' }) }))

const folder = (Id: number, Path: string) =>
  ({ Id, Path, Name: Path.split('/').pop(), Type: 'Folder' } as GenericContent)
const deferred = () => {
  let resolve!: (value: any) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<any>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })
  return { promise, resolve, reject }
}

describe('Content load recovery', () => {
  let container: HTMLDivElement
  beforeEach(() => {
    jest.clearAllMocks()
    mockDeleted.clear()
    container = document.createElement('div')
    document.body.appendChild(container)
  })
  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })
  const renderContent = async (path: string, onError = jest.fn(), onContentLoaded = jest.fn()) => {
    await act(async () => {
      render(
        <CurrentContentProvider idOrPath={path} onError={onError} onContentLoaded={onContentLoaded}>
          <CurrentContentContext.Consumer>{(content) => content.Path}</CurrentContentContext.Consumer>
        </CurrentContentProvider>,
        container,
      )
    })
  }

  it('ignores a late successful content response even when the transport ignores abort', async () => {
    const oldRequest = deferred()
    const newRequest = deferred()
    const loaded = jest.fn()
    mockRepository.load.mockReturnValueOnce(oldRequest.promise).mockReturnValueOnce(newRequest.promise)
    await renderContent('/Root/Old', undefined, loaded)
    const oldSignal = mockRepository.load.mock.calls[0][0].requestInit.signal
    await renderContent('/Root/New', undefined, loaded)
    expect(oldSignal.aborted).toBe(true)
    await act(async () => newRequest.resolve({ d: folder(2, '/Root/New') }))
    await act(async () => oldRequest.resolve({ d: folder(1, '/Root/Old') }))
    expect(container.textContent).toBe('/Root/New')
    expect(loaded).toHaveBeenCalledTimes(1)
    expect(loaded).toHaveBeenCalledWith(expect.objectContaining({ Id: 2 }))
  })

  it('ignores a superseded rejection and recovers from a current content failure on folder change', async () => {
    const oldRequest = deferred()
    const failed = jest.fn()
    mockRepository.load.mockReturnValueOnce(oldRequest.promise).mockRejectedValueOnce(new TypeError('Failed to fetch'))
    await renderContent('/Root/Old', failed)
    await renderContent('/Root/Unavailable', failed)
    await act(async () => oldRequest.reject(new TypeError('Old request failed')))
    expect(failed).toHaveBeenCalledTimes(1)
    expect(failed).toHaveBeenCalledWith(expect.objectContaining({ message: 'Failed to fetch' }))
    mockRepository.load.mockResolvedValueOnce({ d: folder(3, '/Root/Available') })
    await renderContent('/Root/Available', failed)
    expect(container.textContent).toBe('/Root/Available')
    expect(mockLogger.error).not.toHaveBeenCalled()
  })

  it('handles a rejected delete-event parent load without an unhandled rejection', async () => {
    const failed = jest.fn()
    mockRepository.load.mockResolvedValueOnce({ d: folder(1, '/Root/Deleted') })
    await renderContent('/Root/Deleted', failed)
    mockRepository.load.mockRejectedValueOnce(new TypeError('Failed to fetch parent'))
    await act(async () => {
      mockDeleted.forEach((callback) => callback({ contentData: [folder(1, '/Root/Deleted')] }))
    })
    expect(failed).toHaveBeenCalledWith(expect.objectContaining({ message: 'Failed to fetch parent' }))
  })

  it('keeps consumers mounted after a handled child load failure and loads the next folder', async () => {
    const failed = jest.fn()
    const renderChildren = async (content: GenericContent) => {
      await act(async () => {
        render(
          <CurrentContentContext.Provider value={content}>
            <CurrentChildrenProvider onError={failed}>
              <CurrentChildrenIsLoadingContext.Consumer>
                {(loading) => String(loading)}
              </CurrentChildrenIsLoadingContext.Consumer>
              <CurrentChildrenContext.Consumer>
                {(children) => children.map((item) => item.Path).join(',')}
              </CurrentChildrenContext.Consumer>
            </CurrentChildrenProvider>
          </CurrentContentContext.Provider>,
          container,
        )
      })
    }
    mockRepository.loadCollection.mockRejectedValueOnce(new TypeError('Failed to fetch children'))
    await renderChildren(folder(1, '/Root/Unavailable'))
    expect(failed).toHaveBeenCalledTimes(1)
    expect(container.textContent).toBe('false')
    mockRepository.loadCollection.mockResolvedValueOnce({ d: { results: [folder(3, '/Root/Available/Child')] } })
    await renderChildren(folder(2, '/Root/Available'))
    expect(container.textContent).toBe('false/Root/Available/Child')
  })

  it('ignores stale ancestors without delaying the new folder behind an unfinished request', async () => {
    const oldRequest = deferred()
    const newRequest = deferred()
    mockRepository.executeAction.mockReturnValueOnce(oldRequest.promise).mockReturnValueOnce(newRequest.promise)
    const renderAncestors = async (content: GenericContent) => {
      await act(async () => {
        render(
          <CurrentContentContext.Provider value={content}>
            <CurrentAncestorsProvider>
              <CurrentAncestorsContext.Consumer>
                {(ancestors) => ancestors.map((item) => item.Path).join(',')}
              </CurrentAncestorsContext.Consumer>
            </CurrentAncestorsProvider>
          </CurrentContentContext.Provider>,
          container,
        )
      })
    }
    await renderAncestors(folder(1, '/Root/Old/Child'))
    await renderAncestors(folder(2, '/Root/New/Child'))
    expect(mockRepository.executeAction).toHaveBeenCalledTimes(2)
    await act(async () => newRequest.resolve({ d: { results: [folder(4, '/Root/New')] } }))
    await act(async () => oldRequest.resolve({ d: { results: [folder(3, '/Root/Old')] } }))
    expect(container.textContent).toBe('/Root/New')
  })

  it('preserves the existing error-boundary behavior when no child error handler is supplied', async () => {
    const caught = jest.fn()
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    try {
      mockRepository.loadCollection.mockRejectedValueOnce(new TypeError('Unhandled load failure'))
      await act(async () => {
        render(
          <ErrorBoundary spy={caught}>
            <CurrentContentContext.Provider value={folder(1, '/Root/Unavailable')}>
              <CurrentChildrenProvider />
            </CurrentContentContext.Provider>
          </ErrorBoundary>,
          container,
        )
      })
      expect(caught).toHaveBeenCalledWith('Unhandled load failure')
    } finally {
      consoleError.mockRestore()
    }
  })
})
