import { sleepAsync } from '@sensenet/client-utils'
import { useEffect, useMemo } from 'react'
import { POLLING_INTERVAL } from '..'
import { useDocumentData, useDocumentViewerApi, usePreviewImages, useViewerSettings, useViewerState } from '.'

export const usePreviewImage = (pageNo: number) => {
  const api = useDocumentViewerApi()
  const { documentData } = useDocumentData()
  const viewerSettings = useViewerSettings()
  const viewerState = useViewerState()
  const { imageData, setImageData } = usePreviewImages()

  const currentPageData = useMemo(() => imageData.find((i) => i.Index === pageNo), [imageData, pageNo])

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
            setImageData((previousValue) => {
              const newImages = [...previousValue]
              const oldValueIndex = newImages.findIndex((image) => image.Index === pageNo)
              if (oldValueIndex !== -1) {
                newImages[oldValueIndex] = { ...previewImageData, Index: pageNo }
                return newImages
              } else {
                newImages.push({ ...previewImageData, Index: pageNo })
                return newImages
              }
            })
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

    if (currentPageData && !currentPageData.PreviewImageUrl) {
      getPreviewImageData()
    }
    return () => abortController.abort()
  }, [api, currentPageData, documentData, pageNo, setImageData, viewerSettings.version, viewerState.showWatermark])

  return {
    context: setImageData,
    image: currentPageData,
  }
}
