import BrandingWatermark from '@material-ui/icons/BrandingWatermark'
import React from 'react'
import { connect } from 'react-redux'
import { componentType } from '../../services'
import { RootReducerType, setWatermark } from '../../store'
import { ToggleBase } from './ToggleBase'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType) => {
  return {
    canHideWatermark: state.sensenetDocumentViewer.documentState.canHideWatermark,
    isVisible: state.sensenetDocumentViewer.viewer.showWatermark,
    title: state.sensenetDocumentViewer.localization.toggleWatermark,
  }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
export const mapDispatchToProps = {
  setValue: setWatermark,
}

/**
 * Document widget component that toggles the displaying of the watermark
 */
export const ToggleWatermarkComponent: React.FunctionComponent<
  componentType<typeof mapStateToProps, typeof mapDispatchToProps>
> = props => (
  <ToggleBase {...props}>
    <BrandingWatermark />
  </ToggleBase>
)

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToggleWatermarkComponent)

export { connectedComponent as ToggleWatermarkWidget }
