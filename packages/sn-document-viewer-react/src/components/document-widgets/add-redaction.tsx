import { createStyles, makeStyles, Theme } from '@material-ui/core'
import ChatBubbleSharp from '@material-ui/icons/ChatBubbleSharp'
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

type AddRedactionClassKey = Partial<ReturnType<typeof useStyles>>

/**
 * Document widget component to toggleing redaction
 */
export const AddRedactionWidget: React.FC<{ classes?: AddRedactionClassKey }> = (props) => {
  const classes = useStyles(props)
  const localization = useLocalization()
  const viewerState = useViewerState()
  const permissions = useDocumentPermissions()

  return (
    <ToggleBase
      disabled={!permissions.canEdit}
      classes={classes}
      isVisible={viewerState.isPlacingRedaction}
      title={localization.addRedaction}
      setValue={(v) => viewerState.updateState({ isPlacingRedaction: v })}>
      <ChatBubbleSharp className={clsx(classes.icon, { [classes.iconActive]: viewerState.isPlacingRedaction })} />
    </ToggleBase>
  )
}
