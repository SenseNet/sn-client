// import { InputLabel, Theme } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'

/**
 * Field control that represents a HTMLEDITOr.
 */
export const HtmlEditor: React.FC<{
  initialState?: string
  fieldOnChange?: (value: string) => void
}> = (props) => {
  const [value, setValue] = useState(props.initialState)

  const editorRef = useRef<MonacoEditor>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editorRef.current) {
      return
    }
    editorRef.current.editor!.onDidContentSizeChange(() => {
      containerRef.current!.style.height = `${400}px`
    })
  }, [editorRef])

  const editorChangeHandler = (newValue: string) => {
    setValue(newValue)
    props.fieldOnChange?.(newValue)
  }

  return (
    <div style={{ height: '400px', margin: '0.5rem 0' }} ref={containerRef} data-test="html-editor-container">
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
        // theme={props.theme?.palette.type === 'dark' ? 'admin-ui-dark' : 'vs-light'}
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
  )
}
