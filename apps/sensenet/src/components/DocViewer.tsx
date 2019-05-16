import { DocumentViewer } from '@sensenet/document-viewer-react'
import React, { useContext } from 'react'
import { RouteComponentProps } from 'react-router'
import { withRouter } from 'react-router'
import { CurrentContentProvider, InjectorContext, RepositoryContext } from '../context'
import { getViewerSettings } from '../services/GetViewerSettings'
import { SelectionService } from '../services/SelectionService'

const DocViewer: React.FunctionComponent<RouteComponentProps<{ documentId: string }>> = props => {
  const documentId = parseInt(props.match.params.documentId, 10)
  const injector = useContext(InjectorContext)
  const repo = useContext(RepositoryContext)
  injector.setExplicitInstance(getViewerSettings(repo))
  const selectionService = injector.getInstance(SelectionService)

  if (isNaN(documentId)) {
    throw Error(`Invalid document Id: ${documentId}`)
  }
  const hostName = useContext(RepositoryContext).configuration.repositoryUrl

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
