import { NewView as SnNewView } from '@sensenet/controls-react'
import { GenericContent } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import React from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { navigateToAction } from '../../services'
import { reactControlMapper } from '../react-control-mapper'
import { useViewControlStyles } from './common/styles'
import { ViewTitle } from './common/view-title'

export interface NewViewProps {
  contentTypeName: string
  currentContentPath: string
  submitCallback?: () => void // projekt szinten kapja a props-ban
}

export const NewView: React.FC<NewViewProps> = (props) => {
  const repository = useRepository()
  const controlMapper = reactControlMapper(repository)
  const classes = useViewControlStyles()
  const localization = useLocalization()
  const globalClasses = useGlobalStyles()
  const logger = useLogger('NewView')
  const history = useHistory()
  const routeMatch = useRouteMatch<{ browseType: string; action?: string }>()

  const handleSubmit = async (content: GenericContent, contentTypeName?: string) => {
    try {
      const contentType = contentTypeName || props.contentTypeName
      const created = await repository.post({
        contentType,
        parentPath: props.currentContentPath,
        content,
        contentTemplate: contentType,
      })
      logger.information({
        message: localization.addButton.contentCreatedNotification.replace('{0}', created.d.Name || created.d.Path),
        data: {
          relatedContent: created,
          relatedRepository: repository.configuration.repositoryUrl,
        },
      })
    } catch (error) {
      logger.error({
        message: localization.addButton.errorPostingContentNotification,
        data: {
          details: { error },
        },
      })
    } finally {
      props.submitCallback?.()
    }
  }

  return (
    <SnNewView
      onSubmit={handleSubmit}
      repository={repository}
      contentTypeName={props.contentTypeName}
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
      renderTitle={() => <ViewTitle title={'New'} titleBold={props.contentTypeName} />}
    />
  )
}
