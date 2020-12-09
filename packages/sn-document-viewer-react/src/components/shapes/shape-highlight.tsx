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
      backgroundColor: 'yellow',
      opacity: 0.5,
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
export function ShapeHighlight({ shape, onDragStart, onResized, permissions, dimensions }: Props) {
  const classes = useStyles({ shape, onDragStart, onResized, permissions, dimensions })

  return (
    <div
      className={classes.root}
      tabIndex={0}
      draggable={permissions.canEdit}
      onDragStart={onDragStart}
      onMouseUp={onResized}
    />
  )
}
