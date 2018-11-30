import IconButton from '@material-ui/core/IconButton'
import RotateLeft from '@material-ui/icons/RotateLeft'
import RotateRight from '@material-ui/icons/RotateRight'
import * as React from 'react'
import { connect } from 'react-redux'
import { PreviewImageData } from '../../models'
import { componentType, Dimensions } from '../../services'
import { RootReducerType, rotateImages, rotateShapesForPages } from '../../store'

/**
 * The amount of rotation in degrees
 */
const ROTATION_AMOUNT = 90

/**
 * Defined the component's own properties
 */
export interface OwnProps {
  page: PreviewImageData
  viewPort: Dimensions
  zoomRatio: number
}

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType, ownProps: OwnProps) => {
  return {
    rotateLeft: state.sensenetDocumentViewer.localization.rotatePageLeft,
    rotateRight: state.sensenetDocumentViewer.localization.rotatePageRight,
  }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
export const mapDispatchToProps = {
  rotateImages,
  rotateShapesForPages,
}

/**
 * Page widget component for rotating a specified page
 */
export class RotatePageComponent extends React.Component<
  componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps>
> {
  private rotatePageLeft() {
    this.props.rotateImages([this.props.page.Index], -ROTATION_AMOUNT)
    this.props.rotateShapesForPages(
      [{ index: this.props.page.Index, size: { width: this.props.page.Width, height: this.props.page.Height } }],
      -ROTATION_AMOUNT,
    )
  }

  private rotatePageRight() {
    this.props.rotateImages([this.props.page.Index], ROTATION_AMOUNT)
    this.props.rotateShapesForPages(
      [{ index: this.props.page.Index, size: { width: this.props.page.Width, height: this.props.page.Height } }],
      ROTATION_AMOUNT,
    )
  }

  /**
   * renders the component
   */
  public render() {
    return (
      <div
        style={{
          position: 'absolute',
          zIndex: 1,
          top: 0,
          right: 0,
          filter: 'drop-shadow(0 0 3px white) drop-shadow(0 0 5px white) drop-shadow(0 0 9px white)',
        }}>
        <IconButton title={this.props.rotateLeft}>
          <RotateLeft onClick={() => this.rotatePageLeft()} />
        </IconButton>

        <IconButton title={this.props.rotateRight}>
          <RotateRight onClick={() => this.rotatePageRight()} />
        </IconButton>
      </div>
    )
  }
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RotatePageComponent)

export { connectedComponent as RotatePageWidget }
