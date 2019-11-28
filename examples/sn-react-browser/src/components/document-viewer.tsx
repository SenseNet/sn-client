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
import { useRepository } from '@sensenet/hooks-react'
import { useInjector } from '../hooks/use-injector'
import { useSelectionService } from '../hooks/use-selection-service'
import { CurrentContentProvider } from '../context/current-content-provider'
import { getViewerSettings } from '../service/docview-setting'

/**
 * Document viewer component
 */
const DocViewer: React.FunctionComponent<RouteComponentProps<{ documentId: string }>> = props => {
  const documentId = parseInt(props.match.params.documentId, 10)
  const injector = useInjector()
  const repo = useRepository()
  injector.setExplicitInstance(getViewerSettings(repo))
  const selectionService = useSelectionService()

  if (isNaN(documentId)) {
    throw Error(`Invalid document Id: ${documentId}`)
  }
  const hostName = repo.configuration.repositoryUrl

  return (
    <div style={{ overflow: 'hidden', width: '100%', height: '100%', position: 'inherit' }}>
      <CurrentContentProvider idOrPath={documentId} onContentLoaded={c => selectionService.activeContent.setValue(c)}>
        <DocumentViewer theme={defaultTheme} documentIdOrPath={documentId} hostName={hostName}>
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
      </CurrentContentProvider>
    </div>
  )
}

const DocviewerComponent = withRouter(DocViewer)

export default DocviewerComponent
