import React, { useEffect, useState } from 'react'
import { sleepAsync } from '@sensenet/client-utils'
import { DocumentData } from '../models'
import { PreviewState } from '../Enums'
import { useDocumentViewerApi, useViewerSettings } from '../hooks'

const defaultDocumentData: DocumentData = {
  documentName: '',
  documentType: '',
  fileSizekB: 0,
  hostName: '',
  idOrPath: 0,
  pageAttributes: [],
  pageCount: PreviewState.Loading,
  shapes: {
    annotations: [],
    highlights: [],
    redactions: [],
  },
  error: undefined,
}

export const DocumentDataContext = React.createContext(defaultDocumentData)

export const DocumentDataProvider: React.FC = ({ children }) => {
  const api = useDocumentViewerApi()
  const doc = useViewerSettings()

  const [docData, setDocData] = useState(defaultDocumentData)

  useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      try {
        setDocData(defaultDocumentData)
        while (docData.pageCount === PreviewState.Loading && !ac.signal.aborted) {
          const result = await api.getDocumentData({
            hostName: doc.hostName,
            idOrPath: doc.documentIdOrPath,
            version: doc.version,
            abortController: ac,
          })
          setDocData(result)
          if (result.pageCount === PreviewState.Loading) {
            await sleepAsync(4000)
          }
        }
      } catch (error) {
        /** */
        if (!ac.signal.aborted) {
          setDocData({ ...defaultDocumentData, pageCount: PreviewState.ClientFailure, error: error.toString() })
          throw error
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, doc.documentIdOrPath, doc.hostName, doc.version])

  return <DocumentDataContext.Provider value={docData}>{children}</DocumentDataContext.Provider>
}
