import { Annotation, Highlight, PreviewImageData, Redaction, Shape, Shapes } from '@sensenet/client-core'
import createStyles from '@material-ui/core/styles/createStyles'
import makeStyles from '@material-ui/core/styles/makeStyles'
import clsx from 'clsx'
import React, { useCallback } from 'react'
import { useComments, useCommentState, useDocumentData, useDocumentPermissions, useViewerState } from '../../hooks'
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
  const { documentData, updateDocumentData, forceUpdateDocumentData } = useDocumentData()
  const comments = useComments()
  const commentState = useCommentState()
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
      const newDocumentData = { ...documentData }
      ;(newDocumentData.shapes as any)[shapeType] = (newDocumentData.shapes[shapeType] as Shape[]).map((s) => {
        if (s.guid === guid) {
          return { ...s, ...shapeChange }
        }
        return s
      })

      updateDocumentData(newDocumentData)
      viewerState.updateState({ hasChanges: true })
    },
    [documentData, updateDocumentData, viewerState],
  )

  const forceUpdateShapeData = useCallback(
    (shapeType: keyof Shapes, guid: string, shapeChange: Shape | Annotation) => {
      const newDocumentData = { ...documentData }
      ;(newDocumentData.shapes as any)[shapeType] = (newDocumentData.shapes[shapeType] as Shape[]).map((s) => {
        if (s.guid === guid) {
          return { ...s, ...shapeChange }
        }
        return s
      })

      forceUpdateDocumentData(newDocumentData)
      viewerState.updateState({ hasChanges: true })
    },
    [documentData, forceUpdateDocumentData, viewerState],
  )

  const onDrop = useCallback(
    (ev: React.DragEvent<HTMLElement>) => {
      if (permissions.canEdit && ev.dataTransfer.getData('shape')) {
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
          x: (ev.clientX - boundingBox.left - shapeData.offset.width) * (1 / zoomRatio),
          y: (ev.clientY - boundingBox.top - shapeData.offset.height) * (1 / zoomRatio),
        })
      }
    },
    [permissions.canEdit, props.page.Index, updateShapeData, zoomRatio],
  )
  return (
    <div
      className={clsx(classes.shapesContainer, 'shapesContainer')}
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
                forceUpdateShapeData={forceUpdateShapeData}
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
                forceUpdateShapeData={forceUpdateShapeData}
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
                forceUpdateShapeData={forceUpdateShapeData}
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
