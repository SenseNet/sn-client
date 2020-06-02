import { sleepAsync } from '@sensenet/client-utils'
import { useCallback, useEffect, useState } from 'react'
import { useDocumentData, useDocumentViewerApi, usePreviewImages, useViewerSettings, useViewerState } from '.'

const POLLING_INTERVAL = 3000

export const usePreviewImage = (pageNo: number) => {
  const images = usePreviewImages()
  const api = useDocumentViewerApi()
  const { documentData } = useDocumentData()
  const viewerSettings = useViewerSettings()
  const viewerState = useViewerState()
  const [previewImage, setPreviewImage] = useState(images.imageData.find((i) => i.Index === pageNo))
  const { imageData, ...context } = { ...images }

  useEffect(() => {
    setPreviewImage(images.imageData.find((i) => i.Index === pageNo))
  }, [images.imageData, pageNo])

  useEffect(() => {
    const abortController = new AbortController()
    const getPreviewImageData = async () => {
      try {
        const previewImageData = await api.isPreviewAvailable({
          abortController,
          document: documentData,
          page: pageNo,
          showWatermark: viewerState.showWatermark,
          version: viewerSettings.version || '',
        })
        if (previewImageData?.PreviewAvailable) {
          setPreviewImage(previewImageData)
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

    if (previewImage && !previewImage.PreviewImageUrl) {
      getPreviewImageData()
    }
    return () => abortController.abort()
  }, [api, documentData, pageNo, previewImage, viewerSettings.version, viewerState.showWatermark])

  const rotate = useCallback((amount: number) => images.rotateImages([pageNo], amount), [images, pageNo])

  return {
    ...context,
    image: previewImage,
    rotate,
  }
}
