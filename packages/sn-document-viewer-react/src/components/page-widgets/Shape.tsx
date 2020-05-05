import IconButton from '@material-ui/core/IconButton'
import Delete from '@material-ui/icons/Delete'
import React from 'react'
import { Annotation, Shape, Shapes } from '@sensenet/client-core'
import { Dimensions } from '../../services'
import { ZoomMode } from '../../models/viewer-state'

/**
 * Defined the component's own properties
 */
export interface ShapeProps<T extends Shape> {
  shape: T
  shapeType: keyof Shapes
  canEdit: boolean
  zoomRatio: number
  additionalOffset?: Dimensions
  zoomMode: ZoomMode
  customZoomLevel: number
  updateShapeData: (shapeType: keyof Shapes, guid: string, shape: T) => void
  removeShape: (shapeType: keyof Shapes, guid: string) => void
}

/**
 * Class for displaying Shapes on a document page
 */
abstract class ShapeComponent<T extends Shape = Shape> extends React.Component<ShapeProps<T>> {
  /** the component state */
  public state = {
    focused: false,
    onResized: this.onResized.bind(this),
    onBlur: this.onBlur.bind(this),
    onDragStart: this.onDragStart.bind(this),
    handleKeyPress: this.handleKeyPress.bind(this),
    onFocus: this.onFocus.bind(this),
  }

  /** The type of the shape instance */
  protected abstract shapeType: keyof Shapes

  /**
   * Method that returns the shape dimensions as CSS properties
   * @param shape the shape instance
   * @param offsetX optional X offset
   * @param offsetY optional Y offset
   */
  protected getShapeDimensions(shape: Shape, offsetX = 0, offsetY = 0): React.CSSProperties {
    return {
      top: shape.y * this.props.zoomRatio + offsetY * this.props.zoomRatio,
      left: shape.x * this.props.zoomRatio + offsetX * this.props.zoomRatio,
      width: shape.w * this.props.zoomRatio,
      height: shape.h * this.props.zoomRatio,
    }
  }

  /** event that will be triggered on resize */
  protected onResized(ev: React.MouseEvent<HTMLElement>) {
    const boundingBox = ev.currentTarget.getBoundingClientRect()
    const [shape, shapeType, zoomRatio] = [this.props.shape, this.props.shapeType, this.props.zoomRatio]
    const newSize = {
      w: boundingBox.width * (1 / zoomRatio),
      h: boundingBox.height * (1 / zoomRatio),
    }
    if (Math.abs(newSize.w - shape.w) > 1 || Math.abs(newSize.h - shape.h) > 1) {
      this.props.updateShapeData(shapeType, shape.guid, {
        ...(shape as any),
        ...newSize,
      })
    }
  }

  /** onDragStart event handler for the Shape instance */
  protected onDragStart(ev: React.DragEvent<HTMLElement>) {
    const additionalOffset = this.props.additionalOffset || { width: 0, height: 0 }
    ev.dataTransfer.setData(
      'shape',
      JSON.stringify({
        type: this.shapeType,
        shape: this.props.shape,
        additionalOffset,
        offset: {
          width: ev.clientX - ev.currentTarget.getBoundingClientRect().left + additionalOffset.width,
          height: ev.clientY - ev.currentTarget.getBoundingClientRect().top + additionalOffset.height,
        },
      }),
    )
  }

  /** abstract method for shape rendering */
  public abstract renderShape(): JSX.Element

  /** onKeyPress event handler for deleting shapes */
  protected handleKeyPress(ev: React.KeyboardEvent<HTMLDivElement>) {
    switch (ev.key) {
      case 'Backspace':
      case 'Delete':
        this.props.canEdit && this.props.removeShape(this.props.shapeType, this.props.shape.guid)
        break
      // no default
    }
  }

  /** onFocus event handler that updates the 'focused' property */
  public onFocus() {
    if (!this.state.focused) {
      this.setState({ ...this.state, focused: true })
    }
  }

  /** onBlur event handler that updates the 'focused' property */
  public onBlur(ev: React.FocusEvent<HTMLDivElement>) {
    if (!ev.currentTarget.contains(ev.nativeEvent.relatedTarget as any)) {
      this.setState({ ...this.state, focused: false })
    }
  }

  /**
   * renders the component
   */
  public render() {
    return (
      <div
        onClickCapture={(ev) => ev.stopPropagation()}
        style={{ filter: this.state.focused ? 'contrast(.9) brightness(1.1)' : '' }}
        onKeyUp={this.state.handleKeyPress}
        onFocus={this.state.onFocus}
        onBlur={this.state.onBlur}>
        {this.renderShape()}
      </div>
    )
  }
}

export class ShapeRedaction extends ShapeComponent {
  /** type of the Shape */
  public readonly shapeType = 'redactions'

  /** renders the Shape component */
  public renderShape() {
    return (
      <div
        tabIndex={0}
        draggable={this.props.canEdit}
        onDragStart={this.state.onDragStart}
        key={`r-${this.props.shape.h}-${this.props.shape.w}`}
        onMouseUp={this.state.onResized}
        style={{
          ...this.getShapeDimensions(this.props.shape),
          resize: this.props.canEdit ? 'both' : 'none',
          position: 'absolute',
          overflow: 'auto',
          backgroundColor: 'black',
        }}
      />
    )
  }
}

export class ShapeAnnotation extends ShapeComponent<Annotation> {
  /** type of the Shape */
  public readonly shapeType = 'annotations'

  /** keypress handler for to stop event bubbling and shape deletion */
  protected handleKeyPress(_ev: React.KeyboardEvent<HTMLDivElement>) {
    /** */
  }

  /** onBlur handler for updating inner text */
  public onBlur(ev: React.FocusEvent<HTMLDivElement>) {
    super.onBlur(ev)
    this.props.updateShapeData(this.shapeType, this.props.shape.guid, {
      ...this.props.shape,
      text: ev.currentTarget.innerText.trim(),
    })
  }

  /** renders the Shape component */
  public renderShape() {
    return (
      <div>
        <div
          onKeyUp={(ev) => this.handleKeyPress(ev)}
          tabIndex={0}
          draggable={this.props.canEdit}
          onDragStart={this.state.onDragStart}
          onMouseUp={this.state.onResized}
          style={{
            ...this.getShapeDimensions(this.props.shape, 0, 0),
            position: 'absolute',
            resize: this.props.canEdit ? 'both' : 'none',
            overflow: 'hidden',
            backgroundColor: 'blanchedalmond',
            lineHeight: `${this.props.shape.lineHeight * this.props.zoomRatio}pt`,
            fontWeight: this.props.shape.fontBold as any,
            color: this.props.shape.fontColor,
            fontFamily: this.props.shape.fontFamily,
            fontSize: parseFloat(this.props.shape.fontSize.replace('pt', '')) * this.props.zoomRatio,
            fontStyle: this.props.shape.fontItalic as any,
            boxShadow: `${5 * this.props.zoomRatio}px ${5 * this.props.zoomRatio}px ${
              15 * this.props.zoomRatio
            }px rgba(0,0,0,.3)`,
            padding: `${10 * this.props.zoomRatio}pt`,
            boxSizing: 'border-box',
          }}>
          <div
            style={{ width: '100%', height: '100%', overflow: 'auto' }}
            contentEditable={this.props.canEdit ? ('plaintext-only' as any) : false}
            suppressContentEditableWarning={true}>
            {this.props.shape.text}
          </div>
          {this.state.focused ? (
            <div style={{ position: 'relative', top: `-${64 * this.props.zoomRatio}px` }}>
              <IconButton>
                <Delete
                  style={{ color: 'black' }}
                  scale={this.props.zoomRatio}
                  onMouseUp={() => this.props.removeShape(this.shapeType, this.props.shape.guid)}
                />
              </IconButton>
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}

export class ShapeHighlight extends ShapeComponent {
  /** type of the Shape */
  public readonly shapeType = 'highlights'

  /** renders the Highlight shape component */
  public renderShape() {
    return (
      <div
        tabIndex={0}
        draggable={this.props.canEdit}
        onDragStart={this.state.onDragStart}
        onMouseUp={this.state.onResized}
        style={{
          ...this.getShapeDimensions(this.props.shape),
          position: 'absolute',
          resize: this.props.canEdit ? 'both' : 'none',
          overflow: 'auto',
          backgroundColor: 'yellow',
          opacity: 0.5,
          // userFocus: 'all',
        }}
      />
    )
  }
}
