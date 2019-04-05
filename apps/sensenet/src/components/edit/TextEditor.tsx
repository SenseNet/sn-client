import Button from '@material-ui/core/Button'
import { Upload } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { File as SnFile, GenericContent, Settings } from '@sensenet/default-content-types'
import { Uri } from 'monaco-editor'
import React, { useContext, useEffect, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import { Prompt } from 'react-router'
import {
  ContentRoutingContext,
  LocalizationContext,
  RepositoryContext,
  ResponsiveContext,
  ThemeContext,
} from '../../context'
import { isContentFromType } from '../../utils/isContentFromType'
import { ContentBreadcrumbs } from '../ContentBreadcrumbs'

const getMonacoModelUri = (content: GenericContent) => {
  if (isContentFromType(content, Settings)) {
    return Uri.parse(`sensenet://${content.Type}/${content.Name}`)
  }
  if (isContentFromType(content, SnFile)) {
    if (content.Binary) {
      return Uri.parse(`sensenet://${content.Type}/${content.Binary.__mediaresource.content_type}`)
    }
  }
  return Uri.parse(`sensenet://${content.Type}`)
}

export interface TextEditorProps {
  content: SnFile
  loadContent?: (content: SnFile) => Promise<string>
  saveContent?: (content: SnFile, value: string) => Promise<void>
}

export const TextEditor: React.FunctionComponent<TextEditorProps> = props => {
  const theme = useContext(ThemeContext)
  const platform = useContext(ResponsiveContext)
  const repo = useContext(RepositoryContext)

  const ctx = useContext(ContentRoutingContext)

  const [textValue, setTextValue] = useState('')
  const [savedTextValue, setSavedTextValue] = useState('')
  const [language, setLanguage] = useState(ctx.getMonacoLanguage(props.content))
  const localization = useContext(LocalizationContext).values.textEditor
  const [uri, setUri] = useState<any>(getMonacoModelUri(props.content))
  const [hasChanges, setHasChanges] = useState(false)

  const saveContent = async () => {
    if (props.saveContent) {
      await props.saveContent(props.content, textValue)
    } else {
      await Upload.textAsFile({
        text: textValue,
        parentPath: PathHelper.getParentPath(props.content.Path),
        fileName: props.content.Name,
        overwrite: true,
        repository: repo,
        contentTypeName: props.content.Type,
        binaryPropertyName: 'Binary',
      })
    }
    setSavedTextValue(textValue)
  }

  useEffect(() => {
    setHasChanges(textValue !== savedTextValue)
  }, [textValue, savedTextValue])

  useEffect(() => {
    setUri(getMonacoModelUri(props.content))
    setLanguage(ctx.getMonacoLanguage(props.content))
  }, [props.content])

  useEffect(() => {
    setUri(getMonacoModelUri(props.content))
    setLanguage(ctx.getMonacoLanguage(props.content))
    ;(async () => {
      if (props.loadContent) {
        const value = await props.loadContent(props.content)
        setTextValue(value)
        setSavedTextValue(value)
      } else {
        const binaryPath = props.content.Binary && props.content.Binary.__mediaresource.media_src
        if (!binaryPath) {
          throw Error("Content doesn't have a valid path to the binary field! ")
        }
        const textFile = await repo.fetch(PathHelper.joinPaths(repo.configuration.repositoryUrl, binaryPath))
        if (textFile.ok) {
          const text = await textFile.text()
          setTextValue(text)
          setSavedTextValue(text)
        }
      }
    })()
  }, [props.content.Id])

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
