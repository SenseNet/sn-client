import React, { useCallback, useEffect, useState } from 'react'
import {
  Annotation,
  CommentData,
  DraftCommentMarker,
  Highlight,
  PreviewImageData,
  Redaction,
  Shape,
  Shapes,
} from '../../models'
import { Dimensions } from '../../services'
import { useDocumentData, useDocumentPermissions, useViewerState } from '../../hooks'
import { ShapeAnnotation, ShapeHighlight, ShapeRedaction } from './Shape'
import { CommentMarker, ShapesContainer } from './style'

/**
 * Defined the component's own properties
 */
export interface ShapesWidgetProps {
  viewPort: Dimensions
  page: PreviewImageData
  zoomRatio: number
  draftCommentMarker?: DraftCommentMarker
  selectedCommentId?: string
  setSelectedCommentId: (id: string) => void
}

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
// export const mapStateToProps = (state: RootReducerType, ownProps: OwnProps) => {
//   const commentMarkers = state.comments.items
//     .filter(comment => comment.page === ownProps.page.Index)
//     .map(comment => {
//       return { x: comment.x, y: comment.y, id: comment.id }
//     })
//   ownProps.draftCommentMarker && commentMarkers.push(ownProps.draftCommentMarker)
//   return {
//     showShapes: state.sensenetDocumentViewer.viewer.showShapes,
//     showRedactions: state.sensenetDocumentViewer.viewer.showRedaction,
//     showComments: state.sensenetDocumentViewer.viewer.showComments,
//     canHideRedactions: state.sensenetDocumentViewer.documentState.canHideRedaction,
//     redactions: state.sensenetDocumentViewer.documentState.document.shapes.redactions.filter(
//       r => r.imageIndex === ownProps.page.Index,
//     ) as Redaction[],
//     highlights: state.sensenetDocumentViewer.documentState.document.shapes.highlights.filter(
//       r => r.imageIndex === ownProps.page.Index,
//     ) as Highlight[],
//     annotations: state.sensenetDocumentViewer.documentState.document.shapes.annotations.filter(
//       r => r.imageIndex === ownProps.page.Index,
//     ) as Annotation[],
//     commentMarkers,
//     selectedCommentId: state.comments.selectedCommentId,
//     canEdit: state.sensenetDocumentViewer.documentState.canEdit,
//   }
// }

// /**
//  * maps state actions from the store to component props
//  * @param state the redux state
//  */
// export const mapDispatchToProps = {
//   updateShapeData,
//   setSelectedCommentId,
// }

/**
 * Page widget component for displaying shapes on a page
 */
export const ShapesWidget: React.FC<ShapesWidgetProps> = props => {
  const permissions = useDocumentPermissions()
  const viewerState = useViewerState()
  const docData = useDocumentData()

  const [shapes, setShapes] = useState({
    redactions: docData.shapes.redactions.filter(r => r.imageIndex === props.page.Index) as Redaction[],
    highlights: docData.shapes.highlights.filter(r => r.imageIndex === props.page.Index) as Highlight[],
    annotations: docData.shapes.annotations.filter(r => r.imageIndex === props.page.Index) as Annotation[],
  })

  useEffect(() => {
    setShapes({
      redactions: docData.shapes.redactions.filter(r => r.imageIndex === props.page.Index) as Redaction[],
      highlights: docData.shapes.highlights.filter(r => r.imageIndex === props.page.Index) as Highlight[],
      annotations: docData.shapes.annotations.filter(r => r.imageIndex === props.page.Index) as Annotation[],
    })
  }, [docData.shapes.annotations, docData.shapes.highlights, docData.shapes.redactions, props.page.Index])

  const [commentMarkers] = useState<CommentData[]>([])

  const updateShapeData = useCallback((..._args: any[]) => {
    //ToDo
  }, [])

  const onDrop = useCallback(
    (ev: React.DragEvent<HTMLElement>, page: PreviewImageData) => {
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
          imageIndex: page.Index,
          x: (ev.clientX - boundingBox.left - shapeData.offset.width) * (1 / props.zoomRatio),
          y: (ev.clientY - boundingBox.top - shapeData.offset.height) * (1 / props.zoomRatio),
        })
      }
    },
    [permissions.canEdit, props.zoomRatio, updateShapeData],
  )
  return (
    <ShapesContainer>
      {viewerState.showComments &&
        commentMarkers.map(marker => (
          <CommentMarker
            onClick={() => props.setSelectedCommentId(marker.id)}
            isSelected={marker.id === props.selectedCommentId}
            zoomRatio={props.zoomRatio}
            marker={marker}
            key={marker.id}
          />
        ))}
      <div onDrop={ev => onDrop(ev, props.page)} onDragOver={ev => ev.preventDefault()}>
        {permissions.canHideRedaction &&
          viewerState.showRedaction &&
          shapes.redactions.map((redaction, index) => {
            return (
              <ShapeRedaction
                shapeType="redactions"
                shape={redaction}
                canEdit={permissions.canEdit}
                zoomRatio={props.zoomRatio}
                key={index}
              />
            )
          })}

        {viewerState.showShapes &&
          shapes.annotations.map((annotation, index) => {
            return (
              <ShapeAnnotation
                shapeType="annotations"
                shape={annotation}
                canEdit={permissions.canEdit}
                zoomRatio={props.zoomRatio}
                key={index}
              />
            )
          })}

        {viewerState.showShapes &&
          shapes.highlights.map((highlight, index) => {
            return (
              <ShapeHighlight
                shapeType="highlights"
                shape={highlight}
                canEdit={permissions.canEdit}
                zoomRatio={props.zoomRatio}
                key={index}
              />
            )
          })}
      </div>
    </ShapesContainer>
  )
}
