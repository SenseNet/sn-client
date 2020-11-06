import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import AspectRatio from '@material-ui/icons/AspectRatio'
import Code from '@material-ui/icons/Code'
import Error from '@material-ui/icons/Error'

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
    viewerState.updateState({ zoomMode: newZoomMode })

    setIsZoomMenuOpened(false)
  }

  return (
    <div style={{ display: 'inline-block' }}>
      <IconButton onClick={openZoomMenu} title={localization.zoomMode} innerRef={zoomMenuAnchor}>
        {(() => {
          switch (viewerState.zoomMode) {
            case 'fitHeight':
              return <Code style={{ transform: 'rotate(90deg)' }} />
            case 'fitWidth':
              return <Code />
            case 'originalSize':
              return <AspectRatio />
            case 'custom':
              return <ZoomOutMap />
            default:
              return <Error />
          }
        })()}
      </IconButton>
      <Menu id="zoom-menu" anchorEl={zoomMenuAnchor.current} open={isZoomMenuOpened} onClose={() => closeZoomMenu()}>
        <MenuItem onClick={() => closeZoomMenu('custom')}>
          <ZoomOutMap /> &nbsp; {localization.zoomModeCustom}{' '}
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
      </Menu>
    </div>
  )
}
