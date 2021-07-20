import { ODataParams } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { Button, DialogActions, DialogContent, DialogContentText, Fade, TextField } from '@material-ui/core'
import React, { useState } from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { useDialog } from './dialog-provider'
import { DialogTitle } from '.'

export type ApproveProps = {
  content: GenericContent
  onActionSuccess?: (content: GenericContent) => void
  oDataOptions?: ODataParams<GenericContent>
}

export function Approve(props: ApproveProps) {
  const { content, oDataOptions, onActionSuccess } = props
  const localization = useLocalization().approveDialog
  const repo = useRepository()
  const logger = useLogger('approve-reject')
  const { closeLastDialog } = useDialog()
  const [reason, setReason] = useState<string>()
  const [aboutToReject, setAboutToReject] = useState(false)
  const globalClasses = useGlobalStyles()

  const name = content.DisplayName ?? content.Name
  const submitProps = { color: 'primary', variant: 'contained' } as const
  const cancelProps = { className: globalClasses.cancelButton } as const

  const reject = async () => {
    if (!aboutToReject) {
      setAboutToReject(true)
      return
    }

    try {
      const result = await repo.versioning.reject(content.Id, reason, oDataOptions)
      onActionSuccess?.(result.d)
      logger.information({ message: localization.rejectSuccess(name), data: result })
    } catch (error) {
      logger.warning({ message: localization.rejectError, data: { error } })
    } finally {
      closeLastDialog()
    }
  }

  const approve = async () => {
    try {
      const result = await repo.versioning.approve(content.Id, oDataOptions)
      onActionSuccess?.(result.d)
      logger.information({ message: localization.approveSuccess(name), data: result })
    } catch (error) {
      logger.warning({ message: localization.approveError, data: { error } })
    } finally {
      closeLastDialog()
    }
  }

  return (
    <>
      <DialogTitle>{localization.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{localization.body(name)}</DialogContentText>
        <Fade in={aboutToReject}>
          <TextField
            label={localization.inputLabel}
            multiline={true}
            rowsMax="4"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            margin="normal"
            fullWidth={true}
          />
        </Fade>
      </DialogContent>

      <DialogActions style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button aria-label={localization.cancelButton} onClick={closeLastDialog} className={globalClasses.cancelButton}>
          {localization.cancelButton}
        </Button>
        <div>
          <Button
            aria-label={localization.rejectButton}
            onClick={reject}
            {...(aboutToReject ? submitProps : cancelProps)}>
            {localization.rejectButton}
          </Button>
          <Button
            aria-label={localization.approveButton}
            onClick={approve}
            {...(aboutToReject ? cancelProps : submitProps)}
            style={{ marginLeft: '38px' }}>
            {localization.approveButton}
          </Button>
        </div>
      </DialogActions>
    </>
  )
}

export default Approve
