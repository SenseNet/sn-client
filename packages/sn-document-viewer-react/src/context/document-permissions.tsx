import React, { useEffect, useState } from 'react'
import { useDocumentData, useDocumentViewerApi } from '../hooks'

export const DocumentPermissionsContext = React.createContext({
  canEdit: false,
  canHideRedaction: false,
  canHideWatermark: false,
})

export const DocumentPermissionsContextProvider: React.FC = ({ children }) => {
  const { documentData } = useDocumentData()
  const api = useDocumentViewerApi()
  const [canEdit, setcanEdit] = useState(false)
  const [canHideRedaction, setcancanHideRedaction] = useState(false)
  const [canHideWatermark, setcanHideWatermark] = useState(false)

  useEffect(() => {
    const abortController = new AbortController()
    ;(async () => {
      try {
        /** */
        const canEditPromise = api.canEditDocument({ document: documentData, abortController })
        const cancanHideRedactionPromise = api.canHideRedaction({ document: documentData, abortController })
        const canHideWatermarkPromise = api.canHideWatermark({ document: documentData, abortController })

        const [canEditValue, cancanHideRedactionValue, canHideWatermarkValue] = await Promise.all([
          canEditPromise,
          cancanHideRedactionPromise,
          canHideWatermarkPromise,
        ])
        setcanEdit(canEditValue)
        setcancanHideRedaction(cancanHideRedactionValue)
        setcanHideWatermark(canHideWatermarkValue)
      } catch (error) {
        if (!abortController.signal.aborted) {
          throw error
        }
      }
    })()
  }, [api, documentData])

  return (
    <DocumentPermissionsContext.Provider
      value={{
        canEdit,
        canHideRedaction,
        canHideWatermark,
      }}>
      {children}
    </DocumentPermissionsContext.Provider>
  )
}
