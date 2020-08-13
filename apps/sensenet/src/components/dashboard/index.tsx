import { useRepository } from '@sensenet/hooks-react'
import { Container, createStyles, makeStyles, Theme, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { globals } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { LearnMoreWidget } from './learn-more-widget'
import { SubscriptionWidget } from './subscription-widget'
import { DashboardData } from './types'
import { UsageWidget } from './usage-widget'
import { YourProjectWidget } from './your-project-widget'

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

export const useWidgetStyles = makeStyles((theme: Theme) => {
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

const Dashboard = () => {
  const classes = useStyles()
  const repository = useRepository()
  const [data, setData] = useState<DashboardData>()
  const localization = useLocalization().dashboard

  useEffect(() => {
    ;(async () => {
      const response = await repository.executeAction<any, DashboardData>({
        idOrPath: '/Root',
        name: 'GetDashboardData',
        method: 'GET',
        oDataOptions: {
          select: ['Plan'],
        },
      })

      setData(response)
    })()
  }, [repository])

  if (!data) return null

  return (
    <div style={{ overflow: 'auto' }}>
      <Container fixed className={classes.container}>
        <div className={classes.welcome}>
          <Typography variant="h1" className={classes.title}>
            {localization.title(data.name || data.host)}
          </Typography>
          {localization.descriptionFirstLine}
          <br />
          {localization.descriptionSecondLine}
        </div>
        <SubscriptionWidget subscription={data.subscription} version={data.version} />
        {data?.usage?.user === 1 && <YourProjectWidget />}
        <UsageWidget limitations={data.subscription.plan.limitations} used={data.usage} />
        <LearnMoreWidget />
      </Container>
    </div>
  )
}

export default Dashboard
