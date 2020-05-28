import { isExtendedError, ODataWopiResponse } from '@sensenet/client-core'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { Button, Typography } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { applicationPaths, resolvePathParams } from '../application-paths'
import { useLocalization } from '../hooks'
import { FullScreenLoader } from './full-screen-loader'

export default function WopiPage() {
  const repo = useRepository()
  const match = useRouteMatch<{ contentId?: string; action?: string }>()
  const history = useHistory()
  const formElement = useRef<HTMLFormElement>(null)
  const [wopiData, setWopiData] = useState<ODataWopiResponse | null>(null)
  const [error, setError] = useState('')
  const logger = useLogger('WopiPage')
  const localization = useLocalization().wopi

  useEffect(() => {
    const ac = new AbortController()
    setError('')
    ;(async () => {
      if (!match.params.contentId) {
        setError('Invalid url')
        return
      }
      try {
        const response = await repo.getWopiData({
          idOrPath: parseInt(match.params.contentId, 10),
          action: match.params.action as 'edit' | 'view',
          requestInit: {
            signal: ac.signal,
          },
        })
        setWopiData(response)
        formElement.current && formElement.current.submit()
      } catch (e) {
        if (!ac.signal.aborted) {
          let errorMessage = localization.errorOpeningFileText
          if (isExtendedError(e)) {
            const extendedError = await repo.getErrorFromResponse(e.response)
            errorMessage = extendedError.message || extendedError.body.message || e.toString()
          }
          setError(errorMessage)
          logger.error({
            message: `Error opening file for online editing`,
            data: {
              details: { contentId: match.params.contentId, action: match.params.action, e },
              isDismissed: true,
            },
          })
        }
      }
    })()
    return () => ac.abort()
  }, [localization.errorOpeningFileText, logger, match.params.action, match.params.contentId, repo])

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
          {localization.errorOpeningFileTitle}
        </Typography>
        <Typography gutterBottom={true}>
          {localization.errorOpeningFileText} <br />
          {error}
        </Typography>
        <>
          {match.params.action !== 'view' ? (
            <Button
              onClick={() => {
                history.push(
                  resolvePathParams({
                    path: applicationPaths.wopi,
                    params: { action: 'view', contentId: match.params.contentId!.toString() },
                  }),
                )
              }}>
              {localization.tryOpenRead}
            </Button>
          ) : null}

          <Button onClick={() => history.goBack()}>{localization.goBack}</Button>
        </>
      </div>
    )
  }
  if (!wopiData) return <FullScreenLoader />

  return (
    <>
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
    </>
  )
}
