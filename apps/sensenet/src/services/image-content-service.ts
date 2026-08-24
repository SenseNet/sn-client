import { PathHelper } from '@sensenet/client-utils'
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

  const contentType = (content as ImageContent).Binary?.__mediaresource.content_type?.toLocaleLowerCase()
  if (contentType?.startsWith('image/')) {
    return true
  }

  if (content.Type === 'Image' || content.Type?.endsWith('Image')) {
    return true
  }

  return SUPPORTED_IMAGE_EXTENSIONS.has(getFileExtension(content.Name || content.Path || ''))
}

export const getImagesFromContents = (contents: GenericContent[]) => contents.filter(isImageContent)

/** Builds the authenticated fetch target for an image's Binary field. */
export const getImageContentUrl = (repositoryUrl: string, content: GenericContent) => {
  const binaryPath = (content as ImageContent).Binary?.__mediaresource.media_src || content.Path
  return PathHelper.joinPaths(repositoryUrl, binaryPath)
}
