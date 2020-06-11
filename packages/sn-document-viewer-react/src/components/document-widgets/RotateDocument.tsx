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

  let buttons
  if (props.mode === ROTATION_MODE.anticlockwise) {
    buttons = (
      <IconButton title={localization.rotateDocumentLeft} onClick={rotateDocumentLeft} id="RotateLeft">
        <RotateLeft style={{ border: '2px solid', borderRadius: '5px' }} />
      </IconButton>
    )
  } else if (props.mode === ROTATION_MODE.clockwise) {
    buttons = (
      <IconButton title={localization.rotateDocumentRight} onClick={rotateDocumentRight} id="RotateRight">
        <RotateRight style={{ border: '2px solid', borderRadius: '5px' }} />
      </IconButton>
    )
  } else {
    buttons = (
      <>
        <IconButton title={localization.rotateDocumentLeft} onClick={rotateDocumentLeft} id="RotateLeft">
          <RotateLeft style={{ border: '2px solid', borderRadius: '5px' }} />
        </IconButton>
        <IconButton title={localization.rotateDocumentRight} onClick={rotateDocumentRight} id="RotateRight">
          <RotateRight style={{ border: '2px solid', borderRadius: '5px' }} />
        </IconButton>
      </>
    )
  }

  return <div style={{ display: 'inline-block' }}>{buttons}</div>
}
