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
import { useDialog } from './dialog-provider'

export type ApproveProps = {
  content: GenericContent
  onActionSuccess?: (content: GenericContent) => void
  oDataOptions?: ODataParams<GenericContent>
}

export function Approve(props: ApproveProps) {
  const { content, oDataOptions, onActionSuccess } = props
  const repo = useRepository()
  const logger = useLogger('approve-reject')
  const { closeLastDialog } = useDialog()
  const [reason, setReason] = useState<string>()
  const [aboutToReject, setAboutToReject] = useState(false)

  const reject = async () => {
    if (!aboutToReject) {
      setAboutToReject(true)
      return
    }

    try {
      const result = await repo.versioning.reject(content.Id, reason, oDataOptions)
      onActionSuccess?.(result.d)
      logger.information({ message: `${content.DisplayName ?? content.Name} rejected successfully.`, data: result })
    } catch (error) {
      logger.warning({ message: 'Reject action failed.', data: error })
    } finally {
      closeLastDialog()
    }
  }

  const approve = async () => {
    try {
      const result = await repo.versioning.approve(content.Id, oDataOptions)
      onActionSuccess?.(result.d)
      logger.information({ message: `${content.DisplayName ?? content.Name} approved successfully.`, data: result })
    } catch (error) {
      logger.warning({ message: 'Approve action failed.', data: error })
    } finally {
      closeLastDialog()
    }
  }

  return (
    <div>
      <DialogTitle>Approve or reject</DialogTitle>
      <DialogContent>
        <DialogContentText>{`You are about to approve or reject ${content.DisplayName ??
          content.Name}`}</DialogContentText>
        <Fade in={aboutToReject}>
          <TextField
            label="Please provide a reason for rejecting the content"
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
        <Button onClick={() => closeLastDialog()}>Cancel</Button>
        <Button onClick={approve}>Approve</Button>
        <Button onClick={reject}>Reject</Button>
      </DialogActions>
    </div>
  )
}

export default Approve
