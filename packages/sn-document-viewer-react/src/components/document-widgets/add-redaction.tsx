import { Theme } from '@material-ui/core/styles/createMuiTheme'
import createStyles from '@material-ui/core/styles/createStyles'
import makeStyles from '@material-ui/core/styles/makeStyles'
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
 * Document widget component to draw Redaction
 */
export const AddRedactionWidget: React.FC<{ classes?: AddRedactionClassKey }> = (props) => {
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
      active={viewerState.activeShapePlacing === 'redaction'}
      title={localization.addRedaction}
      setValue={(value) => viewerState.updateState({ activeShapePlacing: value ? 'redaction' : 'none' })}>
      <ChatBubbleSharp
        className={clsx(classes.icon, { [classes.iconActive]: viewerState.activeShapePlacing === 'redaction' })}
      />
    </ToggleBase>
  )
}
