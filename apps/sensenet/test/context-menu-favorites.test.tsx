import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import { render as renderDom, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { ContentContextMenu } from '../src/components/context-menu/content-context-menu'
import { useFavoriteState } from '../src/hooks/use-favorite-state'

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
  useLoadContent: () => ({}),
  useLocalization: () => ({
    settings: { fullscreenEdit: 'Edit' },
    customActions: { oDataActionsDialog: { menuTitle: 'OData actions' } },
    imageGallery: { openImage: 'View image' },
    addButton: { errorGettingAllowedContentTypes: 'Cannot load types' },
    common: { loadingContent: 'Loading' },
    contentViews: { addToFavorites: 'Add to favorites', removeFromFavorites: 'Remove from favorites' },
  }),
}))
jest.mock('../src/hooks/use-favorite-state', () => ({ useFavoriteState: jest.fn() }))
jest.mock('../src/services', () => ({
  addFullscreenEditAction: (_: unknown, actions: unknown) => actions,
  isImageContent: () => false,
}))
jest.mock('../src/components/Icon', () => ({ Icon: () => null }))
jest.mock('../src/components/image-gallery', () => ({ useImageGallery: () => ({ openImageGallery: jest.fn() }) }))
jest.mock('../src/components/context-menu/use-context-menu-actions', () => ({
  useContextMenuActions: () => ({ runAction: jest.fn() }),
}))
jest.mock('../src/components/context-menu/content-context-menu.css', () => ({}))

const item = (Id: number) => ({ Id, Name: `item-${Id}`, Path: `/Root/Content/item-${Id}` } as GenericContent)

describe('Favorites in the shared content context menu', () => {
  let element: HTMLDivElement
  const close = jest.fn()
  const toggle = jest.fn()
  const render = (content: GenericContent, isOpened = true) =>
    act(() => {
      renderDom(<ContentContextMenu content={content} isOpened={isOpened} onClose={close} />, element)
    })
  const button = () => element.querySelector<HTMLButtonElement>('[data-test="content-context-menu-favorites"]')!

  beforeEach(() => {
    jest.clearAllMocks()
    element = document.createElement('div')
    document.body.appendChild(element)
    toggle.mockResolvedValue(true)
    ;(useFavoriteState as jest.Mock).mockReturnValue({ available: true, isFavorite: false, isBusy: false, toggle })
  })
  afterEach(() => {
    act(() => {
      unmountComponentAtNode(element)
    })
    element.remove()
  })

  it('uses the clicked content as the favorite target and enables reads only for the open menu', () => {
    const clicked = item(17)
    render(clicked, false)
    expect(useFavoriteState).toHaveBeenLastCalledWith(clicked, false)
    expect(button()).toBeNull()
    render(clicked)
    expect(useFavoriteState).toHaveBeenLastCalledWith(clicked, true)
    expect(button().textContent).toBe('Add to favorites')
  })

  it('renders a closed CTD menu with its empty initial content before a type is selected', () => {
    ;(useFavoriteState as jest.Mock).mockReturnValue({ available: false, isFavorite: false, isBusy: false, toggle })
    render({} as GenericContent, false)
    expect(element.textContent).toBe('')
    expect(button()).toBeNull()
  })

  it('offers removal for an existing bookmark and disables its action while pending', () => {
    ;(useFavoriteState as jest.Mock).mockReturnValue({ available: true, isFavorite: true, isBusy: true, toggle })
    render(item(17))
    expect(button().textContent).toBe('Remove from favorites')
    expect(button().disabled).toBe(true)
    act(() => button().click())
    expect(toggle).not.toHaveBeenCalled()
  })

  it('waits for a successful save before closing the menu', async () => {
    let finish!: (value: boolean) => void
    toggle.mockReturnValueOnce(
      new Promise<boolean>((resolve) => {
        finish = resolve
      }),
    )
    render(item(17))
    act(() => button().click())
    expect(toggle).toHaveBeenCalledTimes(1)
    expect(close).not.toHaveBeenCalled()
    await act(async () => {
      finish(false)
      await Promise.resolve()
    })
    expect(close).toHaveBeenCalledTimes(1)
  })

  it('keeps a failed save menu open so the action can be retried', async () => {
    toggle.mockResolvedValueOnce(undefined)
    render(item(17))
    await act(async () => {
      button().click()
      await Promise.resolve()
    })
    expect(close).not.toHaveBeenCalled()
  })

  it('does not close another clicked item menu when the previous save finishes', async () => {
    let finish!: (value: boolean) => void
    toggle.mockReturnValueOnce(
      new Promise<boolean>((resolve) => {
        finish = resolve
      }),
    )
    render(item(17))
    act(() => button().click())
    render(item(18))
    await act(async () => {
      finish(true)
      await Promise.resolve()
    })
    expect(close).not.toHaveBeenCalled()
    expect(useFavoriteState).toHaveBeenLastCalledWith(item(18), true)
  })

  it('does not invoke an obsolete close callback after a card menu was unmounted', async () => {
    let finish!: (value: boolean) => void
    toggle.mockReturnValueOnce(
      new Promise<boolean>((resolve) => {
        finish = resolve
      }),
    )
    render(item(17))
    act(() => {
      button().click()
      unmountComponentAtNode(element)
    })
    await act(async () => {
      finish(true)
      await Promise.resolve()
    })
    expect(close).not.toHaveBeenCalled()
  })
})
