import { GenericContent } from '@sensenet/default-content-types'
import { CurrentContentContext } from '@sensenet/hooks-react'
import React from 'react'
import { render as renderDom, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { AddButton } from '../src/components/AddButton'
import { useExplorerFolderActions } from '../src/components/content/ContentInfo'

let mockPath = '/Root/Content/First'
const mockRepository = {
  getActions: jest.fn(),
  allowedChildTypes: { get: jest.fn() },
  schemas: {
    getSchemaByName: (name: string) => ({ ContentTypeName: name, HandlerName: name }),
  },
}
const mockLogger = { error: jest.fn() }
const mockPersonalSettings = { uploadHandlers: [] }
const mockIsWriteAvailable = () => false
jest.mock('@sensenet/hooks-react', () => ({
  CurrentContentContext: jest.requireActual('react').createContext({}),
  useRepository: () => mockRepository,
  useLogger: () => mockLogger,
  useWopi: () => ({ isWriteAvailable: mockIsWriteAvailable }),
}))
jest.mock('@material-ui/core', () => ({
  ...jest.requireActual('@material-ui/core'),
  Popover: ({ open, children }: any) => (open ? <div>{children}</div> : null),
}))
jest.mock('react-router-dom', () => ({ useHistory: () => ({}) }))
jest.mock('../src/hooks', () => ({
  useLoadContent: () => ({}),
  useSnRoute: () => ({ path: '/Root', match: { params: {} } }),
  useQuery: () => new URLSearchParams({ path: mockPath.slice('/Root'.length) }),
  usePersonalSettings: () => mockPersonalSettings,
  useLocalization: () => ({
    settings: { fullscreenEdit: 'Full-screen edit' },
    addButton: {
      addNew: 'Add new',
      upload: 'Upload',
      noItems: 'No types',
      errorGettingActions: 'Cannot load actions',
      errorGettingAllowedContentTypes: 'Cannot load types',
    },
    customActions: { oDataActionsDialog: { menuTitle: 'OData actions' } },
  }),
}))
jest.mock('../src/hooks/use-favorite-state', () => ({ useFavoriteState: () => ({ available: false }) }))
jest.mock('../src/services', () => ({ addFullscreenEditAction: (_: any, actions: any) => actions }))
jest.mock('../src/components/Icon', () => ({ Icon: () => null }))
jest.mock('../src/components/dialogs', () => ({ useDialog: () => ({ openDialog: jest.fn() }) }))
jest.mock('../src/components/context-menu/use-context-menu-actions', () => ({
  useContextMenuActions: () => ({ runAction: jest.fn() }),
}))
jest.mock('../src/components/tree/Contexts/ExpandedItemsProvider', () => ({
  ExpandItemsContext: jest.requireActual('react').createContext(undefined),
}))
jest.mock('../src/components/image-gallery', () => ({ useImageGallery: () => ({ images: [] }) }))

const types = (Name = 'File') => ({ d: { results: [{ Name }] } })
const deferred = () => {
  let resolve!: (value: ReturnType<typeof types>) => void
  let reject!: (error: Error) => void
  const promise = new Promise<ReturnType<typeof types>>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('Folder creation options during navigation', () => {
  let container: HTMLDivElement
  const Probe = () => {
    const { creationActions } = useExplorerFolderActions()
    return <div data-test="creation-options">{creationActions.map(({ label }) => label).join(',')}</div>
  }
  const render = async (path = '/Root/Content/First', useAddButton = false) => {
    mockPath = path
    const content = { Id: path.endsWith('First') ? 1 : 2, Path: path, Type: 'Folder' } as GenericContent
    await act(async () => {
      renderDom(
        <CurrentContentContext.Provider value={content}>
          {useAddButton ? <AddButton /> : <Probe />}
        </CurrentContentContext.Provider>,
        container,
      )
    })
  }
  const openAddMenu = async () => {
    const button = container.querySelector<HTMLButtonElement>('[data-test="add-button"]')
    expect(button?.disabled).toBe(false)
    await act(async () => button!.click())
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockRepository.getActions.mockReset().mockResolvedValue(types('Add'))
    mockRepository.allowedChildTypes.get.mockReset().mockResolvedValue(types())
    container = document.createElement('div')
    document.body.appendChild(container)
  })
  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  it('aborts previous folder actions and ignores their late failure', async () => {
    const pending = deferred()
    mockRepository.getActions.mockReturnValueOnce(pending.promise)
    await render()
    const { signal } = mockRepository.getActions.mock.calls[0][0].requestInit
    await render('/Root/Content/Second')
    expect(signal.aborted).toBe(true)
    await act(async () => pending.reject(new TypeError('Failed to fetch')))
    expect(mockLogger.error).not.toHaveBeenCalled()
    expect(mockRepository.allowedChildTypes.get).toHaveBeenCalledTimes(1)
    expect(mockRepository.allowedChildTypes.get).toHaveBeenCalledWith({
      idOrPath: '/Root/Content/Second',
      requestInit: { signal: expect.anything() },
    })
    expect(container.textContent).toBe('File')
  })

  it('cancels previous allowed types without replacing the new folder options', async () => {
    const pending = deferred()
    mockRepository.allowedChildTypes.get.mockReturnValueOnce(pending.promise).mockResolvedValueOnce(types('Folder'))
    await render()
    const { signal } = mockRepository.allowedChildTypes.get.mock.calls[0][0].requestInit
    await render('/Root/Content/Second')
    expect(signal.aborted).toBe(true)
    await act(async () => pending.resolve(types('OldType')))
    expect(container.textContent).toBe('Folder')
    expect(mockLogger.error).not.toHaveBeenCalled()
  })

  it('does not request types after an unmounted action request finishes', async () => {
    const pending = deferred()
    mockRepository.getActions.mockReturnValueOnce(pending.promise)
    await render()
    const { signal } = mockRepository.getActions.mock.calls[0][0].requestInit
    act(() => {
      unmountComponentAtNode(container)
    })
    expect(signal.aborted).toBe(true)
    await act(async () => pending.resolve(types('Add')))
    expect(mockRepository.allowedChildTypes.get).not.toHaveBeenCalled()
    expect(mockLogger.error).not.toHaveBeenCalled()
  })

  it('closes the Add menu on navigation without starting another hidden type request', async () => {
    const pending = deferred()
    mockRepository.allowedChildTypes.get.mockReturnValueOnce(pending.promise).mockResolvedValueOnce(types())
    await render('/Root/Content/First', true)
    expect(mockRepository.allowedChildTypes.get).not.toHaveBeenCalled()
    await openAddMenu()
    const { signal } = mockRepository.allowedChildTypes.get.mock.calls[0][0].requestInit
    await render('/Root/Content/Second', true)
    expect(signal.aborted).toBe(true)
    expect(mockRepository.allowedChildTypes.get).toHaveBeenCalledTimes(1)
    await act(async () => pending.reject(new TypeError('Failed to fetch')))
    expect(mockLogger.error).not.toHaveBeenCalled()
    expect(container.querySelector('[data-test="list-items"]')).toBeNull()
    await openAddMenu()
    expect(mockRepository.allowedChildTypes.get).toHaveBeenCalledTimes(2)
    expect(mockRepository.allowedChildTypes.get.mock.calls[1][0].idOrPath).toBe('/Root/Content/Second')
    expect(container.querySelector('[data-test="listitem-file"]')?.textContent).toBe('File')
  })
})
