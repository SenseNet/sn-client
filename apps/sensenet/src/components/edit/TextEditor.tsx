import { Upload } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { File as SnFile } from '@sensenet/default-content-types'
import React, { useContext, useEffect, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import { InjectorContext } from '../../context/InjectorContext'
import { RepositoryContext } from '../../context/RepositoryContext'
import { ResponsiveContext } from '../../context/ResponsiveContextProvider'
import { ThemeContext } from '../../context/ThemeContext'
import { ContentContextProvider } from '../../services/ContentContextProvider'

export interface TextEditorProps {
  content: SnFile
  loadContent?: (content: SnFile) => Promise<string>
  saveContent?: (content: SnFile, value: string) => Promise<void>
}

export const TextEditor: React.FunctionComponent<TextEditorProps> = props => {
  const injector = useContext(InjectorContext)
  const contextProvider = injector.GetInstance(ContentContextProvider)
  const theme = useContext(ThemeContext)
  const platform = useContext(ResponsiveContext)

  const [textValue, setTextValue] = useState('')
  const [language, setLanguage] = useState(contextProvider.getMonacoLanguage(props.content))
  const [uri, setUri] = useState<any>(contextProvider.getMonacoModelUri(props.content))
  const repo = useContext(RepositoryContext)

  useEffect(() => {
    setUri(contextProvider.getMonacoModelUri(props.content))
    setLanguage(contextProvider.getMonacoLanguage(props.content))
    ;(async () => {
      if (props.loadContent) {
        /** */
        const value = await props.loadContent(props.content)
        setTextValue(value)
      } else {
        const binaryPath = props.content.Binary && props.content.Binary.__mediaresource.media_src
        if (!binaryPath) {
          throw Error("Content doesn't have a valid path to the binary field! ")
        }
        const textFile = await repo.fetch(PathHelper.joinPaths(repo.configuration.repositoryUrl, binaryPath))
        if (textFile.ok) {
          const text = await textFile.text()
          setTextValue(text)
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
          } catch (error) {
            /** */
          }
        }
      }}>
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
