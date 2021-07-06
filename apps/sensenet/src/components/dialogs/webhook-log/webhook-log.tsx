import { WebhookSubscription } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { Button, DialogActions, DialogContent } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useGlobalStyles } from '../../../globalStyles'
import { useLocalization } from '../../../hooks'
import { useDialog } from '../dialog-provider'
import { DialogTitle } from '../dialog-title'
import { CollapsibleTable } from './collapsible-table'
import { WebhookStatInput } from '.'

export type WebhookLogDialogProps = {
  content: WebhookSubscription
}

export const WebhookLogDialog: React.FunctionComponent<WebhookLogDialogProps> = (props) => {
  const { closeLastDialog } = useDialog()
  const globalClasses = useGlobalStyles()
  const localization = useLocalization()
  const logger = useLogger('WebhookLog')
  const repo = useRepository()
  const [data, setData] = useState<WebhookStatInput[]>([])

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await repo.executeAction<any, WebhookStatInput[]>({
          idOrPath: props.content.Path,
          name: `GetWebHookUsageList`,
          method: 'POST',
          body: {},
        })
        console.log(response)
        setData(response)
      } catch (error) {
        logger.error({
          message: error.message,
        })
      }
    }

    getData()
  }, [logger, props.content.Path, repo])

  return (
    <>
      <DialogTitle>
        <div className={globalClasses.centered}>{props.content.WebHookUrl}</div>
      </DialogTitle>
      <>
        <DialogContent>
          <CollapsibleTable webhooks={data} />
        </DialogContent>
        <DialogActions>
          <Button
            aria-label={localization.forms.cancel}
            className={globalClasses.cancelButton}
            onClick={closeLastDialog}>
            {localization.forms.cancel}
          </Button>
        </DialogActions>
      </>
    </>
  )
}

export default WebhookLogDialog
