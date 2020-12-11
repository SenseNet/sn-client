import { PreviewImageData } from '@sensenet/client-core'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import clsx from 'clsx'
import React, { useCallback, useState } from 'react'
import { useCommentState, useDocumentData, usePreviewImage, useViewerState } from '../hooks'
import { ImageUtil } from '../services'
import { PAGE_NAME, PAGE_PADDING } from './document-viewer-layout'
import { MARKER_SIZE, ShapesWidget } from './shapes'

const ANNOTATION_EXTRA_VALUES = {
  text: 'Example Text',
  lineHeight: 15,
  fontBold: '34',
  imageIndex: 1,
  fontColor: 'red',
  fontFamily: 'arial',
  fontItalic: 'false',
  fontSize: '16px',
}

const useStyles = makeStyles<Theme, PageProps>(() => {
  return createStyles({
    page: {
      padding: 0,
      overflow: 'hidden',
      width: ({ page }) => page.Width,
      height: ({ page }) => page.Height,
      position: 'relative',
    },
    image: {
      display: 'flex',
      justifyContent: 'center',
    },
    isPlacingShape: {
      cursor: 'crosshair',
    },
  })
})

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
  const classes = useStyles(props)
  const viewerState = useViewerState()
  const page = usePreviewImage(props.page.Index)
  const commentState = useCommentState()
  const [mouseIsDown, setMouseIsDown] = useState<boolean>(false)
  const [startX, setStartX] = useState<number>(0)
  const [startY, setStartY] = useState<number>(0)
  const { documentData, updateDocumentData } = useDocumentData()

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
  const handleMouseDown = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (
      viewerState.isPlacingRedaction ||
      viewerState.isPlacingAnnotation ||
      (viewerState.isPlacingHighlight && !mouseIsDown)
    ) {
      setMouseIsDown(true)
      setStartX(ev.nativeEvent.offsetX / (props.page.Height / ((page.image && page.image.Height) || 1)))
      setStartY(ev.nativeEvent.offsetY / (props.page.Width / ((page.image && page.image.Width) || 1)))
    }
  }

  const handleMouseUp = (
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>,
    shapeType: 'annotation' | 'highlight' | 'redaction',
  ) => {
    setMouseIsDown(false)
    const endX = ev.nativeEvent.offsetX / (props.page.Height / ((page.image && page.image.Height) || 1))
    const endY = ev.nativeEvent.offsetY / (props.page.Width / ((page.image && page.image.Width) || 1))

    if (endY - startY && endX - startX) {
      switch (shapeType) {
        case 'annotation':
          documentData.shapes.annotations.push({
            h: endY - startY,
            w: endX - startX,
            x: startX,
            y: startY,
            index: 1,
            guid: `a-${startX}-${startY}`,
            ...ANNOTATION_EXTRA_VALUES,
          })
          updateDocumentData(documentData)
          viewerState.updateState({ hasChanges: true, isPlacingAnnotation: false })
          break
        case 'highlight':
          documentData.shapes.highlights.push({
            h: endY - startY,
            w: endX - startX,
            x: startX,
            y: startY,
            imageIndex: 1,
            guid: `h-${startX}-${startY}`,
          })
          updateDocumentData(documentData)
          viewerState.updateState({ hasChanges: true, isPlacingHighlight: false })
          break
        case 'redaction':
          documentData.shapes.redactions.push({
            h: endY - startY,
            w: endX - startX,
            x: startX,
            y: startY,
            imageIndex: 1,
            guid: `r-${startX}-${startY}`,
          })
          updateDocumentData(documentData)
          viewerState.updateState({ hasChanges: true, isPlacingRedaction: false })
          break
        default:
          break
      }
    }
  }

  return (
    <Paper elevation={isActive ? 8 : 2} className={PAGE_NAME} style={{ margin: PAGE_PADDING }}>
      <div
        className={clsx(classes.page, { [classes.isPlacingShape]: viewerState.isPlacingRedaction })}
        onClick={(ev) => {
          viewerState.isPlacingCommentMarker ? handleMarkerPlacement(ev) : props.onClick(ev)
        }}
        onMouseDown={(ev) => {
          handleMouseDown(ev)
        }}
        onMouseUp={(ev) => {
          if (viewerState.isPlacingRedaction && mouseIsDown) {
            handleMouseUp(ev, 'redaction')
          }
          if (viewerState.isPlacingHighlight && mouseIsDown) {
            handleMouseUp(ev, 'highlight')
          }
          if (viewerState.isPlacingAnnotation && mouseIsDown) {
            handleMouseUp(ev, 'annotation')
          }
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
        <span className={classes.image}>
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
