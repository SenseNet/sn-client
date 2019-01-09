import IconButton from '@material-ui/core/IconButton'
import RotateLeft from '@material-ui/icons/RotateLeft'
import RotateRight from '@material-ui/icons/RotateRight'
import * as React from 'react'
import { connect } from 'react-redux'
import { PreviewImageData } from '../../models'
import { componentType } from '../../services'
import { RootReducerType, rotateImages } from '../../store'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType) => {
  return {
    pages: state.sensenetDocumentViewer.previewImages.AvailableImages as PreviewImageData[],
    activePages: state.sensenetDocumentViewer.viewer.activePages,
    rotateDocumentLeft: state.sensenetDocumentViewer.localization.rotateDocumentLeft,
    rotateDocumentRight: state.sensenetDocumentViewer.localization.rotateDocumentRight,
  }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
export const mapDispatchToProps = {
  rotateImages,
}

/**
 * Component that allows document rotation
 */
export class RotateDocumentComponent extends React.Component<
  componentType<typeof mapStateToProps, typeof mapDispatchToProps>
> {
  private rotateDocumentLeft() {
    this.props.rotateImages(this.props.pages.map(p => p.Index), -90)
  }

  private rotateDocumentRight() {
    this.props.rotateImages(this.props.pages.map(p => p.Index), 90)
  }

  /**
   * renders the component
   */
  public render() {
    return (
      <div style={{ display: 'inline-block' }}>
        <IconButton title={this.props.rotateDocumentLeft}>
          <RotateLeft onClick={() => this.rotateDocumentLeft()} style={{ border: '2px solid', borderRadius: '5px' }} />
        </IconButton>
        <IconButton title={this.props.rotateDocumentRight}>
          <RotateRight
            onClick={() => this.rotateDocumentRight()}
            style={{ border: '2px solid', borderRadius: '5px' }}
          />
        </IconButton>
      </div>
    )
  }
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RotateDocumentComponent)

export { connectedComponent as RotateDocumentWidget }
