import { Highlight } from '@sensenet/client-core'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import React from 'react'

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
}

const useStyles = makeStyles<Theme, Props>(() =>
  createStyles({
    root: {
      top: ({ dimensions }) => dimensions.top,
      left: ({ dimensions }) => dimensions.left,
      width: ({ dimensions }) => dimensions.width,
      height: ({ dimensions }) => dimensions.height,
      position: 'absolute',
      resize: ({ permissions }) => (permissions.canEdit ? 'both' : 'none'),
      overflow: 'auto',
      backgroundColor: 'black',
    },
  }),
)

/**
 * Return a styled redaction component
 * @param shape Shape attributes
 * @param permissions Permissions of the current user
 * @param dimensions Shape dimensions
 * @param onDragStart Function triggered on drag event
 * @param onResized Function triggered on resized event
 * @param getShapeDimensions Function returns with shape dimensions
 * @returns styled redaction component
 */
export function ShapeRedaction({ shape, onDragStart, onResized, permissions, dimensions }: Props) {
  const classes = useStyles({ shape, onDragStart, onResized, permissions, dimensions })

  return (
    <div
      className={classes.root}
      tabIndex={0}
      key={`r-${shape.h}-${shape.w}`}
      draggable={permissions.canEdit}
      onDragStart={onDragStart}
      onMouseUp={onResized}
    />
  )
}
