import { Button, CircularProgress } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import React, { useState } from 'react'
import { useDocumentData, useDocumentViewerApi, useLocalization } from '../hooks'

export const DocumentViewerRegeneratePreviews: React.FC = () => {
  const [isRegenerating, setIsRegenerating] = useState(false)
  const localization = useLocalization()

  const api = useDocumentViewerApi()

  const { documentData, updateDocumentData, isInProgress, triggerReload } = useDocumentData()

  /**
   * renders the component
   */
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'column',
          maxWidth: 500,
          margin: '.5em 0 .6em 0',
        }}>
        <Typography variant="subtitle1" color="textSecondary" align="center" gutterBottom>
          {localization.regeneratePreviews}
        </Typography>
        <Button
          variant="contained"
          disabled={isRegenerating || isInProgress}
          onClick={async () => {
            setIsRegenerating(true)
            const result = await api.regeneratePreviews({
              document: documentData,
              abortController: new AbortController(),
            })
            updateDocumentData({ ...documentData, pageCount: result.PageCount })
            setIsRegenerating(false)
            triggerReload()
          }}>
          {isRegenerating && <CircularProgress size={24} style={{ marginRight: '1em' }} />}
          {localization.regenerateButton}
        </Button>
      </div>
    </div>
  )
}
