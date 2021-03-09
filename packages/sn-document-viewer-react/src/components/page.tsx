import { PreviewImageData } from '@sensenet/client-core'
import { CircularProgress, createStyles, makeStyles, Paper, Theme } from '@material-ui/core'
import clsx from 'clsx'
import React, { useCallback, useState } from 'react'
import { useCommentState, useDocumentData, usePreviewImage, useViewerState } from '../hooks'
import { ActiveShapPlacingOptions } from '../models'
import { ImageUtil } from '../services'
import { PAGE_NAME, PAGE_PADDING } from './document-viewer-layout'
import { MARKER_SIZE, ShapeDraft, ShapesWidget } from './shapes'

export const ANNOTATION_EXTRA_VALUES = {
  text: '',
  lineHeight: 40,
  fontBold: 400,
  fontColor: '#000000',
  fontFamily: 'arial',
  fontItalic: false,
  fontSize: 40,
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
    draftShapeContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1,
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
  const [draftWidth, setdraftWidth] = useState<number>(0)
  const [draftHeight, setdraftHeight] = useState<number>(0)
  const { documentData, updateDocumentData } = useDocumentData()

  const isActive = page.image && viewerState.activePage === page.image.Index

  const imgUrl = (page.image && page.image?.PreviewImageUrl) || ''

  const imageRotation = ImageUtil.normalizeDegrees(
    viewerState.rotation?.find((rotation) => rotation.pageNum === props.page.Index)?.degree || 0,
  )

  const imageRotationRads = ((imageRotation % 180) * Math.PI) / 180

  const boundingBox = ImageUtil.getRotatedBoundingBoxSize(
    {
      width: page.image?.Width || 0,
      height: page.image?.Height || 0,
    },
    imageRotation,
  )

  const diffHeight = Math.sin(imageRotationRads) * ((props.page.Height - props.page.Width) / 2)

  const imageTransform = `translateY(${diffHeight}px) rotate(${imageRotation}deg)`

  const handleMarkerPlacement = useCallback(
    (event: React.MouseEvent) => {
      if (imageRotation !== 0) {
        viewerState.updateState({ isPlacingCommentMarker: false })
      }
      const xCoord = event.nativeEvent.offsetX / (props.page.Height / (page.image?.Height || 1))
      const yCoord = event.nativeEvent.offsetY / (props.page.Width / (page.image?.Width || 1))

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
      imageRotation,
      page.image?.Height,
      page.image?.Width,
      props.page.Height,
      props.page.Width,
      viewerState,
    ],
  )
  const handleMouseDown = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (imageRotation !== 0) {
      viewerState.updateState({ activeShapePlacing: 'none' })
    }
    setMouseIsDown(true)
    setStartX(ev.nativeEvent.offsetX / (props.page.Height / (page.image?.Height || 1)))
    setStartY(ev.nativeEvent.offsetY / (props.page.Width / (page.image?.Width || 1)))
  }

  const handleMouseMove = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const endX = ev.nativeEvent.offsetX / (props.page.Height / (page.image?.Height || 1))
    const endY = ev.nativeEvent.offsetY / (props.page.Width / (page.image?.Width || 1))
    setdraftHeight(endY - startY)
    setdraftWidth(endX - startX)
  }

  const handleMouseUp = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>, shapeType: ActiveShapPlacingOptions) => {
    setMouseIsDown(false)
    setdraftHeight(0)
    setdraftWidth(0)
    const endX = ev.nativeEvent.offsetX / (props.page.Height / (page.image?.Height || 1))
    const endY = ev.nativeEvent.offsetY / (props.page.Width / (page.image?.Width || 1))

    if (endY - startY > 0 && endX - startX > 0) {
      switch (shapeType) {
        case 'annotation':
          documentData.shapes.annotations.push({
            h: endY - startY,
            w: endX - startX,
            x: startX,
            y: startY,
            imageIndex: props.page.Index,
            guid: `a-${startX}-${startY}`,
            ...ANNOTATION_EXTRA_VALUES,
          })

          updateDocumentData(documentData)
          viewerState.updateState({
            hasChanges: true,
            activeShapePlacing: 'none',
            showShapes: true,
          })
          break
        case 'highlight':
          documentData.shapes.highlights.push({
            h: endY - startY,
            w: endX - startX,
            x: startX,
            y: startY,
            imageIndex: props.page.Index,
            guid: `h-${startX}-${startY}`,
          })
          updateDocumentData(documentData)
          viewerState.updateState({
            hasChanges: true,
            activeShapePlacing: 'none',
            showShapes: true,
          })
          break
        case 'redaction':
          documentData.shapes.redactions.push({
            h: endY - startY,
            w: endX - startX,
            x: startX,
            y: startY,
            imageIndex: props.page.Index,
            guid: `r-${startX}-${startY}`,
          })
          updateDocumentData(documentData)
          viewerState.updateState({
            hasChanges: true,
            activeShapePlacing: 'none',
            showRedaction: true,
          })
          break
        default:
          break
      }
    }
    setStartX(0)
    setStartY(0)
  }

  return (
    <Paper elevation={isActive ? 8 : 2} className={PAGE_NAME} style={{ margin: PAGE_PADDING }}>
      <div
        className={clsx(classes.page, {
          [classes.isPlacingShape]: viewerState.activeShapePlacing !== 'none',
        })}
        onClick={(ev) => {
          viewerState.isPlacingCommentMarker ? handleMarkerPlacement(ev) : props.onClick(ev)
        }}
        onMouseDown={(ev) => {
          viewerState.activeShapePlacing !== 'none' && !mouseIsDown && handleMouseDown(ev)
        }}
        onMouseMove={(ev) => {
          viewerState.activeShapePlacing !== 'none' && mouseIsDown && handleMouseMove(ev)
        }}
        onMouseUp={(ev) => {
          mouseIsDown && handleMouseUp(ev, viewerState.activeShapePlacing)
        }}>
        {page.image && (
          <>
            <ShapesWidget
              imageRotation={imageRotation}
              zoomRatioStanding={props.page.Height / page.image.Height}
              zoomRatioLying={props.page.Width / page.image.Height}
              page={page.image}
            />

            {mouseIsDown && (
              <div className={classes.draftShapeContainer}>
                <ShapeDraft
                  dimensions={{
                    top: startY * (props.page.Height / page.image.Height),
                    left: startX * (props.page.Height / page.image.Height),
                    height: draftHeight * (props.page.Height / page.image.Height),
                    width: draftWidth * (props.page.Height / page.image.Height),
                  }}
                />
              </div>
            )}
          </>
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
