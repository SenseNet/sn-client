import { ActionModel, GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import { render as renderDom, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { ContentContextMenu } from '../src/components/context-menu/content-context-menu'
import { useContextMenuActions } from '../src/components/context-menu/use-context-menu-actions'
import { useLoadContent } from '../src/hooks'

jest.mock('@material-ui/core/Menu', () => ({
  __esModule: true,
  default: ({ open, children }: { open: boolean; children: React.ReactNode }) => (open ? <div>{children}</div> : null),
}))
jest.mock('@material-ui/core/styles', () => {
  const theme = {
    palette: { background: { paper: '#fff' }, text: { primary: '#111', secondary: '#555' }, action: { hover: '#eee' } },
  }
  return { useTheme: () => theme }
})
jest.mock('@sensenet/hooks-react', () => {
  const repository = {}
  const logger = { verbose: jest.fn(), error: jest.fn() }
  const isWriteAvailable = () => false
  return { useRepository: () => repository, useLogger: () => logger, useWopi: () => ({ isWriteAvailable }) }
})
jest.mock('../src/hooks', () => ({
  useLoadContent: jest.fn(),
  useLocalization: () => ({
    settings: { fullscreenEdit: 'Teljes képernyős szerkesztés' },
    customActions: { oDataActionsDialog: { menuTitle: 'OData actions' } },
    imageGallery: { openImage: 'View image' },
    addButton: { errorGettingAllowedContentTypes: 'Cannot load types' },
    common: { loadingContent: 'Loading' },
  }),
}))
jest.mock('../src/hooks/use-favorite-state', () => ({ useFavoriteState: () => ({ available: false }) }))
jest.mock('../src/services', () => ({
  ...jest.requireActual('../src/services/fullscreen-edit-service'),
  isImageContent: () => false,
}))
jest.mock('../src/components/Icon', () => ({ Icon: () => null }))
jest.mock('../src/components/image-gallery', () => ({ useImageGallery: () => ({ openImageGallery: jest.fn() }) }))
jest.mock('../src/components/context-menu/use-context-menu-actions', () => ({ useContextMenuActions: jest.fn() }))

const file = (Name: string, overrides: Partial<GenericContent> = {}) =>
  ({
    Id: 42,
    Name,
    Path: `/Root/Content/Documents/${Name}`,
    Type: 'File',
    IsFile: true,
    Actions: [{ Name: 'Browse' }, { Name: 'Edit' }] as ActionModel[],
    ...overrides,
  } as GenericContent)

describe('Full-screen editing in the shared file context menu', () => {
  let element: HTMLDivElement
  const close = jest.fn()
  const runAction = jest.fn()
  const render = (content: GenericContent) => {
    ;(useLoadContent as jest.Mock).mockReturnValue({ content })
    act(() => {
      renderDom(<ContentContextMenu content={content} isOpened={true} onClose={close} />, element)
    })
  }
  const fullscreenButton = () =>
    element.querySelector<HTMLButtonElement>('[data-test="content-context-menu-editbinary"]')

  beforeEach(() => {
    jest.clearAllMocks()
    element = document.createElement('div')
    document.body.appendChild(element)
    ;(useContextMenuActions as jest.Mock).mockReturnValue({ runAction })
  })
  afterEach(() => {
    act(() => {
      unmountComponentAtNode(element)
    })
    element.remove()
  })

  it.each(['data.csv', 'notes.txt', 'data.json', 'index.html', 'style.css', 'config.yaml', 'readme.md'])(
    'shows the localized action for %s and opens the existing full-screen editor',
    (name) => {
      render(file(name))
      expect(fullscreenButton()?.textContent).toBe('Teljes képernyős szerkesztés')
      act(() => fullscreenButton()!.click())
      expect(close).toHaveBeenCalledTimes(1)
      expect(runAction).toHaveBeenCalledWith('EditBinary')
    },
  )

  it.each(['image.png', 'document.pdf', 'table.xlsx', 'archive.zip'])(
    'hides an unsupported server-provided action for %s',
    (name) => {
      render(file(name, { Actions: [{ Name: 'Browse' }, { Name: 'EditBinary' }] as ActionModel[] }))
      expect(fullscreenButton()).toBeNull()
      expect(element.querySelector('[data-test="content-context-menu-browse"]')).not.toBeNull()
    },
  )

  it('hides the action for a text-named folder and for forbidden editing', () => {
    render(file('folder.txt', { IsFolder: true }))
    expect(fullscreenButton()).toBeNull()
    render(file('notes.txt', { Actions: [{ Name: 'Edit', Forbidden: true }] as ActionModel[] }))
    expect(fullscreenButton()).toBeNull()
  })
})
