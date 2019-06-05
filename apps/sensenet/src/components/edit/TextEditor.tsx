import Button from '@material-ui/core/Button'
import { PathHelper } from '@sensenet/client-utils'
import { ActionModel, File as SnFile, GenericContent, Settings } from '@sensenet/default-content-types'
import { Uri } from 'monaco-editor'
import React, { useContext, useEffect, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import { Prompt } from 'react-router'
import { ResponsiveContext } from '../../context'
import { useContentRouting, useLocalization, useLogger, useRepository, useTheme } from '../../hooks'
import { isContentFromType } from '../../utils/isContentFromType'
import { ContentBreadcrumbs } from '../ContentBreadcrumbs'

export const getMonacoModelUri = (content: GenericContent, action?: ActionModel) => {
  if (isContentFromType(content, Settings) || content.Type === 'PersonalSettings') {
    return Uri.parse(`sensenet://${content.Type}/${content.Name}`)
  }
  if (isContentFromType(content, SnFile)) {
    if (content.Binary) {
      return Uri.parse(`sensenet://${content.Type}/${content.Binary.__mediaresource.content_type}`)
    }
  }

  if (action) {
    return Uri.parse(`sensenet://${content.Type}/${action.Url}`)
  }

  return Uri.parse(`sensenet://${content.Type}`)
}

export interface TextEditorProps {
  content: SnFile
  loadContent?: (content: SnFile) => Promise<string>
  saveContent?: (content: SnFile, value: string) => Promise<void>
}

export const TextEditor: React.FunctionComponent<TextEditorProps> = props => {
  const theme = useTheme()
  const platform = useContext(ResponsiveContext)
  const repo = useRepository()

  const contentRouter = useContentRouting()

  const [textValue, setTextValue] = useState('')
  const [savedTextValue, setSavedTextValue] = useState('')
  const [language, setLanguage] = useState(contentRouter.getMonacoLanguage(props.content))
  const localization = useLocalization().textEditor
  const [uri, setUri] = useState<any>(getMonacoModelUri(props.content))
  const [hasChanges, setHasChanges] = useState(false)
  const logger = useLogger('TextEditor')

  const [error, setError] = useState<Error | undefined>()

  const saveContent = async () => {
    try {
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
        message: localization.saveSuccessNotification.replace('{0}', props.content.DisplayName || props.content.Name),
        data: {
          relatedContent: props.content,
          relatedRepository: repo.configuration.repositoryUrl,
          compare: {
            old: savedTextValue,
            new: textValue,
          },
        },
      })
      setSavedTextValue(textValue)
    } catch (error) {
      logger.error({
        message: localization.saveFailedNotification.replace('{0}', props.content.DisplayName || props.content.Name),
        data: {
          details: { error },
        },
      })
    }
  }

  useEffect(() => {
    setHasChanges(textValue !== savedTextValue)
  }, [textValue, savedTextValue])

  useEffect(() => {
    setUri(getMonacoModelUri(props.content))
    setLanguage(contentRouter.getMonacoLanguage(props.content))
  }, [props.content])

  useEffect(() => {
    setUri(getMonacoModelUri(props.content))
    setLanguage(contentRouter.getMonacoLanguage(props.content))
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
      } catch (error) {
        setError(error)
      }
    })()
  }, [props.content.Id])

  if (error) {
    throw error
  }

  return (
    <div
      style={{ width: '100%', height: '100%' }}
      onKeyDown={async ev => {
        if (ev.key.toLowerCase() === 's' && ev.ctrlKey) {
          try {
            ev.preventDefault()
            saveContent()
          } catch (error) {
            /** */
          }
        }
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <ContentBreadcrumbs />
        <div>
          <Button disabled={!hasChanges} onClick={() => setTextValue(savedTextValue)}>
            {localization.reset}
          </Button>
          <Button
            disabled={!hasChanges}
            onClick={() => {
              saveContent()
            }}>
            {localization.save}
          </Button>
        </div>
      </div>
      <Prompt when={textValue !== savedTextValue} message={localization.unsavedChangesWarning} />
      <MonacoEditor
        theme={theme.palette.type === 'dark' ? 'vs-dark' : 'vs-light'}
        width="100%"
        language={language}
        value={textValue}
        onChange={v => setTextValue(v)}
        options={{
          automaticLayout: true,
          minimap: {
            enabled: platform === 'desktop' ? true : false,
          },
        }}
        editorDidMount={(editor, monaco) => {
          if (!monaco.editor.getModel(uri)) {
            const m = monaco.editor.createModel(textValue, language, uri)
            editor.setModel(m)
          } else {
            editor.setModel(monaco.editor.getModel(uri))
          }
        }}
      />
    </div>
  )
}
