import { PreviewImageData } from '@sensenet/client-core'
import { CircularProgress, createStyles, makeStyles, Paper, Theme } from '@material-ui/core'
import clsx from 'clsx'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useCommentState, useDocumentData, usePreviewImage, useViewerState } from '../hooks'
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
  visiblePagesIndex: number
  onClick: (ev: React.MouseEvent<HTMLElement>) => any
  pageContainerRef?: HTMLElement
}

export const Page: React.FC<PageProps> = (props) => {
  const classes = useStyles(props)
  const viewerState = useViewerState()
  const page = usePreviewImage(props.page.Index)
  const commentState = useCommentState()
  const [mouseIsDown, setMouseIsDown] = useState<boolean>(false)
  const [startX, setStartX] = useState<number>(0)
  const [startY, setStartY] = useState<number>(0)
  const [startOffsetX, setStartOffsetX] = useState<number>(0)
  const [startOffsetY, setStartOffsetY] = useState<number>(0)
  const [draftWidth, setdraftWidth] = useState<number>(0)
  const [draftHeight, setdraftHeight] = useState<number>(0)
  const [scrollX, setScrollX] = useState<number>(0)
  const [scrollY, setScrollY] = useState<number>(0)
  const [scrollOffsetX, setScrollOffsetX] = useState<number>(0)
  const [scrollOffsetY, setScrollOffsetY] = useState<number>(0)
  const { documentData, updateDocumentData } = useDocumentData()

  const imageRatio = useMemo(
    () => props.page.Height / (page.image?.Height || 1),
    [props.page.Height, page.image?.Height],
  )

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

  const reCalculateDraftShape = useCallback(
    (ev: MouseEvent) => {
      const compareNumbers = (a: number, b: number) => a - b
      const pageBoundings = {
        left: Math.max(viewerState.pagesRects[props.visiblePagesIndex].pageRect.left, viewerState.boxPosition.left),
        right: Math.min(viewerState.pagesRects[props.visiblePagesIndex].pageRect.right, viewerState.boxPosition.right),
        bottom: Math.min(
          viewerState.pagesRects[props.visiblePagesIndex].pageRect.bottom,
          viewerState.boxPosition.bottom,
        ),
        top: Math.max(viewerState.pagesRects[props.visiblePagesIndex].pageRect.top, viewerState.boxPosition.top),
      }

      const endX =
        ([pageBoundings.left, pageBoundings.right, ev.pageX].sort(compareNumbers)[1] + scrollOffsetX) / imageRatio

      const endY =
        ([pageBoundings.bottom, pageBoundings.top, ev.pageY].sort(compareNumbers)[1] + scrollOffsetY) / imageRatio
      return { endX, endY }
    },
    [
      imageRatio,
      props.visiblePagesIndex,
      scrollOffsetX,
      scrollOffsetY,
      viewerState.boxPosition.bottom,
      viewerState.boxPosition.left,
      viewerState.boxPosition.right,
      viewerState.boxPosition.top,
      viewerState.pagesRects,
    ],
  )

  useEffect(() => {
    const handleGlobalScroll = (ev: any) => {
      if (ev.currentTarget) {
        if (viewerState.activeShapePlacing !== 'none' && mouseIsDown) {
          setScrollOffsetX(ev.currentTarget.scrollLeft - scrollX)
          setScrollOffsetY(ev.currentTarget.scrollTop - scrollY)
        } else {
          setScrollX(ev.currentTarget.scrollLeft || 0)
          setScrollY(ev.currentTarget.scrollTop || 0)
          setScrollOffsetX(0)
          setScrollOffsetY(0)
        }
      }
    }
    props.pageContainerRef?.addEventListener('scroll', handleGlobalScroll)
    return () => {
      props.pageContainerRef?.removeEventListener('scroll', handleGlobalScroll)
    }
  }, [mouseIsDown, props.pageContainerRef, scrollX, scrollY, viewerState.activeShapePlacing])

  useEffect(() => {
    const handleGlobalMouseMove = (ev: MouseEvent) => {
      if (
        viewerState.activeShapePlacing !== 'none' &&
        mouseIsDown &&
        viewerState.pagesRects[props.visiblePagesIndex] &&
        (viewerState.boxPosition.bottom ||
          viewerState.boxPosition.left ||
          viewerState.boxPosition.right ||
          viewerState.boxPosition.top)
      ) {
        const { endX, endY } = reCalculateDraftShape(ev)
        setdraftHeight(endY - startY)
        setdraftWidth(endX - startX)
      }
    }

    document.addEventListener('mousemove', handleGlobalMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
    }
  }, [
    mouseIsDown,
    props.visiblePagesIndex,
    reCalculateDraftShape,
    startX,
    startY,
    viewerState.activeShapePlacing,
    viewerState.boxPosition.bottom,
    viewerState.boxPosition.left,
    viewerState.boxPosition.right,
    viewerState.boxPosition.top,
    viewerState.pagesRects,
  ])

  useEffect(() => {
    const handleGlobalMouseUp = (ev: MouseEvent) => {
      if (
        mouseIsDown &&
        (viewerState.boxPosition.bottom ||
          viewerState.boxPosition.left ||
          viewerState.boxPosition.right ||
          viewerState.boxPosition.top)
      ) {
        setMouseIsDown(false)
        setdraftHeight(0)
        setdraftWidth(0)

        const { endX, endY } = reCalculateDraftShape(ev)

        if (endY - startY > 0 && endX - startX > 0) {
          switch (viewerState.activeShapePlacing) {
            case 'annotation':
              documentData.shapes.annotations.push({
                h: endY - startY,
                w: endX - startX,
                x: startOffsetX,
                y: startOffsetY,
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
                x: startOffsetX,
                y: startOffsetY,
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
                x: startOffsetX,
                y: startOffsetY,
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

        setScrollX(scrollOffsetX + scrollX)
        setScrollY(scrollOffsetY + scrollY)
        setScrollOffsetX(0)
        setScrollOffsetY(0)
      }
    }

    document.addEventListener('mouseup', handleGlobalMouseUp)
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [
    documentData,
    mouseIsDown,
    props.page.Index,
    reCalculateDraftShape,
    scrollOffsetX,
    scrollOffsetY,
    scrollX,
    scrollY,
    startOffsetX,
    startOffsetY,
    startX,
    startY,
    updateDocumentData,
    viewerState,
  ])

  const handleMarkerPlacement = useCallback(
    (event: React.MouseEvent) => {
      if (imageRotation !== 0) {
        viewerState.updateState({ isPlacingCommentMarker: false })
      }
      const xCoord = event.nativeEvent.offsetX / imageRatio
      const yCoord = event.nativeEvent.offsetY / (props.page.Width / (page.image?.Width || 1))

      if (!viewerState.isPlacingCommentMarker || xCoord <= MARKER_SIZE || yCoord <= MARKER_SIZE) {
        return
      }
      const newCommentMarker = {
        x: `${xCoord - MARKER_SIZE}`,
        y: `${yCoord - MARKER_SIZE}`,
        id: 'draft',
        page: page.image?.Index || viewerState.activePage,
      }
      commentState.setDraft(newCommentMarker)
    },
    [commentState, imageRatio, imageRotation, page.image?.Index, page.image?.Width, props.page.Width, viewerState],
  )

  const handleMouseDown = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (imageRotation !== 0) {
      viewerState.updateState({ activeShapePlacing: 'none' })
    }
    setMouseIsDown(true)
    setStartX(ev.nativeEvent.pageX / imageRatio)
    setStartY(ev.nativeEvent.pageY / imageRatio)
    setStartOffsetX(
      (ev.nativeEvent.pageX - viewerState.pagesRects[props.visiblePagesIndex!].pageRect.left!) / imageRatio,
    )
    setStartOffsetY(
      (ev.nativeEvent.pageY - viewerState.pagesRects[props.visiblePagesIndex!].pageRect.top!) / imageRatio,
    )
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
        }}>
        {page.image && (
          <>
            <ShapesWidget
              imageRotation={imageRotation}
              zoomRatioStanding={props.page.Height / page.image.Height}
              zoomRatioLying={props.page.Width / page.image.Height}
              page={page.image}
              visiblePagesIndex={props.visiblePagesIndex}
              pageContainerRef={props.pageContainerRef}
            />

            {mouseIsDown && (
              <div className={classes.draftShapeContainer}>
                <ShapeDraft
                  dimensions={{
                    top: startOffsetY * (props.page.Height / page.image.Height),
                    left: startOffsetX * (props.page.Height / page.image.Height),
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
                userSelect: 'none',
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
