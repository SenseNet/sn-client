import { DraftCommentMarker } from '@sensenet/client-core'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import React from 'react'
import { useCommentState, useViewerState } from '../..'

export const MARKER_SIZE = 10

type Props = {
  marker: DraftCommentMarker
  zoomRatio: number
  isSelected: boolean
  rotation: number
}

const useStyles = makeStyles<Theme, Props>((theme) =>
  createStyles({
    root: {
      position: 'absolute',
      top: ({ rotation, marker, zoomRatio }) => {
        switch (rotation) {
          case 90:
            return `${parseFloat(marker.x) * zoomRatio}px`
          case 180:
            return 'unset'
          case 270:
            return 'unset'
          default:
            return `${parseFloat(marker.y) * zoomRatio}px`
        }
      },
      right: ({ rotation, marker, zoomRatio }) => {
        switch (rotation) {
          case 90:
            return `${parseFloat(marker.y) * zoomRatio}px`
          case 180:
            return `${parseFloat(marker.x) * zoomRatio}px`
          case 270:
            return 'unset'
          default:
            return 'unset'
        }
      },
      bottom: ({ rotation, marker, zoomRatio }) => {
        switch (rotation) {
          case 90:
            return 'unset'
          case 180:
            return `${parseFloat(marker.y) * zoomRatio}px`
          case 270:
            return `${parseFloat(marker.x) * zoomRatio}px`
          default:
            return 'unset'
        }
      },
      left: ({ rotation, marker, zoomRatio }) => {
        switch (rotation) {
          case 90:
            return 'unset'
          case 180:
            return 'unset'
          case 270:
            return `${parseFloat(marker.y) * zoomRatio}px`
          default:
            return `${parseFloat(marker.x) * zoomRatio}px`
        }
      },
      width: `${MARKER_SIZE}px`,
      height: `${MARKER_SIZE}px`,
      borderRadius: `${MARKER_SIZE}px`,
      backgroundColor: ({ isSelected }) => (isSelected ? theme.palette.primary.light : theme.palette.primary.dark),
      cursor: 'pointer',
    },
  }),
)

/**
 * Return a styled comment marker component
 * @param marker Attributes of the marker
 * @param zoomRatio Zoom ratio
 * @param isSelected Flag to store is marker is selected or not
 * @param rotation Page rotation degree
 * @returns styled comment marker component
 */
export function CommentMarker({ marker, zoomRatio, isSelected, rotation }: Props) {
  const classes = useStyles({ marker, zoomRatio, isSelected, rotation })
  const viewerState = useViewerState()
  const commentState = useCommentState()

  return (
    <div
      className={classes.root}
      onClick={(ev) => {
        ev.stopPropagation()
        ev.nativeEvent.stopImmediatePropagation()
        !viewerState.isPlacingCommentMarker && commentState.setActiveComment(marker.id)
      }}
    />
  )
}
