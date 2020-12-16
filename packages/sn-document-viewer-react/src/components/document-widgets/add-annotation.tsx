import { createStyles, makeStyles, Theme } from '@material-ui/core'
import ChatSharp from '@material-ui/icons/ChatSharp'
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

type AddAnnnotationClassKey = Partial<ReturnType<typeof useStyles>>

/**
 * Document widget component to toggleing redaction
 */
export const AddAnnotationWidget: React.FC<{ classes?: AddAnnnotationClassKey }> = (props) => {
  const classes = useStyles(props)
  const localization = useLocalization()
  const viewerState = useViewerState()
  const permissions = useDocumentPermissions()

  return (
    <ToggleBase
      disabled={!permissions.canEdit}
      classes={classes}
      isVisible={viewerState.isPlacingAnnotation}
      title={localization.addAnnotation}
      setValue={(v) => viewerState.updateState({ isPlacingAnnotation: v })}>
      <ChatSharp className={clsx(classes.icon, { [classes.iconActive]: viewerState.isPlacingAnnotation })} />
    </ToggleBase>
  )
}
