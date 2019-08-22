import { SlideProps } from '@material-ui/core/Slide'
import { Theme } from '@material-ui/core/styles'
import React from 'react'
import { connect } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import loaderImage from '../../assets/loader.gif'
import { defaultTheme } from '../models'
import { componentType } from '../services'
import { pollDocumentData, RootReducerType } from '../store'
import { LocalizationStateType, setLocalization } from '../store/Localization'
import { PreviewState } from '../Enums'
import { DocumentViewerError } from './DocumentViewerError'
import { DocumentViewerLayout } from './DocumentViewerLayout'
import { DocumentViewerLoading } from './DocumentViewerLoading'
import { DocumentViewerRegeneratePreviews } from './DocumentViewerRegeneratePreviews'

/**
 * Defined the component's own properties
 */
export interface OwnProps {
  hostName: string
  documentIdOrPath: string | number
  version?: string
  localization?: Partial<LocalizationStateType>
  drawerSlideProps?: Partial<SlideProps>
  loaderImage?: string
  theme?: Theme
}

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */

const mapStateToProps = (state: RootReducerType) => {
  return {
    isLoading: state.sensenetDocumentViewer.documentState.isLoading,
    idOrPath:
      state.sensenetDocumentViewer.documentState.document &&
      state.sensenetDocumentViewer.documentState.document.idOrPath,
    previewState:
      state.sensenetDocumentViewer.documentState.document &&
      state.sensenetDocumentViewer.documentState.document.pageCount,
    docViewerError: state.sensenetDocumentViewer.documentState.error,
    previewImagesError: state.sensenetDocumentViewer.previewImages.error,
  }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
const mapDispatchToProps = {
  pollDocumentData,
  setLocalization,
}

type docViewerComponentType = componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps>

/**
 * Main document viewer component
 */
export class DocumentViewerComponent extends React.Component<docViewerComponentType> {
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
      this.props.hostName !== newProps.hostName ||
      this.props.documentIdOrPath !== newProps.documentIdOrPath ||
      this.props.version !== newProps.version
    ) {
      this.props.pollDocumentData(
        newProps.hostName || this.props.hostName,
        newProps.documentIdOrPath || this.props.documentIdOrPath,
        newProps.version || this.props.version,
      )
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
      return <DocumentViewerLoading image={this.props.loaderImage || loaderImage} />
    }

    if (this.props.previewState === PreviewState.Postponed) {
      return <DocumentViewerRegeneratePreviews />
    }

    const isPreviewError = this.props.previewState !== -1 && this.props.previewState < 1
    if (this.props.docViewerError || this.props.previewImagesError || isPreviewError) {
      return <DocumentViewerError error={this.props.docViewerError || this.props.previewImagesError} />
    }
    return (
      <ThemeProvider theme={this.props.theme || defaultTheme}>
        <DocumentViewerLayout drawerSlideProps={this.props.drawerSlideProps}>
          {this.props.children}
        </DocumentViewerLayout>
      </ThemeProvider>
    )
  }
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DocumentViewerComponent)

export { connectedComponent as DocumentViewer }
