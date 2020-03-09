import React, { useState } from 'react'
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  TextField,
} from '@material-ui/core'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { GenericContent } from '@sensenet/default-content-types'
import { ODataParams } from '@sensenet/client-core'
import { useLocalization } from '../../hooks'
import { useDialog } from './dialog-provider'

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

  const name = content.DisplayName ?? content.Name

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
      logger.warning({ message: localization.rejectError, data: error })
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
      logger.warning({ message: localization.approveError, data: error })
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
            onChange={event => setReason(event.target.value)}
            margin="normal"
            fullWidth={true}
          />
        </Fade>
      </DialogContent>

      <DialogActions>
        <Button onClick={closeLastDialog}>{localization.cancelButton}</Button>
        <Button onClick={approve}>{localization.approveButton}</Button>
        <Button onClick={reject}>{localization.rejectButton}</Button>
      </DialogActions>
    </>
  )
}

export default Approve
