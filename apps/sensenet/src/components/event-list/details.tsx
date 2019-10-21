import { LeveledLogEntry } from '@sensenet/client-utils'
import React, { useContext } from 'react'
import MonacoEditor, { MonacoDiffEditor } from 'react-monaco-editor'
import { ResponsiveContext } from '../../context'
import { useTheme } from '../../hooks'

export const EventDetails: React.FunctionComponent<{ event: LeveledLogEntry<any> }> = ({ event }) => {
  const theme = useTheme()
  const platform = useContext(ResponsiveContext)
  if (event.data.compare) {
    return (
      <MonacoDiffEditor
        options={{
          readOnly: true,
        }}
        theme={theme.palette.type === 'dark' ? 'vs-dark' : 'vs-light'}
        width="100%"
        language={event.data.language || 'json'}
        value={event.data.compare.new}
        original={event.data.compare.old}
      />
    )
  }
  return (
    <MonacoEditor
      theme={theme.palette.type === 'dark' ? 'vs-dark' : 'vs-light'}
      width="100%"
      language={event.data.language || 'json'}
      value={JSON.stringify(event.data, undefined, 4)}
      options={{
        readOnly: true,
        automaticLayout: true,
        minimap: {
          enabled: platform === 'desktop' ? true : false,
        },
      }}
    />
  )
}
