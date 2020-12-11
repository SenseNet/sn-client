import { Annotation, Highlight, Redaction, Shapes } from '@sensenet/client-core'
import { Button, createStyles, makeStyles, Paper, Popper, TextField } from '@material-ui/core'
import React, { useState } from 'react'
import { ShapeAnnotation, ShapeHighlight, ShapeRedaction, useDocumentPermissions } from '../..'

const useStyles = makeStyles(() => {
  return createStyles({
    title: {
      fontSize: '12px',
      marginRight: '6px',
    },
    textBox: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '6px',
    },
    paper: {
      padding: '10px',
      marginLeft: '10px',
      backgroundColor: 'grey',
    },
  })
})

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
  const classes = useStyles()
  const permissions = useDocumentPermissions()
  const [focused, setFocused] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [saveableFields, setSaveableFields] = useState({})

  const handleInputChange = (field: string, value: any) => {
    setSaveableFields({ ...saveableFields, [field]: value })
  }

  const open = Boolean(anchorEl)
  const id = open ? 'annotation-settings' : undefined

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

  /** onRightClick event handler that opens a popper */
  const onRightClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <div
      onClickCapture={(ev) => ev.stopPropagation()}
      style={{ filter: focused ? 'contrast(.9) brightness(1.1)' : '' }}
      onKeyUp={handleKeyPress}
      onFocus={onFocus}
      onBlur={onBlur}>
      {props.shapeType === 'annotations' ? (
        <>
          <ShapeAnnotation
            shape={props.shape as Annotation}
            zoomRatio={props.zoomRatio}
            focused={focused}
            onDragStart={onDragStart}
            onResized={onResized}
            onRightClick={onRightClick}
            getShapeDimensions={getShapeDimensions}
            updateShapeData={props.updateShapeData}
            removeShape={props.removeShape}
          />
          <Popper id={id} open={open} anchorEl={anchorEl} placement="right-start">
            <Paper className={classes.paper}>
              <form onSubmit={handleSubmit}>
                <div className={classes.textBox}>
                  <div className={classes.title}>Line height:</div>
                  <TextField
                    defaultValue={(props.shape as Annotation).lineHeight}
                    variant="outlined"
                    size="small"
                    placeholder="Line height"
                    type="number"
                    onChange={(event) => handleInputChange('lineHeight', event.target.value)}
                  />
                </div>
                <div className={classes.textBox}>
                  <div className={classes.title}>Font bold:</div>
                  <TextField
                    defaultValue={(props.shape as Annotation).fontBold}
                    variant="outlined"
                    size="small"
                    placeholder="Font bold"
                    onChange={(event) => handleInputChange('fontBold', event.target.value)}
                  />
                </div>
                <div className={classes.textBox}>
                  <div className={classes.title}>Font color:</div>
                  <TextField
                    defaultValue={(props.shape as Annotation).fontColor}
                    variant="outlined"
                    size="small"
                    placeholder="Font color"
                    onChange={(event) => handleInputChange('fontColor', event.target.value)}
                  />
                </div>
                <div className={classes.textBox}>
                  <div className={classes.title}>Font family:</div>
                  <TextField
                    defaultValue={(props.shape as Annotation).fontFamily}
                    variant="outlined"
                    size="small"
                    placeholder="Font family"
                    onChange={(event) => handleInputChange('fontFamily', event.target.value)}
                  />
                </div>
                <div className={classes.textBox}>
                  <div className={classes.title}>Font italic:</div>
                  <TextField
                    defaultValue={(props.shape as Annotation).fontItalic}
                    variant="outlined"
                    size="small"
                    placeholder="Font italic"
                    onChange={(event) => handleInputChange('fontItalic', event.target.value)}
                  />
                </div>
                <div className={classes.textBox}>
                  <div className={classes.title}>Font size:</div>
                  <TextField
                    defaultValue={(props.shape as Annotation).fontSize}
                    variant="outlined"
                    size="small"
                    placeholder="Font size"
                    onChange={(event) => handleInputChange('fontSize', event.target.value)}
                  />
                </div>
                <Button type="submit" color="primary" variant="contained">
                  Submit
                </Button>
                <Button variant="outlined" onClick={() => setAnchorEl(null)}>
                  Cancel
                </Button>
              </form>
            </Paper>
          </Popper>
        </>
      ) : props.shapeType === 'redactions' ? (
        <ShapeRedaction
          shape={props.shape}
          onDragStart={onDragStart}
          onResized={onResized}
          permissions={permissions}
          dimensions={getShapeDimensions(props.shape) as any}
        />
      ) : (
        <ShapeHighlight
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
