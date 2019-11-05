import {
  defaultTheme,
  DocumentTitlePager,
  DocumentViewer,
  Download,
  LayoutAppBar,
  Print,
  RotateActivePagesWidget,
  SearchBar,
  Share,
  ToggleCommentsWidget,
  ToggleThumbnailsWidget,
  ZoomInOutWidget,
} from '@sensenet/document-viewer-react'
import React, { useCallback, useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { IconButton, MuiThemeProvider } from '@material-ui/core'
import MediaQuery from 'react-responsive'
import { Icon, iconType } from '@sensenet/icons-react'

const DocViewer: React.FunctionComponent<
  RouteComponentProps<{ documentId: string }> & {
    previousLocation?: string
  }
> = props => {
  const documentId = parseInt(
    props.match.params.documentId && atob(decodeURIComponent(props.match.params.documentId)),
    10,
  )
  const closeViewer = useCallback(() => {
    props.previousLocation ? props.history.push(props.previousLocation) : props.history.goBack()
  }, [props.history, props.previousLocation])

  useEffect(() => {
    const keyboardHandler = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }
      closeViewer()
    }

    document.addEventListener('keydown', keyboardHandler, false)
    return () => {
      document.removeEventListener('keydown', keyboardHandler, false)
    }
  }, [closeViewer, props])

  if (isNaN(documentId)) {
    throw Error(`Invalid document Id: ${documentId}`)
  }

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
          <DocumentViewer documentIdOrPath={documentId}>
            <MediaQuery minDeviceWidth={700}>
              {matches =>
                matches ? (
                  <div>
                    <LayoutAppBar>
                      <div style={{ flexShrink: 0 }}>
                        <ToggleThumbnailsWidget />
                        <Download
                          download={doc => {
                            console.log('Download triggered', doc)
                          }}
                        />
                        <Print
                          print={doc => {
                            console.log('Print triggered', doc)
                          }}
                        />
                        <Share
                          share={() => {
                            // console.log('Share triggered', doc)
                            // props.openDialog(<ShareDialog currentContent={props.currentContent || null} />)
                          }}
                        />
                        <ZoomInOutWidget />
                        <RotateActivePagesWidget />
                      </div>
                      <DocumentTitlePager />
                      <div style={{ display: 'flex', flexShrink: 0 }}>
                        <ToggleCommentsWidget />
                        <SearchBar />
                        <IconButton color="inherit" onClick={() => closeViewer()}>
                          <Icon iconName="close" type={iconType.materialui} />
                        </IconButton>
                      </div>
                    </LayoutAppBar>
                  </div>
                ) : (
                  <div>
                    <LayoutAppBar>
                      {/* <Typography variant="h6" color="inherit">
                      {props.documentName}
                    </Typography> */}
                      <div>
                        <Share
                          share={() => {
                            // this.props.openDialog(<ShareDialog currentContent={this.props.currentContent || null} />)
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

const extendedComponent = withRouter(DocViewer)

export default extendedComponent
