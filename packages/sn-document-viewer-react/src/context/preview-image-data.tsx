import React, { useEffect, useState } from 'react'
import { PreviewImageData } from '../models/PreviewImageData'
import { useDocumentData, useDocumentViewerApi, useViewerSettings, useViewerState } from '../hooks'

export const PreviewImageDataContext = React.createContext<PreviewImageData[]>([])

export const PreviewImageDataContextProvider: React.FC = props => {
  const viewerSettings = useViewerSettings()
  const api = useDocumentViewerApi()
  const document = useDocumentData()
  const viewerState = useViewerState()
  const [previewImages, setPreviewImages] = useState<PreviewImageData[]>([])

  useEffect(() => {
    const abortController = new AbortController()
    ;(async () => {
      try {
        setPreviewImages([])
        const images = await api.getExistingPreviewImages({
          document,
          version: viewerSettings.version || '',
          showWatermark: viewerState.showWatermark,
          abortController,
        })
        setPreviewImages(images)
      } catch (error) {
        if (!abortController.signal.aborted) {
          throw error
        }
      }
    })()

    return () => abortController.abort()
  }, [api, document, viewerSettings.documentIdOrPath, viewerSettings.version, viewerState.showWatermark])

  return <PreviewImageDataContext.Provider value={previewImages}>{props.children}</PreviewImageDataContext.Provider>
}
