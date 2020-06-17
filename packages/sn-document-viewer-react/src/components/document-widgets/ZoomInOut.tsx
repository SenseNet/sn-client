import IconButton from '@material-ui/core/IconButton'
import ZoomIn from '@material-ui/icons/ZoomIn'
import ZoomOut from '@material-ui/icons/ZoomOut'
import React, { useCallback } from 'react'
import { useLocalization, useViewerState } from '../../hooks'

/**
 * Document widget component for modifying the zoom mode / level
 */
export const ZoomInOutWidget: React.FC = () => {
  const localization = useLocalization()
  const viewerState = useViewerState()

  const zoomIn = useCallback(() => {
    viewerState.updateState({
      fitRelativeZoomLevel: viewerState.fitRelativeZoomLevel + 1,
    })
  }, [viewerState])

  const zoomOut = useCallback(() => {
    viewerState.updateState({
      fitRelativeZoomLevel: viewerState.fitRelativeZoomLevel - 1,
    })
  }, [viewerState])

  return (
    <div style={{ display: 'inline-block' }}>
      <IconButton color="inherit" onClick={zoomIn} title={localization.zoomIn}>
        <ZoomIn />
      </IconButton>
      <IconButton color="inherit" onClick={zoomOut} title={localization.zoomOut}>
        <ZoomOut />
      </IconButton>
    </div>
  )
}
