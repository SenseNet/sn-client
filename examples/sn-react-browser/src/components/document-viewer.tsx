import {
  defaultTheme,
  DocumentTitlePager,
  DocumentViewer,
  LayoutAppBar,
  SaveWidget,
  ToggleCommentsWidget,
  ToggleShapesWidget,
  ToggleThumbnailsWidget,
  ZoomInOutWidget,
} from '@sensenet/document-viewer-react'
import React from 'react'
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
      <DocumentViewer
        theme={defaultTheme}
        documentIdOrPath={documentId}
        renderAppBar={() => (
          <LayoutAppBar>
            <div style={{ flexShrink: 0 }}>
              <ToggleShapesWidget />
              <ToggleThumbnailsWidget />
              <ZoomInOutWidget />
              <SaveWidget />
            </div>
            <DocumentTitlePager />
            <div style={{ display: 'flex', flexShrink: 0 }}>
              <ToggleCommentsWidget />
            </div>
          </LayoutAppBar>
        )}
      />
    </div>
  )
}

const DocviewerComponent = withRouter(DocViewer)

export default DocviewerComponent
