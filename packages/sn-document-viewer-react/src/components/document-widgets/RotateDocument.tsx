import IconButton from '@material-ui/core/IconButton'
import RotateLeft from '@material-ui/icons/RotateLeft'
import RotateRight from '@material-ui/icons/RotateRight'
import React, { useCallback } from 'react'
import { applyShapeRotations, ImageUtil } from '../..'
import { useDocumentData, useLocalization, usePreviewImages, useViewerState } from '../../hooks'
import { ROTATION_AMOUNT, ROTATION_MODE } from '../../models/RotationModel'
/**
 * Component that allows document rotation
 */
export const RotateDocumentWidget: React.FC<{ mode?: ROTATION_MODE }> = (props) => {
  const localization = useLocalization()
  const viewerState = useViewerState()
  const previewImages = usePreviewImages()
  const { documentData, updateDocumentData } = useDocumentData()

  const rotateDocument = useCallback(
    (direction: string) => {
      const newRotation = viewerState.rotation ?? []
      previewImages.imageData.forEach((page) => {
        const existingObj = newRotation.find((rotation) => rotation.pageNum === page.Index)
        if (newRotation.length > 0 && existingObj) {
          const prevValue = existingObj.degree || 0
          existingObj.degree = ImageUtil.normalizeDegrees(
            (prevValue + ((direction === 'left' ? -ROTATION_AMOUNT : ROTATION_AMOUNT) % 360)) % 360,
          )
        } else {
          newRotation.push({
            pageNum: page.Index,
            degree: ImageUtil.normalizeDegrees(
              (0 + ((direction === 'left' ? -ROTATION_AMOUNT : ROTATION_AMOUNT) % 360)) % 360,
            ),
          })
        }
      })

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
      updateDocumentData,
      viewerState,
    ],
  )

  const button = (direction: ROTATION_MODE) => {
    const isLeft = direction === ROTATION_MODE.anticlockwise
    return (
      <IconButton
        title={isLeft ? localization.rotateDocumentLeft : localization.rotateDocumentRight}
        onClick={isLeft ? () => rotateDocument('left') : () => rotateDocument('right')}
        id={isLeft ? 'RotateLeft' : 'RotateRight'}>
        {isLeft ? (
          <RotateLeft style={{ border: '2px solid', borderRadius: '5px' }} />
        ) : (
          <RotateRight style={{ border: '2px solid', borderRadius: '5px' }} />
        )}
      </IconButton>
    )
  }

  switch (props.mode) {
    case ROTATION_MODE.anticlockwise:
    case ROTATION_MODE.clockwise:
      return button(props.mode)
    default:
      return (
        <div style={{ display: 'inline-block' }}>
          {button(ROTATION_MODE.anticlockwise)}
          {button(ROTATION_MODE.clockwise)}
        </div>
      )
  }
}
