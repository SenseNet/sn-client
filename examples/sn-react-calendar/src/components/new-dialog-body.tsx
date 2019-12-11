import React, { useContext } from 'react'
import { DialogContent, DialogTitle } from '@material-ui/core'
import { NewView } from '@sensenet/controls-react'
import { DialogProps } from '@material-ui/core/Dialog'
import { useRepository } from '@sensenet/hooks-react'
import CalendarEvent from '../CalendarEvent-type'
import { SharedContext } from '../context/shared-context'

const NewDialogBody: React.FunctionComponent<{
  parentpath: string
  dialogProps: DialogProps
}> = props => {
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
          contentTypeName={CalendarEvent.name}
          path={props.parentpath}
          onSubmit={async (parentPath, content) => {
            try {
              await repo.post({
                contentType: CalendarEvent.name,
                parentPath,
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
