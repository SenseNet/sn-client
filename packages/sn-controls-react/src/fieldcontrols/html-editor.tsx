/**
 * @module FieldControls
 */
import { InputLabel, Theme } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'

import { changeTemplatedValue } from '../helpers'
import { ReactClientFieldSetting } from './client-field-setting'

/**
 * Field control that represents a LongText field. Available values will be populated from the FieldSettings.
 */
export const HtmlEditor: React.FC<
  ReactClientFieldSetting & {
    theme?: Theme
    setValue?: (value: string) => void
  }
> = (props) => {
  const initialState =
    props.fieldValue || (props.actionName === 'new' && changeTemplatedValue(props.settings.DefaultValue)) || ''
  const [value, setValue] = useState(initialState)

  const editorRef = useRef<MonacoEditor>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editorRef.current) {
      return
    }
    editorRef.current.editor!.onDidContentSizeChange(() => {
      const contentHeight = editorRef?.current?.editor?.getContentHeight()

      containerRef.current!.style.height = `${contentHeight}px`
    })
  }, [editorRef])
  const readonly = props.actionName === 'browse' || props.settings.ReadOnly

  const editorChangeHandler = (newValue: string) => {
    setValue(newValue)
    props.fieldOnChange?.(props.settings.Name, newValue)
  }

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
          onChange={editorChangeHandler}
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
          theme={props.theme?.palette.type === 'dark' ? 'admin-ui-dark' : 'vs-light'}
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
