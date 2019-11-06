import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import { EditPropertiesDialogBody } from '.'

export type EditPropertiesDialogProps = {
  dialogProps?: DialogProps
  content: GenericContent
}

export const EditPropertiesDialog: React.FunctionComponent<EditPropertiesDialogProps> = props => {
  return (
    <Dialog {...props.dialogProps} open={true} disablePortal fullScreen>
      <EditPropertiesDialogBody contentId={props.content.Id} dialogProps={props.dialogProps} />
    </Dialog>
  )
}
