/**
 * @module FieldControls
 */
import { Box, InputLabel, Typography, useTheme } from '@material-ui/core'
import { changeTemplatedValue, ReactClientFieldSetting } from '@sensenet/controls-react'
import React, { useEffect, useRef, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'

/**
 * Field control that represents a LongText field with Html highlights. Available values will be populated from the FieldSettings.
 */
export const HtmlEditor: React.FC<ReactClientFieldSetting> = (props) => {
  // const localization = useLocalization()
  const initialState =
    props.fieldValue || (props.actionName === 'new' && changeTemplatedValue(props.settings.DefaultValue)) || ''
  const [value, setValue] = useState(initialState)
  const theme = useTheme()

  const readonly = props.actionName === 'browse' || props.settings.ReadOnly

  const editorRef = useRef<MonacoEditor>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log({ editorRef, containerRef })

    if (!editorRef.current) {
      return
    }
    editorRef.current.editor!.onDidContentSizeChange(() => {
      const contentHeight = editorRef?.current?.editor?.getContentHeight()

      console.log('contentHeight', contentHeight)

      containerRef.current!.style.height = `${contentHeight}px`
    })
  }, [editorRef, containerRef, value])

  return (
    <>
      <InputLabel shrink>{props.settings.DisplayName}</InputLabel>

      <div style={{ maxHeight: '68vh', margin: '0.5rem 0' }} ref={containerRef} data-test="html-editor-container">
        <MonacoEditor
          ref={editorRef}
          {...props}
          width="100%"
          height="100%"
          value={value}
          onChange={(v) => {
            setValue(v)
            props.fieldOnChange?.(props.settings.Name, v)
          }}
          options={{
            automaticLayout: true,
            contextmenu: true,
            hideCursorInOverviewRuler: true,
            lineNumbers: 'on',
            selectOnLineNumbers: true,
            scrollBeyondLastLine: false,
            minimap: {
              enabled: true,
            },
            roundedSelection: false,
            readOnly: readonly,
            cursorStyle: 'line',
            scrollbar: {
              horizontalSliderSize: 4,
              verticalScrollbarSize: 6,
              // vertical: 'hidden',
            },

            wordWrap: 'on',
            autoIndent: 'advanced',
            matchBrackets: 'always',
            language: 'html',
            suggest: {
              snippetsPreventQuickSuggestions: false,
              showProperties: true,
              showKeywords: true,
              showWords: true,
            },
          }}
          theme={theme.palette.type === 'dark' ? 'admin-ui-dark' : 'vs-light'}
          editorWillMount={(monaco) => {
            monaco.editor.defineTheme('admin-ui-dark', {
              base: 'vs-dark',
              inherit: true,
              rules: [],
              colors: {
                'editor.background': '#121212',
              },
            })
          }}
        />
      </div>
    </>
  )
}
