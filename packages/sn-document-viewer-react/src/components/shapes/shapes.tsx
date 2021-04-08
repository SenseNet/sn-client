import { Annotation, Highlight, PreviewImageData, Redaction, Shape, Shapes } from '@sensenet/client-core'
import { createStyles, makeStyles } from '@material-ui/core'
import React, { useCallback, useEffect, useRef } from 'react'
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
  visiblePagesIndex?: number
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

  useEffect(() => {
    if (shapesContainerRef.current && props.visiblePagesIndex !== undefined) {
      const updatePagesRectsFunc = (previous: ViewerState) => {
        const clonePagesRects = [...previous.pagesRects]
        if (clonePagesRects.length === 0) {
          clonePagesRects.push({
            visiblePage: props.visiblePagesIndex!,
            pageRect: shapesContainerRef.current!.getClientRects()[0],
          })
        } else {
          const findIndex = clonePagesRects.findIndex((item) => item.visiblePage === props.visiblePagesIndex)
          if (findIndex !== -1) {
            clonePagesRects[findIndex].pageRect = shapesContainerRef.current!.getClientRects()[0]
          } else {
            clonePagesRects.push({
              visiblePage: props.visiblePagesIndex!,
              pageRect: shapesContainerRef.current!.getClientRects()[0],
            })
          }
        }
        return { pagesRects: clonePagesRects }
      }

      updateState(updatePagesRectsFunc as any)
      if (
        document.getElementById('sn-document-viewer-pages') &&
        document.getElementById('sn-document-viewer-pages')!.getClientRects().length > 0
      ) {
        updateState({ boxBottom: document.getElementById('sn-document-viewer-pages')?.getClientRects()[0].bottom })
        updateState({ boxLeft: document.getElementById('sn-document-viewer-pages')?.getClientRects()[0].left })
        updateState({ boxRight: document.getElementById('sn-document-viewer-pages')?.getClientRects()[0].right })
        updateState({ boxTop: document.getElementById('sn-document-viewer-pages')?.getClientRects()[0].top })
      }
    }
  }, [props.visiblePagesIndex, updateState])

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
        (viewerState.boxBottom || viewerState.boxLeft || viewerState.boxRight || viewerState.boxTop)
      ) {
        ev.preventDefault()
        const shapeData = JSON.parse(ev.dataTransfer.getData('shape')) as {
          type: keyof Shapes
          shape: Shape
          offset: Dimensions
        }
        const clientRect = ev.currentTarget.getClientRects()[0]

        const newX =
          ev.pageX - shapeData.offset.width <
            viewerState.pagesRects[props.visiblePagesIndex!].pageRect.right - shapeData.shape.w * zoomRatio &&
          ev.pageX - shapeData.offset.width < viewerState.boxRight - shapeData.shape.w * zoomRatio
            ? ev.pageX - shapeData.offset.width > viewerState.pagesRects[props.visiblePagesIndex!].pageRect.left &&
              ev.pageX - shapeData.offset.width > viewerState.boxLeft
              ? ev.pageX - clientRect.left - shapeData.offset.width
              : Math.max(viewerState.pagesRects[props.visiblePagesIndex!].pageRect.left, viewerState.boxLeft) -
                clientRect.left
            : Math.min(viewerState.pagesRects[props.visiblePagesIndex!].pageRect.right, viewerState.boxRight) -
              clientRect.left -
              shapeData.shape.w * zoomRatio

        const newY =
          ev.pageY - shapeData.offset.height <
            viewerState.pagesRects[props.visiblePagesIndex!].pageRect.bottom - shapeData.shape.h * zoomRatio &&
          ev.pageY - shapeData.offset.height < viewerState.boxBottom - shapeData.shape.h * zoomRatio
            ? ev.pageY - shapeData.offset.height > viewerState.pagesRects[props.visiblePagesIndex!].pageRect.top &&
              ev.pageY - shapeData.offset.height > viewerState.boxTop
              ? ev.pageY - clientRect.top - shapeData.offset.height
              : Math.max(viewerState.pagesRects[props.visiblePagesIndex!].pageRect.top, viewerState.boxTop) -
                clientRect.top
            : Math.min(viewerState.pagesRects[props.visiblePagesIndex!].pageRect.bottom, viewerState.boxBottom) -
              clientRect.top -
              shapeData.shape.h * zoomRatio

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
      viewerState.boxBottom,
      viewerState.boxLeft,
      viewerState.boxRight,
      viewerState.boxTop,
      viewerState.pagesRects,
      zoomRatio,
    ],
  )

  return (
    <div
      ref={shapesContainerRef}
      className={classes.shapesContainer}
      onDrop={onDrop}
      onDragOver={(ev) => ev.preventDefault()}>
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
          visibleShapes.redactions.map((redaction, index) => {
            return (
              <ShapeSkeleton
                key={index}
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
          visibleShapes.annotations.map((annotation, index) => {
            return (
              <ShapeSkeleton
                key={index}
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
          visibleShapes.highlights.map((highlight, index) => {
            return (
              <ShapeSkeleton
                key={index}
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
