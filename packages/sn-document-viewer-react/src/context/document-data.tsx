import { DocumentData } from '@sensenet/client-core'
import { deepMerge, DeepPartial, sleepAsync } from '@sensenet/client-utils'
import { useRepository } from '@sensenet/hooks-react'
import React, { useCallback, useEffect, useState } from 'react'
import Semaphore from 'semaphore-async-await'
import { POLLING_INTERVAL } from '../components'
import { PreviewState } from '../enums'
import { useDocumentViewerApi, useViewerSettings } from '../hooks'

const defaultDocumentData: DocumentData = {
  documentName: '',
  documentType: '',
  fileSizekB: 0,
  hostName: '',
  idOrPath: 0,
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
  isInProgress: boolean
  triggerReload: () => void
}

export const defaultDocumentDataContextValue: DocumentDataContextType = {
  documentData: defaultDocumentData,
  updateDocumentData: () => undefined,
  isInProgress: false,
  triggerReload: () => {},
}

export const DocumentDataContext = React.createContext<DocumentDataContextType>(defaultDocumentDataContextValue)

export const DocumentDataProvider: React.FC = ({ children }) => {
  const api = useDocumentViewerApi()
  const doc = useViewerSettings()
  const repo = useRepository()

  const [documentData, setDocumentData] = useState<DocumentData>(defaultDocumentData)
  const [loadLock] = useState(new Semaphore(1))
  const [isInProgress, setIsInProgress] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)

  const triggerReload = () => setReloadToken((prevValue) => prevValue + 1)

  useEffect(() => {
    const ac = new AbortController()
    const getData = async () => {
      const result = await api.getDocumentData({
        hostName: repo.configuration.repositoryUrl,
        idOrPath: doc.documentIdOrPath,
        version: doc.version,
        abortController: ac,
      })
      if (result.pageCount === PreviewState.Loading && ac.signal.aborted === false) {
        setDocumentData(result)
        await sleepAsync(POLLING_INTERVAL)
        getData()
      } else {
        setDocumentData(result)
      }
    }
    ;(async () => {
      try {
        setIsInProgress(true)
        await loadLock.acquire()
        await getData()
      } catch (error) {
        if (!ac.signal.aborted) {
          setDocumentData({ ...defaultDocumentData, pageCount: PreviewState.ClientFailure, error: error.toString() })
          throw error
        }
      } finally {
        setIsInProgress(false)
        loadLock.release()
      }
    })()
    return () => ac.abort()
  }, [api, doc.documentIdOrPath, doc.version, loadLock, repo.configuration.repositoryUrl, reloadToken])

  const updateDocumentData = useCallback(
    (newDocData: Partial<DocumentData>) => {
      const merged = deepMerge(documentData, newDocData)
      if (JSON.stringify(documentData) !== JSON.stringify(merged)) {
        setDocumentData(merged)
      }
    },
    [documentData],
  )

  if (!documentData.idOrPath) {
    return null
  }

  return (
    <DocumentDataContext.Provider value={{ documentData, updateDocumentData, isInProgress, triggerReload }}>
      {children}
    </DocumentDataContext.Provider>
  )
}
