import { NewView as SnNewView } from '@sensenet/controls-react'
import { GenericContent } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import React, { useCallback } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { PATHS } from '../../application-paths'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { navigateToAction } from '../../services'
import { defaultContentType } from '../edit/default-content-type'
import { NewTextFile } from '../edit/new-text-file'
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

  const loadDefaultContentType = useCallback(async () => {
    return defaultContentType
  }, [])

  if (props.contentTypeName === 'ContentType') {
    return (
      <NewTextFile
        contentTypeName={props.contentTypeName}
        routeMatch={routeMatch}
        savePath={PATHS.contentTypes.snPath}
        loadContent={loadDefaultContentType}
        getFileNameFromText={(text) => text.match(/<ContentType.*name="([^"]*)".*>/m)?.[1] || ''}
      />
    )
  } else if (props.contentTypeName === 'Resource') {
    return (
      <NewTextFile
        contentTypeName={props.contentTypeName}
        routeMatch={routeMatch}
        savePath={PATHS.localization.snPath}
        fileExtension={'.xml'}
        isFileNameEditable={true}
      />
    )
  } else if (props.contentTypeName === 'Settings') {
    return (
      <NewTextFile
        contentTypeName={props.contentTypeName}
        routeMatch={routeMatch}
        savePath={PATHS.setup.snPath}
        fileExtension={'.settings'}
        isFileNameEditable={true}
      />
    )
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
