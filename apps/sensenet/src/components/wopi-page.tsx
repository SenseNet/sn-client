import React, { useEffect, useRef, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { ODataWopiResponse } from '@sensenet/client-core'
import { Button, Typography } from '@material-ui/core'
import { isExtendedError } from '@sensenet/client-core/dist/Repository/Repository'
import { useLocalization, useLogger, useRepository } from '../hooks'
import { FullScreenLoader } from './FullScreenLoader'

const WopiPage: React.FunctionComponent<RouteComponentProps<{ documentId?: string; action?: string }>> = props => {
  const repo = useRepository()
  const formElement = useRef<HTMLFormElement>(null)
  const [wopiData, setWopiData] = useState<ODataWopiResponse | null>(null)
  const [error, setError] = useState('')
  const logger = useLogger('WopiPage')
  const localization = useLocalization().wopi

  useEffect(() => {
    const ac = new AbortController()
    setError('')
    ;(async () => {
      if (!props.match.params.documentId && !ac.signal.aborted) {
        setError('Invalid url')
        return
      }
      try {
        const response = await repo.getWopiData({
          idOrPath: parseInt(props.match.params.documentId as string, 10),
          action: props.match.params.action as 'edit' | 'view',
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
              details: { contentId: props.match.params.documentId, action: props.match.params.action, e },
              isDismissed: true,
            },
          })
        }
      }
    })()
    return () => ac.abort()
  }, [localization.errorOpeningFileText, logger, props.match.params.action, props.match.params.documentId, repo])
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
        <div>
          {props.match.params.action !== 'view' ? (
            <Button
              onClick={() => {
                props.history.push(
                  `/${btoa(repo.configuration.repositoryUrl)}/wopi/${props.match.params.documentId}/view`,
                )
              }}>
              {localization.tryOpenRead}
            </Button>
          ) : null}

          <Button onClick={() => props.history.goBack()}>{localization.goBack}</Button>
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

const routed = withRouter(WopiPage)
export { routed as WopiPage }
