/**
 * @module FieldControls
 */
import { Typography } from '@material-ui/core'
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
      <Typography variant="caption" gutterBottom={true}>
        {props.settings.DisplayName}
      </Typography>
      <MonacoEditor
        {...props}
        height="200px"
        width="100%"
        value={value}
        onChange={(v) => {
          setValue(v)
          props.fieldOnChange?.(props.settings.Name, v)
        }}
        options={{
          contextmenu: true,
          hideCursorInOverviewRuler: true,
          matchBrackets: 'always',
          minimap: {
            enabled: true,
          },
          scrollbar: {
            horizontalSliderSize: 4,
            verticalSliderSize: 18,
          },
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: readonly,
          cursorStyle: 'line',
          automaticLayout: true,
          lineNumbers: 'on',
          language: 'html',
        }}
      />
    </>
  )
}
