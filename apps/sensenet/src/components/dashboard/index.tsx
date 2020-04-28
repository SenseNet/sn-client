import { Container, createStyles, makeStyles, Theme, Typography } from '@material-ui/core'
import React, { useContext } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { ResponsiveContext } from '../../context'
import { usePersonalSettings } from '../../hooks'
import { WidgetSection } from '../../services'
import { globals } from '../../globalStyles'
import { ErrorWidget } from './error-widget'
import { UsageWidget } from './usage-widget'
import { LearnMoreWidget } from './learn-more-widget'
import { MarkdownWidget } from './markdown-widget'
import { QueryWidget } from './query-widget'
import { UpdatesWidget } from './updates-widget'
import { SubscriptionWidget } from './subsciption-widget'

const useStyles = makeStyles(() => {
  return createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      width: '100%',
      height: '100%',
    },
    welcome: {
      flex: '1 1 0',
      textAlign: 'center',
      padding: '3rem 0',
    },
    title: {
      fontSize: '34px',
      fontWeight: 500,
      marginBottom: '20px',
    },
  })
})

const useWidgetStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      marginBottom: '2rem',
      width: '100%',
    },
    title: {
      marginBottom: '1rem',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      fontSize: '20px',
      fontWeight: 500,
    },
    container: {
      padding: '1.5rem',
      backgroundColor: theme.palette.type === 'light' ? globals.light.drawerBackground : globals.dark.drawerBackground,
      border: theme.palette.type === 'light' ? '1px solid #E2E2E2' : 0,
    },
    subtitle: {
      fontSize: '20px',
      fontWeight: 500,
      marginTop: 0,
    },
  })
})

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
  const classes = useStyles()
  const widgetClasses = useWidgetStyles()

  return (
    <div style={{ overflow: 'auto' }}>
      <Container fixed className={classes.container}>
        <div className={classes.welcome}>
          <Typography variant="h1" className={classes.title}>
            Welcome to your Example project
          </Typography>
          Here you can Explore the Admin UI with sample content
          <br />
          Feel free to look around!
        </div>
        <SubscriptionWidget classes={widgetClasses} />
        <UsageWidget classes={widgetClasses} />
        <LearnMoreWidget classes={widgetClasses} />

        {widgets.map((widget, i) => {
          widget.classes = widgetClasses
          const widgetComponent = getWidgetComponent(widget)
          const width = widget.minWidth
            ? widget.minWidth[platform] || widget.minWidth.default || defaultMinWidth
            : defaultMinWidth

          return (
            <div
              key={i}
              style={{
                flex: 1,
                minWidth: width,
                marginRight: width === '100%' ? 0 : '0.6rem',
                overflow: 'hidden',
              }}>
              {widgetComponent}
            </div>
          )
        })}
      </Container>
    </div>
  )
}

export default Dashboard
