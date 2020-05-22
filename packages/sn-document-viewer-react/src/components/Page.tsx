import React, { useCallback, useEffect, useState } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import { ImageUtil } from '../services'
import { ZoomMode } from '../models/viewer-state'
import { useCommentState, usePreviewImage, useViewerState } from '../hooks'
import { ShapesWidget } from './page-widgets'
import { MARKER_SIZE } from './page-widgets/style'

/**
 * Defined the component's own properties
 */
export interface PageProps {
  showWidgets: boolean
  imageIndex: number
  viewportHeight: number
  viewportWidth: number
  elementName: string
  zoomMode: ZoomMode
  zoomLevel: number
  fitRelativeZoomLevel: number
  onClick: (ev: React.MouseEvent<HTMLElement>) => any
  margin: number
  image: 'preview' | 'thumbnail'
}

export const Page: React.FC<PageProps> = (props) => {
  const viewerState = useViewerState()
  const page = usePreviewImage(props.imageIndex)
  const commentState = useCommentState()

  const [isActive, setIsActive] = React.useState(page.image && viewerState.activePages.includes(page.image.Index))
  useEffect(() => {
    setIsActive(page.image && viewerState.activePages.includes(page.image.Index))
  }, [page.image, viewerState.activePages])

  const [imgUrl, setImgUrl] = useState(
    (page.image && (props.image === 'preview' ? page.image.PreviewImageUrl : page.image.ThumbnailImageUrl)) || '',
  )
  useEffect(() => {
    setImgUrl(
      (page.image && (props.image === 'preview' ? page.image.PreviewImageUrl : page.image.ThumbnailImageUrl)) || '',
    )
  }, [page.image, props.image])

  const [imageRotation, setImageRotation] = useState(
    ImageUtil.normalizeDegrees((page.image && page.image.Attributes && page.image.Attributes.degree) || 0),
  )

  const [imageRotationRads, setImageRotationRads] = useState(((imageRotation % 180) * Math.PI) / 180)

  useEffect(() => {
    const newRotation = ImageUtil.normalizeDegrees(
      (page.image && page.image.Attributes && page.image.Attributes.degree) || 0,
    )
    setImageRotation(newRotation)
    setImageRotationRads(((newRotation % 180) * Math.PI) / 180)
  }, [page.image])

  const [relativeImageSize, setRelativeImageSize] = useState(
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
      props.zoomMode,
      props.zoomLevel,
      props.fitRelativeZoomLevel,
    ),
  )

  useEffect(() => {
    setRelativeImageSize(
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
        props.zoomMode,
        props.zoomLevel,
        props.fitRelativeZoomLevel,
      ),
    )
  }, [
    page.image,
    props.fitRelativeZoomLevel,
    props.viewportHeight,
    props.viewportWidth,
    props.zoomLevel,
    props.zoomMode,
  ])

  const [boundingBox, setBoundingBox] = useState(
    ImageUtil.getRotatedBoundingBoxSize(
      {
        width: (page.image && page.image.Width) || 0,
        height: (page.image && page.image.Height) || 0,
      },
      imageRotation,
    ),
  )

  useEffect(() => {
    setBoundingBox(
      ImageUtil.getRotatedBoundingBoxSize(
        {
          width: (page.image && page.image.Width) || 0,
          height: (page.image && page.image.Height) || 0,
        },
        imageRotation,
      ),
    )
  }, [imageRotation, page.image])

  const [diffHeight, setDiffHeight] = useState(
    Math.sin(imageRotationRads) * ((relativeImageSize.height - relativeImageSize.width) / 2),
  )

  useEffect(() => {
    setDiffHeight(Math.sin(imageRotationRads) * ((relativeImageSize.height - relativeImageSize.width) / 2) || 0)
  }, [imageRotationRads, relativeImageSize.height, relativeImageSize.width])

  const [imageTransform, setImageTransform] = useState(`translateY(${diffHeight}px) rotate(${imageRotation}deg)`)

  useEffect(() => {
    setImageTransform(`translateY(${diffHeight}px) rotate(${imageRotation}deg)`)
  }, [diffHeight, imageRotation])

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
        {page.image && props.showWidgets ? (
          <div>
            <ShapesWidget
              draftCommentMarker={commentState.draft}
              zoomRatio={relativeImageSize.height / page.image.Height}
              page={page.image}
              viewPort={{ height: relativeImageSize.height, width: relativeImageSize.width }}
            />
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
