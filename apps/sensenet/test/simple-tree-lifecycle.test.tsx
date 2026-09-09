import React from 'react'
import { render as renderDom, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { ExpandItemsContext } from '../src/components/tree/Contexts/ExpandedItemsProvider'
import { SimpleTree } from '../src/components/tree/simpletree'

const mockRepo = { load: jest.fn() }
const mockLogger = { error: jest.fn() }
const mockLoading = jest.fn()
const mockExpand = jest.fn()
let mockContent: any
jest.mock('@sensenet/hooks-react', () => ({ useRepository: () => mockRepo, useLogger: () => mockLogger }))
jest.mock('@material-ui/lab/TreeView', () => ({
  __esModule: true,
  default: ({ children, selected }: any) => <div data-selected={selected}>{children}</div>,
}))
jest.mock('react-router', () => ({ useHistory: () => ({}), useLocation: () => ({ search: '' }) }))
jest.mock('../src/context', () => ({ ResponsivePersonalSettings: jest.requireActual('react').createContext({}) }))
jest.mock('../src/hooks', () => ({
  useLoadContent: () => ({ content: mockContent }),
  useSnRoute: () => ({}),
  useLocalization: () => ({
    contentViews: { view: 'View' },
    settings: { edit: 'Edit' },
    common: { loadingContent: 'Loading' },
  }),
}))
jest.mock('../src/services', () => ({ getUrlForContent: jest.fn() }))
jest.mock('../src/components/tree/Contexts/TreeLoadingProvider', () => ({
  useTreeLoading: () => ({ isTreeLoading: false, setIsTreeLoading: mockLoading }),
}))
jest.mock('../src/components/tree/FavoritesTree', () => ({ FavoritesTree: () => null }))
jest.mock('../src/components/tree/StyledTreeItem', () => ({
  StyledTreeItem: ({ contentvalue }: any) => <span>{contentvalue.Path}</span>,
}))
jest.mock('../src/components/context-menu/content-context-menu', () => ({ ContentContextMenu: () => null }))

const deferred = () => {
  let resolve!: (value: any) => void
  let reject!: (error: Error) => void
  const promise = new Promise<any>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}
const item = (Id: number, Path: string) => ({ d: { Id, Path } })
let container: HTMLDivElement
const render = async (path = '/Root') => {
  await act(async () => {
    renderDom(
      <ExpandItemsContext.Provider
        value={[new Set(), mockExpand, new Set(), jest.fn(), jest.fn(), jest.fn(), jest.fn()]}>
        <SimpleTree
          onItemClick={jest.fn()}
          onNavigate={jest.fn()}
          rootLoaded={false}
          parentPath={path}
          rootPath={path}
          activeItemPath={mockContent?.Path || path}
        />
      </ExpandItemsContext.Provider>,
      container,
    )
  })
}
beforeEach(() => {
  jest.clearAllMocks()
  mockContent = undefined
  container = document.createElement('div')
  document.body.appendChild(container)
})
afterEach(() => {
  act(() => {
    unmountComponentAtNode(container)
  })
  container.remove()
})

it('aborts a root request on unmount and ignores its late response', async () => {
  const pending = deferred()
  mockRepo.load.mockReturnValue(pending.promise)
  await render()
  const { signal } = mockRepo.load.mock.calls[0][0].requestInit
  act(() => {
    unmountComponentAtNode(container)
  })
  expect(signal.aborted).toBe(true)
  mockLoading.mockClear()
  await act(async () => {
    pending.resolve(item(1, '/Root'))
  })
  expect(mockRepo.load).toHaveBeenCalledTimes(1)
  expect(mockExpand).not.toHaveBeenCalled()
  expect(mockLoading).not.toHaveBeenCalled()
})

it('ignores late ancestor results after navigation and keeps the new selection', async () => {
  const pending = deferred()
  mockContent = { Id: 2, Path: '/Root/Old' }
  mockRepo.load
    .mockResolvedValueOnce(item(1, '/Root'))
    .mockReturnValueOnce(pending.promise)
    .mockResolvedValue(item(3, '/Root/New'))
  await render()
  const ancestorSignal = mockRepo.load.mock.calls[1][0].requestInit.signal
  mockContent = undefined
  await render('/Root/New')
  expect(ancestorSignal.aborted).toBe(true)
  expect(container.querySelector('[data-selected="3"]')).not.toBeNull()
  mockExpand.mockClear()
  mockLoading.mockClear()
  await act(async () => {
    pending.resolve(item(2, '/Root/Old'))
  })
  expect(container.querySelector('[data-selected="3"]')).not.toBeNull()
  expect(mockExpand).not.toHaveBeenCalled()
  expect(mockLoading).not.toHaveBeenCalled()
})

it('handles a real load failure and finishes loading', async () => {
  mockRepo.load.mockRejectedValue(new Error('Network failure'))
  await render()
  expect(mockLogger.error).toHaveBeenCalledTimes(1)
  expect(mockLoading).toHaveBeenLastCalledWith(false)
})

it('handles cancellation without logging an error', async () => {
  const pending = deferred()
  mockRepo.load.mockReturnValue(pending.promise)
  await render()
  act(() => {
    unmountComponentAtNode(container)
  })
  await act(async () => {
    pending.reject(new DOMException('Aborted', 'AbortError'))
  })
  expect(mockLogger.error).not.toHaveBeenCalled()
})
