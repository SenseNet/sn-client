/**
 * @module FieldControls
 */
import { Typography } from '@material-ui/core'
import { deepMerge } from '@sensenet/client-utils'
import { LongTextFieldSetting } from '@sensenet/default-content-types'
import React, { useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import { changeTemplatedValue } from '../helpers'
import { ReactClientFieldSetting } from './client-field-setting'
import { defaultLocalization } from './localization'

/**
 * Field control that represents a LongText field. Available values will be populated from the FieldSettings.
 */
export const HtmlEditor: React.FC<ReactClientFieldSetting<LongTextFieldSetting>> = (props) => {
  const localization = deepMerge(defaultLocalization.htmleditor, props.localization?.htmleditor)

  /*?.replace(/<[^>]*>/g, '') for taking tags from value*/
  const initialState =
    props.fieldValue || (props.actionName === 'new' && changeTemplatedValue(props.settings.DefaultValue)) || ''
  const [value, setValue] = useState(initialState)

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  //   setValue(event.target.value)
  //   props.fieldOnChange?.(props.settings.Name, event.target.value)
  // }

  switch (props.actionName) {
    case 'edit':
    case 'new':
      return (
        <>
          <div>Monaco Editor</div>
          <MonacoEditor
            height="400px"
            width="100%"
            value={value}
            onChange={(v) => setValue(v)}
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
              readOnly: false,
              cursorStyle: 'line',
              automaticLayout: true,
              // automaticLayout: true,
              // readOnly: props.settings.ReadOnly,
              // lineNumbers: 'on',
              // glyphMargin: false,
              // folding: false,
              language: 'html',
            }}
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
        </>
      )
    case 'browse':
    default:
      return (
        <div>
          <Typography variant="caption" gutterBottom={true}>
            {props.settings.DisplayName}
          </Typography>
          <Typography component="div" variant="body1" gutterBottom={true}>
            {props.fieldValue || localization.noValue}
          </Typography>
        </div>
      )
  }
}
