import { Annotation, Highlight, Redaction, Shapes } from '@sensenet/client-core'
import React, { useState } from 'react'
import { ShapeAnnotation, ShapeHighlight, ShapeRedaction, useDocumentPermissions } from '../..'

/**
 * Defined the component's own properties
 */
export interface ShapeProps {
  shape: Redaction | Highlight | Annotation
  shapeType: keyof Shapes
  zoomRatio: number
  updateShapeData: (shapeType: keyof Shapes, guid: string, shape: Redaction | Highlight | Annotation) => void
  removeShape: (shapeType: keyof Shapes, guid: string) => void
}

export const ShapeSkeleton: React.FC<ShapeProps> = (props) => {
  const permissions = useDocumentPermissions()
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
  const onResized = (ev: React.MouseEvent<HTMLElement>) => {
    const boundingBox = ev.currentTarget.getBoundingClientRect()
    const [shape, shapeType, zoomRatio] = [props.shape, props.shapeType, props.zoomRatio]
    const newSize = {
      w: boundingBox.width * (1 / zoomRatio),
      h: boundingBox.height * (1 / zoomRatio),
    }
    if (Math.abs(newSize.w - shape.w) > 1 || Math.abs(newSize.h - shape.h) > 1) {
      props.updateShapeData(shapeType, shape.guid, {
        ...(shape as any),
        ...newSize,
      })
    }
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
      onBlur={onBlur}>
      {props.shapeType === 'annotations' ? (
        <ShapeAnnotation
          shape={props.shape as Annotation}
          zoomRatio={props.zoomRatio}
          onDragStart={onDragStart}
          onResized={onResized}
          getShapeDimensions={getShapeDimensions}
          updateShapeData={props.updateShapeData}
          removeShape={props.removeShape}
        />
      ) : props.shapeType === 'redactions' ? (
        <ShapeRedaction
          zoomRatio={props.zoomRatio}
          removeShape={props.removeShape}
          shape={props.shape}
          onDragStart={onDragStart}
          onResized={onResized}
          permissions={permissions}
          dimensions={getShapeDimensions(props.shape) as any}
        />
      ) : (
        <ShapeHighlight
          zoomRatio={props.zoomRatio}
          removeShape={props.removeShape}
          shape={props.shape}
          onDragStart={onDragStart}
          onResized={onResized}
          permissions={permissions}
          dimensions={getShapeDimensions(props.shape) as any}
        />
      )}
    </div>
  )
}
