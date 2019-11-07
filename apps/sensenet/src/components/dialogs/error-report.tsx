import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import CircularProgress from '@material-ui/core/CircularProgress'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Clear from '@material-ui/icons/Clear'
import SendTwoTone from '@material-ui/icons/SendTwoTone'
import { sleepAsync } from '@sensenet/client-utils'
import React, { useCallback, useEffect, useState } from 'react'
import { useEventService, useLocalization, usePersonalSettings } from '../../hooks'
import { useDialog } from '.'

export type ErrorReportProps = { error: Error }

export const ErrorReport: React.FunctionComponent<ErrorReportProps> = props => {
  const localization = useLocalization().errorReport
  const personalSettings = usePersonalSettings()
  const { closeAllDialogs } = useDialog()
  const evtService = useEventService()

  const [description, setDescription] = useState('')
  const [sendLog, setSendLog] = useState(personalSettings.sendLogWithCrashReports)

  const [isSending, setIsSending] = useState(false)

  const closeDialog = useCallback(() => {
    closeAllDialogs()
    window.location.replace('/')
  }, [closeAllDialogs])

  useEffect(() => {
    if (isSending) {
      ;(async () => {
        console.log(
          'TODO: Report sending endpoint',
          description,
          props.error,
          sendLog ? evtService.values.getValue() : null,
        )
        await sleepAsync(2500)
        closeDialog()
      })()
    }
  }, [closeDialog, description, evtService.values, isSending, props, props.error, sendLog])

  return (
    <>
      <DialogTitle>{localization.title}</DialogTitle>
      <DialogContent>
        {isSending ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress style={{ marginRight: '1em' }} />
            <Typography>{localization.sendingInProgress}</Typography>
          </div>
        ) : (
          <>
            <TextField
              fullWidth={true}
              multiline={true}
              label={localization.descriptionTitle}
              helperText={localization.descriptionHelperText}
              onChange={ev => setDescription(ev.target.value)}
            />
            <DialogActions style={{ display: 'flex', justifyContent: 'space-between' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked={personalSettings.sendLogWithCrashReports}
                    onChange={ev => setSendLog(ev.target.checked)}
                  />
                }
                label={localization.allowLogSending}
              />
              <div>
                <Button onClick={() => closeDialog()}>
                  <Clear />
                  {localization.cancel}
                </Button>

                <Button
                  onClick={() => {
                    setIsSending(true)
                  }}>
                  <SendTwoTone />
                  {localization.send}
                </Button>
              </div>
            </DialogActions>
          </>
        )}
      </DialogContent>
    </>
  )
}

export default ErrorReport
