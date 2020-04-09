import IconButton from '@material-ui/core/IconButton'
import RotateLeft from '@material-ui/icons/RotateLeft'
import RotateRight from '@material-ui/icons/RotateRight'
import React, { useCallback, useState } from 'react'
import { PreviewImageData } from '../../models'
import { Dimensions } from '../../services'
import { useLocalization, usePreviewImage } from '../../hooks'

/**
 * The amount of rotation in degrees
 */
export const ROTATION_AMOUNT = 90

/**
 * Defined the component's own properties
 */
export interface RotatePageProps {
  page: PreviewImageData
  viewPort: Dimensions
  zoomRatio: number
}

export const RotatePageWidget: React.FC<RotatePageProps> = (props) => {
  const localization = useLocalization()

  const [pageIndex] = useState(props.page.Index)
  const image = usePreviewImage(pageIndex)

  const rotatePageLeft = useCallback(() => {
    image.rotate(-ROTATION_AMOUNT)
  }, [image])

  const rotatePageRight = useCallback(() => {
    image.rotate(ROTATION_AMOUNT)
  }, [image])

  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 1,
        top: 0,
        right: 0,
        filter: 'drop-shadow(0 0 3px white) drop-shadow(0 0 5px white) drop-shadow(0 0 9px white)',
      }}>
      <IconButton onClick={rotatePageLeft} title={localization.rotatePageLeft}>
        <RotateLeft />
      </IconButton>

      <IconButton onClick={rotatePageRight} title={localization.rotatePageRight}>
        <RotateRight />
      </IconButton>
    </div>
  )
}
