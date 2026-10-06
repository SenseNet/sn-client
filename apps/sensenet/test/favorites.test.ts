import { Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import {
  addFavorite,
  ensureFavoritesRoot,
  loadFavoriteLink,
  loadFavoriteLinks,
  removeFavorite,
  resolveContentLinkTarget,
  toggleFavorite,
} from '../src/services/favorites'
import { FAVORITES_ROOT_PATH } from '../src/services/favorites-constants'

const target = {
  Id: 13,
  Path: '/Root/Content/Documents',
  Name: 'Documents',
  Type: 'Folder',
  IsFolder: true,
} as GenericContent
const root = { Id: 40, Path: FAVORITES_ROOT_PATH, Name: '(favorites)', Type: 'SystemFolder' } as GenericContent
const link = {
  Id: 41,
  Path: `${FAVORITES_ROOT_PATH}/My bookmark`,
  Name: 'My bookmark',
  Type: 'ContentLink',
  Link: target,
}
const missing = Object.assign(new Error('Not found'), { statusCode: 404 })
const fakeRepository = () => {
  const methods = {
    load: jest.fn().mockResolvedValue({ d: root }),
    loadCollection: jest.fn().mockResolvedValue({ d: { results: [] } }),
    post: jest.fn().mockResolvedValue({ d: link }),
    delete: jest.fn().mockResolvedValue({ d: { results: [link], errors: [] } }),
  }
  return { repository: methods as unknown as Repository, ...methods }
}

describe('Favorites repository operations', () => {
  it('treats a missing optional favorites folder as empty without creating it', async () => {
    const repo = fakeRepository()
    repo.loadCollection.mockRejectedValue(missing)
    await expect(loadFavoriteLinks(repo.repository)).resolves.toEqual([])
    await expect(loadFavoriteLink(repo.repository, target)).resolves.toBeUndefined()
    expect(repo.post).not.toHaveBeenCalled()
    expect(repo.delete).not.toHaveBeenCalled()
  })

  it('does not issue favorite-0 requests for unloaded content', async () => {
    const repo = fakeRepository()
    await expect(loadFavoriteLink(repo.repository, { Id: 0 })).resolves.toBeUndefined()
    await expect(addFavorite(repo.repository, { ...target, Id: 0 })).rejects.toThrow('before it has loaded')
    expect(repo.loadCollection).not.toHaveBeenCalled()
    expect(repo.post).not.toHaveBeenCalled()
  })

  it('finds existing bookmarks by target ID regardless of their name and includes SystemFolder children', async () => {
    const repo = fakeRepository()
    repo.loadCollection.mockResolvedValue({ d: { results: [link] } })
    await expect(addFavorite(repo.repository, target)).resolves.toEqual(link)
    expect(repo.loadCollection).toHaveBeenCalledWith(
      expect.objectContaining({
        path: FAVORITES_ROOT_PATH,
        oDataOptions: expect.objectContaining({
          query: '+InFolder:"/Root/Content/(favorites)" +Type:ContentLink +Link:13',
          enableautofilters: false,
          enablelifespanfilter: false,
        }),
      }),
    )
    expect(repo.loadCollection.mock.calls[0][0].oDataOptions.expand).toBeUndefined()
    expect(repo.post).not.toHaveBeenCalled()
  })

  it('keeps actual permission errors visible instead of interpreting them as missing bookmarks', async () => {
    const repo = fakeRepository()
    const denied = Object.assign(new Error('Access denied'), { statusCode: 403 })
    repo.loadCollection.mockRejectedValue(denied)
    await expect(loadFavoriteLink(repo.repository, target)).rejects.toBe(denied)
    await expect(addFavorite(repo.repository, target)).rejects.toBe(denied)
    expect(repo.post).not.toHaveBeenCalled()
  })

  it('forwards cancellation to a read and preserves AbortError', async () => {
    const repo = fakeRepository()
    const controller = new AbortController()
    const aborted = new DOMException('Canceled', 'AbortError')
    repo.loadCollection.mockRejectedValue(aborted)
    await expect(loadFavoriteLink(repo.repository, target, controller.signal)).rejects.toBe(aborted)
    expect(repo.loadCollection.mock.calls[0][0].requestInit.signal).toBe(controller.signal)
    expect(repo.post).not.toHaveBeenCalled()
  })

  it('creates the optional folder only for an add and writes the reference as an ID', async () => {
    const repo = fakeRepository()
    repo.load.mockRejectedValueOnce(missing)
    repo.post.mockResolvedValueOnce({ d: root }).mockResolvedValueOnce({ d: link })
    await expect(addFavorite(repo.repository, target)).resolves.toEqual(link)
    expect(repo.post).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        parentPath: '/Root/Content',
        contentType: 'SystemFolder',
        content: expect.objectContaining({ Name: '(favorites)' }),
      }),
    )
    expect(repo.post).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        parentPath: FAVORITES_ROOT_PATH,
        contentType: 'ContentLink',
        content: expect.objectContaining({ Name: 'favorite-13', Link: 13 }),
      }),
    )
  })

  it('coalesces concurrent adds and root initialization', async () => {
    const repo = fakeRepository()
    const [first, second] = await Promise.all([
      addFavorite(repo.repository, target),
      addFavorite(repo.repository, target),
    ])
    expect(first).toEqual(second)
    expect(repo.post).toHaveBeenCalledTimes(1)
    repo.load.mockClear()
    await Promise.all([ensureFavoritesRoot(repo.repository), ensureFavoritesRoot(repo.repository)])
    expect(repo.load).toHaveBeenCalledTimes(1)
  })

  it('recovers a concurrent bookmark creation after the server rejects a duplicate', async () => {
    const repo = fakeRepository()
    repo.loadCollection.mockResolvedValueOnce({ d: { results: [] } }).mockResolvedValueOnce({ d: { results: [link] } })
    repo.post.mockRejectedValue(Object.assign(new Error('Already exists'), { statusCode: 409 }))
    await expect(addFavorite(repo.repository, target)).resolves.toEqual(link)
    expect(repo.post).toHaveBeenCalledTimes(1)
  })

  it('reports the original write failure when no concurrent bookmark was created', async () => {
    const repo = fakeRepository()
    const denied = Object.assign(new Error('Cannot add ContentLink'), { statusCode: 403 })
    repo.post.mockRejectedValue(denied)
    await expect(addFavorite(repo.repository, target)).rejects.toBe(denied)
  })

  it('removes an existing manually named bookmark and detects DeleteBatch errors', async () => {
    const repo = fakeRepository()
    await removeFavorite(repo.repository, link as GenericContent)
    expect(repo.delete).toHaveBeenCalledWith({ idOrPath: link.Id, permanent: true })
    expect(repo.loadCollection).not.toHaveBeenCalled()
    repo.delete.mockResolvedValue({
      d: { results: [], errors: [{ content: link, error: { message: { value: 'Delete permission denied' } } }] },
    })
    await expect(removeFavorite(repo.repository, target, link)).rejects.toThrow('Delete permission denied')
  })

  it('coalesces rapid toggles so one click cannot be reversed by a duplicate pending request', async () => {
    const repo = fakeRepository()
    repo.loadCollection.mockResolvedValue({ d: { results: [link] } })
    await expect(
      Promise.all([toggleFavorite(repo.repository, target), toggleFavorite(repo.repository, target)]),
    ).resolves.toEqual([false, false])
    expect(repo.delete).toHaveBeenCalledTimes(1)
    expect(repo.post).not.toHaveBeenCalled()
  })

  it('resolves a deferred reference instead of navigating to its ContentLink proxy', async () => {
    const repo = fakeRepository()
    repo.load.mockResolvedValue({ d: link })
    const controller = new AbortController()
    const deferred = { ...link, Link: { __deferred: { uri: '/link' } } } as GenericContent
    await expect(resolveContentLinkTarget(repo.repository, deferred, controller.signal)).resolves.toEqual(target)
    expect(repo.load).toHaveBeenCalledWith(
      expect.objectContaining({ idOrPath: link.Id, requestInit: { signal: controller.signal } }),
    )
  })
})
