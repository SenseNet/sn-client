import { PreviewImageData } from '@sensenet/client-core'
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
  viewportHeight: number
  viewportWidth: number
  page: PreviewImageData
  onClick: (ev: React.MouseEvent<HTMLElement>) => any
}

export const Page: React.FC<PageProps> = (props) => {
  const viewerState = useViewerState()
  const page = usePreviewImage(props.page.Index)
  const commentState = useCommentState()

  const isActive = page.image && viewerState.activePage === page.image.Index

  const imgUrl = (page.image && page.image?.PreviewImageUrl) || ''

  const imageRotation = ImageUtil.normalizeDegrees(
    viewerState.rotation?.find((rotation) => rotation.pageNum === props.page.Index)?.degree || 0,
  )

  const imageRotationRads = ((imageRotation % 180) * Math.PI) / 180

  const boundingBox = ImageUtil.getRotatedBoundingBoxSize(
    {
      width: (page.image && page.image.Width) || 0,
      height: (page.image && page.image.Height) || 0,
    },
    imageRotation,
  )

  const diffHeight = Math.sin(imageRotationRads) * ((props.page.Height - props.page.Width) / 2)

  const imageTransform = `translateY(${diffHeight}px) rotate(${imageRotation}deg)`

  const handleMarkerPlacement = useCallback(
    (event: React.MouseEvent) => {
      const xCoord = event.nativeEvent.offsetX / (props.page.Height / ((page.image && page.image.Height) || 1))
      const yCoord = event.nativeEvent.offsetY / (props.page.Width / ((page.image && page.image.Width) || 1))

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
      props.page.Height,
      props.page.Width,
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
          width: props.page.Width,
          height: props.page.Height,
          position: 'relative',
        }}
        onClick={(ev) => {
          viewerState.isPlacingCommentMarker ? handleMarkerPlacement(ev) : props.onClick(ev)
        }}>
        {page.image && (
          <div>
            <ShapesWidget
              zoomRatioStanding={props.page.Height / page.image.Height}
              zoomRatioLying={props.page.Width / page.image.Height}
              page={props.page}
            />
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
