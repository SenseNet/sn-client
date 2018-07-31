import { AppBar, Toolbar } from '@material-ui/core'
import React = require('react')
import { connect } from 'react-redux'
import { RootReducerType } from '../store'

import { CSSProperties } from 'react'
import { componentType } from '../services'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
const mapStateToProps = (state: RootReducerType, ownProps: {}) => {
    return {
    }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
const mapDispatchToProps = {
}

class LayoutAppBar extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, { style?: CSSProperties }>> {

    /**
     * renders the component
     */
    public render() {
        return (
            <AppBar position="sticky" style={{ position: 'relative', zIndex: 1, ...this.props.style }}>
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {this.props.children}
                </Toolbar>
            </AppBar>
        )
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(LayoutAppBar)
export { connectedComponent as LayoutAppBar }
