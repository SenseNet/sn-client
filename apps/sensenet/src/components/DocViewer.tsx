import { DocumentViewer } from '@sensenet/document-viewer-react'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { withRouter } from 'react-router'
import { CurrentContentProvider } from '../context'
import { useInjector, useRepository, useSelectionService } from '../hooks'
import { getViewerSettings } from '../services/GetViewerSettings'

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
    <div style={{ overflow: 'hidden', width: '100%', height: '100%', position: 'fixed' }}>
      <CurrentContentProvider idOrPath={documentId} onContentLoaded={c => selectionService.activeContent.setValue(c)}>
        <DocumentViewer documentIdOrPath={documentId} hostName={hostName} />
      </CurrentContentProvider>
    </div>
  )
}

const extendedComponent = withRouter(DocViewer)

export default extendedComponent
