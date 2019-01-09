import IconButton from '@material-ui/core/IconButton'
import PictureInPicture from '@material-ui/icons/PictureInPicture'
import * as React from 'react'
import { connect } from 'react-redux'
import { componentType } from '../../services'
import { RootReducerType, setRedaction } from '../../store'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType) => {
  return {
    canHideRedaction: state.sensenetDocumentViewer.documentState.canHideRedaction,
    showShapes: state.sensenetDocumentViewer.viewer.showShapes,
    showRedaction: state.sensenetDocumentViewer.viewer.showRedaction,
    toggleRedaction: state.sensenetDocumentViewer.localization.toggleRedaction,
  }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
export const mapDispatchToProps = {
  setRedaction,
}

/**
 * Document widget component to toggleing redaction
 */
export class ToggleRedactionComponent extends React.Component<
  componentType<typeof mapStateToProps, typeof mapDispatchToProps>
> {
  private toggleRedaction() {
    this.props.setRedaction(!this.props.showRedaction)
  }

  /**
   * renders the component
   */
  public render() {
    return (
      <div style={{ display: 'inline-block' }}>
        <IconButton title={this.props.toggleRedaction} style={{ opacity: this.props.showRedaction ? 1 : 0.5 }}>
          <PictureInPicture onClick={() => this.toggleRedaction()} />
        </IconButton>
      </div>
    )
  }
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToggleRedactionComponent)

// todo: disabled to state.sensenetDocumentViewer.documentState.canHideRedaction
export { connectedComponent as ToggleRedactionWidget }
