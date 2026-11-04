import { GenericContent } from '@sensenet/default-content-types'
import { CurrentChildrenContext } from '@sensenet/hooks-react'
import { useCallback, useContext } from 'react'
import { ResponsiveContext } from '../../context'
import { useGlobalStyles } from '../../globalStyles'
import { getImagesFromContents, isImageContent } from '../../services'
import { useDialog } from '../dialogs'

export const useImageGallery = () => {
  const currentChildren = useContext(CurrentChildrenContext)
  const device = useContext(ResponsiveContext)
  const globalClasses = useGlobalStyles()
  const { openDialog } = useDialog()

  const openImageGallery = useCallback(
    (initialContent?: GenericContent, contents: GenericContent[] = currentChildren) => {
      const images = getImagesFromContents(contents)

      if (initialContent && isImageContent(initialContent) && !images.some((item) => item.Id === initialContent.Id)) {
        images.unshift(initialContent)
      }

      if (!images.length) {
        return
      }

      openDialog({
        name: 'image-gallery',
        props: {
          contents: images,
          initialContentId: initialContent?.Id,
        },
        dialogProps: {
          fullScreen: device === 'mobile',
          maxWidth: 'lg',
          classes: { paper: globalClasses.imageGalleryDialog },
        },
      })
    },
    [currentChildren, device, globalClasses.imageGalleryDialog, openDialog],
  )

  return {
    images: getImagesFromContents(currentChildren),
    openImageGallery,
  }
}
