import { createStyles, makeStyles, Theme } from '@material-ui/core'
import BrandingWatermark from '@material-ui/icons/BrandingWatermark'
import clsx from 'clsx'
import React from 'react'
import { useDocumentPermissions, useLocalization, useViewerState } from '../../hooks'
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

type ToggleWatermarkClassKey = Partial<ReturnType<typeof useStyles>>

/**
 * Document widget component that toggles the displaying of the watermark
 */
export const ToggleWatermarkWidget: React.FC<{ classes?: ToggleWatermarkClassKey }> = (props) => {
  const classes = useStyles(props)
  const localization = useLocalization()
  const viewerState = useViewerState()
  const permissions = useDocumentPermissions()

  return (
    <ToggleBase
      disabled={!permissions.canHideWatermark}
      classes={classes}
      title={localization.toggleWatermark}
      isVisible={viewerState.showWatermark}
      setValue={(v) => viewerState.updateState({ showWatermark: v })}>
      <BrandingWatermark className={clsx(classes.icon, { [classes.iconActive]: viewerState.showWatermark })} />
    </ToggleBase>
  )
}
