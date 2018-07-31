import { IconButton } from '@material-ui/core'
import { Dashboard } from '@material-ui/icons'
import * as React from 'react'
import { connect } from 'react-redux'
import { componentType } from '../../services'
import { RootReducerType, setShapes } from '../../store'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType) => {
    return {
        showShapes: state.sensenetDocumentViewer.viewer.showShapes,
        toggleShapes: state.sensenetDocumentViewer.localization.toggleShapes,
    }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
export const mapDispatchToProps = {
    setShapes,
}

/**
 * Document widget component that toggles the displaying of the shapes
 */
export class ToggleShapesComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps>> {

    private toggleShapes() {
        this.props.setShapes(!this.props.showShapes)
    }

    /**
     * renders the component
     */
    public render() {
        return (
            <div style={{ display: 'inline-block' }}>
                <IconButton title={this.props.toggleShapes} style={{ opacity: this.props.showShapes ? 1 : 0.5 }}>
                    <Dashboard onClick={() => this.toggleShapes()} />
                </IconButton>
            </div>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(ToggleShapesComponent)

export { connectedComponent as ToggleShapesWidget }
