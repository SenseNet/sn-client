import IconButton from '@material-ui/core/IconButton'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import Typography from '@material-ui/core/Typography'

import {
  defaultTheme,
  DocumentTitlePager,
  DocumentViewer,
  Download,
  LayoutAppBar,
  Print,
  RotateActivePages,
  SearchBar,
  Share,
  ToggleCommentsWidget,
  ToggleThumbnailsWidget,
  ZoomInOutWidget,
} from '@sensenet/document-viewer-react'
import { Icon, iconType } from '@sensenet/icons-react'
import { compile } from 'path-to-regexp'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { openDialog } from '../Actions'
import { rootStateType } from '../store/rootReducer'
import ShareDialog from './Dialogs/ShareDialog'

// tslint:disable-next-line:no-var-requires
const loaderImage = require('../assets/viewer-loader.gif')

const mapStateToProps = (state: rootStateType) => ({
  hostName: state.sensenet.session.repository ? state.sensenet.session.repository.repositoryUrl : '',
  documentName: state.sensenetDocumentViewer.sensenetDocumentViewer.documentState.document.documentName,
  currentContent: state.dms.documentLibrary.items.d.results.find(
    i => i.Id === state.sensenetDocumentViewer.sensenetDocumentViewer.documentState.document.idOrPath,
  ),
})

export const mapDispatchToProps = {
  openDialog,
}

// tslint:disable-next-line:no-empty-interface
export interface DmsViewerProps extends RouteComponentProps<any> {
  /**/
}

// tslint:disable-next-line:no-empty-interface
export interface DmsViewerState {
  documentId: number
}

export class DmsViewerComponent extends React.Component<
  DmsViewerProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  DmsViewerState
> {
  public state = { documentId: 0 }

  public static getDerivedStateFromProps(
    newProps: DmsViewerComponent['props'],
    lastState: DmsViewerComponent['state'],
  ) {
    let documentId = 0
    try {
      documentId = parseInt(
        newProps.match.params.documentId && atob(decodeURIComponent(newProps.match.params.documentId)),
        10,
      )
    } catch (error) {
      /** Cannot parse current folder from URL */
      const newPath = compile(newProps.match.path)({ prefix: newProps.match.params.prefix })
      newProps.history.push(newPath)
    }
    return {
      ...lastState,
      documentId,
    }
  }

  public keyboardHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      const previewIndex = this.props.location.pathname.indexOf('/preview/')
      if (previewIndex !== -1) {
        this.props.history.push(this.props.location.pathname.substring(0, previewIndex))
      }
      // this.props.closeViewer()
    }
  }

  constructor(props: DmsViewerComponent['props']) {
    super(props)
    this.keyboardHandler = this.keyboardHandler.bind(this)
  }

  public componentDidMount() {
    document.addEventListener('keydown', this.keyboardHandler, false)
  }
  public componentWillUnmount() {
    document.removeEventListener('keydown', this.keyboardHandler, false)
  }

  public render() {
    return (
      <div
        style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          zIndex: 1299,
        }}>
        <div
          className="overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(238,238,238,.8)',
            filter: 'blur(5px)',
            backdropFilter: 'blur(5px)',
          }}
        />
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
          <MuiThemeProvider theme={defaultTheme}>
            <DocumentViewer
              documentIdOrPath={this.state.documentId}
              hostName={this.props.hostName}
              loaderImage={loaderImage}>
              <MediaQuery minDeviceWidth={700}>
                {matches =>
                  matches ? (
                    <div>
                      <LayoutAppBar>
                        <div style={{ flexShrink: 0 }}>
                          <ToggleThumbnailsWidget />
                          <Download
                            download={doc => {
                              // tslint:disable-next-line:no-console
                              console.log('Download triggered', doc)
                            }}
                          />
                          <Print
                            print={doc => {
                              // tslint:disable-next-line:no-console
                              console.log('Print triggered', doc)
                            }}
                          />
                          <Share
                            share={() => {
                              // tslint:disable-next-line:no-console
                              // console.log('Share triggered', doc)
                              this.props.openDialog(<ShareDialog currentContent={this.props.currentContent || null} />)
                            }}
                          />
                          <ZoomInOutWidget />
                          <RotateActivePages />
                        </div>
                        <DocumentTitlePager />
                        <div style={{ display: 'flex', flexShrink: 0 }}>
                          <ToggleCommentsWidget />
                          <SearchBar />
                        </div>
                      </LayoutAppBar>
                    </div>
                  ) : (
                    <div>
                      <LayoutAppBar>
                        <Typography variant="h6" color="inherit">
                          {this.props.documentName}
                        </Typography>
                        <div>
                          <Share
                            share={() => {
                              this.props.openDialog(<ShareDialog currentContent={this.props.currentContent || null} />)
                            }}
                          />
                          <IconButton color="inherit">
                            <Icon iconName="search" type={iconType.materialui} />
                          </IconButton>
                        </div>
                      </LayoutAppBar>
                    </div>
                  )
                }
              </MediaQuery>
            </DocumentViewer>
          </MuiThemeProvider>
        </div>
      </div>
    )
  }
}

const connectedComponent = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(DmsViewerComponent),
)
export { connectedComponent as DmsViewer }
