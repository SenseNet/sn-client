import { LeveledLogEntry } from '@sensenet/client-utils'
import React, { lazy, useContext } from 'react'
import { ResponsiveContext } from '../../context'
import { useTheme } from '../../hooks'
const MonacoEditor = lazy(() => import('react-monaco-editor'))
const SnMonacoDiffEditor = lazy(() => import('../editor/sn-monaco-diff-editor'))

export const EventDetails: React.FunctionComponent<{ event: LeveledLogEntry<any> }> = ({ event }) => {
  const theme = useTheme()
  const platform = useContext(ResponsiveContext)

  if (event.data.compare) {
    return (
      <SnMonacoDiffEditor
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
