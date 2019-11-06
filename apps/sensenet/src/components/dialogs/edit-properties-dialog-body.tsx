import React from 'react'
import { DialogContent, DialogTitle } from '@material-ui/core'
import { EditView } from '@sensenet/controls-react'
import { isExtendedError } from '@sensenet/client-core/dist/Repository/Repository'
import { DialogProps } from '@material-ui/core/Dialog'
import { GenericContent } from '@sensenet/default-content-types'
import { ConstantContent } from '@sensenet/client-core'
import { CurrentContentContext, CurrentContentProvider, useLogger, useRepository } from '@sensenet/hooks-react'
import { useLocalization, useSelectionService } from '../../hooks'

export const EditPropertiesDialogBody: React.FunctionComponent<{
  contentId: number
  dialogProps?: DialogProps
}> = props => {
  const selectionService = useSelectionService()
  const repo = useRepository()
  const localization = useLocalization().editPropertiesDialog
  const logger = useLogger('EditPropertiesDialog')

  const onSubmit = async (id: number, content: GenericContent) => {
    try {
      await repo.patch({
        idOrPath: id,
        content,
      })
      props.dialogProps && props.dialogProps.onClose && props.dialogProps.onClose(null as any, 'backdropClick')
      logger.information({
        message: localization.saveSuccessNotification.replace(
          '{0}',
          content.DisplayName || content.Name || content.DisplayName || content.Name,
        ),
        data: {
          relatedContent: content,
          content,
          relatedRepository: repo.configuration.repositoryUrl,
        },
      })
    } catch (error) {
      logger.error({
        message: localization.saveFailedNotification.replace(
          '{0}',
          content.DisplayName || content.Name || content.DisplayName || content.Name,
        ),
        data: {
          relatedContent: content,
          content,
          relatedRepository: repo.configuration.repositoryUrl,
          error: isExtendedError(error) ? repo.getErrorFromResponse(error.response) : error,
        },
      })
    }
  }

  return (
    <CurrentContentProvider
      idOrPath={props.contentId}
      onContentLoaded={c => selectionService.activeContent.setValue(c)}
      oDataOptions={{ select: 'all' }}>
      <CurrentContentContext.Consumer>
        {content =>
          content.Id !== ConstantContent.PORTAL_ROOT.Id && (
            <>
              <DialogTitle>{localization.dialogTitle.replace('{0}', content.DisplayName || content.Name)} </DialogTitle>
              <DialogContent>
                <EditView
                  content={content}
                  repository={repo}
                  handleCancel={() =>
                    props.dialogProps &&
                    props.dialogProps.onClose &&
                    props.dialogProps.onClose(null as any, 'backdropClick')
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
