import { Annotation, Highlight, Redaction, Shapes } from '@sensenet/client-core'
import React, { useState } from 'react'
import { ShapeAnnotation, ShapeHighlight, ShapeRedaction, useDocumentPermissions } from '../..'
import { useViewerState } from '../../hooks'

/**
 * Defined the component's own properties
 */
export interface ShapeProps {
  shape: Redaction | Highlight | Annotation
  shapeType: keyof Shapes
  zoomRatio: number
  updateShapeData: (
    shapeType: keyof Shapes,
    guid: string,
    shape: Redaction | Highlight | Annotation,
    force?: boolean,
  ) => void
  removeShape: (shapeType: keyof Shapes, guid: string) => void
  rotationDegree: number
  visiblePagesIndex: number
}

export const ShapeSkeleton: React.FC<ShapeProps> = (props) => {
  const permissions = useDocumentPermissions()
  const viewerState = useViewerState()
  const [focused, setFocused] = useState(false)

  /**
   * Method that returns the shape dimensions as CSS properties
   * @param shape the shape instance
   * @param offsetX optional X offset
   * @param offsetY optional Y offset
   */
  const getShapeDimensions = (
    shape: Redaction | Highlight | Annotation,
    offsetX = 0,
    offsetY = 0,
  ): React.CSSProperties => {
    return {
      top: shape.y * props.zoomRatio + offsetY * props.zoomRatio,
      left: shape.x * props.zoomRatio + offsetX * props.zoomRatio,
      width: shape.w * props.zoomRatio,
      height: shape.h * props.zoomRatio,
    }
  }

  /** event that will be triggered on resize */
  const onResized = (clientRect?: DOMRect) => {
    if (
      clientRect &&
      (viewerState.boxPosition.bottom ||
        viewerState.boxPosition.left ||
        viewerState.boxPosition.right ||
        viewerState.boxPosition.top)
    ) {
      const { shape, shapeType, zoomRatio } = props

      const newSize = {
        w:
          clientRect.right < viewerState.pagesRects[props.visiblePagesIndex].pageRect.right &&
          clientRect.right < viewerState.boxPosition.right
            ? clientRect.width / zoomRatio
            : (Math.min(
                viewerState.pagesRects[props.visiblePagesIndex].pageRect.right!,
                viewerState.boxPosition.right,
              ) -
                clientRect.x) /
              zoomRatio,
        h:
          clientRect.bottom < viewerState.pagesRects[props.visiblePagesIndex].pageRect.bottom &&
          clientRect.height < viewerState.boxPosition.bottom
            ? clientRect.height / zoomRatio
            : (Math.min(
                viewerState.pagesRects[props.visiblePagesIndex].pageRect.bottom!,
                viewerState.boxPosition.bottom,
              ) -
                clientRect.y) /
              zoomRatio,
      }

      props.updateShapeData(
        shapeType,
        shape.guid,
        {
          ...(shape as any),
          w: newSize.w,
          h: newSize.h,
        },
        true,
      )
      return newSize
    }
    return undefined
  }

  /** onDragStart event handler for the Shape instance */
  const onDragStart = (ev: React.DragEvent<HTMLElement>) => {
    ev.dataTransfer.setData(
      'shape',
      JSON.stringify({
        type: props.shapeType,
        shape: props.shape,
        offset: {
          width: ev.clientX - ev.currentTarget.getBoundingClientRect().left,
          height: ev.clientY - ev.currentTarget.getBoundingClientRect().top,
        },
      }),
    )
  }

  /** onKeyPress event handler for deleting shapes */
  const handleKeyPress = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    switch (ev.key) {
      case 'Backspace':
      case 'Delete':
        permissions.canEdit && props.removeShape(props.shapeType, props.shape.guid)
        break
      default:
        break
    }
  }

  /** onFocus event handler that updates the 'focused' property */
  const onFocus = () => {
    setFocused(true)
  }

  /** onBlur event handler that updates the 'focused' property */
  const onBlur = (ev: React.FocusEvent<HTMLDivElement>) => {
    setFocused(false)
    if (props.shapeType === 'annotations') {
      props.updateShapeData('annotations', props.shape.guid, {
        ...props.shape,
        text: ev.currentTarget.innerText?.trim(),
      })
    }
  }

  return (
    <div
      onClickCapture={(ev) => ev.stopPropagation()}
      style={{ filter: focused ? 'contrast(.9) brightness(1.1)' : '' }}
      onFocus={onFocus}
      onKeyUp={(ev) => props.shapeType !== 'annotations' && handleKeyPress(ev)}
      onBlur={(ev) => props.rotationDegree === 0 && onBlur(ev)}>
      {props.shapeType === 'annotations' ? (
        <ShapeAnnotation
          shape={props.shape as Annotation}
          zoomRatio={props.zoomRatio}
          onDragStart={(ev) => props.rotationDegree === 0 && onDragStart(ev)}
          onResized={(ev) => {
            if (props.rotationDegree === 0) {
              return onResized(ev)
            } else {
              return undefined
            }
          }}
          getShapeDimensions={getShapeDimensions}
          updateShapeData={props.updateShapeData}
          removeShape={props.removeShape}
          rotationDegree={props.rotationDegree}
        />
      ) : props.shapeType === 'redactions' ? (
        <ShapeRedaction
          zoomRatio={props.zoomRatio}
          removeShape={props.removeShape}
          shape={props.shape}
          onDragStart={(ev) => props.rotationDegree === 0 && onDragStart(ev)}
          onResized={(ev) => {
            if (props.rotationDegree === 0) {
              return onResized(ev)
            } else {
              return undefined
            }
          }}
          permissions={permissions}
          dimensions={getShapeDimensions(props.shape) as any}
          rotationDegree={props.rotationDegree}
        />
      ) : (
        <ShapeHighlight
          zoomRatio={props.zoomRatio}
          removeShape={props.removeShape}
          shape={props.shape}
          onDragStart={(ev) => props.rotationDegree === 0 && onDragStart(ev)}
          onResized={(ev) => {
            if (props.rotationDegree === 0) {
              return onResized(ev)
            } else {
              return undefined
            }
          }}
          dimensions={getShapeDimensions(props.shape) as any}
          rotationDegree={props.rotationDegree}
        />
      )}
    </div>
  )
}
