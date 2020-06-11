import IconButton from '@material-ui/core/IconButton'
import RotateLeft from '@material-ui/icons/RotateLeft'
import RotateRight from '@material-ui/icons/RotateRight'
import React, { useCallback } from 'react'

import { useLocalization, usePreviewImages, useViewerState } from '../../hooks'
import { ROTATION_AMOUNT, ROTATION_MODE } from '../page-widgets/RotatePage'

/**
 * Component that allows active page rotation
 */
export const RotateActivePagesWidget: React.FC<{ mode: ROTATION_MODE }> = (props) => {
  const localization = useLocalization()
  const viewerState = useViewerState()
  const images = usePreviewImages()

  const rotateDocumentLeft = useCallback(() => {
    images.rotateImages(viewerState.activePages, -ROTATION_AMOUNT)
  }, [images, viewerState.activePages])

  const rotateDocumentRight = useCallback(() => {
    images.rotateImages(viewerState.activePages, ROTATION_AMOUNT)
  }, [images, viewerState.activePages])

  let buttons
  if (props.mode === ROTATION_MODE.anticlockwise) {
    buttons = (
      <IconButton
        color="inherit"
        title={localization.rotatePageLeft}
        onClick={() => rotateDocumentLeft()}
        id="RotateActiveLeft">
        <RotateLeft />
      </IconButton>
    )
  } else if (props.mode === ROTATION_MODE.clockwise) {
    buttons = (
      <IconButton
        color="inherit"
        title={localization.rotatePageRight}
        onClick={() => rotateDocumentRight()}
        id="RotateActiveRight">
        <RotateRight />
      </IconButton>
    )
  } else {
    buttons = (
      <>
        <IconButton
          color="inherit"
          title={localization.rotatePageLeft}
          onClick={() => rotateDocumentLeft()}
          id="RotateActiveLeft">
          <RotateLeft />
        </IconButton>
        <IconButton
          color="inherit"
          title={localization.rotatePageRight}
          onClick={() => rotateDocumentRight()}
          id="RotateActiveRight">
          <RotateRight />
        </IconButton>
      </>
    )
  }

  /**
   * renders the component
   */
  return <div style={{ display: 'inline-block' }}>{buttons}</div>
}
