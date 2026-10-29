import { GenericContent } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import React from 'react'
import { render as renderDom, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import Favorites from '../src/components/favorites/Favorites'
import { useFavoriteState } from '../src/hooks/use-favorite-state'
import { loadFavoriteLink, toggleFavorite } from '../src/services/favorites'

jest.mock('@sensenet/hooks-react', () => ({ useRepository: jest.fn(), useLogger: jest.fn() }))
jest.mock('../src/hooks', () => ({ useLocalization: () => ({ contentViews: { empty: 'No favorites yet' } }) }))
jest.mock('../src/components/content', () => ({ Content: () => null }))
jest.mock('../src/components/full-screen-loader', () => ({ FullScreenLoader: () => null }))
jest.mock('../src/services/favorites', () => ({
  ...jest.requireActual('../src/services/favorites'),
  loadFavoriteLink: jest.fn(),
  toggleFavorite: jest.fn(),
}))

const item = (Id: number) => ({ Id, Name: `item-${Id}`, Path: `/Root/Content/item-${Id}` } as GenericContent)
const bookmark = { Id: 100, Name: 'Bookmark', Path: '/Root/Content/(favorites)/Bookmark', Type: 'ContentLink' }
const deferred = <T,>() => {
  let resolve!: (value: T) => void
  let reject!: (error: unknown) => void
  const promise = new Promise<T>((done, fail) => {
    resolve = done
    reject = fail
  })
  return { promise, resolve, reject }
}

describe('Favorite state while navigating and saving', () => {
  let element: HTMLDivElement
  let state: ReturnType<typeof useFavoriteState>
  const logger = { warning: jest.fn(), error: jest.fn() }
  const Probe = ({ content, enabled }: { content: GenericContent; enabled?: boolean }) => {
    state = useFavoriteState(content, enabled)
    return null
  }
  const render = (content: GenericContent, enabled?: boolean) =>
    act(() => {
      renderDom(<Probe content={content} enabled={enabled} />, element)
    })

  beforeEach(() => {
    jest.clearAllMocks()
    element = document.createElement('div')
    document.body.appendChild(element)
    ;(useRepository as jest.Mock).mockReturnValue({})
    ;(useLogger as jest.Mock).mockReturnValue(logger)
    ;(loadFavoriteLink as jest.Mock).mockResolvedValue(undefined)
    ;(toggleFavorite as jest.Mock).mockResolvedValue(true)
  })
  afterEach(() => {
    act(() => {
      unmountComponentAtNode(element)
    })
    element.remove()
  })

  it('does not check or offer favorites before current content has loaded', () => {
    render(item(0))
    expect(state.available).toBe(false)
    expect(loadFavoriteLink).not.toHaveBeenCalled()
  })

  it('handles the CTD menu placeholder without an Id, then a loaded target and a cleared selection', async () => {
    const placeholder = {} as GenericContent
    render(placeholder, false)
    expect(state.available).toBe(false)
    expect(state.isBusy).toBe(false)
    expect(state.isFavorite).toBe(false)
    await act(async () => {
      await state.toggle()
    })
    expect(loadFavoriteLink).not.toHaveBeenCalled()
    expect(toggleFavorite).not.toHaveBeenCalled()
    ;(loadFavoriteLink as jest.Mock).mockResolvedValueOnce(bookmark)
    render(item(17), true)
    await act(async () => {
      await Promise.resolve()
    })
    expect(state.available).toBe(true)
    expect(state.isFavorite).toBe(true)
    render(placeholder, false)
    expect(state.available).toBe(false)
    expect(state.isFavorite).toBe(false)
    expect(loadFavoriteLink).toHaveBeenCalledTimes(1)
  })

  it('does not read or toggle closed row menus and refreshes favorite state each time a menu opens', async () => {
    render(item(1), false)
    await act(async () => {
      await state.toggle()
    })
    expect(loadFavoriteLink).not.toHaveBeenCalled()
    expect(toggleFavorite).not.toHaveBeenCalled()
    render(item(1), true)
    await act(async () => {
      await Promise.resolve()
    })
    expect(state.isFavorite).toBe(false)
    render(item(1), false)
    ;(loadFavoriteLink as jest.Mock).mockResolvedValueOnce(bookmark)
    render(item(1), true)
    await act(async () => {
      await Promise.resolve()
    })
    expect(loadFavoriteLink).toHaveBeenCalledTimes(2)
    expect(state.isFavorite).toBe(true)
  })

  it('cancels a closed menu read and ignores its late failure', async () => {
    const check = deferred<undefined>()
    ;(loadFavoriteLink as jest.Mock).mockReturnValueOnce(check.promise)
    render(item(1), true)
    const signal = (loadFavoriteLink as jest.Mock).mock.calls[0][2] as AbortSignal
    render(item(1), false)
    await act(async () => {
      check.reject(new Error('Late closed-menu failure'))
      await Promise.resolve()
    })
    expect(signal.aborted).toBe(true)
    expect(logger.warning).not.toHaveBeenCalled()
  })

  it('completes the clicked item save when its menu closes and reopens while pending', async () => {
    const write = deferred<boolean>()
    ;(toggleFavorite as jest.Mock).mockReturnValueOnce(write.promise)
    render(item(7), true)
    await act(async () => {
      await Promise.resolve()
    })
    let saving: Promise<boolean | undefined>
    act(() => {
      saving = state.toggle()
    })
    render(item(7), false)
    render(item(7), true)
    expect(state.isBusy).toBe(true)
    expect(loadFavoriteLink).toHaveBeenCalledTimes(1)
    await act(async () => {
      await state.toggle()
      write.resolve(true)
      await saving
    })
    expect(toggleFavorite).toHaveBeenCalledTimes(1)
    expect(toggleFavorite).toHaveBeenCalledWith(expect.anything(), item(7))
    expect(state.isFavorite).toBe(true)
    expect(state.isBusy).toBe(false)
  })

  it('reports a requested write failure after the menu closes', async () => {
    const write = deferred<boolean>()
    ;(toggleFavorite as jest.Mock).mockReturnValueOnce(write.promise)
    render(item(1), true)
    await act(async () => {
      await Promise.resolve()
    })
    let saving: Promise<boolean | undefined>
    act(() => {
      saving = state.toggle()
    })
    render(item(1), false)
    await act(async () => {
      write.reject(new Error('Favorites write denied'))
      await saving
    })
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Favorites write denied') }),
    )
    expect(state.isBusy).toBe(false)
  })

  it('reports a requested write failure even when closing a card menu unmounts the hook', async () => {
    const write = deferred<boolean>()
    ;(toggleFavorite as jest.Mock).mockReturnValueOnce(write.promise)
    render(item(1), true)
    await act(async () => {
      await Promise.resolve()
    })
    let saving: Promise<boolean | undefined>
    act(() => {
      saving = state.toggle()
      unmountComponentAtNode(element)
    })
    await act(async () => {
      write.reject(new Error('Closed card menu write denied'))
      await saving
    })
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Closed card menu write denied') }),
    )
  })

  it('opens the legacy empty Favorites page without creating its optional folder', async () => {
    const repository = {
      load: jest.fn().mockRejectedValue(Object.assign(new Error('Not found'), { statusCode: 404 })),
      post: jest.fn(),
    }
    ;(useRepository as jest.Mock).mockReturnValue(repository)
    await act(async () => {
      renderDom(<Favorites />, element)
      await Promise.resolve()
    })
    expect(element.textContent).toBe('No favorites yet')
    expect(repository.post).not.toHaveBeenCalled()
    expect(logger.error).not.toHaveBeenCalled()
  })

  it('aborts an old folder check and ignores its late failure after navigation', async () => {
    const old = deferred<undefined>()
    ;(loadFavoriteLink as jest.Mock).mockReturnValueOnce(old.promise).mockResolvedValueOnce(bookmark)
    render(item(1))
    const signal = (loadFavoriteLink as jest.Mock).mock.calls[0][2] as AbortSignal
    render(item(2))
    await act(async () => {
      old.reject(new Error('Late network failure'))
      await Promise.resolve()
    })
    expect(signal.aborted).toBe(true)
    expect(state.isFavorite).toBe(true)
    expect(state.isBusy).toBe(false)
    expect(logger.warning).not.toHaveBeenCalled()
  })

  it('prevents a late empty check from overwriting a completed add', async () => {
    const check = deferred<undefined>()
    ;(loadFavoriteLink as jest.Mock).mockReturnValueOnce(check.promise)
    render(item(1))
    expect(state.isBusy).toBe(true)
    await act(async () => {
      await state.toggle()
    })
    await act(async () => {
      check.resolve(undefined)
      await check.promise
    })
    expect(state.isFavorite).toBe(true)
    expect(state.isBusy).toBe(false)
    expect(toggleFavorite).toHaveBeenCalledTimes(1)
  })

  it('does not apply a completed old-folder write to the newly displayed folder', async () => {
    const write = deferred<boolean>()
    ;(toggleFavorite as jest.Mock).mockReturnValueOnce(write.promise)
    ;(loadFavoriteLink as jest.Mock).mockResolvedValue(bookmark)
    render(item(1))
    await act(async () => {
      await Promise.resolve()
    })
    let saving: Promise<boolean | undefined>
    act(() => {
      saving = state.toggle()
    })
    render(item(2))
    await act(async () => {
      write.resolve(false)
      await saving
    })
    expect(state.isFavorite).toBe(true)
    expect(state.isBusy).toBe(false)
  })

  it('does not restart checks when the same content is represented by a fresh object', async () => {
    render(item(1))
    await act(async () => {
      await Promise.resolve()
    })
    render({ ...item(1), DisplayName: 'Updated label' })
    expect(loadFavoriteLink).toHaveBeenCalledTimes(1)
  })

  it('prevents duplicate writes and reports a real backend failure without changing the star', async () => {
    const write = deferred<boolean>()
    ;(loadFavoriteLink as jest.Mock).mockResolvedValue(bookmark)
    ;(toggleFavorite as jest.Mock).mockReturnValueOnce(write.promise)
    render(item(1))
    await act(async () => {
      await Promise.resolve()
    })
    let saving: Promise<boolean | undefined>
    act(() => {
      saving = state.toggle()
      void state.toggle()
    })
    expect(toggleFavorite).toHaveBeenCalledTimes(1)
    await act(async () => {
      write.reject(new Error('Permission denied'))
      await saving
    })
    expect(state.isFavorite).toBe(true)
    expect(state.isBusy).toBe(false)
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Permission denied') }),
    )
  })
})
