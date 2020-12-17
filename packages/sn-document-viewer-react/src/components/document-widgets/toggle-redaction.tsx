import { createStyles, makeStyles, Theme } from '@material-ui/core'
import PictureInPicture from '@material-ui/icons/PictureInPicture'
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

type ToggleRedactionClassKey = Partial<ReturnType<typeof useStyles>>

/**
 * Document widget component to toggleing redaction
 */
export const ToggleRedactionWidget: React.FC<{ classes?: ToggleRedactionClassKey }> = (props) => {
  const classes = useStyles(props)
  const localization = useLocalization()
  const viewerState = useViewerState()
  const permissions = useDocumentPermissions()

  return (
    <ToggleBase
      disabled={!permissions.canHideRedaction}
      classes={classes}
      isVisible={viewerState.showRedaction}
      title={localization.toggleRedaction}
      setValue={(value) => viewerState.updateState({ showRedaction: value })}>
      <PictureInPicture className={clsx(classes.icon, { [classes.iconActive]: viewerState.showRedaction })} />
    </ToggleBase>
  )
}
