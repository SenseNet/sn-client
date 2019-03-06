import { Repository } from '@sensenet/client-core'
import { DocumentViewer } from '@sensenet/document-viewer-react'
import React, { useContext } from 'react'
import { RouteComponentProps } from 'react-router'
import { withRouter } from 'react-router'
import { InjectorContext } from './InjectorContext'

const DocViewer: React.FunctionComponent<RouteComponentProps<{ documentId: string }>> = props => {
  const documentId = parseInt(props.match.params.documentId, 10)
  if (isNaN(documentId)) {
    throw Error(`Invalid document Id: ${documentId}`)
  }
  const injector = useContext(InjectorContext)
  const hostName = injector.GetInstance(Repository).configuration.repositoryUrl

  return (
    <div style={{ overflow: 'hidden', width: '100%', height: '100%', position: 'fixed' }}>
      <DocumentViewer documentIdOrPath={documentId} hostName={hostName} />
    </div>
  )
}

const extendedComponent = withRouter(DocViewer)

export default extendedComponent
