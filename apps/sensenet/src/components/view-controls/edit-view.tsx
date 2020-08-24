/**
 * @module ViewControls
 */
import { isExtendedError } from '@sensenet/client-core'
import { EditView as SnEditView } from '@sensenet/controls-react'
import { GenericContent } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import React, { ReactElement, useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization, useSelectionService } from '../../hooks'
import { navigateToAction } from '../../services'
import { ActionNameType, reactControlMapper } from '../react-control-mapper'
import { useViewControlStyles } from './common/styles'
import { ViewTitle } from './common/view-title'

export interface EditViewProps {
  renderIcon?: (name: string) => ReactElement
  handleCancel?: () => void
  submitCallback?: () => void
  actionName?: ActionNameType
  isFullPage?: boolean
  contentPath: string
}

export const EditView: React.FC<EditViewProps> = (props) => {
  const repository = useRepository()
  const selectionService = useSelectionService()
  const [content, setContent] = useState<GenericContent>()
  const controlMapper = reactControlMapper(repository)
  const classes = useViewControlStyles()
  const globalClasses = useGlobalStyles()
  const localization = useLocalization()
  const logger = useLogger('EditView')
  const history = useHistory()
  const routeMatch = useRouteMatch<{ browseType: string; action?: string }>()

  useEffect(() => {
    async function getExpandedContent() {
      const expanedContentResponse = await repository.load({
        idOrPath: props.contentPath,
        oDataOptions: {
          select: 'all',
          expand: ['Manager', 'FollowedWorkspaces', 'ModifiedBy'] as any,
        },
      })
      setContent(expanedContentResponse.d)
      selectionService.activeContent.setValue(expanedContentResponse.d)
    }
    getExpandedContent()
  }, [repository, props.contentPath, selectionService.activeContent])

  if (content === undefined) {
    return null
  } else {
    const handleSubmit = async (saveableFields: GenericContent) => {
      try {
        const response = repository.patch({
          idOrPath: content.Id,
          content: saveableFields,
        })
        logger.information({
          message: localization.editPropertiesDialog.saveSuccessNotification.replace(
            '{0}',
            saveableFields.DisplayName || saveableFields.Name || content.DisplayName || content.Name,
          ),
          data: {
            relatedContent: content,
            content: response,
            relatedRepository: repository.configuration.repositoryUrl,
          },
        })
      } catch (error) {
        logger.error({
          message: localization.editPropertiesDialog.saveFailedNotification.replace(
            '{0}',
            saveableFields.DisplayName || saveableFields.Name || content.DisplayName || content.Name,
          ),
          data: {
            relatedContent: content,
            content,
            relatedRepository: repository.configuration.repositoryUrl,
            error: isExtendedError(error) ? repository.getErrorFromResponse(error.response) : error,
          },
        })
      } finally {
        props.submitCallback?.()
      }
    }

    return (
      <SnEditView
        actionName={props.actionName}
        content={content}
        onSubmit={handleSubmit}
        repository={repository}
        contentTypeName={content.Type}
        handleCancel={() => navigateToAction({ history, routeMatch })}
        showTitle={true}
        uploadFolderpath="/Root/Content/demoavatars"
        controlMapper={controlMapper}
        localization={{ submit: localization.forms.submit, cancel: localization.forms.cancel }}
        classes={{
          grid: classes.grid,
          fieldWrapper: classes.fieldWrapper,
          field: classes.field,
          fieldFullWidth: classes.fieldFullWidth,
          actionButtonWrapper: classes.actionButtonWrapper,
          cancel: globalClasses.cancelButton,
        }}
        renderTitle={() => (
          <ViewTitle
            title={props.actionName === 'browse' ? 'Info about' : 'Edit'}
            titleBold={content?.DisplayName}
            content={content}
          />
        )}
      />
    )
  }
}
