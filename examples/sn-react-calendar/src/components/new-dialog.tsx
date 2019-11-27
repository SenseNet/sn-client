import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import React from 'react'
import NewDialogBody from './new-dialog-body'

export const NewDialog: React.FunctionComponent<{
  dialogProps: DialogProps
  parentpath: string
}> = props => {
  return (
    <Dialog open={props.dialogProps.open} fullScreen aria-labelledby="event-dialog">
      <NewDialogBody parentpath={props.parentpath} dialogProps={props.dialogProps} />
    </Dialog>
  )
}
