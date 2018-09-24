import IconButton from '@material-ui/core/IconButton'
import Share from '@material-ui/icons/Share'
import * as React from 'react'
import { connect } from 'react-redux'
import { DocumentData } from '../../models'
import { componentType } from '../../services'
import { RootReducerType } from '../../store'

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
export const mapStateToProps = (state: RootReducerType) => {
    return {
        title: state.sensenetDocumentViewer.localization.share,
        document: state.sensenetDocumentViewer.documentState.document,
    }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
export const mapDispatchToProps = {

}

/**
 * Own properties for the Share component
 */
export interface OwnProps {
    share: (document: DocumentData) => void
}

/**
 * Component that allows active page rotation
 */
export class ShareComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps>> {

    /**
     * renders the component
     */
    public render() {
        return (
            <div style={{ display: 'inline-block' }}>
                <IconButton color="inherit" title={this.props.title}>
                    <Share onClick={() => this.props.share(this.props.document)} />
                </IconButton>
            </div>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(ShareComponent)

export { connectedComponent as Share }
