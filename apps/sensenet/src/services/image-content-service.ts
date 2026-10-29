import { BinaryField, GenericContent } from '@sensenet/default-content-types'

type ImageContent = GenericContent & { Binary?: BinaryField }

const SUPPORTED_IMAGE_EXTENSIONS = new Set([
  'apng',
  'avif',
  'bmp',
  'gif',
  'ico',
  'jfif',
  'jpeg',
  'jpg',
  'png',
  'svg',
  'webp',
])

const getFileExtension = (fileName: string) => fileName.split('.').pop()?.toLocaleLowerCase() ?? ''

/** Returns whether the content can be displayed by the built-in image viewer. */
export const isImageContent = (content?: GenericContent | null) => {
  if (!content || content.IsFolder) {
    return false
  }

  const contentType = (content as ImageContent).Binary?.__mediaresource?.content_type?.toLocaleLowerCase()
  if (contentType?.startsWith('image/')) {
    return true
  }

  if (content.Type === 'Image' || content.Type?.endsWith('Image')) {
    return true
  }

  return SUPPORTED_IMAGE_EXTENSIONS.has(getFileExtension(content.Name || content.Path || ''))
}

export const getImagesFromContents = (contents: GenericContent[]) => contents.filter(isImageContent)

/** Builds a binary-handler URL without exposing repository credentials elsewhere. */
export const getRepositoryBinaryUrl = (repositoryUrl: string, idOrPath: number | string, version?: string) => {
  try {
    const source = new URL('binaryhandler.ashx', `${repositoryUrl.replace(/\/+$/, '')}/`)
    if (typeof idOrPath === 'number') {
      if (!Number.isSafeInteger(idOrPath) || idOrPath <= 0) return undefined
      source.searchParams.set('nodeid', String(idOrPath))
    } else {
      if (!idOrPath.startsWith('/Root/')) return undefined
      source.searchParams.set('nodepath', idOrPath)
    }
    source.searchParams.set('propertyname', 'Binary')
    if (version) source.searchParams.set('version', version)
    return source.href
  } catch {
    return undefined
  }
}

/** Builds the authenticated fetch target for an image's Binary field. */
export const getImageContentUrl = (repositoryUrl: string, content: GenericContent) => {
  try {
    const repositoryBase = new URL(`${repositoryUrl.replace(/\/+$/, '')}/`)
    const mediaSource = (content as ImageContent).Binary?.__mediaresource?.media_src
    if (mediaSource) {
      const source = new URL(mediaSource, repositoryBase)
      if (source.origin === repositoryBase.origin && !source.username && !source.password) {
        if (source.pathname.toLowerCase().startsWith('/root/')) {
          return getRepositoryBinaryUrl(
            repositoryUrl,
            content.Id || content.Path,
            source.searchParams.get('version') || (content.Version as string | undefined),
          )
        }
        return source.href
      }
    }

    // Collection projections often omit Binary. Static /Root/... image responses may
    // bypass repository CORS/auth middleware, so use the repository binary endpoint.
    return getRepositoryBinaryUrl(repositoryUrl, content.Id || content.Path, content.Version as string | undefined)
  } catch {
    return undefined
  }
}
