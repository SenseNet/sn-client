import React from 'react'
import { DialogContent, DialogTitle } from '@material-ui/core'
import { EditView } from '@sensenet/controls-react'
import { GenericContent } from '@sensenet/default-content-types'
import { ConstantContent, isExtendedError } from '@sensenet/client-core'
import { CurrentContentContext, CurrentContentProvider, useLogger, useRepository } from '@sensenet/hooks-react'
import { useLocalization, useSelectionService } from '../../hooks'
import { useDialog } from '.'

export type EditPropertiesProps = {
  contentId: number
}

export const EditProperties: React.FunctionComponent<EditPropertiesProps> = props => {
  const selectionService = useSelectionService()
  const { closeLastDialog } = useDialog()
  const repo = useRepository()
  const localization = useLocalization().editPropertiesDialog
  const logger = useLogger('EditPropertiesDialog')

  const onSubmit = async (content: GenericContent, saveableFields: Partial<GenericContent>) => {
    try {
      await repo.patch({
        idOrPath: content.Id,
        content: saveableFields,
      })
      closeLastDialog()
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
                  handleCancel={() => closeLastDialog()}
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
