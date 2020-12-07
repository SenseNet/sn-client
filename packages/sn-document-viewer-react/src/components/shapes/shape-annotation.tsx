import { Annotation, Shapes } from '@sensenet/client-core'
import { IconButton } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import React from 'react'
import { useDocumentPermissions } from '../..'

/**
 * Defined the component's own properties
 */
export interface ShapeAnnotationProps {
  shape: Annotation
  zoomRatio: number
  focused: boolean
  onDragStart: (ev: React.DragEvent<HTMLElement>) => void
  onResized: (ev: React.MouseEvent<HTMLElement>) => void
  getShapeDimensions: (shape: Annotation) => React.CSSProperties
  updateShapeData: (shapeType: keyof Shapes, guid: string, shape: Annotation) => void
  removeShape: (shapeType: keyof Shapes, guid: string) => void
}

export const ShapeAnnotation: React.FC<ShapeAnnotationProps> = (props) => {
  const permissions = useDocumentPermissions()

  return (
    <div
      tabIndex={0}
      draggable={permissions.canEdit}
      onDragStart={props.onDragStart}
      onMouseUp={props.onResized}
      style={{
        ...props.getShapeDimensions(props.shape),
        position: 'absolute',
        resize: permissions.canEdit ? 'both' : 'none',
        overflow: 'hidden',
        backgroundColor: 'blanchedalmond',
        lineHeight: `${props.shape.lineHeight * props.zoomRatio}pt`,
        fontWeight: props.shape.fontBold as any,
        color: props.shape.fontColor,
        fontFamily: props.shape.fontFamily,
        fontSize: parseFloat(props.shape.fontSize.replace('pt', '')) * props.zoomRatio,
        fontStyle: props.shape.fontItalic as any,
        boxShadow: `${5 * props.zoomRatio}px ${5 * props.zoomRatio}px ${15 * props.zoomRatio}px rgba(0,0,0,.3)`,
        padding: `${10 * props.zoomRatio}pt`,
        boxSizing: 'border-box',
      }}>
      <div
        id="annotation-input"
        style={{ width: '100%', height: '100%', overflow: 'auto' }}
        contentEditable={permissions.canEdit ? ('plaintext-only' as any) : false}
        suppressContentEditableWarning={true}>
        {props.shape.text}
      </div>
      {props.focused ? (
        <div style={{ position: 'relative', top: `-${64 * props.zoomRatio}px` }}>
          <IconButton>
            <Delete
              style={{ color: 'black' }}
              scale={props.zoomRatio}
              onMouseUp={() => props.removeShape('annotations', props.shape.guid)}
            />
          </IconButton>
        </div>
      ) : null}
    </div>
  )
}
