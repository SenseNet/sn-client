import Paper from '@material-ui/core/Paper'
import React, { useContext } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { ResponsiveContext } from '../../context'
import { usePersonalSettings, useTheme } from '../../hooks'
import { WidgetSection } from '../../services'
import { globals } from '../../globalStyles'
import { ErrorWidget } from './error-widget'
import { MarkdownWidget } from './markdown-widget'
import { QueryWidget } from './query-widget'
import { UpdatesWidget } from './updates-widget'

export const getWidgetComponent = (widget: WidgetSection) => {
  switch (widget.widgetType) {
    case 'markdown':
      return <MarkdownWidget {...widget} />
    case 'query':
      return <QueryWidget {...widget} />
    case 'updates':
      return <UpdatesWidget {...widget} />
    default:
      return <ErrorWidget {...widget} />
  }
}
const defaultMinWidth = 250

const Dashboard = () => {
  const match = useRouteMatch<{ dashboardName?: string }>()
  const personalSettings = usePersonalSettings()
  const widgets = match.params.dashboardName
    ? personalSettings.dashboards[match.params.dashboardName]
    : personalSettings.dashboards.repositoryDefault
  const platform = useContext(ResponsiveContext)
  const theme = useTheme()

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', height: '100%', overflow: 'auto' }}>
      {widgets.map((widget, i) => {
        const widgetComponent = getWidgetComponent(widget)
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
              backgroundColor:
                theme.palette.type === 'light' ? globals.light.drawerBackground : globals.dark.drawerBackground,
            }}>
            {widgetComponent}
          </Paper>
        )
      })}
    </div>
  )
}

export default Dashboard
