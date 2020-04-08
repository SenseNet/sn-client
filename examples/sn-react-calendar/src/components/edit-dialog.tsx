import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import React from 'react'
import CalendarEvent from '../CalendarEvent-type'
import EditPropertiesDialogBody from './edit-dialog-body'

export const EditPropertiesDialog: React.FunctionComponent<{
  dialogProps: DialogProps
  content: CalendarEvent
}> = (props) => {
  return (
    <Dialog open={props.dialogProps.open} fullScreen aria-labelledby="event-dialog">
      <EditPropertiesDialogBody contentId={props.content.Id} dialogProps={props.dialogProps} />
    </Dialog>
  )
}
