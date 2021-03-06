import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { Forum } from '@material-ui/icons'
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

type ToggleCommentsClassKey = Partial<ReturnType<typeof useStyles>>

/**
 * Represents a comment toggler component
 */
export const ToggleCommentsWidget: React.FC<{ classes?: ToggleCommentsClassKey }> = (props) => {
  const classes = useStyles(props)
  const localization = useLocalization()
  const viewerState = useViewerState()
  return (
    <ToggleBase
      classes={classes}
      active={viewerState.showComments}
      title={localization.toggleComments}
      setValue={(v) => viewerState.updateState({ showComments: v })}>
      <Forum className={clsx(classes.icon, { [classes.iconActive]: viewerState.showComments })} />
    </ToggleBase>
  )
}
