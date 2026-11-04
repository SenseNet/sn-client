import { ActionModel, GenericContent } from '@sensenet/default-content-types'
import { createMemoryHistory } from 'history'
import React, { useState } from 'react'
import { render as renderDom, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { Route, Router } from 'react-router-dom'
import { useContextMenuActions } from '../src/components/context-menu/use-context-menu-actions'
import { ExpandItemsContext } from '../src/components/tree/Contexts/ExpandedItemsProvider'
import { SimpleTree } from '../src/components/tree/simpletree'
import { useTreeNavigation } from '../src/hooks/use-tree-navigation'

const mockRoot = { Id: 1, Name: 'Root', Path: '/Root', Type: 'SystemFolder', IsFolder: true } as GenericContent
const mockFolder = { Id: 2, Name: 'Content', Path: '/Root/Content', Type: 'Folder', IsFolder: true } as GenericContent
const mockFile = {
  Id: 3,
  Name: 'footer.json',
  Path: '/Root/Content/footer.json',
  Type: 'File',
  IsFile: true,
} as GenericContent
const mockRepo = { load: jest.fn() }
const mockLogger = { error: jest.fn() }
const mockSelection = { activeContent: { setValue: jest.fn() } }
const mockLoading = jest.fn()
const mockLoadChildren = jest.fn()
const mockSetActions = jest.fn()
let mockForbidden = false

jest.mock('@sensenet/hooks-react', () => ({
  useRepository: () => mockRepo,
  useLogger: () => mockLogger,
  useDownload: () => ({}),
  CurrentContentContext: jest.requireActual('react').createContext({ Path: '/Root' }),
}))
jest.mock('@material-ui/lab/TreeView', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
jest.mock('@material-ui/lab/TreeItem', () => ({
  __esModule: true,
  default: ({ children, label, onLabelClick, nodeId, 'data-path': path }: any) => (
    <div data-path={path}>
      <button data-test={`tree-item-${nodeId}`} onClick={onLabelClick}>
        {label}
      </button>
      {children}
    </div>
  ),
}))
jest.mock('../src/context', () => ({
  ResponsivePersonalSettings: jest.requireActual('react').createContext({
    content: { root: '/Root', browseType: 'explorer' },
    drawer: { items: [] },
  }),
}))
jest.mock('../src/hooks', () => ({
  ...jest.requireActual('../src/hooks/use-loadContent'),
  ...jest.requireActual('../src/hooks/use-query'),
  ...jest.requireActual('../src/hooks/use-sn-route'),
  useSelectionService: () => mockSelection,
  usePersonalSettings: () => ({ preferDisplayName: false, sortFoldersFirst: true }),
  useLocalization: () => ({
    contentViews: { view: 'View' },
    settings: { edit: 'Edit' },
    common: { loadingContent: 'Loading' },
  }),
}))
jest.mock('../src/hooks/use-selection-service', () => ({ useSelectionService: () => mockSelection }))
jest.mock('../src/services', () => ({
  ...jest.requireActual('../src/services/content-context-service'),
  ...jest.requireActual('../src/services/query-string-builder'),
}))
jest.mock('../src/components/tree/Contexts/TreeLoadingProvider', () => ({
  useTreeLoading: () => ({ isTreeLoading: false, setIsTreeLoading: mockLoading, enabledPath: '/Root' }),
}))
jest.mock('../src/components/tree/FavoritesTree', () => ({
  FavoritesTree: ({ editMode }: { editMode: boolean }) => (
    <div data-test="favorites-tree-mode" data-edit-mode={String(editMode)} />
  ),
}))
jest.mock('../src/components/context-menu/content-context-menu', () => ({ ContentContextMenu: () => null }))
jest.mock('../src/components/dialogs', () => ({ useDialog: () => ({}) }))
jest.mock('../src/components/Icon', () => ({ Icon: () => null }))

const Harness = ({ treeKey }: { treeKey: number }) => {
  const [editMode, setEditMode] = useState(false)
  const [expanded, setExpanded] = useState(new Set<string>())
  const { currentPath, onNavigate } = useTreeNavigation('/Root')
  const { runAction } = useContextMenuActions(mockFile, mockSetActions)
  return (
    <ExpandItemsContext.Provider
      value={[expanded, setExpanded, new Set(), jest.fn(), mockLoadChildren, jest.fn(), jest.fn()]}>
      <button data-test="context-edit" onClick={() => runAction('Edit')}>
        Context Edit
      </button>
      <button data-test="context-edit-binary" onClick={() => runAction('EditBinary')}>
        Context Full-screen edit
      </button>
      <SimpleTree
        key={treeKey}
        editMode={editMode}
        onEditModeChange={setEditMode}
        onItemClick={onNavigate}
        onNavigate={onNavigate}
        rootLoaded={true}
        parentPath="/Root"
        rootPath="/Root"
        activeItemPath={currentPath}
      />
    </ExpandItemsContext.Provider>
  )
}

describe('Tree navigation mode is independent of one-time editor actions', () => {
  let history: ReturnType<typeof createMemoryHistory>
  let container: HTMLDivElement
  const render = async (treeKey = 0) => {
    await act(async () => {
      renderDom(
        <Router history={history}>
          <Route path="/content/:browseType/:action?">
            <Harness treeKey={treeKey} />
          </Route>
        </Router>,
        container,
      )
    })
  }
  const click = async (testId: string) => {
    const button = container.querySelector<HTMLButtonElement>(`[data-test="${testId}"]`)
    expect(button).not.toBeNull()
    await act(async () => button!.click())
  }
  const expectMode = (edit: boolean) => {
    expect(container.querySelector('[data-test="tree-mode-edit"]')?.getAttribute('aria-pressed')).toBe(String(edit))
    expect(container.querySelector('[data-test="tree-mode-view"]')?.getAttribute('aria-pressed')).toBe(String(!edit))
    expect(container.querySelector('[data-test="favorites-tree-mode"]')?.getAttribute('data-edit-mode')).toBe(
      String(edit),
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockForbidden = false
    history = createMemoryHistory({ initialEntries: ['/content/explorer?path=%2FContent'] })
    container = document.createElement('div')
    document.body.appendChild(container)
    mockRepo.load.mockImplementation(async ({ idOrPath }: { idOrPath: string }) => {
      const content = [mockRoot, mockFolder, mockFile].find(({ Path }) => Path === idOrPath)
      if (!content) throw new Error(`Unexpected path: ${idOrPath}`)
      return { d: { ...content, Actions: [{ Name: 'Edit', Forbidden: mockForbidden }] as ActionModel[] } }
    })
    mockLoadChildren.mockImplementation(async (path: string) =>
      path === '/Root' ? [mockFolder] : path === '/Root/Content' ? [mockFile] : [],
    )
  })
  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  it.each([
    ['context-edit', 'edit'],
    ['context-edit-binary', 'edit-binary'],
  ])('keeps View selected after %s and opens the next tree folder as a grid', async (button, action) => {
    await render()
    await click(button)
    expect(history.location.pathname).toBe(`/content/explorer/${action}`)
    expectMode(false)
    await click('tree-item-2')
    expect(history.location.pathname).toBe('/content/explorer/')
    expect(new URLSearchParams(history.location.search).get('path')).toBe('/Content')
    expect(new URLSearchParams(history.location.search).has('content')).toBe(false)
    expectMode(false)
  })

  it.each(['edit', 'edit-binary', 'wopi-edit', 'new'])(
    'does not infer Edit mode from a direct %s URL',
    async (action) => {
      history = createMemoryHistory({
        initialEntries: [`/content/explorer/${action}?path=%2FContent&content=%2FContent%2Ffooter.json`],
      })
      await render()
      expectMode(false)
    },
  )

  it('preserves explicit Edit across one-time actions and tree remounts, and edits the next tree item', async () => {
    await render()
    await click('tree-mode-edit')
    expectMode(true)
    await click('context-edit-binary')
    expectMode(true)
    await render(1)
    expectMode(true)
    await click('tree-item-2')
    expect(history.location.pathname).toBe('/content/explorer/edit')
    expect(new URLSearchParams(history.location.search).get('content')).toBe('/Content')
    expectMode(true)
  })

  it('lets the already-selected View button leave a one-time editor', async () => {
    await render()
    await click('context-edit')
    expectMode(false)
    await click('tree-mode-view')
    expect(history.location.pathname).toBe('/content/explorer/browse')
    expect(new URLSearchParams(history.location.search).get('content')).toBe('/Content/footer.json')
    expectMode(false)
  })

  it('lets the Edit button explicitly enable tree editing while a one-time editor is already open', async () => {
    await render()
    await click('context-edit')
    await click('tree-mode-edit')
    expectMode(true)
    await click('tree-item-2')
    expect(new URLSearchParams(history.location.search).get('content')).toBe('/Content')
  })

  it('keeps the selected mode when editor blockers reject a transition', async () => {
    await render()
    const original = history.location
    let unblock = history.block(() => false)
    await click('tree-mode-edit')
    expect(history.location).toBe(original)
    expectMode(false)
    unblock()
    await click('tree-mode-edit')
    expectMode(true)
    unblock = history.block(() => false)
    await click('tree-mode-view')
    expectMode(true)
    unblock()
  })

  it('waits for asynchronous navigation confirmation before changing the mode', async () => {
    let confirm!: (allowed: boolean) => void
    history = createMemoryHistory({
      initialEntries: ['/content/explorer?path=%2FContent'],
      getUserConfirmation: (_message, callback) => {
        confirm = callback
      },
    })
    await render()
    const unblock = history.block('Unsaved changes')
    await click('tree-mode-edit')
    expectMode(false)
    await act(async () => confirm(false))
    expectMode(false)
    await click('tree-mode-edit')
    expectMode(false)
    await act(async () => confirm(true))
    expectMode(true)
    unblock()
  })

  it('restores explicit mode changes through browser Back and Forward', async () => {
    await render()
    await click('tree-mode-edit')
    await click('tree-mode-view')
    expectMode(false)
    await act(async () => history.goBack())
    expectMode(true)
    await act(async () => history.goForward())
    expectMode(false)
  })

  it('keeps the Edit mode button disabled when editing is forbidden', async () => {
    mockForbidden = true
    await render()
    expect(container.querySelector<HTMLButtonElement>('[data-test="tree-mode-edit"]')?.disabled).toBe(true)
    await click('tree-mode-edit')
    expectMode(false)
    expect(history.location.pathname).toBe('/content/explorer')
  })
})
