import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import React, { useCallback } from 'react'
import { useCommentState, usePreviewImage, useViewerState } from '../hooks'
import { ImageUtil } from '../services'
import { PAGE_NAME, PAGE_PADDING } from './DocumentViewerLayout'
import { MARKER_SIZE, ShapesWidget } from './shapes'

/**
 * Defined the component's own properties
 */
export interface PageProps {
  imageIndex: number
  viewportHeight: number
  viewportWidth: number
  relativeHeight: number
  relativeWidth: number
  onClick: (ev: React.MouseEvent<HTMLElement>) => any
}

export const Page: React.FC<PageProps> = (props) => {
  const viewerState = useViewerState()
  const page = usePreviewImage(props.imageIndex)
  const commentState = useCommentState()

  const isActive = page.image && viewerState.activePage === page.image.Index

  const imgUrl = (page.image && page.image?.PreviewImageUrl) || ''

  const imageRotation = ImageUtil.normalizeDegrees(
    viewerState.rotation?.find((rotation) => rotation.pageNum === props.imageIndex)?.degree || 0,
  )

  const imageRotationRads = ((imageRotation % 180) * Math.PI) / 180

  const boundingBox = ImageUtil.getRotatedBoundingBoxSize(
    {
      width: (page.image && page.image.Width) || 0,
      height: (page.image && page.image.Height) || 0,
    },
    imageRotation,
  )

  const diffHeight = Math.sin(imageRotationRads) * ((props.relativeHeight - props.relativeWidth) / 2)

  const imageTransform = `translateY(${diffHeight}px) rotate(${imageRotation}deg)`

  const handleMarkerPlacement = useCallback(
    (event: React.MouseEvent) => {
      const xCoord = event.nativeEvent.offsetX / (props.relativeHeight / ((page.image && page.image.Height) || 1))
      const yCoord = event.nativeEvent.offsetY / (props.relativeWidth / ((page.image && page.image.Width) || 1))

      if (!viewerState.isPlacingCommentMarker || xCoord <= MARKER_SIZE || yCoord <= MARKER_SIZE) {
        return
      }
      const newCommentMarker = {
        x: `${xCoord - MARKER_SIZE}`,
        y: `${yCoord - MARKER_SIZE}`,
        id: 'draft',
        page: viewerState.activePage,
      }
      commentState.setDraft(newCommentMarker)
    },
    [
      commentState,
      page.image,
      props.relativeHeight,
      props.relativeWidth,
      viewerState.activePage,
      viewerState.isPlacingCommentMarker,
    ],
  )

  return (
    <Paper elevation={isActive ? 8 : 2} className={PAGE_NAME} style={{ margin: PAGE_PADDING }}>
      <div
        style={{
          padding: 0,
          overflow: 'hidden',
          width: props.relativeWidth - 2 * PAGE_PADDING,
          height: props.relativeHeight - 2 * PAGE_PADDING,
          position: 'relative',
        }}
        onClick={(ev) => {
          viewerState.isPlacingCommentMarker ? handleMarkerPlacement(ev) : props.onClick(ev)
        }}>
        {page.image && (
          <div>
            <ShapesWidget zoomRatio={props.relativeHeight / page.image.Height} page={page.image} />
          </div>
        )}
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
