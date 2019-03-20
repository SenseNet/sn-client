import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'

export const ContentInfoDialog: React.FunctionComponent<{
  dialogProps: DialogProps
  content: GenericContent
}> = props => {
  return (
    <Dialog {...props.dialogProps}>
      <DialogTitle>Content Info</DialogTitle>
      <DialogContent>{props.content.DisplayName || props.content.Name}</DialogContent>
    </Dialog>
  )
}
