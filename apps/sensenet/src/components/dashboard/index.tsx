import Paper from '@material-ui/core/Paper'
import React from 'react'
import { Repository } from '@sensenet/client-core'
import { useWidgets } from '../../hooks'
import { ErrorWidget } from './error-widget'
import { QueryWidget } from './query-widget'
import { MarkdownWidget } from './markdown-widget'

export interface DashboardProps {
  repository?: Repository
}

const Dashboard: React.FunctionComponent<DashboardProps> = ({ repository }) => {
  const widgets = useWidgets(repository).map(widget => {
    switch (widget.widgetType) {
      case 'markdown':
        return <MarkdownWidget {...widget} />
      case 'query':
        return <QueryWidget {...widget} />
      default:
        return <ErrorWidget {...widget} />
    }
  })

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {widgets.map((widget, i) => (
        <Paper key={i} style={{ flex: 1, margin: '1em', padding: '1em', minWidth: 250, overflow: 'hidden' }}>
          {widget}
        </Paper>
      ))}
    </div>
  )
}

export default Dashboard
