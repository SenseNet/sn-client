import { File as SnFile } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import React, { useEffect, useState } from 'react'
import { useLocalization } from '../../hooks'
import { ContentBreadcrumbs } from '../ContentBreadcrumbs'
import { FullScreenLoader } from '../full-screen-loader'
import { SnMonacoEditor, SnMonacoEditorProps } from './sn-monaco-editor'
import { getMonacoModelUri } from './text-editor'

export type TextEditorProps = Pick<SnMonacoEditorProps, 'additionalButtons' | 'handleCancel'> & {
  content: SnFile
  loadContent?: (content: SnFile) => Promise<string>
  saveContent: (value: any) => void
  showBreadCrumb: boolean
}

export const JsonEditor: React.FunctionComponent<TextEditorProps> = (props) => {
  const repo = useRepository()
  const [textValue, setTextValue] = useState('')
  const [savedTextValue, setSavedTextValue] = useState('')
  const localization = useLocalization()
  const [uri, setUri] = useState<import('react-monaco-editor').monaco.Uri>()
  const [hasChanges, setHasChanges] = useState(false)
  const logger = useLogger('JSONEditor')
  const [error, setError] = useState<Error | undefined>()

  const saveContent = () => {
    try {
      props.saveContent(JSON.parse(textValue))
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
      language={'json'}
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
