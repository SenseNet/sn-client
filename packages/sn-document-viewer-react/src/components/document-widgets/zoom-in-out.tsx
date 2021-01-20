import IconButton from '@material-ui/core/IconButton'
import createStyles from '@material-ui/core/styles/createStyles'
import makeStyles from '@material-ui/core/styles/makeStyles'
import ZoomIn from '@material-ui/icons/ZoomIn'
import ZoomOut from '@material-ui/icons/ZoomOut'
import React, { useCallback } from 'react'
import { useLocalization, useViewerState } from '../../hooks'

const useStyles = makeStyles(() => {
  return createStyles({
    iconButton: {},
    icon: {},
  })
})

type ZoomInOutClassKey = Partial<ReturnType<typeof useStyles>>

/**
 * Document widget component for modifying the zoom mode / level
 */
export const ZoomInOutWidget: React.FC<{ classes?: ZoomInOutClassKey }> = (props) => {
  const classes = useStyles(props)
  const localization = useLocalization()
  const viewerState = useViewerState()

  const zoomIn = useCallback(() => {
    viewerState.updateState({
      zoomLevel: viewerState.zoomLevel + 1,
    })
  }, [viewerState])

  const zoomOut = useCallback(() => {
    viewerState.updateState({
      zoomLevel: viewerState.zoomLevel - 1,
    })
  }, [viewerState])

  return (
    <div style={{ display: 'inline-block' }}>
      <IconButton
        className={classes.iconButton}
        color="inherit"
        onClick={zoomIn}
        title={localization.zoomIn}
        disabled={viewerState.zoomLevel >= 13}>
        <ZoomIn className={classes.icon} />
      </IconButton>
      <IconButton
        className={classes.iconButton}
        color="inherit"
        onClick={zoomOut}
        title={localization.zoomOut}
        disabled={viewerState.zoomLevel <= -7}>
        <ZoomOut className={classes.icon} />
      </IconButton>
    </div>
  )
}
