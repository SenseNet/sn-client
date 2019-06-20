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

export const getWidgetComponent = (widget: ReturnType<typeof useWidgets>[0], repo?: Repository) => {
  switch (widget.widgetType) {
    case 'markdown':
      return <MarkdownWidget {...widget} />
    case 'query':
      if (!repo) {
        return <ErrorWidget {...widget} />
      }
      return <QueryWidget {...widget} />
    default:
      return <ErrorWidget {...widget} />
  }
}

const Dashboard: React.FunctionComponent<DashboardProps> = ({ repository }) => {
  const widgets = useWidgets(repository)

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', height: '100%', overflow: 'auto' }}>
      {widgets.map((widget, i) => {
        const widgetComponent = getWidgetComponent(widget, repository)

        return (
          <Paper
            key={i}
            style={{
              flex: 1,
              margin: '1em',
              padding: '1em',
              minWidth: widget.width || 250,
              overflow: 'hidden',
            }}>
            {widgetComponent}
          </Paper>
        )
      })}
    </div>
  )
}

export default Dashboard
