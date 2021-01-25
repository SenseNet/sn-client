import { Highlight, Shapes } from '@sensenet/client-core'
import Button from '@material-ui/core/Button/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener/ClickAwayListener'
import yellow from '@material-ui/core/colors/yellow'
import Popper from '@material-ui/core/Popper/Popper'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import createStyles from '@material-ui/core/styles/createStyles'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Delete from '@material-ui/icons/Delete'
import React, { useState } from 'react'
import { useLocalization } from '../..'
import { useDocumentPermissions } from '../../hooks'

type Props = {
  shape: Highlight
  onDragStart: (ev: React.DragEvent<HTMLElement>) => void
  onResized: (ev: React.MouseEvent<HTMLElement>) => void
  dimensions: {
    top: string | number | (string & {}) | undefined
    left: string | number | (string & {}) | undefined
    width: string | number | (string & {}) | undefined
    height: string | number | (string & {}) | undefined
  }
  zoomRatio: number
  removeShape: (shapeType: keyof Shapes, guid: string) => void
  rotationDegree: number
}

const useStyles = makeStyles<
  Theme,
  Props & {
    permissions: {
      canEdit: boolean
      canHideRedaction: boolean
      canHideWatermark: boolean
    }
  }
>((theme: Theme) =>
  createStyles({
    root: {
      top: ({ dimensions }) => dimensions.top,
      left: ({ dimensions }) => dimensions.left,
      width: ({ dimensions }) => dimensions.width,
      height: ({ dimensions }) => dimensions.height,
      position: 'absolute',
      resize: ({ permissions, rotationDegree }) => (permissions.canEdit && rotationDegree === 0 ? 'both' : 'none'),
      overflow: 'auto',
      backgroundColor: yellow[600],
      opacity: 0.5,
    },
    button: {
      backgroundColor: theme.palette.error.light,
    },
  }),
)

/**
 * Return a styled highlight component
 * @param shape Shape attributes
 * @param permissions Permissions of the current user
 * @param dimensions Shape dimensions
 * @param zoomRatio Zoom ratio
 * @param onDragStart Function triggered on drag event
 * @param onResized Function triggered on resized event
 * @param removeShape Function triggered on delete
 * @returns styled highlight component
 */

export const ShapeHighlight: React.FC<Props> = (props) => {
  const permissions = useDocumentPermissions()
  const classes = useStyles({ ...props, permissions })
  const localization = useLocalization()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const id = open ? 'highlight-delete' : undefined

  const onRightClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  return (
    <>
      <div
        className={classes.root}
        tabIndex={0}
        draggable={permissions.canEdit}
        onDragStart={props.onDragStart}
        onMouseUp={props.onResized}
        onContextMenu={onRightClick}
      />
      <Popper id={id} open={open} anchorEl={anchorEl} placement="right-start">
        <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
          <Button
            variant="contained"
            className={classes.button}
            onMouseUp={() => props.removeShape('highlights', props.shape.guid)}
            startIcon={<Delete scale={props.zoomRatio} />}>
            {localization.delete}
          </Button>
        </ClickAwayListener>
      </Popper>
    </>
  )
}
