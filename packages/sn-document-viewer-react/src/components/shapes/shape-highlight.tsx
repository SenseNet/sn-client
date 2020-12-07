import { Highlight } from '@sensenet/client-core'
import React from 'react'
import { useDocumentPermissions } from '../..'

/**
 * Defined the component's own properties
 */
export interface ShapeHighlightProps {
  shape: Highlight
  onDragStart: (ev: React.DragEvent<HTMLElement>) => void
  onResized: (ev: React.MouseEvent<HTMLElement>) => void
  getShapeDimensions: (shape: Highlight) => React.CSSProperties
}

export const ShapeHighlight: React.FC<ShapeHighlightProps> = (props) => {
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
        overflow: 'auto',
        backgroundColor: 'yellow',
        opacity: 0.5,
      }}
    />
  )
}
