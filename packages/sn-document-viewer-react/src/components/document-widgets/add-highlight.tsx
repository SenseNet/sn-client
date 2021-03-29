import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { ChatBubbleOutlineSharp } from '@material-ui/icons'
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
 * Document widget component to draw Highlight
 */
export const AddHighlightWidget: React.FC<{ classes?: AddRHightlightClassKey }> = (props) => {
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
      active={viewerState.activeShapePlacing === 'highlight'}
      title={localization.addHighlight}
      setValue={(value) =>
        viewerState.updateState({ activeShapePlacing: value ? 'highlight' : 'none', isPlacingCommentMarker: false })
      }>
      <ChatBubbleOutlineSharp
        className={clsx(classes.icon, { [classes.iconActive]: viewerState.activeShapePlacing === 'highlight' })}
      />
    </ToggleBase>
  )
}
