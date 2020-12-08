import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { VerticalSplit } from '@material-ui/icons'
import clsx from 'clsx'
import React from 'react'
import { useLocalization, useViewerState } from '../../hooks'
import { ToggleBase } from './toggle-base'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    iconButton: {},
    icon: {},
    iconActive: {
      fill: theme.palette.primary.main,
    },
  })
})

type ToggleThumbnailsClassKey = Partial<ReturnType<typeof useStyles>>

/**
 * Document widget component that toggles the thumbnails
 */
export const ToggleThumbnailsWidget: React.FC<{ classes?: ToggleThumbnailsClassKey }> = (props) => {
  const classes = useStyles(props)
  const localization = useLocalization()
  const viewerState = useViewerState()

  return (
    <ToggleBase
      classes={classes}
      title={localization.toggleThumbnails}
      isVisible={viewerState.showThumbnails}
      setValue={(v) => viewerState.updateState({ showThumbnails: v })}>
      <VerticalSplit className={clsx(classes.icon, { [classes.iconActive]: viewerState.showThumbnails })} />
    </ToggleBase>
  )
}
