import IconButton from '@material-ui/core/IconButton'
import RotateLeft from '@material-ui/icons/RotateLeft'
import RotateRight from '@material-ui/icons/RotateRight'
import React, { useCallback } from 'react'
import { useLocalization, usePreviewImages } from '../../hooks'
import { ROTATION_AMOUNT, ROTATION_MODE } from '../page-widgets/RotatePage'
/**
 * Component that allows document rotation
 */
export const RotateDocumentWidget: React.FC<{ mode?: ROTATION_MODE }> = (props) => {
  const pages = usePreviewImages()
  const localization = useLocalization()

  const rotateDocumentLeft = useCallback(() => {
    pages.rotateImages(
      pages.imageData.map((p) => p.Index),
      -ROTATION_AMOUNT,
    )
  }, [pages])

  const rotateDocumentRight = useCallback(() => {
    pages.rotateImages(
      pages.imageData.map((p) => p.Index),
      ROTATION_AMOUNT,
    )
  }, [pages])

  const button = (direction: ROTATION_MODE) => {
    const isLeft = direction === ROTATION_MODE.anticlockwise
    return (
      <IconButton
        title={isLeft ? localization.rotateDocumentLeft : localization.rotateDocumentRight}
        onClick={isLeft ? () => rotateDocumentLeft() : () => rotateDocumentRight()}
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
      return button(props.mode)
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
