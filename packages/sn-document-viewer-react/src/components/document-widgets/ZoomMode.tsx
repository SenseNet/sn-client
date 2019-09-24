import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MobileStepper from '@material-ui/core/MobileStepper'

import AspectRatio from '@material-ui/icons/AspectRatio'
import Code from '@material-ui/icons/Code'
import Error from '@material-ui/icons/Error'

import ZoomIn from '@material-ui/icons/ZoomIn'
import ZoomOut from '@material-ui/icons/ZoomOut'
import ZoomOutMap from '@material-ui/icons/ZoomOutMap'

import React, { useCallback, useRef, useState } from 'react'
import { useLocalization, useViewerState } from '../../hooks'
import { ZoomMode } from '../../models/viewer-state'

/**
 * Document widget component for modifying the zoom mode / level
 */
export const ZoomModeWidget: React.FC = () => {
  const localization = useLocalization()
  const viewerState = useViewerState()

  const zoomMenuAnchor = useRef()
  const [isZoomMenuOpened, setIsZoomMenuOpened] = useState(false)

  const openZoomMenu = useCallback(() => {
    setIsZoomMenuOpened(true)
  }, [])

  const closeZoomMenu = (newZoomMode?: ZoomMode) => {
    if (newZoomMode) {
      viewerState.updateState({ zoomMode: newZoomMode })
    }
    setIsZoomMenuOpened(false)
  }

  const zoomIn = useCallback(
    (ev: React.MouseEvent<HTMLElement>) => {
      ev.preventDefault()
      ev.stopPropagation()
      viewerState.updateState({ customZoomLevel: viewerState.customZoomLevel + 1 || 1 })
    },
    [viewerState],
  )

  const zoomOut = useCallback(
    (ev: React.MouseEvent<HTMLElement>) => {
      ev.preventDefault()
      ev.stopPropagation()
      viewerState.updateState({ customZoomLevel: viewerState.customZoomLevel + 1 || 0 })
    },
    [viewerState],
  )

  return (
    <div style={{ display: 'inline-block' }}>
      <IconButton onClick={openZoomMenu} title={localization.zoomMode} innerRef={zoomMenuAnchor}>
        {(() => {
          switch (viewerState.zoomMode) {
            case 'custom':
              if (viewerState.customZoomLevel > 0) {
                return <ZoomIn />
              }
              return <ZoomOut />
            case 'fitHeight':
              return <Code style={{ transform: 'rotate(90deg)' }} />
            case 'fitWidth':
              return <Code />
            case 'originalSize':
              return <AspectRatio />
            case 'fit':
              return <ZoomOutMap />
            default:
              return <Error />
          }
        })()}
      </IconButton>
      <Menu id="zoom-menu" anchorEl={zoomMenuAnchor.current} open={isZoomMenuOpened} onClose={() => closeZoomMenu()}>
        <MenuItem onClick={() => closeZoomMenu('fit')}>
          <ZoomOutMap /> &nbsp; {localization.zoomModeFit}{' '}
        </MenuItem>
        <MenuItem onClick={() => closeZoomMenu('originalSize')}>
          <AspectRatio />
          &nbsp; {localization.zoomModeOriginalSize}{' '}
        </MenuItem>
        <MenuItem onClick={() => closeZoomMenu('fitHeight')}>
          <Code style={{ transform: 'rotate(90deg)' }} /> &nbsp; {localization.zoomModeFitHeight}{' '}
        </MenuItem>
        <MenuItem onClick={() => closeZoomMenu('fitWidth')}>
          <Code /> &nbsp; {localization.zoomModeFitWidth}{' '}
        </MenuItem>
        <Divider light={true} />
        &nbsp; {localization.zooomModeCustom} <br />
        <MobileStepper
          variant="progress"
          steps={6}
          position="static"
          activeStep={viewerState.customZoomLevel}
          nextButton={
            <IconButton disabled={viewerState.customZoomLevel === 5} onClickCapture={zoomIn}>
              <ZoomIn />
            </IconButton>
          }
          backButton={
            <IconButton disabled={viewerState.customZoomLevel === 0} onClickCapture={zoomOut}>
              <ZoomOut />
            </IconButton>
          }
        />
      </Menu>
    </div>
  )
}
