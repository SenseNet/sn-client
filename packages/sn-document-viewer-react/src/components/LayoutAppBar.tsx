import { AppBar, Toolbar, Typography } from 'material-ui'
import React = require('react')
import { connect } from 'react-redux'
import { RootReducerType } from '../store'

import { componentType } from '../services'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
const mapStateToProps = (state: RootReducerType, ownProps: {}) => {
    return {
        documentName: state.sensenetDocumentViewer.documentState.document.documentName,
    }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
const mapDispatchToProps = {
}

class LayoutAppBar extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, {}>> {

    /**
     * renders the component
     */
    public render() {
        return (
            <AppBar position="sticky" style={{ position: 'relative', zIndex: 1 }}>
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="title" color="inherit" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {this.props.documentName}
                    </Typography>
                    {this.props.children}
                </Toolbar>
            </AppBar>
        )
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(LayoutAppBar)
export { connectedComponent as LayoutAppBar }
