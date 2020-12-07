import React, { useCallback } from 'react'
import { applyShapeRotations, ImageUtil, ROTATION_AMOUNT, ROTATION_MODE, RotationModel } from '../..'
import { useDocumentData, usePreviewImages, useViewerState } from '../../hooks'

export interface RotateWidgetProps {
  mode?: ROTATION_MODE
  renderButton: (direction: ROTATION_MODE, rotateDocument: (mode: string) => void) => JSX.Element
  pages: 'all' | 'active'
}

export const RotateWidget: React.FC<RotateWidgetProps> = (props) => {
  const viewerState = useViewerState()
  const previewImages = usePreviewImages()
  const { documentData, updateDocumentData } = useDocumentData()

  const rotateFunc = (newRotation: RotationModel[], direction: string, pageIndex: number) => {
    const existingObj = newRotation.find((rotation) => rotation.pageNum === pageIndex)
    if (newRotation.length > 0 && existingObj) {
      const prevValue = existingObj.degree || 0
      existingObj.degree = ImageUtil.normalizeDegrees(
        (prevValue + ((direction === 'left' ? -ROTATION_AMOUNT : ROTATION_AMOUNT) % 360)) % 360,
      )
    } else {
      newRotation.push({
        pageNum: pageIndex,
        degree: ImageUtil.normalizeDegrees(
          (0 + ((direction === 'left' ? -ROTATION_AMOUNT : ROTATION_AMOUNT) % 360)) % 360,
        ),
      })
    }
  }

  const rotateDocument = useCallback(
    (direction: string) => {
      const newRotation = viewerState.rotation ?? []

      if (props.pages === 'all') {
        previewImages.imageData.forEach((page) => {
          rotateFunc(newRotation, direction, page.Index)
        })
      } else {
        rotateFunc(newRotation, direction, viewerState.activePage)
      }

      viewerState.updateState({
        rotation: newRotation,
      })

      //update shapes as well
      const newImages = previewImages.imageData.map((img) => {
        updateDocumentData({
          shapes: {
            annotations: applyShapeRotations(
              documentData.shapes.annotations,
              direction === 'left' ? -ROTATION_AMOUNT : ROTATION_AMOUNT,
              img,
            ),
            highlights: applyShapeRotations(
              documentData.shapes.highlights,
              direction === 'left' ? -ROTATION_AMOUNT : ROTATION_AMOUNT,
              img,
            ),
            redactions: applyShapeRotations(
              documentData.shapes.redactions,
              direction === 'left' ? -ROTATION_AMOUNT : ROTATION_AMOUNT,
              img,
            ),
          },
        })

        return img
      })
      previewImages.setImageData(newImages)
    },
    [
      documentData.shapes.annotations,
      documentData.shapes.highlights,
      documentData.shapes.redactions,
      previewImages,
      props.pages,
      updateDocumentData,
      viewerState,
    ],
  )

  switch (props.mode) {
    case ROTATION_MODE.anticlockwise:
    case ROTATION_MODE.clockwise:
      return props.renderButton(props.mode, rotateDocument)
    default:
      return (
        <div style={{ display: 'inline-block' }}>
          {props.renderButton(ROTATION_MODE.anticlockwise, rotateDocument)}
          {props.renderButton(ROTATION_MODE.clockwise, rotateDocument)}
        </div>
      )
  }
}
