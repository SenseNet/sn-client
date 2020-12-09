import { Annotation, Shapes } from '@sensenet/client-core'
import { createStyles, IconButton, makeStyles } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import React from 'react'
import { AnnotationWrapper, useDocumentPermissions } from '../..'

const useStyles = makeStyles(() => {
  return createStyles({
    annotationInput: {
      width: '100%',
      height: '100%',
      overflow: 'auto',
    },
  })
})

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
  const classes = useStyles()
  const permissions = useDocumentPermissions()

  const getDimensions = () => {
    const dimensions = props.getShapeDimensions(props.shape)
    return { top: dimensions.top, left: dimensions.left, width: dimensions.width, height: dimensions.height }
  }

  return (
    <AnnotationWrapper
      permissions={permissions}
      shape={props.shape}
      zoomRatio={props.zoomRatio}
      dimensions={getDimensions()}
      renderChildren={() => (
        <>
          <div
            id="annotation-input"
            className={classes.annotationInput}
            contentEditable={permissions.canEdit ? ('plaintext-only' as any) : false}
            suppressContentEditableWarning={true}>
            {props.shape.text}
          </div>

          <div style={{ position: 'relative', top: `-${64 * props.zoomRatio}px` }}>
            <IconButton>
              <Delete
                style={{ color: 'black' }}
                scale={props.zoomRatio}
                onMouseUp={() => props.removeShape('annotations', props.shape.guid)}
              />
            </IconButton>
          </div>
        </>
      )}
      onDragStart={props.onDragStart}
      onResized={props.onResized}
    />
  )
}
