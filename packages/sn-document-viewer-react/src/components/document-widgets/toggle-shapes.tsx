import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { Dashboard } from '@material-ui/icons'
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

type ToggleShapesClassKey = Partial<ReturnType<typeof useStyles>>

/**
 * Document widget component that toggles the displaying of the shapes
 */
export const ToggleShapesWidget: React.FC<{ classes?: ToggleShapesClassKey }> = (props) => {
  const classes = useStyles(props)
  const localization = useLocalization()
  const viewerState = useViewerState()
  const permissions = useDocumentPermissions()

  return (
    <ToggleBase
      disabled={!permissions.canEdit}
      classes={classes}
      active={viewerState.showShapes}
      title={localization.toggleShapes}
      setValue={(v) => viewerState.updateState({ showShapes: v })}>
      <Dashboard className={clsx(classes.icon, { [classes.iconActive]: viewerState.showShapes })} />
    </ToggleBase>
  )
}
