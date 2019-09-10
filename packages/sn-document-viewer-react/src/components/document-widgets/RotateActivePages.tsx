import IconButton from '@material-ui/core/IconButton'
import RotateLeft from '@material-ui/icons/RotateLeft'
import RotateRight from '@material-ui/icons/RotateRight'

import React, { useCallback } from 'react'
import { useLocalization, usePreviewImages, useViewerState } from '../../hooks'
import { ROTATION_AMOUNT } from '../page-widgets/RotatePage'
/**
 * Component that allows active page rotation
 */
export const RotateActivePagesWidget: React.FC = () => {
  const localization = useLocalization()
  const viewerState = useViewerState()
  const images = usePreviewImages()

  const rotateDocumentLeft = useCallback(() => {
    images.rotateImages(viewerState.activePages, -ROTATION_AMOUNT)
  }, [images, viewerState.activePages])

  const rotateDocumentRight = useCallback(() => {
    images.rotateImages(viewerState.activePages, ROTATION_AMOUNT)
  }, [images, viewerState.activePages])

  /**
   * renders the component
   */
  return (
    <div style={{ display: 'inline-block' }}>
      <IconButton
        color="inherit"
        title={localization.rotateDocumentLeft}
        onClick={() => rotateDocumentLeft()}
        id="RotateActiveLeft">
        <RotateLeft />
      </IconButton>
      <IconButton
        color="inherit"
        title={localization.rotateDocumentRight}
        onClick={() => rotateDocumentRight()}
        id="RotateActiveRight">
        <RotateRight />
      </IconButton>
    </div>
  )
}
