import { Repository } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { ActionModel, GenericContent, Settings, File as SnFile } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import React, { useEffect, useState } from 'react'
import { useLocalization } from '../../hooks'
import { getMonacoLanguage } from '../../services/content-context-service'
import { ContentBreadcrumbs } from '../ContentBreadcrumbs'
import { FullScreenLoader } from '../full-screen-loader'
import { SnMonacoEditor, SnMonacoEditorProps } from './sn-monaco-editor'

export const getMonacoModelUri = async (content: GenericContent, repo: Repository, action?: ActionModel) => {
  const { monaco } = await import('react-monaco-editor')

  if (repo.schemas.isContentFromType<Settings>(content, 'Settings') || content.Type === 'PersonalSettings') {
    return monaco.Uri.parse(`sensenet://${content.Type}/${content.Name}`)
  }
  if (repo.schemas.isContentFromType<SnFile>(content, 'File')) {
    if (content.Binary) {
      return monaco.Uri.parse(`sensenet://${content.Type}/${content.Binary.__mediaresource.content_type}`)
    }
  }

  if (action) {
    return monaco.Uri.parse(`sensenet://${content.Type}/${action.Url}`)
  }

  return monaco.Uri.parse(`sensenet://${content.Type}`)
}

export type TextEditorProps = Pick<SnMonacoEditorProps, 'additionalButtons' | 'handleCancel'> & {
  content: SnFile
  loadContent?: (content: SnFile) => Promise<string>
  saveContent?: (content: SnFile, value: string) => Promise<void>
  showBreadCrumb: boolean
}

export const TextEditor: React.FunctionComponent<TextEditorProps> = (props) => {
  const repo = useRepository()
  const [textValue, setTextValue] = useState('')
  const [savedTextValue, setSavedTextValue] = useState('')
  const [language, setLanguage] = useState(getMonacoLanguage(props.content, repo))
  const localization = useLocalization()
  const [uri, setUri] = useState<import('react-monaco-editor').monaco.Uri>()
  const [hasChanges, setHasChanges] = useState(false)
  const logger = useLogger('TextEditor')
  const [error, setError] = useState<Error | undefined>()

  const saveContent = async () => {
    try {
      setHasChanges(false)
      if (props.saveContent) {
        await props.saveContent(props.content, textValue)
      } else {
        await repo.upload.textAsFile({
          text: textValue,
          parentPath: PathHelper.getParentPath(props.content.Path),
          fileName: props.content.Name,
          overwrite: true,
          contentTypeName: props.content.Type,
          binaryPropertyName: 'Binary',
        })
      }
      logger.information({
        message: localization.textEditor.saveSuccessNotification.replace(
          '{0}',
          props.content.DisplayName || props.content.Name,
        ),
        data: {
          relatedContent: props.content,
          relatedRepository: repo.configuration.repositoryUrl,
          compare: {
            old: savedTextValue,
            new: textValue,
          },
        },
      })
      await repo.reloadSchema()
      setSavedTextValue(textValue)
    } catch (err) {
      setHasChanges(true)
      logger.error({
        message:
          err.message ||
          localization.textEditor.saveFailedNotification.replace(
            '{0}',
            props.content.DisplayName || props.content.Name,
          ),
        data: {
          error: err,
        },
      })
    }
  }

  useEffect(() => {
    setHasChanges(textValue.replace(/\r\n/g, '\n') !== savedTextValue.replace(/\r\n/g, '\n'))
  }, [textValue, savedTextValue])

  useEffect(() => {
    ;(async () => {
      setLanguage(getMonacoLanguage(props.content, repo))
      setUri(await getMonacoModelUri(props.content, repo))
    })()
  }, [props.content, repo])

  useEffect(() => {
    ;(async () => {
      try {
        if (props.loadContent) {
          const value = await props.loadContent(props.content)
          setTextValue(value)
          setSavedTextValue(value)
        } else {
          const binaryPath = props.content.Binary && props.content.Binary.__mediaresource.media_src
          if (!binaryPath) {
            return
          }
          const textFile = await repo.fetch(PathHelper.joinPaths(repo.configuration.repositoryUrl, binaryPath))
          if (textFile.ok) {
            const text = await textFile.text()
            setTextValue(text)
            setSavedTextValue(text)
          }
        }
      } catch (err) {
        setError(err)
      }
    })()
  }, [props, repo])

  if (error) {
    logger.information({
      message: localization.textEditor.saveFailedNotification,
      data: error,
    })
    return null
  }

  if (!uri) {
    return <FullScreenLoader />
  }

  return (
    <SnMonacoEditor
      language={language}
      textValue={textValue}
      preset={props.content.Path}
      setTextValue={setTextValue}
      savedTextValue={savedTextValue}
      hasChanges={hasChanges}
      uri={uri}
      handleSubmit={saveContent}
      additionalButtons={props.additionalButtons}
      handleCancel={props.handleCancel}
      renderTitle={() => (props.showBreadCrumb ? <ContentBreadcrumbs /> : <>{props.content.Name}</>)}
    />
  )
}
