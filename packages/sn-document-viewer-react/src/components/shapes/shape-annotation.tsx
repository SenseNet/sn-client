import {
  Button,
  Checkbox,
  ClickAwayListener,
  createStyles,
  makeStyles,
  Paper,
  Popper,
  TextField,
  Theme,
} from '@material-ui/core'
import grey from '@material-ui/core/colors/grey.js'
import { Delete } from '@material-ui/icons'
import { Annotation, Shapes } from '@sensenet/client-core'
import React, { useState } from 'react'
import { AnnotationWrapper, useDocumentPermissions } from '../..'
import { useLocalization, useViewerState } from '../../hooks'

type Props = {
  rotationDegree: number
}

const useStyles = makeStyles<Theme, Props>((theme: Theme) => {
  return createStyles({
    annotationInput: {
      width: '100%',
      height: '100%',
      overflow: 'auto',
      '&:focus': {
        outline: 'none',
      },
      writingMode: ({ rotationDegree }) => (rotationDegree === 0 || rotationDegree === 180 ? 'unset' : 'vertical-rl'),
      transform: ({ rotationDegree }) => (rotationDegree === 180 || rotationDegree === 270 ? 'rotate(180deg)' : 'none'),
    },
    title: {
      fontSize: '12px',
      marginRight: '6px',
    },
    textBox: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '6px',
    },
    textField: {
      width: '55px',
    },
    paper: {
      padding: '10px',
      marginLeft: '10px',
      border: `solid ${grey[600]} 2px`,
    },
    button: {
      backgroundColor: theme.palette.error.light,
    },
  })
})

/**
 * Defined the component's own properties
 */
export interface ShapeAnnotationProps {
  shape: Annotation
  zoomRatio: number
  onDragStart: (ev: React.DragEvent<HTMLElement>) => void
  onResized: (clientRect?: DOMRect) => undefined | { w: number; h: number }
  getShapeDimensions: (shape: Annotation) => React.CSSProperties
  updateShapeData: (shapeType: keyof Shapes, guid: string, shape: Annotation) => void
  removeShape: (shapeType: keyof Shapes, guid: string) => void
  rotationDegree: number
}

export const ShapeAnnotation: React.FC<ShapeAnnotationProps> = (props) => {
  const viewerState = useViewerState()
  const rotationDegree =
    viewerState.rotation?.find((rotation) => rotation.pageNum === props.shape.imageIndex)?.degree || 0
  const classes = useStyles({ rotationDegree })
  const localization = useLocalization()
  const permissions = useDocumentPermissions()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const id = open ? 'annotation-settings' : undefined

  const getDimensions = () => {
    const dimensions = props.getShapeDimensions(props.shape)
    return { top: dimensions.top, left: dimensions.left, width: dimensions.width, height: dimensions.height }
  }

  const onRightClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  return (
    <>
      <AnnotationWrapper
        shape={props.shape}
        zoomRatio={props.zoomRatio}
        dimensions={getDimensions()}
        onRightClick={onRightClick}
        onDragStart={props.onDragStart}
        onResized={props.onResized}
        rotationDegree={props.rotationDegree}>
        <div
          id="annotation-input"
          className={classes.annotationInput}
          contentEditable={permissions.canEdit && rotationDegree === 0 ? ('plaintext-only' as any) : false}
          suppressContentEditableWarning={true}>
          {props.shape.text}
        </div>
      </AnnotationWrapper>
      <Popper id={id} open={open} anchorEl={anchorEl} placement="right-start">
        <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
          <Paper className={classes.paper}>
            <div className={classes.textBox}>
              <div className={classes.title}>Line height:</div>
              <TextField
                className={classes.textField}
                defaultValue={props.shape.lineHeight}
                size="small"
                placeholder="Line height"
                type="number"
                onChange={(event) =>
                  props.updateShapeData('annotations', props.shape.guid, {
                    ...(props.shape as any),
                    lineHeight: parseInt(event.target.value, 10),
                  })
                }
              />
              <div className={classes.title}>px</div>
            </div>
            <div className={classes.textBox}>
              <div className={classes.title}>Font size:</div>
              <TextField
                className={classes.textField}
                defaultValue={props.shape.fontSize}
                size="small"
                placeholder="Font size"
                type="number"
                onChange={(event) =>
                  props.updateShapeData('annotations', props.shape.guid, {
                    ...(props.shape as any),
                    fontSize: parseInt(event.target.value, 10),
                  })
                }
              />
              <div className={classes.title}>px</div>
            </div>
            <div className={classes.textBox}>
              <div className={classes.title}>Font bold:</div>
              <TextField
                className={classes.textField}
                defaultValue={props.shape.fontBold}
                size="small"
                placeholder="Font bold"
                type="number"
                onChange={(event) =>
                  props.updateShapeData('annotations', props.shape.guid, {
                    ...(props.shape as any),
                    fontBold: parseInt(event.target.value, 10),
                  })
                }
              />
            </div>
            <div className={classes.textBox}>
              <div className={classes.title}>Font color:</div>
              <TextField
                className={classes.textField}
                defaultValue={props.shape.fontColor}
                size="small"
                placeholder="Font color"
                type="color"
                onChange={(event) =>
                  props.updateShapeData('annotations', props.shape.guid, {
                    ...(props.shape as any),
                    fontColor: event.target.value,
                  })
                }
              />
            </div>
            <div className={classes.textBox}>
              <div className={classes.title}>Font italic:</div>
              <Checkbox
                checked={props.shape.fontItalic}
                onChange={(event) =>
                  props.updateShapeData('annotations', props.shape.guid, {
                    ...(props.shape as any),
                    fontItalic: event.target.checked,
                  })
                }
                name="fontItalic"
                color="primary"
              />
            </div>
            <div className={classes.textBox} style={{ justifyContent: 'center' }}>
              <Button
                variant="contained"
                className={classes.button}
                onMouseUp={() => props.removeShape('annotations', props.shape.guid)}
                startIcon={<Delete scale={props.zoomRatio} />}>
                {localization.delete}
              </Button>
            </div>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  )
}
