import { Annotation } from '@sensenet/client-core'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import React, { useEffect, useRef } from 'react'
import { useDocumentPermissions } from '../../hooks'

type Props = {
  shape: Annotation
  zoomRatio: number
  dimensions: {
    top: string | number | (string & {}) | undefined
    left: string | number | (string & {}) | undefined
    width: string | number | (string & {}) | undefined
    height: string | number | (string & {}) | undefined
  }
  onDragStart: (ev: React.DragEvent<HTMLElement>) => void
  onResized: (clientRect?: DOMRect) => void
  onRightClick: (ev: React.MouseEvent<HTMLElement>) => void
  rotationDegree: number
}

const useStyles = makeStyles<
  Theme,
  Props & {
    permissions: {
      canEdit: boolean
      canHideRedaction: boolean
      canHideWatermark: boolean
    }
  }
>(() =>
  createStyles({
    root: {
      position: 'absolute',
      resize: ({ permissions, rotationDegree }) =>
        `${permissions.canEdit && rotationDegree === 0 ? 'both' : 'none'}` as any,
      overflow: 'hidden',
      backgroundColor: 'blanchedalmond',
      lineHeight: ({ shape, zoomRatio }) => `${shape.lineHeight * zoomRatio}px`,
      fontWeight: ({ shape }) => shape.fontBold,
      color: ({ shape }) => shape.fontColor,
      fontFamily: ({ shape }) => shape.fontFamily,
      fontSize: ({ shape, zoomRatio }) => `${shape.fontSize * zoomRatio}px`,
      fontStyle: ({ shape }) => (shape.fontItalic ? 'italic' : 'normal'),
      boxShadow: ({ zoomRatio }) => `${5 * zoomRatio}px ${5 * zoomRatio}px ${15 * zoomRatio}px rgba(0,0,0,.3)`,
      padding: ({ zoomRatio }) => `${10 * zoomRatio}pt`,
      boxSizing: 'border-box',
    },
  }),
)

/**
 * Return a styled annotation wrapper component
 * @param permissions The permissions of the user
 * @param shape The arguments of the annotation
 * @param zoomRatio The ratio of the origina and virtual page
 * @param dimensions The dimensions of the annotation
 * @param onDragStart Function triggered on drag event
 * @param onResized Function triggered on resize event
 * @param onRightClick Function triggered on right click
 * @param renderChildren Function what returns the wrapped components
 * @returns styled annotation wrapper component
 */

export const AnnotationWrapper: React.FC<Props> = (props) => {
  const permissions = useDocumentPermissions()
  const classes = useStyles({ ...props, permissions })
  const annotationElement = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      props.onResized(annotationElement.current?.getClientRects()[0])
    }

    document.addEventListener('mouseup', handleGlobalMouseUp)
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [props])

  return (
    <div
      id="annotation-wrapper"
      className={classes.root}
      tabIndex={0}
      draggable={permissions.canEdit}
      onDragStart={props.onDragStart}
      onContextMenu={props.onRightClick}
      style={{
        top: props.dimensions.top,
        left: props.dimensions.left,
        width: props.dimensions.width,
        height: props.dimensions.height,
      }}
      ref={annotationElement}>
      {props.children}
    </div>
  )
}
