import { ODataFieldParameter, Repository } from '@sensenet/client-core'
import { ContentLink, GenericContent } from '@sensenet/default-content-types'
import {
  FAVORITE_LINK_NAME_PREFIX,
  FAVORITES_ROOT_DISPLAY_NAME,
  FAVORITES_ROOT_NAME,
  FAVORITES_ROOT_PARENT_PATH,
  FAVORITES_ROOT_PATH,
} from './favorites-constants'

type FavoriteContentLink = ContentLink & {
  Link?: GenericContent | number
}

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

const favoriteLinkSelect = ['Id', 'Path', 'Name', 'DisplayName', 'Type', 'Icon', 'ParentId', 'IsFolder', 'Link'] as any

const isNotFound = (error: any) => error?.statusCode === 404 || error?.response?.status === 404

export const isFavoriteRootPath = (path: string) =>
  path === FAVORITES_ROOT_PATH || path.startsWith(`${FAVORITES_ROOT_PATH}/`)

export const isContentLink = (content?: Partial<GenericContent>) => content?.Type === 'ContentLink'

export const getFavoriteLinkName = (content: Pick<GenericContent, 'Id'>) => `${FAVORITE_LINK_NAME_PREFIX}${content.Id}`

export const ensureFavoritesRoot = async (repository: Repository) => {
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
    const response = await repository.post<GenericContent>({
      parentPath: FAVORITES_ROOT_PARENT_PATH,
      contentType: 'Folder',
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

export const loadFavoriteLink = async (repository: Repository, content: Pick<GenericContent, 'Id'>) => {
  try {
    const response = await repository.load<FavoriteContentLink>({
      idOrPath: `${FAVORITES_ROOT_PATH}/${getFavoriteLinkName(content)}`,
      oDataOptions: {
        select: favoriteLinkSelect,
        expand: ['Link'] as any,
      },
    })
    return response.d
  } catch (error) {
    if (isNotFound(error)) {
      return undefined
    }
    throw error
  }
}

export const addFavorite = async (repository: Repository, content: GenericContent) => {
  await ensureFavoritesRoot(repository)

  const existingLink = await loadFavoriteLink(repository, content)
  if (existingLink) {
    return existingLink
  }

  const response = await repository.post<FavoriteContentLink>({
    parentPath: FAVORITES_ROOT_PATH,
    contentType: 'ContentLink',
    content: {
      Name: getFavoriteLinkName(content),
      DisplayName: content.DisplayName || content.Name,
      Link: content.Id,
    },
    oDataOptions: {
      select: favoriteLinkSelect,
      expand: ['Link'] as any,
    },
  })

  return response.d
}

export const removeFavorite = async (
  repository: Repository,
  contentOrFavoriteLink: GenericContent,
  favoriteLink?: FavoriteContentLink,
) => {
  const linkToDelete = favoriteLink ?? (await loadFavoriteLink(repository, contentOrFavoriteLink))

  if (!linkToDelete) {
    return
  }

  await repository.delete({
    idOrPath: linkToDelete.Id || linkToDelete.Path,
    permanent: true,
  })
}

export const toggleFavorite = async (repository: Repository, content: GenericContent) => {
  const existingLink = await loadFavoriteLink(repository, content)

  if (existingLink) {
    await removeFavorite(repository, content, existingLink)
    return false
  }

  await addFavorite(repository, content)
  return true
}

const isExpandedContentReference = (reference: unknown): reference is GenericContent =>
  typeof reference === 'object' &&
  reference !== null &&
  !('__deferred' in reference) &&
  ('Id' in reference || 'Path' in reference)

export const resolveContentLinkTarget = async (repository: Repository, content: GenericContent) => {
  if (!isContentLink(content)) {
    return content
  }

  const contentLink =
    'Link' in content && (content as FavoriteContentLink).Link
      ? (content as FavoriteContentLink)
      : (
          await repository.load<FavoriteContentLink>({
            idOrPath: content.Id || content.Path,
            oDataOptions: {
              select: favoriteLinkSelect,
              expand: ['Link'] as any,
            },
          })
        ).d

  const link = contentLink.Link

  if (typeof link === 'number') {
    return (await repository.load<GenericContent>({ idOrPath: link })).d
  }

  if (isExpandedContentReference(link)) {
    return link
  }

  return content
}
