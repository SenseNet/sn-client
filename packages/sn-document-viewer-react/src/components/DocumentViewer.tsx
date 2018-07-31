import { SlideProps } from '@material-ui/core/Slide'
import * as React from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { InjectableAction } from 'redux-di-middleware'
import { componentType } from '../services'
import { pollDocumentData, RootReducerType } from '../store'
import { LocalizationStateType, setLocalization } from '../store/Localization'
import { DocumentViewerError } from './DocumentViewerError'
import { DocumentViewerLayout } from './DocumentViewerLayout'
import { DocumentViewerLoading } from './DocumentViewerLoading'

/**
 * Defined the component's own properties
 */
export interface OwnProps {
    hostName: string
    documentIdOrPath: string | number
    version?: string
    localization?: Partial<LocalizationStateType>
    drawerSlideProps?: Partial<SlideProps>

}

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */

const mapStateToProps = (state: RootReducerType, ownProps: OwnProps) => {
    return {
        isLoading: state.sensenetDocumentViewer.documentState.isLoading,
        idOrPath: state.sensenetDocumentViewer.documentState.document && state.sensenetDocumentViewer.documentState.document.idOrPath,
        docViewerError: state.sensenetDocumentViewer.documentState.error,
        previewImagesError: state.sensenetDocumentViewer.previewImages.error,
    }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
const mapDispatchToProps = {
    pollDocumentData: pollDocumentData as (hostName: string, idOrPath: string | number, version?: string) => InjectableAction<RootReducerType, Action>,
    setLocalization,
}

type docViewerComponentType = componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps>

/**
 * Main document viewer component
 */
class DocumentViewer extends React.Component<docViewerComponentType> {

    constructor(props: docViewerComponentType) {
        super(props)

        if (this.props.documentIdOrPath) {
            this.props.pollDocumentData(this.props.hostName, this.props.documentIdOrPath, this.props.version)
        }
        if (this.props.localization) {
            this.props.setLocalization(this.props.localization)
        }
    }

    /** triggered when the component will receive props */
    public componentWillReceiveProps(newProps: this['props']) {
        if (
            this.props.hostName !== newProps.hostName
            || this.props.documentIdOrPath !== newProps.documentIdOrPath
            || this.props.version !== newProps.version
        ) {
            this.props.pollDocumentData(this.props.hostName, this.props.documentIdOrPath, this.props.version)
        }
        if (this.props.localization) {
            this.props.setLocalization(this.props.localization)
        }

    }

    /**
     * renders the component
     */
    public render() {
        if (this.props.isLoading) {
            return <DocumentViewerLoading />
        }

        if (this.props.docViewerError || this.props.previewImagesError) {
            return <DocumentViewerError error={this.props.docViewerError || this.props.previewImagesError} />
        }
        return (<DocumentViewerLayout drawerSlideProps={this.props.drawerSlideProps}>
            {this.props.children}
        </DocumentViewerLayout>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(DocumentViewer)

export { connectedComponent as DocumentViewer }
