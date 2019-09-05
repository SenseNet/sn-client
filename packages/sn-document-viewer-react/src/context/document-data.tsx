import React, { useContext, useEffect, useState } from 'react'
import { DocumentData } from '../models'
import { PreviewState } from '../Enums'
import { DocumentViewerApiSettingsContext } from './api-settings'
import { ViewerSettingsContext } from './viewer-settings'

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
  const api = useContext(DocumentViewerApiSettingsContext)
  const doc = useContext(ViewerSettingsContext)

  const [docDoata, setDocData] = useState(defaultDocumentData)

  useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      try {
        setDocData(defaultDocumentData)
        const result = await api.getDocumentData({
          hostName: doc.hostName,
          idOrPath: doc.documentIdOrPath,
          version: doc.version,
          abortController: ac,
        })
        setDocData(result)
      } catch (error) {
        /** */
        if (!ac.signal.aborted) {
          setDocData({ ...defaultDocumentData, pageCount: PreviewState.ClientFailure, error: error.toString() })
          throw error
        }
      }
    })()
  }, [api, doc.documentIdOrPath, doc.hostName, doc.version])

  return <DocumentDataContext.Provider value={docDoata}>{children}</DocumentDataContext.Provider>
}
