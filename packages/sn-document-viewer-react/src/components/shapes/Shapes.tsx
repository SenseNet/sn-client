import { Annotation, Highlight, PreviewImageData, Redaction, Shape, Shapes } from '@sensenet/client-core'
import React, { useCallback } from 'react'
import { useComments, useCommentState, useDocumentData, useDocumentPermissions, useViewerState } from '../../hooks'
import { Dimensions } from '../../services'
import { ShapeSkeleton } from '../shapes'
import { CommentMarker } from './style'

/**
 * Defined the component's own properties
 */
export interface ShapesWidgetProps {
  page: PreviewImageData
  zoomRatio: number
}

/**
 * Page widget component for displaying shapes on a page
 */
export const ShapesWidget: React.FC<ShapesWidgetProps> = (props) => {
  const permissions = useDocumentPermissions()
  const viewerState = useViewerState()
  const { documentData, updateDocumentData } = useDocumentData()
  const comments = useComments()
  const commentState = useCommentState()

  const visibleShapes = {
    redactions: documentData.shapes.redactions.filter((r) => r.imageIndex === props.page.Index) as Redaction[],
    highlights: documentData.shapes.highlights.filter((r) => r.imageIndex === props.page.Index) as Highlight[],
    annotations: documentData.shapes.annotations.filter((r) => r.imageIndex === props.page.Index) as Annotation[],
  }

  const visibleComments = [
    ...comments.comments.filter((comment) => comment.page === props.page.Index),
    ...(props.page.Index !== undefined && commentState.draft?.page === props.page?.Index ? [commentState.draft] : []),
  ]

  const removeShape = useCallback(
    (shapeType: keyof Shapes, guid: string) => {
      ;(documentData.shapes as any)[shapeType] = documentData.shapes[shapeType].filter((s) => s.guid !== guid)
      updateDocumentData(documentData)
      viewerState.updateState({ hasChanges: true })
    },
    [documentData, updateDocumentData, viewerState],
  )

  const updateShapeData = useCallback(
    (shapeType: keyof Shapes, guid: string, shapeChange: Shape | Annotation) => {
      ;(documentData.shapes as any)[shapeType] = (documentData.shapes[shapeType] as Shape[]).map((s) => {
        if (s.guid === guid) {
          return { ...s, ...shapeChange }
        }
        return s
      })
      viewerState.updateState({ hasChanges: true })
      updateDocumentData(documentData)
    },
    [documentData, updateDocumentData, viewerState],
  )

  const onDrop = useCallback(
    (ev: React.DragEvent<HTMLElement>) => {
      if (permissions.canEdit) {
        ev.preventDefault()
        const shapeData = JSON.parse(ev.dataTransfer.getData('shape')) as {
          type: keyof Shapes
          shape: Shape
          offset: Dimensions
        }
        const boundingBox = ev.currentTarget.getBoundingClientRect()
        updateShapeData(shapeData.type, shapeData.shape.guid, {
          ...shapeData.shape,
          imageIndex: props.page.Index,
          x: (ev.clientX - boundingBox.left - shapeData.offset.width) * (1 / props.zoomRatio),
          y: (ev.clientY - boundingBox.top - shapeData.offset.height) * (1 / props.zoomRatio),
        })
      }
    },
    [permissions.canEdit, props.page.Index, props.zoomRatio, updateShapeData],
  )
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
      }}
      onDrop={onDrop}
      onDragOver={(ev) => ev.preventDefault()}>
      {viewerState.showComments &&
        visibleComments.length > 0 &&
        visibleComments.map((marker) => (
          <CommentMarker
            onClick={() => commentState.setActiveComment(marker.id)}
            isSelected={marker.id === commentState.activeCommentId}
            zoomRatio={props.zoomRatio}
            marker={marker}
            key={marker.id}
          />
        ))}
      <div>
        {permissions.canHideRedaction &&
          viewerState.showRedaction &&
          visibleShapes.redactions.map((redaction, index) => {
            return (
              <ShapeSkeleton
                key={index}
                shape={redaction}
                shapeType="redactions"
                zoomRatio={props.zoomRatio}
                updateShapeData={updateShapeData}
                removeShape={removeShape}
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
                zoomRatio={props.zoomRatio}
                updateShapeData={updateShapeData}
                removeShape={removeShape}
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
                zoomRatio={props.zoomRatio}
                updateShapeData={updateShapeData}
                removeShape={removeShape}
              />
            )
          })}
      </div>
    </div>
  )
}
