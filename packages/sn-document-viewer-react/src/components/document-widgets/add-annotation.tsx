import { Theme } from '@material-ui/core/styles/createMuiTheme'
import createStyles from '@material-ui/core/styles/createStyles'
import makeStyles from '@material-ui/core/styles/makeStyles'
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
 * Document widget component to draw Annotation
 */
export const AddAnnotationWidget: React.FC<{ classes?: AddAnnnotationClassKey }> = (props) => {
  const classes = useStyles(props)
  const localization = useLocalization()
  const viewerState = useViewerState()
  const permissions = useDocumentPermissions()

  const pageRotation =
    viewerState.rotation?.find((rotation) => rotation.pageNum === viewerState.activePage)?.degree || 0

  return (
    <ToggleBase
      disabled={!permissions.canEdit || pageRotation !== 0}
      classes={classes}
      active={viewerState.activeShapePlacing === 'annotation'}
      title={localization.addAnnotation}
      setValue={(value) =>
        viewerState.updateState({ activeShapePlacing: value ? 'annotation' : 'none', isPlacingCommentMarker: false })
      }>
      <ChatSharp
        className={clsx(classes.icon, { [classes.iconActive]: viewerState.activeShapePlacing === 'annotation' })}
      />
    </ToggleBase>
  )
}
