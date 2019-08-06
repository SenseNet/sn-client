import { DocumentViewer } from '@sensenet/document-viewer-react'
import React, { useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { CurrentContentProvider } from '../context'
import { useInjector, useRepository, useSelectionService } from '../hooks'
import { getViewerSettings } from '../services/GetViewerSettings'

const DocViewer: React.FunctionComponent<
  RouteComponentProps<{ documentId: string }> & { previousLocation?: string }
> = props => {
  const documentId = parseInt(props.match.params.documentId, 10)
  const injector = useInjector()
  const repo = useRepository()
  injector.setExplicitInstance(getViewerSettings(repo))
  const selectionService = useSelectionService()

  useEffect(() => {
    const keyboardHandler = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }

      props.previousLocation ? props.history.push(props.previousLocation) : props.history.goBack()
    }

    document.addEventListener('keydown', keyboardHandler, false)
    return () => {
      document.removeEventListener('keydown', keyboardHandler, false)
    }
  }, [props])

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
