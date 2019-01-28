import PictureInPicture from '@material-ui/icons/PictureInPicture'
import React from 'react'
import { connect } from 'react-redux'
import { componentType } from '../../services'
import { RootReducerType, setRedaction } from '../../store'
import { ToggleBase } from './ToggleBase'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType) => {
  return {
    canHideRedaction: state.sensenetDocumentViewer.documentState.canHideRedaction,
    isVisible: state.sensenetDocumentViewer.viewer.showShapes,
    showRedaction: state.sensenetDocumentViewer.viewer.showRedaction,
    title: state.sensenetDocumentViewer.localization.toggleRedaction,
  }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
export const mapDispatchToProps = {
  setValue: setRedaction,
}

/**
 * Document widget component to toggleing redaction
 */
export const ToggleRedactionComponent: React.FunctionComponent<
  componentType<typeof mapStateToProps, typeof mapDispatchToProps>
> = props => (
  <ToggleBase {...props}>
    <PictureInPicture />
  </ToggleBase>
)

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToggleRedactionComponent)

// todo: disabled to state.sensenetDocumentViewer.documentState.canHideRedaction
export { connectedComponent as ToggleRedactionWidget }
