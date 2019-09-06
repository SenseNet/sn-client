import React, { useContext, useEffect, useState } from 'react'
import { DocumentDataContext } from './document-data'
import { DocumentViewerApiSettingsContext } from './api-settings'

export const DocumentPermissionsContext = React.createContext({
  canEdit: false,
  canHideRedaction: false,
  canHideWatermark: false,
})

export const DocumentPermissionsContextProvider: React.FC = ({ children }) => {
  const document = useContext(DocumentDataContext)
  const api = useContext(DocumentViewerApiSettingsContext)
  const [canEdit, setcanEdit] = useState(false)
  const [canHideRedaction, setcancanHideRedaction] = useState(false)
  const [canHideWatermark, setcanHideWatermark] = useState(false)

  useEffect(() => {
    const abortController = new AbortController()
    ;(async () => {
      try {
        /** */
        const canEditPromise = api.canEditDocument({ document, abortController })
        const cancanHideRedactionPromise = api.canHideRedaction({ document, abortController })
        const canHideWatermarkPromise = api.canHideWatermark({ document, abortController })

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
  }, [api, document])

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
