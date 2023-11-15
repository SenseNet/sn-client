/**
 * @module FieldControls
 */
import { ReactClientFieldSetting, RichTextEditor as SnRichTextEditor } from '@sensenet/controls-react'
import React, { useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import { useLocalization } from '../../hooks'

/**
 * Field control that represents a RichText field. Available values will be populated from the FieldSettings.
 */
export const HtmlEditor: React.FC<ReactClientFieldSetting> = (props) => {
  // const localization = useLocalization()
  const [value, setValue] = useState(props.fieldValue || '')

  return (
    <>
      <div>Monaco Editor in sn</div>
      <MonacoEditor
        {...props}
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
          language: 'javascript',
        }}
      />
    </>
  )
}
