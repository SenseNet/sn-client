import { sleepAsync } from '@sensenet/client-utils'
import { useEffect } from 'react'
import { POLLING_INTERVAL } from '..'
import { useDocumentData, useDocumentViewerApi, usePreviewImages, useViewerSettings, useViewerState } from '.'

export const usePreviewImage = (pageNo: number) => {
  const images = usePreviewImages()
  const api = useDocumentViewerApi()
  const { documentData } = useDocumentData()
  const viewerSettings = useViewerSettings()
  const viewerState = useViewerState()
  const { imageData, ...context } = { ...images }

  useEffect(() => {
    const abortController = new AbortController()
    const getPreviewImageData = async () => {
      try {
        const previewImageData = await api.isPreviewAvailable({
          abortController,
          document: documentData,
          page: pageNo,
          showWatermark: viewerState.showWatermark,
          version: viewerSettings.version,
        })
        if (previewImageData?.PreviewAvailable) {
          if (previewImageData.PreviewImageUrl) {
            const newImages = [...images.imageData]
            const oldValueIndex = newImages.findIndex((image) => image.Index === pageNo)
            if (oldValueIndex !== -1) {
              newImages[oldValueIndex] = { ...previewImageData, Index: pageNo }
              context.setImageData(newImages)
            } else {
              context.setImageData([...newImages, { ...previewImageData, Index: pageNo }])
            }
          }
        } else {
          await sleepAsync(POLLING_INTERVAL)
          getPreviewImageData()
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          throw error
        }
      }
    }

    if (
      images.imageData.find((i) => i.Index === pageNo) &&
      !images.imageData.find((i) => i.Index === pageNo)?.PreviewImageUrl
    ) {
      getPreviewImageData()
    }
    return () => abortController.abort()
  }, [api, context, documentData, images.imageData, pageNo, viewerSettings.version, viewerState.showWatermark])

  return {
    ...context,
    image: images.imageData.find((i) => i.Index === pageNo),
  }
}
