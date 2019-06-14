import React, { useRef, useEffect, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { ODataWopiResponse } from '@sensenet/client-core'
import { useRepository } from '../hooks'
import { FullScreenLoader } from './FullScreenLoader'

const WopiPage: React.FunctionComponent<RouteComponentProps<{ documentId?: string }>> = props => {
  const repo = useRepository()
  const formElement = useRef<HTMLFormElement>(null)
  const [wopiData, setWopiData] = useState<ODataWopiResponse | null>(null)

  useEffect(() => {
    ;(async () => {
      if (!props.match.params.documentId) {
        throw Error('Invalid url')
      }
      const response = await repo.getWopiData({ idOrPath: parseInt(props.match.params.documentId, 10) })
      setWopiData(response)
      formElement.current && formElement.current.submit()
    })()
  }, [props.match.params.documentId, repo])

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
