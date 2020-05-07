import React from 'react'
import {
  defaultTheme,
  DocumentTitlePager,
  DocumentViewer,
  LayoutAppBar,
  SaveWidget,
  SearchBar,
  ToggleCommentsWidget,
  ToggleShapesWidget,
  ToggleThumbnailsWidget,
  ZoomInOutWidget,
  ZoomModeWidget,
} from '@sensenet/document-viewer-react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

/**
 * Document viewer component
 */
const DocViewer: React.FunctionComponent<RouteComponentProps<{ documentId: string }>> = (props) => {
  const documentId = parseInt(props.match.params.documentId, 10)

  if (isNaN(documentId)) {
    throw Error(`Invalid document Id: ${documentId}`)
  }

  return (
    <div style={{ overflow: 'hidden', width: '100%', height: '100%', position: 'inherit' }}>
      <DocumentViewer theme={defaultTheme} documentIdOrPath={documentId}>
        <LayoutAppBar>
          <div style={{ flexShrink: 0 }}>
            <ToggleShapesWidget />
            <ToggleThumbnailsWidget />
            <ZoomInOutWidget />
            <ZoomModeWidget />
            <SaveWidget />
          </div>
          <DocumentTitlePager />
          <div style={{ display: 'flex', flexShrink: 0 }}>
            <ToggleCommentsWidget />
            <SearchBar />
          </div>
        </LayoutAppBar>
      </DocumentViewer>
    </div>
  )
}

const DocviewerComponent = withRouter(DocViewer)

export default DocviewerComponent
