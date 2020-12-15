import { Highlight, Shapes } from '@sensenet/client-core'
import { Button, ClickAwayListener, createStyles, makeStyles, Popper, Theme } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import React, { useState } from 'react'

type Props = {
  shape: Highlight
  onDragStart: (ev: React.DragEvent<HTMLElement>) => void
  onResized: (ev: React.MouseEvent<HTMLElement>) => void
  permissions: {
    canEdit: boolean
    canHideRedaction: boolean
    canHideWatermark: boolean
  }
  dimensions: {
    top: string | number | (string & {}) | undefined
    left: string | number | (string & {}) | undefined
    width: string | number | (string & {}) | undefined
    height: string | number | (string & {}) | undefined
  }
  zoomRatio: number
  removeShape: (shapeType: keyof Shapes, guid: string) => void
}

const useStyles = makeStyles<Theme, Props>((theme: Theme) =>
  createStyles({
    root: {
      top: ({ dimensions }) => dimensions.top,
      left: ({ dimensions }) => dimensions.left,
      width: ({ dimensions }) => dimensions.width,
      height: ({ dimensions }) => dimensions.height,
      position: 'absolute',
      resize: ({ permissions }) => (permissions.canEdit ? 'both' : 'none'),
      overflow: 'auto',
      backgroundColor: 'yellow',
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
 * @param onDragStart Function triggered on drag event
 * @param permissions Permissions of the current user
 * @param dimensions Shape dimensions
 * @param onResized Function triggered on resized event
 * @param getShapeDimensions Function returns with shape dimensions
 * @returns styled highlight component
 */
export function ShapeHighlight({
  shape,
  onDragStart,
  onResized,
  permissions,
  dimensions,
  zoomRatio,
  removeShape,
}: Props) {
  const classes = useStyles({ shape, onDragStart, onResized, permissions, dimensions, zoomRatio, removeShape })
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
        onDragStart={onDragStart}
        onMouseUp={onResized}
        onContextMenu={onRightClick}
      />
      <Popper id={id} open={open} anchorEl={anchorEl} placement="right-start">
        <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
          <Button
            variant="contained"
            className={classes.button}
            onMouseUp={() => removeShape('highlights', shape.guid)}
            startIcon={<Delete scale={zoomRatio} />}>
            Delete
          </Button>
        </ClickAwayListener>
      </Popper>
    </>
  )
}
