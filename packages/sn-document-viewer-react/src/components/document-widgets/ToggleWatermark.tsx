import IconButton from '@material-ui/core/IconButton'
import BrandingWatermark from '@material-ui/icons/BrandingWatermark'
import * as React from 'react'
import { connect } from 'react-redux'
import { componentType } from '../../services'
import { RootReducerType, setWatermark } from '../../store'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType) => {
  return {
    canHideWatermark: state.sensenetDocumentViewer.documentState.canHideWatermark,
    showWatermark: state.sensenetDocumentViewer.viewer.showWatermark,
    toggleWatermark: state.sensenetDocumentViewer.localization.toggleWatermark,
  }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
export const mapDispatchToProps = {
  setWatermark,
}

/**
 * Document widget component that toggles the displaying of the watermark
 */
export class ToggleWatermarkComponent extends React.Component<
  componentType<typeof mapStateToProps, typeof mapDispatchToProps>
> {
  private toggleWatermark() {
    this.props.setWatermark(!this.props.showWatermark)
  }

  /**
   * renders the component
   */
  public render() {
    return (
      <div style={{ display: 'inline-block' }}>
        <IconButton title={this.props.toggleWatermark} style={{ opacity: this.props.showWatermark ? 1 : 0.5 }}>
          <BrandingWatermark onClick={() => this.toggleWatermark()} />
        </IconButton>
      </div>
    )
  }
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToggleWatermarkComponent)

export { connectedComponent as ToggleWatermarkWidget }
