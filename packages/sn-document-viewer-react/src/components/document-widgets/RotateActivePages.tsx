import IconButton from '@material-ui/core/IconButton'
import RotateLeft from '@material-ui/icons/RotateLeft'
import RotateRight from '@material-ui/icons/RotateRight'
import React, { useCallback } from 'react'

import { useLocalization, usePreviewImages, useViewerState } from '../../hooks'
import { ROTATION_AMOUNT, ROTATION_MODE } from '../page-widgets/RotatePage'

/**
 * Component that allows active page rotation
 */
export const RotateActivePagesWidget: React.FC<{ mode?: ROTATION_MODE }> = (props) => {
  const localization = useLocalization()
  const viewerState = useViewerState()
  const images = usePreviewImages()

  const rotateDocumentLeft = useCallback(() => {
    images.rotateImages(viewerState.activePages, -ROTATION_AMOUNT)
  }, [images, viewerState.activePages])

  const rotateDocumentRight = useCallback(() => {
    images.rotateImages(viewerState.activePages, ROTATION_AMOUNT)
  }, [images, viewerState.activePages])

  const button = (direction: ROTATION_MODE) => {
    const isLeft = direction === ROTATION_MODE.anticlockwise
    return (
      <IconButton
        color="inherit"
        title={isLeft ? localization.rotatePageLeft : localization.rotateDocumentRight}
        onClick={() => (isLeft ? rotateDocumentLeft() : rotateDocumentRight())}
        id={isLeft ? 'RotateActiveLeft' : 'RotateActiveRigt'}>
        {isLeft ? <RotateLeft /> : <RotateRight />}
      </IconButton>
    )
  }

  /**
   * renders the component
   */
  switch (props.mode) {
    case ROTATION_MODE.anticlockwise:
      return <div style={{ display: 'inline-block' }}>{button(props.mode)}</div>
    case ROTATION_MODE.clockwise:
      return <div style={{ display: 'inline-block' }}>{button(props.mode)}</div>
    default:
      return (
        <div style={{ display: 'inline-block' }}>
          {button(ROTATION_MODE.anticlockwise)}
          {button(ROTATION_MODE.clockwise)}
        </div>
      )
  }
}
