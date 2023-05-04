import { DialogContent, IconButton } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import React from 'react'
import { useLocalization } from '../../hooks'
import { DialogTitle } from './dialog-title'
import { useDialog, useStyles } from '.'

interface ColumunSettingsProps {
  test?: any
}

export const ColumnSettings: React.FunctionComponent<ColumunSettingsProps> = () => {
  const classes = useStyles()

  const { closeLastDialog } = useDialog()

  const localization = useLocalization()

  return (
    <>
      <DialogTitle>
        {localization.columnSettingsDialog.title}
        <IconButton aria-label="close" className={classes.closeButton} onClick={closeLastDialog}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div>test</div>
      </DialogContent>
    </>
  )
}

export default ColumnSettings
