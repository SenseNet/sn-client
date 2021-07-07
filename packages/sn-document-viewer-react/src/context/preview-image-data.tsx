import { PreviewImageData } from '@sensenet/client-core'
import React, { createContext, Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { PreviewState } from '../enums'
import { useDocumentData, useDocumentViewerApi, useViewerSettings, useViewerState } from '../hooks'

export const PreviewImageDataContext = createContext<{
  imageData: PreviewImageData[]
  setImageData: Dispatch<SetStateAction<PreviewImageData[]>>
}>({ imageData: [], setImageData: () => ({} as any) })

export const PreviewImageDataContextProvider: FC = (props) => {
  const viewerSettings = useViewerSettings()
  const api = useDocumentViewerApi()
  const { documentData } = useDocumentData()
  const viewerState = useViewerState()
  const [previewImages, setPreviewImages] = useState<PreviewImageData[]>([])

  useEffect(() => {
    const documentDataWithoutShapes = {
      hostName: documentData.hostName,
      idOrPath: documentData.idOrPath,
      documentName: documentData.documentName,
      documentType: documentData.documentType,
      fileSizekB: documentData.fileSizekB,
      pageCount: documentData.pageCount,
      error: documentData.error,
    }

    if (documentData.pageCount <= PreviewState.Empty) {
      return
    }
    const abortController = new AbortController()
    ;(async () => {
      try {
        setPreviewImages([])
        const images = await api.getExistingPreviewImages({
          document: documentDataWithoutShapes,
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
  }, [
    api,
    documentData.documentName,
    documentData.documentType,
    documentData.error,
    documentData.fileSizekB,
    documentData.hostName,
    documentData.idOrPath,
    documentData.pageCount,
    viewerSettings.version,
    viewerState.showWatermark,
  ])

  return (
    <PreviewImageDataContext.Provider
      value={{
        imageData: previewImages,
        setImageData: setPreviewImages,
      }}>
      {props.children}
    </PreviewImageDataContext.Provider>
  )
}
