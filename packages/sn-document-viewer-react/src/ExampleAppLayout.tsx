import React = require('react')
import { connect } from 'react-redux'

import { v1 } from 'uuid'
import {
  DocumentTitlePager,
  RotateActivePages,
  SearchBar,
  ToggleShapesWidget,
  ToggleThumbnailsWidget,
  ZoomInOutWidget,
} from './components/document-widgets'
import { DocumentViewer } from './components/DocumentViewer'
import { LayoutAppBar } from './components/LayoutAppBar'
import { DocumentViewerSettings } from './models/DocumentViewerSettings'
import { PreviewImageData } from './models/PreviewImageData'
import { Annotation, Highlight, Redaction, Shape } from './models/Shapes'
import { componentType } from './services'

import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Paper from '@material-ui/core/Paper'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import FolderOpen from '@material-ui/icons/FolderOpen'
import Help from '@material-ui/icons/Help'
import Send from '@material-ui/icons/Send'

import { Download } from './components/document-widgets/DownloadWidget'
import { Print } from './components/document-widgets/PrintWidget'
import { Share } from './components/document-widgets/ShareWidget'

/**
 * Adds a globally unique ID to the shape
 */
const addGuidToShape: <T extends Shape>(shape: T) => T = shape => {
  shape.guid = v1()
  return shape
}

/**
 * maps state fields from the store to component props
 */
const mapStateToProps = () => {
  return {}
}

/**
 * State model for the ExampleApp component
 */
export interface ExampleAppState {
  hostName: string
  documentIdOrPath: number | string
  isViewerOpened: boolean
  settings: DocumentViewerSettings
  isHelpOpened: boolean
  save: boolean
}

/**
 * mapDispatchToProps for the example app layout component
 */
const mapDispatchToProps = {}

/**
 * Settings object for the Document Viewer Example component
 */
export const exampleSettings: DocumentViewerSettings = new DocumentViewerSettings({
  canEditDocument: async documentData => {
    const response = await fetch(
      `${encodeURI(documentData.hostName)}/odata.svc/${encodeURI(
        documentData.idOrPath.toString(),
      )}/HasPermission?permissions=Save`,
      { method: 'GET', credentials: 'include' },
    )
    if (response.ok) {
      return (await response.text()) === 'true'
    }
    return false
  },
  saveChanges: async (documentData, pages) => {
    const reqBody = {
      Shapes: JSON.stringify([
        { redactions: documentData.shapes.redactions },
        { highlights: documentData.shapes.highlights },
        { annotations: documentData.shapes.annotations },
      ]),
      PageAttributes: JSON.stringify(
        pages
          .map(p => (p.Attributes && p.Attributes.degree && { pageNum: p.Index, options: p.Attributes }) || undefined)
          .filter(p => p !== undefined),
      ),
    }
    await fetch(`${documentData.hostName}/odata.svc/${documentData.idOrPath}`, {
      method: 'PATCH',
      body: JSON.stringify(reqBody),
      credentials: 'include',
    })
  },
  canHideWatermark: async documentData => {
    const response = await fetch(
      `${documentData.hostName}/odata.svc/${documentData.idOrPath}/HasPermission?permissions=PreviewWithoutWatermark`,
      { credentials: 'include' },
    )
    if (response.ok) {
      return (await response.text()) === 'true'
    }
    return false
  },
  canHideRedaction: async documentData => {
    const response = await fetch(
      `${documentData.hostName}/odata.svc/${documentData.idOrPath}/HasPermission?permissions=PreviewWithoutRedaction`,
      { credentials: 'include' },
    )
    if (response.ok) {
      return (await response.text()) === 'true'
    }
    return false
  },
  getExistingPreviewImages: async (documentData, version) => {
    const response = await fetch(
      `${documentData.hostName}/odata.svc/${documentData.idOrPath}/GetExistingPreviewImages?version=${version}`,
      { method: 'POST', credentials: 'include' },
    )
    const availablePreviews = ((await response.json()) as Array<PreviewImageData & { PreviewAvailable?: string }>).map(
      a => {
        if (a.PreviewAvailable) {
          a.PreviewImageUrl = `${documentData.hostName}${a.PreviewAvailable}`
          a.ThumbnailImageUrl = `${documentData.hostName}${a.PreviewAvailable.replace('preview', 'thumbnail')}`
        }
        return a
      },
    )

    const allPreviews: PreviewImageData[] = []
    for (let i = 0; i < documentData.pageCount; i++) {
      allPreviews[i] = availablePreviews[i] || ({ Index: i + 1 } as any)
      const pageAttributes = documentData.pageAttributes.find(p => p.pageNum === allPreviews[i].Index)
      allPreviews[i].Attributes = pageAttributes && pageAttributes.options
    }
    return allPreviews
  },
  isPreviewAvailable: async (documentData, version, page: number) => {
    const response = await fetch(
      `${documentData.hostName}/odata.svc/${documentData.idOrPath}/PreviewAvailable?version=${version}`,
      {
        method: 'POST',
        body: JSON.stringify({ page }),
        credentials: 'include',
      },
    )
    if (response.ok) {
      const responseBody = await response.json()
      if (responseBody.PreviewAvailable) {
        responseBody.PreviewImageUrl = `${documentData.hostName}${responseBody.PreviewAvailable}`
        responseBody.ThumbnailImageUrl = `${documentData.hostName}${responseBody.PreviewAvailable.replace(
          'preview',
          'thumbnail',
        )}`
        return responseBody as PreviewImageData
      }
    }
    return
  },
  getDocumentData: async documentData => {
    const docData = await fetch(`${documentData.hostName}/odata.svc/` + documentData.idOrPath, {
      credentials: 'include',
    })

    if (!docData.ok) {
      const e = new Error('Error fetching document')
      ;(e as any).status = docData.status
      throw e
    }

    const body = await docData.json()
    return {
      idOrPath: documentData.idOrPath,
      hostName: documentData.hostName,
      fileSizekB: body.d.Size as number,
      pageCount: body.d.PageCount,
      documentName: body.d.DisplayName,
      documentType: body.d.Type,
      shapes: (body.d.Shapes && {
        redactions: (JSON.parse(body.d.Shapes)[0].redactions as Redaction[]).map(a => addGuidToShape(a)) || [],
        annotations: (JSON.parse(body.d.Shapes)[2].annotations as Annotation[]).map(a => addGuidToShape(a)) || [],
        highlights: (JSON.parse(body.d.Shapes)[1].highlights as Highlight[]).map(a => addGuidToShape(a)) || [],
      }) || {
        redactions: [],
        annotations: [],
        highlights: [],
      },
      pageAttributes: (body.d.PageAttributes && JSON.parse(body.d.PageAttributes)) || [],
    }
  },
})

const localStorageKey = 'sn-docviewer-example'

/**
 * The default example theme
 */
export const exampleTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#ff9800',
    },
    secondary: {
      main: '#ff9800',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: 'transparent',
      },
      docked: {
        backgroundColor: '#eaeaeb',
      },
    },
    MuiToolbar: {
      root: {
        backgroundColor: '#2a2a2c',
        color: '#707070',
      },
    },
  },
  typography: {
    useNextVariants: true,
  },
})

class ExampleAppLayout extends React.Component<
  componentType<typeof mapStateToProps, typeof mapDispatchToProps, {}>,
  ExampleAppState
> {
  /** the component state */
  public state: ExampleAppState = JSON.parse(localStorage.getItem(localStorageKey) as any) || {
    hostName: '',
    documentIdOrPath: ``,
    isViewerOpened: false,
    settings: exampleSettings,
    isHelpOpened: false,
  }

  /**
   * Overridden setState() method that also persists the state in the local storage
   * @param newState The new State instance
   */
  public setState(newState: this['state']) {
    super.setState(newState)
    if (newState.save) {
      localStorage.setItem(localStorageKey, JSON.stringify(newState))
    } else {
      localStorage.removeItem(localStorageKey)
    }
  }

  private openViewer(ev: React.FormEvent<any>) {
    ev.preventDefault()
    this.setState({
      ...this.state,
      isViewerOpened: true,
    })
  }

  private closeViewer() {
    this.setState({
      ...this.state,
      isViewerOpened: false,
    })
  }

  /**
   * renders the component
   */
  public render() {
    return (
      <MuiThemeProvider theme={exampleTheme}>
        <div style={{ height: '100%' }}>
          {this.state.isViewerOpened ? (
            <DocumentViewer hostName={this.state.hostName} documentIdOrPath={this.state.documentIdOrPath}>
              <LayoutAppBar>
                <div style={{ flexShrink: 0 }}>
                  <ToggleShapesWidget />
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
                    share={doc => {
                      // tslint:disable-next-line:no-console
                      console.log('Share triggered', doc)
                    }}
                  />
                  <ZoomInOutWidget />
                  <RotateActivePages />
                </div>
                <DocumentTitlePager />
                <div style={{ flexShrink: 0 }}>
                  <SearchBar />
                </div>
              </LayoutAppBar>
            </DocumentViewer>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}>
              <Paper
                elevation={4}
                style={{
                  padding: '1.2rem',
                  flexGrow: 1,
                  maxWidth: '65%',
                }}>
                <Typography variant="h6">Document Viewer Demo</Typography>
                <Typography>Select a sensenet site and document to open.</Typography>
                <form
                  autoComplete="off"
                  autoCorrect="off"
                  onSubmit={ev => this.openViewer(ev)}
                  style={{
                    margin: '.5em',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                  <TextField
                    value={this.state.hostName}
                    onChange={ev => {
                      this.setState({ ...this.state, hostName: ev.currentTarget.value })
                    }}
                    required={true}
                    placeholder="The host URL, e.g. 'https://my-sensenet-site.org'"
                    type="url"
                    label="Host name"
                    margin="normal"
                  />
                  <TextField
                    value={this.state.documentIdOrPath}
                    onChange={ev => {
                      this.setState({ ...this.state, documentIdOrPath: ev.currentTarget.value })
                    }}
                    required={true}
                    margin="normal"
                    placeholder="The Id or full path of the document, e.g.: /Root/Sites/MySite/MyDocLib/('Example.docx')"
                    label="Document id / full path"
                  />
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row-reverse',
                      marginTop: '1em',
                    }}>
                    <Button type="submit" variant="raised" color="primary">
                      {' '}
                      <Send /> &nbsp; Open{' '}
                    </Button>
                    &nbsp;
                    <Button
                      onClick={() => this.setState({ ...this.state, isHelpOpened: true })}
                      variant="raised"
                      color="primary">
                      {' '}
                      <Help /> &nbsp; Help{' '}
                    </Button>
                    &nbsp;
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.save}
                          onChange={() => this.setState({ ...this.state, save: !this.state.save })}
                          value="checkedA"
                        />
                      }
                      label="Remember"
                    />
                  </div>
                </form>
                <Dialog open={this.state.isHelpOpened || false}>
                  <DialogTitle>Help</DialogTitle>
                  <DialogContent>
                    <Typography component="div">
                      If you have trouble opening a file be sure that
                      <ul>
                        <li>
                          you are using sensenet{' '}
                          <a href="https://community.sensenet.com/docs/install-sn-from-nuget/" target="_blank">
                            7.0+
                          </a>
                        </li>
                        <li>
                          <a href="https://community.sensenet.com/docs/cors/" target="_blank">
                            CORS
                          </a>{' '}
                          is allowed for the current host
                        </li>
                        <li>You are logged in</li>
                        <li>You have Open rights to the document</li>
                        <li>The preview images has been generated or Task Management is configured</li>
                      </ul>
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => this.setState({ ...this.state, isHelpOpened: false })}
                      variant="raised"
                      color="primary">
                      {' '}
                      Close{' '}
                    </Button>
                  </DialogActions>
                </Dialog>
              </Paper>
            </div>
          )}

          {this.state.isViewerOpened ? (
            <Button
              style={{
                position: 'fixed',
                right: '2em',
                bottom: '1em',
                zIndex: 1,
              }}
              variant="fab"
              color="secondary"
              aria-label="select another document"
              onClick={() => this.closeViewer()}>
              <FolderOpen />
            </Button>
          ) : null}
        </div>
      </MuiThemeProvider>
    )
  }
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExampleAppLayout)
export { connectedComponent as ExampleAppLayout }
