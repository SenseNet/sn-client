import { DocumentData } from '@sensenet/client-core'
import { deepMerge, DeepPartial, sleepAsync } from '@sensenet/client-utils'
import { useRepository } from '@sensenet/hooks-react'
import React, { useCallback, useEffect, useState } from 'react'
import Semaphore from 'semaphore-async-await'
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

export interface DocumentDataContextType {
  documentData: DocumentData
  updateDocumentData: (data: DeepPartial<DocumentData>) => void
}

export const defaultDocumentDataContextValue: DocumentDataContextType = {
  documentData: defaultDocumentData,
  updateDocumentData: () => undefined,
}

export const DocumentDataContext = React.createContext<DocumentDataContextType>(defaultDocumentDataContextValue)

export const DocumentDataProvider: React.FC = ({ children }) => {
  const api = useDocumentViewerApi()
  const doc = useViewerSettings()
  const repo = useRepository()

  const [documentData, setDocumentData] = useState<DocumentData>(defaultDocumentData)
  const [loadLock] = useState(new Semaphore(1))

  useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      try {
        await loadLock.acquire()
        setDocumentData(defaultDocumentData)
        while (documentData.pageCount === PreviewState.Loading && !ac.signal.aborted) {
          const result = await api.getDocumentData({
            hostName: repo.configuration.repositoryUrl,
            idOrPath: doc.documentIdOrPath,
            version: doc.version,
            abortController: ac,
          })
          setDocumentData(result)
          if (result.pageCount === PreviewState.Loading) {
            await sleepAsync(4000)
          } else {
            break
          }
        }
      } catch (error) {
        if (!ac.signal.aborted) {
          setDocumentData({ ...defaultDocumentData, pageCount: PreviewState.ClientFailure, error: error.toString() })
          throw error
        }
      } finally {
        loadLock.release()
      }
    })()
    return () => ac.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, doc.documentIdOrPath, repo.configuration.repositoryUrl, doc.version])

  const updateDocumentData = useCallback(
    async (newDocData: Partial<DocumentData>) => {
      const merged = deepMerge(documentData, newDocData)
      if (JSON.stringify(documentData) !== JSON.stringify(merged)) {
        try {
          await loadLock.acquire()
          setDocumentData(merged)
        } finally {
          loadLock.release()
        }
      }
    },
    [documentData, loadLock],
  )

  if (!documentData.idOrPath) {
    return null
  }

  return (
    <DocumentDataContext.Provider value={{ documentData, updateDocumentData }}>{children}</DocumentDataContext.Provider>
  )
}
