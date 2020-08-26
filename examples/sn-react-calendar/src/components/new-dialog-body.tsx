import { NewView } from '@sensenet/controls-react'
import { useRepository } from '@sensenet/hooks-react'
import { DialogContent, DialogTitle } from '@material-ui/core'
import { DialogProps } from '@material-ui/core/Dialog'
import React, { useContext } from 'react'
import { SharedContext } from '../context/shared-context'

const NewDialogBody: React.FunctionComponent<{
  parentpath: string
  dialogProps: Partial<DialogProps>
}> = (props) => {
  const repo = useRepository()
  const sharedcontext = useContext(SharedContext)
  const handleClose = () => props.dialogProps.onClose && props.dialogProps.onClose(null as any, 'backdropClick')

  return (
    <>
      <DialogTitle>Add new event</DialogTitle>
      <DialogContent>
        <NewView
          handleCancel={handleClose}
          repository={repo}
          contentTypeName="CalendarEvent"
          onSubmit={async (content) => {
            try {
              await repo.post({
                contentType: 'CalendarEvent',
                parentPath: props.parentpath,
                content,
              })
              sharedcontext.setRefreshcalendar(!sharedcontext.refreshcalendar)
              handleClose()
            } catch (error) {
              console.log(error.message)
            }
          }}
        />
      </DialogContent>
    </>
  )
}

export default NewDialogBody
