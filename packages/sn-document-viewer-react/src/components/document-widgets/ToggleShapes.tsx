import Dashboard from '@material-ui/icons/Dashboard'
import React from 'react'
import { connect } from 'react-redux'
import { componentType } from '../../services'
import { RootReducerType, setShapes } from '../../store'
import { ToggleBase } from './ToggleBase'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType) => {
  return {
    isVisible: state.sensenetDocumentViewer.viewer.showShapes,
    title: state.sensenetDocumentViewer.localization.toggleShapes,
  }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
export const mapDispatchToProps = {
  setValue: setShapes,
}

/**
 * Document widget component that toggles the displaying of the shapes
 */
export const ToggleShapesComponent: React.FunctionComponent<
  componentType<typeof mapStateToProps, typeof mapDispatchToProps>
> = props => (
  <ToggleBase {...props}>
    <Dashboard />
  </ToggleBase>
)

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToggleShapesComponent)

export { connectedComponent as ToggleShapesWidget }
