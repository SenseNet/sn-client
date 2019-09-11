import React, { useCallback, useEffect, useState } from 'react'
import { deepMerge, DeepPartial, sleepAsync } from '@sensenet/client-utils'
import Semaphore from 'semaphore-async-await'
import { DocumentData } from '../models'
import { PreviewState } from '../Enums'
import { useDocumentViewerApi, useViewerSettings } from '../hooks'

const defaultDocumentData: DocumentData & { updateDocumentData: (newData: DeepPartial<DocumentData>) => void } = {
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
  updateDocumentData: () => undefined,
}

export const DocumentDataContext = React.createContext<typeof defaultDocumentData>(defaultDocumentData)

export const DocumentDataProvider: React.FC = ({ children }) => {
  const api = useDocumentViewerApi()
  const doc = useViewerSettings()

  const [docData, setDocData] = useState<DocumentData>(defaultDocumentData)
  const [loadLock] = useState(new Semaphore(1))

  useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      try {
        await loadLock.acquire()
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
          } else {
            break
          }
        }
      } catch (error) {
        /** */
        if (!ac.signal.aborted) {
          setDocData({ ...defaultDocumentData, pageCount: PreviewState.ClientFailure, error: error.toString() })
          throw error
        }
      } finally {
        loadLock.release()
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, doc.documentIdOrPath, doc.hostName, doc.version])

  const updateDocumentData = useCallback(
    (newDocData: Partial<DocumentData>) => {
      setDocData(deepMerge(docData, newDocData))
    },
    [docData],
  )

  if (!docData.idOrPath) {
    return null
  }

  return (
    <DocumentDataContext.Provider value={{ ...docData, updateDocumentData }}>{children}</DocumentDataContext.Provider>
  )
}
