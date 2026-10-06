import { ODataFieldParameter, Repository } from '@sensenet/client-core'
import { ContentLink, GenericContent } from '@sensenet/default-content-types'
import {
  FAVORITE_LINK_NAME_PREFIX,
  FAVORITES_ROOT_DISPLAY_NAME,
  FAVORITES_ROOT_NAME,
  FAVORITES_ROOT_PARENT_PATH,
  FAVORITES_ROOT_PATH,
} from './favorites-constants'

export type FavoriteContentLink = ContentLink

const favoriteRootSelect: ODataFieldParameter<GenericContent> = [
  'Id',
  'Path',
  'Name',
  'DisplayName',
  'Type',
  'Icon',
  'ParentId',
  'IsFolder',
]

const favoriteLinkSelect: ODataFieldParameter<ContentLink> = [
  'Id',
  'Path',
  'Name',
  'DisplayName',
  'Type',
  'Icon',
  'ParentId',
  'IsFolder',
  'Link',
]
const expandedFavoriteLinkSelect = [
  ...favoriteLinkSelect.filter((field) => field !== 'Link'),
  ...['Id', 'Path', 'Name', 'DisplayName', 'Type', 'Icon', 'IsFolder', 'IsFile', 'Actions'].map(
    (field) => `Link/${field}`,
  ),
] as ODataFieldParameter<ContentLink>

const isNotFound = (error: any) => error?.statusCode === 404 || error?.response?.status === 404
export const isFavoriteRequestAborted = (error: unknown) => (error as { name?: string })?.name === 'AbortError'
export const getFavoriteErrorMessage = (error: any) =>
  error?.body?.error?.message?.value || error?.message?.value || error?.message || ''

const rootRequests = new WeakMap<Repository, Promise<GenericContent>>()
const addRequests = new WeakMap<Repository, Map<number, Promise<FavoriteContentLink>>>()
const toggleRequests = new WeakMap<Repository, Map<number, Promise<boolean>>>()
const validId = (id: number) => Number.isInteger(id) && id > 0

export const isFavoriteRootPath = (path = '') => {
  const normalized = path.replace(/\/+$/, '').toLowerCase()
  const root = FAVORITES_ROOT_PATH.toLowerCase()
  return normalized === root || normalized.startsWith(`${root}/`)
}

export const isContentLink = (content?: Partial<GenericContent>) => content?.Type === 'ContentLink'

export const getFavoriteLinkName = (content: Pick<GenericContent, 'Id'>) => `${FAVORITE_LINK_NAME_PREFIX}${content.Id}`

const createFavoritesRootIfMissing = async (repository: Repository) => {
  try {
    const response = await repository.load<GenericContent>({
      idOrPath: FAVORITES_ROOT_PATH,
      oDataOptions: { select: favoriteRootSelect },
    })
    return response.d
  } catch (error) {
    if (!isNotFound(error)) {
      throw error
    }
  }

  try {
    // A regular Folder inherits workspace restrictions that may exclude ContentLink.
    const response = await repository.post<GenericContent>({
      parentPath: FAVORITES_ROOT_PARENT_PATH,
      contentType: 'SystemFolder',
      content: {
        Name: FAVORITES_ROOT_NAME,
        DisplayName: FAVORITES_ROOT_DISPLAY_NAME,
      },
      oDataOptions: { select: favoriteRootSelect },
    })
    return response.d
  } catch (createError) {
    try {
      const response = await repository.load<GenericContent>({
        idOrPath: FAVORITES_ROOT_PATH,
        oDataOptions: { select: favoriteRootSelect },
      })
      return response.d
    } catch {
      throw createError
    }
  }
}

export const ensureFavoritesRoot = (repository: Repository) => {
  const pending = rootRequests.get(repository)
  if (pending) return pending
  const request = createFavoritesRootIfMissing(repository).finally(() => rootRequests.delete(repository))
  rootRequests.set(repository, request)
  return request
}

/** Missing optional containers and missing links are an empty collection, never a write. */
export const loadFavoriteLinks = async (repository: Repository, signal?: AbortSignal, targetId?: number) => {
  if (targetId !== undefined && !validId(targetId)) return []
  try {
    const response = await repository.loadCollection<FavoriteContentLink>({
      path: FAVORITES_ROOT_PATH,
      requestInit: { signal },
      oDataOptions: {
        select: targetId === undefined ? expandedFavoriteLinkSelect : favoriteLinkSelect,
        ...(targetId === undefined ? { expand: ['Link'] as ODataFieldParameter<ContentLink> } : {}),
        query: `+InFolder:"${FAVORITES_ROOT_PATH}" +Type:ContentLink${
          targetId === undefined ? '' : ` +Link:${targetId}`
        }`,
        orderby: [['DisplayName', 'asc']],
        // The existing repository stores bookmarks in a SystemFolder.
        enableautofilters: false,
        enablelifespanfilter: false,
        ...(targetId === undefined ? {} : { top: 1 }),
      },
    })
    return response.d.results
  } catch (error) {
    if (isNotFound(error)) return []
    throw error
  }
}

export const loadFavoriteLink = async (
  repository: Repository,
  content: Pick<GenericContent, 'Id'>,
  signal?: AbortSignal,
) => (await loadFavoriteLinks(repository, signal, content.Id))[0]

const createFavoriteIfMissing = async (repository: Repository, content: GenericContent) => {
  const existingLink = await loadFavoriteLink(repository, content)
  if (existingLink) return existingLink
  await ensureFavoritesRoot(repository)

  try {
    const response = await repository.post<FavoriteContentLink>({
      parentPath: FAVORITES_ROOT_PATH,
      contentType: 'ContentLink',
      content: {
        Name: getFavoriteLinkName(content),
        DisplayName: content.DisplayName || content.Name,
        Link: content.Id,
      },
      oDataOptions: { select: favoriteLinkSelect },
    })
    return response.d
  } catch (createError) {
    // Another tab may have created the same bookmark while this request was pending.
    try {
      const existing = await loadFavoriteLink(repository, content)
      if (existing) return existing
    } catch {
      /* Preserve the original failed write and its server details. */
    }
    throw createError
  }
}

export const addFavorite = (repository: Repository, content: GenericContent): Promise<FavoriteContentLink> => {
  if (!validId(content.Id)) return Promise.reject(new Error('Cannot favorite content before it has loaded.'))
  const requests = addRequests.get(repository) || new Map<number, Promise<FavoriteContentLink>>()
  addRequests.set(repository, requests)
  const pending = requests.get(content.Id)
  if (pending) return pending
  const request = createFavoriteIfMissing(repository, content).finally(() => requests.delete(content.Id))
  requests.set(content.Id, request)
  return request
}

export const removeFavorite = async (
  repository: Repository,
  contentOrFavoriteLink: GenericContent,
  favoriteLink?: FavoriteContentLink,
) => {
  const linkToDelete =
    favoriteLink ??
    (isContentLink(contentOrFavoriteLink) && isFavoriteRootPath(contentOrFavoriteLink.Path)
      ? contentOrFavoriteLink
      : await loadFavoriteLink(repository, contentOrFavoriteLink))

  if (!linkToDelete) {
    return
  }

  const response = await repository.delete({
    idOrPath: linkToDelete.Id || linkToDelete.Path,
    permanent: true,
  })
  const failure = response.d.errors?.[0]
  if (failure) {
    const error = new Error(getFavoriteErrorMessage(failure.error) || 'Could not remove favorite.')
    Object.assign(error, { body: { error: failure.error }, details: response.d.errors })
    throw error
  }
}

const toggleCurrentFavorite = async (repository: Repository, content: GenericContent) => {
  const existingLink = await loadFavoriteLink(repository, content)

  if (existingLink) {
    await removeFavorite(repository, content, existingLink)
    return false
  }

  await addFavorite(repository, content)
  return true
}

export const toggleFavorite = (repository: Repository, content: GenericContent): Promise<boolean> => {
  if (!validId(content.Id)) return Promise.reject(new Error('Cannot favorite content before it has loaded.'))
  const requests = toggleRequests.get(repository) || new Map<number, Promise<boolean>>()
  toggleRequests.set(repository, requests)
  const pending = requests.get(content.Id)
  if (pending) return pending
  const request = toggleCurrentFavorite(repository, content).finally(() => requests.delete(content.Id))
  requests.set(content.Id, request)
  return request
}

const isExpandedContentReference = (reference: unknown): reference is GenericContent =>
  typeof reference === 'object' &&
  reference !== null &&
  !('__deferred' in reference) &&
  ('Id' in reference || 'Path' in reference)

export const resolveContentLinkTarget = async (
  repository: Repository,
  content: GenericContent,
  signal?: AbortSignal,
) => {
  if (!isContentLink(content)) {
    return content
  }

  const reference = (content as FavoriteContentLink).Link
  const contentLink =
    typeof reference === 'number' || isExpandedContentReference(reference)
      ? (content as FavoriteContentLink)
      : (
          await repository.load<FavoriteContentLink>({
            idOrPath: content.Id || content.Path,
            requestInit: { signal },
            oDataOptions: {
              select: expandedFavoriteLinkSelect,
              expand: ['Link'],
            },
          })
        ).d

  const link = contentLink.Link

  if (typeof link === 'number') {
    return (await repository.load<GenericContent>({ idOrPath: link, requestInit: { signal } })).d
  }

  if (isExpandedContentReference(link)) {
    return link
  }

  return content
}
