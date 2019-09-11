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
  updateImageData: (newData: PreviewImageData[]) => void
  rotateImages: (indexes: number[], amount: number) => void
}>({ imageData: [], updateImageData: () => undefined, rotateImages: () => undefined })

export const PreviewImageDataContextProvider: React.FC = props => {
  const viewerSettings = useViewerSettings()
  const api = useDocumentViewerApi()
  const document = useDocumentData()
  const viewerState = useViewerState()
  const permissions = useDocumentPermissions()
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

  const updateImageData = useCallback(
    (newImageData: PreviewImageData[]) => {
      setPreviewImages(newImageData)
      viewerState.updateState({ hasChanges: true })
    },
    [viewerState],
  )

  const rotateImages = useCallback(
    (imageIndexes: number[], amount: number) => {
      if (!permissions.canEdit) {
        console.warn(`No permission to edit!`)
        return
      }
      const newImages = previewImages.map(img => {
        const newImg = { ...img }
        if (imageIndexes.indexOf(newImg.Index) >= 0) {
          const newAngle =
            ImageUtil.normalizeDegrees(((newImg.Attributes && newImg.Attributes.degree) || 0) + (amount % 360)) % 360
          newImg.Attributes = {
            ...newImg.Attributes,
            degree: newAngle,
          }
        }

        document.updateDocumentData({
          shapes: {
            annotations: applyShapeRotations(document.shapes.annotations, amount, img),
            highlights: applyShapeRotations(document.shapes.highlights, amount, img),
            redactions: applyShapeRotations(document.shapes.redactions, amount, img),
          },
        })

        return newImg
      })
      setPreviewImages(newImages)
      viewerState.updateState({ hasChanges: true })
    },
    [document, permissions.canEdit, previewImages, viewerState],
  )

  return (
    <PreviewImageDataContext.Provider
      value={{
        imageData: previewImages,
        updateImageData,
        rotateImages,
      }}>
      {props.children}
    </PreviewImageDataContext.Provider>
  )
}
