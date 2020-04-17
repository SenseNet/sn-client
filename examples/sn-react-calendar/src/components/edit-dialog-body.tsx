import { DialogContent, DialogTitle } from '@material-ui/core'
import { DialogProps } from '@material-ui/core/Dialog'
import { ConstantContent } from '@sensenet/client-core'
import { EditView } from '@sensenet/controls-react'
import { GenericContent } from '@sensenet/default-content-types'
import { CurrentContentContext, CurrentContentProvider, useRepository } from '@sensenet/hooks-react'
import React, { useContext } from 'react'
import CalendarEvent from '../CalendarEvent-type'
import { SharedContext } from '../context/shared-context'

const EditPropertiesDialogBody: React.FunctionComponent<{
  contentId: number
  dialogProps: Partial<DialogProps>
}> = (props) => {
  const repo = useRepository()
  const sharedcontext = useContext(SharedContext)

  const onSubmit = async (content: GenericContent) => {
    try {
      const response = await repo.patch({
        idOrPath: content.Id,
        content,
        oDataOptions: {
          select: 'all' as any,
        },
      })
      sharedcontext.setEvent(response.d) // Refresh the view dialog window
      sharedcontext.setRefreshcalendar(!sharedcontext.refreshcalendar) // Refresh the main calendar list
      props.dialogProps.onClose && props.dialogProps.onClose(null as any, 'backdropClick')
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  return (
    <CurrentContentProvider idOrPath={props.contentId} oDataOptions={{ select: 'all' }}>
      <CurrentContentContext.Consumer>
        {(content: CalendarEvent) =>
          content.Id !== ConstantContent.PORTAL_ROOT.Id && (
            <>
              <DialogTitle>Edit</DialogTitle>
              <DialogContent>
                <EditView
                  content={content}
                  repository={repo}
                  handleCancel={() =>
                    props.dialogProps.onClose && props.dialogProps.onClose(null as any, 'backdropClick')
                  }
                  onSubmit={onSubmit}
                />
              </DialogContent>
            </>
          )
        }
      </CurrentContentContext.Consumer>
    </CurrentContentProvider>
  )
}

export default EditPropertiesDialogBody
