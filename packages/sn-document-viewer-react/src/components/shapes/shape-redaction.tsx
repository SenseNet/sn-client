import { Redaction } from '@sensenet/client-core'
import React from 'react'
import { useDocumentPermissions } from '../..'

/**
 * Defined the component's own properties
 */
export interface ShapeRedactionProps {
  shape: Redaction
  onDragStart: (ev: React.DragEvent<HTMLElement>) => void
  onResized: (ev: React.MouseEvent<HTMLElement>) => void
  getShapeDimensions: (shape: Redaction) => React.CSSProperties
}

export const ShapeRedaction: React.FC<ShapeRedactionProps> = (props) => {
  const permissions = useDocumentPermissions()

  return (
    <div
      tabIndex={0}
      draggable={permissions.canEdit}
      onDragStart={props.onDragStart}
      key={`r-${props.shape.h}-${props.shape.w}`}
      onMouseUp={props.onResized}
      style={{
        ...props.getShapeDimensions(props.shape),
        resize: permissions.canEdit ? 'both' : 'none',
        position: 'absolute',
        overflow: 'auto',
        backgroundColor: 'black',
      }}
    />
  )
}
