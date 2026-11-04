import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import { render as renderDom, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { BreadcrumbSeparator } from '../src/components/Breadcrumbs'

const mockRepository = { loadCollection: jest.fn() }
jest.mock('@sensenet/hooks-react', () => ({ useRepository: () => mockRepository }))
jest.mock('@material-ui/core', () => ({
  ...jest.requireActual('@material-ui/core'),
  Menu: ({ open, children, onClose }: any) =>
    open ? (
      <div>
        <button data-test="close-menu" onClick={onClose} />
        {children}
      </div>
    ) : null,
}))
jest.mock('../src/hooks', () => ({
  useLocalization: () => ({
    contentViews: { folders: 'Folders', empty: 'Empty', loading: 'Loading', loadFailed: 'Load failed', retry: 'Retry' },
  }),
}))
jest.mock('../src/components/Icon', () => ({ Icon: () => null }))
jest.mock('../src/components/DropFileArea', () => ({ DropFileArea: ({ children }: any) => children }))
jest.mock('../src/components/context-menu/content-context-menu', () => ({ ContentContextMenu: () => null }))

const result = (Name = 'Child', Id = 2) => ({
  d: { results: [{ Id, Name, Path: `/Root/Content/${Name}`, IsFolder: true } as GenericContent] },
})
const deferred = () => {
  let resolve!: (value: ReturnType<typeof result>) => void
  let reject!: (error: Error) => void
  const promise = new Promise<ReturnType<typeof result>>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('Breadcrumb child menus', () => {
  let container: HTMLDivElement
  const navigate = jest.fn()
  const render = async (path = '/Root/Content') => {
    await act(async () => {
      renderDom(<BreadcrumbSeparator itemPath={path} onItemClick={navigate} />, container)
    })
  }
  const click = async (testId: string) => {
    const button = container.querySelector<HTMLButtonElement>(`[data-test="${testId}"]`)
    expect(button).not.toBeNull()
    await act(async () => button!.click())
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockRepository.loadCollection.mockReset().mockResolvedValue(result())
    container = document.createElement('div')
    document.body.appendChild(container)
  })
  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  it('loads only the clicked arrow, using a minimal immediate-child query', async () => {
    await render()
    expect(mockRepository.loadCollection).not.toHaveBeenCalled()
    await click('breadcrumb-separator')
    expect(mockRepository.loadCollection).toHaveBeenCalledTimes(1)
    expect(mockRepository.loadCollection).toHaveBeenCalledWith({
      path: '/Root',
      requestInit: { signal: expect.anything() },
      oDataOptions: {
        query: '+InFolder:"/Root/Content"',
        select: ['Id', 'Path', 'Name', 'DisplayName', 'Type', 'Icon', 'IsFolder', 'IsFile'],
        onlyselectList: true,
        inlinecount: 'none',
        orderby: 'Name',
        metadata: 'no',
      },
    })
    await click('breadcrumb-sibling-2')
    expect(navigate).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ content: { ...result().d.results[0] } }),
    )
    expect(container.querySelector('[data-test="breadcrumb-sibling-2"]')).toBeNull()
  })

  it('shows loading rather than an empty-folder message while the request is pending', async () => {
    const pending = deferred()
    mockRepository.loadCollection.mockReturnValue(pending.promise)
    await render()
    await click('breadcrumb-separator')
    expect(container.querySelector('[role="status"]')?.textContent).toBe('Loading')
    await act(async () => pending.resolve({ d: { results: [] } }))
    expect(container.querySelector('[role="status"]')?.textContent).toBe('Empty')
  })

  it('cancels a closed menu and ignores its late failure when reopened', async () => {
    const pending = deferred()
    mockRepository.loadCollection.mockReturnValueOnce(pending.promise).mockResolvedValueOnce(result('New', 3))
    await render()
    await click('breadcrumb-separator')
    const { signal } = mockRepository.loadCollection.mock.calls[0][0].requestInit
    await click('close-menu')
    expect(signal.aborted).toBe(true)
    await click('breadcrumb-separator')
    await act(async () => pending.reject(new TypeError('Failed to fetch')))
    expect(container.querySelector('[data-test="breadcrumb-sibling-error"]')).toBeNull()
    expect(container.querySelector('[data-test="breadcrumb-sibling-3"]')?.textContent).toBe('New')
  })

  it('closes a previous folder menu on navigation and never displays its late children', async () => {
    const pending = deferred()
    mockRepository.loadCollection.mockReturnValueOnce(pending.promise).mockResolvedValueOnce(result('New', 3))
    await render()
    await click('breadcrumb-separator')
    const { signal } = mockRepository.loadCollection.mock.calls[0][0].requestInit
    await render('/Root/New')
    expect(signal.aborted).toBe(true)
    expect(container.querySelector('[data-test="close-menu"]')).toBeNull()
    expect(mockRepository.loadCollection).toHaveBeenCalledTimes(1)
    await click('breadcrumb-separator')
    await act(async () => pending.resolve(result('Old', 4)))
    expect(container.querySelector('[data-test="breadcrumb-sibling-4"]')).toBeNull()
    expect(mockRepository.loadCollection.mock.calls[1][0].oDataOptions.query).toBe('+InFolder:"/Root/New"')
  })

  it('retries a failed child menu locally without rebuilding the explorer', async () => {
    mockRepository.loadCollection
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce(result())
    await render()
    await click('breadcrumb-separator')
    expect(container.querySelector('[data-test="breadcrumb-sibling-error"]')?.textContent).toBe('Load failed')
    await click('breadcrumb-sibling-retry')
    expect(mockRepository.loadCollection).toHaveBeenCalledTimes(2)
    expect(container.querySelector('[data-test="breadcrumb-sibling-error"]')).toBeNull()
    expect(container.querySelector('[data-test="breadcrumb-sibling-2"]')).not.toBeNull()
  })
})
