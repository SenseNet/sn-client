import { Button, Paper, Typography } from 'material-ui'
import { Refresh } from 'material-ui-icons'
import React = require('react')
import { connect } from 'react-redux'
import { componentType } from '../services/TypeHelpers'
import { RootReducerType } from '../store'

/**
 * Defined the component's own properties
 */
export interface OwnProps {
    error: any
}

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
const mapStateToProps = (state: RootReducerType, ownProps: OwnProps) => {
    return {
        errorLoadingDocument: state.sensenetDocumentViewer.localization.errorLoadingDocument,
        errorLoadingDetails: state.sensenetDocumentViewer.localization.errorLoadingDetails,
        reloadPage: state.sensenetDocumentViewer.localization.reloadPage,
    }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
const mapDispatchToProps = {
}

class DocumentViewerErrorComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps>> {
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
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <Paper elevation={4} style={{padding: '1.2rem'}}>
                        <Typography variant="headline" component="h3">
                            {this.props.errorLoadingDocument}
                        </Typography>
                        <Typography component="p">
                            {this.props.errorLoadingDetails}
                        </Typography>
                        <Typography component="p" align="center">
                            <strong>
                                {this.props.error.message}
                            </strong>
                        </Typography>
                        <div style={{textAlign: 'center', marginTop: '1em'}}>
                            <Button title={this.props.reloadPage} size="small"  onClick={() => window.location.reload()}>
                                <Refresh/>
                                {this.props.reloadPage}
                            </Button >
                        </div>
                    </Paper>
                </div>
            </div>
        )
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(DocumentViewerErrorComponent)

export { connectedComponent as DocumentViewerError }
