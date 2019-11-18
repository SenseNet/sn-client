import React, { useState } from 'react'
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { ODataParams } from '@sensenet/client-core'
import { useDialog } from '.'

export type CheckInProps = {
  content: GenericContent
  onActionSuccess?: (content: GenericContent) => void
  oDataOptions?: ODataParams<GenericContent>
}

export function CheckIn({ content, onActionSuccess, oDataOptions }: CheckInProps) {
  const [comment, setComment] = useState<string>()
  const logger = useLogger('CheckInDialog')
  const repo = useRepository()
  const { closeLastDialog } = useDialog()

  const onSubmit = async () => {
    try {
      const result = await repo.versioning.checkIn(content.Id, comment, oDataOptions)
      onActionSuccess?.(result.d)
      logger.information({ message: 'Check in succeded' })
    } catch (error) {
      logger.warning({ message: 'Check in failed', data: error })
    } finally {
      closeLastDialog()
    }
  }

  return (
    <>
      <DialogTitle>Add a check in comment</DialogTitle>
      <DialogContent>
        <TextField
          label="Check in comment (optional)"
          multiline
          onChange={event => setComment(event.target.value)}
          value={comment}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onSubmit}>Send</Button>
      </DialogActions>
    </>
  )
}

export default CheckIn
