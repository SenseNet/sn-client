import { createStyles, makeStyles, Theme } from '@material-ui/core'
import ChatBubbleOutlineSharp from '@material-ui/icons/ChatBubbleOutlineSharp'
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

type AddRHightlightClassKey = Partial<ReturnType<typeof useStyles>>

/**
 * Document widget component to toggleing redaction
 */
export const AddHighlightWidget: React.FC<{ classes?: AddRHightlightClassKey }> = (props) => {
  const classes = useStyles(props)
  const localization = useLocalization()
  const viewerState = useViewerState()

  return (
    <ToggleBase
      classes={classes}
      isVisible={viewerState.isPlacingHighlight}
      title={localization.addHighlight}
      setValue={(v) => viewerState.updateState({ isPlacingHighlight: v })}>
      <ChatBubbleOutlineSharp
        className={clsx(
          classes.icon,
          { [classes.iconActive]: viewerState.isPlacingHighlight },
          'material-icons-two-tone',
        )}
      />
    </ToggleBase>
  )
}
