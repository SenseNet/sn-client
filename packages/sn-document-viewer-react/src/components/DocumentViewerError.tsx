import Typography from '@material-ui/core/Typography'
import { toNumber } from '@sensenet/client-utils'
import React = require('react')
import { connect } from 'react-redux'
import { PreviewState } from '../Enums'
import { componentType } from '../services/TypeHelpers'
import { RootReducerType } from '../store'
import { LayoutAppBar } from './LayoutAppBar'

/**
 * Defined the component's own properties
 */
export interface OwnProps {
  error: any
}

/**
 * State type for the Document Viewer Error component
 */
export interface ErrorState {
  message: string
  details: string
}

/**
 * Gets the preview state form the document's page count
 * @param {RootReducerType} state
 * @returns {number} page count that can be compared to PreviewState
 */
export function getPreviewState(state: RootReducerType): number {
  if (
    state.sensenetDocumentViewer.documentState.document &&
    state.sensenetDocumentViewer.documentState.document.idOrPath
  ) {
    // toNumber will return with a number because we added a default value
    return toNumber(state.sensenetDocumentViewer.documentState.document.pageCount, PreviewState.Loading)!
  }
  return PreviewState.Loading
}

/**
 * maps state fields from the store to component props
 * @param state the redux state
 */
const mapStateToProps = (state: RootReducerType, ownProps: OwnProps) => {
  return {
    previewState: getPreviewState(state),
    errorLoadingDocument: state.sensenetDocumentViewer.localization.errorLoadingDocument,
    errorLoadingDetails: state.sensenetDocumentViewer.localization.errorLoadingDetails,
    reloadPage: state.sensenetDocumentViewer.localization.reloadPage,
  }
}

/**
 * maps state actions from the store to component props
 * @param state the redux state
 */
const mapDispatchToProps = {}

class DocumentViewerErrorComponent extends React.Component<
  componentType<typeof mapStateToProps, typeof mapDispatchToProps, OwnProps>,
  ErrorState
> {
  /**
   * The state object for the Error component
   */
  public state: ErrorState = { message: '', details: '' }

  /**
   * Returns a derived state from the props
   */
  public static getDerivedStateFromProps(props: DocumentViewerErrorComponent['props']) {
    const stateMessageValue =
      props.errorLoadingDocument &&
      props.errorLoadingDocument.find(
        a => (props.error && props.error.status && a.code === props.error.status) || a.state === props.previewState,
      )
    return {
      message: (stateMessageValue && stateMessageValue.message) || '',
      details: (stateMessageValue && stateMessageValue.details) || '',
    }
  }

  /**
   * renders the component
   */
  public render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}>
        <LayoutAppBar style={{ position: 'fixed', top: 0 }}>
          <span />
        </LayoutAppBar>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'column',
            maxWidth: 500,
            margin: '.5em 0 .6em 0',
          }}>
          <svg width="442px" height="290px" viewBox="0 0 442 240" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g id="No-provider" transform="translate(-9.000000, 5.000000)">
                <g id="Document" transform="translate(9.000000, 0.000000)">
                  <ellipse id="Oval-2" fill="#DFDFDF" cx="221" cy="230" rx="221" ry="27" />
                  <path
                    d="M129.868875,229.165007 L129.868875,6.81087018 C129.868875,3.49716168 132.555166,0.810870179 135.868875,0.810870179 L262.245476,0.810870179 C263.836775,0.810870179 265.362898,1.44301122 266.488117,2.56822949 L311.211391,47.2915035 C312.336609,48.4167218 312.96875,49.9428453 312.96875,51.5341442 L312.96875,229.724935 C312.96875,233.038644 310.282458,235.724935 306.96875,235.724935 C306.962205,235.724935 306.95566,235.724924 306.949115,235.724903 L135.84924,235.164975 C132.543214,235.154156 129.868875,232.47105 129.868875,229.165007 Z"
                    id="Path"
                    stroke="#A4A8AD"
                    strokeWidth="11"
                    fill="#EEEEEE"
                  />
                  <ellipse id="Oval" fill="#A4A8AD" cx="184" cy="120.5" rx="9" ry="10.5" />
                  <ellipse id="Oval-Copy" fill="#A4A8AD" cx="259" cy="120.5" rx="9" ry="10.5" />
                  <path
                    d="M203.877833,155.306526 C215.78965,143.944752 227.408534,143.944752 238.734486,155.306526"
                    id="Path-2"
                    stroke="#A4A8AD"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M262.50809,3.20349862 L262.50809,46.2114256 C262.50809,47.3159951 263.40352,48.2114256 264.50809,48.2114256 L308.124241,48.2114256"
                    id="Path-2"
                    stroke="#A4A8AD"
                    strokeWidth="11"
                  />
                </g>
              </g>
            </g>
          </svg>
          <Typography variant="headline" color="textSecondary" align="center" style={{ fontWeight: 'bolder' }}>
            {this.state.message}
          </Typography>
          <Typography variant="subheading" color="textSecondary" align="center" style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.details}
          </Typography>
        </div>
      </div>
    )
  }
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DocumentViewerErrorComponent)

export { connectedComponent as DocumentViewerError }
