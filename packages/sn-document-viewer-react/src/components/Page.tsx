import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import React, { useCallback, useState } from 'react'
import { useCommentState, usePreviewImage, useViewerState } from '../hooks'
import { ImageUtil } from '../services'
import { ShapesWidget } from './page-widgets'
import { MARKER_SIZE } from './page-widgets/style'

/**
 * Defined the component's own properties
 */
export interface PageProps {
  isThumbnail: boolean
  imageIndex: number
  viewportHeight: number
  viewportWidth: number
  elementName: string
  onClick: (ev: React.MouseEvent<HTMLElement>) => any
  margin: number
}

export const Page: React.FC<PageProps> = (props) => {
  const viewerState = useViewerState()
  const page = usePreviewImage(props.imageIndex)
  const commentState = useCommentState()

  const [isActive] = React.useState(page.image && viewerState.activePages.includes(page.image.Index))

  const [imgUrl] = useState(
    (page.image && (!props.isThumbnail ? page.image.PreviewImageUrl : page.image.ThumbnailImageUrl)) || '',
  )

  const [imageRotation] = useState(
    ImageUtil.normalizeDegrees((page.image && page.image.Attributes && page.image.Attributes.degree) || 0),
  )

  const [imageRotationRads] = useState(((imageRotation % 180) * Math.PI) / 180)

  const [relativeImageSize] = useState(
    ImageUtil.getImageSize(
      {
        width: props.viewportWidth,
        height: props.viewportHeight,
      },
      {
        width: (page.image && page.image.Width) || 0,
        height: (page.image && page.image.Height) || 0,
        rotation: (page.image && page.image.Attributes && page.image.Attributes.degree) || 0,
      },
      viewerState.zoomMode,
      viewerState.customZoomLevel,
      viewerState.fitRelativeZoomLevel,
    ),
  )

  const [boundingBox] = useState(
    ImageUtil.getRotatedBoundingBoxSize(
      {
        width: (page.image && page.image.Width) || 0,
        height: (page.image && page.image.Height) || 0,
      },
      imageRotation,
    ),
  )

  const [diffHeight] = useState(
    Math.sin(imageRotationRads) * ((relativeImageSize.height - relativeImageSize.width) / 2),
  )

  const [imageTransform] = useState(`translateY(${diffHeight}px) rotate(${imageRotation}deg)`)

  const handleMarkerPlacement = useCallback(
    (event: React.MouseEvent) => {
      if (!viewerState.isPlacingCommentMarker) {
        return
      }
      const newCommentMarker = {
        x: `${
          event.nativeEvent.offsetX / (relativeImageSize.height / ((page.image && page.image.Height) || 1)) -
          MARKER_SIZE
        }`,
        y: `${
          event.nativeEvent.offsetY / (relativeImageSize.height / ((page.image && page.image.Height) || 1)) -
          MARKER_SIZE
        }`,
        id: 'draft',
      }
      commentState.setDraft(newCommentMarker)
    },
    [commentState, page.image, relativeImageSize.height, viewerState.isPlacingCommentMarker],
  )

  return (
    <Paper elevation={isActive ? 8 : 2} className={props.elementName} style={{ margin: props.margin }}>
      <div
        style={{
          padding: 0,
          overflow: 'hidden',
          width: relativeImageSize.width - 2 * props.margin,
          height: relativeImageSize.height - 2 * props.margin,
          position: 'relative',
        }}
        onClick={(ev) => {
          props.onClick(ev)
          handleMarkerPlacement(ev)
        }}>
        {page.image && !props.isThumbnail ? (
          <div>
            <ShapesWidget zoomRatio={relativeImageSize.height / page.image.Height} page={page.image} />
          </div>
        ) : null}
        <span style={{ display: 'flex', justifyContent: 'center' }}>
          {imgUrl ? (
            <img
              src={`${imgUrl}${viewerState.showWatermark ? '?watermark=true' : ''}`}
              alt=""
              style={{
                transition: 'transform .1s ease-in-out',
                width: `${100 * boundingBox.zoomRatio}%`,
                height: `${100 * boundingBox.zoomRatio}%`,
                transform: imageTransform,
              }}
            />
          ) : (
            <CircularProgress style={{ marginTop: '50%' }} />
          )}
        </span>
      </div>
    </Paper>
  )
}
