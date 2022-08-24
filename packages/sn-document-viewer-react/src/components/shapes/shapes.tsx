import { Annotation, Highlight, PreviewImageData, Redaction, Shape, Shapes } from '@sensenet/client-core'
import { debounce } from '@sensenet/client-utils'
import { createStyles, makeStyles } from '@material-ui/core'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useComments, useCommentState, useDocumentData, useDocumentPermissions, useViewerState } from '../../hooks'
import { ViewerState } from '../../models/viewer-state'
import { applyShapeRotations, Dimensions, ImageUtil } from '../../services'
import { ShapeSkeleton } from '../shapes'
import { CommentMarker } from './comment-marker'

const useStyles = makeStyles(() => {
  return createStyles({
    shapesContainer: {
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
export interface ShapesWidgetProps {
  page: PreviewImageData
  zoomRatioStanding: number
  zoomRatioLying: number
  imageRotation: number
  visiblePagesIndex: number
  pageContainerRef?: HTMLElement
}

/**
 * Page widget component for displaying shapes on a page
 */
export const ShapesWidget: React.FC<ShapesWidgetProps> = (props) => {
  const classes = useStyles()
  const permissions = useDocumentPermissions()
  const viewerState = useViewerState()
  const { documentData, updateDocumentData } = useDocumentData()
  const comments = useComments()
  const commentState = useCommentState()
  const shapesContainerRef = useRef<HTMLDivElement>(null)
  const [resizeToken, setResizeToken] = useState(0)
  const zoomRatio =
    props.imageRotation === 90 || props.imageRotation === 270 ? props.zoomRatioLying : props.zoomRatioStanding

  const rotationDegree = viewerState.rotation?.find((rotation) => rotation.pageNum === props.page.Index)?.degree || 0

  const visibleShapes = {
    redactions: applyShapeRotations(
      documentData.shapes.redactions.filter((r) => r.imageIndex === props.page.Index) as Redaction[],
      rotationDegree,
      props.page,
    ),
    highlights: applyShapeRotations(
      documentData.shapes.highlights.filter((r) => r.imageIndex === props.page.Index) as Highlight[],
      rotationDegree,
      props.page,
    ),
    annotations: applyShapeRotations(
      documentData.shapes.annotations.filter((r) => r.imageIndex === props.page.Index) as Annotation[],
      rotationDegree,
      props.page,
    ),
  }

  const visibleComments = [
    ...comments.comments.filter((comment) => comment.page === props.page.Index),
    ...(props.page.Index !== undefined && commentState.draft?.page === props.page?.Index ? [commentState.draft] : []),
  ]

  const { updateState } = viewerState

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const requestResize = useCallback(
    debounce(() => {
      setResizeToken(Math.random())
    }, 300),
    [],
  )

  const onScroll = useCallback(() => {
    requestResize()
  }, [requestResize])

  useEffect(() => {
    const currentViewport = props.pageContainerRef
    currentViewport?.addEventListener('scroll', onScroll)
    return () => currentViewport?.removeEventListener('scroll', onScroll)
  }, [onScroll, props.pageContainerRef])

  useEffect(() => {
    if (shapesContainerRef.current && props.visiblePagesIndex !== undefined) {
      const updatePagesRectsFunc = (previous: ViewerState) => {
        const clonePagesRects = [...previous.pagesRects]
        if (clonePagesRects.length === 0) {
          clonePagesRects.push({
            visiblePage: props.visiblePagesIndex,
            pageRect: shapesContainerRef.current!.getClientRects()[0],
          })
        } else {
          const findIndex = clonePagesRects.findIndex((item) => item.visiblePage === props.visiblePagesIndex)
          if (findIndex !== -1) {
            clonePagesRects[findIndex].pageRect = shapesContainerRef.current!.getClientRects()[0]
          } else {
            clonePagesRects.push({
              visiblePage: props.visiblePagesIndex,
              pageRect: shapesContainerRef.current!.getClientRects()[0],
            })
          }
        }
        return { pagesRects: clonePagesRects }
      }

      updateState(updatePagesRectsFunc as any)
      if (props.pageContainerRef && props.pageContainerRef.getClientRects().length > 0) {
        updateState({
          boxPosition: {
            bottom: props.pageContainerRef.getClientRects()[0].bottom,
            left: props.pageContainerRef.getClientRects()[0].left,
            right: props.pageContainerRef.getClientRects()[0].right,
            top: props.pageContainerRef.getClientRects()[0].top,
          },
        })
      }
    }
  }, [resizeToken, props.pageContainerRef, props.visiblePagesIndex, updateState])

  const removeShape = useCallback(
    (shapeType: keyof Shapes, guid: string) => {
      ;(documentData.shapes as any)[shapeType] = documentData.shapes[shapeType].filter((s) => s.guid !== guid)
      updateDocumentData(documentData)
      viewerState.updateState({ hasChanges: true })
    },
    [documentData, updateDocumentData, viewerState],
  )

  const updateShapeData = useCallback(
    (shapeType: keyof Shapes, guid: string, shapeChange: Shape | Annotation, force?: boolean) => {
      const newDocumentData = { ...documentData }
      ;(newDocumentData.shapes as any)[shapeType] = (newDocumentData.shapes[shapeType] as Shape[]).map((s) => {
        if (s.guid === guid) {
          return { ...s, ...shapeChange }
        }
        return s
      })

      updateDocumentData(newDocumentData, force)
      viewerState.updateState({ hasChanges: true })
    },
    [documentData, updateDocumentData, viewerState],
  )

  const onDrop = useCallback(
    (ev: React.DragEvent<HTMLElement>) => {
      if (
        permissions.canEdit &&
        ev.dataTransfer.getData('shape') &&
        (viewerState.boxPosition.bottom ||
          viewerState.boxPosition.left ||
          viewerState.boxPosition.right ||
          viewerState.boxPosition.top)
      ) {
        ev.preventDefault()
        const shapeData = JSON.parse(ev.dataTransfer.getData('shape')) as {
          type: keyof Shapes
          shape: Shape
          offset: Dimensions
        }
        const clientRect = ev.currentTarget.getClientRects()[0]
        const compareNumbers = (a: number, b: number) => a - b

        const pageBoundings = {
          left: Math.max(viewerState.pagesRects[props.visiblePagesIndex].pageRect.left, viewerState.boxPosition.left),
          right:
            Math.min(viewerState.pagesRects[props.visiblePagesIndex].pageRect.right, viewerState.boxPosition.right) -
            shapeData.shape.w * zoomRatio,
          bottom:
            Math.min(viewerState.pagesRects[props.visiblePagesIndex].pageRect.bottom, viewerState.boxPosition.bottom) -
            shapeData.shape.h * zoomRatio,
          top: Math.max(viewerState.pagesRects[props.visiblePagesIndex].pageRect.top, viewerState.boxPosition.top),
        }
        const newX =
          [pageBoundings.left, pageBoundings.right, ev.pageX - shapeData.offset.width].sort(compareNumbers)[1] -
          clientRect.left
        const newY =
          [pageBoundings.top, pageBoundings.bottom, ev.pageY - shapeData.offset.height].sort(compareNumbers)[1] -
          clientRect.top

        updateShapeData(
          shapeData.type,
          shapeData.shape.guid,
          {
            ...shapeData.shape,
            imageIndex: props.page.Index,
            x: newX / zoomRatio,
            y: newY / zoomRatio,
          },
          true,
        )
      }
    },
    [
      permissions.canEdit,
      props.page.Index,
      props.visiblePagesIndex,
      updateShapeData,
      viewerState.boxPosition.bottom,
      viewerState.boxPosition.left,
      viewerState.boxPosition.right,
      viewerState.boxPosition.top,
      viewerState.pagesRects,
      zoomRatio,
    ],
  )

  return (
    <div
      ref={shapesContainerRef}
      className={classes.shapesContainer}
      onDrop={onDrop}
      onDragOver={(ev) => ev.preventDefault()}
    >
      {viewerState.showComments &&
        visibleComments.length > 0 &&
        visibleComments.map((marker) => (
          <CommentMarker
            isSelected={marker.id === commentState.activeCommentId}
            zoomRatio={zoomRatio}
            marker={marker}
            key={marker.id}
            rotation={ImageUtil.normalizeDegrees(
              viewerState.rotation?.find((rotation) => rotation.pageNum === props.page.Index)?.degree || 0,
            )}
          />
        ))}
      <>
        {permissions.canHideRedaction &&
          viewerState.showRedaction &&
          visibleShapes.redactions.map((redaction) => {
            return (
              <ShapeSkeleton
                key={redaction.guid}
                shape={redaction}
                shapeType="redactions"
                zoomRatio={zoomRatio}
                updateShapeData={updateShapeData}
                removeShape={removeShape}
                rotationDegree={rotationDegree}
                visiblePagesIndex={props.visiblePagesIndex}
              />
            )
          })}

        {viewerState.showShapes &&
          visibleShapes.annotations.map((annotation) => {
            return (
              <ShapeSkeleton
                key={annotation.guid}
                shape={annotation}
                shapeType="annotations"
                zoomRatio={zoomRatio}
                updateShapeData={updateShapeData}
                removeShape={removeShape}
                rotationDegree={rotationDegree}
                visiblePagesIndex={props.visiblePagesIndex}
              />
            )
          })}

        {viewerState.showShapes &&
          visibleShapes.highlights.map((highlight) => {
            return (
              <ShapeSkeleton
                key={highlight.guid}
                shape={highlight}
                shapeType="highlights"
                zoomRatio={zoomRatio}
                updateShapeData={updateShapeData}
                removeShape={removeShape}
                rotationDegree={rotationDegree}
                visiblePagesIndex={props.visiblePagesIndex}
              />
            )
          })}
      </>
    </div>
  )
}
