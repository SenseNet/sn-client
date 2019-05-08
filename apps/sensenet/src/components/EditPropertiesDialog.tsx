import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { isExtendedError } from '@sensenet/client-core/dist/Repository/Repository'
import { EditView } from '@sensenet/controls-react'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useContext } from 'react'
import { LocalizationContext, RepositoryContext } from '../context'
import { LoggerContext } from '../context/LoggerContext'

export const EditPropertiesDialog: React.FunctionComponent<{
  dialogProps: DialogProps
  content: GenericContent
}> = props => {
  const repo = useContext(RepositoryContext)
  const localization = useContext(LocalizationContext).values.editPropertiesDialog
  const logger = useContext(LoggerContext).withScope('EditPropertiesDialog')

  return (
    <Dialog {...props.dialogProps}>
      <DialogTitle>
        {localization.dialogTitle.replace('{0}', props.content.DisplayName || props.content.Name)}{' '}
      </DialogTitle>
      <DialogContent>
        <EditView
          schema={repo.schemas.getSchemaByName(props.content.Type)}
          content={props.content}
          repository={repo}
          contentTypeName={props.content.Type}
          handleCancel={() => props.dialogProps.onClose && props.dialogProps.onClose(null as any)}
          onSubmit={async (id, content) => {
            try {
              await repo.patch({
                idOrPath: id,
                content,
              })
              props.dialogProps.onClose && props.dialogProps.onClose(null as any)
              logger.information({
                message: localization.saveSuccessNotification.replace('{0}', content.DisplayName || content.Name),
                data: {
                  relatedContent: content,
                  relatedRepository: repo.configuration.repositoryUrl,
                },
              })
            } catch (error) {
              logger.error({
                message: localization.saveFailedNotification.replace(
                  '{0}',
                  content.DisplayName || content.Name || props.content.DisplayName || props.content.Name,
                ),
                data: {
                  relatedContent: props.content,
                  content,
                  relatedRepository: repo.configuration.repositoryUrl,
                  error: isExtendedError(error) ? repo.getErrorFromResponse(error.response) : error,
                },
              })
            }
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
