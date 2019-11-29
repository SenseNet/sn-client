import React, { useState } from 'react'
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { ODataParams } from '@sensenet/client-core'
import { useLocalization } from '../../hooks'
import { useDialog } from '.'

export type CheckInProps = {
  content: GenericContent
  onActionSuccess?: (content: GenericContent) => void
  oDataOptions?: ODataParams<GenericContent>
}

export function CheckIn({ content, onActionSuccess, oDataOptions }: CheckInProps) {
  const [comment, setComment] = useState<string>()
  const localization = useLocalization().checkInDialog
  const logger = useLogger('CheckInDialog')
  const repo = useRepository()
  const { closeLastDialog } = useDialog()

  const onSubmit = async () => {
    try {
      const result = await repo.versioning.checkIn(content.Id, comment, oDataOptions)
      onActionSuccess?.(result.d)
      logger.information({ message: localization.successMessage })
    } catch (error) {
      logger.warning({ message: localization.errorMessage, data: error })
    } finally {
      closeLastDialog()
    }
  }

  return (
    <>
      <DialogTitle>{localization.checkinComent}</DialogTitle>
      <DialogContent>
        <TextField
          label={localization.inputLabel}
          multiline
          onChange={event => setComment(event.target.value)}
          value={comment}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onSubmit}>{localization.send}</Button>
      </DialogActions>
    </>
  )
}

export default CheckIn
