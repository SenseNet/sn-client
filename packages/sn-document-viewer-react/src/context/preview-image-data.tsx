import React, { useCallback, useEffect, useState } from 'react'
import { PreviewImageData } from '../models/PreviewImageData'
import {
  useDocumentData,
  useDocumentPermissions,
  useDocumentViewerApi,
  useViewerSettings,
  useViewerState,
} from '../hooks'
import { applyShapeRotations, ImageUtil } from '../services'

export const PreviewImageDataContext = React.createContext<{
  imageData: PreviewImageData[]
  rotateImages: (indexes: number[], amount: number) => void
}>({ imageData: [], rotateImages: () => undefined })

export const PreviewImageDataContextProvider: React.FC = (props) => {
  const viewerSettings = useViewerSettings()
  const api = useDocumentViewerApi()
  const { documentData, updateDocumentData } = useDocumentData()
  const viewerState = useViewerState()
  const permissions = useDocumentPermissions()
  const [previewImages, setPreviewImages] = useState<PreviewImageData[]>([])

  useEffect(() => {
    const abortController = new AbortController()
    ;(async () => {
      try {
        setPreviewImages([])
        const images = await api.getExistingPreviewImages({
          document: documentData,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    api,
    documentData.idOrPath,
    documentData.hostName,
    viewerSettings.documentIdOrPath,
    viewerSettings.version,
    viewerState.showWatermark,
  ])

  const rotateImages = useCallback(
    (imageIndexes: number[], amount: number) => {
      if (!permissions.canEdit) {
        console.warn(`No permission to edit!`)
        return
      }
      const newImages = previewImages.map((img) => {
        const newImg = { ...img }
        if (imageIndexes.indexOf(newImg.Index) >= 0) {
          const newAngle =
            ImageUtil.normalizeDegrees(((newImg.Attributes && newImg.Attributes.degree) || 0) + (amount % 360)) % 360
          newImg.Attributes = {
            ...newImg.Attributes,
            degree: newAngle,
          }
        }

        updateDocumentData({
          shapes: {
            annotations: applyShapeRotations(documentData.shapes.annotations, amount, img),
            highlights: applyShapeRotations(documentData.shapes.highlights, amount, img),
            redactions: applyShapeRotations(documentData.shapes.redactions, amount, img),
          },
        })

        return newImg
      })
      setPreviewImages(newImages)
      viewerState.updateState({ hasChanges: true })
    },
    [documentData, updateDocumentData, permissions.canEdit, previewImages, viewerState],
  )

  return (
    <PreviewImageDataContext.Provider
      value={{
        imageData: previewImages,
        rotateImages,
      }}>
      {props.children}
    </PreviewImageDataContext.Provider>
  )
}
