import { useLogger, useRepository } from '@sensenet/hooks-react'
import { Input, InputAdornment } from '@material-ui/core'
import { Uri } from 'monaco-editor'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useLocalization } from '../../hooks'
import { getMonacoLanguage } from '../../services/content-context-service'
import { SnMonacoEditor, SnMonacoEditorProps } from './sn-monaco-editor'

export type NewFileTextEditorProps = Pick<SnMonacoEditorProps, 'handleCancel'> & {
  contentType: string
  savePath: string
  getFileName?: () => string
  loadContent?: () => Promise<string>
  getFileNameFromText?: (text: string) => string
  fileName: string
  setFileName?: Dispatch<SetStateAction<string>>
  fileNamePostfix?: string
  saveCallback?: Function
}

export const NewFileTextEditor: React.FunctionComponent<NewFileTextEditorProps> = (props) => {
  const repo = useRepository()
  const [textValue, setTextValue] = useState('')
  const [savedTextValue, setSavedTextValue] = useState('')
  const [language, setLanguage] = useState(getMonacoLanguage({ Type: props.contentType } as any, repo))
  const localization = useLocalization()
  const uri = Uri.parse(`sensenet://${props.contentType}`)
  const [hasChanges, setHasChanges] = useState(false)
  const logger = useLogger('TextEditor')
  const [error, setError] = useState<Error | undefined>()
  const { loadContent } = props

  const saveContent = async () => {
    const fileName = props.getFileNameFromText?.(textValue) ?? props.fileName
    try {
      setHasChanges(false)
      await repo.upload.textAsFile({
        text: textValue,
        parentPath: props.savePath,
        fileName: `${fileName}${props.fileNamePostfix ?? ''}`,
        overwrite: false,
        contentTypeName: props.contentType,
        binaryPropertyName: 'Binary',
      })
      logger.information({
        message: localization.textEditor.saveSuccessNotification.replace('{0}', fileName),
        data: {
          relatedRepository: repo.configuration.repositoryUrl,
          compare: {
            old: savedTextValue,
            new: textValue,
          },
        },
      })
      await repo.reloadSchema()
      setSavedTextValue(textValue)
      props.saveCallback?.()
    } catch (err) {
      setHasChanges(true)
      logger.error({
        message: localization.textEditor.saveFailedNotification.replace('{0}', fileName),
        data: {
          details: { error: err },
        },
      })
    }
  }

  useEffect(() => {
    setHasChanges(textValue !== savedTextValue)
  }, [textValue, savedTextValue])

  useEffect(() => {
    setLanguage(getMonacoLanguage({ Type: props.contentType } as any, repo))
  }, [props.contentType, repo])

  useEffect(() => {
    ;(async () => {
      try {
        if (loadContent) {
          const value = await loadContent()
          setTextValue(value)
          setSavedTextValue(value)
        }
      } catch (err) {
        setError(err)
      }
    })()
  }, [loadContent])

  if (error) {
    logger.information({
      message: localization.textEditor.saveFailedNotification,
      data: error,
    })
    return null
  }

  return (
    <SnMonacoEditor
      language={language}
      textValue={textValue}
      setTextValue={setTextValue}
      savedTextValue={savedTextValue}
      hasChanges={hasChanges}
      uri={uri}
      handleSubmit={saveContent}
      handleCancel={props.handleCancel}
      renderTitle={() =>
        props.setFileName ? (
          <Input
            required={true}
            name={props.contentType}
            // fullWidth={true}
            type="text"
            value={props.fileName}
            onChange={(ev) => {
              props.setFileName!(ev.target.value)
            }}
            endAdornment={
              props.fileNamePostfix ? (
                <InputAdornment position="end">{props.fileNamePostfix}</InputAdornment>
              ) : undefined
            }
          />
        ) : (
          <>New {props.contentType}</>
        )
      }
    />
  )
}
