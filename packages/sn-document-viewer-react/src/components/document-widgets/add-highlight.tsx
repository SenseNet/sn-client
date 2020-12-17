import { createStyles, makeStyles, Theme } from '@material-ui/core'
import ChatBubbleOutlineSharp from '@material-ui/icons/ChatBubbleOutlineSharp'
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

type AddRHightlightClassKey = Partial<ReturnType<typeof useStyles>>

/**
 * Document widget component to draw Hihgligh
 */
export const AddHighlightWidget: React.FC<{ classes?: AddRHightlightClassKey }> = (props) => {
  const classes = useStyles(props)
  const localization = useLocalization()
  const viewerState = useViewerState()
  const permissions = useDocumentPermissions()

  return (
    <ToggleBase
      disabled={!permissions.canEdit}
      classes={classes}
      isVisible={viewerState.isPlacingHighlight}
      title={localization.addHighlight}
      setValue={(value) => viewerState.updateState({ isPlacingHighlight: value })}>
      <ChatBubbleOutlineSharp
        className={clsx(classes.icon, { [classes.iconActive]: viewerState.isPlacingHighlight })}
      />
    </ToggleBase>
  )
}
