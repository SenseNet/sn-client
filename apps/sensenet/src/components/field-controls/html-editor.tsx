/**
 * @module FieldControls
 */
import { InputLabel } from '@material-ui/core'
import { changeTemplatedValue, ReactClientFieldSetting } from '@sensenet/controls-react'
import React, { useState } from 'react'
import MonacoEditor from 'react-monaco-editor'

/**
 * Field control that represents a LongText field with Html highlights. Available values will be populated from the FieldSettings.
 */
export const HtmlEditor: React.FC<ReactClientFieldSetting> = (props) => {
  // const localization = useLocalization()
  const initialState =
    props.fieldValue || (props.actionName === 'new' && changeTemplatedValue(props.settings.DefaultValue)) || ''
  const [value, setValue] = useState(initialState)

  const readonly = props.actionName === 'browse' || props.settings.ReadOnly

  return (
    <>
      {/* <Typography variant="caption" gutterBottom={true}>
        {props.settings.DisplayName}
      </Typography> */}
      <InputLabel
        style={{
          display: 'block',
          fontSize: '1.3rem',
          transformOrigin: 'top left',
        }}>
        {props.settings.DisplayName}
      </InputLabel>

      <MonacoEditor
        {...props}
        width="100%"
        height="200px"
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
      />
    </>
  )
}
