import Paper from '@material-ui/core/Paper'
import { Repository } from '@sensenet/client-core'
import React, { useContext, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { ResponsiveContext } from '../../context'
import { useWidgets } from '../../hooks'
import { ErrorWidget } from './error-widget'
import { MarkdownWidget } from './markdown-widget'
import { QueryWidget } from './query-widget'
import { UpdatesWidget } from './updates-widget'

export const getWidgetComponent = (widget: ReturnType<typeof useWidgets>[0], repo?: Repository) => {
  switch (widget.widgetType) {
    case 'markdown':
      return <MarkdownWidget {...widget} />
    case 'query':
      if (!repo) {
        return <ErrorWidget {...widget} />
      }
      return <QueryWidget {...widget} />
    case 'updates':
      if (!repo) {
        return <ErrorWidget {...widget} />
      }
      return <UpdatesWidget {...widget} />
    default:
      return <ErrorWidget {...widget} />
  }
}

const Dashboard = ({ repository }: { repository?: Repository }) => {
  const match = useRouteMatch<{ dashboardName?: string }>()
  const widgets = useWidgets(repository, match.params.dashboardName)
  const platform = useContext(ResponsiveContext)
  const [defaultMinWidth] = useState(250)

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', height: '100%', overflow: 'auto' }}>
      {widgets.map((widget, i) => {
        const widgetComponent = getWidgetComponent(widget, repository)
        const width = widget.minWidth
          ? widget.minWidth[platform] || widget.minWidth.default || defaultMinWidth
          : defaultMinWidth

        return (
          <Paper
            key={i}
            style={{
              flex: 1,
              margin: '0.6em',
              padding: '1em',
              minWidth: width === '100%' ? 'calc(100% - 2em)' : width,
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
