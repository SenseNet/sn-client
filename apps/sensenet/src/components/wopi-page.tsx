import { isExtendedError, ODataWopiResponse } from '@sensenet/client-core'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { Button, createStyles, makeStyles, Typography } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { useGlobalStyles } from '../globalStyles'
import { useLocalization, useQuery } from '../hooks'
import { navigateToAction } from '../services'
import { FullScreenLoader } from './full-screen-loader'

const useStyles = makeStyles(() => {
  return createStyles({
    closeButton: {
      placeSelf: 'flex-end',
      position: 'relative',
      alignSelf: 'center',
    },
    actionButtonWrapper: {
      height: '80px',
      width: '100%',
      position: 'absolute',
      padding: '20px',
      bottom: 0,
      textAlign: 'right',
    },
    wopiWrapper: {
      width: '100%',
      height: 'calc(100% - 80px)',
    },
  })
})

export default function WopiPage({ contentPath }: { contentPath?: string }) {
  const repo = useRepository()
  const routeMatch = useRouteMatch<{ browseType?: string; action?: string }>()
  const history = useHistory()
  const formElement = useRef<HTMLFormElement>(null)
  const [wopiData, setWopiData] = useState<ODataWopiResponse | null>(null)
  const [error, setError] = useState('')
  const logger = useLogger('WopiPage')
  const localization = useLocalization().wopi
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const formsLocalization = useLocalization().forms
  const contentFromQuery = useQuery().get('content')

  useEffect(() => {
    const ac = new AbortController()
    setError('')
    ;(async () => {
      if (!contentPath) {
        setError('Invalid url')
        return
      }
      try {
        const response = await repo.getWopiData({
          idOrPath: contentPath,
          action: routeMatch.params.action!.replace('wopi-', '') as 'edit' | 'view',
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
              details: { contentPath, action: routeMatch.params.action, e },
              isDismissed: true,
            },
          })
        }
      }
    })()
    return () => ac.abort()
  }, [localization.errorOpeningFileText, logger, routeMatch.params.action, repo, contentPath])

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
          {routeMatch.params.action !== 'wopi-view' ? (
            <Button
              aria-label={localization.tryOpenRead}
              onClick={() =>
                navigateToAction({
                  history,
                  routeMatch,
                  action: 'wopi-view',
                  queryParams: { content: contentFromQuery },
                })
              }>
              {localization.tryOpenRead}
            </Button>
          ) : null}

          <Button aria-label={localization.goBack} onClick={() => navigateToAction({ history, routeMatch })}>
            {localization.goBack}
          </Button>
        </>
      </div>
    )
  }
  if (!wopiData) return <FullScreenLoader />

  return (
    <>
      <div className={classes.wopiWrapper}>
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
            height={'100%'}
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
      <div className={classes.actionButtonWrapper}>
        <Button
          aria-label={formsLocalization.cancel}
          color="default"
          className={globalClasses.cancelButton}
          onClick={() => navigateToAction({ history, routeMatch })}>
          {formsLocalization.cancel}
        </Button>
      </div>
    </>
  )
}
