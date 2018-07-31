import { Typography } from '@material-ui/core'
import React = require('react')
import { connect } from 'react-redux'
import { componentType } from '../services/TypeHelpers'
import { RootReducerType } from '../store'
import { LayoutAppBar } from './LayoutAppBar'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
const mapStateToProps = (state: RootReducerType, ownProps: undefined) => {
    return {
        loadingDocument: state.sensenetDocumentViewer.localization.loadingDocument,
    }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
const mapDispatchToProps = {
}

class DocumentViewerLoadingComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, undefined>> {
    /**
     * renders the component
     */
    public render() {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignContent: 'center',
                alignItems: 'center',
                height: '100%',
            }}>
                <LayoutAppBar style={{ position: 'fixed', top: 0 }} >
                    <span></span>
                </LayoutAppBar>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'column',
                    maxWidth: 500,
                    margin: '.5em 0 .6em 0',
                }}>
                    <img src="./assets/loader.gif" />
                    <Typography variant="headline" color="textSecondary" align="center" style={{ fontWeight: 'bolder' }}>
                        {this.props.loadingDocument}
                    </Typography>
                </div>
            </div >
        )
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(DocumentViewerLoadingComponent)

export { connectedComponent as DocumentViewerLoading }
