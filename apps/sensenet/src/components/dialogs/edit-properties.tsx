import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import EditPropertiesDialogBody from './edit-properties-dialog-body'

export const EditPropertiesDialog: React.FunctionComponent<{
  dialogProps: DialogProps
  content: GenericContent
}> = props => {
  return (
    <Dialog {...props.dialogProps} disablePortal>
      <EditPropertiesDialogBody contentId={props.content.Id} dialogProps={props.dialogProps} />
    </Dialog>
  )
}
