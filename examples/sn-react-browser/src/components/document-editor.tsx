import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { useRepository } from '@sensenet/hooks-react'
import { ODataWopiResponse } from '@sensenet/client-core'
import { isExtendedError } from '@sensenet/client-core/dist/Repository/Repository'
import { Button, Typography } from '@material-ui/core'
import { FullScreenLoader } from './full-screen-loader'

export interface DocumentEditorProps {
  documentId: number
}

/**
 * Document Editor component
 */
export function DocumentEditor() {
  const formElement = useRef<HTMLFormElement>(null)
  const params = useParams<{ documentId: string; action?: string }>()
  const history = useHistory()
  const [wopiData, setWopiData] = useState<ODataWopiResponse | null>(null)
  const [error, setError] = useState('')
  const repo = useRepository()

  useEffect(() => {
    const ac = new AbortController()
    setError('')
    const getWopiData = async () => {
      if (!params.documentId && !ac.signal.aborted) {
        setError('Invalid url')
        return
      }
      try {
        const response = await repo.getWopiData({
          idOrPath: parseInt(params.documentId, 10),
          action: params.action as 'edit' | 'view',
          requestInit: {
            signal: ac.signal,
          },
        })
        setWopiData(response)
        formElement.current && formElement.current.submit()
      } catch (e) {
        if (!ac.signal.aborted) {
          let errorMessage = 'There was an error during opening the file for online editing.'
          if (isExtendedError(e)) {
            const extendedError = await repo.getErrorFromResponse(e.response)
            errorMessage = extendedError.message || extendedError.body.message || e.toString()
          }
          setError(errorMessage)
        }
      }
    }
    getWopiData()
    return () => ac.abort()
  }, [params.action, params.documentId, repo])

  if (error) {
    return (
      <div
        style={{
          margin: '2em',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 250,
        }}>
        <Typography variant="h4" gutterBottom={true}>
          Error opening file for online editing
        </Typography>
        <Typography gutterBottom={true}>{error}</Typography>
        <div>
          <Button
            onClick={() => {
              history.push(`/edit/${params.documentId}/view`)
            }}>
            View
          </Button>

          <Button onClick={() => history.goBack()}>Go Back</Button>
        </div>
      </div>
    )
  }
  if (!wopiData) return <FullScreenLoader />

  return (
    <div>
      <form
        id="office_form"
        name="office_form"
        action={wopiData.actionUrl}
        target="office_frame"
        method="post"
        ref={formElement}>
        <input name="access_token" value={wopiData.accesstoken} type="hidden" />
        <input name="access_token_ttl" value={wopiData.expiration} type="hidden" />
      </form>
      <span id="frameholder">
        <iframe
          frameBorder="no"
          width="100%"
          height={window.innerHeight - 5}
          scrolling="no"
          name="office_frame"
          id="office_frame"
          title="Office Online Frame"
          allowFullScreen={true}
          sandbox={
            'allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation allow-popups-to-escape-sandbox'
          }
        />
      </span>
    </div>
  )
}
